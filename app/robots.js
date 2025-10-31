const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://100tools.app';

export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api'] },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}