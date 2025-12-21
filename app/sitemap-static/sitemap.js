import { getBaseUrl } from '../../lib/site';

/**
 * Sitemap for static pages and category pages
 * Located at /sitemap-static.xml
 */
export default function sitemap() {
    const baseUrl = getBaseUrl();
    const now = new Date();

    // Core static pages
    const staticPages = [
        { path: '/', priority: 1.0, changeFreq: 'daily' },
        { path: '/tools', priority: 0.9, changeFreq: 'daily' },
        { path: '/blog', priority: 0.8, changeFreq: 'daily' },
        { path: '/category', priority: 0.75, changeFreq: 'weekly' },
        { path: '/about', priority: 0.6, changeFreq: 'monthly' },
        { path: '/author', priority: 0.7, changeFreq: 'monthly' },
        { path: '/contact', priority: 0.6, changeFreq: 'monthly' },
        { path: '/seo-calculator', priority: 0.7, changeFreq: 'weekly' },
        { path: '/seo-cost-calculator', priority: 0.7, changeFreq: 'weekly' },
        { path: '/privacy', priority: 0.3, changeFreq: 'yearly' },
        { path: '/terms', priority: 0.3, changeFreq: 'yearly' },
    ];

    const staticEntries = staticPages.map(({ path, priority, changeFreq }) => ({
        url: `${baseUrl}${path}`,
        lastModified: now,
        changeFrequency: changeFreq,
        priority,
    }));

    return staticEntries;
}
