import { NextResponse } from "next/server";

export const revalidate = 1800;

const MEDIUM_USERNAME = process.env.MEDIUM_USERNAME ?? "nateeki";

interface Rss2JsonItem {
  title: string;
  link: string;
  pubDate: string;
  thumbnail?: string;
  description?: string;
  content?: string;
  categories?: string[];
}

function extractExcerpt(html: string): string {
  const text = html.replace(/<[^>]+>/g, "").replace(/&[^;]+;/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 220 ? text.slice(0, 220) + "…" : text;
}

export async function GET() {
  try {
    const rssUrl = `https://medium.com/feed/@${MEDIUM_USERNAME}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=10`;

    const res = await fetch(apiUrl, { next: { revalidate } });
    if (!res.ok) throw new Error("rss2json fetch failed");

    const data = await res.json();
    if (data.status !== "ok" || !Array.isArray(data.items)) throw new Error("RSS error");

    const articles = (data.items as Rss2JsonItem[]).map((item, i) => ({
      id: i + 1,
      title: item.title,
      description: extractExcerpt(item.content ?? item.description ?? ""),
      url: item.link,
      published_at: item.pubDate,
      cover_image: item.thumbnail || null,
      tags: item.categories ?? [],
    }));

    return NextResponse.json(articles);
  } catch {
    return NextResponse.json([
      {
        id: 1,
        title: "Membangun Portfolio 3D dengan Three.js dan React",
        description: "Bagaimana saya mengintegrasikan tampilan 3D interaktif ke dalam portfolio menggunakan React Three Fiber dan Drei.",
        url: `https://medium.com/@${MEDIUM_USERNAME}`,
        published_at: "2026-03-20T00:00:00Z",
        cover_image: null,
        tags: ["threejs", "react", "3d"],
      },
      {
        id: 2,
        title: "Kenapa Saya Pindah ke Bun",
        description: "Setelah bertahun-tahun menggunakan npm dan pnpm, saya beralih ke Bun sebagai runtime JavaScript utama. Inilah alasannya.",
        url: `https://medium.com/@${MEDIUM_USERNAME}`,
        published_at: "2026-01-05T00:00:00Z",
        cover_image: null,
        tags: ["javascript", "bun", "performance"],
      },
    ]);
  }
}
