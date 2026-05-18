"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Sparkles, ExternalLink, FileText } from "lucide-react";

export function AboutSection() {
  const t = useTranslations("home");

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col gap-3"
    >
      <h2 className="text-xl font-bold text-foreground">{t("aboutTitle")}</h2>

      <p className="text-sm text-muted-foreground leading-relaxed">
        {t("aboutDesc")}
      </p>

      <div className="flex flex-wrap gap-3 pt-1">
        {/* View CV — white shining glow border */}
        <div
          className="relative rounded-full p-px transition-all duration-300 hover:scale-[1.03]"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.15), rgba(255,255,255,0.5))",
            boxShadow: "0 0 14px rgba(255,255,255,0.25), 0 0 4px rgba(255,255,255,0.15)",
          }}
        >
          <a
            href="https://drive.google.com/drive/folders/1amnC0d-sebWFIDlh2nQJlECSC_LRA7Rv?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-card px-5 py-2 text-sm font-medium text-foreground"
          >
            <Sparkles className="h-4 w-4 text-yellow-300" />
            {t("viewCV")}
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </a>
        </div>

        {/* View Portfolio in PDF — purple glow border */}
        <div
          className="relative rounded-full p-px transition-all duration-300 hover:scale-[1.03]"
          style={{
            background: "linear-gradient(135deg, #cba6f7, #b4befe, #cba6f7)",
            boxShadow: "0 0 16px rgba(203,166,247,0.45), 0 0 4px rgba(203,166,247,0.2)",
          }}
        >
          <a
            href="https://drive.google.com/drive/folders/1amnC0d-sebWFIDlh2nQJlECSC_LRA7Rv?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-card px-5 py-2 text-sm font-medium text-primary"
          >
            {t("viewPortfolioPDF")}
            <FileText className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </motion.section>
  );
}
