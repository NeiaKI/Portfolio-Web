-- ─────────────────────────────────────────────────────────────────
-- Security hardening
--
-- 1. increment_post_views: validasi slug + cabut akses anon
-- 2. certificates bucket: hapus write policy yang terlalu longgar
-- 3. api_cache: jadikan server-only (tidak lagi public-readable)
--
-- Jalankan setelah 001–003 via SQL Editor. Idempotent.
-- ─────────────────────────────────────────────────────────────────

-- ── 1. increment_post_views ────────────────────────────────────────
-- Sebelumnya anon di-grant execute, sehingga RPC bisa dipanggil LANGSUNG
-- lewat PostgREST (rest/v1/rpc/...) memakai anon key publik — melewati
-- rate limit di /api/views/[slug] sepenuhnya (inflasi view + insert slug
-- sampah tak terbatas). Sekarang:
--   • slug divalidasi di dalam fungsi (defense-in-depth), dan
--   • hanya service_role (server/admin client) yang boleh execute.
create or replace function increment_post_views(post_slug text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_views bigint;
begin
  if post_slug !~ '^[a-z0-9-]{1,100}$' then
    raise exception 'invalid slug';
  end if;

  insert into post_views (slug, views, updated_at)
  values (post_slug, 1, now())
  on conflict (slug) do update
    set views = post_views.views + 1,
        updated_at = now()
  returning views into new_views;

  return new_views;
end;
$$;

revoke execute on function increment_post_views(text) from public, anon, authenticated;
grant execute on function increment_post_views(text) to service_role;

-- ── 2. certificates storage bucket ─────────────────────────────────
-- Policy lama memberi SEMUA user authenticated hak insert/update/delete
-- pada bucket (hanya cek bucket_id, bukan owner). Situs ini tidak punya
-- signup, jadi upload dilakukan owner via dashboard (service_role, yang
-- bypass RLS). Policy authenticated tersebut hanya menjadi attack surface
-- jika signup publik suatu saat diaktifkan → dihapus.
drop policy if exists "Auth upload certificates bucket" on storage.objects;
drop policy if exists "Auth update certificates bucket" on storage.objects;
drop policy if exists "Auth delete certificates bucket" on storage.objects;
-- "Public read certificates bucket" sengaja dipertahankan (sertifikat publik).

-- ── 3. api_cache ───────────────────────────────────────────────────
-- Cache ditulis & dibaca server-side via service_role (admin client),
-- jadi tidak perlu dibuka untuk anon. Menutup policy ini mencegah anon
-- membaca seluruh isi cache memakai anon key publik.
drop policy if exists "Public read api_cache" on api_cache;
