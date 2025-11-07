# Regression Test Plan: Routing & Error Handling

## Scope
- Validate HTTP status codes and templates for invalid slugs across dynamic routes.
- Verify headers and robots directives for 404 pages.
- Confirm trailing slash and case sensitivity handling.
- Check reduced client prefetch noise to mitigate RSC aborts.

## Test Matrix
- Tools:
  - `GET /tools/non-existent` → Expect `404`, custom 404 template, `noindex`.
  - `GET /tools/robots-txt-validator/non-existent` → Expect `404`.
- Blog:
  - `GET /blog/non-existent` → Expect `404`, custom template, `noindex`.
  - `GET /blog/non-existent/p/2` → Expect `404`.
- Category:
  - `GET /category/non-existent` → Expect `404` for unknown categories (after fix).
  - `GET /category/keyword-research` → `200` with tools grid and structured data.
- Trailing slash:
  - `GET /blog/` and `GET /category/` → Ensure canonical behavior; no accidental 404 markers.
- Case sensitivity:
  - `GET /TOOLS/Robots-TXT-Validator` → Should redirect or normalize to lowercase, avoid duplicate content.

## Headers Validation
- For all `404` responses:
  - `X-Robots-Tag` must NOT be `all`; should reflect `noindex` via meta, or explicit header.
  - Security headers present (`CSP`, `X-Frame-Options`, `Referrer-Policy`, `X-Content-Type-Options`, `Permissions-Policy`).

## Performance Checks
- Measure `200` vs `404` average response times; verify no significant regressions.
- Confirm homepage prefetch is limited (ideally ≤1 concurrent prefetch in dev).

## Automation
- Extend `scripts/site-crawler-headless.mjs` to:
  - Re-run after fixes; capture screenshots of 404s.
  - Assert status code expectations and emit a summary report.

## Rollback Criteria
- If `404` pages return `200` after fixes, revert the specific change and investigate routing guard path.