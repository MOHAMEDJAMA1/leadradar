-- Phase 12: Advanced Security Hardening
-- 1. Protect rate limit columns from being manually updated by users
-- We use a trigger to ensure only the system (service_role) or restricted server-side logic
-- can update manual_scans_count, ai_replies_count, and their reset timestamps.

CREATE OR REPLACE FUNCTION public.protect_user_settings_metadata()
RETURNS TRIGGER AS $$
BEGIN
    -- If the role is 'authenticated' (direct user access via client), 
    -- block changes to sensitive columns.
    IF (auth.role() = 'authenticated') THEN
        -- Revert sensitive columns to their OLD values if they were changed
        NEW.manual_scans_count := OLD.manual_scans_count;
        NEW.manual_scans_reset_at := OLD.manual_scans_reset_at;
        NEW.ai_replies_count := OLD.ai_replies_count;
        NEW.ai_replies_reset_at := OLD.ai_replies_reset_at;
        NEW.last_scan_at := OLD.last_scan_at;
        NEW.last_scan_summary := OLD.last_scan_summary;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS tr_protect_user_settings_metadata ON public.user_settings;

-- Create the trigger
CREATE TRIGGER tr_protect_user_settings_metadata
    BEFORE UPDATE ON public.user_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_user_settings_metadata();

-- 2. Audit check for API Key Exposure
-- Ensure no tables store sensitive keys that are accessible via RLS
-- user_settings: OK (vitals only)
-- leads: OK (snippets only)
-- tracked_keywords/communities: OK (user-defined only)

-- 3. Security Note: Service Role Usage
-- This trigger effectively means the server actions MUST use the Service Role 
-- to update these specific columns if we want them to bypass this, 
-- OR we can refine the check to allow specific server-side identifiers if available.
-- Actually, Server Actions in Next.js also use the 'authenticated' role if 
-- createClient() uses the request cookies.
-- If we want the server actions to be able to increment these, we should use
-- the service role for the increment logic.

-- Let's update the trigger to allow the service_role and also allow 
-- 'authenticated' role IF we trust our server actions.
-- However, the user said "no one can hack it", meaning even if they use the 
-- frontend supabase client.
-- So the pattern of using service_role on backend for limit increments is correct.
