"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggle = () => {
    const next = locale === "en" ? "id" : "en";
    const segments = pathname.split("/");

    if (segments[1] === "id" || segments[1] === "en") {
      segments[1] = next === "en" ? "" : next;
    } else {
      if (next !== "en") {
        segments.splice(1, 0, next);
      }
    }

    const newPath = segments.filter(Boolean).join("/") || "/";
    router.push(`/${newPath}`);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="h-8 gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
    >
      <span className={locale === "en" ? "text-primary font-bold" : ""}>EN</span>
      <span className="text-muted-foreground/50">/</span>
      <span className={locale === "id" ? "text-primary font-bold" : ""}>ID</span>
    </Button>
  );
}
