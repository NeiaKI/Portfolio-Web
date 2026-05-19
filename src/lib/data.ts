import type { Project, Certificate } from "@/types/database";
import { CERTIFICATES } from "@/data/certificates";
import { getGithubProjectsCached } from "@/lib/github";

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) return getGithubProjectsCached();

  try {
    const { createClient } = await import("./supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? (await getGithubProjectsCached());
  } catch {
    return getGithubProjectsCached();
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured) {
    const projects = await getGithubProjectsCached();
    return projects.find((p) => p.slug === slug) ?? null;
  }

  try {
    const { createClient } = await import("./supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      const projects = await getGithubProjectsCached();
      return projects.find((p) => p.slug === slug) ?? null;
    }
    return data;
  } catch {
    const projects = await getGithubProjectsCached();
    return projects.find((p) => p.slug === slug) ?? null;
  }
}

export async function getCertificates(): Promise<Certificate[]> {
  if (!isSupabaseConfigured) return CERTIFICATES;

  try {
    const { createClient } = await import("./supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("issued_date", { ascending: false });

    if (error) throw error;
    return data ?? CERTIFICATES;
  } catch {
    return CERTIFICATES;
  }
}
