import { getAllToolsMeta } from '../../tools';
import { getBaseUrl } from '../../lib/site';

/**
 * Sitemap for category pages
 * Located at /sitemap-categories.xml
 */
export default function sitemap() {
    const baseUrl = getBaseUrl();
    const now = new Date();

    // Get all unique categories from tools
    const tools = getAllToolsMeta();
    const categories = [...new Set(tools.map((t) => t.category).filter(Boolean))];

    const slugify = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Category index page
    const categoryIndex = {
        url: `${baseUrl}/category`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
    };

    // Individual category pages
    const categoryEntries = categories.map((cat) => ({
        url: `${baseUrl}/category/${slugify(cat)}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.75,
    }));

    return [categoryIndex, ...categoryEntries];
}
