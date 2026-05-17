"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { ProjectCard } from "./project-card";
import type { Project } from "@/types/database";
import { cn } from "@/lib/utils";

interface ProjectListProps {
  projects: Project[];
  locale: string;
}

export function ProjectList({ projects, locale }: ProjectListProps) {
  const t = useTranslations("project");
  const [query, setQuery] = useState("");
  const [activeTech, setActiveTech] = useState<string | null>(null);

  // Collect all unique tech tags across projects
  const allTechs = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.tech_stack.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchQuery =
        !query ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase());
      const matchTech = !activeTech || p.tech_stack.includes(activeTech);
      return matchQuery && matchTech;
    });
  }, [projects, query, activeTech]);

  const featured = filtered.filter((p) => p.is_featured);
  const rest = filtered.filter((p) => !p.is_featured);

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search")}
          className="w-full rounded-xl border border-border bg-card pl-9 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tech filter pills */}
      {allTechs.length > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center">
          <button
            onClick={() => setActiveTech(null)}
            className={cn(
              "rounded-full border px-3 py-0.5 text-[11px] font-medium transition-colors",
              !activeTech
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
            )}
          >
            {t("allTag")}
          </button>
          {allTechs.map((tech) => (
            <button
              key={tech}
              onClick={() => setActiveTech(activeTech === tech ? null : tech)}
              className={cn(
                "rounded-full border px-3 py-0.5 text-[11px] font-medium transition-colors",
                activeTech === tech
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              {tech}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">{t("noResults")}</p>
      ) : (
        <>
          {/* Featured */}
          {featured.length > 0 && !query && !activeTech && (
            <div className="flex flex-col gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                Featured
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {featured.map((p) => (
                  <ProjectCard key={p.id} project={p} locale={locale} featured />
                ))}
              </div>
            </div>
          )}

          {/* All / rest */}
          {rest.length > 0 && (
            <div className="flex flex-col gap-3">
              {featured.length > 0 && !query && !activeTech && (
                <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                  All Projects
                </h2>
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {rest.map((p) => (
                  <ProjectCard key={p.id} project={p} locale={locale} />
                ))}
              </div>
            </div>
          )}

          {/* When filtered, show all in one grid */}
          {(query || activeTech) && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {featured.map((p) => (
                <ProjectCard key={p.id} project={p} locale={locale} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
