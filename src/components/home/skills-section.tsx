"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const SKILLS = [
  "React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS",
  "Node.js", "Python", "Go", "PostgreSQL", "Supabase",
  "Docker", "Git", "Linux", "Blender", "Three.js",
  "Framer Motion", "shadcn/ui", "Prisma", "GraphQL", "REST API",
  "Figma", "Arch Linux", "NixOS", "Bun", "Vite",
  "FastAPI", "Laravel", "Vue.js", "Svelte", "Flutter",
];

function SkillBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground">
      {name}
    </span>
  );
}

export function SkillsSection() {
  const t = useTranslations("home");
  const doubled = [...SKILLS, ...SKILLS];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col gap-4"
    >
      <h2 className="text-lg font-semibold text-foreground">{t("skillsTitle")}</h2>
      <div className="overflow-hidden rounded-xl border border-border bg-card py-4">
        <div className="flex gap-2 animate-marquee whitespace-nowrap">
          {doubled.map((skill, i) => (
            <SkillBadge key={`${skill}-${i}`} name={skill} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
