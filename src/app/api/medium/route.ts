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
  const text = html
    .replace(/<[^>]+>/g, "")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 220 ? text.slice(0, 220) + "…" : text;
}

/** Pull the first <img src="..."> out of HTML content */
function extractFirstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ?? null;
}

const MOCK_ARTICLES = [
  {
    id: 1,
    title: "Membangun Portfolio 3D dengan Three.js dan React",
    description:
      "Bagaimana saya mengintegrasikan tampilan 3D interaktif ke dalam portfolio menggunakan React Three Fiber dan Drei. Mencakup setup scene, lighting, dan GLTF asset loading.",
    url: `https://medium.com/@${MEDIUM_USERNAME}`,
    published_at: "2026-03-20T00:00:00Z",
    cover_image:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&q=80",
    tags: ["threejs", "react", "3d"],
  },
  {
    id: 2,
    title: "Kenapa Saya Beralih ke Bun sebagai JavaScript Runtime",
    description:
      "Setelah bertahun-tahun menggunakan npm dan pnpm, saya membuat keputusan untuk beralih ke Bun. Inilah perbandingan performa, fitur, dan pengalaman nyata dalam production.",
    url: `https://medium.com/@${MEDIUM_USERNAME}`,
    published_at: "2026-01-05T00:00:00Z",
    cover_image:
      "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80",
    tags: ["javascript", "bun", "performance"],
  },
];

export async function GET() {
  try {
    const rssUrl = `https://medium.com/feed/@${MEDIUM_USERNAME}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&count=10`;

    const res = await fetch(apiUrl, { next: { revalidate } });
    if (!res.ok) throw new Error("rss2json fetch failed");

    const data = await res.json();
    if (data.status !== "ok" || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json(MOCK_ARTICLES);
    }

    const articles = (data.items as Rss2JsonItem[]).map((item, i) => {
      // rss2json thumbnail field, fallback to first img in content
      const coverImage =
        (item.thumbnail && item.thumbnail.startsWith("http") ? item.thumbnail : null) ??
        extractFirstImage(item.content ?? "") ??
        extractFirstImage(item.description ?? "") ??
        null;

      return {
        id: i + 1,
        title: item.title,
        description: extractExcerpt(item.content ?? item.description ?? ""),
        url: item.link,
        published_at: item.pubDate,
        cover_image: coverImage,
        tags: item.categories ?? [],
      };
    });

    return NextResponse.json(articles);
  } catch {
    return NextResponse.json(MOCK_ARTICLES);
  }
}
