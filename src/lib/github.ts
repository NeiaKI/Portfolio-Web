import "server-only";
import { withCache } from "@/lib/api-cache";
import type { Project } from "@/types/database";

const OWNER = "NeiaKI";

type RepoConfig = {
  description?: string;
  website_url?: string;
  thumbnail_url?: string;
  title?: string;
};

export const REPO_CONFIG: Record<string, RepoConfig> = {
  "SISTEM-INFORMASI-MANAJEMEN": {
    title: "AcadTrack",
    description:
      "Platform manajemen tugas & proyek kuliah untuk mahasiswa dan dosen — submit, review, dan pantau progres kelas dalam satu dashboard.",
    thumbnail_url: "/images/projects/sistem-informasi-manajemen.png",
  },
  "inventaris-lab": {
    description:
      "Sistem Informasi Inventaris Laboratorium Komputer — SMK Bintang Nusantara.",
    website_url: "https://inventaris-lab-two.vercel.app/",
    thumbnail_url: "/images/projects/inventaris-lab.png",
  },
  "portofolio-3d-asset": {
    description:
      "Koleksi aset 3D stylized-realistic untuk game, cinematic, dan visual storytelling — model interaktif berbasis web menggunakan Three.js.",
    website_url: "https://portofolio-3d-asset.vercel.app/",
    thumbnail_url: "/images/projects/portofolio-3d-asset.png",
  },
};

export const REPOS = Object.keys(REPO_CONFIG);

export function getThumbnail(repo: string, config: RepoConfig): string {
  if (config.thumbnail_url) return config.thumbnail_url;
  if (config.website_url) {
    return `https://image.thum.io/get/width/800/crop/500/noanimate/${config.website_url}`;
  }
  return `https://opengraph.githubassets.com/1/${OWNER}/${repo}`;
}

export async function fetchGithubProjects(): Promise<Project[]> {
  const token = process.env.GITHUB_TOKEN;
  const ghHeaders: HeadersInit = {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const results = await Promise.all(
    REPOS.map(async (repo) => {
      const config = REPO_CONFIG[repo] ?? {};
      const ghUrl = `https://github.com/${OWNER}/${repo}`;

      const [repoRes, langsRes] = await Promise.all([
        fetch(`https://api.github.com/repos/${OWNER}/${repo}`, { headers: ghHeaders }),
        fetch(`https://api.github.com/repos/${OWNER}/${repo}/languages`, { headers: ghHeaders }),
      ]);

      const data = repoRes.ok ? await repoRes.json() : {};
      const langs = langsRes.ok ? await langsRes.json() : {};

      const websiteUrl = config.website_url ?? data.homepage ?? null;

      return {
        id: String(data.id ?? repo),
        slug: repo.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title:
          config.title ??
          repo
            .replace(/-/g, " ")
            .replace(/_/g, " ")
            .split(" ")
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" "),
        description: config.description ?? data.description ?? repo,
        long_description: config.description ?? data.description ?? repo,
        thumbnail_url: getThumbnail(repo, { ...config, website_url: websiteUrl }),
        screenshots: [] as string[],
        tech_stack: Object.keys(langs).slice(0, 5) as string[],
        website_url: websiteUrl,
        source_url: data.html_url ?? ghUrl,
        is_featured: true,
        created_at: data.created_at ?? new Date().toISOString(),
      } satisfies Project;
    })
  );

  return results;
}

// TTL 900s (15 min) — cached untuk menghindari GitHub rate-limit
export async function getGithubProjectsCached(): Promise<Project[]> {
  return withCache<Project[]>("github:projects", 900, fetchGithubProjects);
}
