
-- 1. Lock down user_roles: only admins may modify
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles"
ON public.user_roles FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Prevent users from setting/changing assigned_lawyer_id on cases
CREATE OR REPLACE FUNCTION public.protect_assigned_lawyer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.assigned_lawyer_id IS NOT NULL AND NOT has_role(auth.uid(), 'admin'::app_role) THEN
      RAISE EXCEPTION 'Only admins can assign a lawyer to a case';
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.assigned_lawyer_id IS DISTINCT FROM OLD.assigned_lawyer_id
       AND NOT has_role(auth.uid(), 'admin'::app_role) THEN
      RAISE EXCEPTION 'Only admins can change the assigned lawyer for a case';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_assigned_lawyer_trg ON public.cases;
CREATE TRIGGER protect_assigned_lawyer_trg
BEFORE INSERT OR UPDATE ON public.cases
FOR EACH ROW EXECUTE FUNCTION public.protect_assigned_lawyer();

-- 3. Tighten EXECUTE on SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.generate_case_number() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.verify_lawyer_assignment() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_assigned_lawyer() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
