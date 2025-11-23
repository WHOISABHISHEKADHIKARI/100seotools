import { getBaseUrl } from '../lib/site';
const baseUrl = getBaseUrl();

export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/' }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
