import Link from 'next/link';
import { generateStaticPageSchema } from '../../lib/schema';
import { getBaseUrl } from '../../lib/site';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'Bad Request (400) | 100 SEO Tools',
  description: 'Page not found - Bad Request. The server could not understand your request due to invalid syntax.',
 
  ...createSocialMetadata({
    title: metadata.title,
    description: metadata.description,
    url: baseUrl,
    imageAlt: metadata.title,
  }),
 robots: { index: false, follow: false },
  alternates: { canonical: `${baseUrl}/400` },
};

export default function BadRequestPage() {
  const pageSchema = generateStaticPageSchema({
    path: '/400',
    title: 'Bad Request (400) | 100 SEO Tools',
    description: 'Page not found - Bad Request. The server could not understand your request due to invalid syntax.',
  }, baseUrl);

  pageSchema['@type'] = 'WebPage';
  pageSchema.lastmod = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  pageSchema.changefreq = 'monthly';

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bad Request (400)</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          The server could not understand your request. Check the URL or parameters and try again.
        </p>
        <StructuredData data={pageSchema} />
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/" className="btn">Go Home</Link>
        </div>
      </div>
    </div>
  );
}