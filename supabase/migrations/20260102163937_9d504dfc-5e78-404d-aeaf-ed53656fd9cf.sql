-- Create function to verify lawyer role before assignment
CREATE OR REPLACE FUNCTION public.verify_lawyer_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow NULL assignments (unassignment)
  IF NEW.assigned_lawyer_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Check if the assigned user has the 'lawyer' role
  IF NOT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = NEW.assigned_lawyer_id AND role = 'lawyer'
  ) THEN
    RAISE EXCEPTION 'assigned_lawyer_id must reference a user with the lawyer role';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to enforce lawyer role validation on INSERT or UPDATE
DROP TRIGGER IF EXISTS check_lawyer_assignment ON public.cases;
CREATE TRIGGER check_lawyer_assignment
BEFORE INSERT OR UPDATE OF assigned_lawyer_id ON public.cases
FOR EACH ROW
EXECUTE FUNCTION public.verify_lawyer_assignment();