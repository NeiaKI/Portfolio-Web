"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const SKILL_CATEGORIES = [
  {
    name: "Frontend Development",
    skills: ["React", "Next.js", "TypeScript", "JavaScript", "Vue.js", "Tailwind CSS", "HTML5", "CSS3", "Svelte", "Framer Motion"],
  },
  {
    name: "UI/UX & Libraries",
    skills: ["shadcn/ui", "Figma", "Three.js", "Vite", "Flutter", "React Native", "Bootstrap", "Framer Motion"],
  },
  {
    name: "Backend Development",
    skills: ["Node.js", "Go", "Python", "FastAPI", "Express.js", "Fiber", "Gin", "GraphQL", "REST API", "Bun", "Laravel", "NestJS"],
  },
  {
    name: "Database",
    skills: ["PostgreSQL", "Supabase", "SQLite", "MongoDB", "Redis", "Prisma"],
  },
  {
    name: "DevOps & Tools",
    skills: ["Docker", "Git", "GitHub Actions", "Vercel", "Nginx", "Bash", "Linux", "NixOS"],
  },
  {
    name: "3D & Creative",
    skills: ["Blender", "GLTF", "Three.js", "Geometry Nodes", "Shader Graph", "UV Mapping"],
  },
  {
    name: "System & Desktop",
    skills: ["Arch Linux", "Hyprland", "Waybar", "NixOS", "Nix", "Alacritty"],
  },
];

const ALL_SKILLS = [...new Set(SKILL_CATEGORIES.flatMap((c) => c.skills))];
const TOTAL = ALL_SKILLS.length;
const CAT_COUNT = SKILL_CATEGORIES.length;

function SkillTag({ name, highlight = false }: { name: string; highlight?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        highlight
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-card text-foreground hover:border-primary/50 hover:text-primary cursor-default"
      )}
    >
      {name}
    </span>
  );
}

export function SkillsSection() {
  const t = useTranslations("home");
  const [expanded, setExpanded] = useState(false);

  const marqueeItems = [...ALL_SKILLS, ...ALL_SKILLS, ...ALL_SKILLS];

  return (
    <section className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-baseline gap-2">
          <h2 className="text-xl font-bold text-foreground">{t("skillsTitle")}</h2>
          <span className="text-sm text-muted-foreground">
            ({TOTAL} skills across {CAT_COUNT} categories)
          </span>
        </div>
        <button
          onClick={() => setExpanded((p) => !p)}
          className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              Show All
            </>
          )}
        </button>
      </div>

      {/* Marquee rows */}
      <div className="flex flex-col gap-2 overflow-hidden">
        <div className="flex gap-2 animate-marquee whitespace-nowrap">
          {marqueeItems.map((skill, i) => (
            <SkillTag key={`r1-${i}`} name={skill} />
          ))}
        </div>
        <div className="flex gap-2 animate-marquee-reverse whitespace-nowrap">
          {[...marqueeItems].reverse().map((skill, i) => (
            <SkillTag key={`r2-${i}`} name={skill} />
          ))}
        </div>
      </div>

      {/* Expandable category grid */}
      {expanded && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SKILL_CATEGORIES.map((category) => (
            <div
              key={category.name}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">{category.name}</h3>
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded bg-secondary px-1.5 text-[10px] font-bold text-foreground">
                  {category.skills.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {category.skills.map((skill) => (
                  <SkillTag key={skill} name={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
