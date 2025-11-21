import Link from 'next/link';
import StructuredData from '../../components/StructuredData';
import { getAllBlogPostsPublished } from '../../lib/blog-data';
import { getBaseUrl } from '../../lib/site';
import fs from 'node:fs';
import path from 'node:path';

const baseUrl = getBaseUrl();

// Prefer static rendering to reduce RSC prefetch churn and aborted requests
export const dynamic = 'force-static';
export const revalidate = 3600; // Cache and revalidate every hour

export const metadata = {
  title: '100 SEO Tools: The Ultimate Free, Browser-based Toolkit',
  description:
    'Explore 100+ free SEO tools and guides for keywords, on-page, technical, backlinks, local SEO, AI, and performance — all in your browser.',
  alternates: { canonical: `${baseUrl}/blog` },
  openGraph: {
    title: '100 SEO Tools: The Ultimate Free, Browser-based Toolkit',
    description:
      'Explore 100+ free SEO tools and guides for keywords, on-page, technical, backlinks, local SEO, AI, and performance — all in your browser.',
    url: `${baseUrl}/blog`,
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: '100 SEO Tools: The Ultimate Free, Browser-based Toolkit',
    description:
      'Explore 100+ free SEO tools and guides for keywords, on-page, technical, backlinks, local SEO, AI, and performance — all in your browser.',
  },
};

