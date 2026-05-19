-- ─────────────────────────────────────────────────────────────────
-- Post views counter
--
-- Tabel ini menyimpan jumlah views per blog post (identifikasi via slug).
-- Endpoint /api/views/[slug] memanggil RPC increment_post_views untuk
-- menaikkan counter secara atomik (upsert + increment dalam 1 query).
-- ─────────────────────────────────────────────────────────────────

create table if not exists post_views (
  slug text primary key,
  views bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table post_views enable row level security;

-- Public boleh baca counter (untuk display)
create policy "Public read post_views"
  on post_views for select
  using (true);

-- ─── RPC: increment_post_views ──────────────────────────────────
-- Atomic upsert + increment. Dipanggil dari endpoint POST /api/views/[slug].
-- Bypasses RLS karena SECURITY DEFINER (function owner = supabase_admin).
create or replace function increment_post_views(post_slug text)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_views bigint;
begin
  insert into post_views (slug, views, updated_at)
  values (post_slug, 1, now())
  on conflict (slug) do update
    set views = post_views.views + 1,
        updated_at = now()
  returning views into new_views;

  return new_views;
end;
$$;

-- Anon role boleh execute (endpoint pakai anon key)
grant execute on function increment_post_views(text) to anon, authenticated;
