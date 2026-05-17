"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { BlogList } from "@/components/blog/blog-list";

type Source = "devto" | "medium";

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

export default function BlogPage() {
  const t = useTranslations("blog");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const source: Source =
    searchParams.get("source") === "medium" ? "medium" : "devto";

  const setSource = (s: Source) => {
    const params = new URLSearchParams(searchParams.toString());
    if (s === "devto") {
      params.delete("source");
    } else {
      params.set("source", s);
    }
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "F") setSource("devto");
      if (e.key === "G") setSource("medium");
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
            {(["devto", "medium"] as Source[]).map((s) => (
              <button
                key={s}
                onClick={() => setSource(s)}
                className={`flex items-center rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
                  source === s
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s === "devto" ? t("devto") : t("medium")}
                <Kbd active={source === s}>{s === "devto" ? "F" : "G"}</Kbd>
              </button>
            ))}
          </div>
        </div>

        <BlogList source={source} />
      </div>
    </MainLayout>
  );
}
