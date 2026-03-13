-- Phase 5.5 Updates
alter table public.leads add column if not exists ai_reply_generated boolean default false;
alter table public.leads add column if not exists ai_reply_text text;
alter table public.leads add column if not exists ai_reply_created_at timestamptz;

alter table public.user_settings add column if not exists ai_replies_count integer default 0;
alter table public.user_settings add column if not exists ai_replies_reset_at timestamptz;
