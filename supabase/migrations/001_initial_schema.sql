-- Profile (single row)
create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  username text unique not null,
  avatar_url text,
  bio text,
  tagline text,
  cv_url text,
  social_links jsonb default '{}',
  is_open_to_work boolean default true,
  updated_at timestamptz default now()
);

-- Projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  long_description text,
  thumbnail_url text,
  screenshots text[] default '{}',
  tech_stack text[] default '{}',
  website_url text,
  source_url text,
  is_featured boolean default false,
  created_at timestamptz default now()
);

-- Certificates
create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  thumbnail_url text,
  certificate_url text,
  issued_date date not null
);

-- API response cache
create table if not exists api_cache (
  key text primary key,
  data jsonb not null,
  expires_at timestamptz not null
);

-- RLS
alter table profile enable row level security;
alter table projects enable row level security;
alter table certificates enable row level security;
alter table api_cache enable row level security;

-- Public read policies
create policy "Public read profile" on profile for select using (true);
create policy "Public read projects" on projects for select using (true);
create policy "Public read certificates" on certificates for select using (true);
create policy "Public read api_cache" on api_cache for select using (true);

-- Seed: initial profile
insert into profile (full_name, username, bio, tagline, is_open_to_work)
values (
  'Eki',
  'neki',
  'A passionate software engineer and 3D artist based in Indonesia. I love building things on the web, crafting 3D assets, and tinkering with Linux.',
  'Software Engineer · 3D Artist · Linux Enthusiast',
  true
) on conflict (username) do nothing;