export default async function BlogPage() {
  const posts = await getAllBlogPostsPublished();
  let instructionEntries = [];
  try {
    const primary = path.resolve(process.cwd(), 'instruction', 'json-instruction.json');
    const fallback = path.resolve(process.cwd(), 'tools', 'json instruction');
    const file = fs.existsSync(primary) ? primary : fallback;
    const text = fs.readFileSync(file, 'utf8');
    const json = JSON.parse(text);
    const entries = Array.isArray(json.entries) ? json.entries : [];
    instructionEntries = entries.filter((e) => {
      try {
        const g = e.schema_json_ld && e.schema_json_ld['@graph'];
        if (!Array.isArray(g)) return false;
        const wp = g.find((n) => n && n['@type'] === 'WebPage');
        const u = wp && (wp.url || wp['@id']);
        return typeof u === 'string' && /\/blog\//.test(u);
      } catch {
        return false;
      }
    });
  } catch {}
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` }
    ]
  };
  const collectionLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: '100 SEO Tools Blog',
        description:
          'All SEO guides merged into one page with anchors for faster discovery and better crawlability.',
        url: `${baseUrl}/blog`,
        isPartOf: `${baseUrl}/`,
      },
      breadcrumbLd,
      ...posts.flatMap((p) => {
        const anchor = `${baseUrl}/blog#${p.slug}`;
        const nodes = [
          {
            '@type': 'Article',
            headline: p.title,
            description: p.description,
            datePublished: p.datePublished,
            author: { '@type': 'Organization', name: '100 SEO Tools' },
            publisher: { '@type': 'Organization', name: '100 SEO Tools' },
            url: anchor,
            mainEntityOfPage: anchor,
            inLanguage: 'en-US',
            wordCount: p.wordCount || 1200,
            articleSection: p.category || 'SEO Guides',
            keywords: Array.isArray(p.tags) ? p.tags.join(', ') : undefined,
          }
        ];
        if (Array.isArray(p.sections?.faq) && p.sections.faq.length > 0) {
          nodes.push({
            '@type': 'FAQPage',
            url: anchor,
            isPartOf: anchor,
            mainEntity: p.sections.faq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a }
            }))
          });
        }
        if (Array.isArray(p.sections?.howDetailed) && p.sections.howDetailed.length > 0) {
          nodes.push({
            '@type': 'HowTo',
            url: anchor,
            isPartOf: anchor,
            name: p.title,
            description: p.description,
            step: p.sections.howDetailed.map((s) => ({ '@type': 'HowToStep', text: s }))
          });
        }
        return nodes;
      })
    ]
  };

  return (
    <article className="max-w-3xl mx-auto py-10 space-y-10">
      <StructuredData data={collectionLd} />
      {instructionEntries.map((e, i) => (
        <StructuredData key={`instr-${i}`} data={e.schema_json_ld} />
      ))}

      {/* Premium hero */}
      <header className="text-center p-6 rounded-xl border border-slate-200 dark:border-white/10 bg-gradient-to-r from-slate-50/60 to-transparent dark:from-white/5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-xs">
          <span>Premium</span>
        </div>
        <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">
          100 SEO Tools: The Ultimate Free, Browser-based Toolkit
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Free, fast, and privacy-friendly — the ultimate browser-based SEO toolkit. Run 100+ SEO helpers directly in your browser, no signups or APIs.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/" prefetch={false} className="btn">Browse tools</Link>
          <Link href="/blog" prefetch={false} className="btn-secondary">Read guides</Link>
        </div>
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

      {/* Table of contents for all blog posts (anchors) */}
      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">All Guides</h2>
        <p className="text-gray-700 dark:text-gray-300">Jump to any guide below. All content is merged into this one page for faster crawling and lower click depth.</p>
        <nav aria-label="Table of contents">
          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
            {posts.map((p) => (
              <li key={p.slug}>
                <a className="text-brand-600 hover:underline" href={`#${p.slug}`}>{p.title}</a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* Merged one‑pager sections for all posts */}
      {posts.map((p) => (
        <section key={p.slug} id={p.slug} className="space-y-3 scroll-mt-20">
          <h2 className="text-xl md:text-2xl font-semibold">{p.title}</h2>
          <p className="text-gray-700 dark:text-gray-300">{p.description}</p>
          <div className="text-xs text-slate-500 dark:text-slate-400">Category: {p.category} · {new Date(p.datePublished).toLocaleDateString()} · {p.readTimeMinutes || 8} min read</div>
          <details className="group open:space-y-2">
            <summary className="cursor-pointer text-brand-600 hover:underline">Expand</summary>
            {p.sections?.intro && (<p className="text-gray-700 dark:text-gray-300">{p.sections.intro}</p>)}
            {Array.isArray(p.sections?.how) && p.sections.how.length > 0 && (
              <div>
                <h3 className="text-lg font-medium">How</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  {p.sections.how.map((h, i) => (
                    <li key={i}><a href={h.slug ? `/tools/${h.slug}` : '#'} className="text-brand-600 hover:underline">{h.label || h.text}</a></li>
                  ))}
                </ul>
              </div>
            )}
            {Array.isArray(p.sections?.howDetailed) && p.sections.howDetailed.length > 0 && (
              <div>
                <h3 className="text-lg font-medium">Steps</h3>
                <ol className="list-decimal pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  {p.sections.howDetailed.map((s, i) => (<li key={i}>{s}</li>))}
                </ol>
              </div>
            )}
            {Array.isArray(p.sections?.tips) && p.sections.tips.length > 0 && (
              <div>
                <h3 className="text-lg font-medium">Tips</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                  {p.sections.tips.map((t, i) => (<li key={i}>{t}</li>))}
                </ul>
              </div>
            )}
            {Array.isArray(p.sections?.faq) && p.sections.faq.length > 0 && (
              <div>
                <h3 className="text-lg font-medium">FAQ</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  {p.sections.faq.map((f, i) => (
                    <li key={i}><span className="font-medium">Q:</span> {f.q} <br /><span className="font-medium">A:</span> {f.a}</li>
                  ))}
                </ul>
              </div>
            )}
          </details>
          <div className="mt-2"><a href="#top" className="text-sm text-brand-600 hover:underline">Back to top</a></div>
        </section>
      ))}

      {/* Footer note */}
      <section className="mt-12">
        <p className="text-sm text-gray-600 dark:text-gray-400">All guides are merged into this single page. Old blog URLs redirect to these anchors.</p>
      </section>
    </article>
  );
}
