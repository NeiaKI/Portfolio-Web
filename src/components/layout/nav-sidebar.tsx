"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
  Home,
  FolderOpen,
  Newspaper,
  Award,
  Moon,
  ChevronRight,
  Languages,
  Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

type NavItem = { href: string; labelKey: string; icon: LucideIcon; shortcut: string };
type NavGroup = { sectionLabel: string | null; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    sectionLabel: null,
    items: [
      { href: "/", labelKey: "home", icon: Home, shortcut: "1" },
      { href: "/project", labelKey: "project", icon: FolderOpen, shortcut: "2" },
      { href: "/blog", labelKey: "blog", icon: Newspaper, shortcut: "3" },
      { href: "/certificates", labelKey: "certificates", icon: Award, shortcut: "4" },
    ],
  },
];

export function NavSidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isDark = mounted ? theme === "dark" : true;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "/id" || pathname === "/en";
    return pathname.includes(href);
  };

  return (
    <aside className="flex h-full w-52 flex-col py-6 px-3">
      {/* Profile */}
      <div className="flex flex-col items-center gap-2 px-2 mb-3">
        <Avatar className="h-[72px] w-[72px] border-2 border-border/60">
          <AvatarImage src="/images/avatar-placeholder.jpg" alt="Febiyanto Rizki" />
          <AvatarFallback className="bg-muted text-foreground font-bold text-2xl">
            FR
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <p className="font-semibold text-foreground text-[15px]">Febiyanto Rizki</p>
          <p className="text-xs text-muted-foreground mt-0.5">@nateeki</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto scrollbar-hide">
        {NAV_GROUPS.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            {group.sectionLabel && (
              <p className="px-3 pt-1 pb-0.5 text-[11px] font-medium text-muted-foreground/60 uppercase tracking-widest">
                {group.sectionLabel}
              </p>
            )}
            {group.items.map(({ href, labelKey, icon: Icon, shortcut }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive(href)
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{t(labelKey as Parameters<typeof t>[0])}</span>
                {isActive(href) ? (
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                ) : (
                  <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px] font-medium text-muted-foreground/50">
                    ⌘{shortcut}
                  </kbd>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Search shortcut */}
      <button
        onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }))}
        className="mx-1 mb-2 flex items-center gap-2 rounded-lg border border-border/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="rounded bg-muted px-1 py-0.5 text-[10px]">⌘K</kbd>
      </button>

      {/* Theming — pinned to bottom */}
      <div className="mt-2 flex flex-col gap-0.5">
        <Separator className="mb-2" />
        <p className="px-3 pb-0.5 text-[11px] font-medium text-muted-foreground/60 uppercase tracking-widest">
          Theming
        </p>
        <div className="flex items-center justify-between rounded-lg px-3 py-2">
          <div className="flex items-center gap-3">
            <Moon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Dark Mode</span>
          </div>
          <button
            role="switch"
            suppressHydrationWarning
            aria-checked={isDark}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
              isDark ? "bg-primary" : "bg-muted-foreground/30"
            )}
          >
            <span
              suppressHydrationWarning
              className={cn(
                "pointer-events-none inline-block h-4 w-4 rounded-full bg-background shadow-sm transition-transform",
                isDark ? "translate-x-4" : "translate-x-0"
              )}
            />
          </button>
        </div>
        <div className="flex items-center justify-between rounded-lg px-3 py-2">
          <div className="flex items-center gap-3">
            <Languages className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Language</span>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </aside>
  );
}
