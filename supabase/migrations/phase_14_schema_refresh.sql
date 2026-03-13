-- Phase 14: Post-migration Schema Refresh
-- Explicitly notifies PostgREST to reload its schema cache.
-- This resolves issues where newly added columns (like lead_confidence) 
-- are not immediately recognized by the scanner's Supabase client.

NOTIFY pgrst, 'reload schema';
