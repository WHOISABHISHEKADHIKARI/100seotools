const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://100tools.app';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api'] }],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}