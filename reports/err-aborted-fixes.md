# ERR_ABORTED Root Causes and Fixes

## Summary
- Multiple `net::ERR_ABORTED` and aborted prefetch warnings observed on `/blog` and `/category/*`.
- Root causes identified:
  1. Aggressive Link prefetching causing RSC prefetch churn in dev.
  2. External image source `via.placeholder.com` failing DNS in the environment (ENOTFOUND), causing fetch failures and noise.
  3. Occasional misuse of `await` on `params` in server components, increasing RSC waterfalls.

## Fixes Implemented

- Disable prefetch for navigational links:
  - Updated `components/Navbar.js` and `components/Footer.js` to set `prefetch={false}` on all `Link`s.
  - Category and blog pages already used `prefetch={false}` for internal lists.

- Prefer static rendering and correct params usage:
  - `app/category/[slug]/page.js`: Added `export const dynamic = 'force-static'`, implemented `generateStaticParams`, removed `await` misuse, wrapped with try/catch fallback.
  - `app/blog/[slug]/page.js`: Removed `await` misuse in `params`, kept static routing.
  - `app/blog/page.js`: Added `dynamic = 'force-static'`, removed `await` from `searchParams` handling.

- Eliminate failing external image fetches:
  - `components/BlogCard.js`: Replaced `https://via.placeholder.com/...` with inline SVG `data:` URLs.
  - `app/article-card-demo/page.js`: Switched demo images to local `/icon.svg`.
  - `next.config.js`: Removed `via.placeholder.com` from `images.remotePatterns` and from CSP `img-src`.

## Validation
- `npm run build`: success; static pages generated; only deprecation warning (middleware → proxy).
- Production server (`npm run start -- --port 3004`):
  - `/blog` and `/category/keyword-research` opened with no console errors.
  - No ENOTFOUND image fetches; no aborted prefetch warnings.

## Ongoing Recommendations
- Keep `prefetch={false}` on non-critical navigation to avoid dev overlay churn; optionally re‑enable selectively in production.
- Consider adding lightweight client logger to capture navigation abort reasons in production (Sentry/LogRocket) if issues recur.
- Periodically clear `.next/` during dev if HMR gets noisy.
- Migrate `middleware.js` to `proxy` convention per Next.js 16 deprecation notice.

## Files Changed
- `components/BlogCard.js`
- `app/article-card-demo/page.js`
- `next.config.js`
- (Previously) `components/Navbar.js`, `components/Footer.js`, `app/blog/[slug]/page.js`, `app/blog/page.js`, `app/category/[slug]/page.js`

## Checklist
- [x] Disable aggressive prefetching in nav
- [x] Fix static params and metadata generation
- [x] Replace external placeholders with inline SVG
- [x] Update image/CSP domains
- [x] Build and run production for verification