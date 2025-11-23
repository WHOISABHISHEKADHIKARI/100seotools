# Fix for Next.js 16 Performance Error

## The Error
```
Failed to execute 'measure' on 'Performance': '​BlogGuidePage' cannot have a negative time stamp.
```

## What We Did
1. Renamed the component from `BlogGuidePage` to `Page` in `app/blog/[slug]/page.js`
2. This is the standard Next.js convention and should fix the performance measurement bug

## Steps to Fix

### 1. Stop the Dev Server
Press `Ctrl+C` in your terminal to stop the current dev server

### 2. Clear Next.js Cache
```powershell
Remove-Item -Recurse -Force .next
```

### 3. Restart Dev Server
```powershell
npm run dev
```

### 4. Hard Refresh Browser
After the server restarts:
- Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or clear browser cache

## Why This Happens
This is a known issue with Next.js 16 + Turbopack where performance measurement fails with certain component names. Using the standard `Page` export name resolves it.

## Alternative: Disable Turbopack
If the error persists, you can temporarily disable Turbopack:

In `package.json`, change:
```json
"dev": "next dev"
```

To:
```json
"dev": "next dev --turbo=false"
```

Then restart the dev server.

---

**Status**: Component renamed, waiting for cache clear and restart
