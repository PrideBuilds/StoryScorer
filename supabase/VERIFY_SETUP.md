# Verifying Database Setup

This guide will help you verify that your database schema is set up correctly.

## Step 1: Verify Tables Exist

Run this query in Supabase SQL Editor to check all tables exist:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'subscriptions', 'usage_tracking', 'user_stories', 'story_history')
ORDER BY table_name;
```

You should see all 5 tables listed.

## Step 2: Verify RLS is Enabled

Check that Row Level Security is enabled on all tables:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'subscriptions', 'usage_tracking', 'user_stories', 'story_history');
```

All tables should show `rowsecurity = true`.

## Step 3: Verify Triggers Exist

Check that triggers are created:

```sql
SELECT trigger_name, event_object_table, action_timing, event_manipulation
FROM information_schema.triggers
WHERE event_object_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

You should see:

- `on_auth_user_created` on `auth.users`
- `update_profiles_updated_at` on `profiles`
- `update_subscriptions_updated_at` on `subscriptions`
- `update_user_stories_updated_at` on `user_stories`
- `on_story_updated` on `user_stories`

## Step 4: Test Profile Auto-Creation

### Option A: Using Supabase Dashboard

1. Go to **Authentication** → **Users** in your Supabase dashboard
2. Click **Add User** → **Create new user**
3. Enter an email and password (or use email confirmation)
4. Create the user
5. Go to **Table Editor** → **profiles**
6. You should see a new profile row with the same `id` as the user

### Option B: Using SQL (Service Role)

If you want to test programmatically, you can insert a test user:

```sql
-- This requires service role access
-- Insert a test user (replace with your test email)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('testpassword123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"full_name": "Test User"}'::jsonb
);
```

Then check if profile was created:

```sql
SELECT p.*, u.email
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'test@example.com';
```

## Step 5: Test RLS Policies

### Test 1: User Can Read Own Profile

1. Create a test user (as above)
2. Get the user's ID
3. Run this query as that user (using the anon key in your app):

```sql
-- This should return the user's own profile
SELECT * FROM public.profiles WHERE id = auth.uid();
```

### Test 2: User Cannot Read Other Profiles

Try to read a different user's profile - it should return empty:

```sql
-- Replace 'other-user-id' with a different user's UUID
SELECT * FROM public.profiles WHERE id = 'other-user-id';
-- Should return empty due to RLS
```

### Test 3: Test User Stories RLS

Create a test story as a user:

```sql
-- Insert a test story (as authenticated user)
INSERT INTO public.user_stories (
  user_id,
  title,
  story_text,
  score
) VALUES (
  auth.uid(), -- Current user's ID
  'Test Story',
  'As a user, I want to test the system',
  85
);
```

Then verify you can read it:

```sql
-- Should return the story
SELECT * FROM public.user_stories WHERE user_id = auth.uid();
```

## Step 6: Test Triggers

### Test Updated_at Trigger

```sql
-- Update a profile
UPDATE public.profiles
SET full_name = 'Updated Name'
WHERE id = auth.uid();

-- Check that updated_at changed
SELECT full_name, updated_at
FROM public.profiles
WHERE id = auth.uid();
```

### Test Story History Trigger

```sql
-- Create a story
INSERT INTO public.user_stories (
  user_id,
  title,
  story_text,
  score
) VALUES (
  auth.uid(),
  'Test Story',
  'Original story text',
  80
) RETURNING id;

-- Save the story_id, then update it
UPDATE public.user_stories
SET story_text = 'Updated story text', score = 90
WHERE id = 'your-story-id-here';

-- Check that history was created
SELECT * FROM public.story_history
WHERE story_id = 'your-story-id-here'
ORDER BY version;
```

You should see a history entry with version 1 containing the original text and score.

## Step 7: Verify Indexes

Check that indexes were created:

```sql
SELECT
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'subscriptions', 'usage_tracking', 'user_stories', 'story_history')
ORDER BY tablename, indexname;
```

You should see multiple indexes for each table, including:

- Indexes on foreign keys (`user_id`, `story_id`)
- Indexes on frequently queried columns (`created_at`, `status`, etc.)
- Full-text search index on `user_stories.story_text`
- GIN index on `user_stories.tags`

## Step 8: Test from Your Application

Create a simple test script or use your app to verify:

1. **Sign up a new user** through your app
2. **Check Supabase Dashboard** → **profiles** table - should see new profile
3. **Create a story** through your app
4. **Check** `user_stories` table - should see the story
5. **Update the story** - check `story_history` table for version entry

## Troubleshooting

### Profile Not Auto-Created

If profile isn't created automatically:

1. Check that the trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
2. Verify the function exists: `SELECT * FROM pg_proc WHERE proname = 'handle_new_user';`
3. Check trigger is enabled: The trigger should be listed in Step 3 above

### RLS Policies Not Working

If RLS seems too permissive or restrictive:

1. Check policies exist: `SELECT * FROM pg_policies WHERE tablename = 'profiles';`
2. Verify you're testing with the correct user context
3. Remember: Service role key bypasses RLS, anon key respects RLS

### Triggers Not Firing

If triggers aren't working:

1. Verify trigger exists (see Step 3)
2. Check trigger is enabled (not disabled)
3. Ensure you're updating the correct columns (e.g., `story_text` or `score` for history trigger)

## Quick Verification Checklist

- [ ] All 5 tables exist
- [ ] RLS is enabled on all tables
- [ ] All triggers exist and are enabled
- [ ] Profile auto-creates when user signs up
- [ ] Users can only access their own data (RLS working)
- [ ] `updated_at` timestamps update automatically
- [ ] Story history is created on story updates
- [ ] Indexes are created for performance
- [ ] Can insert/read/update/delete own data
- [ ] Cannot access other users' data

If all checks pass, your database setup is complete! ✅
