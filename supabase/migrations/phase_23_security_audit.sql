-- Phase 23: Security Audit & Hardening
-- 1. Create security logs table for audit trail
CREATE TABLE IF NOT EXISTS public.security_logs (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    level       text NOT NULL,
    endpoint    text NOT NULL,
    message     text NOT NULL,
    user_id     uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    ip          text,
    metadata    jsonb,
    created_at  timestamptz NOT NULL DEFAULT now()
);

-- 2. Enable RLS on security_logs (no public read/write)
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- 3. Create generic rate limits table
CREATE TABLE IF NOT EXISTS public.rate_limits (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action_type text NOT NULL, -- 'scan', 'ai_reply'
    count       integer NOT NULL DEFAULT 0,
    reset_at    timestamptz NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, action_type)
);

-- 4. Enable RLS on rate_limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- 5. Audit RLS on existing tables (Ensure they are enabled)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracked_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

-- 6. Ensure strict policies (using user_id = auth.uid())
-- These are usually in schema.sql but we re-confirm here for the audit.
-- We use DO blocks to avoid errors if policies already exist.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Users can view own leads') THEN
        CREATE POLICY "Users can view own leads" ON public.leads FOR SELECT USING (auth.uid() = user_id);
    END IF;
END
$$;

-- 7. Revoke any public access to waitlist (if exists)
REVOKE ALL ON public.waitlist FROM public;
GRANT INSERT ON public.waitlist TO anon; -- Allow joining
GRANT INSERT ON public.waitlist TO authenticated;
