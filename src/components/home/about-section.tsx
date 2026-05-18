"use client";

import { useTranslations } from "next-intl";
import { Sparkles, ExternalLink, FileText } from "lucide-react";

export function AboutSection() {
  const t = useTranslations("home");

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-bold text-foreground">{t("aboutTitle")}</h2>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {t("aboutDesc")}
      </p>

      <div className="flex flex-wrap gap-3 pt-1">
        {/* View CV — shimmer sweep */}
        <a
          href="https://drive.google.com/drive/folders/1amnC0d-sebWFIDlh2nQJlECSC_LRA7Rv?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground transition-transform hover:scale-[1.02]"
        >
          <span
            aria-hidden="true"
            className="animate-shiny-sweep pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/15 via-50% to-transparent"
          />
          <Sparkles className="relative h-4 w-4 text-yellow-300" />
          <span className="relative">{t("viewCV")}</span>
          <ExternalLink className="relative h-3 w-3 text-muted-foreground" />
        </a>

        {/* View Portfolio in PDF — animated gradient text */}
        <a
          href="https://drive.google.com/drive/folders/1amnC0d-sebWFIDlh2nQJlECSC_LRA7Rv?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-5 py-2 text-sm font-medium transition-transform hover:scale-[1.02] [--bg-size:300%] shadow-[inset_0_-8px_10px_#8fdfff1f] hover:shadow-[inset_0_-5px_10px_#8fdfff3f]"
        >
          <span className="animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent">
            {t("viewPortfolioPDF")}
          </span>
          <FileText className="h-3.5 w-3.5 text-white/70 transition-transform duration-300 group-hover:translate-x-0.5" />
        </a>
      </div>
    </section>
  );
}
