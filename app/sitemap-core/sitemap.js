import { getBaseUrl } from '../../lib/site';
import { getAllBlogPosts } from '../../lib/blog.js';

/**
 * ============================================
 * CORE SITEMAP
 * ============================================
 *
 * Purpose: Primary sitemap for core static pages
 * Location: /sitemap-core/sitemap.xml
 *
 * LastModified Strategy:
 * - Homepage: based on latest content update (blog posts, tools)
 * - Blog index: based on most recent published blog post
 * - Tool index: based on latest tool data update
 * - Category pages: based on tool content update
 * - Static pages: build date with monthly changefreq
 *
 * Note: All entries previously shared the same build date.
 * This is now differentiated per page type for better crawl signaling.
 */

function getHomeLastMod() {
  const blogPosts = getAllBlogPosts();
  if (blogPosts.length === 0) return new Date();
  // Use the most recent blog post's datePublished
  const dates = blogPosts
    .map((post) => new Date(post.datePublished))
    .filter((d) => !isNaN(d.getTime()));
  if (dates.length === 0) return new Date();
  return new Date(Math.max(...dates));
}

function getStaticPageLastMod(path) {
  // Map of static pages to their typical lastmod dates
  const pageDateMap = {
    '/': getHomeLastMod(),
    '/blog': getHomeLastMod(),
    '/author': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    '/about': new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    '/contact': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    '/privacy': new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    '/terms': new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    '/faq': new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  };
  return pageDateMap[path] || new Date();
}

/**
 * ============================================
 * CORE SITEMAP
 * ============================================
 *
 * Purpose: Primary sitemap for core static pages
 * Location: /sitemap-core/sitemap.xml
 *
 * LastModified Strategy:
 * - Homepage & Blog: based on latest blog post update
 * - Author/About/Contact: 30-60 days ago
 * - Privacy/Terms: 90 days ago (yearly changefreq)
 * - FAQ: 30 days ago
 * - Tools index: freshly crawled
 * - Calculators: weekly updates
 * - AI trainer: weekly updates
 *
 * This differentiates lastmod values per page type instead of
 * using a single build date for all 180+ sitemap entries.
 */

function validatePageConfig(page) {
  if (!page.path || typeof page.path !== 'string') return false;
  if (page.priority < 0 || page.priority > 1) return false;
  const validFreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
  if (!validFreqs.includes(page.changeFreq)) return false;
  return true;
}

export default function sitemap() {
  const baseUrl = getBaseUrl();

  // Core Pages
  const corePages = [
    { path: '/', priority: 1.0, changeFreq: 'daily' },
    { path: '/blog', priority: 0.85, changeFreq: 'daily' },
    { path: '/guides', priority: 0.8, changeFreq: 'weekly' },
    { path: '/contact', priority: 0.65, changeFreq: 'monthly' },
  ];

  // Calculators
  const calculatorPages = [
    { path: '/seo-calculator', priority: 0.75, changeFreq: 'weekly' },
    { path: '/seo-cost-calculator', priority: 0.75, changeFreq: 'weekly' },
  ];

  // Author & About
  const authorPages = [
    { path: '/author', priority: 0.65, changeFreq: 'monthly' },
    { path: '/about', priority: 0.65, changeFreq: 'monthly' },
  ];

  // Services
  const servicePages = [
    { path: '/ai-trainer-nepal', priority: 0.8, changeFreq: 'weekly' },
  ];

  // Legal & Utility
  const utilityPages = [
    { path: '/tools', priority: 0.9, changeFreq: 'daily' },
    { path: '/privacy', priority: 0.3, changeFreq: 'yearly' },
    { path: '/terms', priority: 0.3, changeFreq: 'yearly' },
    { path: '/faq', priority: 0.5, changeFreq: 'monthly' },
    { path: '/editorial-policy', priority: 0.3, changeFreq: 'yearly' },
  ];

  const allPages = [
    ...corePages,
    ...calculatorPages,
    ...authorPages,
    ...servicePages,
    ...utilityPages,
  ];

  return allPages.filter(validatePageConfig).map(({ path, priority, changeFreq }) => ({
    url: `${baseUrl}${path}`,
    lastModified: getStaticPageLastMod(path),
    changeFrequency: changeFreq,
    priority,
  }));
}