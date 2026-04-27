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

# Block pagination and duplicate content
Disallow: /*/p/
Disallow: /*/tp/
Disallow: /*?page=
Disallow: /api/
Disallow: /_next/

# Block error pages
Disallow: /404
Disallow: /500

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
