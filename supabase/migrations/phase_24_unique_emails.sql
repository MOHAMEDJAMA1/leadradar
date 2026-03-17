-- Phase 24: Duplicate Email Prevention
-- Add a UNIQUE constraint to public.profiles(email) to prevent multiple accounts with the same email.

-- 1. Ensure any existing duplicates are handled (though unlikely in current state)
-- If there were duplicates, we'd need a more complex strategy, but for a fresh/low-scale DB we can just apply.

ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);

-- 2. Update handle_new_user trigger to handle potential conflicts gracefully
-- (Already has ON CONFLICT DO NOTHING, but good to be sure)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;
