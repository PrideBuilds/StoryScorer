-- Test Queries for Database Verification
-- Run these queries in Supabase SQL Editor to verify your setup

-- ============================================================================
-- 1. VERIFY TABLES EXIST
-- ============================================================================
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'subscriptions', 'usage_tracking', 'user_stories', 'story_history')
ORDER BY table_name;

-- ============================================================================
-- 2. VERIFY RLS IS ENABLED
-- ============================================================================
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'subscriptions', 'usage_tracking', 'user_stories', 'story_history');

-- ============================================================================
-- 3. VERIFY TRIGGERS EXIST
-- ============================================================================
SELECT trigger_name, event_object_table, action_timing, event_manipulation
FROM information_schema.triggers
WHERE event_object_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ============================================================================
-- 4. VERIFY INDEXES EXIST
-- ============================================================================
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'subscriptions', 'usage_tracking', 'user_stories', 'story_history')
ORDER BY tablename, indexname;

-- ============================================================================
-- 5. VERIFY POLICIES EXIST
-- ============================================================================
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- 6. CHECK RECENT PROFILES (if any users exist)
-- ============================================================================
SELECT 
  p.id,
  p.full_name,
  p.company,
  p.job_title,
  p.created_at,
  u.email
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC
LIMIT 10;

-- ============================================================================
-- 7. CHECK RECENT USER STORIES (if any exist)
-- ============================================================================
SELECT 
  us.id,
  us.user_id,
  us.title,
  us.score,
  us.created_at,
  p.full_name
FROM public.user_stories us
LEFT JOIN public.profiles p ON us.user_id = p.id
ORDER BY us.created_at DESC
LIMIT 10;

-- ============================================================================
-- 8. VERIFY FUNCTIONS EXIST
-- ============================================================================
SELECT 
  proname as function_name,
  pg_get_function_arguments(oid) as arguments
FROM pg_proc
WHERE proname IN ('handle_new_user', 'handle_updated_at', 'handle_story_update')
ORDER BY proname;

-- ============================================================================
-- TEST: Create a test profile manually (requires service role)
-- ============================================================================
-- Uncomment and modify if you want to test profile creation manually
-- Note: This bypasses the trigger, so use for testing only

/*
INSERT INTO public.profiles (id, full_name, company, job_title)
VALUES (
  gen_random_uuid(),
  'Test User',
  'Test Company',
  'Business Analyst'
)
RETURNING *;
*/

-- ============================================================================
-- TEST: Verify updated_at trigger works
-- ============================================================================
-- Uncomment and modify to test the updated_at trigger
-- Replace 'user-id-here' with an actual user ID

/*
-- Get current updated_at
SELECT id, full_name, updated_at 
FROM public.profiles 
WHERE id = 'user-id-here';

-- Update the profile
UPDATE public.profiles 
SET full_name = 'Updated Name'
WHERE id = 'user-id-here';

-- Check updated_at changed
SELECT id, full_name, updated_at 
FROM public.profiles 
WHERE id = 'user-id-here';
*/

