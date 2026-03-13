-- Phase 7: Multi-Source Lead Detection (X/Twitter)
-- Add platform column to distinguish reddit vs twitter

ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS platform text DEFAULT 'reddit' CHECK (platform IN ('reddit', 'twitter'));

-- Update the existing partial unique index so it only applies to Reddit posts,
-- and add a new partial unique index for Twitter posts.

-- 1. Drop existing index
DROP INDEX IF EXISTS leads_unique_post_idx;

-- 2. Create Reddit post unique index
CREATE UNIQUE INDEX IF NOT EXISTS leads_unique_reddit_post_idx 
    ON public.leads (user_id, source_url, matched_keyword) 
    WHERE lead_type = 'post' AND platform = 'reddit';

-- 3. Create Twitter post unique index
-- For Twitter, the source_url (the tweet URL) combined with user_id and matched_keyword
-- is sufficient to prevent duplicate Twitter leads. Twitter doesn't have "comments" in
-- the same structural sense as Reddit in our MVP, everything is just a tweet (post).
CREATE UNIQUE INDEX IF NOT EXISTS leads_unique_twitter_post_idx 
    ON public.leads (user_id, source_url, matched_keyword) 
    WHERE platform = 'twitter';
