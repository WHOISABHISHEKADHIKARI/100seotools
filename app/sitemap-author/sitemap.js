import { getBaseUrl } from '../../lib/site';

/**
 * ============================================
 * AUTHOR SITEMAP - ROBUST FORMAT
 * ============================================
 *
 * Purpose: Comprehensive sitemap for author profile pages
 * Location: /sitemap-author.xml
 *
 * Coverage:
 * - Primary author profile (/author)
 * - Future: Multiple author profiles if added
 *
 * Author Information:
 * - Abhishek Adhikari
 * - SEO Expert, Full-Stack Developer
 * - Creator of 100 SEO Tools
 *
 * Priority Strategy:
 * - Primary author: 0.7 (medium-high - credibility)
 * - Additional authors: 0.65 (medium - supporting)
 *
 * Update Frequency:
 * - Author profiles: monthly (credentials, portfolio updates)
 */

/**
 * Author configuration type definition
 * @typedef {Object} AuthorConfig
 * @property {string} path - URL path
 * @property {number} priority - SEO priority (0.0-1.0)
 * @property {string} changeFreq - Update frequency
 * @property {string} [name] - Author name
 * @property {string} [role] - Author role/title
 */

/**
 * Validates author configuration
 * @param {AuthorConfig} author - Author configuration object
 * @returns {boolean} - Whether the author config is valid
 */
function validateAuthor(author) {
    if (!author || typeof author !== 'object') {
        console.warn('⚠️ Invalid author object:', author);
        return false;
    }

    if (!author.path || typeof author.path !== 'string') {
        console.warn('⚠️ Author missing valid path:', author);
        return false;
    }

    if (typeof author.priority !== 'number' || author.priority < 0 || author.priority > 1) {
        console.warn(`⚠️ Invalid priority ${author.priority} for author: ${author.path}`);
        return false;
    }

    const validFreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];
    if (!validFreqs.includes(author.changeFreq)) {
        console.warn(`⚠️ Invalid changeFreq ${author.changeFreq} for author: ${author.path}`);
        return false;
    }

    return true;
}

/**
 * Main sitemap generation function for authors
 * @returns {Array} Sitemap entries in Next.js format
 */
export default function sitemap() {
    const baseUrl = getBaseUrl();
    // Use a stable date for static content to avoid daily 'changes' that haven't happened
    const stableDate = new Date('2026-04-25');

    // ============================================
    // AUTHOR PAGES CONFIGURATION
    // ============================================
    const authors = [
        {
            path: '/author',
            priority: 0.7,
            changeFreq: 'monthly',
            name: 'Abhishek Adhikari',
            role: 'Creator & SEO Expert',
            description: 'Primary author profile - Creator of 100 SEO Tools'
        },
        // Future: Add more authors here as the team grows
        // Example:
        // {
        //   path: '/author/john-doe',
        //   priority: 0.65,
        //   changeFreq: 'monthly',
        //   name: 'John Doe',
        //   role: 'Contributing SEO Specialist'
        // },
    ];

    // ============================================
    // VALIDATE AUTHORS
    // ============================================
    const validAuthors = authors.filter(validateAuthor);

    if (validAuthors.length !== authors.length) {
        console.warn(`⚠️ Filtered out ${authors.length - validAuthors.length} invalid authors`);
    }

    // ============================================
    // GENERATE SITEMAP ENTRIES
    // ============================================
    const authorEntries = validAuthors.map(({ path, priority, changeFreq }) => ({
        url: `${baseUrl}${path}`,
        lastModified: stableDate,
        changeFrequency: changeFreq,
        priority,
    }));

    // ============================================
    // STATISTICS & LOGGING
    // ============================================
    if (process.env.NODE_ENV === 'development') {
        console.log('👤 Author Sitemap Generation:');
        console.log(`   📄 Total authors: ${validAuthors.length}`);
        validAuthors.forEach((author) => {
            console.log(`      • ${author.name || 'Unknown'} (${author.role || 'No role'})`);
        });
        console.log(`   🔗 Base URL: ${baseUrl}`);
    }

    // ============================================
    // RETURN ENTRIES
    // ============================================
    return authorEntries;
}
