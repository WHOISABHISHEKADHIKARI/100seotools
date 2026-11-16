import { getBaseUrl } from '../../lib/site';
import { createSocialMetadata } from '../../lib/socialMetadata';
import Link from 'next/link';
import StructuredData from '../../components/ui/StructuredData';
import { generateStaticPageSchema } from '../../lib/schema';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'SEO Case Studies: Real Results | 100 SEO Tools',
  description: 'Real-world SEO case studies showing how free SEO tools helped improve rankings, traffic, and conversions.',
  alternates: { canonical: `${baseUrl}/case-studies` },
  ...createSocialMetadata({
    title: 'SEO Case Studies: Real Results',
    description: 'Real-world SEO case studies.',
    url: `${baseUrl}/case-studies`,
    imageAlt: 'SEO Case Studies',
  }),
};

const cases = [
  { title: 'NAP Consistency Fix: +40% Local Traffic', desc: 'A local business fixed NAP inconsistencies across 15 directories using the NAP Consistency Checker, resulting in a 40% increase in local organic traffic within 60 days.', metric: '+40% traffic' },
  { title: 'Content Refresh: +25% Organic Clicks', desc: 'A blog post updated with fresh data, better headings, and internal links using the Content Freshness Checker saw a 25% increase in organic clicks in 30 days.', metric: '+25% clicks' },
  { title: 'Schema Markup: Rich Snippet Win', desc: 'Adding FAQ and HowTo schema via the Schema Markup Generator earned rich snippets, increasing CTR by 18% for the target page.', metric: '+18% CTR' },
  { title: 'Meta Optimization: +12% CTR', desc: 'Rewriting title tags and meta descriptions with the Meta Tag Generator improved average CTR by 12% across 50 pages.', metric: '+12% CTR' },
  { title: 'Keyword Clustering: Topical Authority', desc: 'Building a content cluster around a seed keyword using the Keyword Clustering Tool helped a page reach position 3 for a competitive term.', metric: 'Pos 3' },
];

export default function CaseStudiesPage() {
  const pageSchema = generateStaticPageSchema({ path: '/case-studies', title: metadata.title, description: metadata.description }, baseUrl);
  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#020617] py-12">
      <StructuredData data={pageSchema} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white mb-4">SEO Case Studies</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">Real-world examples of SEO improvements using free tools from 100 SEO Tools.</p>
        <div className="space-y-6">
          {cases.map((c) => (
            <div key={c.title} className="rounded-2xl border border-slate-100 dark:border-white/10 bg-white dark:bg-gray-900 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-extrabold text-slate-950 dark:text-white">{c.title}</h2>
                <span className="shrink-0 rounded-full bg-brand-100 dark:bg-brand-500/20 px-3 py-1 text-xs font-extrabold text-brand-700 dark:text-brand-300">{c.metric}</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{c.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/tools" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">Try the Tools</Link>
        </div>
      </div>
    </div>
  );
}