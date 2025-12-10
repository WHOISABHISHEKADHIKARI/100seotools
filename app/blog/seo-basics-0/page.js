import { Suspense } from 'react';
import StructuredData from '../../../components/StructuredData';
import ShareActions from '../../../components/ShareActions';
import CardSection from '../../../components/CardSection';
import { getAllBlogPosts } from '../../../lib/blog';
import { getBaseUrl, siteName } from '../../../lib/site';
import Link from 'next/link';

export const dynamic = 'force-static';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'SEO Basics 0: A Practical Introduction to Core SEO Principles',
  description:
    'Learn the fundamentals of SEO — on-page, technical, and authority — with a clean, accessible layout and actionable steps.',
  keywords: [
    'seo basics',
    'seo fundamentals',
    'seo introduction',
    'search engine optimization',
    'seo for beginners',
    'how to do seo',
    'seo quickstart'
  ],
  alternates: { canonical: `${baseUrl}/blog/seo-basics-0` },
  openGraph: {
    title: 'SEO Basics 0: Core SEO Principles',
    description:
      'Understand SEO fundamentals with a practical, step-by-step guide to on-page, technical, and authority signals.',
    type: 'article',
    url: `${baseUrl}/blog/seo-basics-0`,
  },
  twitter: {
    card: 'summary',
    title: 'SEO Basics 0: Core SEO Principles',
    description:
      'A practical introduction to on-page, technical, and authority foundations for SEO.',
  },
};

