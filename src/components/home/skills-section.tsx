"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { m, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Code2 } from "lucide-react";
import {
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiVuedotjs,
  SiTailwindcss, SiHtml5, SiCss, SiSvelte, SiFramer, SiAstro,
  SiFigma, SiThreedotjs, SiVite, SiFlutter, SiBootstrap,
  SiChakraui, SiMui, SiAntdesign, SiStyledcomponents, SiMantine,
  SiNodedotjs, SiGo, SiPython, SiFastapi, SiExpress, SiFastify,
  SiDjango, SiFlask, SiSpringboot, SiDotnet, SiLaravel, SiNestjs,
  SiGraphql, SiTrpc, SiSocketdotio, SiRabbitmq,
  SiKotlin, SiRust, SiPhp, SiDart,
  SiPostgresql, SiSupabase, SiSqlite, SiMongodb, SiRedis, SiPrisma,
  SiMariadb, SiFirebase,
  SiDocker, SiPortainer, SiGit, SiGithubactions, SiGitlab,
  SiVercel, SiNginx, SiNetlify, SiRailway,
  SiDigitalocean, SiApache, SiGooglecloud, SiJenkins,
  SiCypress, SiVitest, SiPostman, SiRedux,
  SiWebpack, SiTurborepo, SiEsbuild, SiSwc, SiBabel, SiNx,
  SiReactquery, SiZod, SiPnpm, SiBun, SiBlender, SiGnubash, SiLinux,
  SiRecoil,
} from "react-icons/si";
import { FaJava, FaAws } from "react-icons/fa";
import type { IconType } from "react-icons";

interface Skill {
  name: string;
  icon: IconType;
  color: string;
}

type Category = {
  name: string;
  skills: Skill[];
};

const S = (name: string, icon: IconType, color: string): Skill => ({ name, icon, color });
const CURR = "currentColor";

const CATEGORIES: Category[] = [
  {
    name: "Frontend Development",
    skills: [
      S("React",         SiReact,      "#61DAFB"),
      S("Next.js",       SiNextdotjs,  CURR),
      S("TypeScript",    SiTypescript, "#3178C6"),
      S("JavaScript",    SiJavascript, "#F7DF1E"),
      S("Vue.js",        SiVuedotjs,   "#4FC08D"),
      S("Astro",         SiAstro,      CURR),
      S("Svelte",        SiSvelte,     "#FF3E00"),
      S("HTML5",         SiHtml5,      "#E34F26"),
      S("CSS3",          SiCss,        "#1572B6"),
      S("Flutter",       SiFlutter,    "#02569B"),
    ],
  },
  {
    name: "UI/UX & Libraries",
    skills: [
      S("Tailwind CSS",      SiTailwindcss,      "#06B6D4"),
      S("shadcn/ui",         SiReact,            "#61DAFB"),
      S("Framer Motion",     SiFramer,           "#0055FF"),
      S("Figma",             SiFigma,            "#F24E1E"),
      S("MUI",               SiMui,              "#007FFF"),
      S("Chakra UI",         SiChakraui,         "#319795"),
      S("Ant Design",        SiAntdesign,        "#0170FE"),
      S("Bootstrap",         SiBootstrap,        "#7952B3"),
      S("Mantine",           SiMantine,          "#339AF0"),
      S("Styled Components", SiStyledcomponents, "#DB7093"),
    ],
  },
  {
    name: "Backend Development",
    skills: [
      S("Node.js",    SiNodedotjs,   "#339933"),
      S("Express.js", SiExpress,     CURR),
      S("NestJS",     SiNestjs,      "#E0234E"),
      S("Fastify",    SiFastify,     CURR),
      S("Go",         SiGo,          "#00ADD8"),
      S("FastAPI",    SiFastapi,     "#009688"),
      S("Django",     SiDjango,      "#092E20"),
      S("Flask",      SiFlask,       CURR),
      S("Laravel",    SiLaravel,     "#FF2D20"),
      S("Spring Boot",SiSpringboot,  "#6DB33F"),
      S("ASP .NET",   SiDotnet,      "#512BD4"),
      S("GraphQL",    SiGraphql,     "#E10098"),
      S("tRPC",       SiTrpc,        "#398CCB"),
      S("Socket.io",  SiSocketdotio, CURR),
      S("RabbitMQ",   SiRabbitmq,    "#FF6600"),
      S("REST API",   SiNodedotjs,   "#339933"),
    ],
  },
  {
    name: "Programming Languages",
    skills: [
      S("TypeScript", SiTypescript, "#3178C6"),
      S("JavaScript", SiJavascript, "#F7DF1E"),
      S("Python",     SiPython,     "#3776AB"),
      S("Go",         SiGo,         "#00ADD8"),
      S("Java",       FaJava,       "#007396"),
      S("Kotlin",     SiKotlin,     "#7F52FF"),
      S("Rust",       SiRust,       CURR),
      S("PHP",        SiPhp,        "#777BB4"),
      S("Dart",       SiDart,       "#0175C2"),
    ],
  },
  {
    name: "Databases",
    skills: [
      S("PostgreSQL", SiPostgresql, "#4169E1"),
      S("MongoDB",    SiMongodb,    "#47A248"),
      S("Redis",      SiRedis,      "#DC382D"),
      S("SQLite",     SiSqlite,     "#003B57"),
      S("MariaDB",    SiMariadb,    "#003545"),
      S("Firebase",   SiFirebase,   "#FFCA28"),
      S("Supabase",   SiSupabase,   "#3ECF8E"),
      S("Prisma",     SiPrisma,     CURR),
    ],
  },
  {
    name: "DevOps & Cloud",
    skills: [
      S("Docker",         SiDocker,     "#2496ED"),
      S("Portainer",      SiPortainer,  "#13BEF9"),
      S("Git",            SiGit,        "#F05032"),
      S("GitHub Actions", SiGithubactions, "#2088FF"),
      S("GitLab CI",      SiGitlab,     "#FC6D26"),
      S("Jenkins",        SiJenkins,    "#D24939"),
      S("AWS",            FaAws,        "#FF9900"),
      S("Google Cloud",   SiGooglecloud,"#4285F4"),
      S("Vercel",         SiVercel,     CURR),
      S("Netlify",        SiNetlify,    "#00C7B7"),
      S("Railway",        SiRailway,    CURR),
      S("DigitalOcean",   SiDigitalocean,"#0080FF"),
      S("Nginx",          SiNginx,      "#009639"),
      S("Apache",         SiApache,     "#D22128"),
    ],
  },
  {
    name: "Testing & Quality",
    skills: [
      S("Cypress",    SiCypress,  CURR),
      S("Vitest",     SiVitest,   "#6E9F18"),
      S("Postman",    SiPostman,  "#FF6C37"),
      S("Bash",       SiGnubash,  CURR),
      S("Linux",      SiLinux,    CURR),
      S("Blender",    SiBlender,  "#E87D0D"),
    ],
  },
  {
    name: "State Management",
    skills: [
      S("Redux",        SiRedux,        "#764ABC"),
      S("React Query",  SiReactquery,   "#FF4154"),
      S("Recoil",       SiRecoil,       "#1B81E7"),
      S("Zustand",      SiReact,        "#61DAFB"),
      S("Zod",          SiZod,          "#3E67B1"),
    ],
  },
  {
    name: "Build Tools",
    skills: [
      S("Vite",    SiVite,     "#646CFF"),
      S("Webpack", SiWebpack,  "#8DD6F9"),
      S("Turbo",   SiTurborepo,CURR),
      S("esbuild", SiEsbuild,  "#FFCF00"),
      S("SWC",     SiSwc,      CURR),
      S("Babel",   SiBabel,    "#F9DC3E"),
      S("Nx",      SiNx,       CURR),
      S("Bun",     SiBun,      CURR),
      S("pnpm",    SiPnpm,     "#F69220"),
    ],
  },
];

