import { getBaseUrl } from '../../lib/site';

/**
 * ============================================
 * CORE SITEMAP
 * ============================================
 * 
 * Purpose: Primary sitemap for core static pages
 * Location: /sitemap-core/sitemap.xml
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
  const now = new Date();

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

  // Legal & Utility
  const utilityPages = [
    { path: '/tools', priority: 0.9, changeFreq: 'daily' },
    { path: '/privacy', priority: 0.3, changeFreq: 'yearly' },
    { path: '/terms', priority: 0.3, changeFreq: 'yearly' },
  ];

  const allPages = [
    ...corePages,
    ...calculatorPages,
    ...authorPages,
    ...utilityPages,
  ];

  return allPages.filter(validatePageConfig).map(({ path, priority, changeFreq }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: changeFreq,
    priority,
  }));
}
