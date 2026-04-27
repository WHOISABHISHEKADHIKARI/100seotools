import { getBaseUrl } from '../../lib/site';

/**
 * ============================================
 * STATIC PAGES SITEMAP - ROBUST FORMAT
 * ============================================
 *
 * Purpose: Comprehensive sitemap for all static pages organized by sections
 * Location: /sitemap-static.xml
 *
 * Sections:
 * 1. Core Pages (Home, Blog, Guides, Contact)
 * 2. Categories (All 10 SEO Categories)
 * 3. Calculators (SEO Calculator, Cost Calculator)
 * 4. Author & About
 * 5. Legal & Utility
 *
 * Priority Scale:
 * - 1.0: Homepage (highest)
 * - 0.9: Tools hub
 * - 0.8-0.85: Primary content (Blog, Guides, AI categories)
 * - 0.75: Standard categories & calculators
 * - 0.65: About/Author
 * - 0.3: Legal pages (lowest)
 *
 * Change Frequency:
 * - daily: Home, Blog, Tools, AI categories
 * - weekly: Guides, Categories, Calculators
 * - monthly: About, Author, Contact
 * - yearly: Privacy, Terms
 */

/**
 * Page configuration type definition
 * @typedef {Object} PageConfig
 * @property {string} path - URL path
 * @property {number} priority - SEO priority (0.0-1.0)
 * @property {string} changeFreq - Update frequency
 * @property {string} section - Section name for organization
 */

/**
 * Validates page configuration
 * @param {PageConfig} page - Page configuration object
 * @returns {boolean} - Whether the page config is valid
 */
function validatePageConfig(page) {
    if (!page.path || typeof page.path !== 'string') {
        console.warn(`Invalid path for page: ${JSON.stringify(page)}`);
        return false;
    }
    if (page.priority < 0 || page.priority > 1) {
        console.warn(`Invalid priority ${page.priority} for path: ${page.path}`);
        return false;
    }
    const validFreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
    if (!validFreqs.includes(page.changeFreq)) {
        console.warn(`Invalid changeFreq ${page.changeFreq} for path: ${page.path}`);
        return false;
    }
    return true;
}

/**
 * Main sitemap generation function
 * @returns {Array} Sitemap entries in Next.js format
 */
