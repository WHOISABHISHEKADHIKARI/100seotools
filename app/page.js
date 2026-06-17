import HomePageClient from './HomePageClient';
import { getAllToolsMeta } from '../tools';
import { getBaseUrl } from '../lib/site';
import { createSocialMetadata } from '../lib/socialMetadata';

const baseUrl = getBaseUrl();

export const metadata = {
  title: '100+ Free SEO Tools - No Signup Required | 100 SEO Tools',
  description: 'Use 100+ free SEO tools for keyword research, on-page audits, technical SEO, schema generation, content optimization, and SEO reports. Instant results, no signup required.',
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

export default function HomePage() {
  const tools = getAllToolsMeta().map((tool) => ({ ...tool, type: 'tool' }));

  return <HomePageClient initialTools={tools} />;
}
