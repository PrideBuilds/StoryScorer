# Vercel Root Directory Fix - Step by Step

## The Problem

Vercel is building from the repository root, but your Next.js app is in the `storyscorer` subdirectory. Even after setting the root directory, it's still failing.

## Solution: Verify and Fix Root Directory

### Step 1: Check Your GitHub Repository Structure

1. Go to your GitHub repository: `https://github.com/PrideBuilds/StoryScorer`
2. Look at the file structure - is `package.json` in the root or in a `storyscorer/` folder?
3. **If `package.json` is in `storyscorer/` folder**, you need to set root directory to `storyscorer`

### Step 2: Set Root Directory in Vercel (CRITICAL)

1. **Go to Vercel Dashboard** → Your Project
2. **Click "Settings"** (gear icon in top right)
3. **Click "General"** in left sidebar
4. **Scroll down to "Root Directory"** section
5. **Click "Edit"** next to Root Directory
6. **Enter:** `storyscorer` (exactly this, no trailing slash)
7. **Click "Save"**
8. **IMPORTANT:** You should see a confirmation that it's saved

### Step 3: Verify Root Directory is Set

After saving, you should see:

- Root Directory: `storyscorer`
- A note saying "Builds will run from this directory"

### Step 4: Redeploy

1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click **"..."** (three dots) → **"Redeploy"**
4. **IMPORTANT:** Make sure you select **"Use existing Build Cache"** is **UNCHECKED** (to force fresh build)
5. Click **"Redeploy"**

### Step 5: Check Build Logs

After redeploy starts, check the logs. You should see:

**✅ CORRECT (what you want to see):**

```
Cloning github.com/PrideBuilds/StoryScorer
Installing dependencies...
added 378 packages
Detected Next.js version: 14.2.35
Running "npm run build"
Creating an optimized production build ...
✓ Compiled successfully
```

**❌ WRONG (what you're seeing now):**

```
Module not found: Can't resolve 'react-hook-form'
Module not found: Can't resolve '@/components/ui/button'
```

## Alternative: Check if Root Directory Setting is Actually Applied

If you've set it but it's still not working:

1. **Check Vercel Project Settings again:**
   - Go to Settings → General
   - Verify Root Directory shows `storyscorer`
   - If it shows `.` or is empty, that's the problem

2. **Try removing and re-adding:**
   - Set Root Directory to `.` (or empty)
   - Save
   - Set it back to `storyscorer`
   - Save again
   - Redeploy

## Alternative Solution: Move package.json to Root

If setting root directory doesn't work, you can restructure:

1. Move all files from `storyscorer/` to repository root
2. Update any paths that reference the subdirectory
3. Commit and push
4. Set Root Directory to `.` in Vercel
5. Redeploy

**Note:** This is more work but guarantees it will work.

## Verify Your Repository Structure

Run this locally to see your structure:

```bash
cd /path/to/your/repo
find . -name "package.json" -type f
```

This will show you where `package.json` is located. The root directory in Vercel should match this path.

## Still Not Working?

1. **Check Vercel Build Logs:**
   - Look for the line that says "Installing dependencies"
   - Check what directory it's running from
   - It should show it's in the `storyscorer` directory

2. **Check if vercel.json exists:**
   - If you have a `vercel.json` file, it might be overriding settings
   - Check if it has a `rootDirectory` setting that conflicts

3. **Contact Vercel Support:**
   - If nothing works, there might be a caching issue
   - Vercel support can clear build cache

## Quick Checklist

- [ ] Root Directory is set to `storyscorer` in Vercel Settings → General
- [ ] Saved the setting (see confirmation)
- [ ] Redeployed with cache disabled
- [ ] Checked build logs show correct directory
- [ ] Verified `package.json` exists in `storyscorer/` on GitHub
