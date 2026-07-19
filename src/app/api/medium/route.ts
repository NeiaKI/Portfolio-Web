import { NextResponse } from "next/server";

export const revalidate = 300;

const MEDIUM_USERNAME = process.env.MEDIUM_USERNAME ?? "nateeki";

function extractFirstImage(html: string): string | null {
  const match = html.match(/src="(https:\/\/cdn-images[^"]+)"/i)
    ?? html.match(/<img[^>]+src="([^"]+)"/i);
  return match?.[1] ?? null;
}

function extractText(html: string): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 220 ? text.slice(0, 220) + "…" : text;
}

function getCdata(node: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?<\\/${tag}>`, "s");
  return node.match(re)?.[1]?.trim() ?? "";
}

const MOCK_ARTICLES = [
  {
    id: 1,
    title: "Membangun Portfolio 3D dengan Three.js dan React",
    description: "Bagaimana saya mengintegrasikan tampilan 3D interaktif ke dalam portfolio menggunakan React Three Fiber dan Drei.",
    url: `https://medium.com/@${MEDIUM_USERNAME}`,
    published_at: "2026-03-20T00:00:00Z",
    cover_image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&q=80",
    tags: ["threejs", "react", "3d"],
  },
  {
    id: 2,
    title: "Kenapa Saya Beralih ke Bun sebagai JavaScript Runtime",
    description: "Setelah bertahun-tahun menggunakan npm dan pnpm, saya membuat keputusan untuk beralih ke Bun.",
    url: `https://medium.com/@${MEDIUM_USERNAME}`,
    published_at: "2026-01-05T00:00:00Z",
    cover_image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80",
    tags: ["javascript", "bun", "performance"],
  },
];

export async function GET() {
  try {
    const res = await fetch(`https://medium.com/feed/@${MEDIUM_USERNAME}`, {
      next: { revalidate },
      headers: { "User-Agent": "Mozilla/5.0 (compatible; RSS reader)" },
    });
    if (!res.ok) return NextResponse.json(MOCK_ARTICLES);

    const xml = await res.text();

    // Split by <item> tags to parse each article
    const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
    if (itemMatches.length === 0) return NextResponse.json(MOCK_ARTICLES);

    const articles = itemMatches.slice(0, 10).map((item, i) => {
      const title = getCdata(item, "title");
      const link  = getCdata(item, "link") || (item.match(/<link>([^<]+)<\/link>/)?.[1] ?? "");
      const pubDate = getCdata(item, "pubDate");
      const content = getCdata(item, "content:encoded");
      const desc    = getCdata(item, "description");
      const categories = [...item.matchAll(/<category><!\[CDATA\[([^\]]+)\]\]><\/category>/g)].map(m => m[1]);

      const cover_image = extractFirstImage(content) ?? extractFirstImage(desc) ?? null;

      return {
        id: i + 1,
        title,
        description: extractText(content || desc),
        url: link,
        published_at: pubDate,
        cover_image,
        tags: categories,
      };
    });

    return NextResponse.json(articles);
  } catch {
    return NextResponse.json(MOCK_ARTICLES);
  }
}
