-- Phase 6: Onboarding and First-Run Experience Additions
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS last_scan_at timestamptz;
