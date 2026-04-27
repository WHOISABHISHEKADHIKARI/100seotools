import StructuredData from '../../components/ui/StructuredData';
import SEOCostCalculator from '../../components/tools/SEOCostCalculator';
import { getBaseUrl } from '../../lib/site';

const baseUrl = getBaseUrl();

export const dynamic = 'force-static';
export const revalidate = 3600;

export const metadata = {
  title: 'SEO Cost Calculator | Free SEO Pricing Estimator',
  description: 'Estimate SEO costs with a free calculator. Understand pricing factors: content, keyword research, link building, technical SEO, on-page optimization, audits, reporting, and tools. Plan monthly or project budgets with examples and benchmarks.',
  alternates: { canonical: `${baseUrl}/seo-cost-calculator` },
  keywords: [
    'seo cost calculator',
    'seo pricing calculator',
    'seo cost estimator',
    'seo budget calculator',
    'how much does seo cost'
  ],
  openGraph: {
    title: 'SEO Cost Calculator | Free SEO Pricing Estimator',
    description: 'Estimate monthly and project SEO budgets with clear factors and examples.',
    url: `${baseUrl}/seo-cost-calculator`,
    type: 'website'
  },
  robots: { index: true, follow: true }
};

export default function SEOCostCalculatorPage() {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'SEO Calculators', item: `${baseUrl}/seo-calculator` },
      { '@type': 'ListItem', position: 3, name: 'SEO Cost Calculator', item: `${baseUrl}/seo-cost-calculator` }
    ]
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'How do I estimate monthly SEO costs?', acceptedAnswer: { '@type': 'Answer', text: 'Add labor (hours × rate), content production, link building, tools, and contingency. Include any retainer and one‑time setup fees.' } },
      { '@type': 'Question', name: 'What factors influence SEO pricing?', acceptedAnswer: { '@type': 'Answer', text: 'Scope (content volume, technical fixes), competition, speed requirements, link acquisition, reporting, and tool subscriptions.' } },
      { '@type': 'Question', name: 'Should I choose monthly or project‑based SEO?', acceptedAnswer: { '@type': 'Answer', text: 'Monthly works for ongoing improvements and publishing cadence; project‑based suits migrations, audits, or one‑off builds. Many businesses use both.' } }
    ]
  };

  const howToLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Use the SEO Cost Calculator',
    description: 'Step‑by‑step instructions to estimate SEO budgets using the calculator.',
    totalTime: 'PT5M',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
    supply: [{ '@type': 'HowToSupply', name: 'Web Browser' }],
    tool: [{ '@type': 'HowToTool', name: 'SEO Cost Calculator', url: `${baseUrl}/seo-cost-calculator` }],
    step: [
      { '@type': 'HowToStep', name: 'Open the calculator', text: 'Navigate to the SEO Cost Calculator.', url: `${baseUrl}/seo-cost-calculator` },
      { '@type': 'HowToStep', name: 'Enter inputs', text: 'Add setup fees, retainer, hourly rate, hours, content volume and costs, link volume and costs, tools, and contingency.' },
      { '@type': 'HowToStep', name: 'Review totals', text: 'Check monthly, quarterly, and yearly totals along with breakdowns.' },
      { '@type': 'HowToStep', name: 'Adjust scenarios', text: 'Test low‑budget, mid‑budget, and premium plans to match goals and competition.' }
    ]
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-700 dark:text-slate-300">
          <li><a href="/" className="hover:underline">Home</a></li>
          <li aria-hidden className="mx-1">›</li>
          <li><a href="/seo-calculator" className="hover:underline">SEO Calculators</a></li>
          <li aria-hidden className="mx-1">›</li>
          <li><span>SEO Cost Calculator</span></li>
        </ol>
      </nav>

      <StructuredData data={breadcrumbLd} />
      <StructuredData data={faqLd} />
      <StructuredData data={howToLd} />

      <header className="space-y-2 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">SEO Cost Calculator – Free SEO Pricing Estimator</h1>
        <p className="text-slate-700 dark:text-slate-300 max-w-3xl">Estimate monthly and project SEO budgets with transparent breakdowns. Understand how pricing is shaped by content creation, keyword research, link building, technical SEO, on‑page optimization, audits, reporting, and tools.</p>
      </header>

      <section className="mb-8" aria-labelledby="calculator-section">
        <h2 id="calculator-section" className="sr-only">Calculator</h2>
        <SEOCostCalculator />
      </section>

      <article className="prose dark:prose-invert max-w-none">
        <section id="what-is-seo-cost-calculator">
          <h2>What is an SEO Cost Calculator?</h2>
          <p>An SEO cost calculator helps estimate realistic budgets by combining recurring and one‑time costs. Typical inputs include setup fees, monthly retainer, labor hours and rates, content volume and unit costs, link volume and unit costs, tool subscriptions, and contingency. The result informs monthly spend and total costs across 3, 6, and 12 months.</p>
        </section>

        <section id="how-seo-pricing-works">
          <h2>How SEO Pricing Works</h2>
          <p>SEO pricing often blends fixed retainers and variable costs. Monthly retainers cover ongoing optimization and reporting. Variable costs cover content production, links, tools, and specialized technical work. Project‑based pricing suits migrations, audits, or site builds; monthly pricing suits continuous publishing and optimization cycles.</p>
          <ul>
            <li>Content creation (articles, product pages) and editing</li>
            <li>Keyword research and clustering for topical coverage</li>
            <li>Link building (outreach, citations, digital PR)</li>
            <li>Technical SEO (fixes, templates, performance)</li>
            <li>On‑page optimization (titles, meta, headings, internal links)</li>
            <li>Audits and QA (on‑page, schema, crawl/index)</li>
            <li>Reporting and review (monthly, quarterly)</li>
            <li>Tools and subscriptions</li>
          </ul>
        </section>

        <section id="usage-instructions">
          <h2>Step‑by‑Step: Using the Calculator</h2>
          <ol>
            <li>Enter one‑time setup fees and monthly retainer.</li>
            <li>Add hourly rate and expected hours per month.</li>
            <li>Set content pieces per month and cost per piece.</li>
            <li>Set expected links per month and cost per link.</li>
            <li>Include monthly tool subscriptions.</li>
            <li>Add contingency % to account for scope creep or risk.</li>
            <li>Review monthly totals and multi‑month projections.</li>
            <li>Adjust inputs to model different plans.</li>
          </ol>
        </section>

        <section id="pricing-scenarios">
          <h2>Sample Pricing Scenarios</h2>
          <h3>Low‑Budget Plan</h3>
          <p>Focus on essentials: light monthly edits, a small number of new pages, basic link acquisition, and foundational technical fixes.</p>
          <ul>
            <li>Retainer: $300–$800</li>
            <li>Labor: 10–20 hours/mo</li>
            <li>Content: 2–4 pieces/mo</li>
            <li>Links: 2–5/mo</li>
            <li>Tools: $0–$100/mo</li>
          </ul>

          <h3>Mid‑Budget Plan</h3>
          <p>Balanced publishing, link acquisition, and technical improvements; suitable for competitive niches with steady growth targets.</p>
          <ul>
            <li>Retainer: $800–$2,000</li>
            <li>Labor: 25–50 hours/mo</li>
            <li>Content: 4–8 pieces/mo</li>
            <li>Links: 6–12/mo</li>
            <li>Tools: $100–$300/mo</li>
          </ul>

          <h3>Premium Plan</h3>
          <p>Aggressive publishing, digital PR, and advanced technical projects; targets competitive queries, scale, and brand authority.</p>
          <ul>
            <li>Retainer: $2,000–$5,000+</li>
            <li>Labor: 60–120 hours/mo</li>
            <li>Content: 8–20 pieces/mo</li>
            <li>Links: 12–30+/mo</li>
            <li>Tools: $300–$800/mo</li>
          </ul>
        </section>

        <section id="breakdowns">
          <h2>Cost Breakdowns and Benchmarks</h2>
          <p>Use the calculator to produce a clean breakdown of monthly costs (labor, content, links, tools, contingency) and multi‑month totals. Benchmarks vary by industry and competition; start lean, then increase investment as results compound.</p>
          <ul>
            <li>Content/unit: $50–$500+ depending on quality and niche</li>
            <li>Links/unit: $50–$500+ depending on approach</li>
            <li>Technical sprints: billed hourly or per project</li>
            <li>Tools: $0–$800/mo depending on stack</li>
          </ul>
        </section>

        <section id="competitor-comparisons">
          <h2>Competitor Comparisons</h2>
          <p>Benchmark top competitors for content velocity, publishing cadence, and link acquisition ratio. Model plans that match or exceed their pace by 10–20% while maintaining quality and avoiding spammy practices.</p>
        </section>

        <section id="faq">
          <h2>FAQs</h2>
          <details>
            <summary>How much does SEO cost?</summary>
            <p>Costs vary widely by scope and competition. Use this calculator to estimate monthly and project‑based budgets across content, labor, links, tools, and contingency.</p>
          </details>
          <details>
            <summary>What is a typical monthly SEO budget?</summary>
            <p>Small sites: $500–$1,500; growing businesses: $1,500–$4,000; competitive niches: $4,000+ depending on output and goals.</p>
          </details>
          <details>
            <summary>Should I add contingency?</summary>
            <p>Yes. A 10–20% contingency helps account for scope changes, unforeseen technical work, or increased content/links needed to compete.</p>
          </details>
        </section>
      </article>

      <aside aria-labelledby="related-links" className="mt-8 p-4 rounded-lg border border-slate-200 dark:border-white/10">
        <h2 id="related-links" className="text-lg font-semibold mb-2">Related Tools and Calculators</h2>
        <ul className="space-y-2">
          <li><a href="/" className="text-brand-600 hover:underline">Homepage</a></li>
          <li><a href="/category" className="text-brand-600 hover:underline">SEO Tools Categories</a></li>
          <li><a href="/tools/on-page-seo-audit-checker" className="text-brand-600 hover:underline">On‑Page SEO Audit Checker</a></li>
          <li><a href="/tools/seo-content-checker" className="text-brand-600 hover:underline">SEO Content Checker</a></li>
          <li><a href="/tools/ranking-progress-tracker" className="text-brand-600 hover:underline">Ranking Progress Tracker</a></li>
          <li><a href="/tools/ctr-predictor" className="text-brand-600 hover:underline">CTR Predictor</a></li>
          <li><a href="/tools/traffic-potential-calculator" className="text-brand-600 hover:underline">Traffic Potential Calculator</a></li>
        </ul>
      </aside>
    </main>
  );
}

