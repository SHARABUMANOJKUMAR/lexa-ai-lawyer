
-- Harden has_role: only allow checking the caller's own roles, and only by signed-in users.
-- All existing RLS policies pass auth.uid() so they remain unaffected.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    auth.uid() IS NOT NULL
    AND _user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role = _role
    )
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- Restrict evidence storage policies to authenticated users only
DROP POLICY IF EXISTS "Users can upload own evidence files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own evidence files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own evidence files" ON storage.objects;

CREATE POLICY "Users can upload own evidence files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own evidence files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own evidence files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'evidence' AND auth.uid()::text = (storage.foldername(name))[1]);
