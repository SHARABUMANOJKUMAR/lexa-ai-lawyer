-- Fix RLS policy for failed_syncs - remove overly permissive policy
DROP POLICY IF EXISTS "Service role can manage failed syncs" ON public.failed_syncs;

-- Add proper policies
CREATE POLICY "Users can view their own failed syncs"
ON public.failed_syncs
FOR SELECT
USING (
  case_id IN (SELECT id FROM public.cases WHERE user_id = auth.uid())
);