"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Command } from "cmdk";
import { Home, FolderOpen, Newspaper, Award, Search, ArrowRight, Code2 } from "lucide-react";
import { MOCK_PROJECTS, MOCK_CERTIFICATES } from "@/lib/mock-data";

const PAGES = [
  { label: "Home", href: "/", icon: Home, desc: "Back to the main page" },
  { label: "Projects", href: "/project", icon: FolderOpen, desc: "All my projects" },
  { label: "Blog", href: "/blog", icon: Newspaper, desc: "Articles and writings" },
  { label: "Certificates", href: "/certificates", icon: Award, desc: "Professional certifications" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const go = useCallback((href: string) => {
    setOpen(false);
    router.push(href);
  }, [router]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />

      {/* Palette */}
      <Command
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        loop
      >
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Command.Input
            autoFocus
            placeholder="Search pages, projects, certificates…"
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline">
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-[60vh] overflow-y-auto overscroll-contain p-2">
          <Command.Empty className="py-10 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>

          {/* Navigation */}
          <Command.Group heading="Navigation">
            {PAGES.map(({ label, href, icon: Icon, desc }) => (
              <Command.Item
                key={href}
                value={`nav-${label}`}
                onSelect={() => go(href)}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 font-medium">{label}</span>
                <span className="text-xs text-muted-foreground">{desc}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40" />
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Separator className="my-1 h-px bg-border" />

          {/* Projects */}
          <Command.Group heading="Projects">
            {MOCK_PROJECTS.map((p) => (
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

          <Command.Separator className="my-1 h-px bg-border" />

          {/* Certificates */}
          <Command.Group heading="Certificates">
            {MOCK_CERTIFICATES.slice(0, 8).map((c) => (
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

        {/* Footer hint */}
        <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
          <span>
            <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px]">↑↓</kbd> navigate
            {" · "}
            <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px]">↵</kbd> open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px]">⌘K</kbd> to close
          </span>
        </div>
      </Command>
    </div>
  );
}
