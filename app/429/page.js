import Link from 'next/link';
import { generateStaticPageSchema } from '../../lib/schema';
import { getBaseUrl } from '../../lib/site';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'Too Many Requests (429) | 100 SEO Tools',
  description: 'Rate limited - Too many requests have been sent in a given amount of time.',
 
  ...createSocialMetadata({
    title: metadata.title,
    description: metadata.description,
    url: baseUrl,
    imageAlt: metadata.title,
  }),
 robots: { index: false, follow: false },
  alternates: { canonical: `${baseUrl}/429` },
};

export default function RateLimitedPage() {
  const pageSchema = generateStaticPageSchema({
    path: '/429',
    title: 'Too Many Requests (429) | 100 SEO Tools',
    description: 'Rate limited - Too many requests have been sent in a given amount of time.',
  }, baseUrl);

  pageSchema['@type'] = 'WebPage';
  pageSchema.lastmod = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  pageSchema.changefreq = 'daily';

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Too Many Requests (429)</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Too many requests have been sent in a given amount of time. Please try again later.
        </p>
        <StructuredData data={pageSchema} />
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/" className="btn">Go Home</Link>
        </div>
      </div>
    </div>
  );
}