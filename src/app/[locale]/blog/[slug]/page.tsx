import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { Badge } from "@/components/ui/badge";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { compileMDX } from "@/lib/mdx";
import { CodeCopyInit } from "@/components/blog/code-copy";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { extractHeadings } from "@/lib/mdx-utils";
import { ShareButtons } from "@/components/blog/share-buttons";
import { ViewCount } from "@/components/blog/view-count";
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
  const { slug, locale } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nateeki.dev";
  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/${slug}`,
      languages: { en: `${baseUrl}/en/blog/${slug}`, id: `${baseUrl}/id/blog/${slug}` },
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      images: [{ url: `/api/og?title=${encodeURIComponent(post.title)}&desc=${encodeURIComponent(post.description)}&tag=Blog`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      creator: "@nateeki",
      images: [`/api/og?title=${encodeURIComponent(post.title)}&desc=${encodeURIComponent(post.description)}&tag=Blog`],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const post = getPostBySlug(slug);

  if (!post || !post.published) notFound();

  const Content = await compileMDX(post.content);
  const headings = extractHeadings(post.content);

  const wordCount = post.content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Related posts: share at least 1 tag, exclude self
  const allPosts = getAllPosts();
  const related = allPosts
    .filter((p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nateeki.dev";
  const postUrl = `${baseUrl}/${locale}/blog/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Febiyanto Rizki Qurbandi",
      url: baseUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Febiyanto Rizki Qurbandi",
      url: baseUrl,
    },
    url: postUrl,
    keywords: post.tags.join(", "),
    inLanguage: locale === "id" ? "id-ID" : "en-US",
    timeRequired: `PT${readTime}M`,
  };

  return (
    <MainLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <CodeCopyInit />

      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex flex-col gap-6 flex-1 min-w-0">
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
              <ViewCount slug={slug} />
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
            prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:p-0
            prose-blockquote:border-primary/30 prose-blockquote:text-muted-foreground
            prose-hr:border-border
            prose-th:text-foreground prose-td:text-muted-foreground
            prose-img:rounded-xl prose-img:border prose-img:border-border
          ">
            <Content />
          </article>

          <hr className="border-border" />

          {/* Share */}
          <ShareButtons title={post.title} url={postUrl} />

          {/* Related posts */}
          {related.length > 0 && (
            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-foreground">Related Posts</h2>
              <div className="flex flex-col gap-2">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/${locale}/blog/${p.slug}`}
                    className="group flex flex-col gap-1 rounded-lg border border-border/40 bg-card px-4 py-3 transition-all hover:border-primary/30 hover:-translate-y-0.5"
                  >
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {p.title}
                    </span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{p.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky ToC sidebar — only on wide screens */}
        {headings.length > 0 && (
          <aside className="hidden xl:flex flex-col gap-2 w-52 shrink-0">
            <div className="sticky top-6">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        )}
      </div>
    </MainLayout>
  );
}
