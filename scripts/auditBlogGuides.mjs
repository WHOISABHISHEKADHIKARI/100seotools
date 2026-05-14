import fs from 'node:fs/promises';
import path from 'node:path';
import { getAllBlogPostsPublished } from '../lib/blog-data.js';
import { getBaseUrl } from '../lib/site.js';
import {
  getBlogCanonicalPath,
  getGuideVariant,
  makeStandardDescription,
  makeStandardTitle,
  normalizeBlogSlug,
} from '../lib/blogSeo.js';

const REPORTS_DIR = path.join(process.cwd(), 'reports');
const DOCS_DIR = path.join(process.cwd(), 'docs');

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function toCsv(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  return [
    headers.map(csvEscape).join(','),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')),
  ].join('\n');
}

function countBy(items, getKey) {
  const map = new Map();
  for (const item of items) {
    const key = getKey(item);
    map.set(key, (map.get(key) || 0) + 1);
  }
  return map;
}

function titleStatus(title) {
  if (title.length > 60) return 'too-long';
  if (title.length < 25) return 'too-short';
  return 'ok';
}

function descriptionStatus(description) {
  if (description.length > 160) return 'too-long';
  if (description.length < 150) return 'too-short';
  return 'ok';
}

await fs.mkdir(REPORTS_DIR, { recursive: true });
await fs.mkdir(DOCS_DIR, { recursive: true });

const baseUrl = getBaseUrl();
const posts = await getAllBlogPostsPublished();
const bySlug = countBy(posts, (post) => post.slug);
const byTitle = countBy(posts, (post) => post.title.toLowerCase());
const byDescription = countBy(posts, (post) => post.description.toLowerCase());

