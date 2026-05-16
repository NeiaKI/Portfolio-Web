"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Download, ExternalLink } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function AboutSection() {
  const t = useTranslations("home");

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col gap-4"
    >
      <h2 className="text-lg font-semibold text-foreground">{t("aboutTitle")}</h2>
      <div className="flex gap-4 rounded-xl border border-border bg-card p-4">
        <Avatar className="h-20 w-20 shrink-0 rounded-xl border border-border">
          <AvatarImage src="/images/avatar-placeholder.jpg" alt="Eki" />
          <AvatarFallback className="rounded-xl bg-primary/20 text-primary font-bold text-2xl">
            EK
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("aboutDesc")}
          </p>
          <div className="flex gap-2 flex-wrap">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5 text-xs")}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              {t("viewCV")}
            </a>
            <a
              href="/cv.pdf"
              download
              className={cn(buttonVariants({ size: "sm" }), "gap-1.5 text-xs")}
            >
              <Download className="h-3.5 w-3.5" />
              {t("downloadCV")}
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
