"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Calendar, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { PostMeta } from "@/lib/blog";

function PostSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border/40 bg-card p-5">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="flex gap-1.5 pt-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}

interface LocalBlogListProps {
  locale: string;
}

export function LocalBlogList({ locale }: LocalBlogListProps) {
  const t = useTranslations("blog");
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((d) => setPosts(Array.isArray(d) ? d : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();
  const filtered = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts;

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)}
      </div>
    );
  }

  if (posts.length === 0) {
    return <p className="py-16 text-center text-sm text-muted-foreground">{t("noPosts")}</p>;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center">
          {activeTag && (
            <button
              onClick={() => setActiveTag(null)}
              className="flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-2.5 w-2.5" /> Clear
            </button>
          )}
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors",
                activeTag === tag
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Posts */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t("noPosts")}</p>
        ) : (
          filtered.map((post) => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="group flex flex-col gap-2 rounded-xl border border-border/40 bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.date).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                {post.description}
              </p>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={cn(
                        "text-[11px] py-0 px-2",
                        activeTag === tag && "border-primary/40 bg-primary/10 text-primary"
                      )}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
