-- Create table to track failed Google Sheets syncs for retry
CREATE TABLE public.failed_syncs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  payload JSONB NOT NULL,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'retrying', 'success', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_retry_at TIMESTAMP WITH TIME ZONE,
  next_retry_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '5 minutes')
);

-- Enable RLS
ALTER TABLE public.failed_syncs ENABLE ROW LEVEL SECURITY;

-- Admin can view all failed syncs
CREATE POLICY "Admins can view all failed syncs"
ON public.failed_syncs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Service role can manage failed syncs (for edge functions)
CREATE POLICY "Service role can manage failed syncs"
ON public.failed_syncs
FOR ALL
USING (true)
WITH CHECK (true);

-- Create index for efficient retry queries
CREATE INDEX idx_failed_syncs_status_retry ON public.failed_syncs(status, next_retry_at) 
WHERE status IN ('pending', 'retrying');