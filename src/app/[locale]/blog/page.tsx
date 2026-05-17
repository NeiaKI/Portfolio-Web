"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams, useParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { BlogList } from "@/components/blog/blog-list";
import { LocalBlogList } from "@/components/blog/local-blog-list";

type Source = "devto" | "medium" | "posts";

function Kbd({ children, active }: { children: React.ReactNode; active: boolean }) {
  return (
    <kbd className={`rounded px-1.5 py-0.5 text-[10px] font-bold ml-1.5 ${
      active
        ? "bg-background/20 text-background"
        : "bg-foreground/10 text-foreground/60 border border-border"
    }`}>
      {children}
    </kbd>
  );
}

const TABS: { id: Source; key: string; kbd: string }[] = [
  { id: "posts",  key: "posts",  kbd: "F" },
  { id: "devto",  key: "devto",  kbd: "G" },
  { id: "medium", key: "medium", kbd: "H" },
];

export default function BlogPage() {
  const t = useTranslations("blog");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";

  const rawSource = searchParams.get("source");
  const source: Source =
    rawSource === "devto" ? "devto" :
    rawSource === "medium" ? "medium" :
    "posts";

  const setSource = (s: Source) => {
    const p = new URLSearchParams(searchParams.toString());
    if (s === "posts") {
      p.delete("source");
    } else {
      p.set("source", s);
    }
    const query = p.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "F") setSource("posts");
      if (e.key === "G") setSource("devto");
      if (e.key === "H") setSource("medium");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="flex justify-center">
          <div className="flex gap-1 rounded-full border border-border bg-card p-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSource(tab.id)}
                className={`flex items-center rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
                  source === tab.id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(tab.key as "posts" | "devto" | "medium")}
                <Kbd active={source === tab.id}>{tab.kbd}</Kbd>
              </button>
            ))}
          </div>
        </div>

        {source === "posts" ? (
          <LocalBlogList locale={locale} />
        ) : (
          <BlogList source={source} />
        )}
      </div>
    </MainLayout>
  );
}
