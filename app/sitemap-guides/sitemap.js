import { getBaseUrl } from '../../lib/site';

/**
 * ============================================
 * GUIDES SITEMAP - ROBUST FORMAT
 * ============================================
 *
 * Purpose: Comprehensive sitemap for SEO guides and educational content
 * Location: /sitemap-guides.xml
 *
 * Coverage:
 * - SEO educational guides
 * - Tutorial content
 * - Calculator tools
 * - FAQ pages
 *
 * Content Types:
 * - Foundational guides (SEO Basics)
 * - Advanced guides (AI-based techniques)
 * - Tool-specific guides (Calculators)
 * - Reference content (FAQ)
 *
 * Priority Strategy:
 * - Calculators: 0.85-0.9 (highest - interactive tools)
 * - Foundational guides: 0.8 (high - evergreen content)
 * - Advanced guides: 0.7-0.75 (medium-high - specialized)
 * - FAQ: 0.7 (medium-high - support)
 *
 * Update Frequency:
 * - Calculators: weekly (feature updates)
 * - Guides: weekly (content updates)
 * - FAQ: monthly (new questions)
 */

/**
 * Guide configuration type definition
 * @typedef {Object} GuideConfig
 * @property {string} path - URL path
 * @property {number} priority - SEO priority (0.0-1.0)
 * @property {string} [changeFreq] - Update frequency
 * @property {string} [type] - Content type (guide, calculator, faq)
 * @property {string} [description] - Content description
 */

/**
 * Validates guide configuration
 * @param {GuideConfig} guide - Guide configuration object
 * @returns {boolean} - Whether the guide config is valid
 */
function validateGuide(guide) {
    if (!guide || typeof guide !== 'object') {
        console.warn('⚠️ Invalid guide object:', guide);
        return false;
    }

    if (!guide.path || typeof guide.path !== 'string') {
        console.warn('⚠️ Guide missing valid path:', guide);
        return false;
    }

    if (typeof guide.priority !== 'number' || guide.priority < 0 || guide.priority > 1) {
        console.warn(`⚠️ Invalid priority ${guide.priority} for guide: ${guide.path}`);
        return false;
    }

    return true;
}

/**
 * Main sitemap generation function for guides
 * @returns {Array} Sitemap entries in Next.js format
 */
export default function sitemap() {
    const baseUrl = getBaseUrl();
    const now = new Date();

    // ============================================
    // GUIDE PAGES CONFIGURATION
    // ============================================
    const guides = [
        // Foundational Guides
        {
            path: '/blog/seo-basics',
            priority: 0.8,
            changeFreq: 'weekly',
            type: 'guide',
            description: 'SEO Fundamentals Guide'
        },
        {
            path: '/blog/seo-basics-0',
            priority: 0.8,
            changeFreq: 'weekly',
            type: 'guide',
            description: 'SEO Basics Introduction'
        },

        // Latest Guides
        {
            path: '/blog/latest-seo-guides',
            priority: 0.75,
            changeFreq: 'weekly',
            type: 'guide',
            description: 'Latest SEO Strategies'
        },

        // Advanced/Specialized Guides
        {
            path: '/blog/latest-ai-based-tips-and-tricks-for-fast-web-crawling',
            priority: 0.7,
            changeFreq: 'weekly',
            type: 'guide',
            description: 'AI-Based Web Crawling Guide'
        },
        {
            path: '/blog/ai-content-detection-guide-2024',
            priority: 0.7,
            changeFreq: 'weekly',
            type: 'guide',
            description: 'AI Content Detection Guide'
        },
        {
            path: '/blog/reverse-image-search-guide',
            priority: 0.7,
            changeFreq: 'weekly',
            type: 'guide',
            description: 'Reverse Image Search Tutorial'
        },

        // Calculator Tools
        {
            path: '/seo-calculator',
            priority: 0.9,
            changeFreq: 'weekly',
            type: 'calculator',
            description: 'SEO ROI Calculator'
        },
        {
            path: '/seo-cost-calculator',
            priority: 0.85,
            changeFreq: 'weekly',
            type: 'calculator',
            description: 'SEO Cost Estimator'
        },

        // Support Pages
        {
            path: '/faq',
            priority: 0.7,
            changeFreq: 'monthly',
            type: 'faq',
            description: 'Frequently Asked Questions'
        },
    ];

    // ============================================
    // VALIDATE GUIDES
    // ============================================
    const validGuides = guides.filter(validateGuide);

    if (validGuides.length !== guides.length) {
        console.warn(`⚠️ Filtered out ${guides.length - validGuides.length} invalid guides`);
    }

    // ============================================
    // GENERATE SITEMAP ENTRIES
    // ============================================
    const guideEntries = validGuides.map(({ path, priority, changeFreq }) => ({
        url: `${baseUrl}${path}`,
        lastModified: now,
        changeFrequency: changeFreq || 'weekly',
        priority,
    }));

    // ============================================
    // STATISTICS & LOGGING
    // ============================================
    if (process.env.NODE_ENV === 'development') {
        const typeStats = validGuides.reduce((acc, guide) => {
            const type = guide.type || 'other';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});

        console.log('📚 Guides Sitemap Generation:');
        console.log(`   📄 Total guides: ${validGuides.length}`);
        console.log(`   📊 By type:`);
        Object.entries(typeStats)
            .sort((a, b) => b[1] - a[1])
            .forEach(([type, count]) => {
                console.log(`      • ${type}: ${count}`);
            });
        console.log(`   🔗 Base URL: ${baseUrl}`);
    }

    // ============================================
    // RETURN ENTRIES
    // ============================================
    return guideEntries;
}
