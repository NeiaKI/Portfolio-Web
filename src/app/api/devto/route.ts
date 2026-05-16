import { NextResponse } from "next/server";

export const revalidate = 1800; // 30 minutes

const DEVTO_USERNAME = process.env.DEVTO_USERNAME ?? "neki";

export async function GET() {
  try {
    const res = await fetch(
      `https://dev.to/api/articles?username=${DEVTO_USERNAME}&per_page=10`,
      { next: { revalidate } }
    );

    if (!res.ok) throw new Error(`Dev.to API error: ${res.status}`);

    const articles = await res.json();

    const normalized = articles.map((a: Record<string, unknown>) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      url: a.url,
      published_at: a.published_at,
      reading_time: a.reading_time_minutes,
      cover_image: a.cover_image,
      tags: a.tag_list,
    }));

    return NextResponse.json(normalized);
  } catch {
    return NextResponse.json(
      [
        {
          id: 1,
          title: "Getting Started with Next.js App Router",
          description: "A deep dive into the new Next.js App Router and how it changes the way we build React applications.",
          url: "#",
          published_at: "2026-04-01T00:00:00Z",
          reading_time: 8,
          cover_image: null,
          tags: ["nextjs", "react", "webdev"],
        },
        {
          id: 2,
          title: "Arch Linux Setup for Developers",
          description: "My personal guide to setting up a productive development environment on Arch Linux with Hyprland.",
          url: "#",
          published_at: "2026-02-15T00:00:00Z",
          reading_time: 12,
          cover_image: null,
          tags: ["linux", "archlinux", "productivity"],
        },
        {
          id: 3,
          title: "TypeScript Patterns I Use Every Day",
          description: "A collection of TypeScript patterns and techniques that have made my codebase cleaner and safer.",
          url: "#",
          published_at: "2025-12-10T00:00:00Z",
          reading_time: 6,
          cover_image: null,
          tags: ["typescript", "programming", "webdev"],
        },
      ],
      { status: 200 }
    );
  }
}
