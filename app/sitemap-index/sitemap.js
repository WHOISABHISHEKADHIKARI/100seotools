import { getBaseUrl } from '../../lib/site';

/**
 * ============================================
 * SITEMAP INDEX - GOOGLE SEARCH CONSOLE
 * ============================================
 *
 * Purpose: Master sitemap index that references all sub-sitemaps
 * Location: /sitemap-index.xml
 *
 * This is the MAIN sitemap to submit to Google Search Console
 * It references all other sitemaps for proper indexing
 *
 * Sub-sitemaps included:
 * 1. sitemap.xml - Core static pages (24 pages)
 * 2. sitemap-tools.xml - All SEO tools (105+ pages)
 * 3. sitemap-blog.xml - Blog posts
 * 4. sitemap-guides.xml - Guides & tutorials
 * 5. sitemap-categories.xml - Category pages (10 categories)
 * 6. sitemap-author.xml - Author profile
 * 7. sitemap-static.xml - Static pages (redundancy)
 *
 * Google Search Console Setup:
 * Submit this URL: https://yourdomain.com/sitemap-index.xml
 */

/**
 * Generates sitemap index entries
 * @returns {Array} Sitemap index entries
 */
export default function sitemapIndex() {
    const baseUrl = getBaseUrl();
    const now = new Date();

    // ============================================
    // ALL SUB-SITEMAPS
    // ============================================
    const sitemaps = [
        {
            url: `${baseUrl}/sitemap.xml`,
            lastModified: now,
            description: 'Core static pages (Home, Blog, Categories, etc.)'
        },
        {
            url: `${baseUrl}/sitemap-tools.xml`,
            lastModified: now,
            description: 'All 105+ SEO tools'
        },
        {
            url: `${baseUrl}/sitemap-blog.xml`,
            lastModified: now,
            description: 'Blog posts and articles'
        },
        {
            url: `${baseUrl}/sitemap-guides.xml`,
            lastModified: now,
            description: 'SEO guides and tutorials'
        },
        {
            url: `${baseUrl}/sitemap-categories.xml`,
            lastModified: now,
            description: 'All 10 category pages'
        },
        {
            url: `${baseUrl}/sitemap-author.xml`,
            lastModified: now,
            description: 'Author profile page'
        },
        {
            url: `${baseUrl}/sitemap-static.xml`,
            lastModified: now,
            description: 'Static pages (redundancy)'
        },
    ];

    // ============================================
    // LOGGING
    // ============================================
    if (process.env.NODE_ENV === 'development') {
        console.log('🗺️  Sitemap Index Generation:');
        console.log(`   📄 Total sub-sitemaps: ${sitemaps.length}`);
        console.log(`   🔗 Submit to GSC: ${baseUrl}/sitemap-index.xml`);
        sitemaps.forEach((sm, i) => {
            console.log(`   ${i + 1}. ${sm.url.split('/').pop()} - ${sm.description}`);
        });
    }

    // ============================================
    // RETURN SITEMAP INDEX
    // ============================================
    return sitemaps.map(({ url, lastModified }) => ({
        url,
        lastModified,
    }));
}
