import type { Project, Certificate } from "@/types/database";
import { MOCK_PROJECTS, MOCK_CERTIFICATES } from "./mock-data";

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder.supabase.co";

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) return MOCK_PROJECTS;

  try {
    const { createClient } = await import("./supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? MOCK_PROJECTS;
  } catch {
    return MOCK_PROJECTS;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured) {
    return MOCK_PROJECTS.find((p) => p.slug === slug) ?? null;
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
      return MOCK_PROJECTS.find((p) => p.slug === slug) ?? null;
    }
    return data;
  } catch {
    return MOCK_PROJECTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function getCertificates(): Promise<Certificate[]> {
  if (!isSupabaseConfigured) return MOCK_CERTIFICATES;

  try {
    const { createClient } = await import("./supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("issued_date", { ascending: false });

    if (error) throw error;
    return data ?? MOCK_CERTIFICATES;
  } catch {
    return MOCK_CERTIFICATES;
  }
}
