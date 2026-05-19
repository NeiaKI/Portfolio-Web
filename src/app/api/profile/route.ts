import { NextResponse } from "next/server";
import type { Profile } from "@/types/database";

export const revalidate = 300; // 5 menit

const FALLBACK_PROFILE: Profile = {
  id: "00000000-0000-0000-0000-000000000000",
  full_name: "Febiyanto Rizki Qurbandi",
  username: "neki",
  avatar_url: null,
  bio: "A passionate software engineer and 3D artist based in Indonesia. I love building things on the web, crafting 3D assets, and tinkering with Linux.",
  tagline: "Software Engineer · 3D Artist · Linux Enthusiast",
  cv_url: null,
  social_links: {},
  is_open_to_work: true,
  updated_at: new Date(0).toISOString(),
};

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ ...FALLBACK_PROFILE, configured: false });
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ ...FALLBACK_PROFILE, configured: false });
    }

    return NextResponse.json({ ...(data as Profile), configured: true });
  } catch {
    return NextResponse.json({ ...FALLBACK_PROFILE, configured: false });
  }
}
