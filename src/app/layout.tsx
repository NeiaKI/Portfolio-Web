import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";
import { Geist, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { LoadingScreen } from "@/components/ui/loading-screen";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eki — Software Engineer",
  description:
    "Personal portfolio of Eki — Software Engineer and Linux Enthusiast.",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "id_ID",
    siteName: "Eki Portfolio",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Nonce di-generate oleh middleware per-request dan dikirim via x-nonce header.
  // Next.js otomatis menambahkan nonce ini ke framework scripts (hydration, __NEXT_DATA__).
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="alternate" type="application/rss+xml" title="Febiyanto Rizki Qurbandi — Blog" href="/feed.xml" />
        <style dangerouslySetInnerHTML={{ __html: `html.was-booted [data-loader]{display:none}` }} />
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}if(sessionStorage.getItem('__booted')){document.documentElement.classList.add('was-booted')}}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full" suppressHydrationWarning>
        <Script
          id="sw-register"
          nonce={nonce}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js')`,
          }}
        />
        <a
          href="#main-content"
          className="fixed left-2 top-2 z-[9999] -translate-y-16 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <LoadingScreen />
        <Providers nonce={nonce}>{children}</Providers>
      </body>
    </html>
  );
}