export default function sitemap() {
    const baseUrl = getBaseUrl();
    // Use a stable date for static content to avoid daily 'changes' that haven't happened
    const stableDate = new Date('2026-04-25');

    // ============================================
    // SECTION 1: CORE PAGES
    // ============================================
    const corePages = [
        {
            path: '/',
            priority: 1.0,
            changeFreq: 'daily',
            section: 'Core',
            description: 'Homepage - Main entry point'
        },
        {
            path: '/blog',
            priority: 0.85,
            changeFreq: 'daily',
            section: 'Core',
            description: 'Blog listing page'
        },
        {
            path: '/blog/latest-seo-guides',
            priority: 0.8,
            changeFreq: 'weekly',
            section: 'Core',
            description: 'Latest SEO guides and tutorials'
        },
        {
            path: '/contact',
            priority: 0.65,
            changeFreq: 'monthly',
            section: 'Core',
            description: 'Contact form'
        },
    ];

    // ============================================
    // SECTION 2: CATEGORY PAGES (10 Categories)
    // ============================================
    const categoryPages = [
        {
            path: '/category/keyword-research',
            priority: 0.75,
            changeFreq: 'weekly',
            section: 'Categories',
            description: 'Keyword Research Tools'
        },
        {
            path: '/category/on-page-optimization',
            priority: 0.75,
            changeFreq: 'weekly',
            section: 'Categories',
            description: 'On-Page SEO Tools'
        },
        {
            path: '/category/technical-seo',
            priority: 0.75,
            changeFreq: 'weekly',
            section: 'Categories',
            description: 'Technical SEO Tools'
        },
        {
            path: '/category/backlink-link-building',
            priority: 0.75,
            changeFreq: 'weekly',
            section: 'Categories',
            description: 'Backlink & Link Building Tools'
        },
        {
            path: '/category/content-seo',
            priority: 0.75,
            changeFreq: 'weekly',
            section: 'Categories',
            description: 'Content SEO Tools'
        },
        {
            path: '/category/seo-performance',
            priority: 0.75,
            changeFreq: 'weekly',
            section: 'Categories',
            description: 'SEO Performance Analytics'
        },
        {
            path: '/category/local-seo',
            priority: 0.75,
            changeFreq: 'weekly',
            section: 'Categories',
            description: 'Local SEO Tools'
        },
        {
            path: '/category/competitor-analysis',
            priority: 0.75,
            changeFreq: 'weekly',
            section: 'Categories',
            description: 'Competitor Analysis Tools'
        },
        {
            path: '/category/ai-powered-seo',
            priority: 0.8,
            changeFreq: 'daily',
            section: 'Categories',
            description: 'AI-Powered SEO Tools (Premium)'
        },
        {
            path: '/category/seo-utility',
            priority: 0.75,
            changeFreq: 'weekly',
            section: 'Categories',
            description: 'SEO Utility Tools'
        },
    ];

    // ============================================
    // SECTION 3: CALCULATOR PAGES
    // ============================================
    const calculatorPages = [
        {
            path: '/seo-calculator',
            priority: 0.75,
            changeFreq: 'weekly',
            section: 'Calculators',
            description: 'SEO ROI Calculator'
        },
        {
            path: '/seo-cost-calculator',
            priority: 0.75,
            changeFreq: 'weekly',
            section: 'Calculators',
            description: 'SEO Cost Estimator'
        },
    ];

    // ============================================
    // SECTION 4: AUTHOR & ABOUT PAGES
    // ============================================
    const authorPages = [
        {
            path: '/author',
            priority: 0.65,
            changeFreq: 'monthly',
            section: 'Author',
            description: 'Author profile and credentials'
        },
        {
            path: '/about',
            priority: 0.65,
            changeFreq: 'monthly',
            section: 'About',
            description: 'About 100 SEO Tools'
        },
    ];

    // ============================================
    // SECTION 5: LEGAL & UTILITY PAGES
    // ============================================
    const utilityPages = [
        {
            path: '/tools',
            priority: 0.9,
            changeFreq: 'daily',
            section: 'Utility',
            description: 'All Tools Directory'
        },
        {
            path: '/privacy',
            priority: 0.3,
            changeFreq: 'yearly',
            section: 'Legal',
            description: 'Privacy Policy'
        },
        {
            path: '/terms',
            priority: 0.3,
            changeFreq: 'yearly',
            section: 'Legal',
            description: 'Terms of Service'
        },
    ];

    // ============================================
    // COMBINE & VALIDATE ALL SECTIONS
    // ============================================
    const allPages = [
        ...corePages,
        ...categoryPages,
        ...calculatorPages,
        ...authorPages,
        ...utilityPages,
    ];

    // Validate all pages
    const validPages = allPages.filter(validatePageConfig);

    // Log statistics in development
    if (process.env.NODE_ENV === 'development') {
        console.log('📊 Sitemap Statistics:');
        console.log(`   Total pages: ${validPages.length}`);
        console.log(`   Core: ${corePages.length}`);
        console.log(`   Categories: ${categoryPages.length}`);
        console.log(`   Calculators: ${calculatorPages.length}`);
        console.log(`   Author/About: ${authorPages.length}`);
        console.log(`   Utility/Legal: ${utilityPages.length}`);
    }

    // ============================================
    // GENERATE SITEMAP ENTRIES
    // ============================================
    return validPages.map(({ path, priority, changeFreq }) => ({
        url: `${baseUrl}${path}`,
        lastModified: stableDate,
        changeFrequency: changeFreq,
        priority,
    }));
}
