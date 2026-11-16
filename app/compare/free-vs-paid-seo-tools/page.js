import { getBaseUrl } from '../../../lib/site';
import { createSocialMetadata } from '../../../lib/socialMetadata';
import Link from 'next/link';
import StructuredData from '../../../components/ui/StructuredData';
import { generateStaticPageSchema } from '../../../lib/schema';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'Free vs Paid SEO Tools: Which Should You Use? | 100 SEO Tools',
  description: 'Compare free and paid SEO tools. Learn when free tools are enough, when to upgrade, and how to build a cost-effective SEO stack.',
  alternates: { canonical: `${baseUrl}/compare/free-vs-paid-seo-tools` },
  ...createSocialMetadata({
    title: 'Free vs Paid SEO Tools Comparison',
    description: 'Compare free and paid SEO tools.',
    url: `${baseUrl}/compare/free-vs-paid-seo-tools`,
    imageAlt: 'Free vs Paid SEO Tools',
  }),
};

export default function ComparisonPage() {
  const pageSchema = generateStaticPageSchema({ path: '/compare/free-vs-paid-seo-tools', title: metadata.title, description: metadata.description }, baseUrl);
  return (
    <div className="min-h-screen bg-[#fafbfc] dark:bg-[#020617] py-12">
      <StructuredData data={pageSchema} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-extrabold text-slate-950 dark:text-white mb-4">Free vs Paid SEO Tools</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">A practical comparison to help you choose the right SEO toolkit for your budget and needs.</p>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
                <th className="px-4 py-3 text-left font-extrabold">Feature</th>
                <th className="px-4 py-3 text-left font-semibold">Free Tools</th>
                <th className="px-4 py-3 text-left font-semibold">Paid Tools</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Cost', '$0', '$50-500+/month'],
                ['Keyword data', 'Limited/basic', 'Comprehensive (volume, difficulty, SERP)'],
                ['Backlink data', 'Basic', 'Full backlink profiles + history'],
                ['Rank tracking', 'Manual', 'Automated daily tracking'],
                ['Technical audits', 'Basic checks', 'Deep crawls (100k+ pages)'],
                ['Support', 'Community', 'Dedicated support'],
                ['Best for', 'Beginners, small sites, quick checks', 'Agencies, large sites, competitive niches'],
              ].map(([f, free, paid], i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-white/5">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{f}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{free}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{paid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 space-y-4 text-slate-600 dark:text-slate-300">
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">When free tools are enough</h2>
          <p>Free SEO tools like those on 100 SEO Tools are sufficient for: small websites, beginners learning SEO, quick checks and validations, metadata generation, schema markup, and basic keyword research. They run client-side, require no signup, and cover 80% of everyday SEO tasks.</p>
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">When to upgrade to paid</h2>
          <p>Consider paid tools when you need: large-scale rank tracking, deep backlink analysis, competitor intelligence at scale, automated reporting for clients, or enterprise-grade technical audits. Many professionals use a hybrid approach: free tools for daily tasks, paid tools for strategic analysis.</p>
          <h2 className="text-2xl font-extrabold text-slate-950 dark:text-white">Our recommendation</h2>
          <p>Start with free tools. Master the fundamentals. Upgrade only when you hit a specific limitation that blocks your growth. 100 SEO Tools provides 105+ free tools covering keyword research, on-page optimization, technical SEO, schema, content, and more: a complete free stack.</p>
        </div>
        <div className="mt-10 text-center">
          <Link href="/tools" className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800">Browse Free SEO Tools</Link>
        </div>
      </div>
    </div>
  );
}