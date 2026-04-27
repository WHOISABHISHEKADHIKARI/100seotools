import { getBaseUrl } from '../../lib/site';

export async function GET() {
    const baseUrl = getBaseUrl();
    // Use a stable date for the sitemap index to avoid constant 'updates' in Search Console
    const stableDate = new Date('2026-04-25').toISOString();

    // Define the sub-sitemaps
    // Note: App Router 'sitemap.js' in a folder generates '/folder/sitemap.xml'
    const sitemaps = [
        `${baseUrl}/sitemap-tools/sitemap.xml`,      // SEO Tools
        `${baseUrl}/sitemap-blog/sitemap.xml`,       // Blog
        `${baseUrl}/sitemap-guides/sitemap.xml`,     // Guides
        `${baseUrl}/sitemap-categories/sitemap.xml`, // Categories
        `${baseUrl}/sitemap-author/sitemap.xml`,     // Author
        `${baseUrl}/sitemap-static/sitemap.xml`,     // Static redundancy
    ];

    // Generate the XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(url => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${stableDate}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
    });
}
