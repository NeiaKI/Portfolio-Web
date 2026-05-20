import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`contact:${ip}`, 3, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests. Please wait before trying again." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { name, email, message } = body as { name?: string; email?: string; message?: string };
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Length limits — mencegah oversized payload diteruskan ke Web3Forms / email
  if (name.trim().length > 100 || email.trim().length > 254 || message.trim().length > 5000) {
    return NextResponse.json({ error: "Input exceeds maximum length" }, { status: 400 });
  }

  // Basic email format validation
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(email.trim())) {
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
  });

  const data = await res.json() as { success: boolean; message?: string };
  if (!data.success) {
    return NextResponse.json({ error: data.message ?? "Submission failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
