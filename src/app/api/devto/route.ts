import { NextResponse } from "next/server";

export const revalidate = 1800;

const DEVTO_USERNAME = process.env.DEVTO_USERNAME ?? "nateeki";

const MOCK_ARTICLES = [
  {
    id: 1,
    title: "Building a Full-Stack App with Next.js 15 and Supabase",
    description:
      "A step-by-step guide to building a production-ready full-stack app using Next.js App Router, TypeScript, Tailwind CSS, and Supabase as the backend.",
    url: "#",
    published_at: "2026-04-10T00:00:00Z",
    reading_time: 10,
    cover_image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    tags: ["nextjs", "supabase", "typescript", "webdev"],
  },
  {
    id: 2,
    title: "Hyprland + Arch Linux: My Dev Workstation Setup",
    description:
      "How I set up a minimal, fast, and beautiful development workstation on Arch Linux using Hyprland WM, Waybar, Alacritty, and custom dotfiles.",
    url: "#",
    published_at: "2026-02-28T00:00:00Z",
    reading_time: 8,
    cover_image:
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80",
    tags: ["linux", "archlinux", "hyprland", "productivity"],
  },
];

export async function GET() {
  try {
    const res = await fetch(
      `https://dev.to/api/articles?username=${DEVTO_USERNAME}&per_page=10`,
      { next: { revalidate } }
    );

    if (!res.ok) throw new Error(`Dev.to API error: ${res.status}`);

    const articles = await res.json();

    // Fall back to mocks when the user has no articles yet
    if (!Array.isArray(articles) || articles.length === 0) {
      return NextResponse.json(MOCK_ARTICLES);
    }

    return NextResponse.json(
      articles.map((a: Record<string, unknown>) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        url: a.url,
        published_at: a.published_at,
        reading_time: a.reading_time_minutes,
        cover_image: a.cover_image,
        tags: a.tag_list,
      }))
    );
  } catch {
    return NextResponse.json(MOCK_ARTICLES);
  }
}
