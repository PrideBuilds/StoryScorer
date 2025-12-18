-- Create story_history table for tracking changes
CREATE TABLE IF NOT EXISTS public.story_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES public.user_stories(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  story_text TEXT NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(story_id, version)
);

-- Enable Row Level Security
ALTER TABLE public.story_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: users can read history of their own stories
CREATE POLICY "Users can read history of their own stories"
  ON public.story_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_stories
      WHERE user_stories.id = story_history.story_id
      AND user_stories.user_id = auth.uid()
    )
  );

-- Create RLS policy: users can insert history for their own stories
CREATE POLICY "Users can insert history for their own stories"
  ON public.story_history
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_stories
      WHERE user_stories.id = story_history.story_id
      AND user_stories.user_id = auth.uid()
    )
  );

-- Create function to automatically create history entry when story is updated
CREATE OR REPLACE FUNCTION public.handle_story_update()
RETURNS TRIGGER AS $$
DECLARE
  next_version INTEGER;
BEGIN
  -- Get the next version number
  SELECT COALESCE(MAX(version), 0) + 1 INTO next_version
  FROM public.story_history
  WHERE story_id = NEW.id;

  -- Insert history entry with old values
  INSERT INTO public.story_history (story_id, version, story_text, score)
  VALUES (NEW.id, next_version, OLD.story_text, OLD.score);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to create history entry on story update
CREATE TRIGGER on_story_updated
  AFTER UPDATE ON public.user_stories
  FOR EACH ROW
  WHEN (OLD.story_text IS DISTINCT FROM NEW.story_text OR OLD.score IS DISTINCT FROM NEW.score)
  EXECUTE FUNCTION public.handle_story_update();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_story_history_story_id ON public.story_history(story_id);
CREATE INDEX IF NOT EXISTS idx_story_history_version ON public.story_history(story_id, version DESC);
CREATE INDEX IF NOT EXISTS idx_story_history_created_at ON public.story_history(created_at DESC);