const ALL_SKILLS = CATEGORIES.flatMap((c) => c.skills);
const UNIQUE = [...new Map(ALL_SKILLS.map((s) => [s.name, s])).values()];

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const PER_ROW = Math.ceil(UNIQUE.length / 3);
const [row1, row2, row3] = chunk(UNIQUE, PER_ROW);

function SkillPill({ skill }: { skill: Skill }) {
  const Icon = skill.icon;
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40 hover:text-primary transition-colors cursor-default select-none">
      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
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

function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{category.name}</h3>
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded bg-muted px-1.5 text-[10px] font-bold text-muted-foreground">
          {category.skills.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {category.skills.map((skill) => {
          const Icon = skill.icon;
          return (
            <span
              key={skill.name}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground hover:border-primary/40 hover:text-primary transition-colors cursor-default"
            >
              <Icon className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
              {skill.name}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function SkillsSection() {
  const t = useTranslations("home");
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="flex flex-col gap-4">
      {/* Header with toggle button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h2 className="text-lg font-semibold text-foreground">{t("skillsTitle")}</h2>
          <span className="text-xs text-muted-foreground">
            ({UNIQUE.length} skills across {CATEGORIES.length} categories)
          </span>
        </div>
        <button
          onClick={() => setExpanded((p) => !p)}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          {expanded ? "Show less" : "Show all"}
        </button>
      </div>

      {/* 3-row marquee */}
      <div className="flex flex-col gap-2 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
        <MarqueeRow skills={row1} />
        <MarqueeRow skills={row2} reverse />
        <MarqueeRow skills={row3} />
      </div>

      {/* Expandable grid */}
      <AnimatePresence>
        {expanded && (
          <m.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 overflow-hidden"
          >
            {CATEGORIES.map((cat) => (
              <CategoryCard key={cat.name} category={cat} />
            ))}
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// keep import even if SiPython is unused in explicit list above
const _py = SiPython;
void _py;
