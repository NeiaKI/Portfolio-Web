-- ─────────────────────────────────────────────────────────────────
-- PANDUAN PENGGUNAAN:
--
-- 1. Buka dashboard.supabase.com → pilih project kamu
-- 2. Klik "SQL Editor" di sidebar kiri
-- 3. Paste seluruh isi file ini, lalu klik "Run"
--
-- CARA ISI KOLOM:
--   slug             : kebab-case unik (dipakai sebagai URL: /projects/[slug])
--   title            : nama proyek
--   description      : 1-2 kalimat ringkas (untuk kartu di list)
--   long_description : markdown panjang (untuk halaman detail)
--   thumbnail_url    : gambar thumbnail (16:9 ideal)
--                      - Upload ke Storage bucket "projects" lalu copy public URL
--                      - Atau path lokal: /screenshots/xxx.png
--   screenshots      : array URL gambar (galeri di halaman detail)
--   tech_stack       : array string, contoh: array['Next.js', 'TypeScript', 'Supabase']
--   website_url      : link demo / production
--   source_url       : link GitHub
--   is_featured      : true = tampil di home page (max 3 disarankan)
-- ─────────────────────────────────────────────────────────────────

-- Storage bucket untuk thumbnail & screenshot proyek
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'projects',
  'projects',
  true,
  10485760,  -- 10 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do nothing;

-- PostgreSQL tidak support CREATE POLICY IF NOT EXISTS — pakai DROP + CREATE.
drop policy if exists "Public read projects bucket" on storage.objects;
create policy "Public read projects bucket"
  on storage.objects for select
  using (bucket_id = 'projects');

drop policy if exists "Auth upload projects bucket" on storage.objects;
create policy "Auth upload projects bucket"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'projects');

drop policy if exists "Auth update projects bucket" on storage.objects;
create policy "Auth update projects bucket"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'projects');

drop policy if exists "Auth delete projects bucket" on storage.objects;
create policy "Auth delete projects bucket"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'projects');

-- Hapus data lama (opsional)
-- truncate table projects restart identity;

insert into projects (slug, title, description, long_description, thumbnail_url, screenshots, tech_stack, website_url, source_url, is_featured)
values
  (
    'acadtrack',
    'AcadTrack',
    'Platform manajemen tugas & proyek kuliah untuk mahasiswa dan dosen — submit, review, dan pantau progres kelas dalam satu dashboard.',
    E'AcadTrack adalah sistem informasi manajemen akademik yang memudahkan koordinasi antara mahasiswa dan dosen.\n\n## Fitur\n\n- **Dashboard dosen** — buat tugas, tentukan deadline, review submission\n- **Dashboard mahasiswa** — submit tugas, lihat status review, notifikasi deadline\n- **Manajemen kelas** — kelola anggota, grup, dan proyek per semester\n- **Autentikasi** berbasis role (dosen / mahasiswa)\n\n## Tech Stack\n\nDibangun menggunakan PHP + Laravel untuk backend, MySQL sebagai database, dan Blade template untuk frontend.',
    '/images/projects/sistem-informasi-manajemen.png',
    array[]::text[],
    array['Laravel', 'PHP', 'MySQL', 'Blade', 'Bootstrap'],
    null,
    'https://github.com/NeiaKI/SISTEM-INFORMASI-MANAJEMEN',
    true
  ),
  (
    'inventaris-lab',
    'Inventaris Lab',
    'Sistem Informasi Inventaris Laboratorium Komputer — SMK Bintang Nusantara.',
    E'Aplikasi web untuk manajemen inventaris laboratorium komputer di SMK Bintang Nusantara.\n\n## Fitur\n\n- **CRUD inventaris** — tambah, edit, hapus, dan cari perangkat lab\n- **Kategorisasi** — komputer, peripheral, furniture, lisensi software\n- **Laporan** — ekspor data inventaris ke PDF / Excel\n- **Multi-user** — admin lab dan kepala sekolah dengan hak akses berbeda\n\n## Tech Stack\n\nNext.js App Router + TypeScript untuk frontend dan API routes, PostgreSQL via Supabase untuk database.',
    '/images/projects/inventaris-lab.png',
    array[]::text[],
    array['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS'],
    'https://inventaris-lab-two.vercel.app/',
    'https://github.com/NeiaKI/inventaris-lab',
    true
  ),
  (
    'portofolio-3d-asset',
    'Portofolio 3D Asset',
    'Koleksi aset 3D stylized-realistic untuk game, cinematic, dan visual storytelling — model interaktif berbasis web menggunakan Three.js.',
    E'Web showcase untuk koleksi 3D asset yang saya buat menggunakan Blender. Setiap model dapat dilihat secara interaktif langsung di browser.\n\n## Fitur\n\n- **Viewer 3D interaktif** — orbit, zoom, pan dengan React Three Fiber\n- **Gallery** — koleksi model dengan filter berdasarkan kategori\n- **Detail page** — spesifikasi model, poly count, format export\n- **Responsive** — bekerja di desktop dan mobile\n\n## Asset Categories\n\nEnvironment props, karakter stylized, vehicle, dan architectural visualization.',
    '/images/projects/portofolio-3d-asset.png',
    array[]::text[],
    array['Next.js', 'Three.js', 'React Three Fiber', 'TypeScript', 'Blender'],
    'https://portofolio-3d-asset.vercel.app/',
    'https://github.com/NeiaKI/portofolio-3d-asset',
    true
  ),
  (
    'portfolio-web',
    'Portfolio Web v2',
    'Personal hub & portfolio — bilingual (ID/EN), Catppuccin-themed, MDX blog, live integrations, dan Supabase backend.',
    E'Rebuild total dari portfolio saya. Tujuannya satu: buat sesuatu yang terasa *milik sendiri* — cepat, opinionated, dan bisa terus berkembang.\n\n## Fitur\n\n- **Bilingual** Indonesia + English via next-intl\n- **Tema** Catppuccin Mocha (dark) & Latte (light)\n- **MDX blog** dengan view counter real-time via Supabase\n- **Live widgets** — Spotify now-playing, WakaTime stats, GitHub activity heatmap, Duolingo streak, MonkeyType PB, cuaca lokal\n- **API cache layer** — memory + Supabase dual-layer untuk meredam rate-limit\n- **Contact form** via Web3Forms + rate limiting\n- **OG image** dinamis per halaman\n- **RSS feed** & sitemap otomatis',
    null,
    array[]::text[],
    array['Next.js 16', 'TypeScript', 'Tailwind v4', 'shadcn/ui', 'Supabase', 'MDX', 'Bun'],
    'https://nateeki.dev',
    'https://github.com/NeiaKI/Portfolio-Web',
    false
  )
on conflict (slug) do update set
  title            = excluded.title,
  description      = excluded.description,
  long_description = excluded.long_description,
  thumbnail_url    = excluded.thumbnail_url,
  tech_stack       = excluded.tech_stack,
  website_url      = excluded.website_url,
  source_url       = excluded.source_url,
  is_featured      = excluded.is_featured;
