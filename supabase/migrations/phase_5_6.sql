-- Phase 5.6 Updates: Comment Lead Structure
alter table public.leads add column if not exists lead_type text default 'post';
alter table public.leads add column if not exists comment_text text;
alter table public.leads add column if not exists parent_post_title text;
alter table public.leads add column if not exists comment_url text;
alter table public.leads add column if not exists comment_id text;

-- Drop the old simple unique constraint since we now need to allow comments
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_user_id_source_url_matched_keyword_key;

-- We still want to prevent the identical lead from popping up twice for the same user + keyword.
-- For a post lead, uniqueness relies on the source_url.
-- For a comment lead, uniqueness relies on the comment_id.
-- Since unique indexes across varying combinations can be tricky in generic SQL, we will handle logical duplication checks at the application level during insertion using Supabase `upsert` or strict selection, OR we can create a sophisticated unique index:

CREATE UNIQUE INDEX IF NOT EXISTS leads_unique_post_idx ON public.leads (user_id, source_url, matched_keyword) WHERE lead_type = 'post';
CREATE UNIQUE INDEX IF NOT EXISTS leads_unique_comment_idx ON public.leads (user_id, comment_id, matched_keyword) WHERE lead_type = 'comment';
