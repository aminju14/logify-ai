-- Logify AI — Supabase schema
-- Run this in the Supabase SQL editor after creating a project.
-- Row-Level Security scopes every row to the authenticated user, so the
-- client never needs to filter by user_id manually.

-- ── logs ──
create table if not exists public.logs (
  id          text primary key,
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  date        timestamptz not null,
  title       text not null,
  tag         text not null,
  tag_color   text not null,
  time        text not null,
  input       text not null default '',
  report      jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists logs_user_date_idx on public.logs (user_id, date desc);

alter table public.logs enable row level security;

create policy "logs are owned by their user"
  on public.logs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── settings ── (one row per user; value holds the JSON Settings object)
create table if not exists public.settings (
  user_id     uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  value       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

alter table public.settings enable row level security;

create policy "settings are owned by their user"
  on public.settings
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
