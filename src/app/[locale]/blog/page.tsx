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
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Source tabs */}
        <div className="flex gap-1 rounded-lg border border-border bg-muted p-1 w-fit">
          {(["devto", "medium"] as Source[]).map((s) => (
            <button
              key={s}
              onClick={() => setSource(s)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                source === s
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "devto" ? t("devto") : t("medium")}
            </button>
          ))}
        </div>

        <BlogList source={source} />
      </div>
    </MainLayout>
  );
}
