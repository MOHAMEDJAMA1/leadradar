-- Phase 4.7: Lead Quality Optimization
-- Add confidence_score column to leads table (0-100 quality score)

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS confidence_score integer;

-- Add an index to allow filtering by confidence score
CREATE INDEX IF NOT EXISTS leads_confidence_score_idx ON public.leads(confidence_score DESC);

-- Add a comment to explain the field
COMMENT ON COLUMN public.leads.confidence_score IS 'Phase 4.7: 0–100 lead quality score based on intent signals, keyword relevance, and context matching.';
