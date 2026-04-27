import Link from 'next/link';
import { getBaseUrl } from '../../lib/site';
import ClientSEOCalculator from './ClientSEOCalculator';
import StructuredData from '../../components/ui/StructuredData';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'Free SEO Calculator – Measure Keyword Density, ROI, and Traffic Instantly',
  description: 'Use our free SEO Calculator to measure keyword density, ROI, traffic, and authority instantly. A part of 100+ free SEO tools for better Google and Bing optimization.',
  keywords: 'seo calculator, free seo tools, keyword density checker, seo roi calculator, domain authority, seo analyzer, traffic estimator, seo audit, seo score checker, google seo, bing seo',
  robots: 'index, follow',
  alternates: { canonical: `${baseUrl}/seo-calculator` },
  openGraph: {
    title: 'Free SEO Calculator – Measure Keyword Density, ROI, and Traffic Instantly',
    description: 'Use our free SEO Calculator to measure keyword density, ROI, traffic, and authority instantly. A part of 100+ free SEO tools for better Google and Bing optimization.',
    type: 'article',
    url: `${baseUrl}/seo-calculator`,
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
      <p className="text-slate-600 dark:text-slate-300">Estimate SEO traffic, value, ROI, cost savings, and revenue projections with beginner‑friendly formulas and examples.</p>
      <div className="card p-4 max-w-3xl mx-auto mt-6">
        <ClientSEOCalculator />
      </div>
      <article className="prose dark:prose-invert max-w-3xl mx-auto mt-8 px-4 sm:px-0">
        <section>
          <h2 className="text-xl sm:text-2xl font-bold">What is an SEO Calculator?</h2>
          <p>An SEO calculator is a strategic tool designed to estimate critical performance metrics such as <strong>traffic potential</strong>, <strong>keyword value</strong>, <strong>ROI</strong>, and <strong>revenue projections</strong>. By using data-driven formulas, it transforms abstract search data into actionable business insights.</p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl sm:text-2xl font-bold">Why Use Our SEO Calculation Suite?</h2>
          <p>Unlike complex spreadsheets, our browser-based calculators provide instant results. Whether you're a niche blogger or a marketing agency, these tools help you:</p>
          <ul>
            <li><strong>Prioritize Content:</strong> Identify high-volume keywords with the best traffic potential.</li>
            <li><strong>Justify SEO Spend:</strong> Calculate the ROI of your organic campaigns compared to PPC.</li>
            <li><strong>Set Realistic Goals:</strong> Forecast conversions based on industry-standard CTR and AOV benchmarks.</li>
            <li><strong>Audit On-Page Density:</strong> Ensure your keywords are balanced for safe ranking.</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl sm:text-2xl font-bold">How the Formulas Work</h2>
          <p>Our tools use transparent, industry-standard formulas to ensure accuracy. Here is a breakdown of the math behind the metrics:</p>
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto">
            <ul className="list-none space-y-2 text-sm sm:text-base">
              <li>🚀 <strong>Traffic Potential</strong> = Monthly Search Volume × Expected CTR (%)</li>
              <li>💰 <strong>Keyword Value</strong> = Estimated Clicks × Cost-Per-Click (CPC)</li>
              <li>📈 <strong>SEO ROI</strong> = ((Revenue - Monthly SEO Cost) / Monthly SEO Cost) × 100</li>
              <li>🛒 <strong>Revenue Projection</strong> = Estimated Conversions × Average Order Value (AOV)</li>
              <li>🛡️ <strong>Keyword Density</strong> = (Keyword Occurrences / Total Word Count) × 100</li>
            </ul>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-xl sm:text-2xl font-bold">Step‑by‑Step Instructions</h2>
          <ol>
            <li><strong>Select Your Tool:</strong> Use the tabs above to choose between Density, ROI, Authority, Traffic, or CPC modules.</li>
            <li><strong>Input Your Data:</strong> Enter your search volume, CTR, or conversion metrics. Use conservative estimates for more realistic forecasts.</li>
            <li><strong>Analyze Outputs:</strong> Instantly view your calculated results in the results panel.</li>
            <li><strong>Reset or Copy:</strong> Use the <em>Reset</em> button to start over or <em>Copy Result</em> to save your data for reports.</li>
          </ol>
        </section>

        <section className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100 mt-0">Example ROI Calculation</h2>
          <p className="text-sm sm:text-base italic">Scenario: You target a keyword with 10,000 searches, an 8% CTR, and plan to spend $2,500/mo on SEO.</p>
          <ul className="text-sm sm:text-base">
            <li><strong>Clicks:</strong> 10,000 × 0.08 = 800 visits</li>
            <li><strong>Conversions (2.5% rate):</strong> 800 × 0.025 = 20 customers</li>
            <li><strong>Revenue ($85 AOV):</strong> 20 × $85 = $1,700/month</li>
            <li><strong>ROI:</strong> ($1,700 − $2,500) / $2,500 = <strong>-32% ROI</strong></li>
          </ul>
          <p className="text-sm font-medium mt-2">💡 Lesson: To turn this profitable, you need to improve your CTR to 15% or your Conversion Rate up to 4%.</p>
        </section>

        <section className="mt-8">
          <h2 className="text-xl sm:text-2xl font-bold">Traffic Growth Models</h2>
          <p>Estimate improvements by adjusting CTR, ranking position, and coverage:</p>
          <ul>
            <li><strong>CTR Uplift:</strong> Moving from Rank #6 (≈3%) to Rank #1 (≈30%) provides a 10x traffic boost.</li>
            <li><strong>Keyword Expansion:</strong> Targeting "Near Me" variants typically raises local conversion by 15-20%.</li>
            <li><strong>Authority Building:</strong> Higher Domain Authority allows you to rank for keywords with 50+ difficulty scores.</li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-xl sm:text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="p-3 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
              <summary className="font-medium">What is a good SEO ROI?</summary>
              <div className="mt-2 text-sm">Most businesses aim for a 5:1 ratio (500% ROI). However, new sites often start with negative ROI as they build authority.</div>
            </details>
            <details className="p-3 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
              <summary className="font-medium">Is keyword density still relevant?</summary>
              <div className="mt-2 text-sm">Yes, but focus is on avoid over-optimization. Most experts suggest a density of 0.5% to 1.5% for modern search engines.</div>
            </details>
            <details className="p-3 border rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
              <summary className="font-medium">Can I export these results?</summary>
              <div className="mt-2 text-sm">You can use the "Copy Result" button to save text versions of your calculations. For full reports, we recommend pasting into Excel or Google Sheets.</div>
            </details>
          </div>
        </section>

        <section className="mt-8 border-t pt-8">
          <h2 className="text-xl sm:text-2xl font-bold">Related Performance Tools</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/tools/traffic-potential-calculator" className="badge hover:bg-blue-100 transition">Traffic Potential</Link>
            <Link href="/tools/keyword-roi-calculator" className="badge hover:bg-blue-100 transition">ROI Calculator</Link>
            <Link href="/tools/on-page-seo-audit-checker" className="badge hover:bg-blue-100 transition">Audit Checker</Link>
            <Link href="/tools/ranking-progress-tracker" className="badge hover:bg-blue-100 transition">Rank Tracker</Link>
            <Link href="/tools/bounce-rate-estimator" className="badge hover:bg-blue-100 transition">Bounce Estimator</Link>
          </div>
        </section>
      </article>
      <div className="mt-6">
        <Link href="/tools" className="text-brand-600 hover:underline">Explore All Tools</Link>
      </div>
      {(() => {
        const softwareLd = {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'SEO Calculator',
          description: 'Estimate SEO traffic, keyword value, ROI, cost savings, and revenue projections with beginner‑friendly formulas.',
          url: `${baseUrl}/seo-calculator`,
          applicationCategory: 'SEO Tool',
          operatingSystem: 'Web Browser',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
          publisher: { '@type': 'Organization', name: '100 SEO Tools', url: baseUrl }
        };
        const faqLd = {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            { '@type': 'Question', name: 'What inputs do I need?', acceptedAnswer: { '@type': 'Answer', text: 'Search volume, CTR, conversion rate, AOV, CPC, and monthly SEO cost for ROI.' } },
            { '@type': 'Question', name: 'How accurate are estimates?', acceptedAnswer: { '@type': 'Answer', text: 'Estimates depend on assumptions. Use ranges and revisit inputs as rankings and site quality improve.' } },
            { '@type': 'Question', name: 'Can I compare paid vs organic?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Include CPC to calculate paid equivalent value and cost savings.' } }
          ]
        };
        const howToLd = {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'How to Use SEO Calculator',
          description: 'Step‑by‑step guide for estimating SEO performance metrics.',
          totalTime: 'PT5M',
          tool: [{ '@type': 'HowToTool', name: 'SEO Calculator', url: `${baseUrl}/seo-calculator` }],
          step: [
            { '@type': 'HowToStep', name: 'Enter search volume and CTR', text: 'Provide baseline impressions and expected click‑through rate.' },
            { '@type': 'HowToStep', name: 'Add conversion rate and AOV', text: 'Estimate conversions and revenue from clicks.' },
            { '@type': 'HowToStep', name: 'Include CPC and monthly cost', text: 'Compare paid equivalent and compute ROI.' },
            { '@type': 'HowToStep', name: 'Review outputs', text: 'Clicks, conversions, revenue, paid equivalent value, and ROI.' }
          ]
        };
        const breadcrumbLd = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
            { '@type': 'ListItem', position: 2, name: 'SEO Calculator', item: `${baseUrl}/seo-calculator` }
          ]
        };
        return (
          <>
            <StructuredData data={softwareLd} />
            <StructuredData data={faqLd} />
            <StructuredData data={howToLd} />
            <StructuredData data={breadcrumbLd} />
          </>
        );
      })()}
    </main>
  );
}
