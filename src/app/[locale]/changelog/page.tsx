import { MainLayout } from "@/components/layout/main-layout";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("changelog") };
}

type ChangeType = "feat" | "fix" | "improve" | "remove";

interface Change {
  type: ChangeType;
  text: string;
}

interface Release {
  version: string;
  date: string;
  label?: string;
  changes: Change[];
}

const TYPE_STYLE: Record<ChangeType, string> = {
  feat:    "bg-green-500/10 text-green-400 border-green-500/20",
  fix:     "bg-red-500/10 text-red-400 border-red-500/20",
  improve: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  remove:  "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const TYPE_LABEL: Record<ChangeType, string> = {
  feat:    "feat",
  fix:     "fix",
  improve: "improve",
  remove:  "remove",
};

const RELEASES: Release[] = [
  {
    version: "v2.6",
    date: "May 2026",
    label: "Latest",
    changes: [
      { type: "feat",    text: "Terminal-style loading screen on first visit (session-based)" },
      { type: "feat",    text: "Experience section redesign — vertical timeline, pulsing dot, duration badge, collapsible highlights" },
      { type: "feat",    text: "Skills section redesign — 3-row marquee dengan brand icons + expandable category grid" },
      { type: "feat",    text: "WakaTime tracking di bash, zsh, dan Obsidian" },
      { type: "feat",    text: "WakaTime language breakdown widget di sidebar kanan" },
      { type: "feat",    text: "Blog view counter per post (Supabase optional, hidden jika tidak dikonfigurasi)" },
      { type: "feat",    text: "Custom favicon — SVG monogram 'N' dengan warna Catppuccin" },
      { type: "feat",    text: "PWA icons (icon-192 + icon-512) untuk installable web app" },
      { type: "feat",    text: "SW cache version auto-bump saat build via prebuild script" },
      { type: "feat",    text: "Now Reading widget terhubung ke /api/now-reading — update buku cukup edit now-reading.json" },
      { type: "feat",    text: "Blog listing page metadata (title, description, OG image)" },
      { type: "improve", text: "Lazy load SkillsSection — react-icons bundle di-defer untuk performa LCP lebih baik" },
      { type: "improve", text: "Icon dekoratif di skills section diberi aria-hidden untuk accessibility" },
      { type: "improve", text: "Social links diekstrak ke shared constant — tidak ada duplikasi kode" },
      { type: "improve", text: "Dark mode toggle tidak animasi saat pindah halaman" },
      { type: "fix",     text: "Production domain diupdate ke nateeki.dev di semua metadata, sitemap, dan RSS" },
      { type: "remove",  text: "Dead code local-post-list.tsx dihapus" },
    ],
  },
  {
    version: "v2.5",
    date: "May 2026",
    changes: [
      { type: "feat",    text: "PWA service worker — offline support untuk halaman & aset yang sudah dikunjungi" },
      { type: "feat",    text: "404 page bilingual — EN/ID otomatis berdasarkan locale URL" },
      { type: "feat",    text: "Related posts di akhir setiap blog post berdasarkan tag" },
      { type: "feat",    text: "Uses page locale-aware metadata (EN/ID)" },
      { type: "feat",    text: "Facebook link di hero social links" },
      { type: "feat",    text: "Mobile avatar dengan animated gradient ring di hero section" },
      { type: "feat",    text: "Command palette: blog search, theme toggle, Uses page shortcut" },
      { type: "improve", text: "Light mode — contrast dikurangi agar lebih nyaman di mata" },
      { type: "improve", text: "Certificate icons Frontend Masters & Dicoding Indonesia" },
    ],
  },
  {
    version: "v2.4",
    date: "Apr 2026",
    changes: [
      { type: "feat",    text: "Clock widget (Jakarta GMT+7) di widget sidebar" },
      { type: "feat",    text: "Blog MDX dengan syntax highlighting Catppuccin" },
      { type: "feat",    text: "Copy button on code blocks di blog post" },
      { type: "feat",    text: "Reading progress bar di blog post" },
      { type: "feat",    text: "RSS feed di /feed.xml" },
      { type: "feat",    text: "Scroll progress indicator di top of page" },
      { type: "feat",    text: "Back-to-top floating button" },
      { type: "feat",    text: "Per-post OG image dari MDX frontmatter" },
      { type: "feat",    text: "Web app manifest (PWA-ready)" },
      { type: "improve", text: "Rate limiting di API contact (3 req / 15 menit)" },
      { type: "improve", text: "Canonical URL + hreflang alternates di setiap halaman" },
    ],
  },
  {
    version: "v2.3",
    date: "Apr 2026",
    changes: [
      { type: "feat",    text: "Command palette (Ctrl+K) dengan real data projects & certificates" },
      { type: "feat",    text: "Now Reading widget di sidebar kanan" },
      { type: "feat",    text: "Contact form via Web3Forms" },
      { type: "feat",    text: "OG image per halaman (project, blog, certificates, contact)" },
      { type: "feat",    text: "JSON-LD structured data (Person + WebSite schema)" },
      { type: "feat",    text: "Sitemap.xml + robots.txt otomatis" },
      { type: "improve", text: "Project card hover shadow + lift effect" },
      { type: "improve", text: "Skeleton loaders konsisten di semua widget" },
      { type: "improve", text: "Page transitions staggered fade per section" },
    ],
  },
  {
    version: "v2.2",
    date: "Mar 2026",
    changes: [
      { type: "feat",    text: "Project detail page /project/[slug]" },
      { type: "feat",    text: "Certificates page dengan real data (20+ sertifikat)" },
      { type: "feat",    text: "Bilingual support EN + ID via next-intl v4" },
      { type: "feat",    text: "Vim-style j/k keyboard scrolling global" },
      { type: "improve", text: "Light mode palette darkened (Catppuccin Latte)" },
      { type: "improve", text: "Dark mode sebagai default untuk semua visitor" },
      { type: "fix",     text: "Brand icons (GitHub, Instagram, Twitter) — migrated from lucide ke inline SVG" },
    ],
  },
  {
    version: "v2.1",
    date: "Feb 2026",
    changes: [
      { type: "feat",    text: "Widget sidebar: Weather, Spotify, Duolingo, WakaTime, MonkeyType" },
      { type: "feat",    text: "GitHub projects API integration" },
      { type: "feat",    text: "3-column layout (nav | content | widgets)" },
      { type: "improve", text: "Tailwind v4 CSS-first config + OKLCH color system" },
    ],
  },
  {
    version: "v2.0",
    date: "Jan 2026",
    changes: [
      { type: "feat",    text: "Portfolio v2 — rebuild dari nol dengan Next.js 16 App Router" },
      { type: "feat",    text: "Catppuccin Mocha (dark) + Latte (light) theme" },
      { type: "feat",    text: "Turbopack dev server" },
      { type: "remove",  text: "Portfolio v1 deprecated" },
    ],
  },
];

export default async function ChangelogPage({ params }: Props) {
  const { locale } = await params;

  return (
    <MainLayout>
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Changelog</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {locale === "id" ? "Riwayat perubahan dan update portfolio ini" : "History of changes and updates to this portfolio"}
          </p>
        </div>

        <div className="relative flex flex-col gap-0">
          {/* Timeline line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

          {RELEASES.map((release) => (
            <div key={release.version} className="relative flex gap-5 pb-8 last:pb-0">
              {/* Dot */}
              <div className="relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-primary bg-background" />

              <div className="flex flex-col gap-3 flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-foreground text-base">{release.version}</span>
                  {release.label && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                      {release.label}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground ml-auto">{release.date}</span>
                </div>

                {/* Changes */}
                <div className="flex flex-col gap-2">
                  {release.changes.map((change, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className={`mt-0.5 rounded border px-1.5 py-0.5 text-[10px] font-semibold shrink-0 ${TYPE_STYLE[change.type]}`}>
                        {TYPE_LABEL[change.type]}
                      </span>
                      <span className="text-sm text-muted-foreground leading-relaxed">{change.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
