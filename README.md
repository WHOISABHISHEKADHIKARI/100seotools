# 100 SEO Tools

Free, no‑login, no‑card SEO tools built with Next.js 14 and Tailwind CSS. This project provides category pages, tool detail pages, blog guides, and an SEO‑friendly layout with JSON‑LD, canonical URLs, and a sitemap.

## Features
- 100+ tools with client‑side runners
- Category landing pages with structured data
- Blog guides with shareable slugs
- Dark mode (default) with theme toggle
- Canonical/OG/Twitter metadata and expanded sitemap
- Fast, modern stack: Next.js 14 (App Router), Tailwind CSS

## Tech Stack
- `Next.js 14` (App Router)
- `React 18`
- `Tailwind CSS`
- `Node.js` (>= 18)

## Requirements
- Node.js `>= 18`
- npm `>= 9` (or `pnpm`/`yarn` if you prefer)
- Git (recommended) for cloning and versioning

## Quick Start (Windows)
1. Install Node.js 18+ from https://nodejs.org
2. Install Git:
   - Using Winget: `winget install --id Git.Git -e`
   - Or download: https://git-scm.com/downloads and run the installer
3. Clone the repo:
   ```powershell
   git clone https://github.com/<your-org-or-user>/100SeoTools.git
   cd 100SeoTools
   ```
4. Install dependencies:
   ```powershell
   npm install
   ```
5. Start in development:
   ```powershell
   npm.cmd run dev
   # Open http://localhost:3000
   ```

## Production Build & Start
```powershell
npm.cmd run build
npm.cmd run start
# Open http://localhost:3000
```

If you need a different port:
```powershell
set PORT=4000 && npm.cmd run start
# Open http://localhost:4000
```

## Environment Configuration
- `NEXT_PUBLIC_SITE_URL`: set to your canonical origin, e.g. `https://www.example.com`

Where to set: `.env.local`
```env
NEXT_PUBLIC_SITE_URL=https://www.example.com
```

## Project Structure
```
app/                # Next.js App Router pages
components/         # UI components (Navbar, ToolGrid, ToolRunner, etc.)
tools/              # Tool definitions and runners
lib/                # Utilities and templates
public/             # Static assets (if added)
tailwind.config.js  # Tailwind setup and brand colors
next.config.js      # Next.js configuration
```

## Common Tasks
- Develop locally: `npm.cmd run dev`
- Build for production: `npm.cmd run build`
- Start production server: `npm.cmd run start`
- Clear Next cache (fix stale assets): delete `.next/` then restart dev

## Troubleshooting
### PowerShell script execution error (PSSecurityException)
Symptoms: `running scripts is disabled on this system` when using `npm run build`.

Fix options:
- Prefer `npm.cmd run <script>` on Windows (used above) to bypass policy issues.
- Or relax execution policy for current user:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```
  You can revert later with:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Restricted
  ```

### Dev shows 404 for `/_next/static/...` assets
Cause: stale `.next/` cache or HMR churn.

Fix:
1. Stop dev server
2. Delete `.next/`
3. `npm.cmd run dev`

### Prefetch abort warnings in dev
Cause: Next.js dev overlay cancels in‑flight prefetches during HMR.

Fix: Avoid explicit `prefetch` props on `Link`. This project already removed those where applicable.

## Deployment
- Vercel: push to a Git repo and import the project. Ensure `NEXT_PUBLIC_SITE_URL` is set in Project → Settings → Environment Variables.
- Self‑hosted Node: run `npm.cmd run build` and `npm.cmd run start` behind a reverse proxy (Nginx/Caddy) with HTTPS.

## Contributing
- Fork and create a feature branch
- Ensure pages render cleanly in both dev and production
- Run a production build before submitting PR: `npm.cmd run build`

## License
Unspecified. Provide a license if you plan to open source.