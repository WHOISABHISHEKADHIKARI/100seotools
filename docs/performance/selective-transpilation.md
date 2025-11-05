# Selective Transpilation and Polyfill Strategy

This project targets modern browsers for ≥95% coverage while minimizing transpilation and polyfills to reduce bundle size and improve performance.

## Browser Support Policy

- Targets (`browserslist` in `package.json`):
  - `Chrome >= 90`, `Firefox >= 88`, `Safari >= 14`, `Edge >= 90`
- Rationale: These versions collectively exceed 95% coverage in most audiences and support ES2018+ features. Safari 14 is retained for iOS market coverage.

## Baseline Feature Compatibility Matrix

Features deployed without transpilation. If a browser lacks any, dynamic polyfills are loaded.

- `Array.prototype.at` — modern: Chrome 92+, FF 90+, Safari 15+; polyfilled for Safari 14
- `Array.prototype.flat` — modern: Chrome 69+, FF 62+, Safari 12+
- `Array.prototype.flatMap` — modern: Chrome 69+, FF 62+, Safari 12+
- `Object.fromEntries` — modern: Chrome 73+, FF 63+, Safari 12.1+
- `Object.hasOwn` — modern: Chrome 92+, FF 92+, Safari 15.4+; fallback uses `hasOwnProperty`
- `String.prototype.trimStart/trimEnd` — modern: Chrome 66+, FF 70+, Safari 12+

## Build Configuration

- Next.js uses SWC, which respects `browserslist` for output targeting.
- Bundle analyzer is available via `ANALYZE=true next build` to inspect vendors chunk.

### Why no Babel here?

Next 13+/14 use SWC for transforms; using Babel adds overhead and complexity. Selective transpilation is achieved by modern targets and avoiding polyfill injection.

## Polyfill Management

- Differential loading:
  - `type="module"` inline feature detection in `app/layout.js` loads `/polyfills-modern.js` only when baseline features are missing.
  - `noModule` loads `/polyfills-legacy.js` for browsers without ESM support.
- Polyfills are minimal and first-party, avoiding heavy libraries:
  - `polyfills-modern.js` and `polyfills-legacy.js` implement only baseline feature shims.

## Code Splitting Guidelines

- Route-based splitting is automatic in App Router.
- Use `next/dynamic` for non-critical components (charts, calculators, long lists) with `ssr: false` when appropriate.
- Name heavy modules clearly to aid analyzer reports.

## Performance Measurement

- Monitor via `/perf-dashboard`:
  - LCP, FCP, TTFB, FID, and TTI≈ (FCP+FID), plus CSS load time
  - Minute-level sampling with threshold alerts (Key path > 250ms, FCP > 100ms, TTI deviation ≥15%)
- Compare before/after:
  - Total bundle size (modern vs legacy polyfill hit)
  - Number/size of polyfills loaded
  - Network transfer size (via DevTools or WebPageTest)

## Procedures

1. Run analyzer: `npm run build:analyze`
   - Inspect `vendors` and `common` chunks; validate tree-shaking and scope hoisting effectiveness.
2. Validate feature detection:
   - Emulate Safari 14; confirm modern polyfills load and app functions.
   - Emulate legacy (disable ESM); confirm legacy polyfills file executes without errors.
3. Monitor Core Web Vitals via `/perf-dashboard` and browser DevTools.

## Continuous Monitoring

- Track browser usage via analytics (e.g., GA) and adjust `browserslist` annually.
- Watch bundle size regressions in CI by logging `.next` build stats or analyzer output.