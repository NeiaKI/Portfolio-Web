import Link from "next/link";
import { useTranslations } from "next-intl";
import { getAllPosts } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

interface LocalPostListProps {
  locale: string;
}

export function LocalPostList({ locale }: LocalPostListProps) {
  const t = useTranslations("blog");
  const posts = getAllPosts();

  if (posts.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">{t("noPosts")}</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
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
                <Badge key={tag} variant="outline" className="text-[11px] py-0 px-2">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
