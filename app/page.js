import HomePageClient from './HomePageClient';
import { getAllToolsMeta } from '../tools';
import { getBaseUrl } from '../lib/site';
import { createSocialMetadata } from '../lib/socialMetadata';
import { generateStaticPageSchema, generateHomepageGraphSchema } from '../lib/schema';
import StructuredData from '../components/ui/StructuredData';
import { socialLinks } from '../lib/site';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'Free SEO Tools: Keyword Research, Audits & Schema | 100 SEO Tools',
  description: '100+ free SEO tools for keyword research, on-page audits, technical SEO, schema markup, and content optimization. Instant results, no signup, no data collection.',
  alternates: { canonical: baseUrl },
  ...createSocialMetadata({
    title: '100+ Free SEO Tools - No Signup Required',
    description: 'Keyword research, on-page audits, technical SEO, schema, content optimization, and SEO reports in one free browser toolkit.',
    url: baseUrl,
    imageAlt: '100 SEO Tools - Free SEO Toolkit',
  }),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Enhanced WebPage schema for AEO/GEO optimization
const pageSchema = generateStaticPageSchema({
  path: '/',
  title: 'Free SEO Tools: Keyword Research, Audits & Schema | 100 SEO Tools',
  description: '100+ free SEO tools for keyword research, on-page audits, technical SEO, schema markup, and content optimization. Instant results, no signup, no data collection.',
}, baseUrl);

pageSchema['@type'] = 'WebPage';
pageSchema['@id'] = `${baseUrl}#website`;
pageSchema.name = '100 SEO Tools';
pageSchema.url = baseUrl;
pageSchema.inLanguage = 'en-US';
pageSchema.publisher = {
  '@type': 'Organization',
  name: '100 SEO Tools',
  url: baseUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${baseUrl}/logo.png`,
  },
};
pageSchema.lastmod = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
pageSchema.changefreq = 'daily';

export default function HomePage() {
  const tools = getAllToolsMeta().map((tool) => ({ ...tool, type: 'tool' }));
  const globalGraph = generateHomepageGraphSchema(baseUrl, socialLinks);

  return (
    <>
      <StructuredData data={globalGraph} />
      <StructuredData data={pageSchema} />
      <HomePageClient initialTools={tools} h1Title="100+ Free SEO Tools" />
    </>
  );
}