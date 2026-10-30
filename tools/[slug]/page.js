import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle, Home, Layers, Star } from 'lucide-react';
import { getAllBlogPostsPublished } from '../../../lib/blog-data';
import { getAllToolsMeta } from '../../../tools';
import CategoryClient from '../../../components/tools/CategoryClient';
import { slugify } from '../../../lib/utils';
import { getBaseUrl } from '../../../lib/site';
import { createSocialMetadata } from '../../../lib/socialMetadata';
import { getCategoryDetail, visualColors } from '../../../components/tools/SeoVisuals';
import { generateStaticPageSchema } from '../../../lib/schema';
import { generateSoftwareApplicationSchema } from '../../../lib/schema';

const baseUrl = getBaseUrl();

const categories = [
  'Keyword Research',
  'On-Page Optimization',
  'Technical SEO',
  'Backlink & Link-Building',
  'Content SEO',
  'SEO Performance',
  'Local SEO',
  'Competitor Analysis',
  'AI-Powered SEO',
  'SEO Utility',
  'Schema & Structured Data',
];

const categoryIntro = {
  'keyword-research': 'Strengthen topical coverage with themed clusters and intent mapping. Generate ideas fast with keyword suggestion tools and use those terms to seed clusters, plan internal links, and prioritize high-opportunity search terms for your content strategy.',
  'on-page-optimization': 'Improve your page-level SEO with tools that analyze titles, meta descriptions, heading structure, readability, and keyword placement. Fine-tune every element search engines evaluate when ranking your content.',
  'technical-seo': 'Audit and fix critical technical foundations including robots.txt, XML sitemaps, redirect chains, canonical tags, status codes, and mobile readiness. Ensure search engines can crawl and index your site efficiently.',
  'backlink-link-building': 'Find link prospects, analyze anchor text distribution, audit your backlink profile, and plan outreach campaigns. Build authority with data-driven link-building strategies.',
  'content-seo': 'Plan, optimize, and refresh search-focused content. Analyze readability, check keyword density, evaluate tone of voice, and ensure your content matches searcher intent across every stage of the funnel.',
  'seo-performance': 'Estimate traffic potential, CTR, keyword ROI, ranking progress, and growth opportunities. Measure what matters and prioritize efforts that move organic performance metrics.',
  'local-seo': 'Optimize local listings, citations, reviews, local business schema, and NAP consistency. Dominate local pack results and attract nearby customers with accurate location data.',
  'competitor-analysis': 'Compare competitors side by side, spot keyword gaps, identify content opportunities, and benchmark your SEO performance against market rivals.',
  'ai-powered-seo': 'Use artificial intelligence for content outlines, blog introductions, meta descriptions, schema markup, FAQ generation, and content rewriting. Accelerate your SEO workflow with AI assistance.',
  'seo-utility': 'Everyday helpers for URL slug generation, redirect creation, HTML cleaning, SEO checklists, and quick previews. Essential utilities that streamline routine SEO tasks.',
  'schema-structured-data': 'Generate and validate JSON-LD for rich results including FAQPage, HowTo, BreadcrumbList, Product, Article, and SoftwareApplication schema. Enhance your SERP appearance with structured markup.',
};

