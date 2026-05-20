import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const SLUG_RE = /^[a-z0-9-]{1,100}$/;

const isConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!SLUG_RE.test(slug)) return NextResponse.json({ views: 0, configured: false });
  if (!isConfigured) return NextResponse.json({ views: 0, configured: false });

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data } = await supabase
      .from("post_views")
      .select("views")
      .eq("slug", slug)
      .single();
    const row = data as { views: number } | null;
    return NextResponse.json({ views: row?.views ?? 0, configured: true });
  } catch {
    return NextResponse.json({ views: 0, configured: false });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!SLUG_RE.test(slug)) return NextResponse.json({ views: 0, configured: false });

  // Rate limit: 1 increment per IP per 10 menit — mencegah view inflation
  const ip = getClientIp(req);
  if (!rateLimit(`views:${ip}:${slug}`, 1, 10 * 60 * 1000)) {
    return NextResponse.json({ views: 0, configured: false });
  }

  if (!isConfigured) return NextResponse.json({ views: 0, configured: false });

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    // supabase/ssr's createServerClient doesn't forward Functions generics to rpc()
    type RpcResult = { data: number | null; error: { message: string } | null };
    const { data, error } = await (supabase.rpc as unknown as (fn: string, args: Record<string, unknown>) => Promise<RpcResult>)(
      "increment_post_views",
      { post_slug: slug },
    );
    if (error) throw new Error(error.message);
    return NextResponse.json({ views: data ?? 0, configured: true });
  } catch {
    return NextResponse.json({ views: 0, configured: false });
  }
}
