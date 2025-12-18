# Custom Hooks

## useStoryIdFromUrl

**Location:** `/lib/hooks/useStoryIdFromUrl.ts`

**Purpose:** Reliably read `storyId` from URL query parameter `?story=xxx`

### Why This Hook Exists

Next.js App Router's `useSearchParams()` hook has a known limitation: it doesn't reliably trigger re-renders on client-side navigation, especially when components are already mounted. This causes the "View" button on the history page to fail intermittently.

### The Solution

This hook uses `window.location.search` as the source of truth instead of `useSearchParams()`. The `window.location` object always reflects the current URL state, making it reliable for client-side navigation.

### Usage

```typescript
import { useStoryIdFromUrl } from "@/lib/hooks/useStoryIdFromUrl";

function MyComponent() {
  const storyId = useStoryIdFromUrl();
  // storyId will be the value from ?story=xxx or null
}
```

### How It Works

1. Initializes from `window.location.search` on mount
2. Monitors `useSearchParams()` and `pathname` for changes
3. Always double-checks `window.location` to ensure accuracy
4. Updates state when URL changes

### Important Notes

- **DO NOT** replace this with `useSearchParams().get('story')` directly
- **DO NOT** remove the `window.location` check - it's critical for reliability
- This hook is specifically designed for the analyzer page's View button functionality
- If you need similar functionality elsewhere, use this hook as a pattern

### Testing

To verify this hook works correctly:

1. Navigate to `/history`
2. Click "View" on any story
3. Should immediately load the story analysis (not show the form)
4. Works after logout/login
5. Works with browser back/forward buttons
6. Works on page refresh

If the View button stops working, check:

- Is the hook still being used in `analyzer/page.tsx`?
- Has the hook logic been modified?
- Are there any new effects that might interfere?

### Maintenance

If you need to modify this hook:

1. Test thoroughly with the View button from history page
2. Test after logout/login
3. Test browser navigation (back/forward)
4. Test page refresh
5. Document any changes in this README

---

**Last Updated:** 2025-01-16
**Reason:** Permanent fix for View button reliability issue
