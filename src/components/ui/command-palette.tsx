"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Command } from "cmdk";
import { Home, FolderOpen, Newspaper, Award, Coffee, Search, Code2, Layers, Moon, Sun, Clock } from "lucide-react";
import { CERTIFICATES } from "@/data/certificates";
import type { Project } from "@/types/database";
import type { PostMeta } from "@/lib/blog";

const PAGES = [
  { label: "Home",         href: "/",             icon: Home,       shortcut: "1", desc: "Main page"       },
  { label: "Projects",     href: "/project",       icon: FolderOpen, shortcut: "2", desc: "All projects"   },
  { label: "Blog",         href: "/blog",           icon: Newspaper,  shortcut: "3", desc: "Articles"      },
  { label: "Certificates", href: "/certificates",   icon: Award,      shortcut: "4", desc: "Certifications" },
  { label: "Uses",         href: "/uses",           icon: Layers,     shortcut: "5", desc: "My setup"       },
  { label: "Donate",       href: "/donate",         icon: Coffee,     shortcut: "6", desc: "Support my work" },
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
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    fetch("/api/github", { cache: "no-store" })
      .then((r) => r.ok ? r.json() : [])
      .then(setProjects)
      .catch(() => {});
    fetch("/api/posts")
      .then((r) => r.ok ? r.json() : [])
      .then((all: PostMeta[]) => setPosts(all.slice(0, 5)))
      .catch(() => {});
  }, []);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router]
  );

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

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
            placeholder="Search pages, projects, certificates…"
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <Kbd>ESC</Kbd>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto overscroll-contain p-2">
          <Command.Empty className="py-10 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          {/* Navigation */}
          <Command.Group heading="Navigation">
            {PAGES.map(({ label, href, icon: Icon, shortcut, desc }) => (
              <Command.Item
                key={href}
                value={`nav-${label}`}
                onSelect={() => go(href)}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 font-medium">{label}</span>
                <span className="text-xs text-muted-foreground">{desc}</span>
                <Kbd>⌘{shortcut}</Kbd>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Separator className="my-1 h-px bg-border" />

          {/* Actions */}
          <Command.Group heading="Actions">
            <Command.Item
              value="toggle theme dark light"
              onSelect={() => { setTheme(theme === "dark" ? "light" : "dark"); setOpen(false); }}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 shrink-0 text-muted-foreground" /> : <Moon className="h-4 w-4 shrink-0 text-muted-foreground" />}
              <span className="flex-1 font-medium">Toggle Theme</span>
              <span className="text-xs text-muted-foreground">{theme === "dark" ? "Switch to Light" : "Switch to Dark"}</span>
              <Kbd>⌘⇧L</Kbd>
            </Command.Item>
          </Command.Group>

          <Command.Separator className="my-1 h-px bg-border" />

          {/* Projects */}
          <Command.Group heading="Projects">
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
              <Command.Group heading="Recent Posts">
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
          <Command.Group heading="Certificates">
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
            <Kbd>↑↓</Kbd> navigate
            <span className="mx-1">·</span>
            <Kbd>↵</Kbd> open
            <span className="mx-1">·</span>
            <Kbd>⌘1–6</Kbd> jump
            <span className="mx-1">·</span>
            <Kbd>j</Kbd><Kbd>k</Kbd> scroll
            <span className="mx-1">·</span>
            <Kbd>⌘⇧L</Kbd> theme
          </span>
          <Kbd>⌘K</Kbd>
        </div>
      </Command>
    </div>
  );
}
