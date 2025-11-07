export function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (envUrl) {
    const normalized = /^https?:\/\//.test(envUrl) ? envUrl : `https://${envUrl}`;
    return normalized.replace(/\/$/, '');
  }
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || '3001';
    return `http://localhost:${port}`;
  }
  return 'https://www.100seotools.com';
}

// Centralized site name constant for metadata and JSON-LD usage
export const siteName = '100 SEO Tools';