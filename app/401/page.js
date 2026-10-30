import Link from 'next/link';
import { generateStaticPageSchema } from '../../lib/schema';
import { getBaseUrl } from '../../lib/site';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'Unauthorized (401) | 100 SEO Tools',
  description: 'Page not authorized - Access is denied. You do not have permission to view this page.',
 
  ...createSocialMetadata({
    title: metadata.title,
    description: metadata.description,
    url: baseUrl,
    imageAlt: metadata.title,
  }),
 robots: { index: false, follow: false },
  alternates: { canonical: `${baseUrl}/401` },
};

export default function UnauthorizedPage() {
  const pageSchema = generateStaticPageSchema({
    path: '/401',
    title: 'Unauthorized (401) | 100 SEO Tools',
    description: 'Page not authorized - Access is denied. You do not have permission to view this page.',
  }, baseUrl);

  pageSchema['@type'] = 'WebPage';
  pageSchema.lastmod = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  pageSchema.changefreq = 'monthly';

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Unauthorized (401)</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          Access is denied. You do not have permission to view this page.
        </p>
        <StructuredData data={pageSchema} />
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/" className="btn">Go Home</Link>
        </div>
      </div>
    </div>
  );
}