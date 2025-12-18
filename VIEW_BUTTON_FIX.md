# View Button Permanent Fix Documentation

## Problem

The "View" button on the `/history` page was intermittently failing to load story analysis. Instead of showing the analysis results, it would show the empty form for creating a new analysis.

## Root Cause

Next.js App Router's `useSearchParams()` hook doesn't reliably trigger re-renders on client-side navigation, especially when components are already mounted. This is a known limitation of Next.js 14 App Router.

## Solution

Created a custom hook `useStoryIdFromUrl()` that uses `window.location.search` as the source of truth instead of `useSearchParams()`. The `window.location` object always reflects the current URL state, making it reliable for client-side navigation.

## Files Changed

1. **`/lib/hooks/useStoryIdFromUrl.ts** - New custom hook
2. **`/app/(dashboard)/analyzer/page.tsx`** - Refactored to use the hook
3. **`/app/(dashboard)/history/page.tsx`** - Added documentation comment

## How It Works

1. User clicks "View" button on history page
2. Navigates to `/analyzer?story={story-id}`
3. `useStoryIdFromUrl()` hook reads from `window.location.search`
4. Hook updates `storyId` state
5. `useEffect` detects `storyId` change and loads the story
6. Analysis results display correctly

## Testing Checklist

After any changes to related files, verify:

- [ ] Click "View" button from `/history` page → Shows analysis (not form)
- [ ] Works after logout and login again
- [ ] Works with browser back/forward buttons
- [ ] Works on page refresh with `?story=xxx` in URL
- [ ] Direct URL access works: `/analyzer?story={id}`
- [ ] No duplicate API calls (check Network tab)
- [ ] No console errors

## Maintenance Guidelines

### DO:
- ✅ Use `useStoryIdFromUrl()` hook for reading story ID from URL
- ✅ Keep the hook logic simple and focused
- ✅ Test thoroughly after any changes
- ✅ Document any modifications

### DON'T:
- ❌ Replace `useStoryIdFromUrl()` with `useSearchParams().get('story')`
- ❌ Remove the `window.location` check from the hook
- ❌ Add complex state management that might interfere
- ❌ Modify without testing the View button functionality

## If It Breaks Again

1. Check that `useStoryIdFromUrl()` is still being used in `analyzer/page.tsx`
2. Verify the hook hasn't been modified incorrectly
3. Check browser console for errors
4. Verify the URL parameter is being set correctly: `?story={id}`
5. Check Network tab to see if API call is being made
6. Review recent changes to related files

## Related Documentation

- `/lib/hooks/README.md` - Detailed hook documentation
- `/lib/hooks/useStoryIdFromUrl.ts` - Hook implementation with comments

---

**Date Implemented:** 2025-01-16  
**Status:** ✅ Permanent Fix  
**Last Tested:** [Update when tested]

