"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

export function ViewCount({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const key = `viewed:${slug}`;
    const alreadySeen = sessionStorage.getItem(key);

    // POST to increment on first view this session, GET otherwise
    const method = alreadySeen ? "GET" : "POST";
    if (!alreadySeen) sessionStorage.setItem(key, "1");

    fetch(`/api/views/${slug}`, { method })
      .then((r) => r.json())
      .then((d: { views: number; configured: boolean }) => {
        if (d.configured) setViews(d.views);
      })
      .catch(() => {});
  }, [slug]);

  if (views === null) return null;

  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <Eye className="h-3.5 w-3.5" />
      {views.toLocaleString()} views
    </span>
  );
}
