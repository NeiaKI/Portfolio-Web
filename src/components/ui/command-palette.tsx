"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "@/lib/theme";
import { Command } from "cmdk";
import { Home, FolderOpen, Newspaper, Award, Coffee, Search, Code2, Layers, Moon, Sun, Clock, ScrollText, LineChart, Check } from "lucide-react";
import { CERTIFICATES } from "@/data/certificates";
import { THEMES } from "@/lib/themes";
import type { Project } from "@/types/database";
import type { PostMeta } from "@/lib/blog";
import type { LucideIcon } from "lucide-react";

type PageDef = { labelKey: string; href: string; icon: LucideIcon; shortcut: string; descKey: string };

const PAGES: PageDef[] = [
  { labelKey: "home",         href: "/",            icon: Home,       shortcut: "1", descKey: "homeDesc"        },
  { labelKey: "project",      href: "/project",      icon: FolderOpen, shortcut: "2", descKey: "projectDesc"    },
  { labelKey: "blog",         href: "/blog",          icon: Newspaper,  shortcut: "3", descKey: "blogDesc"       },
  { labelKey: "certificates", href: "/certificates",  icon: Award,      shortcut: "4", descKey: "certificatesDesc" },
  { labelKey: "uses",         href: "/uses",          icon: Layers,     shortcut: "5", descKey: "usesDesc"       },
  { labelKey: "donate",       href: "/donate",        icon: Coffee,     shortcut: "6", descKey: "donateDesc"     },
  { labelKey: "changelog",    href: "/changelog",     icon: ScrollText, shortcut: "",  descKey: "changelogDesc"  },
];

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
      {children}
    </kbd>
  );
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<PostMeta[]>([]);
  const loaded = useRef(false);
  const router = useRouter();
  const pathname = usePathname();
  const { theme, mode, setTheme, toggleMode } = useTheme();
  const t = useTranslations("nav");

  // Defer fetch sampai palette pertama kali dibuka — hindari request di setiap mount halaman.
  useEffect(() => {
    if (!open || loaded.current) return;
    loaded.current = true;
    fetch("/api/github")
      .then((r) => r.ok ? r.json() : [])
      .then(setProjects)
      .catch(() => {});
    fetch("/api/posts")
      .then((r) => r.ok ? r.json() : [])
      .then((all: PostMeta[]) => setPosts(all.slice(0, 5)))
      .catch(() => {});
  }, [open]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Buka palette langsung di mode pencarian tema (dipanggil dari shortcut "/").
  useEffect(() => {
    const handler = () => {
      setOpen(true);
      const input = document.querySelector<HTMLInputElement>("[cmdk-input]");
      if (input) { input.value = "theme:"; input.dispatchEvent(new Event("input", { bubbles: true })); }
    };
    window.addEventListener("open-theme-picker", handler as EventListener);
    return () => window.removeEventListener("open-theme-picker", handler as EventListener);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;

      if (e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }

      // Cmd+1-6 → navigate directly (no palette needed)
      const idx = parseInt(e.key, 10) - 1;
      if (idx >= 0 && idx < PAGES.length) {
        e.preventDefault();
        setOpen(false);
        router.push(PAGES[idx].href);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router]);

  // Escape when open
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // j/k page scroll (vim-style)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (open) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "j") window.scrollBy({ top: 80, behavior: "smooth" });
      if (e.key === "k") window.scrollBy({ top: -80, behavior: "smooth" });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      onClick={() => setOpen(false)}
    >
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />

      <Command
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        loop
      >
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Command.Input
            autoFocus
            placeholder={t("searchPlaceholder")}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <Kbd>ESC</Kbd>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto overscroll-contain p-2">
          <Command.Empty className="py-10 text-center text-sm text-muted-foreground">
            {t("noResults")}
          </Command.Empty>

          {/* Navigation */}
          <Command.Group heading={t("navigation")}>
            {PAGES.map(({ labelKey, href, icon: Icon, shortcut, descKey }) => (
              <Command.Item
                key={href}
                value={`nav-${labelKey}`}
                onSelect={() => go(href)}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 font-medium">{t(labelKey as Parameters<typeof t>[0])}</span>
                <span className="text-xs text-muted-foreground">{t(descKey as Parameters<typeof t>[0])}</span>
                {shortcut && <Kbd>⌘{shortcut}</Kbd>}
              </Command.Item>
            ))}
            <Command.Item
              value="nav-tools market crypto stocks saham"
              onSelect={() => go("/tools")}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
            >
              <LineChart className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 font-medium">{t("tools")}</span>
              <span className="text-xs text-muted-foreground">{t("marketWeek")}</span>
            </Command.Item>
          </Command.Group>

          <Command.Separator className="my-1 h-px bg-border" />

          {/* Actions */}
          <Command.Group heading={t("actions")}>
            <Command.Item
              value="toggle theme dark light"
              onSelect={() => { toggleMode(); setOpen(false); }}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
            >
              {mode === "dark" ? <Sun className="h-4 w-4 shrink-0 text-muted-foreground" /> : <Moon className="h-4 w-4 shrink-0 text-muted-foreground" />}
              <span className="flex-1 font-medium">{t("toggleTheme")}</span>
              <span className="text-xs text-muted-foreground">{mode === "dark" ? t("switchToLight") : t("switchToDark")}</span>
              <Kbd>⌘⇧L</Kbd>
            </Command.Item>
          </Command.Group>

          <Command.Separator className="my-1 h-px bg-border" />

          {/* Themes */}
          <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            {t("themes")}
          </p>
          {(["dark", "light"] as const).map((themeMode, index) => (
            <div key={themeMode}>
              {index > 0 && <Command.Separator className="mx-3 my-2 h-px bg-border/70" />}
              <Command.Group
                heading={themeMode === "dark" ? t("darkThemes") : t("lightThemes")}
                className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted-foreground/60"
              >
                {THEMES.filter((th) => th.mode === themeMode).map((th) => (
                  <Command.Item
                    key={th.id}
                    value={`theme:${th.name} ${th.id} ${themeMode}`}
                    onSelect={() => { setTheme(th.id); setOpen(false); }}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
                  >
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border"
                      style={{ background: th.preview[0] }}
                    >
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: th.preview[1] }} />
                    </span>
                    <span className="flex-1 font-medium">{th.name}</span>
                    {theme === th.id && <Check className="h-4 w-4 text-primary" aria-label={t("activeTheme")} />}
                  </Command.Item>
                ))}
              </Command.Group>
            </div>
          ))}

          <Command.Separator className="my-1 h-px bg-border" />

          {/* Projects */}
          <Command.Group heading={t("project")}>
            {projects.map((p) => (
              <Command.Item
                key={p.id}
                value={`project-${p.title}`}
                onSelect={() => go(`/project/${p.slug}`)}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
              >
                <Code2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1">{p.title}</span>
                <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                  {p.tech_stack.slice(0, 2).join(", ")}
                </span>
              </Command.Item>
            ))}
          </Command.Group>

          {posts.length > 0 && (
            <>
              <Command.Separator className="my-1 h-px bg-border" />
              <Command.Group heading={t("recentPosts")}>
                {posts.map((p) => (
                  <Command.Item
                    key={p.slug}
                    value={`post-${p.title}`}
                    onSelect={() => go(`/blog/${p.slug}`)}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
                  >
                    <Newspaper className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="flex-1 line-clamp-1">{p.title}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Clock className="h-3 w-3" />{p.readTime}m
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            </>
          )}

          <Command.Separator className="my-1 h-px bg-border" />

          {/* Certificates */}
          <Command.Group heading={t("certificates")}>
            {CERTIFICATES.slice(0, 8).map((c) => (
              <Command.Item
                key={c.id}
                value={`cert-${c.title}`}
                onSelect={() => go("/certificates")}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
              >
                <Award className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 line-clamp-1">{c.title}</span>
                <span className="text-xs text-muted-foreground">{c.issuer.split(" ")[0]}</span>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Kbd>↑↓</Kbd> {t("cmdNavigate")}
            <span className="mx-1">·</span>
            <Kbd>↵</Kbd> {t("cmdOpen")}
            <span className="mx-1">·</span>
            <Kbd>⌘1–6</Kbd> {t("cmdJump")}
            <span className="mx-1">·</span>
            <Kbd>j</Kbd><Kbd>k</Kbd> {t("cmdScroll")}
            <span className="mx-1">·</span>
            <Kbd>⌘⇧L</Kbd> {t("cmdTheme")}
          </span>
          <Kbd>⌘K</Kbd>
        </div>
      </Command>
    </div>
  );
}
