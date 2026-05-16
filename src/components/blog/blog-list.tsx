"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Clock, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Article {
  id: number;
  title: string;
  description: string;
  url: string;
  published_at: string;
  reading_time?: number;
  cover_image: string | null;
  tags: string[];
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ArticleCard({ article }: { article: Article }) {
  const t = useTranslations("blog");

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-sm"
    >
      {/* Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden bg-muted/40 shrink-0">
        {article.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover_image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-14 w-14 text-muted-foreground/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
          {article.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(article.published_at)}
            </span>
            {article.reading_time && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.reading_time} min
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
            {t("readMore")}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
}

function ArticleSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="flex flex-col gap-2.5 p-4">
        <div className="flex gap-1">
          <Skeleton className="h-4 w-12 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between pt-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

export function BlogList({ source }: { source: "devto" | "medium" }) {
  const t = useTranslations("blog");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setArticles([]);
    fetch(source === "devto" ? "/api/devto" : "/api/medium")
      .then((r) => r.json())
      .then((d) => setArticles(Array.isArray(d) ? d : []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [source]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => <ArticleSkeleton key={i} />)}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">{t("noPosts")}</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
