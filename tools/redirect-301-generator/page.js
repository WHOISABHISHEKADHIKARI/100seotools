import Link from 'next/link';
import { generateStaticPageSchema } from '../../lib/schema';
import { getBaseUrl } from '../../lib/site';

const baseUrl = getBaseUrl();

export const metadata = {
  title: '301 Redirect Generator | Free SEO Tool',
  description: 'Generate 301 redirects for your website. Create permanent redirects to maintain SEO value when pages are moved or deleted.',
  alternates: { canonical: `${baseUrl}/tools/redirect-301-generator` },
  robots: { index: true, follow: true },
};

// Enhanced SoftwareApplication schema for AEO/GEO optimization
const pageSchema = generateStaticPageSchema({
  path: '/tools/redirect-301-generator',
  title: '301 Redirect Generator | 100 SEO Tools',
  description: 'Generate 301 redirects for your website. Create permanent redirects to maintain SEO value when pages are moved or deleted.',
}, baseUrl);

pageSchema['@type'] = 'SoftwareApplication';
pageSchema.name = '301 Redirect Generator';
pageSchema.url = `${baseUrl}/tools/redirect-301-generator`;
pageSchema.description = 'Generate 301 redirects for your website. Create permanent redirects to maintain SEO value when pages are moved or deleted.';
pageSchema.lastmod = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
pageSchema.changefreq = 'weekly';

pageSchema['@context'] = 'https://schema.org';
pageSchema.price = {
  '@type': 'Price',
  currency: 'USD',
  value: 0,
};

pageSchema.author = {
  '@type': 'Person',
  name: 'Abhishek Adhikari',
  url: `${baseUrl}/author`,
};

export default function Redirect301GeneratorPage() {
  return (
    <div className="bg-[#fafbfc] dark:bg-[#020617] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-300">
            <svg className="h-3.5 w-3.5 text-slate-400" viewBox="0 0 24 24" aria-hidden><path d="M19 13h2v2h-2v-2zm0 4h2v-2h-2v-2zm-2-4h2v6H17v-6zm4-6v2h6V7h-6zm4 12H5v-2h6v-2h2v2h4v2h-4v2zm-8-4H3v-2h2v2zm0-8h2v6H3V9z"/></svg>
            301 Redirect Generator
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">301 Redirect Generator</h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Generate 301 redirects for your website to maintain SEO value.
          </p>
          <StructuredData data={pageSchema} />
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/" className="btn">Go Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}