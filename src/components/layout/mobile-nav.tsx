"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Home, FolderOpen, Newspaper, Award, Coffee, Search, Moon, Sun, Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";

const NAV_ITEMS = [
  { href: "/",             labelKey: "home"         as const, icon: Home },
  { href: "/project",      labelKey: "project"      as const, icon: FolderOpen },
  { href: "/blog",         labelKey: "blog"         as const, icon: Newspaper },
  { href: "/certificates", labelKey: "certificates" as const, icon: Award },
  { href: "/donate",       labelKey: "donate"       as const, icon: Coffee },
];

function triggerSearch() {
  window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
}

export function MobileNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const isActive = (href: string) => {
    if (href === "/") return /^\/(en|id)?$/.test(pathname);
    return pathname.includes(href);
  };

  return (
    <>
      {/* Top bar — brand + utilities */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/80 px-4 py-2.5 backdrop-blur-md lg:hidden">
        <span className="font-semibold text-sm text-foreground tracking-tight">nateeki</span>

        <div className="flex items-center gap-0.5">
          <button
            onClick={triggerSearch}
            aria-label="Search"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>

          <LanguageSwitcher />

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Sun className="h-4 w-4 dark:hidden" />
            <Moon className="hidden h-4 w-4 dark:block" />
          </button>
        </div>
      </header>

      {/* Bottom tab bar */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-md pb-safe lg:hidden"
      >
        <div className="flex items-stretch">
          {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                aria-label={t(labelKey)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all",
                    active && "scale-110"
                  )}
                  strokeWidth={active ? 2.2 : 1.8}
                />
                <span className="truncate">{t(labelKey)}</span>
                {active && (
                  <span className="absolute bottom-0 h-0.5 w-8 rounded-t-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer so content isn't hidden behind bottom nav */}
      <div className="h-16 lg:hidden" aria-hidden />
    </>
  );
}
