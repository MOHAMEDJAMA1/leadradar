-- Phase 9: Pre-Launch Hardening & Security
-- 1. Add rate limiting columns for manual scans
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS manual_scans_count integer DEFAULT 0;
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS manual_scans_reset_at timestamptz;

-- 2. Ensure monitored communities table exists with RLS (in case it was created manually)
CREATE TABLE IF NOT EXISTS public.user_monitored_communities (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, community_id)
);

ALTER TABLE public.user_monitored_communities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own monitored communities" ON public.user_monitored_communities;
CREATE POLICY "Users can view own monitored communities"
  ON public.user_monitored_communities FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own monitored communities" ON public.user_monitored_communities;
CREATE POLICY "Users can manage own monitored communities"
  ON public.user_monitored_communities FOR ALL
  USING (auth.uid() = user_id);

-- 3. Audit check for leads (confirming user_id isolation)
-- (Already handled in schema.sql but good to keep in mind)
