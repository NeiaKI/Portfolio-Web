"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border/30 px-6 py-4">
      <div className="flex flex-col gap-2 text-[11px] text-muted-foreground/50 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Febiyanto Rizki Qurbandi. {t("allRights")}</span>
        <div className="flex items-center gap-3">
          <Link href="/terms" className="hover:text-foreground transition-colors">
            {t("terms")}
          </Link>
          <span className="opacity-40">·</span>
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            {t("privacy")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
