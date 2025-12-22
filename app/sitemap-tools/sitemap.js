import { getAllToolsMeta } from '../../tools';
import { getBaseUrl } from '../../lib/site';

/**
 * ============================================
 * TOOLS SITEMAP - ROBUST FORMAT
 * ============================================
 *
 * Purpose: Comprehensive sitemap for all 105+ SEO tools
 * Location: /sitemap-tools.xml
 *
 * Coverage:
 * - Tools index page (/tools)
 * - All individual tool pages (/tools/[slug])
 *
 * Categories Included:
 * - Keyword Research
 * - On-Page Optimization
 * - Technical SEO
 * - Backlink & Link-Building
 * - Content SEO
 * - SEO Performance
 * - Local SEO
 * - Competitor Analysis
 * - AI-Powered SEO
 * - SEO Utility
 *
 * Priority Strategy:
 * - Tools index: 0.9 (high - main directory)
 * - Individual tools: 0.8 (high - core content)
 * - AI-powered tools: 0.85 (premium tools)
 *
 * Update Frequency:
 * - Tools index: daily (new tools added regularly)
 * - Individual tools: weekly (content updates)
 */

/**
 * Validates tool metadata
 * @param {Object} tool - Tool metadata object
 * @returns {boolean} - Whether the tool is valid
 */
function validateTool(tool) {
    if (!tool || typeof tool !== 'object') {
        console.warn('⚠️ Invalid tool object:', tool);
        return false;
    }

    if (!tool.slug || typeof tool.slug !== 'string') {
        console.warn('⚠️ Tool missing valid slug:', tool);
        return false;
    }

    if (!tool.name || typeof tool.name !== 'string') {
        console.warn('⚠️ Tool missing valid name:', tool);
        return false;
    }

    return true;
}

/**
 * Determines priority based on tool category
 * @param {Object} tool - Tool metadata
 * @returns {number} - Priority value (0.0-1.0)
 */
function getToolPriority(tool) {
    // AI-powered tools get higher priority
    if (tool.category === 'AI-Powered SEO') {
        return 0.85;
    }

    // Featured or popular tools
    if (tool.featured || tool.popular) {
        return 0.85;
    }

    // Standard tools
    return 0.8;
}

/**
 * Determines change frequency based on tool type
 * @param {Object} tool - Tool metadata
 * @returns {string} - Change frequency
 */
function getToolChangeFreq(tool) {
    // AI tools updated more frequently
    if (tool.category === 'AI-Powered SEO') {
        return 'daily';
    }

    // Standard tools
    return 'weekly';
}

/**
 * Main sitemap generation function for tools
 * @returns {Array} Sitemap entries in Next.js format
 */
export default function sitemap() {
    const baseUrl = getBaseUrl();
    const now = new Date();

    // ============================================
    // GET ALL TOOLS
    // ============================================
    let tools = [];
    try {
        tools = getAllToolsMeta();
    } catch (error) {
        console.error('❌ Error loading tools metadata:', error);
        return [];
    }

    // Validate tools
    const validTools = tools.filter(validateTool);

    if (validTools.length !== tools.length) {
        console.warn(`⚠️ Filtered out ${tools.length - validTools.length} invalid tools`);
    }

    // ============================================
    // TOOLS INDEX PAGE
    // ============================================
    const toolsIndex = {
        url: `${baseUrl}/tools`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.9,
    };

    // ============================================
    // INDIVIDUAL TOOL PAGES
    // ============================================
    const toolEntries = validTools.map((tool) => ({
        url: `${baseUrl}/tools/${tool.slug}`,
        lastModified: now,
        changeFrequency: getToolChangeFreq(tool),
        priority: getToolPriority(tool),
    }));

    // ============================================
    // STATISTICS & LOGGING
    // ============================================
    if (process.env.NODE_ENV === 'development') {
        const categoryStats = validTools.reduce((acc, tool) => {
            const cat = tool.category || 'Uncategorized';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {});

        console.log('🛠️  Tools Sitemap Generation:');
        console.log(`   📄 Total tools: ${validTools.length}`);
        console.log(`   📊 By category:`);
        Object.entries(categoryStats)
            .sort((a, b) => b[1] - a[1])
            .forEach(([cat, count]) => {
                console.log(`      • ${cat}: ${count}`);
            });
        console.log(`   🔗 Base URL: ${baseUrl}`);
    }

    // ============================================
    // RETURN COMBINED ENTRIES
    // ============================================
    return [toolsIndex, ...toolEntries];
}
