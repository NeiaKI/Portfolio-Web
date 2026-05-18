"use client";

import { useTranslations } from "next-intl";
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiVuedotjs,
  SiTailwindcss, SiHtml5, SiCss, SiSvelte, SiFramer,
  SiFigma, SiThreedotjs, SiVite, SiFlutter, SiBootstrap,
  SiNodedotjs, SiGo, SiPython, SiFastapi, SiExpress,
  SiGraphql, SiLaravel, SiNestjs,
  SiPostgresql, SiSupabase, SiSqlite, SiMongodb, SiRedis, SiPrisma,
  SiDocker, SiGit, SiGithubactions, SiVercel, SiNginx, SiGnubash,
  SiLinux, SiBlender, SiHyprland,
  SiReactquery, SiZod, SiPnpm, SiBun,
} from "react-icons/si";
import { FaJava, FaAndroid } from "react-icons/fa";
import { TbBrandReactNative } from "react-icons/tb";
import type { IconType } from "react-icons";

interface Skill {
  name: string;
  icon: IconType;
  color: string;
}

const SKILLS: Skill[] = [
  { name: "React",          icon: SiReact,           color: "#61DAFB" },
  { name: "Next.js",        icon: SiNextdotjs,       color: "currentColor" },
  { name: "TypeScript",     icon: SiTypescript,      color: "#3178C6" },
  { name: "JavaScript",     icon: SiJavascript,      color: "#F7DF1E" },
  { name: "Vue.js",         icon: SiVuedotjs,        color: "#4FC08D" },
  { name: "Tailwind CSS",   icon: SiTailwindcss,     color: "#06B6D4" },
  { name: "HTML5",          icon: SiHtml5,           color: "#E34F26" },
  { name: "CSS3",           icon: SiCss,             color: "#1572B6" },
  { name: "Svelte",         icon: SiSvelte,          color: "#FF3E00" },
  { name: "Framer Motion",  icon: SiFramer,          color: "#0055FF" },
  { name: "Figma",          icon: SiFigma,           color: "#F24E1E" },
  { name: "Three.js",       icon: SiThreedotjs,      color: "currentColor" },
  { name: "Vite",           icon: SiVite,            color: "#646CFF" },
  { name: "Flutter",        icon: SiFlutter,         color: "#02569B" },
  { name: "React Native",   icon: TbBrandReactNative, color: "#61DAFB" },
  { name: "Bootstrap",      icon: SiBootstrap,       color: "#7952B3" },
  { name: "Node.js",        icon: SiNodedotjs,       color: "#339933" },
  { name: "Go",             icon: SiGo,              color: "#00ADD8" },
  { name: "Python",         icon: SiPython,          color: "#3776AB" },
  { name: "FastAPI",        icon: SiFastapi,         color: "#009688" },
  { name: "Express.js",     icon: SiExpress,         color: "currentColor" },
  { name: "GraphQL",        icon: SiGraphql,         color: "#E10098" },
  { name: "Laravel",        icon: SiLaravel,         color: "#FF2D20" },
  { name: "NestJS",         icon: SiNestjs,          color: "#E0234E" },
  { name: "Android",        icon: FaAndroid,         color: "#3DDC84" },
  { name: "PostgreSQL",     icon: SiPostgresql,      color: "#4169E1" },
  { name: "Supabase",       icon: SiSupabase,        color: "#3ECF8E" },
  { name: "SQLite",         icon: SiSqlite,          color: "#003B57" },
  { name: "MongoDB",        icon: SiMongodb,         color: "#47A248" },
  { name: "Redis",          icon: SiRedis,           color: "#DC382D" },
  { name: "Prisma",         icon: SiPrisma,          color: "#2D3748" },
  { name: "Docker",         icon: SiDocker,          color: "#2496ED" },
  { name: "Git",            icon: SiGit,             color: "#F05032" },
  { name: "GitHub Actions", icon: SiGithubactions,   color: "#2088FF" },
  { name: "Vercel",         icon: SiVercel,          color: "currentColor" },
  { name: "Nginx",          icon: SiNginx,           color: "#009639" },
  { name: "Bash",           icon: SiGnubash,         color: "currentColor" },
  { name: "Linux",          icon: SiLinux,           color: "currentColor" },
  { name: "Blender",        icon: SiBlender,         color: "#E87D0D" },
  { name: "React Query",    icon: SiReactquery,      color: "#FF4154" },
  { name: "Zod",            icon: SiZod,             color: "#3E67B1" },
  { name: "Bun",            icon: SiBun,             color: "#FBF0DF" },
  { name: "pnpm",           icon: SiPnpm,            color: "#F69220" },
  { name: "Java",           icon: FaJava,            color: "#007396" },
];

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
}

const PER_ROW = Math.ceil(SKILLS.length / 3);
const [row1, row2, row3] = chunk(SKILLS, PER_ROW);

function SkillPill({ skill }: { skill: Skill }) {
  const Icon = skill.icon;
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors cursor-default">
      <Icon style={{ color: skill.color === "currentColor" ? undefined : skill.color }} className="h-3.5 w-3.5 shrink-0" />
      {skill.name}
    </span>
  );
}

function MarqueeRow({ skills, reverse = false }: { skills: Skill[]; reverse?: boolean }) {
  const cls = reverse ? "animate-marquee-reverse" : "animate-marquee";
  return (
    <div className="flex gap-2 overflow-hidden">
      <div className={`flex shrink-0 gap-2 ${cls}`}>
        {skills.map((s) => <SkillPill key={`a-${s.name}`} skill={s} />)}
      </div>
      <div className={`flex shrink-0 gap-2 ${cls}`} aria-hidden>
        {skills.map((s) => <SkillPill key={`b-${s.name}`} skill={s} />)}
      </div>
    </div>
  );
}

export function SkillsSection() {
  const t = useTranslations("home");

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground">{t("skillsTitle")}</h2>

      <div className="flex flex-col gap-2 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <MarqueeRow skills={row1} />
        <MarqueeRow skills={row2} reverse />
        <MarqueeRow skills={row3} />
      </div>
    </section>
  );
}
