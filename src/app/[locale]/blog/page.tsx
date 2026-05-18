import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { BlogPageClient } from "@/components/blog/blog-page-client";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nateeki.dev";
  const isId = locale === "id";
  const description = isId
    ? "Tulisan tentang software engineering, Linux, dan hal-hal yang saya pelajari."
    : "Writing about software engineering, Linux, and things I learn along the way.";
  return {
    title: t("title"),
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}/blog`,
      languages: { en: `${baseUrl}/en/blog`, id: `${baseUrl}/id/blog` },
    },
    openGraph: {
      title: t("title"),
      description,
      type: "website",
      images: [{ url: `/api/og?title=${encodeURIComponent(t("title"))}&desc=${encodeURIComponent(description)}&tag=Blog`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description,
      creator: "@nateeki",
    },
  };
}

export default function BlogPage() {
  return (
    <Suspense>
      <BlogPageClient />
    </Suspense>
  );
}
