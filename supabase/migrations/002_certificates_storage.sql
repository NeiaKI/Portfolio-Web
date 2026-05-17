-- Add credential_id column for certificate verification numbers
alter table certificates add column if not exists credential_id text;

-- ─── Supabase Storage bucket for PDF uploads ───────────────────────────────
-- Create public bucket named 'certificates'
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'certificates',
  'certificates',
  true,
  10485760,  -- 10 MB limit per file
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

-- Anyone can view files (public bucket)
create policy if not exists "Public read certificates bucket"
  on storage.objects for select
  using (bucket_id = 'certificates');

-- Only authenticated users (you) can upload
create policy if not exists "Auth upload certificates bucket"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'certificates');

create policy if not exists "Auth update certificates bucket"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'certificates');

create policy if not exists "Auth delete certificates bucket"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'certificates');
