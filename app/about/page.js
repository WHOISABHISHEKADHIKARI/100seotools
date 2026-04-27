import { getBaseUrl } from '../../lib/site';
import Link from 'next/link';
import StructuredData from '../../components/ui/StructuredData';
import { generateStaticPageSchema, generateFAQSchema } from '../../lib/schema';

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

const faqs = [
  {
    question: 'How do AI crawlers interpret SEO tools?',
    answer: 'AI crawlers prioritize structured data, fast load times, and semantic relevance. Our tools are optimized with comprehensive JSON-LD (SoftwareApplication, HowTo, and FAQ schema) to provide clean, machine-readable signals.'
  },
  {
    question: 'What is the "Live Preview" feature in your tools?',
    answer: 'Most of our tools feature real-time processing. As you type in the input fields, the logic executes immediately, allowing you to see results and optimize your metadata or content without multiple clicks.'
  },
  {
    question: 'Are the tools safe for my data?',
    answer: 'Yes. All our tools run entirely client-side in your browser. We do not store or transmit your inputs or generated outputs to any server, ensuring 100% privacy and lightning-fast performance.'
  },
  {
    question: 'How do these tools help with technical SEO?',
    answer: 'By providing instant validation for robots.txt, sitemaps, and canonical tags, our tools help you identify and fix crawlability issues that might be hindering your site\'s indexation.'
  },
  {
    question: 'Can I use these tools on mobile devices?',
    answer: 'Absolutely. Every tool is built with a responsive, mobile-first design, ensuring that you can audit and optimize your SEO strategy on the go.'
  }
];

export default function AboutPage() {
  const aboutSchema = generateStaticPageSchema({
    path: '/about',
    title: metadata.title,
    description: metadata.description
  }, baseUrl);

  // Enhance generic WebPage schema to specific AboutPage
  aboutSchema['@type'] = 'AboutPage';
  aboutSchema['headline'] = 'About 100 SEO Tools';
  aboutSchema['author'] = {
    '@type': 'Person',
    'name': 'Abhishek Adhikari',
    'url': `${baseUrl}/author`
  };

  const faqSchema = generateFAQSchema(faqs);

  return (
    <main className="max-w-4xl mx-auto py-10 px-6 text-gray-800 dark:text-gray-200">
      <StructuredData data={[aboutSchema, faqSchema]} />

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
          <section>
            <h2 className="text-3xl font-bold mb-4">Engineering for Usability & Search Visibility</h2>
            <p className="mb-6">
              We believe that SEO tools should be as powerful as they are easy to use. Our development philosophy is built on two core pillars: <strong>Dynamic Usability</strong> and <strong>Automated Structured Data</strong>.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <span className="text-brand-600">⚡</span> Human-First Usability
                </h3>
                <p>
                  Every tool on our platform is designed for professional efficiency. We've implemented advanced usability logic including:
                </p>
                <ul className="list-disc pl-6 space-y-2 opacity-90">
                  <li><strong>Live Preview:</strong> See your changes reflected instantly as you type.</li>
                  <li><strong>Example Data Loader:</strong> One-click "💡 Example" buttons to see best-practice inputs instantly.</li>
                  <li><strong>Session Persistence:</strong> Your inputs are remembered across refreshes, preventing data loss.</li>
                  <li><strong>Reset Logic:</strong> 🔄 Quickly clear your workspace and start a new analysis.</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <span className="text-brand-600">🔍</span> Automated JSON-LD
                </h3>
                <p>
                  We don't just help you with SEO; we lead by example. Our pages use complex <strong>JSON-LD @graph</strong> structures to tell search engines exactly what each tool does:
                </p>
                <ul className="list-disc pl-6 space-y-2 opacity-90">
                  <li><strong>SoftwareApplication:</strong> Identifies the tool, its category, and its free availability.</li>
                  <li><strong>HowTo Schema:</strong> Provides step-by-step instructions for crawlers to index.</li>
                  <li><strong>FAQPage Schema:</strong> Dynamically generated based on the tool's unique logic and guidance.</li>
                  <li><strong>BreadcrumbList:</strong> Ensures clear navigation paths for enhanced search snippets.</li>
                </ul>
              </div>
            </div>
          </section>
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
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
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