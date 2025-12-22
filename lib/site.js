export function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  const preferHost = 'www.100seotools.com';
  const normalizeHttps = (u) => {
    const raw = /^https?:\/\//.test(u) ? u : `https://${u}`;
    try {
      const url = new URL(raw);
      const host = url.host.toLowerCase();
      if (host === '100seotools.com') {
        url.protocol = 'https:';
        url.host = preferHost;
      }
      if (host.endsWith('100seotools.com') && !host.startsWith('www.')) {
        url.protocol = 'https:';
        url.host = preferHost;
      }
      return url.origin;
    } catch {
      return raw.replace(/\/$/, '');
    }
  };
  if (envUrl) {
    return normalizeHttps(envUrl);
  }
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || '3000';
    return `http://localhost:${port}`;
  }
  return `https://${preferHost}`;
}

// Centralized site name constant for metadata and JSON-LD usage
export const siteName = '100 SEO Tools';

export const getAuthor = (baseUrl) => ({
  name: 'Abhishek Adhikari',
  jobTitle: 'Entrepreneur, SEO Expert & Full-Stack Developer',
  url: `${baseUrl}/author`,
  image: `${baseUrl}/author.png`,
  sameAs: [
    'https://github.com/WHOISABHISHEKADHIKARI',
    'https://hashtagweb.com.np/team/abhisek-adhikari/',
    'https://krishihimalaya.com/',
    'https://abhishekadhikari.com/',
    'https://www.adhikariavishek.com.np/',
    'https://deltaengineeringsolution.com',
    'https://www.linkedin.com/in/whoisabhishekadhikari/',
  ]
});


