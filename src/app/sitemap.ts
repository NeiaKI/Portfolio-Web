import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nateeki.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["en", "id"];
  const staticRoutes = ["/", "/project", "/blog", "/certificates", "/contact", "/donate"];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${BASE}/${locale}${route === "/" ? "" : route}`,
        lastModified: new Date(),
        changeFrequency: route === "/" ? "daily" : "weekly",
        priority: route === "/" ? 1 : 0.8,
      });
    }
  }

  return entries;
}