export default function Page() {
  const publishedDate = '2024-01-10';
  const modifiedDate = new Date().toISOString();

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: metadata.title,
    description: metadata.description,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      '@type': 'Organization',
      name: siteName,
      url: baseUrl
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    mainEntityOfPage: `${baseUrl}/blog/seo-basics-0`,
    url: `${baseUrl}/blog/seo-basics-0`,
    keywords: metadata.keywords.join(', '),
    articleSection: 'SEO Guide',
    wordCount: 2000,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: 'SEO Basics 0', item: `${baseUrl}/blog/seo-basics-0` },
    ],
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are the three pillars of SEO?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The three pillars are Technical SEO (crawlability, speed, structured data), Content (helpful, well-structured pages), and Authority (backlinks, E-E-A-T, brand trust).'
        }
      },
      {
        '@type': 'Question',
        name: 'How long does SEO take to show results?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SEO typically takes 3-6 months to show significant results. Technical fixes may improve indexing quickly, while content and authority building are longer-term investments.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is E-E-A-T in SEO?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'E-E-A-T stands for Experience, Expertise, Authoritativeness, and Trustworthiness. It\'s Google\'s framework for evaluating content quality.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I do SEO myself?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Many businesses can handle basic SEO themselves using free tools. For competitive industries, professional help may accelerate results.'
        }
      }
    ]
  };

  const publishedLabel = `Published: ${new Date(publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 6 min read`;

  let recentPosts = [];
  try {
    recentPosts = getAllBlogPosts().slice(0, 6);
  } catch (error) {
    console.error('Error loading blog posts:', error);
  }

  return (
    <main id="main" className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400">
            <li><Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Home</Link> <span className="mx-2">›</span></li>
            <li><Link href="/blog" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Blog</Link> <span className="mx-2">›</span></li>
            <li aria-current="page" className="text-gray-900 dark:text-gray-100 font-medium">SEO Basics 0</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-12 text-center">
          <div className="inline-block px-4 py-1 mb-4 text-sm font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 rounded-full">
            SEO Guide
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-gray-900 via-brand-600 to-gray-900 dark:from-gray-100 dark:via-brand-400 dark:to-gray-100 bg-clip-text text-transparent">
            SEO Basics: Core Principles & Quickstart
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
            Learn the fundamentals of SEO across technical, content, and authority signals. Follow a simple workflow and use free tools to validate your improvements.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {publishedLabel}
            </span>
          </div>

          <div className="mt-6">
            <ShareActions url={`${baseUrl}/blog/seo-basics-0`} title={metadata.title} />
          </div>
        </header>

        {/* Table of Contents */}
        <div className="mb-12 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Table of Contents
          </h2>
          <nav className="space-y-2">
            <a href="#what-is-seo" className="block text-brand-600 dark:text-brand-400 hover:underline">1. What Is SEO?</a>
            <a href="#three-pillars" className="block text-brand-600 dark:text-brand-400 hover:underline">2. Three Core Pillars of SEO</a>
            <a href="#on-page-basics" className="block text-brand-600 dark:text-brand-400 hover:underline">3. On-Page SEO Basics</a>
            <a href="#technical-basics" className="block text-brand-600 dark:text-brand-400 hover:underline">4. Technical SEO Basics</a>
            <a href="#off-page-basics" className="block text-brand-600 dark:text-brand-400 hover:underline">5. Off-Page SEO Basics</a>
            <a href="#getting-started" className="block text-brand-600 dark:text-brand-400 hover:underline">6. Getting Started: Workflow</a>
            <a href="#faq" className="block text-brand-600 dark:text-brand-400 hover:underline">7. FAQs</a>
          </nav>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline">

          {/* Introduction */}
          <div className="p-6 mb-8 bg-brand-50 dark:bg-brand-900/20 rounded-xl border-l-4 border-brand-600">
            <p className="text-lg leading-relaxed mb-0">
              <strong>Welcome to SEO Basics 0!</strong> This quickstart covers the fundamentals of search engine optimization: how pages are discovered and evaluated, how to structure content, and what technical signals help search engines crawl and index your site.
            </p>
          </div>

          {/* Section 1: What Is SEO? */}
          <section id="what-is-seo" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">1. What Is SEO?</h2>
            <p>
              SEO (Search Engine Optimization) improves a website's visibility in search results. It combines on-page best practices, technical accessibility, and authority building to help relevant pages appear for user queries.
            </p>
            <p>
              Understanding these fundamentals is essential for anyone looking to drive organic traffic without paying for ads.
            </p>
          </section>

          {/* Section 2: Three Pillars */}
          <section id="three-pillars" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">2. Three Core Pillars of SEO</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">Technical SEO</h3>
            <p>
              Ensure crawlability, indexability, fast loading, and valid structured data. Keep robots rules and sitemaps clean. Use the <Link href="/tools/robots-txt-validator" className="text-brand-600 hover:underline">Robots.txt Validator</Link> to verify your configuration.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Content SEO</h3>
            <p>
              Create helpful, well-structured content with clear headings, concise paragraphs, and internal links. The <Link href="/tools/seo-content-checker" className="text-brand-600 hover:underline">SEO Content Checker</Link> can analyze your content quality.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Authority & Off-Page</h3>
            <p>
              Build credibility via references, mentions, and backlinks from relevant, trustworthy sources — and demonstrate E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).
            </p>
          </section>

          {/* Section 3: On-Page Basics */}
          <section id="on-page-basics" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">3. On-Page SEO Basics</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">Title Tags and Meta Descriptions</h3>
            <p>
              Write descriptive titles (50-60 characters) and compelling descriptions (150-160 characters) that reflect search intent. Test snippets with the <Link href="/tools/meta-tag-generator" className="text-brand-600 hover:underline">Meta Tag Generator</Link>.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Headings and Hierarchy</h3>
            <p>
              Organize content with H1–H3 for scannability. Use one H1 per page and maintain logical hierarchy. Validate structure using the <Link href="/tools/heading-analyzer" className="text-brand-600 hover:underline">Heading Analyzer</Link>.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Internal Linking</h3>
            <p>
              Connect related pages to help users and crawlers discover context. Use descriptive anchor text and avoid orphan pages.
            </p>
          </section>

          {/* Section 4: Technical Basics */}
          <section id="technical-basics" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">4. Technical SEO Basics</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">Crawlability and robots.txt</h3>
            <p>
              Allow access to important sections and block thin or private areas. Create rules with the <Link href="/tools/robots-txt-creator" className="text-brand-600 hover:underline">Robots.txt Creator</Link>.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Sitemaps and Indexability</h3>
            <p>
              Keep XML sitemaps current and clean. Generate files with the <Link href="/tools/sitemap-generator" className="text-brand-600 hover:underline">Sitemap Generator</Link>.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Speed and Core Web Vitals</h3>
            <p>
              Optimize images, reduce render-blocking scripts, and use responsive layouts. Monitor LCP, FID, and CLS metrics regularly.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Structured Data (Schema.org)</h3>
            <p>
              Help search engines understand content using JSON-LD. Validate markup via the <Link href="/tools/ai-schema-generator" className="text-brand-600 hover:underline">Schema Generator</Link> and <Link href="/tools/structured-data-validator" className="text-brand-600 hover:underline">Structured Data Validator</Link>.
            </p>
          </section>

          {/* Section 5: Off-Page Basics */}
          <section id="off-page-basics" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">5. Off-Page SEO Basics</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">Backlinks</h3>
            <p>
              Earn relevant links by publishing helpful resources and conducting outreach. Quality matters more than quantity. Validate redirects with the <Link href="/tools/redirect-checker" className="text-brand-600 hover:underline">Redirect Checker</Link>.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Brand Signals and Trust</h3>
            <p>
              Showcase expertise through author bios, cite authoritative sources, and keep policies (About, Privacy, Contact) accessible.
            </p>
          </section>

          {/* Section 6: Getting Started */}
          <section id="getting-started" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">6. Getting Started: A Simple Workflow</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>Audit:</strong> Run a technical SEO audit to identify issues.</li>
              <li><strong>Optimize:</strong> Fix title, meta descriptions, and heading structure.</li>
              <li><strong>Validate:</strong> Check structured data and internal links.</li>
              <li><strong>Publish:</strong> Submit sitemaps and monitor indexing.</li>
              <li><strong>Measure:</strong> Track rankings and adjust based on data.</li>
            </ol>
            <p className="mt-4">
              <Link href="/tools/seo-checklist-generator" className="inline-block px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors">
                Generate SEO Checklist →
              </Link>
            </p>
          </section>

          {/* Section 7: FAQ */}
          <section id="faq" className="mb-12">
            <h2 className="text-3xl font-bold mb-4">7. Frequently Asked Questions</h2>
            <div className="space-y-4">
              <details className="group p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <summary className="font-semibold cursor-pointer">What are the three pillars of SEO?</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300">The three pillars are Technical SEO (crawlability, speed, structured data), Content (helpful, well-structured pages), and Authority (backlinks, E-E-A-T, brand trust).</p>
              </details>
              <details className="group p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <summary className="font-semibold cursor-pointer">How long does SEO take to show results?</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300">SEO typically takes 3-6 months to show significant results. Technical fixes may improve indexing quickly, while content and authority building are longer-term investments.</p>
              </details>
              <details className="group p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <summary className="font-semibold cursor-pointer">What is E-E-A-T in SEO?</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300">E-E-A-T stands for Experience, Expertise, Authoritativeness, and Trustworthiness. It's Google's framework for evaluating content quality.</p>
              </details>
              <details className="group p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <summary className="font-semibold cursor-pointer">Can I do SEO myself?</summary>
                <p className="mt-3 text-gray-600 dark:text-gray-300">Yes! Many businesses can handle basic SEO themselves using free tools like ours. For competitive industries, professional help may accelerate results.</p>
              </details>
            </div>
          </section>

          {/* Related Tools */}
          <section className="mb-12 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4">Related Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/tools/on-page-seo-audit-checker" className="block p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-brand-500 transition-colors">On-Page SEO Audit Checker</Link>
              <Link href="/tools/meta-tag-generator" className="block p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-brand-500 transition-colors">Meta Tag Generator</Link>
              <Link href="/tools/heading-analyzer" className="block p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-brand-500 transition-colors">Heading Analyzer</Link>
              <Link href="/tools/robots-txt-validator" className="block p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-brand-500 transition-colors">Robots.txt Validator</Link>
              <Link href="/tools/structured-data-validator" className="block p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-brand-500 transition-colors">Structured Data Validator</Link>
              <Link href="/tools/seo-checklist-generator" className="block p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-brand-500 transition-colors">SEO Checklist Generator</Link>
            </div>
          </section>

        </article>

        {/* Related Blog Articles Section */}
        <Suspense fallback={<div className="text-center py-8">Loading related articles...</div>}>
          {recentPosts.length > 0 && (
            <div className="mt-16">
              <CardSection
                title="Related SEO Articles"
                description="Continue your SEO journey with these helpful guides and tutorials"
                items={recentPosts}
                variant="article"
                className="mt-0"
              />
            </div>
          )}
        </Suspense>

        {/* Footer CTA */}
        <footer className="mt-12 p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <p className="text-center text-lg mb-4">
            <strong>Found this guide helpful?</strong> Share it with others who want to learn SEO!
          </p>
          <div className="flex justify-center">
            <ShareActions url={`${baseUrl}/blog/seo-basics-0`} title={metadata.title} />
          </div>
        </footer>
      </div>

      {/* Structured Data */}
      <StructuredData data={articleLd} />
      <StructuredData data={breadcrumbLd} />
      <StructuredData data={faqLd} />
    </main>
  );
}
