import { getBaseUrl } from '../lib/site';
const baseUrl = getBaseUrl();

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Block sensitive, error, and duplicate-content endpoints
        disallow: [
          '/api',
          '/404',
          '/410',
          '/429',
          '/500',
          '/502',
          '/offline',
          '/card-demo',
          '/blog/*/p/',
          '/blog/*/p/*',
          '/blog/p/'
        ],
        // Explicitly allow essential static assets for rendering
        // Note: Google supports wildcard patterns (* and $)
        // These lines improve clarity for non-Google bots too
        crawlDelay: 5,
      },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
