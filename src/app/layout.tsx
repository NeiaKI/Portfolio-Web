import type { Metadata } from "next";
import Script from "next/script";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="alternate" type="application/rss+xml" title="Febiyanto Rizki Qurbandi — Blog" href="/feed.xml" />
        {/* Sembunyikan konten sebelum loading screen muncul — mencegah flash of content.
            html.will-load hides everything; LoadingScreen wrapper overrides dengan visibility:visible */}
        <style dangerouslySetInnerHTML={{ __html: `html.will-load{visibility:hidden}` }} />
        <script dangerouslySetInnerHTML={{ __html: `try{if(!sessionStorage.getItem('__booted'))document.documentElement.classList.add('will-load')}catch(e){}` }} />
      </head>
      <body className="min-h-full" suppressHydrationWarning>
        <Script
          id="sw-register"
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
