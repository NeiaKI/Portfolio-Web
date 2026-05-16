import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nateeki.vercel.app";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: "Febiyanto Rizki — Software Engineer & 3D Artist",
      template: "%s | Febiyanto Rizki",
    },
    description: t("heroDesc"),
    keywords: ["Febiyanto Rizki", "nateeki", "Software Engineer", "3D Artist", "Next.js", "React", "TypeScript", "Go", "Blender", "Tangerang", "Indonesia"],
    authors: [{ name: "Febiyanto Rizki", url: baseUrl }],
    creator: "Febiyanto Rizki",
    openGraph: {
      type: "website",
      locale: locale === "id" ? "id_ID" : "en_US",
      url: baseUrl,
      siteName: "Febiyanto Rizki",
      title: "Febiyanto Rizki — Software Engineer & 3D Artist",
      description: t("heroDesc"),
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Febiyanto Rizki Portfolio" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Febiyanto Rizki — Software Engineer & 3D Artist",
      description: t("heroDesc"),
      creator: "@nateeki",
      images: ["/og-image.png"],
    },
    robots: { index: true, follow: true },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "id")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>{children}</Providers>
    </NextIntlClientProvider>
  );
}
