"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Home, FolderOpen, Newspaper, Award, Menu, Moon, Sun, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";

const NAV_ITEMS = [
  { href: "/", labelKey: "home" as const, icon: Home },
  { href: "/project", labelKey: "project" as const, icon: FolderOpen },
  { href: "/blog", labelKey: "blog" as const, icon: Newspaper },
  { href: "/certificates", labelKey: "certificates" as const, icon: Award },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "/id";
    return pathname.includes(href);
  };

  const triggerSearch = () => {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur lg:hidden">
      <span className="font-semibold text-foreground">nateeki</span>

      <div className="flex items-center gap-1">
        {/* Search button */}
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={triggerSearch} aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>

        <LanguageSwitcher />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="hidden h-4 w-4 dark:block" />
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <Menu className="h-4 w-4" />
            </span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <div className="mb-4">
              <p className="text-sm font-semibold text-foreground">Febiyanto Rizki</p>
              <p className="text-xs text-muted-foreground">@nateeki</p>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map(({ href, labelKey, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    isActive(href)
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {t(labelKey)}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
