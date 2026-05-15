
-- Restrict INSERT/UPDATE/DELETE on failed_syncs to admins only
-- (Service role bypasses RLS, so the edge function continues to work)
CREATE POLICY "Admins can insert failed syncs"
ON public.failed_syncs
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update failed syncs"
ON public.failed_syncs
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete failed syncs"
ON public.failed_syncs
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add UPDATE policy for evidence storage scoped to file owner
CREATE POLICY "Users can update own evidence files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);