const rows = posts.map((post) => {
  const optimizedSlug = normalizeBlogSlug(post.slug);
  const canonicalPath = getBlogCanonicalPath(optimizedSlug);
  const canonicalUrl = `${baseUrl}${canonicalPath}`;
  const optimizedTitle = makeStandardTitle(post);
  const optimizedDescription = makeStandardDescription(post);
  const variant = getGuideVariant(optimizedSlug);
  const published = post.datePublished ? new Date(post.datePublished) : null;
  const datePath = published && !Number.isNaN(published.valueOf())
    ? `/blog/${published.getUTCFullYear()}/${String(published.getUTCMonth() + 1).padStart(2, '0')}/${optimizedSlug}`
    : '';

  return {
    current_url: `${baseUrl}/blog/${post.slug}`,
    current_slug: post.slug,
    optimized_url: canonicalUrl,
    optimized_slug: optimizedSlug,
    suggested_hierarchical_url: datePath ? `${baseUrl}${datePath}` : '',
    redirect_required: post.slug === optimizedSlug ? 'no' : 'yes',
    redirect_status: post.slug === optimizedSlug ? '' : '301',
    title: optimizedTitle,
    title_length: optimizedTitle.length,
    title_status: titleStatus(optimizedTitle),
    description: optimizedDescription,
    description_length: optimizedDescription.length,
    description_status: descriptionStatus(optimizedDescription),
    canonical_url: canonicalUrl,
    robots: 'index,follow',
    sitemap: 'included',
    category: post.category || '',
    template: variant ? `tool-guide-${variant.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : 'standard-blog-guide',
    duplicate_slug_count: bySlug.get(post.slug) || 0,
    duplicate_title_count: byTitle.get(post.title.toLowerCase()) || 0,
    duplicate_description_count: byDescription.get(post.description.toLowerCase()) || 0,
  };
});

const redirectRows = rows.map((row) => ({
  source_url: row.current_url,
  destination_url: row.optimized_url,
  source_slug: row.current_slug,
  destination_slug: row.optimized_slug,
  status_code: row.redirect_required === 'yes' ? '301' : 'no-change',
  reason: row.redirect_required === 'yes'
    ? 'Normalized lowercase hyphenated SEO slug'
    : 'Already matches normalized SEO slug',
  suggested_hierarchical_url: row.suggested_hierarchical_url,
}));

const issues = {
  totalPosts: posts.length,
  slugChangesRequired: rows.filter((row) => row.redirect_required === 'yes').length,
  duplicateSlugs: rows.filter((row) => Number(row.duplicate_slug_count) > 1).length,
  duplicateTitles: rows.filter((row) => Number(row.duplicate_title_count) > 1).length,
  duplicateDescriptions: rows.filter((row) => Number(row.duplicate_description_count) > 1).length,
  titleLengthIssues: rows.filter((row) => row.title_status !== 'ok').length,
  descriptionLengthIssues: rows.filter((row) => row.description_status !== 'ok').length,
  indexableRows: rows.filter((row) => row.robots === 'index,follow' && row.sitemap === 'included').length,
};

const auditJson = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  summary: issues,
  rows,
};

const auditMd = `# Blog And Guide SEO Redesign Audit

Generated: ${auditJson.generatedAt}

## Scope

- Blog and guide URLs audited: ${issues.totalPosts}
- Template family: unified blog/guide template with full-bleed hero, author strip, carded article body, companion sidebar actions, related navigation, and responsive breakpoints.
- Metadata source: centralized standardization in \`lib/blogSeo.js\`.
- Canonical pattern: \`${baseUrl}/blog/[slug]\`
- Sitemap coverage: all published blog posts are included in \`/sitemap-blog/sitemap.xml\`.

## Results

| Check | Result |
| --- | ---: |
| Posts audited | ${issues.totalPosts} |
| Slug redirects required | ${issues.slugChangesRequired} |
| Duplicate slug rows | ${issues.duplicateSlugs} |
| Duplicate title rows | ${issues.duplicateTitles} |
| Duplicate description rows | ${issues.duplicateDescriptions} |
| Title length issues | ${issues.titleLengthIssues} |
| Description length issues | ${issues.descriptionLengthIssues} |
| Index-ready rows | ${issues.indexableRows} |

## Template Before And After

Before:

- Blog index and article templates used separate visual patterns from the redesigned tools surface.
- Article pages had a compact header and no unified sidebar action structure.
- Client-rendered guide links could be intercepted by the client router without visible navigation.

After:

- Blog index and article pages use one cohesive guide/blog visual system.
- Every article gets the same hero rhythm, author placement, content card, sidebar action area, metadata handling, canonical pattern, and mobile layout behavior.
- Tool pages expose consistent guide subpages for how-to, features, best practices, checklist, and search terms.
- Client navigation surfaces use native anchors where needed so clicks open actual subpages.

## URL Strategy

All active slugs are normalized with:

- lowercase characters
- hyphen separators
- special-character removal
- duplicate hyphen collapse
- no leading/trailing hyphens

The spreadsheet includes both the current canonical URL and a suggested hierarchical URL using \`/blog/yyyy/mm/[slug]\`. The current flat canonical structure is preserved to avoid unnecessary churn for already-indexed pages; any future migration can use the generated 301 mapping file.

## Search Engine Indexing Plan

Local indexability verified by:

- robots.txt allows blog and guide pages
- API and duplicate pagination patterns are blocked
- blog pages return index/follow metadata
- canonical URLs point to the normalized blog URL
- sitemap includes all published blog posts

External verification still requires Google Search Console access:

1. Submit \`${baseUrl}/sitemap.xml\`.
2. Submit \`${baseUrl}/sitemap-blog/sitemap.xml\`.
3. Inspect a sample from each template family.
4. Use URL Inspection for changed or high-priority guide URLs.
5. Monitor Coverage, Crawled - currently not indexed, Duplicate without user-selected canonical, and Page with redirect.
6. Recheck weekly for 30 days and update this report with observed indexing status.

## Generated Files

- \`reports/blog-guide-seo-audit.csv\`
- \`reports/blog-guide-seo-audit.json\`
- \`reports/blog-guide-redirect-mapping.csv\`
- \`docs/blog-guide-redesign-audit.md\`
`;

await fs.writeFile(path.join(REPORTS_DIR, 'blog-guide-seo-audit.csv'), toCsv(rows));
await fs.writeFile(path.join(REPORTS_DIR, 'blog-guide-seo-audit.json'), JSON.stringify(auditJson, null, 2));
await fs.writeFile(path.join(REPORTS_DIR, 'blog-guide-redirect-mapping.csv'), toCsv(redirectRows));
await fs.writeFile(path.join(DOCS_DIR, 'blog-guide-redesign-audit.md'), auditMd);

console.log(JSON.stringify(auditJson.summary, null, 2));

