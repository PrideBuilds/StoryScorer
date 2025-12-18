# Row Level Security (RLS) Verification Guide

This document helps verify that RLS policies are correctly configured and working.

## RLS Status Check

Run this query in Supabase SQL Editor to verify RLS is enabled on all tables:

```sql
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'subscriptions', 'usage_tracking', 'user_stories', 'story_history')
ORDER BY tablename;
```

All tables should show `rowsecurity = true`.

## Policy Verification

### 1. Profiles Table

**Expected Behavior:**
- Users can read their own profile
- Users can update their own profile
- Users cannot access other users' profiles

**Test Query:**
```sql
-- As authenticated user, should only see own profile
SELECT * FROM profiles WHERE id = auth.uid();

-- Should return 0 rows (cannot see other users)
SELECT * FROM profiles WHERE id != auth.uid();
```

### 2. Subscriptions Table

**Expected Behavior:**
- Users can read their own subscription
- Users can update their own subscription
- Users cannot access other users' subscriptions

**Test Query:**
```sql
-- Should only see own subscription
SELECT * FROM subscriptions WHERE user_id = auth.uid();

-- Should return 0 rows
SELECT * FROM subscriptions WHERE user_id != auth.uid();
```

### 3. User Stories Table

**Expected Behavior:**
- Users can CRUD their own stories
- Users cannot access other users' stories

**Test Query:**
```sql
-- Should only see own stories
SELECT * FROM user_stories WHERE user_id = auth.uid();

-- Should return 0 rows
SELECT * FROM user_stories WHERE user_id != auth.uid();
```

### 4. Usage Tracking Table

**Expected Behavior:**
- Users can read their own usage
- Users cannot access other users' usage

**Test Query:**
```sql
-- Should only see own usage
SELECT * FROM usage_tracking WHERE user_id = auth.uid();

-- Should return 0 rows
SELECT * FROM usage_tracking WHERE user_id != auth.uid();
```

### 5. Story History Table

**Expected Behavior:**
- Users can read history of their own stories
- Users cannot access history of other users' stories

**Test Query:**
```sql
-- Should only see history of own stories
SELECT sh.* 
FROM story_history sh
JOIN user_stories us ON sh.story_id = us.id
WHERE us.user_id = auth.uid();

-- Should return 0 rows
SELECT sh.* 
FROM story_history sh
JOIN user_stories us ON sh.story_id = us.id
WHERE us.user_id != auth.uid();
```

## Service Role Bypass

The service role key should bypass RLS for webhook operations. This is handled by using `createAdminClient()` which uses the service role key.

**Note:** Service role key should NEVER be exposed to client-side code.

## Policy List

View all RLS policies:

```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

## Testing RLS in Application

### Manual Testing

1. **Create two test accounts**
   - Account A: user@test.com
   - Account B: user2@test.com

2. **As Account A:**
   - Create a story
   - Note the story ID

3. **As Account B:**
   - Try to access Account A's story via API: `GET /api/stories/{storyId}`
   - Should return 404 or "Unauthorized"

4. **Verify in Database:**
   - As Account B, try to query Account A's stories
   - Should return 0 rows

### Automated Testing (Recommended)

Create test scripts that:
- Create test users
- Create resources for each user
- Attempt cross-user access
- Verify all attempts fail

## Common Issues

### Issue: Users can see other users' data

**Solution:**
- Verify RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
- Check policy conditions use `auth.uid()` correctly
- Ensure policies are created for all operations (SELECT, INSERT, UPDATE, DELETE)

### Issue: Service role cannot access data

**Solution:**
- Service role should bypass RLS automatically
- Verify you're using `SUPABASE_SERVICE_ROLE_KEY` (not anon key)
- Check that `createAdminClient()` is used for admin operations

### Issue: Policies not applying

**Solution:**
- Check policy conditions are correct
- Verify `auth.uid()` is available (user is authenticated)
- Check for conflicting policies
- Review policy order (more specific policies first)

## Best Practices

1. **Always enable RLS** on new tables immediately
2. **Test policies** before deploying to production
3. **Document policies** in code comments
4. **Review policies** during security audits
5. **Use service role** only for server-side admin operations
6. **Never expose service role key** to client-side code

## Policy Maintenance

When adding new tables:
1. Create the table
2. Enable RLS: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
3. Create policies for SELECT, INSERT, UPDATE, DELETE
4. Test policies with multiple users
5. Document policies in this file

