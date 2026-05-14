import Link from 'next/link';
import { FiArrowRight, FiCheckCircle, FiHome, FiLayers, FiStar } from 'react-icons/fi';
import { getAllBlogPosts } from '../../../lib/blog';
import { getAllToolsMeta } from '../../../tools';
import CategoryClient from '../../../components/tools/CategoryClient';
import { slugify } from '../../../lib/utils';
import { getBaseUrl } from '../../../lib/site';
import { createSocialMetadata } from '../../../lib/socialMetadata';
import { getCategoryDetail, visualColors } from '../../../components/tools/SeoVisuals';

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

export const dynamic = 'force-static';
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const catName = categories.find((category) => slugify(category) === slug) ||
    slug.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const title = `${catName} Tools | Free SEO Utilities & Analyzers`;
  const description = `Boost your rankings with our free ${catName} tools. Curated analyzers, generators, and utilities designed for modern SEO.`;
  const url = `${getBaseUrl()}/category/${slug}`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: url },
    ...createSocialMetadata({
      title,
      description,
      url,
      imageAlt: `${catName} SEO Tools`,
    }),
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const tools = getAllToolsMeta();
  const catFallback = slug.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const catName = categories.find((category) => slugify(category) === slug) || catFallback;
  const items = tools.filter((tool) => tool.category && slugify(tool.category) === slug);
  const featuredTool = items[0] || null;
  const allPosts = getAllBlogPosts();
  const blogPosts = allPosts.filter((post) => {
    const matchesCategory = post.category && slugify(post.category) === slug;
    const matchesTag = Array.isArray(post.tags) && post.tags.some((tag) => slugify(tag) === slug);
    return matchesCategory || matchesTag;
  });

  const detail = getCategoryDetail(catName);
  const Icon = detail.icon;
  const color = visualColors[detail.color] || visualColors.violet;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${catName} Tools`,
    url: `${baseUrl}/category/${slug}`,
    mainEntity: items.map((tool) => ({
      '@type': 'SoftwareApplication',
      name: tool.name,
      url: `${baseUrl}/tools/${tool.slug}`,
      applicationCategory: 'SEO Tool',
    })),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: 'Categories', item: `${baseUrl}/category` },
        { '@type': 'ListItem', position: 3, name: catName, item: `${baseUrl}/category/${slug}` },
      ],
    },
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
  };

  return (
    <main id="main" className="py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="mb-5 text-sm">
        <ol className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400">
          <li><Link href="/" className="inline-flex items-center gap-1 hover:text-violet-700 dark:hover:text-violet-200"><FiHome className="h-3.5 w-3.5" aria-hidden />Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/category" className="hover:text-violet-700 dark:hover:text-violet-200">Categories</Link></li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="font-bold text-slate-900 dark:text-white">{catName}</li>
        </ol>
      </nav>
      <header className="relative left-1/2 mb-10 w-screen -translate-x-1/2 overflow-hidden bg-gradient-to-br from-[#0f0528] via-[#1a085e] to-[#050e3a] text-white">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-violet-100"><Icon className="h-4 w-4" aria-hidden />{items.length} free tools</span>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">{catName} Tools</h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/65 md:text-lg">{detail.description} Open any tool to run it in your browser with no signup required.</p>
            {featuredTool && (
              <a href={`/tools/${featuredTool.slug}`} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-violet-700 shadow-xl shadow-black/20 transition hover:scale-[1.01] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40">
                Start with {featuredTool.name.replace(/\s*\|.*/, '')}
                <FiArrowRight className="h-4 w-4" aria-hidden />
              </a>
            )}
          </div>
        </div>
      </header>
      {slug === 'keyword-research' && (
        <div className="mb-8 space-y-3 rounded-2xl border border-slate-100 bg-white p-5 text-sm leading-6 text-slate-700 shadow-sm dark:border-white/10 dark:bg-gray-900 dark:text-slate-300">
          <p>Strengthen topical coverage with themed clusters and intent mapping. Explore the <Link href="/tools/keyword-clustering-tool" className="font-bold text-violet-700 hover:underline dark:text-violet-300">keyword clustering tool</Link> and use the <Link href="/tools/keyword-intent-identifier" className="font-bold text-violet-700 hover:underline dark:text-violet-300">keyword intent identifier</Link>.</p>
          <p>Generate ideas fast with the <Link href="/tools/keyword-suggestion-tool" className="font-bold text-violet-700 hover:underline dark:text-violet-300">keyword suggestion tool</Link> and use those terms to seed clusters and plan internal links.</p>
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
              <span className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-extrabold text-white transition group-hover:bg-violet-700 dark:bg-white dark:text-slate-950 dark:group-hover:bg-violet-200">Open Tool<FiArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden /></span>
            </div>
          </a>
        </section>
      )}
      <CategoryClient items={items} catName={catName} slug={slug} initialPage={searchParams?.page || 1} relatedPosts={blogPosts} />
      <section className="mb-10 mt-10">
        <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-violet-600">Quick Answers</p>
        <h2 className="mb-4 text-2xl font-extrabold text-slate-950 dark:text-white">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900"><summary className="cursor-pointer font-extrabold text-slate-950 dark:text-white">What are {catName} tools?</summary><p className="mt-2 text-slate-600 dark:text-slate-300">{catName} tools are free utilities designed to help with a specific SEO workflow.</p></details>
          <details className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900"><summary className="cursor-pointer font-extrabold text-slate-950 dark:text-white">How can these tools help my SEO?</summary><p className="mt-2 text-slate-600 dark:text-slate-300">They help you analyze issues, find opportunities, and apply practical optimization steps faster.</p></details>
        </div>
      </section>
      <section>
        <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-violet-600">Trusted Workflow</p>
        <h2 className="mb-4 text-2xl font-extrabold text-slate-950 dark:text-white">Trusted by SEOs Worldwide</h2>
        <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
          {[
            ['10,000+', 'Active Users', FiCheckCircle],
            ['500+', '5-Star Reviews', FiStar],
            ['1M+', 'Tools Run', FiLayers],
            ['99.9%', 'Uptime', FiCheckCircle],
          ].map(([value, label, StatIcon]) => (
            <div key={label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900"><StatIcon className="mx-auto mb-2 h-5 w-5 text-violet-600" aria-hidden /><p className="text-3xl font-extrabold text-slate-950 dark:text-white">{value}</p><p className="text-sm text-slate-600 dark:text-slate-300">{label}</p></div>
          ))}
        </div>
      </section>
    </main>
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
