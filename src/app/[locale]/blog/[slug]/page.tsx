import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Badge } from "@/components/ui/badge";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { compileMDX } from "@/lib/mdx";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const posts = getAllPosts();
  const locales = ["en", "id"];
  return locales.flatMap((locale) =>
    posts.map((p) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return { title: post.title, description: post.description };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const post = getPostBySlug(slug);

  if (!post || !post.published) notFound();

  const Content = await compileMDX(post.content);

  const wordCount = post.content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        {/* Back */}
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToBlog")}
        </Link>

        {/* Header */}
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-foreground leading-snug">{post.title}</h1>
          <p className="text-muted-foreground leading-relaxed">{post.description}</p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {t("publishedOn")}{" "}
              {new Date(post.date).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {readTime} {t("minRead")}
            </span>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <hr className="border-border" />

        {/* MDX Content */}
        <article className="prose prose-sm max-w-none dark:prose-invert
          prose-headings:font-semibold prose-headings:text-foreground
          prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground
          prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.85em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl
          prose-blockquote:border-primary/30 prose-blockquote:text-muted-foreground
          prose-hr:border-border
          prose-th:text-foreground prose-td:text-muted-foreground
          prose-img:rounded-xl prose-img:border prose-img:border-border
        ">
          <Content />
        </article>
      </div>
    </MainLayout>
  );
}
