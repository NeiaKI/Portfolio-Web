"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import {
  Home,
  FolderOpen,
  Newspaper,
  Bot,
  MessageCircle,
  Wrench,
  Map,
  Award,
  ScrollText,
  Sun,
  Moon,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

const NAV_GROUPS = [
  {
    labelKey: "main" as const,
    items: [
      { href: "/", labelKey: "home" as const, icon: Home },
      { href: "/project", labelKey: "project" as const, icon: FolderOpen },
      { href: "/blog", labelKey: "blog" as const, icon: Newspaper },
      { href: "/certificates", labelKey: "certificates" as const, icon: Award },
    ],
  },
  {
    labelKey: "application" as const,
    items: [
      { href: "/ai", labelKey: "ai" as const, icon: Bot },
      { href: "/chat", labelKey: "chat" as const, icon: MessageCircle },
    ],
  },
  {
    labelKey: "playground" as const,
    items: [
      { href: "/tools", labelKey: "tools" as const, icon: Wrench },
      { href: "/roadmap", labelKey: "roadmap" as const, icon: Map },
      { href: "/changelog", labelKey: "changelog" as const, icon: ScrollText },
    ],
  },
];

export function NavSidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "/id" || pathname === "/en";
    return pathname.includes(href);
  };

  return (
    <aside className="flex h-full w-64 flex-col gap-4 p-4">
      {/* Profile card */}
      <div className="flex flex-col items-center gap-3 rounded-xl bg-card p-4">
        <div className="relative">
          <Avatar className="h-16 w-16 border-2 border-primary/30">
            <AvatarImage src="/images/avatar-placeholder.jpg" alt="Eki" />
            <AvatarFallback className="bg-primary/20 text-primary font-bold text-lg">
              EK
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-foreground">Eki</p>
          <p className="text-xs text-muted-foreground">@neki</p>
          <Badge
            variant="outline"
            className="mt-1 border-primary/40 text-primary text-[10px]"
          >
            <Briefcase className="mr-1 h-2.5 w-2.5" />
            Open to Work
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto scrollbar-hide">
        {NAV_GROUPS.map((group, groupIdx) => (
          <div key={group.labelKey}>
            {groupIdx > 0 && <Separator className="my-2" />}
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {t(group.labelKey)}
            </p>
            {group.items.map(({ href, labelKey, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive(href)
                    ? "bg-primary/15 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {t(labelKey)}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom controls */}
      <div className="flex flex-col gap-2">
        <Separator />
        <div className="flex items-center justify-between px-1">
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
        </div>
      </div>
    </aside>
  );
}
