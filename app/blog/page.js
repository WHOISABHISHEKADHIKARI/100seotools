import StructuredData from '../../components/StructuredData';
import { getAllToolsMeta } from '../../tools';
import { getAllBlogPosts } from '../../lib/blog';

export const metadata = {
  title: '100 SEO Tools: The Ultimate Free, Browser-based Toolkit',
  description:
    'Explore 100+ free SEO tools for keyword research, on-page optimization, technical checks, backlinks, local SEO, AI writing, and performance tracking — all in your browser.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: '100 SEO Tools: The Ultimate Free, Browser-based Toolkit',
    description:
      'Explore 100+ free SEO tools for keyword research, on-page optimization, technical checks, backlinks, local SEO, AI writing, and performance tracking — all in your browser.',
    url: '/blog',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: '100 SEO Tools: The Ultimate Free, Browser-based Toolkit',
    description:
      'Explore 100+ free SEO tools for keyword research, on-page optimization, technical checks, backlinks, local SEO, AI writing, and performance tracking — all in your browser.',
  },
};

export default function BlogPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const tools = getAllToolsMeta();
  const posts = getAllBlogPosts();
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` }
    ]
  };
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '100 SEO Tools: The Ultimate Free, Browser-based Toolkit',
    description:
      'Explore 100+ free SEO tools for keyword research, on-page optimization, technical checks, backlinks, local SEO, AI writing, and performance tracking — all in your browser.',
    datePublished: new Date().toISOString(),
    author: { '@type': 'Organization', name: '100 SEO Tools' },
    publisher: { '@type': 'Organization', name: '100 SEO Tools' },
    mainEntityOfPage: `${baseUrl}/blog`,
    url: `${baseUrl}/blog`,
  };

  return (
    <article className="max-w-3xl mx-auto py-10 space-y-10">
      <StructuredData data={breadcrumbLd} />
      <StructuredData data={articleLd} />

      <header className="space-y-3 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">
          100 SEO Tools: The Ultimate Free, Browser-based Toolkit
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Free, fast, and privacy-friendly. Run 100+ SEO helpers directly in your
          browser — no signups or APIs.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold">What is 100 SEO Tools?</h2>
        <p className="text-gray-700 dark:text-gray-300">
          100 SEO Tools is an all-in-one, browser-based toolkit designed for digital
          marketers, developers, business owners, and bloggers. It includes keyword
          research utilities, on-page optimizers, technical validators, link tools,
          local SEO helpers, AI writing assistants, and tracking calculators — all
          accessible instantly without logins.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">How it helps your SEO</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            Keyword Research: try{' '}
            <a className="text-brand-600 hover:underline" href="/tools/keyword-suggestion-tool">
              Keyword Suggestion
            </a>{' '}
            or{' '}
            <a className="text-brand-600 hover:underline" href="/tools/long-tail-keyword-generator">
              Long-tail Generator
            </a>
            .
          </li>
          <li>
            On-Page Optimization: use{' '}
            <a className="text-brand-600 hover:underline" href="/tools/meta-tag-generator">
              Meta Tag Generator
            </a>{' '}
            and{' '}
            <a className="text-brand-600 hover:underline" href="/tools/heading-analyzer">
              Heading Analyzer
            </a>
            .
          </li>
          <li>
            Technical SEO: validate{' '}
            <a className="text-brand-600 hover:underline" href="/tools/robots-txt-validator">
              robots.txt
            </a>{' '}
            and{' '}
            <a className="text-brand-600 hover:underline" href="/tools/structured-data-validator">
              structured data
            </a>
            .
          </li>
          <li>
            Backlinks & Outreach: generate{' '}
            <a className="text-brand-600 hover:underline" href="/tools/outreach-email-template-generator">
              outreach templates
            </a>{' '}
            and explore{' '}
            <a className="text-brand-600 hover:underline" href="/tools/backlink-idea-generator">
              backlink ideas
            </a>
            .
          </li>
          <li>
            Local SEO: build{' '}
            <a className="text-brand-600 hover:underline" href="/tools/local-schema-builder">
              local schema
            </a>{' '}
            and check{' '}
            <a className="text-brand-600 hover:underline" href="/tools/nap-consistency-checker">
              NAP consistency
            </a>
            .
          </li>
          <li>
            AI SEO Writing: draft{' '}
            <a className="text-brand-600 hover:underline" href="/tools/ai-meta-tag-writer">
              meta tags
            </a>{' '}
            and{' '}
            <a className="text-brand-600 hover:underline" href="/tools/ai-content-outline-generator">
              outlines
            </a>
            .
          </li>
          <li>
            Performance Tracking: estimate{' '}
            <a className="text-brand-600 hover:underline" href="/tools/traffic-potential-calculator">
              traffic potential
            </a>{' '}
            and monitor{' '}
            <a className="text-brand-600 hover:underline" href="/tools/ranking-progress-tracker">
              ranking progress
            </a>
            .
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">Who it’s for</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Marketers and SEOs: quick audits and content tweaks without heavy suites.</li>
          <li>Developers: fast technical checks with client-side utilities.</li>
          <li>Business owners: explore opportunities and validate optimizations.</li>
          <li>Bloggers: speed up ideation, formatting, and on-page optimization.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">How to use</h2>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Browse all tools on the homepage.</li>
          <li>Open a tool, paste your inputs, and generate results instantly.</li>
          <li>Copy or download outputs to apply in your workflow.</li>
          <li>Mark favorites with the star for quick access later.</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold">Popular picks</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <a href="/tools/meta-tag-generator" className="card p-4 hover:shadow-md transition">
            <h3 className="font-semibold">Meta Tag Generator</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Create clean titles, meta descriptions, and tags.</p>
          </a>
          <a href="/tools/structured-data-validator" className="card p-4 hover:shadow-md transition">
            <h3 className="font-semibold">Structured Data Validator</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Check JSON-LD and schema.org markup.</p>
          </a>
          <a href="/tools/keyword-clustering-tool" className="card p-4 hover:shadow-md transition">
            <h3 className="font-semibold">Keyword Clustering Tool</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Group keywords for topical relevance.</p>
          </a>
          <a href="/tools/robots-txt-validator" className="card p-4 hover:shadow-md transition">
            <h3 className="font-semibold">robots.txt Validator</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Verify crawl rules and syntax.</p>
          </a>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">SEO benefits</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Faster iterations: reduce dependency on heavy SaaS for simple tasks.</li>
          <li>Better coverage: cover keyword, on-page, technical, and link work.</li>
          <li>Team-friendly: share links, run tools anywhere, no signups.</li>
          <li>Privacy-first: runs in your browser, no data stored server-side.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">Get started</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Head to the{' '}
          <a className="text-brand-600 hover:underline" href="/">
            homepage
          </a>{' '}
          and try a few tools. Bookmark your favorites and integrate outputs into your
          content and dev workflows.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold">Tool Guides</h2>
        <p className="text-gray-700 dark:text-gray-300">Explore how to use each tool effectively. Read the guide or open the tool directly.</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tools.map((t) => (
            <div key={t.slug} className="card p-4">
              <h3 className="font-medium">{t.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.category}</p>
              <div className="mt-2 flex items-center gap-4">
                <a href={`/blog/${t.slug}`} className="text-brand-600 hover:underline text-sm">Read guide</a>
                <a href={`/tools/${t.slug}`} className="text-brand-600 hover:underline text-sm">Open tool</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold">SEO Mastery (100 Simple Guides)</h2>
        <p className="text-gray-700 dark:text-gray-300">Quick, actionable posts covering foundations, keyword research, on-page, technical, links, content, local, AI, SERP features, and tracking.</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {posts.map((p) => (
            <div key={p.slug} className="card p-4">
              <h3 className="font-medium">{p.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{p.category}</p>
              <div className="mt-2 flex items-center gap-4">
                <a href={`/blog/${p.slug}`} className="text-brand-600 hover:underline text-sm">Read post</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}