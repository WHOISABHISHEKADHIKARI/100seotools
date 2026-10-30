import Link from 'next/link';
import { generateStaticPageSchema } from '../../lib/schema';
import { getBaseUrl } from '../../lib/site';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'Forbidden (403) | 100 SEO Tools',
  description: 'Access denied - You do not have permission to access the requested resource.',
 
  ...createSocialMetadata({
    title: metadata.title,
    description: metadata.description,
    url: baseUrl,
    imageAlt: metadata.title,
  }),
 robots: { index: false, follow: false },
  alternates: { canonical: `${baseUrl}/403` },
};

export default function ForbiddenPage() {
  const pageSchema = generateStaticPageSchema({
    path: '/403',
    title: 'Forbidden (403) | 100 SEO Tools',
    description: 'Access denied - You do not have permission to access the requested resource.',
  }, baseUrl);

  pageSchema['@type'] = 'WebPage';
  pageSchema.lastmod = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  pageSchema.changefreq = 'monthly';

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Forbidden (403)</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          You do not have permission to access the requested resource.
        </p>
        <StructuredData data={pageSchema} />
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/" className="btn">Go Home</Link>
        </div>
      </div>
    </div>
  );
}