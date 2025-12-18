-- Complete Database Schema for StoryScorer
-- This file contains all migrations in order for easy setup
-- Run this file in Supabase SQL Editor to set up the entire database schema

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================

-- Create profiles table that extends auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  company TEXT,
  job_title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: users can read their own profile
CREATE POLICY "Users can read their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Create RLS policy: users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create RLS policy: users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create trigger to update updated_at on profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create index on id
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- ============================================================================
-- 2. SUBSCRIPTIONS TABLE
-- ============================================================================

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: users can read their own subscription
CREATE POLICY "Users can read their own subscription"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS policy: users can update their own subscription
CREATE POLICY "Users can update their own subscription"
  ON public.subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at on subscriptions table
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- ============================================================================
-- 3. USAGE TRACKING TABLE
-- ============================================================================

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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON public.usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_feature_used ON public.usage_tracking(feature_used);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_period ON public.usage_tracking(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_period ON public.usage_tracking(user_id, period_start, period_end);

-- ============================================================================
-- 4. USER STORIES TABLE
-- ============================================================================

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
DROP TRIGGER IF EXISTS update_user_stories_updated_at ON public.user_stories;
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

-- ============================================================================
-- 5. STORY HISTORY TABLE
-- ============================================================================

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
DROP TRIGGER IF EXISTS on_story_updated ON public.user_stories;
CREATE TRIGGER on_story_updated
  AFTER UPDATE ON public.user_stories
  FOR EACH ROW
  WHEN (OLD.story_text IS DISTINCT FROM NEW.story_text OR OLD.score IS DISTINCT FROM NEW.score)
  EXECUTE FUNCTION public.handle_story_update();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_story_history_story_id ON public.story_history(story_id);
CREATE INDEX IF NOT EXISTS idx_story_history_version ON public.story_history(story_id, version DESC);
CREATE INDEX IF NOT EXISTS idx_story_history_created_at ON public.story_history(created_at DESC);

