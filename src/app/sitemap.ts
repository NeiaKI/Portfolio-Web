import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getProjects } from "@/lib/data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nateeki.dev";
const LOCALES = ["en", "id"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["/", "/project", "/blog", "/certificates", "/tools", "/contact", "/donate", "/uses", "/changelog", "/privacy", "/terms"];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${BASE}/${locale}${route === "/" ? "" : route}`,
        lastModified: new Date(),
        changeFrequency: route === "/" ? "daily" : "weekly",
        priority: route === "/" ? 1 : 0.8,
      });
    }
  }

  // Blog posts
  const posts = getAllPosts();
  for (const locale of LOCALES) {
    for (const post of posts) {
      entries.push({
        url: `${BASE}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  // Projects (from Supabase, fallback to GitHub)
  try {
    const projects = await getProjects();
    for (const locale of LOCALES) {
      for (const project of projects) {
        entries.push({
          url: `${BASE}/${locale}/project/${project.slug}`,
          lastModified: new Date(project.created_at),
          changeFrequency: "monthly",
          priority: project.is_featured ? 0.9 : 0.7,
        });
      }
    }
  } catch {
    // Silent fail — kembalikan static entries saja
  }

  return entries;
}
