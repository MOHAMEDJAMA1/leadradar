-- =============================================================
-- LeadRadar — Foundational Database Schema (Phase 1)
-- Run this in the Supabase SQL Editor for your project
-- =============================================================

-- -------------------------------------------------------
-- 1. PROFILES
-- Auto-created for every new auth.users row (via trigger)
-- -------------------------------------------------------
create table if not exists public.profiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  email                text,
  business_type        text,
  onboarding_completed boolean not null default false,
  created_at           timestamptz not null default now()
);

comment on table public.profiles is 'One row per authenticated user. Linked to auth.users.';

-- -------------------------------------------------------
-- 2. TRACKED KEYWORDS
-- Keywords the user wants to monitor
-- -------------------------------------------------------
create table if not exists public.tracked_keywords (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  keyword    text not null,
  category   text,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.tracked_keywords is 'Keywords tracked per user for lead matching.';
create index if not exists tracked_keywords_user_id_idx on public.tracked_keywords(user_id);

-- -------------------------------------------------------
-- 3. SOURCES
-- External data sources (e.g. Reddit)
-- -------------------------------------------------------
create table if not exists public.sources (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  type       text not null check (type in ('reddit', 'twitter', 'hn', 'other')),
  is_active  boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table public.sources is 'Data sources LeadRadar scans (e.g. Reddit). Platform-level, not per-user.';

-- Seed the initial Reddit source
insert into public.sources (name, type) values ('Reddit', 'reddit')
on conflict do nothing;

-- -------------------------------------------------------
-- 4. COMMUNITIES
-- Subreddits or other community spaces
-- -------------------------------------------------------
create table if not exists public.communities (
  id         uuid primary key default gen_random_uuid(),
  source_id  uuid not null references public.sources(id) on delete cascade,
  name       text not null,  -- subreddit name, without 'r/'
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  unique (source_id, name)
);

comment on table public.communities is 'Individual communities per source (e.g. individual subreddits).';
create index if not exists communities_source_id_idx on public.communities(source_id);

-- Seed default subreddits
insert into public.communities (source_id, name)
select s.id, sub.name
from public.sources s, (
  values
    ('startups'),
    ('entrepreneur'),
    ('smallbusiness'),
    ('ecommerce'),
    ('marketing'),
    ('SaaS'),
    ('PPC'),
    ('SEO'),
    ('webdev'),
    ('shopify')
) as sub(name)
where s.type = 'reddit'
on conflict do nothing;

-- -------------------------------------------------------
-- 5. LEADS
-- Matched posts from scanning
-- -------------------------------------------------------
create table if not exists public.leads (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references public.profiles(id) on delete cascade,
  keyword_id           uuid references public.tracked_keywords(id) on delete set null,
  source_id            uuid references public.sources(id) on delete set null,
  community_id         uuid references public.communities(id) on delete set null,
  title                text,
  content_snippet      text,
  full_content         text,
  author_name          text,
  source_url           text,
  external_post_id     text not null,
  matched_keyword      text,
  intent_score_numeric integer,
  intent_level         text check (intent_level in ('high', 'medium', 'low')),
  match_reasons_json   jsonb,
  status               text not null default 'new'
                         check (status in ('new', 'viewed', 'saved', 'contacted', 'dismissed')),
  detected_at          timestamptz,
  created_at           timestamptz not null default now(),

  -- Deduplication: one user should not receive the same post for the same keyword twice
  unique (user_id, external_post_id, matched_keyword)
);

comment on table public.leads is 'Each matched post becomes a lead with intent score, status, and match explanation.';
create index if not exists leads_user_id_idx on public.leads(user_id);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_intent_level_idx on public.leads(intent_level);
create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists leads_user_status_idx on public.leads(user_id, status);
create index if not exists leads_matched_keyword_idx on public.leads(matched_keyword);

-- -------------------------------------------------------
-- 6. ALERTS
-- In-app notifications for matched leads
-- -------------------------------------------------------
create table if not exists public.alerts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  lead_id    uuid references public.leads(id) on delete cascade,
  title      text,
  message    text,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.alerts is 'In-app alert notifications, linked to matched leads.';
create index if not exists alerts_user_id_idx on public.alerts(user_id);
create index if not exists alerts_is_read_idx on public.alerts(is_read);

-- -------------------------------------------------------
-- 7. USER SETTINGS
-- Per-user scan and notification preferences
-- -------------------------------------------------------
create table if not exists public.user_settings (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references public.profiles(id) on delete cascade,
  scan_frequency        text not null default '1h',
  email_alerts_enabled  boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (user_id)
);

comment on table public.user_settings is 'Per-user configuration: scan frequency, alert preferences.';

-- =============================================================
-- TRIGGER: Auto-create a profile row when a new user signs up
-- =============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = 'public'
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================

-- profiles
alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- tracked_keywords
alter table public.tracked_keywords enable row level security;

drop policy if exists "Users can view own keywords" on public.tracked_keywords;
create policy "Users can view own keywords"
  on public.tracked_keywords for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own keywords" on public.tracked_keywords;
create policy "Users can insert own keywords"
  on public.tracked_keywords for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own keywords" on public.tracked_keywords;
create policy "Users can update own keywords"
  on public.tracked_keywords for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own keywords" on public.tracked_keywords;
create policy "Users can delete own keywords"
  on public.tracked_keywords for delete
  using (auth.uid() = user_id);

-- sources (public read — platform-level data)
alter table public.sources enable row level security;

drop policy if exists "Anyone can read sources" on public.sources;
create policy "Anyone can read sources"
  on public.sources for select
  using (true);

-- communities (public read — platform-level data)
alter table public.communities enable row level security;

drop policy if exists "Anyone can read communities" on public.communities;
create policy "Anyone can read communities"
  on public.communities for select
  using (true);

-- leads
alter table public.leads enable row level security;

drop policy if exists "Users can view own leads" on public.leads;
create policy "Users can view own leads"
  on public.leads for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own leads" on public.leads;
create policy "Users can insert own leads"
  on public.leads for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own leads" on public.leads;
create policy "Users can update own leads"
  on public.leads for update
  using (auth.uid() = user_id);

-- alerts
alter table public.alerts enable row level security;

drop policy if exists "Users can view own alerts" on public.alerts;
create policy "Users can view own alerts"
  on public.alerts for select
  using (auth.uid() = user_id);

drop policy if exists "Users can mark own alerts as read" on public.alerts;
create policy "Users can mark own alerts as read"
  on public.alerts for update
  using (auth.uid() = user_id);

-- user_settings
alter table public.user_settings enable row level security;

drop policy if exists "Users can view own settings" on public.user_settings;
create policy "Users can view own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own settings" on public.user_settings;
create policy "Users can insert own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own settings" on public.user_settings;
create policy "Users can update own settings"
  on public.user_settings for update
  using (auth.uid() = user_id);

-- =============================================================
-- 8. WAITLIST
-- Pre-launch signups. No auth required.
-- =============================================================
create table if not exists public.waitlist (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  service_type text,
  created_at   timestamptz not null default now(),
  unique (email)
);

comment on table public.waitlist is 'Pre-launch waitlist. Stores email and optional service type.';
create index if not exists waitlist_email_idx on public.waitlist(email);
create index if not exists waitlist_created_at_idx on public.waitlist(created_at desc);

alter table public.waitlist enable row level security;

drop policy if exists "Anyone can join waitlist" on public.waitlist;
create policy "Anyone can join waitlist"
  on public.waitlist for insert
  with check (true);

drop policy if exists "No public read access to waitlist" on public.waitlist;
create policy "No public read access to waitlist"
  on public.waitlist for select
  using (false);
