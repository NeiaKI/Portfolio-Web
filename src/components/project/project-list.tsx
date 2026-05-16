"use client";

import { ProjectCard } from "./project-card";
import type { Project } from "@/types/database";

interface ProjectListProps {
  projects: Project[];
  locale: string;
}

export function ProjectList({ projects, locale }: ProjectListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} locale={locale} />
      ))}
    </div>
  );
}
