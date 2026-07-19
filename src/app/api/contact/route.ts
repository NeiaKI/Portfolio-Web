import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > 16 * 1024) {
    return NextResponse.json(
      { error: "Request body is too large" },
      { status: 413, headers: { "Cache-Control": "no-store" } }
    );
  }

  const contentType = req.headers.get("content-type")?.split(";", 1)[0].trim();
  if (contentType !== "application/json") {
    return NextResponse.json(
      { error: "Content-Type must be application/json" },
      { status: 415, headers: { "Cache-Control": "no-store" } }
    );
  }

  const ip = getClientIp(req);
  if (!rateLimit(`contact:${ip}`, 3, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      { status: 429, headers: { "Cache-Control": "no-store" } }
    );
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Length limits — mencegah oversized payload diteruskan ke Web3Forms / email
  if (name.length > 100 || email.length > 254 || message.length > 5000) {
    return NextResponse.json({ error: "Input exceeds maximum length" }, { status: 400 });
  }

  // Nama masuk ke subject email; cegah control character/header injection.
  if (/[\u0000-\u001f\u007f\r\n]/u.test(name)) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  // Basic email format validation
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return NextResponse.json({ error: "Contact form not configured" }, { status: 503 });
  }

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

  const data = await res.json().catch(() => ({ success: false })) as { success: boolean; message?: string };
  if (!data.success) {
    return NextResponse.json(
      { error: data.message ?? "Submission failed" },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
}
