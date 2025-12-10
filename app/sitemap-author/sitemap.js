import { getBaseUrl } from '../../lib/site';

/**
 * Sitemap for author profile(s)
 * Located at /sitemap-author/sitemap.xml
 */
export default function sitemap() {
    const baseUrl = getBaseUrl();
    const now = new Date();

    // Author pages
    const authors = [
        { path: '/author', priority: 0.7, changeFreq: 'monthly' },
        // If you add more authors in the future, list them here or fetch dynamically
    ];

    const authorEntries = authors.map(({ path, priority, changeFreq }) => ({
        url: `${baseUrl}${path}`,
        lastModified: now,
        changeFrequency: changeFreq,
        priority,
    }));

    return authorEntries;
}
