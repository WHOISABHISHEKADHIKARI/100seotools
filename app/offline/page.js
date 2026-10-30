import { getBaseUrl } from '../../lib/site';
import { createSocialMetadata } from '../../lib/socialMetadata';
import { generateStaticPageSchema } from '../../lib/schema';
import Link from 'next/link';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'Offline – 100 SEO Tools',
  description: 'All 100+ SEO tools are browser-based and work offline after initial load. No data is sent to servers unless you choose to use a public validator tool.',
  alternates: { canonical: baseUrl },
  ...createSocialMetadata({
    title: 'Offline – 100 SEO Tools',
    description: 'All 100+ SEO tools are browser-based and work offline after initial load.',
    url: baseUrl,
    imageAlt: '100 SEO Tools - Offline Mode',
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
  path: '/offline',
  title: metadata.title,
  description: metadata.description,
}, baseUrl);

pageSchema['@type'] = 'WebPage';
pageSchema['@id'] = `${baseUrl}#website`;
pageSchema.name = 'Offline Mode - 100 SEO Tools';
pageSchema.url = baseUrl;
pageSchema.inLanguage = 'en-US';
pageSchema.publisher = {
  '@type': 'Organization',
  name: '100 SEO Tools',
  url: baseUrl,
};
pageSchema.lastmod = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
pageSchema.changefreq = 'monthly';

export default function OfflinePage() {
  return (
    <div className="bg-[#fafbfc] dark:bg-[#020617] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-300">
            <svg className="h-3.5 w-3.5 text-slate-400" viewBox="0 0 24 24" aria-hidden><path d="M19 13h2v2h-2v-2zm0 4h2v-2h-2v-2zm-2-4h2v6H17v-6zm4-6v2h6V7h-6zm4 12H5v-2h6v-2h2v2h4v2h-4v2zm-8-4H3v-2h2v2zm0-8h2v6H3V9z"/></svg>
            Offline
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">All Tools Go Offline</h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Once loaded, all 100+ SEO tools function entirely offline. Your data stays on your device — no network required.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/" className="btn">Go Home</Link>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <a href="/tools" className="btn secondary">Open Toolkit</a>
          </div>
        </div>
      </div>
    </div>
  );
}