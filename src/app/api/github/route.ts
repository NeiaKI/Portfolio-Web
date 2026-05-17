import { NextResponse } from "next/server";

const REPOS = [
  "SISTEM-INFORMASI-MANAJEMEN",
  "inventaris-lab",
  "portofolio-3d-asset",
];

const OWNER = "NeiaKI";

const DESCRIPTIONS: Record<string, string> = {
  "portofolio-3d-asset": "Koleksi aset 3D untuk portfolio — model interaktif berbasis web menggunakan Three.js.",
  "SISTEM-INFORMASI-MANAJEMEN": "Sistem informasi manajemen berbasis web untuk pengelolaan data organisasi.",
  "inventaris-lab": "Sistem Informasi Inventaris Laboratorium Komputer — SMK Bintang Nusantara.",
};

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const results = await Promise.all(
      REPOS.map(async (repo) => {
        const ghUrl = `https://github.com/${OWNER}/${repo}`;

        const [repoRes, langsRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${OWNER}/${repo}`, {
            headers: { Accept: "application/vnd.github+json" },
            cache: "no-store",
          }),
          fetch(`https://api.github.com/repos/${OWNER}/${repo}/languages`, {
            headers: { Accept: "application/vnd.github+json" },
            cache: "no-store",
          }),
        ]);

        const data = repoRes.ok ? await repoRes.json() : {};
        const langs = langsRes.ok ? await langsRes.json() : {};

        return {
          id: String(data.id ?? repo),
          slug: repo.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          title: repo
            .replace(/-/g, " ")
            .replace(/_/g, " ")
            .split(" ")
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" "),
          description: data.description || DESCRIPTIONS[repo] || repo,
          long_description: data.description || DESCRIPTIONS[repo] || repo,
          thumbnail_url: `https://opengraph.githubassets.com/1/${OWNER}/${repo}`,
          screenshots: [],
          tech_stack: Object.keys(langs).slice(0, 5),
          website_url: data.homepage || null,
          source_url: data.html_url || ghUrl,
          is_featured: true,
          created_at: data.created_at ?? new Date().toISOString(),
          stars: data.stargazers_count ?? 0,
          forks: data.forks_count ?? 0,
        };
      })
    );

    return NextResponse.json(results);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
