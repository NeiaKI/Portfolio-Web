import { NextResponse } from "next/server";

const OWNER = "NeiaKI";

type RepoConfig = {
  description?: string;
  website_url?: string;
  thumbnail_url?: string;
  title?: string;
};

const REPO_CONFIG: Record<string, RepoConfig> = {
  "SISTEM-INFORMASI-MANAJEMEN": {
    title: "AcadTrack",
    description: "Platform manajemen tugas & proyek kuliah untuk mahasiswa dan dosen — submit, review, dan pantau progres kelas dalam satu dashboard.",
    thumbnail_url: "/images/projects/sistem-informasi-manajemen.png",
  },
  "inventaris-lab": {
    description: "Sistem Informasi Inventaris Laboratorium Komputer — SMK Bintang Nusantara.",
    website_url: "https://inventaris-lab-two.vercel.app/",
    thumbnail_url: "/images/projects/inventaris-lab.png",
  },
  "portofolio-3d-asset": {
    description: "Koleksi aset 3D stylized-realistic untuk game, cinematic, dan visual storytelling — model interaktif berbasis web menggunakan Three.js.",
    website_url: "https://portofolio-3d-asset.vercel.app/",
    thumbnail_url: "/images/projects/portofolio-3d-asset.png",
  },
};

const REPOS = Object.keys(REPO_CONFIG);

function getThumbnail(repo: string, config: RepoConfig): string {
  if (config.thumbnail_url) return config.thumbnail_url;
  if (config.website_url) {
    return `https://image.thum.io/get/width/800/crop/500/noanimate/${config.website_url}`;
  }
  return `https://opengraph.githubassets.com/1/${OWNER}/${repo}`;
}

export const dynamic = "force-dynamic";

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  const ghHeaders: HeadersInit = {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const results = await Promise.all(
      REPOS.map(async (repo) => {
        const config = REPO_CONFIG[repo] ?? {};
        const ghUrl = `https://github.com/${OWNER}/${repo}`;

        const [repoRes, langsRes] = await Promise.all([
          fetch(`https://api.github.com/repos/${OWNER}/${repo}`, {
            headers: ghHeaders,
            cache: "no-store",
          }),
          fetch(`https://api.github.com/repos/${OWNER}/${repo}/languages`, {
            headers: ghHeaders,
            cache: "no-store",
          }),
        ]);

        const data = repoRes.ok ? await repoRes.json() : {};
        const langs = langsRes.ok ? await langsRes.json() : {};

        const websiteUrl = config.website_url ?? data.homepage ?? null;

        return {
          id: String(data.id ?? repo),
          slug: repo.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          title: config.title ?? repo
            .replace(/-/g, " ")
            .replace(/_/g, " ")
            .split(" ")
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" "),
          description: config.description ?? data.description ?? repo,
          long_description: config.description ?? data.description ?? repo,
          thumbnail_url: getThumbnail(repo, { ...config, website_url: websiteUrl }),
          screenshots: [],
          tech_stack: Object.keys(langs).slice(0, 5),
          website_url: websiteUrl,
          source_url: data.html_url ?? ghUrl,
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
