-- Create user_stories table
CREATE TABLE IF NOT EXISTS public.user_stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  story_text TEXT NOT NULL,
  acceptance_criteria TEXT,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  analysis_result JSONB,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.user_stories ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: users can read their own stories
CREATE POLICY "Users can read their own stories"
  ON public.user_stories
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS policy: users can insert their own stories
CREATE POLICY "Users can insert their own stories"
  ON public.user_stories
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy: users can update their own stories
CREATE POLICY "Users can update their own stories"
  ON public.user_stories
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create RLS policy: users can delete their own stories
CREATE POLICY "Users can delete their own stories"
  ON public.user_stories
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at on user_stories table
CREATE TRIGGER update_user_stories_updated_at
  BEFORE UPDATE ON public.user_stories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_stories_user_id ON public.user_stories(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stories_created_at ON public.user_stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_stories_score ON public.user_stories(score);

-- Create full-text search index on story_text
CREATE INDEX IF NOT EXISTS idx_user_stories_story_text_search 
  ON public.user_stories USING gin(to_tsvector('english', story_text));

-- Create index on tags array for efficient tag filtering
CREATE INDEX IF NOT EXISTS idx_user_stories_tags ON public.user_stories USING gin(tags);

