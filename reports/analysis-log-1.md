Title: Root Cause Analysis – TypeError and Nested Anchor Issues
Date: 2025-11-07

Scope
- Investigate TypeError: searchQuery.toLowerCase is not a function
- Audit overlay link implementation causing nested <a> tags

Observations
- Error surfaced when non-string inputs flowed into legacy image term generator.
- Prior implementation assumed `searchQuery` always a string; called `.toLowerCase()` directly.
- Multiple components use the overlay link pattern; a few had inner anchors that created nested <a> tags (e.g., `SEOCalculator` related guides, category list cards).

Trigger Conditions
- `searchQuery` provided as object or array; or `undefined`.
- Pages rendering cards with absolute overlay anchors while retaining inner clickable anchors.

Execution Flow
- Card stack → legacy image term generator (`getSearchTerms(searchQuery, category, tags, title)`) → unsafe string ops on mixed types → TypeError.
- Card UIs with `absolute inset-0` anchor + inner `<a>` CTA → nested anchor invalid HTML.

Root Cause
- Type assumptions in `lib/image-config.js#getSearchTerms` and lack of type guards.
- Overlay link pattern not consistently applied with inner controls converted to non-anchor elements or events.

Impacted Modules
- `lib/image-config.js` (string handling) — removed in current implementation.
- `components/SEOCalculator.js`, `app/category/[slug]/page.js` (nested anchors)

References
- Build: Next.js 16.0.1 – build successful; middleware deprecation warning only.