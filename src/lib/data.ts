import type { Project, Certificate } from "@/types/database";
import { CERTIFICATES } from "@/data/certificates";

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

async function getGithubProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${BASE}/api/github`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) return getGithubProjects();

  try {
    const { createClient } = await import("./supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? (await getGithubProjects());
  } catch {
    return getGithubProjects();
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured) {
    const projects = await getGithubProjects();
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
      const projects = await getGithubProjects();
      return projects.find((p) => p.slug === slug) ?? null;
    }
    return data;
  } catch {
    const projects = await getGithubProjects();
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
