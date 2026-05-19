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
    'portfolio-web',
    'Portfolio Web v2',
    'Personal hub & portfolio website — bilingual (ID/EN), Catppuccin-themed, MDX blog, Supabase backend.',
    E'Personal portfolio v2 yang aku tulis ulang dari nol. Fitur:\n\n- **Bilingual** Indonesia + English (next-intl)\n- **Theme** Catppuccin Mocha (dark) & Latte (light)\n- **MDX blog** dengan view counter via Supabase\n- **Live integrations**: Spotify now-playing, WakaTime stats, GitHub activity\n- **CMS-lite** untuk projects & certificates (Supabase)\n- **Contact form** via Web3Forms + rate limit',
    null,
    array[]::text[],
    array['Next.js 16', 'TypeScript', 'Tailwind v4', 'shadcn/ui', 'Supabase', 'MDX', 'Bun'],
    'https://nateeki.com',
    'https://github.com/NeiaKI/Portfolio-Web',
    true
  ),
  (
    'placeholder-project-1',
    'Placeholder Project 1',
    'Ganti deskripsi ini dengan ringkasan proyek nyata kamu.',
    'Tulis long description disini dalam **markdown**.',
    null,
    array[]::text[],
    array['Next.js', 'TypeScript'],
    null,
    null,
    false
  ),
  (
    'placeholder-project-2',
    'Placeholder Project 2',
    'Ganti deskripsi ini dengan ringkasan proyek nyata kamu.',
    'Tulis long description disini dalam **markdown**.',
    null,
    array[]::text[],
    array['Go', 'PostgreSQL'],
    null,
    null,
    false
  )
on conflict (slug) do nothing;
