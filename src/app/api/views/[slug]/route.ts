import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { getPostBySlug } from "@/lib/blog";

export const dynamic = "force-dynamic";

const SLUG_RE = /^[a-z0-9-]{1,100}$/;
const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

const isConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

// Increment hanya boleh lewat service_role: RPC sudah dicabut dari anon
// (lihat migration 004), jadi penulisan view butuh admin client.
const isAdminConfigured = isConfigured && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

async function readViews(slug: string): Promise<number> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("post_views")
    .select("views")
    .eq("slug", slug)
    .single();
  const row = data as { views: number } | null;
  return row?.views ?? 0;
}

function viewsResponse(views: number, configured: boolean, status = 200) {
  return NextResponse.json(
    { views, configured },
    { status, headers: NO_STORE_HEADERS }
  );
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!SLUG_RE.test(slug)) return viewsResponse(0, false, 400);
  if (!getPostBySlug(slug)?.published) return viewsResponse(0, false, 404);
  if (!isConfigured) return viewsResponse(0, false);

  try {
    return viewsResponse(await readViews(slug), true);
  } catch {
    return viewsResponse(0, false);
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!SLUG_RE.test(slug)) return viewsResponse(0, false, 400);
  if (!getPostBySlug(slug)?.published) return viewsResponse(0, false, 404);

  // Tanpa service_role tidak bisa increment → kembalikan count saat ini saja.
  if (!isAdminConfigured) {
    if (!isConfigured) return viewsResponse(0, false);
    try {
      return viewsResponse(await readViews(slug), true);
    } catch {
      return viewsResponse(0, false);
    }
  }

  // Rate limit: 1 increment per IP per 10 menit — mencegah view inflation.
  // Saat kena limit, kembalikan count saat ini (bukan 0) agar UI tidak reset.
  const ip = getClientIp(req);
  if (!rateLimit(`views:${ip}:${slug}`, 1, 10 * 60 * 1000)) {
    try {
      return viewsResponse(await readViews(slug), true);
    } catch {
      return viewsResponse(0, false);
    }
  }

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();

    // supabase-js's rpc() typing tidak meneruskan Functions generics di sini
    type RpcResult = { data: number | null; error: { message: string } | null };
    const { data, error } = await (supabase.rpc as unknown as (fn: string, args: Record<string, unknown>) => Promise<RpcResult>)(
      "increment_post_views",
      { post_slug: slug },
    );
    if (error) throw new Error(error.message);
    return viewsResponse(data ?? 0, true);
  } catch {
    return viewsResponse(0, false);
  }
}
