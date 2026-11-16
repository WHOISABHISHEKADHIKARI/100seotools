import { getBaseUrl } from '../../lib/site';

/**
 * Dynamic robots.txt generator
 * SEO + AI friendly configuration
 */
export async function GET() {
    const baseUrl = getBaseUrl();

    const robotsTxt = `# 100SEOTools Robots.txt
# SEO + AI Friendly Configuration
# Last updated: ${new Date().toISOString().split('T')[0]}

# Default: Allow all crawlers
User-Agent: *
Allow: /

# Block pagination, duplicate content, and framework internal params
Disallow: /*/p/
Disallow: /*/tp/
Disallow: /*?page=
Disallow: /*?_rsc
Disallow: /api/

# Block tool-overlap blog redirect variants (redirect to /tools/*)
Disallow: /blog/*-overview
Disallow: /blog/*-guide
Disallow: /blog/*-how-to-use
Disallow: /blog/*-features-benefits-keywords
Disallow: /blog/*-best-practices-integrations-costs
Disallow: /blog/*-checklist-workflow
Disallow: /blog/*-popular-search-terms

# Block tool variant redirect URLs (redirect to /tools/*)
Disallow: /tools/*-guide
Disallow: /tools/*-best-practices-integrations-costs
Disallow: /tools/*-features-benefits-keywords
Disallow: /tools/*-checklist-workflow
Disallow: /tools/*-popular-search-terms
Disallow: /tools/*-how-to-use

# Block numbered SEO basics redirect variants (redirect to /blog/seo-basics)
Disallow: /blog/seo-basics-

# Block error pages
Disallow: /404
Disallow: /500

# Block service worker and offline page (no SEO value, wastes crawl budget)
Disallow: /sw.js
Disallow: /offline

# AI Crawlers - Allow for visibility
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: meta-externalagent
Allow: /

# Block harmful/training-only bots
User-agent: CCBot
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: anthropic-ai
Disallow: /

# Sitemap locations (Master index)
# Submit sitemap.xml to Google Search Console
Sitemap: ${baseUrl}/sitemap.xml
`;

    return new Response(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=86400',
        },
    });
}
