"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Globe, Code2 } from "lucide-react";
import type { Project } from "@/types/database";

interface ProjectCardProps {
  project: Project;
  locale: string;
}

const TECH_COLORS: Record<string, string> = {
  "Next.js":      "bg-foreground/8 text-foreground",
  "TypeScript":   "bg-blue-500/10 text-blue-400",
  "React":        "bg-cyan-500/10 text-cyan-400",
  "Go":           "bg-sky-500/10 text-sky-400",
  "Python":       "bg-yellow-500/10 text-yellow-400",
  "Tailwind CSS": "bg-teal-500/10 text-teal-400",
  "Supabase":     "bg-emerald-500/10 text-emerald-400",
  "Docker":       "bg-blue-600/10 text-blue-400",
  "PostgreSQL":   "bg-indigo-500/10 text-indigo-400",
  "Blender":      "bg-orange-500/10 text-orange-400",
  "Arch Linux":   "bg-sky-400/10 text-sky-300",
  "Hyprland":     "bg-purple-500/10 text-purple-400",
};

function TechPill({ tech }: { tech: string }) {
  const cls = TECH_COLORS[tech] ?? "bg-muted text-muted-foreground";
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${cls}`}>
      {tech}
    </span>
  );
}

export function ProjectCard({ project, locale }: ProjectCardProps) {
  const t = useTranslations("project");

  return (
    <div className="group flex flex-col rounded-2xl border border-border/40 bg-card overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1.5">
      {/* Thumbnail */}
      <Link href={`/${locale}/project/${project.slug}`} className="block">
        <div className="relative h-44 bg-muted/50 overflow-hidden">
          {project.thumbnail_url ? (
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Code2 className="h-12 w-12 text-muted-foreground/20" />
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <Link
          href={`/${locale}/project/${project.slug}`}
          className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
        >
          {project.title}
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
          {project.description}
        </p>

        {/* Tech stack pills */}
        {project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {project.tech_stack.slice(0, 4).map((tech) => (
              <TechPill key={tech} tech={tech} />
            ))}
            {project.tech_stack.length > 4 && (
              <span className="rounded-full px-2.5 py-0.5 text-[11px] text-muted-foreground bg-muted">
                +{project.tech_stack.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Action links */}
        <div className="flex gap-2 pt-1">
          {project.website_url && (
            <a
              href={project.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Globe className="h-3 w-3" />
              {t("viewDemo")}
            </a>
          )}
          {project.source_url && (
            <a
              href={project.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              {t("viewSource")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
