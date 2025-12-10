import { getAllToolsMeta } from '../tools';
import { getBaseUrl } from '../lib/site';

/**
 * Main sitemap - includes core static pages and category pages
 * Sub-sitemaps handle tools, blogs, and guides separately for better organization
 */
export default function sitemap() {
  const baseUrl = getBaseUrl();
  const now = new Date();

  // Core static pages only (sub-sitemaps handle tools/blog/guides)
  const staticPages = [
    { path: '/', priority: 1.0, changeFreq: 'daily' },
    { path: '/tools', priority: 0.9, changeFreq: 'daily' },
    { path: '/blog', priority: 0.8, changeFreq: 'daily' },
    { path: '/category', priority: 0.75, changeFreq: 'weekly' },
    { path: '/about', priority: 0.6, changeFreq: 'monthly' },
    { path: '/author', priority: 0.6, changeFreq: 'monthly' },
    { path: '/contact', priority: 0.6, changeFreq: 'monthly' },
    { path: '/privacy', priority: 0.3, changeFreq: 'yearly' },
    { path: '/terms', priority: 0.3, changeFreq: 'yearly' },
  ];

  const staticEntries = staticPages.map(({ path, priority, changeFreq }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: changeFreq,
    priority,
  }));

  // Category pages
  const tools = getAllToolsMeta();
  const categories = [...new Set(tools.map((t) => t.category).filter(Boolean))];
  const slugify = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const categoryEntries = categories.map((cat) => ({
    url: `${baseUrl}/category/${slugify(cat)}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticEntries, ...categoryEntries];
}
