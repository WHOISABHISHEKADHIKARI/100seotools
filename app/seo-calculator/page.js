import Link from 'next/link';
import ClientSEOCalculator from './ClientSEOCalculator';

export const metadata = {
  title: 'Free SEO Calculator – Measure Keyword Density, ROI, and Traffic Instantly',
  description: 'Use our free SEO Calculator to measure keyword density, ROI, traffic, and authority instantly. A part of 100+ free SEO tools for better Google and Bing optimization.',
  keywords: 'seo calculator, free seo tools, keyword density checker, seo roi calculator, domain authority, seo analyzer, traffic estimator, seo audit, seo score checker, google seo, bing seo',
  robots: 'index, follow',
  alternates: { canonical: 'https://yourdomain.com/seo-calculator' },
  openGraph: {
    title: 'Free SEO Calculator – Measure Keyword Density, ROI, and Traffic Instantly',
    description: 'Use our free SEO Calculator to measure keyword density, ROI, traffic, and authority instantly. A part of 100+ free SEO tools for better Google and Bing optimization.',
    type: 'article',
    url: 'https://yourdomain.com/seo-calculator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free SEO Calculator – Measure Keyword Density, ROI, and Traffic Instantly',
    description: 'Use our free SEO Calculator to measure keyword density, ROI, traffic, and authority instantly. A part of 100+ free SEO tools for better Google and Bing optimization.',
  },
};

export default function SEOCalculatorPage() {
  return (
    <main id="main" className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">SEO Calculator</h1>
      <p className="text-slate-600 dark:text-slate-300">Free calculator for keyword density, ROI, and traffic.</p>
      <div className="card p-4 max-w-3xl mx-auto mt-6">
        <ClientSEOCalculator />
      </div>
      <div className="mt-6">
        <Link href="/tools" className="text-brand-600 hover:underline">Explore All Tools</Link>
      </div>
    </main>
  );
}