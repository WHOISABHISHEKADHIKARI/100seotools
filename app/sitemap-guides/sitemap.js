import { getBaseUrl } from '../../lib/site';

/**
 * Sitemap for SEO guides and educational content
 * Located at /sitemap-guides.xml
 */
export default function sitemap() {
    const baseUrl = getBaseUrl();
    const now = new Date();

    // Static guide pages with high-value content
    const guides = [
        { path: '/blog/seo-basics', priority: 0.8 },
        { path: '/blog/seo-basics-0', priority: 0.8 },
        { path: '/blog/latest-seo-guides', priority: 0.75 },
        { path: '/blog/latest-ai-based-tips-and-tricks-for-fast-web-crawling', priority: 0.7 },
        { path: '/blog/ai-content-detection-guide-2024', priority: 0.7 },
        { path: '/blog/reverse-image-search-guide', priority: 0.7 },
        { path: '/seo-calculator', priority: 0.9 },
        { path: '/seo-cost-calculator', priority: 0.85 },
        { path: '/faq', priority: 0.7 },
    ];

    const guideEntries = guides.map(({ path, priority }) => ({
        url: `${baseUrl}${path}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority,
    }));

    return guideEntries;
}
