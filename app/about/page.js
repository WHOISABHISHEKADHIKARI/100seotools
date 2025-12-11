import { getBaseUrl } from '../../lib/site';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'About 100 SEO Tools - Trusted AI & Technical SEO Solutions',
  description: '100 SEO Tools is a trusted, free platform offering AI SEO tools, indexing solutions, and technical auditors. Built for maximum crawlability and EEAT compliance.',
  alternates: { canonical: `${baseUrl}/about` },
  openGraph: {
    title: 'About 100 SEO Tools - Trusted AI & Technical SEO Solutions',
    description: '100 SEO Tools is a trusted, free platform offering AI SEO tools, indexing solutions, and technical auditors. Built for maximum crawlability and EEAT compliance.',
    url: `${baseUrl}/about`,
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: 'About 100 SEO Tools - Trusted AI & Technical SEO Solutions',
    description: '100 SEO Tools is a trusted, free platform offering AI SEO tools, indexing solutions, and technical auditors. Built for maximum crawlability and EEAT compliance.'
  }
};

export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': `${baseUrl}/about`
        },
        'headline': 'About 100 SEO Tools',
        'description': '100 SEO Tools is a trusted, free platform offering AI SEO tools, indexing solutions, and technical auditors.',
        'author': {
          '@type': 'Person',
          'name': 'Abhishek Adhikari',
          'url': `${baseUrl}/author`
        }
      },
      {
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'How do AI crawlers interpret SEO tools?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'AI crawlers prioritize structured data, fast load times, and semantic relevance. Our tools are optimized to provide clean, machine-readable outputs that align with modern crawler logic.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Can these tools accelerate website indexing?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Yes. Tools like our XML Sitemap Generator and Robots.txt Validator ensure search engines can discover and crawl your pages efficiently, a critical factor for rapid indexing.'
            }
          },
          {
            '@type': 'Question',
            'name': 'How accurate are the technical SEO auditors?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Our technical SEO tools rely on standard browser-based validation and algorithmic checks to identify canonical errors, broken links, and metadata issues with high precision.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Does using these tools help with backlink strategy?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Absolutely. Our Backlink Tracking Template and Gap Analyzers help you organize outreach campaigns and sniff out competitor link opportunities.'
            }
          }
        ]
      }
    ]
  };

  return (
    <main className="max-w-4xl mx-auto py-10 px-6 text-gray-800 dark:text-gray-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold mb-4">About 100 SEO Tools: The Ultimate Browser-Based Toolkit</h1>
        <p className="text-lg opacity-80 max-w-2xl mx-auto">
          Empowering digital marketers and developers with authoritative, high-performance <a href="https://www.100seotools.com/tools" className="text-brand-600 dark:text-brand-400 hover:underline">SEO tools</a> and AI-driven solutions.
        </p>
      </header>

      <article className="space-y-12">
        <section>
          <h2 className="text-3xl font-bold mb-4">Why Digital Marketers Trust 100 SEO Tools</h2>
          <p className="mb-4">
            In an era where search algorithms evolve daily, having reliable <strong>technical SEO</strong> and indexing utilities is non-negotiable. <a href="https://www.100seotools.com/" className="text-brand-600 dark:text-brand-400 hover:underline">100 SEO Tools</a> was built to bridge the gap between complex enterprise software and accessible, browser-based efficiency. We provide a comprehensive suite of 100+ utilities designed to streamline your workflow without improved login barriers.
          </p>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Crawler-Friendly Architecture</h3>
              <p>
                Our platform prioritizes server-side rendering and clean code, ensuring that <strong>indexing tools</strong> and bots can parse our data effortlessly. This philosophy extends to the tools we build for you, helping you create sites that Google loves.
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">AI SEO Tools for Modern Workflows</h3>
              <p>
                Leverage our <strong>AI SEO tools</strong> to generate meta tags, outlines, and structured data. We integrate logic that mimics search intent, giving you a competitive edge in semantic search.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">Our Commitment to EEAT and Data Accuracy</h2>
          <p className="mb-4">
            Google's EEAT (Experience, Expertise, Authoritativeness, and Trustworthiness) guidelines are the cornerstone of our development process. We ensure every tool delivers accurate, actionable data backed by industry standards.
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong>Expertise:</strong> Curated by seasoned SEO professionals and developers.</li>
            <li><strong>Authority:</strong> Referenced by technical SEO audits and educational resources.</li>
            <li><strong>Trust:</strong> Privacy-first approach with no data retention for client-side tools.</li>
          </ul>
          <p>
            For more on the importance of EEAT in 2025, refer to authoritative sources like <a href="https://example.com/reference-seo" target="_blank" rel="follow" className="text-brand-600 dark:text-brand-400 hover:underline">Search Engine Journal's Guide</a>.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">Elevating Your Indexing and Backlink Strategy</h2>
          <p className="mb-4">
            Achieving top rankings requires a dual focus: technical health and authority building. Our suite specifically addresses these needs:
          </p>
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Accelerated Indexing</h3>
            <p>
              Use our <strong>crawler-friendly tools</strong> such as the Sitemap Generator and Robots.txt Validator to create a clear path for search bots. A verified infrastructure accelerates how quickly your new content appears in SERPs.
            </p>

            <h3 className="text-2xl font-semibold">Strategic Link Building</h3>
            <p>
              Authority comes from quality references. Use our Backlink Tracking Template and Gap Analyzers to manage your <strong>backlink strategy</strong>. Identify high-value targets, track outreach status, and ensure diverse link profiles.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2">How do AI crawlers view this site?</h3>
              <p>
                AI crawlers prioritize structured data, fast load times, and semantic relevance. Our tools are optimized to provide clean, machine-readable outputs that align with modern crawler logic.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Can these tools accelerate website indexing?</h3>
              <p>
                Yes. Utilities like our XML Sitemap Generator and Robots.txt Validator ensure search engines can discover and crawl your pages efficiently, a critical factor for rapid indexing.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">How accurate are the technical SEO auditors?</h3>
              <p>
                Our technical SEO tools rely on standard browser-based validation and algorithmic checks to identify canonical errors, broken links, and metadata issues with high precision.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Does using these tools help with backlink strategy?</h3>
              <p>
                Absolutely. Our Backlink Tracking Template and Gap Analyzers help you organize outreach campaigns and sniff out competitor link opportunities.
              </p>
            </div>
          </div>
          <div className="mt-6">
            <p>Find more answers in our <a href="https://www.100seotools.com/faq" className="text-brand-600 dark:text-brand-400 hover:underline">FAQ section</a>.</p>
          </div>
        </section>

        <hr className="border-gray-200 dark:border-gray-700 my-8" />

        <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg flex flex-col md:flex-row items-center md:items-start gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 text-sm mb-2">Author & Creator</h3>
            <div className="text-xl font-bold">Abhishek Adhikari</div>
            <p className="mt-2 text-sm opacity-90">
              Lead Developer and SEO Strategist at 100 SEO Tools. Passionate about building accessible <strong>AI SEO tools</strong> and automation workflows for the digital marketing community.
            </p>
            <a href="https://www.100seotools.com/author" className="inline-block mt-4 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              View Author Profile &rarr;
            </a>
          </div>
        </section>
      </article>
    </main>
  );
}