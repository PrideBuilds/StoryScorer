# Fix ChunkLoadError for AnalysisResults

## Problem

```
ChunkLoadError: Loading chunk _app-pages-browser_components_feature_AnalysisResults_tsx failed
```

This happens because Next.js cached the old dynamic import even though we changed it to a regular import.

## Solution

### Step 1: Stop Dev Server

Press `Ctrl+C` in terminal where `npm run dev` is running.

### Step 2: Clear All Caches

```bash
cd /Users/creativerod/Desktop/StoryScorer/storyscorer

# Remove build cache
rm -rf .next

# Remove node_modules cache
rm -rf node_modules/.cache
```

### Step 3: Restart Dev Server

```bash
npm run dev
```

### Step 4: Clear Browser Cache Completely

**Critical:** The browser has cached the old chunk loading code.

**Chrome/Edge:**

1. Press `Cmd+Shift+Delete` (Mac) or `Ctrl+Shift+Delete` (Windows)
2. Select "Cached images and files"
3. Time range: "All time"
4. Click "Clear data"

**Or use Incognito/Private Window:**

- Open a new incognito/private window
- Navigate to `http://localhost:3000`
- Test the View button

### Step 5: Hard Refresh

After clearing cache, do a hard refresh:

- Mac: `Cmd + Shift + R`
- Windows/Linux: `Ctrl + Shift + R`

## Why This Happens

When we changed from:

```typescript
const AnalysisResults = dynamic(...)
```

To:

```typescript
import { AnalysisResults } from "@/components/feature/AnalysisResults";
```

Next.js had already generated chunk files for the dynamic import. The browser cached these chunk references, so even after changing the code, it still tries to load the old chunks.

## Verification

After following the steps:

1. Go to `/history`
2. Click "View" button
3. Should load the story analysis without errors

If it still fails, check browser console (F12) for any remaining chunk loading errors.
