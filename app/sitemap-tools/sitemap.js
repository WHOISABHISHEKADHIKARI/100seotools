import { getAllToolsMeta } from '../../tools';
import { getBaseUrl } from '../../lib/site';

/**
 * Sitemap for all SEO tools
 * Located at /sitemap-tools.xml
 */
export default function sitemap() {
    const baseUrl = getBaseUrl();
    const now = new Date();

    const tools = getAllToolsMeta();

    // Tool index page
    const toolsIndex = {
        url: `${baseUrl}/tools`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.9,
    };

    // Individual tool pages
    const toolEntries = tools.map((tool) => ({
        url: `${baseUrl}/tools/${tool.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    return [toolsIndex, ...toolEntries];
}
