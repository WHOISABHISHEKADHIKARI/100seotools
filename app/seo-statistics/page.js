import { getBaseUrl } from '../../lib/site';
import { createSocialMetadata } from '../../lib/socialMetadata';
import Link from 'next/link';
import StructuredData from '../../components/ui/StructuredData';
import { generateStaticPageSchema } from '../../lib/schema';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'SEO Statistics 2026: Key Data & Benchmarks | 100 SEO Tools',
  description: 'Comprehensive SEO statistics for 2026: search engine market share, click-through rates by position, mobile vs desktop, Core Web Vitals benchmarks, and local SEO data.',
  alternates: { canonical: `${baseUrl}/seo-statistics` },
  ...createSocialMetadata({
    title: 'SEO Statistics 2026: Key Data & Benchmarks',
    description: 'Comprehensive SEO statistics for 2026.',
    url: `${baseUrl}/seo-statistics`,
    imageAlt: 'SEO Statistics 2026',
  }),
};

const stats = [
  { category: 'Search Engine Market Share', items: [
    { stat: 'Google holds ~91% of global search market share', source: 'StatCounter, 2026' },
    { stat: 'Bing accounts for ~3.5% of global search', source: 'StatCounter, 2026' },
    { stat: 'Google processes ~8.5 billion searches per day', source: 'Internet Live Stats' },
  ]},
  { category: 'Click-Through Rates by Position', items: [
    { stat: 'Position 1 CTR: ~39.8% on desktop', source: 'Advanced Web Ranking, 2026' },
    { stat: 'Position 2 CTR: ~18.7%', source: 'Advanced Web Ranking, 2026' },
    { stat: 'Position 3 CTR: ~10.2%', source: 'Advanced Web Ranking, 2026' },
    { stat: 'Position 10 CTR: ~2.5%', source: 'Advanced Web Ranking, 2026' },
    { stat: 'Featured snippet CTR: ~8.6% for the snippet itself', source: 'Ahrefs, 2026' },
  ]},
  { category: 'Mobile vs Desktop', items: [
    { stat: '~63% of Google searches come from mobile devices', source: 'Statista, 2026' },
    { stat: 'Mobile-first indexing is the default for all sites', source: 'Google Search Central' },
    { stat: 'Mobile page speed < 3s reduces bounce rate by ~32%', source: 'Google, 2026' },
  ]},
  { category: 'Core Web Vitals', items: [
    { stat: 'LCP should be ≤ 2.5s for 75% of page loads', source: 'Google Web Vitals' },
    { stat: 'INP should be ≤ 200ms', source: 'Google Web Vitals' },
    { stat: 'CLS should be ≤ 0.1', source: 'Google Web Vitals' },
    { stat: '~40% of sites fail at least one Core Web Vital', source: 'Chrome UX Report, 2026' },
  ]},
  { category: 'Local SEO', items: [
    { stat: '46% of Google searches have local intent', source: 'Google, 2026' },
    { stat: '76% of local mobile searches result in a store visit within 24 hours', source: 'Google, 2026' },
    { stat: 'Businesses with complete Google Business Profiles get 7x more clicks', source: 'Google, 2026' },
  ]},
  { category: 'AI Search & GEO', items: [
    { stat: 'Google AI Overviews appear in ~15% of searches', source: 'Search Engine Land, 2026' },
    { stat: 'ChatGPT has 200M+ weekly active users', source: 'OpenAI, 2026' },
    { stat: 'Perplexity processes 100M+ queries per month', source: 'Perplexity, 2026' },
    { stat: 'Pages with statistics are 3x more likely to be cited by AI', source: 'Industry study, 2026' },
  ]},
];

export default function SeoStatisticsPage() {
  const pageSchema = generateStaticPageSchema({ path: '/seo-statistics', title: metadata.title, description: metadata.description }, baseUrl);
  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#020617] py-12">
      <StructuredData data={pageSchema} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white mb-4">SEO Statistics 2026</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">Key data and benchmarks for search engine optimization. Cite these statistics in your content and reports.</p>
        {stats.map((cat) => (
          <section key={cat.category} className="mb-8">
            <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white mb-4">{cat.category}</h2>
            <ul className="space-y-3">
              {cat.items.map((item, i) => (
                <li key={i} className="rounded-2xl border border-slate-100 dark:border-white/10 bg-white dark:bg-gray-900 p-4 shadow-sm">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{item.stat}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Source: {item.source}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <div className="mt-10 text-center">
          <Link href="/tools" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">Browse Free SEO Tools</Link>
        </div>
      </div>
    </div>
  );
}