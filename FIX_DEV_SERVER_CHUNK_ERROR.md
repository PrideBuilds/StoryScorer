# Fix Dev Server Webpack Chunk Errors

## Problem
Dev server shows errors like:
- `Error: Cannot find module './1682.js'`
- `Error: Cannot find module './8948.js'`

These are webpack chunk loading errors caused by stale build cache.

## Complete Fix

### Step 1: Stop Dev Server
Press `Ctrl+C` in the terminal where `npm run dev` is running.

### Step 2: Clear All Caches
```bash
cd /Users/creativerod/Desktop/StoryScorer/storyscorer

# Remove all build artifacts
rm -rf .next

# Remove node modules cache
rm -rf node_modules/.cache

# Remove SWC cache
rm -rf .swc
```

### Step 3: Verify Build Works
```bash
npm run build
```

Should see: `✓ Compiled successfully`

### Step 4: Restart Dev Server
```bash
npm run dev
```

## Why This Happens

- Next.js dev server caches webpack chunks
- After code changes, chunks can become out of sync
- Stale cache references files that no longer exist

## Prevention

If this happens frequently:
1. Always stop dev server before clearing cache
2. Clear cache after major refactoring
3. Restart dev server after significant changes

## Alternative: Quick Fix Script

Create a script in `package.json`:
```json
"scripts": {
  "dev:clean": "rm -rf .next node_modules/.cache .swc && npm run dev"
}
```

Then use: `npm run dev:clean`

