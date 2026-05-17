import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured =
  !!SUPABASE_URL &&
  !!SUPABASE_KEY &&
  SUPABASE_URL !== "https://placeholder.supabase.co";

async function dbFetch(path: string, init?: RequestInit) {
  return fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_KEY!,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init?.headers,
    },
  });
}

/** GET /api/views — total view count across all pages */
export async function GET() {
  if (!isConfigured) return NextResponse.json({ total: 0 });

  try {
    const res = await dbFetch("/page_views?select=count");
    const data = (await res.json()) as Array<{ count: number }>;
    const total = Array.isArray(data)
      ? data.reduce((s, r) => s + (r.count ?? 0), 0)
      : 0;
    return NextResponse.json({ total });
  } catch {
    return NextResponse.json({ total: 0 });
  }
}

/** POST /api/views — upsert-increment count for a pathname */
export async function POST(req: NextRequest) {
  if (!isConfigured) return NextResponse.json({ count: 0 });

  const body = await req.json().catch(() => null);
  const pathname =
    typeof body?.pathname === "string" ? body.pathname.slice(0, 200) : null;
  if (!pathname)
    return NextResponse.json({ error: "Missing pathname" }, { status: 400 });

  try {
    // fetch current count
    const getRes = await dbFetch(
      `/page_views?pathname=eq.${encodeURIComponent(pathname)}&select=count`
    );
    const rows = (await getRes.json()) as Array<{ count: number }>;
    const current = rows[0]?.count ?? 0;
    const newCount = current + 1;

    // upsert
    await dbFetch("/page_views", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({
        pathname,
        count: newCount,
        updated_at: new Date().toISOString(),
      }),
    });

    return NextResponse.json({ count: newCount });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
