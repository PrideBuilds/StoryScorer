# Fix "next-flight-client-entry-loader" Error

## Problem
```
Module not found: Error: Can't resolve 'next-flight-client-entry-loader'
```

This error means Next.js is not properly installed or the installation is corrupted.

## Solution

### Step 1: Complete Clean Install

Run these commands **in order**:

```bash
# Navigate to project
cd /Users/creativerod/Desktop/StoryScorer/storyscorer

# Stop dev server if running (Ctrl+C)

# Remove everything
rm -rf .next
rm -rf node_modules
rm -rf package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall
npm install

# Verify Next.js installed correctly
npm list next
```

### Step 2: Verify Installation

After `npm install`, check:

```bash
# Should show: next@14.2.35
npm list next

# Check if Next.js files exist
ls node_modules/next/dist
```

### Step 3: If Still Failing

If the error persists, try:

```bash
# Remove everything again
rm -rf .next node_modules package-lock.json

# Install with verbose logging to see errors
npm install --verbose

# Or try with --force
npm install --force
```

### Step 4: Check for Node Version Issues

Make sure you're using a compatible Node.js version:

```bash
node --version
# Should be Node 18.x or 20.x for Next.js 14
```

If you're on an incompatible version:
- Install Node 18 or 20 using nvm or download from nodejs.org

## Why This Happens

The `next-flight-client-entry-loader` is an internal Next.js webpack loader. If it's missing, it means:

1. **Incomplete installation** - npm install was interrupted
2. **Corrupted node_modules** - Files got corrupted during install
3. **Version mismatch** - Multiple Next.js versions installed
4. **Cache issues** - npm cache has corrupted files

## Quick Fix Command

Run this single command to fix everything:

```bash
cd /Users/creativerod/Desktop/StoryScorer/storyscorer && \
rm -rf .next node_modules package-lock.json && \
npm cache clean --force && \
npm install
```

Then restart your dev server:
```bash
npm run dev
```

