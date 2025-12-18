# Vercel Deployment Fix: Root Directory Issue

## Problem

If you see errors like:

```
Module not found: Can't resolve 'react-hook-form'
Module not found: Can't resolve '@/components/ui/button'
```

This means Vercel is building from the wrong directory.

## Solution

### Option 1: Configure in Vercel Dashboard (Recommended)

1. Go to your Vercel project dashboard
2. Click **Settings** → **General**
3. Scroll down to **Root Directory**
4. Set it to: `storyscorer` (or whatever subdirectory contains your `package.json`)
5. Click **Save**
6. Go to **Deployments** tab
7. Click **"..."** on the latest deployment → **Redeploy**

### Option 2: Check Your Repository Structure

If your GitHub repository structure is:

```
StoryScorer/
  ├── storyscorer/
  │   ├── package.json
  │   ├── app/
  │   └── ...
  └── README.md
```

Then you need to set **Root Directory** to `storyscorer` in Vercel.

If your repository structure is:

```
storyscorer/
  ├── package.json
  ├── app/
  └── ...
```

Then **Root Directory** should be `.` (root) or leave it empty.

### Option 3: Move package.json to Root (Alternative)

If you want to avoid the root directory issue:

1. Move all files from `storyscorer/` to the repository root
2. Update any paths that reference the subdirectory
3. Redeploy

**Note:** This requires restructuring your repository, so Option 1 is usually easier.

## How to Verify

After setting the root directory:

1. Check the build logs in Vercel
2. Look for: `Installing dependencies...`
3. Should see: `added X packages`
4. Should NOT see: `Module not found` errors

## Still Having Issues?

1. **Check your repository structure on GitHub:**
   - Go to your GitHub repo
   - See where `package.json` is located
   - Set Root Directory to match that path

2. **Verify package.json exists:**
   - The root directory you set must contain `package.json`
   - Vercel uses this to detect Next.js projects

3. **Check build logs:**
   - Look for the exact path where it's trying to build
   - Compare with where your `package.json` actually is

## Quick Test

After setting root directory, the build should show:

```
✓ Detected Next.js version: 14.2.35
✓ Running "npm run build"
✓ Creating an optimized production build ...
```

If you still see module errors, the root directory is still wrong.
