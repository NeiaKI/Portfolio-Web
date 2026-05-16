import { NextResponse } from "next/server";

export const revalidate = 1800; // 30 minutes

const MEDIUM_USERNAME = process.env.MEDIUM_USERNAME ?? "neki";

interface MediumItem {
  title: string[];
  link: string[];
  description: string[];
  pubDate: string[];
  "content:encoded"?: string[];
}

function extractExcerpt(html: string): string {
  const text = html.replace(/<[^>]+>/g, "").replace(/&[^;]+;/g, " ").trim();
  return text.slice(0, 200) + (text.length > 200 ? "..." : "");
}

export async function GET() {
  try {
    const rssUrl = `https://medium.com/feed/@${MEDIUM_USERNAME}`;
    const rss2json = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    const res = await fetch(rss2json, { next: { revalidate } });
    if (!res.ok) throw new Error("Medium RSS fetch failed");

    const data = await res.json();

    if (data.status !== "ok") throw new Error("RSS2JSON error");

    const articles = (data.items as MediumItem[]).slice(0, 10).map((item, i) => ({
      id: i + 1,
      title: item.title,
      description: extractExcerpt((item["content:encoded"]?.[0] ?? item.description?.[0] ?? "")),
      url: item.link,
      published_at: item.pubDate,
      cover_image: null,
      tags: [],
    }));

    return NextResponse.json(articles);
  } catch {
    return NextResponse.json(
      [
        {
          id: 1,
          title: "Building a 3D Portfolio with Three.js and React",
          description: "How I integrated interactive 3D asset viewers into my portfolio using React Three Fiber and Drei.",
          url: "#",
          published_at: "2026-03-20T00:00:00Z",
          cover_image: null,
          tags: ["threejs", "react", "3d"],
        },
        {
          id: 2,
          title: "Why I Switched to Bun",
          description: "After years of npm and pnpm, I made the switch to Bun as my primary JavaScript runtime. Here's why.",
          url: "#",
          published_at: "2026-01-05T00:00:00Z",
          cover_image: null,
          tags: ["javascript", "bun", "performance"],
        },
      ],
      { status: 200 }
    );
  }
}
