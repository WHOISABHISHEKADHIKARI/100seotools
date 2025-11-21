import Link from 'next/link';
import { getBaseUrl } from '../../lib/site';
import ClientSEOCalculator from './ClientSEOCalculator';
import StructuredData from '../../components/StructuredData';

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
      <article className="prose dark:prose-invert max-w-3xl mx-auto mt-8">
        <section>
          <h2>What is an SEO Calculator?</h2>
          <p>An SEO calculator estimates performance metrics such as traffic potential, keyword value, ROI, conversion impact, cost savings, and revenue projections using simple inputs and clear formulas. It helps prioritize efforts, forecast outcomes, and communicate impact.</p>
        </section>
        <section>
          <h2>How it Works</h2>
          <p>Provide baseline inputs like search volume, expected CTR, conversion rate, average order value, and cost benchmarks. The calculator applies standard models to estimate clicks, conversions, revenue, and the equivalent paid value.</p>
          <ul>
            <li>Traffic potential ≈ search volume × expected CTR</li>
            <li>Keyword value ≈ estimated clicks × CPC</li>
            <li>SEO ROI ≈ (incremental revenue − monthly SEO cost) ÷ monthly SEO cost</li>
            <li>Revenue projection ≈ conversions × average order value</li>
            <li>Cost savings ≈ equivalent paid clicks × CPC</li>
          </ul>
        </section>
        <section>
          <h2>Step‑by‑Step Instructions</h2>
          <ol>
            <li>Enter keyword search volume and expected CTR.</li>
            <li>Add conversion rate and average order value.</li>
            <li>Optionally include CPC to compare paid vs organic value.</li>
            <li>Provide monthly SEO costs to compute ROI.</li>
            <li>Review outputs: clicks, conversions, revenue, paid equivalent, and ROI.</li>
          </ol>
        </section>
        <section>
          <h2>Example Calculations</h2>
          <p>Search volume: 10,000; CTR: 8%; CPC: $1.80; Conversion rate: 2.5%; AOV: $85; Monthly SEO cost: $2,500.</p>
          <ul>
            <li>Estimated clicks: 10,000 × 0.08 = 800</li>
            <li>Paid equivalent value: 800 × $1.80 = $1,440/month</li>
            <li>Conversions: 800 × 0.025 = 20</li>
            <li>Revenue: 20 × $85 = $1,700/month</li>
            <li>ROI: ($1,700 − $2,500) ÷ $2,500 = −32% (improve CTR or AOV to reach positive ROI)</li>
          </ul>
        </section>
        <section>
          <h2>Traffic Growth Models</h2>
          <p>Estimate improvements by adjusting CTR, ranking position, and coverage:</p>
          <ul>
            <li>CTR uplift: move from position 6 (≈3–5%) to position 3 (≈8–12%)</li>
            <li>Coverage: target more queries to grow qualified impressions</li>
            <li>Content quality: raise conversion rate with clearer offers</li>
          </ul>
        </section>
        <section>
          <h2>CPC Comparisons and Benchmarks</h2>
          <p>Compare organic outcomes to paid costs and industry CPC ranges to quantify savings. Use conservative CTR and conversion assumptions for stability.</p>
        </section>
        <section>
          <h2>FAQs</h2>
          <details>
            <summary>What inputs do I need?</summary>
            <p>Search volume, CTR, conversion rate, AOV, CPC, and monthly SEO cost for ROI.</p>
          </details>
          <details>
            <summary>How accurate are estimates?</summary>
            <p>Estimates depend on assumptions. Use ranges and revisit inputs as rankings and site quality improve.</p>
          </details>
          <details>
            <summary>Can I compare paid vs organic?</summary>
            <p>Yes. Include CPC to calculate paid equivalent value and cost savings.</p>
          </details>
          <details>
            <summary>Does this change the UI?</summary>
            <p>No. The calculator UI remains the same; this page adds clear guidance and schema.</p>
          </details>
        </section>
        <section>
          <h2>Related Tools and Guides</h2>
          <p>
            <a href="/" className="text-brand-600 hover:underline">Homepage</a> ·{' '}
            <a href="/category/seo-performance" className="text-brand-600 hover:underline">SEO Performance</a> ·{' '}
            <a href="/category/keyword-research" className="text-brand-600 hover:underline">Keyword Research</a> ·{' '}
            <a href="/category/on-page-optimization" className="text-brand-600 hover:underline">On‑Page Optimization</a>
          </p>
          <p>
            <a href="/tools/traffic-potential-calculator" className="text-brand-600 hover:underline">Traffic Potential Calculator</a> ·{' '}
            <a href="/tools/keyword-roi-calculator" className="text-brand-600 hover:underline">Keyword ROI Calculator</a> ·{' '}
            <a href="/tools/ctr-predictor" className="text-brand-600 hover:underline">CTR Predictor</a> ·{' '}
            <a href="/tools/visibility-index-calculator" className="text-brand-600 hover:underline">Visibility Index Calculator</a> ·{' '}
            <a href="/tools/ranking-progress-tracker" className="text-brand-600 hover:underline">Ranking Progress Tracker</a> ·{' '}
            <a href="/tools/on-page-seo-audit-checker" className="text-brand-600 hover:underline">On‑Page SEO Audit Checker</a>
          </p>
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
