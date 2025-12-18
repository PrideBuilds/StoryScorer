-- Create usage_tracking table
CREATE TABLE IF NOT EXISTS public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  feature_used TEXT NOT NULL,
  usage_count INTEGER DEFAULT 1 NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: users can read their own usage tracking
CREATE POLICY "Users can read their own usage tracking"
  ON public.usage_tracking
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS policy: users can insert their own usage tracking
CREATE POLICY "Users can insert their own usage tracking"
  ON public.usage_tracking
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy: service role can manage all usage tracking (for internal operations)
CREATE POLICY "Service role can manage all usage tracking"
  ON public.usage_tracking
  FOR ALL
  USING (false)
  WITH CHECK (false);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON public.usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_feature_used ON public.usage_tracking(feature_used);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_period ON public.usage_tracking(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_period ON public.usage_tracking(user_id, period_start, period_end);

