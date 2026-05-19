-- Add credential_id column for certificate verification numbers
alter table certificates add column if not exists credential_id text;

-- Supabase Storage bucket for certificate uploads (PDF + images)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'certificates',
  'certificates',
  true,
  10485760,  -- 10 MB limit per file
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- PostgreSQL tidak support CREATE POLICY IF NOT EXISTS, jadi pakai DROP + CREATE
-- untuk idempotency.

drop policy if exists "Public read certificates bucket" on storage.objects;
create policy "Public read certificates bucket"
  on storage.objects for select
  using (bucket_id = 'certificates');

drop policy if exists "Auth upload certificates bucket" on storage.objects;
create policy "Auth upload certificates bucket"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'certificates');

drop policy if exists "Auth update certificates bucket" on storage.objects;
create policy "Auth update certificates bucket"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'certificates');

drop policy if exists "Auth delete certificates bucket" on storage.objects;
create policy "Auth delete certificates bucket"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'certificates');
