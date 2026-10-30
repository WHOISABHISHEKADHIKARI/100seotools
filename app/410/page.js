import Link from 'next/link';
import { generateStaticPageSchema } from '../../lib/schema';
import { getBaseUrl } from '../../lib/site';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'Gone (410) | 100 SEO Tools',
  description: 'Page deleted - The requested resource is no longer available and this condition is likely permanent.',
 
  ...createSocialMetadata({
    title: metadata.title,
    description: metadata.description,
    url: baseUrl,
    imageAlt: metadata.title,
  }),
 robots: { index: false, follow: false },
  alternates: { canonical: `${baseUrl}/410` },
};

export default function GonePage() {
  const pageSchema = generateStaticPageSchema({
    path: '/410',
    title: 'Gone (410) | 100 SEO Tools',
    description: 'Page deleted - The requested resource is no longer available and this condition is likely permanent.',
  }, baseUrl);

  pageSchema['@type'] = 'WebPage';
  pageSchema.lastmod = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  pageSchema.changefreq = 'yearly';

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gone (410)</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          The requested resource is no longer available and this condition is likely permanent.
        </p>
        <StructuredData data={pageSchema} />
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/" className="btn">Go Home</Link>
        </div>
      </div>
    </div>
  );
}