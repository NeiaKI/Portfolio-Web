import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { name, email, message } = body as { name?: string; email?: string; message?: string };
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
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
