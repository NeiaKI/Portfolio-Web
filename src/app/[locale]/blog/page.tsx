"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MainLayout } from "@/components/layout/main-layout";
import { BlogList } from "@/components/blog/blog-list";

type Source = "devto" | "medium";

export default function BlogPage() {
  const t = useTranslations("blog");
  const [source, setSource] = useState<Source>("devto");

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        {/* Header — centered */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Source tabs — centered pill style */}
        <div className="flex justify-center">
          <div className="flex gap-1 rounded-full border border-border bg-card p-1">
            {(["devto", "medium"] as Source[]).map((s) => (
              <button
                key={s}
                onClick={() => setSource(s)}
                className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
                  source === s
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s === "devto" ? t("devto") : t("medium")}
              </button>
            ))}
          </div>
        </div>

        <BlogList source={source} />
      </div>
    </MainLayout>
  );
}
