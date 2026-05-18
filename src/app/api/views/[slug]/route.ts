import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const isConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
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

export async function POST(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isConfigured) return NextResponse.json({ views: 0, configured: false });

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    // Upsert — insert or increment
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any).rpc("increment_post_views", { post_slug: slug });
    return NextResponse.json({ views: data ?? 0, configured: true });
  } catch {
    return NextResponse.json({ views: 0, configured: false });
  }
}
