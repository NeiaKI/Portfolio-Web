-- ─────────────────────────────────────────────────────────────────
-- Router usage (9Router) sync
--
-- Ringkasan pemakaian token per hari dari 9Router, di-sync oleh
-- scripts/sync-9router-usage.js (jalan lokal via cron/systemd timer).
-- Widget sidebar /api/router-usage membaca tabel ini (public read).
-- ─────────────────────────────────────────────────────────────────

create table if not exists router_usage (
  date_key date primary key,
  prompt_tokens bigint not null default 0,
  completion_tokens bigint not null default 0,
  cost numeric(14, 6) not null default 0,
  requests bigint not null default 0,
  updated_at timestamptz not null default now()
);

alter table router_usage enable row level security;

-- Public boleh baca (untuk display widget)
create policy "Public read router_usage"
  on router_usage for select
  using (true);

-- Hanya service_role yang menulis (script sync lokal pakai service key)
create policy "Service role write router_usage"
  on router_usage for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
