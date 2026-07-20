import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const MAX_BODY_BYTES = 16 * 1024;
const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE_HEADERS });
}

async function readJsonBody(req: NextRequest): Promise<{ value: unknown; tooLarge: boolean }> {
  const reader = req.body?.getReader();
  if (!reader) return { value: null, tooLarge: false };

  const decoder = new TextDecoder();
  let text = "";
  let bytesRead = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      bytesRead += value.byteLength;
      if (bytesRead > MAX_BODY_BYTES) {
        await reader.cancel().catch(() => {});
        return { value: null, tooLarge: true };
      }

      text += decoder.decode(value, { stream: true });
    }

    text += decoder.decode();
    return { value: JSON.parse(text) as unknown, tooLarge: false };
  } catch {
    return { value: null, tooLarge: false };
  }
}

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return jsonResponse({ error: "Request body is too large" }, 413);
  }

  const contentType = req.headers.get("content-type")?.split(";", 1)[0].trim();
  if (contentType !== "application/json") {
    return jsonResponse({ error: "Content-Type must be application/json" }, 415);
  }

  const ip = getClientIp(req);
  if (!rateLimit(`contact:${ip}`, 3, 15 * 60 * 1000)) {
    return jsonResponse({ error: "Too many requests. Please wait before trying again." }, 429);
  }

  const { value: body, tooLarge } = await readJsonBody(req);
  if (tooLarge) return jsonResponse({ error: "Request body is too large" }, 413);

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonResponse({ error: "Invalid body" }, 400);
  }

  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";

  if (!name || !email || !message) {
    return jsonResponse({ error: "Missing fields" }, 400);
  }

  // Length limits — mencegah oversized payload diteruskan ke Web3Forms / email
  if (name.length > 100 || email.length > 254 || message.length > 5000) {
    return jsonResponse({ error: "Input exceeds maximum length" }, 400);
  }

  // Nama masuk ke subject email; cegah control character/header injection.
  if (/[\u0000-\u001f\u007f\r\n]/u.test(name)) {
    return jsonResponse({ error: "Invalid name" }, 400);
  }

  // Basic email format validation
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return jsonResponse({ error: "Invalid email address" }, 400);
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return jsonResponse({ error: "Contact form not configured" }, 503);
  }

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        name,
        email,
        message,
        subject: `Portfolio Contact from ${name}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    const data = await res.json().catch(() => null) as { success?: unknown } | null;
    if (!res.ok || data?.success !== true) {
      return jsonResponse({ error: "Submission failed" }, 502);
    }

    return jsonResponse({ success: true });
  } catch {
    return jsonResponse({ error: "Submission failed" }, 502);
  }
}
