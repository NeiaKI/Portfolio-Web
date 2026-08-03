"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { m, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
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
  SiDeno, SiHono, SiDrizzle, SiCloudflare, SiTauri, SiStorybook,
  SiLit, SiSolid, SiQwik, SiRemix, SiNuxt, SiBiome, SiPodman,
  SiKubernetes, SiHelm, SiTerraform, SiAnsible, SiGrafana,
  SiPrometheus, SiSentry, SiPlanetscale, SiTurso, SiTestinglibrary,
  SiNpm, SiYarn, SiTmux, SiStarship, SiNixos, SiFreebsd, SiArchlinux,
  SiZsh, SiFishshell, SiClaude, SiOpenai, SiGithubcopilot,
  SiPfsense, SiOpnsense, SiOpenwrt, SiNextdns, SiQuad9,
  SiZenbrowser, SiPihole, SiAdguard, SiWireguard,
  SiTailscale, SiMullvad, SiOpenvpn,
  SiFirefoxbrowser, SiBrave, SiTorbrowser,
  SiTruenas, SiUnraid, SiProxmox, SiVim, SiNeovim, SiI3, SiBspwm, SiDwm, SiSway,
} from "react-icons/si";
import { FaJava, FaAws } from "react-icons/fa";
import type { IconType } from "react-icons";
import {
  OmarchyIcon,
  CursorIcon,
  OpencodeIcon,
  PiIcon,
  ClaudeCodeIcon,
  HeliumIcon,
  ShadcnIcon,
  GhosttyIcon,
  KittyIcon,
  HyprlandIcon,
  ZedIcon,
  NiriIcon,
} from "@/components/icons/custom-icons";

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
      S("Astro",         SiAstro,      "#BC52EE"),
      S("Svelte",        SiSvelte,     "#FF3E00"),
      S("Remix",         SiRemix,      "#000000"),
      S("SolidJS",       SiSolid,      "#2C4F7C"),
      S("Qwik",          SiQwik,       "#AC7EF4"),
      S("Lit",           SiLit,        "#324FFF"),
      S("HTML5",         SiHtml5,      "#E34F26"),
      S("CSS3",          SiCss,        "#1572B6"),
    ],
  },
  {
    name: "UI/UX & Libraries",
    skills: [
      S("Tailwind CSS",      SiTailwindcss,      "#06B6D4"),
      S("shadcn/ui",         ShadcnIcon,        "#000000"),
      S("Framer Motion",     SiFramer,           "#0055FF"),
      S("Figma",             SiFigma,            "#F24E1E"),
      S("MUI",               SiMui,              "#007FFF"),
      S("Chakra UI",         SiChakraui,         "#1BB2A9"),
      S("Ant Design",        SiAntdesign,        "#0170FE"),
      S("Bootstrap",         SiBootstrap,        "#7952B3"),
      S("Mantine",           SiMantine,          "#339AF0"),
      S("Styled Components", SiStyledcomponents, "#DB7093"),
    ],
  },
  {
    name: "Backend Development",
    skills: [
      S("Node.js",    SiNodedotjs,   "#5FA04E"),
      S("Express.js", SiExpress,     CURR),
      S("NestJS",     SiNestjs,      "#E0234E"),
      S("Fastify",    SiFastify,     CURR),
      S("Hono",       SiHono,        "#E36002"),
      S("Deno",       SiDeno,        "#000000"),
      S("Go",         SiGo,          "#00ADD8"),
      S("FastAPI",    SiFastapi,     "#009688"),
      S("Django",     SiDjango,      "#092E20"),
      S("Flask",      SiFlask,       CURR),
      S("Laravel",    SiLaravel,     "#FF2D20"),
      S("Spring Boot",SiSpringboot,  "#6DB33F"),
      S("ASP .NET",   SiDotnet,      "#512BD4"),
      S("GraphQL",    SiGraphql,     "#E10098"),
      S("tRPC",       SiTrpc,        "#2596BE"),
      S("Socket.io",  SiSocketdotio, CURR),
      S("RabbitMQ",   SiRabbitmq,    "#FF6600"),
      S("REST API",   SiNodedotjs,   "#5FA04E"),
      S("Zod",        SiZod,         "#3E67B1"),
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
      S("Rust",       SiRust,       "#000000"),
      S("PHP",        SiPhp,        "#777BB4"),
      S("Dart",       SiDart,       "#0175C2"),
    ],
  },
  {
    name: "Databases",
    skills: [
      S("PostgreSQL", SiPostgresql, "#4169E1"),
      S("MongoDB",    SiMongodb,    "#47A248"),
      S("Redis",      SiRedis,      "#FF4438"),
      S("SQLite",     SiSqlite,     "#003B57"),
      S("MariaDB",    SiMariadb,    "#003545"),
      S("Firebase",   SiFirebase,   "#DD2C00"),
      S("Supabase",   SiSupabase,   "#3FCF8E"),
      S("Prisma",     SiPrisma,     "#2D3748"),
      S("Drizzle",    SiDrizzle,    "#C5F74F"),
      S("PlanetScale",SiPlanetscale,"#000000"),
      S("Turso",      SiTurso,      "#4FF8D2"),
    ],
  },
  {
    name: "DevOps & Cloud",
    skills: [
      S("Docker",         SiDocker,     "#2496ED"),
      S("Podman",         SiPodman,     "#892CA0"),
      S("Kubernetes",     SiKubernetes, "#326CE5"),
      S("Helm",           SiHelm,       "#0F1689"),
      S("Terraform",      SiTerraform,  "#844FBA"),
      S("Ansible",        SiAnsible,    "#EE0000"),
      S("Portainer",      SiPortainer,  "#13BEF9"),
      S("Git",            SiGit,        "#F03C2E"),
      S("GitHub Actions", SiGithubactions, "#2088FF"),
      S("GitLab CI",      SiGitlab,     "#FC6D26"),
      S("Jenkins",        SiJenkins,    "#D24939"),
      S("AWS",            FaAws,        "#FF9900"),
      S("Google Cloud",   SiGooglecloud,"#4285F4"),
      S("Cloudflare",     SiCloudflare, "#F38020"),
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
      S("Cypress",         SiCypress,         "#69D3A7"),
      S("Vitest",          SiVitest,          "#00FF74"),
      S("Storybook",       SiStorybook,       "#FF4785"),
      S("Testing Library", SiTestinglibrary,  "#E33332"),
      S("Postman",         SiPostman,         "#FF6C37"),
    ],
  },
  {
    name: "State Management",
    skills: [
      S("Redux",        SiRedux,        "#764ABC"),
      S("React Query",  SiReactquery,   "#FF4154"),
      S("Recoil",       SiRecoil,       "#3578E5"),
      S("Zustand",      SiReact,        "#61DAFB"),
    ],
  },
  {
    name: "Build Tools",
    skills: [
      S("Vite",    SiVite,     "#9135FF"),
      S("Webpack", SiWebpack,  "#8DD6F9"),
      S("Turbo",   SiTurborepo, "#FF1E56"),
      S("esbuild", SiEsbuild,  "#FFCF00"),
      S("SWC",     SiSwc,      CURR),
      S("Babel",   SiBabel,    "#F9DC3E"),
      S("Biome",   SiBiome,    "#60A5FA"),
      S("Nx",      SiNx,       "#143055"),
      S("Bun",     SiBun,      "#000000"),
      S("pnpm",    SiPnpm,     "#F69220"),
      S("npm",     SiNpm,      "#CB3837"),
      S("Yarn",    SiYarn,     "#2C8EBB"),
    ],
  },
  {
    name: "Systems & Shell",
    skills: [
      S("Linux",    SiLinux,     "#FCC624"),
      S("Arch Linux", SiArchlinux,"#1793D1"),
      S("Omarchy",  OmarchyIcon, "#9ECE6A"),
      S("Hyprland", HyprlandIcon, "#58E1FF"),
      S("i3",       SiI3,        "#2ECD72"),
      S("Sway",     SiSway,      "#6875FF"),
      S("bspwm",    SiBspwm,     "#2E2E2E"),
      S("dwm",      SiDwm,       "#1177AA"),
      S("Niri",     NiriIcon,    "#FAB402"),
      S("NixOS",    SiNixos,     "#5277C3"),
      S("FreeBSD",  SiFreebsd,   "#AB2B28"),
      S("Bash",     SiGnubash,   "#4EAA25"),
      S("Zsh",      SiZsh,       "#F15A24"),
      S("Fish",     SiFishshell, "#34C534"),
      S("Tmux",     SiTmux,      "#1BB91F"),
      S("Starship", SiStarship,  "#DD0B78"),
      S("Ghostty",  GhosttyIcon, "#5B5B5B"),
      S("Kitty",    KittyIcon,  CURR),
    ],
  },
  {
    name: "Editors",
    skills: [
      S("Vim",     SiVim,     "#019733"),
      S("Neovim",  SiNeovim,  "#57A143"),
      S("Zed",     ZedIcon,   "#084CCF"),
    ],
  },
  {
    name: "Monitoring & Observability",
    skills: [
      S("Grafana",    SiGrafana,    "#F46800"),
      S("Prometheus", SiPrometheus, "#E6522C"),
      S("Sentry",     SiSentry,     "#362D59"),
    ],
  },
  {
    name: "Desktop & Mobile",
    skills: [
      S("Tauri",   SiTauri,   "#24C8D8"),
      S("Flutter", SiFlutter, "#02569B"),
      S("Blender", SiBlender,  "#E87D0D"),
    ],
  },
  {
    name: "AI Coding Tools",
    skills: [
      S("Claude",       SiClaude,        "#D97757"),
      S("Claude Code",  ClaudeCodeIcon,  "#D97757"),
      S("OpenAI",      SiOpenai,        "#10A37F"),
      S("OpenCode",     OpencodeIcon,    CURR),
      S("Cursor",       CursorIcon,      "#000000"),
      S("Pi",           PiIcon,          "#000000"),
      S("GitHub Copilot", SiGithubcopilot, "#000000"),
    ],
  },
  {
    name: "Networking & DNS",
    skills: [
      S("pfSense",   SiPfsense,   "#212121"),
      S("OPNsense",  SiOpnsense,  "#D94724"),
      S("OpenWrt",   SiOpenwrt,   "#00B5E2"),
      S("Pi-hole",   SiPihole,    "#96060C"),
      S("AdGuard",   SiAdguard,   "#68BC71"),
      S("NextDNS",   SiNextdns,   "#0055FF"),
      S("Quad9",     SiQuad9,     "#22117A"),
      S("WireGuard", SiWireguard, "#88171A"),
      S("Tailscale", SiTailscale, "#1D4ED8"),
      S("Mullvad",   SiMullvad,   "#444F9A"),
      S("OpenVPN",   SiOpenvpn,   "#EA7E20"),
    ],
  },
  {
    name: "Self-Hosting & NAS",
    skills: [
      S("TrueNAS",  SiTruenas,  "#0095D0"),
      S("Unraid",   SiUnraid,   "#F15A29"),
      S("Proxmox",  SiProxmox,  "#E57000"),
    ],
  },
  {
    name: "Browsers",
    skills: [
      S("Zen Browser", SiZenbrowser,    "#F47421"),
      S("Firefox",     SiFirefoxbrowser,"#FF7139"),
      S("Brave",       SiBrave,         "#FB542B"),
      S("Tor",         SiTorbrowser,    "#7E4798"),
      S("Helium",      HeliumIcon,      "#00B5E2"),
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

function SkillPill({
  skill,
  colored,
  duplicate = false,
  onToggleColor,
}: {
  skill: Skill;
  colored: boolean;
  duplicate?: boolean;
  onToggleColor: () => void;
}) {
  const Icon = skill.icon;
  return (
    <button
      type="button"
      tabIndex={duplicate ? -1 : 0}
      aria-pressed={colored}
      aria-label={`Toggle ${skill.name} brand color`}
      onClick={onToggleColor}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 select-none"
    >
      <Icon
        className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors"
        style={colored ? { color: skill.color } : undefined}
        aria-hidden="true"
      />
      {skill.name}
    </button>
  );
}

function MarqueeRow({
  skills,
  reverse = false,
  colored,
  onToggleColor,
}: {
  skills: Skill[];
  reverse?: boolean;
  colored: Record<string, boolean>;
  onToggleColor: (name: string) => void;
}) {
  const cls = reverse ? "animate-marquee-reverse" : "animate-marquee";
  return (
    <div className="flex gap-2 overflow-hidden">
      <div className={`flex shrink-0 gap-2 ${cls}`}>
        {skills.map((s) => (
          <SkillPill
            key={`a-${s.name}`}
            skill={s}
            colored={colored[s.name] ?? false}
            onToggleColor={() => onToggleColor(s.name)}
          />
        ))}
      </div>
      <div className={`flex shrink-0 gap-2 ${cls}`} aria-hidden>
        {skills.map((s) => (
          <SkillPill
            key={`b-${s.name}`}
            skill={s}
            colored={colored[s.name] ?? false}
            duplicate
            onToggleColor={() => onToggleColor(s.name)}
          />
        ))}
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
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground transition-colors cursor-default"
            >
              <Icon
                className="h-3 w-3 shrink-0"
                style={{ color: skill.color }}
                aria-hidden="true"
              />
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
  const [colored, setColored] = useState<Record<string, boolean>>({});

  const toggleColor = useCallback((name: string) => {
    setColored((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

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
        <MarqueeRow skills={row1} colored={colored} onToggleColor={toggleColor} />
        <MarqueeRow skills={row2} reverse colored={colored} onToggleColor={toggleColor} />
        <MarqueeRow skills={row3} colored={colored} onToggleColor={toggleColor} />
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
