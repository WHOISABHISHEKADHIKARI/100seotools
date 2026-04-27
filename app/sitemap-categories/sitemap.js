import { getAllToolsMeta } from '../../tools';
import { getBaseUrl } from '../../lib/site';

/**
 * ============================================
 * CATEGORIES SITEMAP - ROBUST FORMAT
 * ============================================
 *
 * Purpose: Comprehensive sitemap for all category pages
 * Location: /sitemap-categories.xml
 *
 * Coverage:
 * - Category index page (/category)
 * - All 10 category pages (/category/[slug])
 *
 * Categories:
 * 1. Keyword Research
 * 2. On-Page Optimization
 * 3. Technical SEO
 * 4. Backlink & Link-Building
 * 5. Content SEO
 * 6. SEO Performance
 * 7. Local SEO
 * 8. Competitor Analysis
 * 9. AI-Powered SEO (Premium)
 * 10. SEO Utility
 *
 * Priority Strategy:
 * - Category index: 0.8 (high - navigation hub)
 * - AI-Powered SEO: 0.8 (premium category)
 * - Standard categories: 0.75 (high - core content)
 *
 * Update Frequency:
 * - All categories: weekly (new tools added regularly)
 */

/**
 * Slugifies a string for URL usage
 * @param {string} str - String to slugify
 * @returns {string} - Slugified string
 */
function slugify(str) {
    if (!str || typeof str !== 'string') {
        console.warn('⚠️ Invalid string for slugification:', str);
        return '';
    }

    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

/**
 * Validates category name
 * @param {string} category - Category name
 * @returns {boolean} - Whether the category is valid
 */
function validateCategory(category) {
    if (!category || typeof category !== 'string') {
        console.warn('⚠️ Invalid category:', category);
        return false;
    }

    if (category.trim().length === 0) {
        console.warn('⚠️ Empty category name');
        return false;
    }

    return true;
}

/**
 * Determines priority based on category
 * @param {string} category - Category name
 * @returns {number} - Priority value (0.0-1.0)
 */
function getCategoryPriority(category) {
    // Premium categories
    if (category === 'AI-Powered SEO') {
        return 0.8;
    }

    // High-traffic categories
    const highTrafficCategories = [
        'Keyword Research',
        'On-Page Optimization',
        'Technical SEO'
    ];

    if (highTrafficCategories.includes(category)) {
        return 0.77;
    }

    // Standard categories
    return 0.75;
}

/**
 * Determines change frequency based on category
 * @param {string} category - Category name
 * @returns {string} - Change frequency
 */
function getCategoryChangeFreq(category) {
    // AI category updated more frequently
    if (category === 'AI-Powered SEO') {
        return 'daily';
    }

    // Standard categories
    return 'weekly';
}

/**
 * Main sitemap generation function for categories
 * @returns {Array} Sitemap entries in Next.js format
 */
export default function sitemap() {
    const baseUrl = getBaseUrl();
    // Use a stable date for static content to avoid daily 'changes' that haven't happened
    const stableDate = new Date('2026-04-25');

    // ============================================
    // GET ALL CATEGORIES FROM TOOLS
    // ============================================
    let tools = [];
    try {
        tools = getAllToolsMeta();
    } catch (error) {
        console.error('❌ Error loading tools metadata:', error);
        return [];
    }

    // Extract unique categories
    const categories = [...new Set(
        tools
            .map((t) => t.category)
            .filter(Boolean)
            .filter(validateCategory)
    )];

    // ============================================
    // CATEGORY INDEX PAGE
    // ============================================
    const categoryIndex = {
        url: `${baseUrl}/category`,
        lastModified: stableDate,
        changeFrequency: 'weekly',
        priority: 0.8,
    };

    // ============================================
    // INDIVIDUAL CATEGORY PAGES
    // ============================================
    const categoryEntries = categories.map((cat) => {
        const slug = slugify(cat);

        if (!slug) {
            console.warn(`⚠️ Failed to slugify category: ${cat}`);
            return null;
        }

        return {
            url: `${baseUrl}/category/${slug}`,
            lastModified: stableDate,
            changeFrequency: getCategoryChangeFreq(cat),
            priority: getCategoryPriority(cat),
        };
    }).filter(Boolean); // Remove null entries

    // ============================================
    // STATISTICS & LOGGING
    // ============================================
    if (process.env.NODE_ENV === 'development') {
        const toolsPerCategory = categories.reduce((acc, cat) => {
            acc[cat] = tools.filter(t => t.category === cat).length;
            return acc;
        }, {});

        console.log('📁 Categories Sitemap Generation:');
        console.log(`   📄 Total categories: ${categories.length}`);
        console.log(`   📊 Tools per category:`);
        Object.entries(toolsPerCategory)
            .sort((a, b) => b[1] - a[1])
            .forEach(([cat, count]) => {
                console.log(`      • ${cat}: ${count} tools`);
            });
        console.log(`   🔗 Base URL: ${baseUrl}`);
    }

    // ============================================
    // RETURN COMBINED ENTRIES
    // ============================================
    return [categoryIndex, ...categoryEntries];
}
