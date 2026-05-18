"use client";

import { useTranslations } from "next-intl";
import { ProjectCard } from "./project-card";
import type { Project } from "@/types/database";

interface ProjectListProps {
  projects: Project[];
  locale: string;
}

export function ProjectList({ projects, locale }: ProjectListProps) {
  const t = useTranslations("project");

  return (
    <div className="flex flex-col gap-6">
      {projects.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">{t("noResults")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} locale={locale} featured={p.is_featured} />
          ))}
        </div>
      )}
    </div>
  );
}
