"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

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
        <a
          href="https://drive.google.com/drive/folders/1amnC0d-sebWFIDlh2nQJlECSC_LRA7Rv?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          ✨ {t("viewCV")}
        </a>
        <a
          href="https://drive.google.com/drive/folders/1amnC0d-sebWFIDlh2nQJlECSC_LRA7Rv?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-foreground/5 px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10"
        >
          {t("viewPortfolioPDF")} 📄
        </a>
      </div>
    </motion.section>
  );
}
