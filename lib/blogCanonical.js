import { tools as toolsMeta } from '../tools/registry.js';

const toolSlugs = new Set(toolsMeta.map((tool) => tool.slug).filter(Boolean));
const toolBlogSuffixes = [
  'overview',
  'guide',
  'how-to-use',
  'features-benefits-keywords',
  'best-practices-integrations-costs',
  'checklist-workflow',
  'popular-search-terms',
];

function normalizeSlug(slug = '') {
  return String(slug).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function getLegacyBlogCanonicalPath(slug) {
  const normalized = normalizeSlug(slug);

  if (/^seo-basics-\d+$/.test(normalized)) {
    return '/blog/seo-basics';
  }

  if (normalized === '100-free-seo-tools-ultimate-list') {
    return '/blog/seo-basics';
  }

  if (normalized === 'reverse-image-search-guide') {
    return '/blog/reverse-image-search-complete-guide';
  }

  if (toolSlugs.has(normalized)) {
    return `/tools/${normalized}`;
  }

  for (const suffix of toolBlogSuffixes) {
    const marker = `-${suffix}`;
    if (normalized.endsWith(marker)) {
      const baseSlug = normalized.slice(0, -marker.length);
      if (toolSlugs.has(baseSlug)) {
        return `/tools/${baseSlug}`;
      }
    }
  }

  return null;
}

export function isIndexableBlogPost(post) {
  return Boolean(post?.slug) && !getLegacyBlogCanonicalPath(post.slug);
}
