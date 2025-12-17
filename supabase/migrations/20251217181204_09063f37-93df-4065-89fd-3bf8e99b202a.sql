-- Add UPDATE policy for evidence_files table
CREATE POLICY "Users can update own evidence"
ON public.evidence_files
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);