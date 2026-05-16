"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggle = () => {
    const next = locale === "en" ? "id" : "en";
    router.replace(pathname, { locale: next });
  };

  return (
    <button
      onClick={toggle}
      className="flex h-8 items-center gap-1 px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <span className={locale === "en" ? "text-foreground font-semibold" : ""}>EN</span>
      <span className="text-muted-foreground/40">/</span>
      <span className={locale === "id" ? "text-foreground font-semibold" : ""}>ID</span>
    </button>
  );
}
