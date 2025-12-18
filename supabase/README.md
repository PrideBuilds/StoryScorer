# Supabase Database Migrations

This directory contains SQL migration files for setting up the StoryScorer database schema in Supabase.

## Migration Files

1. **001_profiles_table.sql** - Creates the profiles table that extends auth.users with additional user information
2. **002_subscriptions_table.sql** - Creates the subscriptions table for managing user subscription plans
3. **003_usage_tracking_table.sql** - Creates the usage_tracking table for tracking feature usage
4. **004_user_stories_table.sql** - Creates the user_stories table for storing analyzed user stories
5. **005_story_history_table.sql** - Creates the story_history table for tracking story version history

## How to Apply Migrations

### Option 1: Using Supabase Dashboard (Recommended for initial setup)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste each migration file in order (001 through 005)
4. Run each migration file

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Link your project (if not already linked)
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

### Option 3: Manual Execution

1. Connect to your Supabase database
2. Run each SQL file in sequence using your preferred database client

## Important Notes

- **Run migrations in order**: The migrations have dependencies, so they must be run sequentially (001 → 002 → 003 → 004 → 005)
- **RLS Policies**: All tables have Row Level Security enabled. Users can only access their own data
- **Triggers**: 
  - Profile creation is automatic when a user signs up
  - Story history is automatically created when a story is updated
  - Updated_at timestamps are automatically maintained
- **Indexes**: Performance indexes are created on frequently queried columns

## Testing the Schema

After applying migrations, you can test the schema by:

1. Creating a test user in Supabase Auth
2. Verifying that a profile is automatically created
3. Inserting test data for subscriptions, stories, etc.
4. Verifying RLS policies work correctly by testing queries with different user contexts

## Environment Variables Required

Make sure you have the following environment variables set in your `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)

