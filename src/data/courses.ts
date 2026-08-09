export type Course = {
  id: string;
  title: string;
  provider: string;
  providerLogo?: string | null;
  completedAt: string;
  certificateUrl?: string | null;
  credentialId?: string | null;
};

/**
 * Template daftar course.
 * - Ganti isi COURSES dengan course yang kamu ambil (WPU, Udemy, dll).
 * - `completedAt` wajib diisi, format "YYYY-MM-DD" (tanggal selesai).
 * - `certificateUrl` opsional — jika diisi, tombol "View certificate" muncul.
 * - `providerLogo` opsional — path icon, jika null tampil ikon default.
 * - Urutan otomatis di-sort dari tanggal terbaru di component.
 */
export const COURSES: Course[] = [
  // ── Contoh template WPU (Web Programming UNPAS) ──
  {
    id: "wpu-example",
    title: "Contoh Course WPU — ganti judulnya",
    provider: "Web Programming UNPAS",
    providerLogo: "/icons/wpu.png",
    completedAt: "2026-02-15",
    certificateUrl: null,
    credentialId: null,
  },
  // ── Contoh template Udemy ──
  {
    id: "udemy-example",
    title: "Contoh Course Udemy — ganti judulnya",
    provider: "Udemy",
    providerLogo: "/icons/udemy.svg",
    completedAt: "2026-01-20",
    certificateUrl: null,
    credentialId: null,
  },
];
