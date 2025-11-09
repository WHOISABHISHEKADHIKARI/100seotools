import StructuredData from '../../../components/StructuredData';
import ShareActions from '../../../components/ShareActions';
import CardSection from '../../../components/CardSection';
import { getAllBlogPosts } from '../../../lib/blog';
import { getBaseUrl, siteName } from '../../../lib/site';

export const dynamic = 'force-static';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'SEO Basics 0: A Practical Introduction to Core SEO Principles',
  description:
    'Learn the fundamentals of SEO — on-page, technical, and authority — with a clean, accessible layout and actionable steps.',
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
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: metadata.title,
    description: metadata.description,
    datePublished: new Date().toISOString(),
    author: { '@type': 'Organization', name: siteName },
    publisher: { '@type': 'Organization', name: siteName },
    mainEntityOfPage: `${baseUrl}/blog/seo-basics-0`,
    url: `${baseUrl}/blog/seo-basics-0`,
    keywords: 'SEO basics, on-page SEO, technical SEO, backlinks, EEAT',
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

  const publishedLabel = `Published: ${new Date().toLocaleDateString()} • 6 min read`;
  const recentPosts = getAllBlogPosts().slice(0, 6);

  return (
    <main id="main" className="container mx-auto px-4 py-8">
      {/* Header (semantic) */}
      <header className="mb-4" aria-labelledby="page-title">
        <nav aria-label="Breadcrumb" className="text-sm mb-4">
          <ol className="flex flex-wrap gap-1 text-slate-600 dark:text-slate-300">
            <li><a className="hover:underline" href="/">Home</a> <span aria-hidden>›</span></li>
            <li><a className="hover:underline" href="/blog">Blog</a> <span aria-hidden>›</span></li>
            <li aria-current="page">SEO Basics 0</li>
          </ol>
        </nav>

        <h1 id="page-title" className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">SEO Basics 0: A Practical Introduction to Core SEO Principles</h1>
        <p className="text-slate-600 dark:text-slate-300">{publishedLabel}</p>

        <div className="mt-4"><ShareActions url={`${baseUrl}/blog/seo-basics-0`} title={metadata.title} /></div>
      </header>

      {/* Article (semantic) */}
      <article className="prose dark:prose-invert max-w-none leading-relaxed">
        <p>
          This quickstart covers the fundamentals of search engine optimization: how pages are discovered and evaluated, how to structure content, and what technical signals help search engines crawl and index your site.
        </p>

        <section aria-labelledby="what-is-seo-heading" className="mt-6">
          <h2 id="what-is-seo-heading">What Is SEO?</h2>
          <p>
            SEO (Search Engine Optimization) improves a website’s visibility in search results. It combines on-page best practices, technical accessibility, and authority building to help relevant pages appear for user queries.
          </p>
        </section>

        <section aria-labelledby="pillars-heading" className="mt-8">
          <h2 id="pillars-heading">Three Core Pillars</h2>
          <h3>Technical</h3>
          <p>Ensure crawlability, indexability, fast loading, and valid structured data. Keep robots rules and sitemaps clean.</p>
          <h3>Content</h3>
          <p>Create helpful, well-structured content with clear headings, concise paragraphs, and internal links for context.</p>
          <h3>Authority</h3>
          <p>Build credibility via references, mentions, and backlinks from relevant, trustworthy sources — and demonstrate E-E-A-T.</p>
        </section>

        <section aria-labelledby="onpage-heading" className="mt-8">
          <h2 id="onpage-heading">On‑Page Basics</h2>
          <h3>Title tags and meta descriptions</h3>
          <p>
            Write descriptive titles and compelling descriptions that reflect search intent. Test snippets with the <a className="text-brand-600 hover:underline" href="/tools/meta-tag-generator">Meta Tag Generator</a>.
          </p>
          <h3>Headings and hierarchy</h3>
          <p>
            Organize content with H1–H3 for scannability. Validate structure using the <a className="text-brand-600 hover:underline" href="/tools/heading-analyzer">Heading Analyzer</a>.
          </p>
          <h3>Internal linking</h3>
          <p>Connect related pages to help users and crawlers discover context. Use descriptive anchor text and avoid orphan pages.</p>
        </section>

        <section aria-labelledby="technical-heading" className="mt-8">
          <h2 id="technical-heading">Technical Basics</h2>
          <h3>Crawlability and robots.txt</h3>
          <p>
            Allow access to important sections and block thin or private areas. Create rules with the <a className="text-brand-600 hover:underline" href="/tools/robots-txt-creator">Robots.txt Creator</a>.
          </p>
          <h3>Sitemaps and indexability</h3>
          <p>
            Keep XML sitemaps current and clean. Generate files with the <a className="text-brand-600 hover:underline" href="/tools/sitemap-generator">Sitemap Generator</a>.
          </p>
          <h3>Speed and UX</h3>
          <p>Optimize images, reduce render‑blocking scripts, and use responsive layouts. Monitor Core Web Vitals regularly.</p>
          <h3>Structured data</h3>
          <p>
            Help search engines understand content using JSON‑LD. Validate markup via the <a className="text-brand-600 hover:underline" href="/tools/ai-schema-generator">Schema Generator</a> and <a className="text-brand-600 hover:underline" href="/tools/structured-data-validator">Structured Data Validator</a>.
          </p>
        </section>

        <section aria-labelledby="offpage-heading" className="mt-8">
          <h2 id="offpage-heading">Off‑Page Basics</h2>
          <h3>Backlinks</h3>
          <p>
            Earn relevant links by publishing helpful resources and outreach. Validate redirects and migrations with the <a className="text-brand-600 hover:underline" href="/tools/redirect-checker">Redirect Checker</a>.
          </p>
          <h3>Brand signals and trust</h3>
          <p>Showcase expertise, cite authoritative sources, and keep policies (About, Privacy) accessible to users.</p>
        </section>

        <section aria-labelledby="start-heading" className="mt-8">
          <h2 id="start-heading">Getting Started: A Simple Workflow</h2>
          <ol>
            <li>Draft content with clear H1–H3 and concise paragraphs.</li>
            <li>Optimize title, description, and headings with the listed tools.</li>
            <li>Validate structured data and check links.</li>
            <li>Submit sitemaps and monitor performance.</li>
          </ol>
          <p className="mt-2"><a href="/tools/seo-checklist-generator" className="btn">Open SEO Checklist</a></p>
        </section>
      </article>

      {/* Responsive Card Section — matches site spacing and interactions */}
      <CardSection
        title="Explore More SEO Guides"
        description="Practical, short reads to help you improve crawlability, metadata, and internal linking."
        items={recentPosts}
        variant="article"
        className="mt-12"
      />

      {/* Footer (semantic) */}
      <footer className="mt-8" aria-label="Article footer">
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-white/5">
          <p className="text-sm text-slate-600 dark:text-slate-300">Found this useful? Share the guide or explore more tools.</p>
          <div className="mt-3"><ShareActions url={`${baseUrl}/blog/seo-basics-0`} title={metadata.title} /></div>
        </div>
      </footer>

      <StructuredData data={articleLd} />
      <StructuredData data={breadcrumbLd} />
    </main>
  );
}
