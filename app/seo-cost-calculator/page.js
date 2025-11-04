import Link from 'next/link';
import { getBaseUrl } from '../../lib/site';
import ClientSEOCostCalculator from './ClientSEOCostCalculator';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'SEO Cost Calculator – Estimate Monthly and Project Costs',
  description: 'Estimate SEO budgets including labor, content, link building, tools, and contingency. Free, client-side, and fast.',
  keywords: 'seo cost calculator, seo pricing, seo budget, link building cost, content cost, retainer, setup fee',
  robots: 'index, follow',
  alternates: { canonical: `${baseUrl}/seo-cost-calculator` },
  openGraph: {
    title: 'SEO Cost Calculator – Estimate Monthly and Project Costs',
    description: 'Estimate SEO budgets including labor, content, link building, tools, and contingency.',
    type: 'article',
    url: `${baseUrl}/seo-cost-calculator`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Cost Calculator – Estimate Monthly and Project Costs',
    description: 'Estimate SEO budgets including labor, content, link building, tools, and contingency.',
  },
};

export default function SEOCostCalculatorPage() {
  return (
    <main id="main" className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">SEO Cost Calculator</h1>
      <p className="text-slate-600 dark:text-slate-300">Estimate monthly and project SEO costs quickly.</p>
      <div className="card p-4 max-w-3xl mx-auto mt-6">
        <ClientSEOCostCalculator />
      </div>
      <div className="mt-6">
        <Link href="/tools" className="text-brand-600 hover:underline">Explore All Tools</Link>
      </div>
    </main>
  );
}