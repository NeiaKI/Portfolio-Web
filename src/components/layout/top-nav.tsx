"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
  Home,
  FolderOpen,
  Newspaper,
  Award,
  Bot,
  MessageCircle,
  Wrench,
  Map,
  ScrollText,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  Briefcase,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./language-switcher";
import type { LucideIcon } from "lucide-react";

type NavLink = { href: string; labelKey: string; icon: LucideIcon };
type NavGroup = { labelKey: string; items: NavLink[] };

const MAIN_LINKS: NavLink[] = [
  { href: "/", labelKey: "home", icon: Home },
  { href: "/project", labelKey: "project", icon: FolderOpen },
  { href: "/blog", labelKey: "blog", icon: Newspaper },
  { href: "/certificates", labelKey: "certificates", icon: Award },
];

const DROPDOWN_GROUPS: NavGroup[] = [
  {
    labelKey: "application",
    items: [
      { href: "/ai", labelKey: "ai", icon: Bot },
      { href: "/chat", labelKey: "chat", icon: MessageCircle },
    ],
  },
  {
    labelKey: "playground",
    items: [
      { href: "/tools", labelKey: "tools", icon: Wrench },
      { href: "/roadmap", labelKey: "roadmap", icon: Map },
      { href: "/changelog", labelKey: "changelog", icon: ScrollText },
    ],
  },
];

const ALL_MOBILE_LINKS: NavLink[] = [
  ...MAIN_LINKS,
  ...DROPDOWN_GROUPS.flatMap((g) => g.items),
];

export function TopNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/" || pathname === "/id" || pathname === "/en"
      : pathname.includes(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4 sm:px-6">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold text-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          Eki
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {MAIN_LINKS.map(({ href, labelKey }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                isActive(href)
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {t(labelKey)}
            </Link>
          ))}

          {DROPDOWN_GROUPS.map((group) => (
            <div key={group.labelKey} className="group relative">
              <button
                className={cn(
                  "flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors",
                  group.items.some((i) => isActive(i.href))
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {t(group.labelKey)}
                <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
              </button>

              {/* Dropdown */}
              <div className="invisible absolute left-0 top-full mt-1 min-w-[140px] rounded-lg border border-border bg-popover p-1 opacity-0 shadow-md transition-all group-hover:visible group-hover:opacity-100">
                {group.items.map(({ href, labelKey, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                      isActive(href)
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {t(labelKey)}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Right controls */}
        <div className="ml-auto flex items-center gap-1">
          <Badge
            variant="outline"
            className="hidden border-primary/40 text-primary text-[10px] sm:flex items-center gap-1"
          >
            <Briefcase className="h-2.5 w-2.5" />
            Open to Work
          </Badge>

          <LanguageSwitcher />

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Avatar + username (desktop) */}
          <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-2.5 py-1 sm:flex">
            <Avatar className="h-6 w-6">
              <AvatarImage src="/images/avatar-placeholder.jpg" alt="Eki" />
              <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
                EK
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-foreground">@neki</span>
          </div>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors md:hidden">
                <Menu className="h-4 w-4" />
              </span>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4">
              {/* Profile */}
              <div className="mb-4 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/images/avatar-placeholder.jpg" alt="Eki" />
                  <AvatarFallback className="bg-primary/20 text-primary font-bold">
                    EK
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">Eki</p>
                  <p className="text-xs text-muted-foreground">@neki</p>
                </div>
              </div>
              <Separator className="mb-3" />
              <nav className="flex flex-col gap-1">
                {ALL_MOBILE_LINKS.map(({ href, labelKey, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
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
      </div>
    </header>
  );
}
