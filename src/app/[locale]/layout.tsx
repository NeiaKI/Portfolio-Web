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
      default: "Febiyanto Rizki Qurbandi — Software Engineer & 3D Artist",
      template: "%s | Febiyanto Rizki Qurbandi",
    },
    description: t("heroDesc"),
    keywords: ["Febiyanto Rizki Qurbandi", "nateeki", "Software Engineer", "3D Artist", "Next.js", "React", "TypeScript", "Go", "Blender", "Tangerang", "Indonesia"],
    authors: [{ name: "Febiyanto Rizki Qurbandi", url: baseUrl }],
    creator: "Febiyanto Rizki Qurbandi",
    openGraph: {
      type: "website",
      locale: locale === "id" ? "id_ID" : "en_US",
      url: baseUrl,
      siteName: "Febiyanto Rizki Qurbandi",
      title: "Febiyanto Rizki Qurbandi — Software Engineer & 3D Artist",
      description: t("heroDesc"),
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Febiyanto Rizki Qurbandi Portfolio" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Febiyanto Rizki Qurbandi — Software Engineer & 3D Artist",
      description: t("heroDesc"),
      creator: "@nateeki",
      images: ["/opengraph-image"],
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        "en": `${baseUrl}/en`,
        "id": `${baseUrl}/id`,
      },
    },
    robots: { index: true, follow: true },
    other: {
      "application-name": "nateeki",
    },
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nateeki.vercel.app";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${baseUrl}/#person`,
        name: "Febiyanto Rizki Qurbandi",
        alternateName: "EKI",
        url: baseUrl,
        sameAs: [
          "https://github.com/NeiaKI",
          "https://linkedin.com/in/febiyanto-rizki",
          "https://instagram.com/nateeki",
          "https://x.com/nateeki",
        ],
        jobTitle: "Software Engineer & 3D Artist",
        worksFor: { "@type": "Organization", name: "PT. Teknologi Nusantara Digital" },
        address: { "@type": "PostalAddress", addressLocality: "Tangerang Selatan", addressCountry: "ID" },
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "Febiyanto Rizki Qurbandi — Portfolio",
        author: { "@id": `${baseUrl}/#person` },
        inLanguage: ["en", "id"],
      },
    ],
  };

  return (
    <NextIntlClientProvider messages={messages}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Providers>{children}</Providers>
    </NextIntlClientProvider>
  );
}
