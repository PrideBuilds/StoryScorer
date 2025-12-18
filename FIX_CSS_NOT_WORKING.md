# Fix CSS Not Working

## Complete Reset Steps

### Step 1: Stop Dev Server
Press `Ctrl+C` in the terminal where `npm run dev` is running.

### Step 2: Clean Everything
```bash
cd /Users/creativerod/Desktop/StoryScorer/storyscorer

# Remove build cache
rm -rf .next

# Remove node_modules cache
rm -rf node_modules/.cache

# Optional: If still not working, remove node_modules entirely
# rm -rf node_modules package-lock.json
# npm install
```

### Step 3: Verify autoprefixer is Installed
```bash
npm list autoprefixer
```

Should show: `autoprefixer@10.4.23`

If not installed:
```bash
npm install autoprefixer --save-dev
```

### Step 4: Restart Dev Server
```bash
npm run dev
```

### Step 5: Clear Browser Cache
**Important:** Clear your browser cache completely:

**Chrome/Edge:**
- Press `Cmd+Shift+Delete` (Mac) or `Ctrl+Shift+Delete` (Windows)
- Select "Cached images and files"
- Time range: "All time"
- Click "Clear data"

**Or use Hard Refresh:**
- Mac: `Cmd + Shift + R`
- Windows/Linux: `Ctrl + Shift + R`

### Step 6: Check Browser Console
Open DevTools (F12) and check:
1. **Console tab** - Look for CSS loading errors
2. **Network tab** - Filter by "CSS" and check if `_app.css` or similar is loading
3. **Elements tab** - Inspect an element and see if Tailwind classes are applied

## Verify Configuration

### Check postcss.config.mjs
Should contain:
```javascript
plugins: {
  tailwindcss: {},
  autoprefixer: {},
}
```

### Check tailwind.config.ts
Should have content paths:
```typescript
content: [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
]
```

### Check app/layout.tsx
Should import globals.css:
```typescript
import "./globals.css";
```

## If Still Not Working

### Option 1: Check if CSS file is being generated
```bash
# After starting dev server, check if CSS is generated
ls -la .next/static/css/
```

Should see CSS files there.

### Option 2: Check browser Network tab
1. Open DevTools → Network tab
2. Filter by "CSS"
3. Reload page
4. Check if any CSS files are loading (should see files like `_app-[hash].css`)

### Option 3: Verify Tailwind is processing
Add a test class to see if Tailwind works:
```tsx
<div className="bg-red-500 p-4">Test</div>
```

If this shows red background, Tailwind is working.

### Option 4: Check for build errors
Look in terminal where `npm run dev` is running for any errors related to:
- PostCSS
- Tailwind
- CSS processing

## Common Issues

1. **Browser cache** - Most common issue, clear it completely
2. **Dev server not restarted** - Must restart after config changes
3. **autoprefixer not installed** - Run `npm install autoprefixer --save-dev`
4. **.next cache corrupted** - Remove `.next` folder and restart

## Quick Test

After restarting, check if this works:
```tsx
// In any component, add:
<div className="bg-blue-500 text-white p-4 rounded">
  CSS Test - This should be blue with white text
</div>
```

If you see blue background, CSS is working!

