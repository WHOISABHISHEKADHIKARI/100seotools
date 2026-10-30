import Link from 'next/link';
import { generateStaticPageSchema } from '../../lib/schema';
import { getBaseUrl } from '../../lib/site';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'Bad Gateway (502) | 100 SEO Tools',
  description: 'Server error - The server received an invalid response from an upstream server.',
 
  ...createSocialMetadata({
    title: metadata.title,
    description: metadata.description,
    url: baseUrl,
    imageAlt: metadata.title,
  }),
 robots: { index: false, follow: false },
  alternates: { canonical: `${baseUrl}/502` },
};

export default function BadGatewayPage() {
  const pageSchema = generateStaticPageSchema({
    path: '/502',
    title: 'Bad Gateway (502) | 100 SEO Tools',
    description: 'Server error - The server received an invalid response from an upstream server.',
  }, baseUrl);

  pageSchema['@type'] = 'WebPage';
  pageSchema.lastmod = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  pageSchema.changefreq = 'weekly';

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bad Gateway (502)</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          The server received an invalid response from an upstream server. Try again shortly.
        </p>
        <StructuredData data={pageSchema} />
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/" className="btn">Go Home</Link>
        </div>
      </div>
    </div>
  );
}