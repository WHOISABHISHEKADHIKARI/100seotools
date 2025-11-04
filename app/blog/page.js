import Link from 'next/link';
import StructuredData from '../../components/StructuredData';
import BlogSection from '../../components/BlogSection';
import { getAllToolsMeta } from '../../tools';
import { getAllBlogPosts } from '../../lib/blog';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://100tools.app';

export const metadata = {
  title: '100 SEO Tools: The Ultimate Free, Browser-based Toolkit',
  description:
    'Explore 100+ free SEO tools for keyword research, on-page optimization, technical checks, backlinks, local SEO, AI writing, and performance tracking — all in your browser.',
  alternates: { canonical: `${baseUrl}/blog` },
  openGraph: {
    title: '100 SEO Tools: The Ultimate Free, Browser-based Toolkit',
    description:
      'Explore 100+ free SEO tools for keyword research, on-page optimization, technical checks, backlinks, local SEO, AI writing, and performance tracking — all in your browser.',
    url: `${baseUrl}/blog`,
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: '100 SEO Tools: The Ultimate Free, Browser-based Toolkit',
    description:
      'Explore 100+ free SEO tools for keyword research, on-page optimization, technical checks, backlinks, local SEO, AI writing, and performance tracking — all in your browser.',
  },
};

export default function BlogPage({ searchParams }) {
  const tools = getAllToolsMeta();
  const posts = getAllBlogPosts();
  const currentPage = Math.max(1, Number(searchParams?.page) || 1);
  const postsPerPage = 24;
  const totalPostPages = Math.max(1, Math.ceil(posts.length / postsPerPage));
  const pagedPosts = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);
  const toolsPage = Math.max(1, Number(searchParams?.toolsPage) || 1);
  const toolsPerPage = 12;
  const totalToolPages = Math.max(1, Math.ceil(tools.length / toolsPerPage));
  const pagedTools = tools.slice((toolsPage - 1) * toolsPerPage, toolsPage * toolsPerPage);
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
          <Link href="/tools/meta-tag-generator" prefetch={false} className="card p-4 hover:shadow-md transition" aria-label="Open Meta Tag Generator tool">
            <p className="font-semibold">Meta Tag Generator</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Create clean titles, meta descriptions, and tags.</p>
          </Link>
          <Link href="/tools/structured-data-validator" prefetch={false} className="card p-4 hover:shadow-md transition" aria-label="Open Structured Data Validator tool">
            <p className="font-semibold">Structured Data Validator</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Check JSON-LD and schema.org markup.</p>
          </Link>
          <Link href="/tools/keyword-clustering-tool" prefetch={false} className="card p-4 hover:shadow-md transition" aria-label="Open Keyword Clustering Tool">
            <p className="font-semibold">Keyword Clustering Tool</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Group keywords for topical relevance.</p>
          </Link>
          <Link href="/tools/robots-txt-validator" prefetch={false} className="card p-4 hover:shadow-md transition" aria-label="Open robots.txt Validator">
            <p className="font-semibold">robots.txt Validator</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Verify crawl rules and syntax.</p>
          </Link>
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
          {pagedTools.map((t) => (
            <div key={t.slug} className="card p-4 hover:shadow-md transition" aria-labelledby={`tool-title-${t.slug}`}>
              <p id={`tool-title-${t.slug}`} className="font-medium">{t.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.category}</p>
              <div className="mt-2 flex items-center gap-4">
                <Link href={`/blog/${t.slug}`} prefetch={false} className="text-brand-600 hover:underline text-sm">Guide: {t.name}</Link>
                <Link href={`/tools/${t.slug}`} prefetch={false} className="text-brand-600 hover:underline text-sm">Open tool: {t.name}</Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pager for tools */}
        <nav aria-label="Tool pages" className="not-prose mt-6">
          <ul className="flex flex-wrap gap-2 text-sm">
            {Array.from({ length: totalToolPages }, (_, i) => i + 1).map((p) => (
              <li key={p}>
                <Link
                  href={{
                    pathname: '/blog',
                    query: {
                      ...(currentPage > 1 ? { page: currentPage } : {}),
                      ...(p > 1 ? { toolsPage: p } : {}),
                    },
                  }}
                  prefetch={false}
                  className={`px-3 py-1.5 rounded-md border ${p === toolsPage ? 'bg-slate-200 dark:bg-white/20' : 'bg-slate-100 dark:bg-white/10'} border-slate-200 dark:border-white/10`}
                >
                  Tools Page {p}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-semibold">SEO Mastery (100 Simple Guides)</h2>
        <p className="text-gray-700 dark:text-gray-300">Quick, actionable posts covering foundations, keyword research, on-page, technical, links, content, local, AI, SERP features, and tracking.</p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {pagedPosts.map((p) => (
            <div key={p.slug} className="card p-4 hover:shadow-md transition">
              <h3 className="font-medium">
                <Link href={`/blog/${p.slug}`} prefetch={false} className="text-brand-600 hover:underline">
                  {p.title}
                </Link>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{p.category}</p>
            </div>
          ))}
        </div>

        {/* Pager for posts */}
        <nav aria-label="Blog pages" className="not-prose mt-6">
          <ul className="flex flex-wrap gap-2 text-sm">
            {Array.from({ length: totalPostPages }, (_, i) => i + 1).map((p) => (
              <li key={p}>
                <Link
                  href={{ pathname: '/blog', query: p > 1 ? { page: p } : {} }}
                  prefetch={false}
                  className={`px-3 py-1.5 rounded-md border ${p === currentPage ? 'bg-slate-200 dark:bg-white/20' : 'bg-slate-100 dark:bg-white/10'} border-slate-200 dark:border-white/10`}
                >
                  Page {p}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* Enhanced Blog Section with Latest Posts */}
      <section className="mt-12">
        <BlogSection showHeader={true} />
      </section>
    </article>
  );
}