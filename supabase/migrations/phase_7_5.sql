-- Phase 7.5: Lead Quality Tuning & Signal Precision
-- Add lead_confidence column to categorize lead quality

ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS lead_confidence text CHECK (lead_confidence IN ('Hot', 'High', 'Medium', 'Low', null));

