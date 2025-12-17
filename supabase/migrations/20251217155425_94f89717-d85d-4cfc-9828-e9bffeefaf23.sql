-- Fix: Add missing UPDATE and DELETE policies for chat_messages table
CREATE POLICY "Users can update own messages" 
ON public.chat_messages 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages" 
ON public.chat_messages 
FOR DELETE 
USING (auth.uid() = user_id);

-- Fix: Replace overly permissive lawyer profile access policy
-- First drop the existing policy
DROP POLICY IF EXISTS "Lawyers can view client profiles" ON public.profiles;

-- Create a new restricted policy that only allows lawyers to view profiles of users whose cases they are assigned to
CREATE POLICY "Lawyers can view assigned client profiles" 
ON public.profiles 
FOR SELECT 
USING (
  public.has_role(auth.uid(), 'lawyer') AND
  EXISTS (
    SELECT 1 FROM public.cases
    WHERE cases.user_id = profiles.user_id
    AND cases.assigned_lawyer_id = auth.uid()
  )
);