const categoryToolLinks = {
  'keyword-research': [
    { href: '/tools/keyword-suggestion-tool', label: 'Keyword Suggestion Tool' },
    { href: '/tools/keyword-clustering-tool', label: 'Keyword Clustering' },
    { href: '/tools/keyword-intent-identifier', label: 'Intent Identifier' },
  ],
  'on-page-optimization': [
    { href: '/tools/meta-tag-generator', label: 'Meta Tag Generator' },
    { href: '/tools/on-page-seo-checker', label: 'On-Page SEO Checker' },
    { href: '/tools/readability-analyzer', label: 'Readability Analyzer' },
  ],
  'technical-seo': [
    { href: '/tools/robots-txt-generator', label: 'Robots.txt Generator' },
    { href: '/tools/xml-sitemap-generator', label: 'Sitemap Generator' },
    { href: '/tools/canonical-tag-checker', label: 'Canonical Checker' },
  ],
  'backlink-link-building': [
    { href: '/tools/backlink-analyzer', label: 'Backlink Analyzer' },
    { href: '/tools/anchor-text-analyzer', label: 'Anchor Text Analyzer' },
  ],
  'content-seo': [
    { href: '/tools/keyword-density-checker', label: 'Keyword Density Checker' },
    { href: '/tools/tone-of-voice-analyzer', label: 'Tone of Voice Analyzer' },
  ],
  'seo-performance': [
    { href: '/tools/keyword-roi-calculator', label: 'Keyword ROI Calculator' },
    { href: '/tools/ctr-estimator', label: 'CTR Estimator' },
  ],
  'local-seo': [
    { href: '/tools/local-schema-generator', label: 'Local Schema Generator' },
    { href: '/tools/nap-consistency-checker', label: 'NAP Checker' },
  ],
  'competitor-analysis': [
    { href: '/tools/competitor-keyword-gap', label: 'Keyword Gap Analysis' },
  ],
  'ai-powered-seo': [
    { href: '/tools/ai-meta-description-generator', label: 'AI Meta Description Generator' },
    { href: '/tools/ai-blog-intro-writer', label: 'AI Blog Intro Writer' },
  ],
  'seo-utility': [
    { href: '/tools/redirect-301-generator', label: '301 Redirect Generator' },
    { href: '/tools/slug-generator', label: 'URL Slug Generator' },
  ],
  'schema-structured-data': [
    { href: '/tools/faq-schema-generator', label: 'FAQ Schema Generator' },
    { href: '/tools/breadcrumb-schema-generator', label: 'Breadcrumb Schema' },
    { href: '/tools/howto-schema-generator', label: 'HowTo Schema Generator' },
  ],
];

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = getAllToolsMeta().find((t) => t.slug === slug);
  const catName = categories.find((category) => slugify(category) === slug) ||
    slug.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const title = tool ? `${tool.name} | Free SEO Tool` : `${catName} Tools | Free SEO Utilities & Analyzers`;
  const description = tool ? tool.description : `Boost your rankings with our free ${catName} tools. Curated analyzers, generators, and utilities designed for modern SEO.`;
  const url = `${getBaseUrl()}/tools/${slug}`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: url },
    ...createSocialMetadata({
      title,
      description,
      url,
      imageAlt: `${tool ? tool.name : catName} SEO Tools`,
    }),
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const tools = getAllToolsMeta();
  const catFallback = slug.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const catName = categories.find((category) => slugify(category) === slug) || catFallback;
  const items = tools.filter((tool) => tool.category && slugify(tool.category) === slug);
  const isKnownCategory = categories.some((category) => slugify(category) === slug);
  if (!isKnownCategory && items.length === 0) {
    notFound();
  }
  const featuredTool = items[0] || null;
  const allPosts = await getAllBlogPostsPublished();
  const blogPosts = allPosts.filter((post) => {
    const matchesCategory = post.category && slugify(post.category) === slug;
    const matchesTag = Array.isArray(post.tags) && post.tags.some((tag) => slugify(tag) === slug);
    return matchesCategory || matchesTag;
  });

  const detail = getCategoryDetail(catName);
  const Icon = detail.icon;
  const color = visualColors[detail.color] || visualColors.violet;

  // Enhanced AEO/GEO Schema: CollectionPage with BreadcrumbList, HasPart, and WebPage
  const pageSchema = generateStaticPageSchema({
    path: `/category/${slug}`,
    title: `${catName} Tools | Free SEO Utilities & Analyzers`,
    description: `Boost your rankings with our free ${catName} tools. Curated analyzers, generators, and utilities designed for modern SEO.`,
  }, baseUrl);

  // Override with CollectionPage schema for AEO/GEO optimization
  pageSchema['@type'] = 'CollectionPage';
  pageSchema.name = `${catName} Tools`;
  pageSchema.url = `${baseUrl}/category/${slug}`;
  pageSchema.lastmod = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  pageSchema.changefreq = 'weekly';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${catName} Tools`,
    url: `${baseUrl}/category/${slug}`,
    mainEntity: items.map((tool) => ({
      '@type': 'SoftwareApplication',
      name: tool.name,
      url: `${baseUrl}/tools/${tool.slug}`,
      applicationCategory: 'https://schema.org/WebApplication',
    })),
    // BreadcrumbList for AEO/GEO
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: 'Categories', item: `${baseUrl}/category` },
        { '@type': 'ListItem', position: 3, name: catName, item: `${baseUrl}/category/${slug}` },
      ],
    },
    // HasPart for blog integration (AEO: content related to category)
    hasPart: {
      '@type': 'ItemList',
      itemListElement: blogPosts.slice(0, 12).map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Article',
          headline: post.title,
          description: post.description,
          url: `${baseUrl}/blog/${post.slug}`,
        },
      })),
    },
    // Organization for GEO
    publisher: {
      '@type': 'Organization',
      name: '100 SEO Tools',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
  };

  return (
    <section id="main" className="py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/<\/script>/gi, '<\\/script>') }} />
      <nav aria-label="Breadcrumb" className="mb-5 text-sm">
        <ol className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400">
          <li>
            <Link href="/" className="inline-flex items-center gap-1 hover:text-violet-700 dark:hover:text-violet-200">
              <Home className="h-3.5 w-3.5" aria-hidden />Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="font-bold text-slate-900 dark:text-white">{catName}</li>
        </ol>
      </nav>

      <header className="relative left-1/2 mb-10 w-screen -translate-x-1/2 overflow-hidden bg-gradient-to-br from-[#0f0528] via-[#1a085e] to-[#050e3a] text-white">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-violet-100">
            <Layers className="h-4 w-4" aria-hidden />
            Browse by Workflow
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">SEO Tool Categories</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
            Pick the workflow you are working on now, then jump into focused tools for keywords, content, technical SEO, links, local search, AI, and more.
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => {
          const detail = getCategoryDetail(category);
          const Icon = detail.icon;
          const color = visualColors[detail.color] || visualColors.violet;
          const count = items.filter((tool) => tool.category && slugify(tool.category) === category).length || 0;

          return (
            <Link
              key={category}
              href={getCategoryHref(category)}
              className={`group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-gray-900 ${color.border}`}
              aria-label={`Open ${category} category with ${count} tool${count !== 1 ? 's' : ''}`}
            >
              <div className={`h-1.5 bg-gradient-to-r ${color.bar}`} />
              <div className="p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl ${color.icon}`}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-extrabold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                    {count} tools
                  </span>
                </div>
                <h2 className="text-base font-extrabold text-slate-950 transition group-hover:text-violet-700 dark:text-white dark:group-hover:text-violet-200">
                  {category}
                </h2>
                <p className="mt-2 min-h-[3.75rem] text-sm leading-6 text-slate-500 dark:text-slate-400">{detail.description}</p>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs font-extrabold text-slate-400 dark:border-white/10">
                Browse tools
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:text-violet-600" aria-hidden />
              </div>
            </Link>
          );
        })}
      </section>
      {slug && categoryIntro[slug] && (
        <div className="mb-8 space-y-3 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 text-sm leading-6 text-slate-700 shadow-sm dark:border-blue-500/20 dark:from-blue-500/10 dark:to-white/[0.03] dark:text-slate-300">
          <p>{categoryIntro[slug]}</p>
          {categoryToolLinks[slug] && (
            <div className="flex flex-wrap gap-2 pt-2">
              {categoryToolLinks[slug].map(({ href, label }) => (
                <Link key={href} href={href} className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700 hover:bg-violet-200 dark:bg-violet-500/20 dark:text-violet-300 dark:hover:bg-violet-500/30">→ {label}</Link>
              ))}
            </div>
          )}
        </div>
      )}
      {featuredTool && (
        <section className="mb-10">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-violet-600">Recommended First Step</p>
          <h2 className="mb-4 text-2xl font-extrabold text-slate-950 dark:text-white">Featured Tool</h2>
          <a
            href={`/tools/${featuredTool.slug}`}
            aria-label={`Open ${featuredTool.name.replace(/\s*\|.*/, '')}`}
            className={`group block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 dark:border-white/10 dark:bg-gray-900 dark:focus-visible:ring-violet-500/30 ${color.border}`}
          >
            <div className={`h-1.5 bg-gradient-to-r ${color.bar}`} />
            <div className="pointer-events-none p-6">
              <div className="mb-4 flex items-center gap-3"><span className={`grid h-12 w-12 place-items-center rounded-2xl ${color.icon}`}><Icon className="h-5 w-5" aria-hidden /></span><span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${color.badge}`}>Featured</span></div>
              <h3 className="mb-2 text-xl font-extrabold text-slate-950 transition group-hover:text-violet-700 dark:text-white dark:group-hover:text-violet-200">{featuredTool.name.replace(/\s*\|.*/, '')}</h3>
              <p className="mb-5 text-slate-600 dark:text-slate-300">{featuredTool.description}</p>
              <span className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-extrabold text-white transition group-hover:bg-violet-700 dark:bg-white dark:text-slate-950 dark:group-hover:bg-violet-200">Open Tool<ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden /></span>
            </div>
          </a>
        </section>
      )}
      <CategoryClient items={items} catName={catName} slug={slug} initialPage={searchParams?.page || 1} relatedPosts={blogPosts} />
      <section className="mb-10 mt-10">
        <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-violet-600">Quick Answers</p>
        <h2 className="mb-4 text-2xl font-extrabold text-slate-950 dark:text-white">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900"><summary className="cursor-pointer font-extrabold text-slate-950 dark:text-white">What are {catName} tools?</summary><p className="mt-2 text-slate-600 dark:text-slate-300">{catName} tools are free browser-based utilities that help SEO professionals and website owners with {detail.description.toLowerCase()} All tools run client-side with no signup required.</p></details>
          <details className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900"><summary className="cursor-pointer font-extrabold text-slate-950 dark:text-white">How can these tools help my SEO?</summary><p className="mt-2 text-slate-600 dark:text-slate-300">They help you analyze issues, find opportunities, and apply practical optimization steps faster — all from your browser with no installation, no data uploads, and instant results.</p></details>
        </div>
      </section>
      <section>
        <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-violet-600">Trusted Workflow</p>
        <h2 className="mb-4 text-2xl font-extrabold text-slate-950 dark:text-white">Trusted by SEOs Worldwide</h2>
        <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
          {[
            ['10,000+', 'Active Users', CheckCircle],
            ['500+', '5-Star Reviews', Star],
            ['1M+', 'Tools Run', Layers],
            ['99.9%', 'Uptime', CheckCircle],
          ].map(([value, label, StatIcon]) => (
            <div key={label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900"><StatIcon className="mx-auto mb-2 h-5 w-5 text-violet-600" aria-hidden /><p className="text-3xl font-extrabold text-slate-950 dark:text-white">{value}</p><p className="text-sm text-slate-600 dark:text-slate-300">{label}</p></div>
          ))}
        </div>
      </section>
    </section>
  );
}

export function generateStaticParams() {
  try {
    const tools = getAllToolsMeta();
    const cats = Array.from(new Set(tools.map((tool) => tool.category).filter(Boolean)));
    const slugs = cats.map((category) => slugify(category));
    const extra = categories.map((category) => slugify(category));
    return Array.from(new Set([...slugs, ...extra])).map((slug) => ({ slug }));
  } catch {
    return categories.map((category) => ({ slug: slugify(category) }));
  }
}