import { getBaseUrl } from '../../lib/site';

export async function GET() {
    const baseUrl = getBaseUrl();
    const robotsTxt = `# SEO + AI Friendly Robots.txt
# Allows search engines + AI assistants to access content
# Prevents AI model training

User-Agent: *
Content-signal: search=yes,ai-input=yes,ai-train=no
Allow: /

# Allow Google AI
User-agent: Google-Extended
Allow: /

# Allow GPT-based crawlers
User-agent: GPTBot
Allow: /

# Allow Claude
User-agent: ClaudeBot
Allow: /

# Allow Apple AI
User-agent: Applebot-Extended
Allow: /

# Allow Meta's AI systems
User-agent: meta-externalagent
Allow: /

# Allow Perplexity
User-agent: PerplexityBot
Allow: /

# Allow ByteDance's bot (optional — TikTok SEO benefit)
User-agent: Bytespider
Allow: /

# Block only non-essential or harmful bots
User-agent: CCBot
Disallow: /

User-agent: Amazonbot
Disallow: /

Sitemap: ${baseUrl}/sitemap.xml`;

    return new Response(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}
