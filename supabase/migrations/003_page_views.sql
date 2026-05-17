create table if not exists page_views (
  pathname  text primary key,
  count     bigint not null default 0,
  updated_at timestamptz not null default now()
);

-- Allow anon to read and upsert (no PII stored — just path + count)
alter table page_views enable row level security;

create policy "Anyone can read page_views"
  on page_views for select
  to anon
  using (true);

create policy "Anyone can upsert page_views"
  on page_views for insert
  to anon
  with check (true);

create policy "Anyone can update page_views"
  on page_views for update
  to anon
  using (true);
