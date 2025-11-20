# 100 SEO Tools

Fast, privacy‑friendly, browser‑based SEO utilities built with Next.js. The project ships curated tool pages, category navigation, and reference guides with strong technical SEO defaults (canonical URLs, JSON‑LD, sitemap, robots).

## Installation & Setup

- Prerequisites: Node.js >= 18, npm >= 9, Git
- Clone and install:
  ```bash
  git clone https://github.com/WHOISABHISHEKADHIKARI/100seotools.git
  cd 100seotools
  npm install
  ```
- Environment variables (create `.env.local`):
  ```env
  NEXT_PUBLIC_SITE_URL=https://www.100seotools.com
  # Optional analytics (production only)
  # NEXT_PUBLIC_GA_ID=G-XXXXXXX
  # NEXT_PUBLIC_DISABLE_ANALYTICS=true
  ```

## Usage

- Development server:
  ```bash
  npm run dev
  # http://localhost:3000
  ```
- Production build & start:
  ```bash
  npm run build
  npm run start
  # http://localhost:3000 (use PORT to override)
  ```
- SEO tests and validation:
  ```bash
  npm run test:seo         # SEO performance smoke checks
  npm run test:schema      # JSON‑LD schema validation
  npm run test:microdata   # Microdata conflict checks
  ```

### Configuration Options

- `browserslist` in `package.json` targets modern browsers for smaller bundles
- `next.config.mjs` configures Next.js behavior and build optimizations
- `tailwind.config.cjs` controls design tokens and styling
- `robots.js` and `sitemap.js` in `app/` define crawl rules and URL discovery

## Project Structure

```
app/          Next.js App Router pages and metadata
components/   Reusable UI and schema helpers
lib/          Utilities, site config, performance helpers
tools/        Tool definitions and runners
public/       Static assets (icons, PWA files)
``` 

## Examples

- Run a tool locally: open `/tools/<tool-slug>` in dev and interact with the form
- View category listings: `/category/<category-slug>` renders curated tools with metadata
- Blog guides: `/blog/<slug>` pages include OpenGraph/Twitter metadata and JSON‑LD

## Contributing

- Fork the repo and create a feature branch
- Follow existing patterns for components, metadata, and JSON‑LD
- Before opening a PR:
  - Run `npm run build` to ensure production build integrity
  - Run `npm run test:seo` and `npm run test:schema`
- Commit messages: use clear, imperative style (e.g., "Add tool: keyword-density-checker")
- Code style: match local conventions; avoid introducing secrets or credentials

## License

Licensed under the MIT License. See the project root for license terms or include a `LICENSE` file when distributing.

## Status & Version

- Status: Active development; production deployments available
- Current version: `0.1.0` (from `package.json`)
- Changelog: track via commit history on the `main` branch

## Notes

- This repository has been cleaned to remove temporary artifacts and non‑core docs
- If you rely on internal reports or content drafts, store them outside the app tree or as separate project docs
