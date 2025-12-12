## Scope And Targets
- Keep current UI/UX and layout unchanged; modify only text, metadata, internal links, and JSON-LD schema
- Primary target: `app/page.js` (homepage content and JSON-LD) and the page you want enhanced
- Shared SEO assets to refine: `components/StructuredData.js`, `lib/schema.js`, `app/layout.js`, `app/robots.js`, `app/sitemap.js`

## Current Implementation Summary
- Homepage injects `WebSite` JSON-LD via `StructuredData` (`app/page.js:85–90`)
- Client JSON-LD helpers exist (`components/StructuredData.js:12–38`, `40–77`, `79–113`, `115–173`, `175–188`)
- Server-safe schema generators mirror these (`lib/schema.js:3–28`, `30–67`, `69–103`, `105–163`, `165–178`)
- Global metadata set in `app/layout.js:4–50` plus GA and head tags (`52–206`)
- Crawl controls defined in `app/robots.js:4–35`; sitemap in `app/sitemap.js:7–129`
- Built-in Schema tools use `schemaMarkupGenerator` template (`lib/templates.js:98–106`, `436–446`) and AI Schema Generator config is minimal (`tools/ai-schema-generator.js:1–7`)

## Content SEO: Semantic Rewriting And Enrichment
- Rewrite on-page text blocks with NLP-friendly structure (H1/H2/H3 cadence, short paragraphs, ordered lists) while preserving classes and visual layout
- Integrate enriched entities and long-tail phrases naturally: “JSON-LD schema”, “structured data generator”, “rich results”, “FAQPage”, “BreadcrumbList”, “LocalBusiness”, “Article schema”, “HowTo schema”, “entity-based SEO”, “@graph”
- Derive competitor-informed phrases and coverage from leading tools [1] schemawriter.ai, [2] Zynith AI Schema Generator, [4] SnapSchema; emphasize connected `@graph`, validation, and FAQ/geo coverage
- Update homepage intro and tool descriptions (`app/page.js:137–147`) with semantically dense, scannable copy; add inline anchors without changing styles

## Internal Linking (Homepage And Subpages)
- Add contextual internal links within existing paragraphs to:
  - Homepage `/`
  - High-value tools: `/tools/schema-markup-generator`, `/tools/structured-data-validator`, `/tools/robots-txt-validator`, `/tools/xml-sitemap-visualizer`
  - Guides: `/blog/free-seo-tools-list-2024` (`app/blog/free-seo-tools-list-2024/page.js:174–187`) and other pillar posts
- Keep visual design intact by inserting anchor tags into existing text blocks (`app/page.js:99–104`, `139–147`)
- Ensure Breadcrumbs visible and JSON-LD exist on tool pages (example `app/tools/redirect-301-generator/page.js:37–67`)

## Schema Generator: JSON-LD Structures, Validation, And Fallbacks
- Expand `schemaMarkupGenerator` template to output connected `@graph` when possible: `WebSite → WebPage → Organization → BreadcrumbList → FAQPage` (types selected by user)
- Add per-type required-property checks and hints (Article, FAQPage, HowTo, LocalBusiness, SoftwareApplication) aligned with Google Rich Results
- Implement fallbacks: populate `image` from OG/Twitter, `publisher` from site config, dates from `datePublished`, ensure minimally valid schema when inputs are missing
- Remove risky synthetic fields (e.g., hard-coded `aggregateRating`) to comply with policies
- Integrate validation preview using existing validator tool (`tools/structured-data-validator.js:1–11`) and return fix suggestions inline
- Ensure single JSON-LD injection per page; dedupe if multiple generators are used

## Technical SEO: Indexability And E-E-A-T
- Verify canonical and alternates remain correct (`app/layout.js:46–50`)
- Confirm `robots.js` allows essential paths and blocks only error/offline pages (`app/robots.js:6–33`)
- Ensure sitemap coverage for home, categories, tools, and guides (`app/sitemap.js:7–129`)
- Strengthen E-E-A-T signals in content by adding:
  - Author/publisher clarity and contact references
  - Source citations in guides (existing pattern used in blog posts)
  - Updated dates in article schema and visible text where relevant

## Automated Tests (Node + Puppeteer + Axe)
- Use existing devDeps: `puppeteer`, `axe-core`; no Jest/Vitest present
- Add test scripts under `tests/`:
  - Schema validation: load target pages, extract JSON-LD, validate required fields per type; check single injection and `@graph` structure
  - Microdata errors: ensure no conflicting `itemscope`/`itemprop` misuse; confirm no duplicate types causing ambiguity
  - Accessibility: run `axe-core` checks for headings, link names, color contrast, skip links; assert WCAG AA
  - SEO performance: assert title/meta/canonical present, H1 exists, internal link count and anchor quality, robots and sitemap accessible
- Report outputs as CI-friendly text; add `npm run test:seo` and `npm run test:accessibility` scripts when we implement

## File-Level Changes (No Visual Alterations)
- `app/page.js`: rewrite copy in intro and sections; insert internal anchors; keep classes untouched
- `components/StructuredData.js`: add validation and dedupe before injection; support `@graph` payloads
- `lib/schema.js`: add fallbacks, remove synthetic ratings, add breadcrumb helper, strengthen types; keep function signatures
- `lib/templates.js`: expand `schemaMarkupGenerator` fields; enhance runner to generate multi-type `@graph`, per-type validation, and fix suggestions
- `tools/ai-schema-generator.js`: enrich metadata and keywords; wire to improved template
- `app/layout.js`: minor metadata enrichment only if needed; preserve existing OG/Twitter/canonical

## Acceptance Criteria
- Page renders identically visually; improved copy, internal links, and metadata verified
- JSON-LD validates for selected types and passes Rich Results requirements
- Single JSON-LD block per page; connected `@graph` when applicable
- Axe accessibility tests pass with no serious issues; skip link works (`app/layout.js:178–181`)
- SEO checks pass: canonical present, H1 exists, internal link density improved, robots and sitemap reachable

## Rollback And Safety
- Changes are purely text/metadata/schema; easy to revert
- No new external dependencies; reuse existing utilities

## Citations
- [1] https://schemawriter.ai — entity-based schema and competitor entity extraction concepts
- [2] https://zynith.app/product/generate-schema/ — JSON-LD generator positioning and features
- [4] https://www.snapschema.com/post/the-best-json-ld-schema-tools-for-2025-and-why-most-still-fail-google-s-rich-results-test — connected `@graph` best practices and validation emphasis

## Next Step
- After approval, implement the changes, run automated tests locally, and provide a diff with file references and test results.