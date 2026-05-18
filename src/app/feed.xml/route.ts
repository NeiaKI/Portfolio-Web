import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nateeki.vercel.app";
  const posts = getAllPosts();

  const items = posts
    .map((p) => {
      const url = `${base}/en/blog/${p.slug}`;
      return `
  <item>
    <title><![CDATA[${p.title}]]></title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <description><![CDATA[${p.description}]]></description>
    <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    ${p.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("\n    ")}
  </item>`.trim();
    })
    .join("\n  ");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Febiyanto Rizki Qurbandi — Blog</title>
    <link>${base}</link>
    <description>Tulisan tentang software engineering dan Linux</description>
    <language>id</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
  ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
