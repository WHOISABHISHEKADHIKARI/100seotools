import Link from 'next/link';
import { getAllBlogPosts } from '../../../lib/blog';
import { getAllToolsMeta } from '../../../tools';
import { notFound } from 'next/navigation';
import { getBaseUrl, siteName } from '../../../lib/site';
import CategoryClient from '../../../components/tools/CategoryClient';
import { slugify } from '../../../lib/utils';

const baseUrl = getBaseUrl();

const categories = [
  'Keyword Research',
  'On-Page Optimization',
  'Technical SEO',
  'Backlink & Link-Building',
  'Backlink & Link Building',
  'Content SEO',
  'Content Optimization',
  'Content Creation',
  'SEO Tools',
  'Image Tools',
  'SEO Performance',
  'Local SEO',
  'Competitor Analysis',
  'AI-Powered SEO',
  'SEO Utility'
];

// Prefer static generation to stabilize RSC fetch behavior
export const dynamic = 'force-static';
export const dynamicParams = true;


export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tools = getAllToolsMeta();
  // Ensure catName handles cases where slug might be just 'translation-tools' but we want 'Translation Tools'
  // If no matching category found in known list, format the slug nicely
  const catName = categories.find((c) => slugify(c) === slug) ||
    slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const items = tools.filter((t) => t.category && slugify(t.category) === slug);

  const title = `${catName} Tools | Free SEO Utilities & Analyzers`;
  const description = `Boost your rankings with our free ${catName} tools. curated collection of analyzers, generators, and utilities designed for modern SEO.`;
  const url = `${getBaseUrl()}/category/${slug}`;

  return {
    title,
    description,
    robots: { index: true, follow: true },
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: 'website',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${catName} SEO Tools`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.jpg']
    }
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const tools = getAllToolsMeta();
  // Ensure catName handles cases where slug might be just 'translation-tools' but we want 'Translation Tools'
  // If no matching category found in known list, format the slug nicely
  const catFallback = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const catName = categories.find((c) => slugify(c) === slug) || catFallback;

  const items = tools.filter((t) => t.category && slugify(t.category) === slug);
  const featuredTool = items.length > 0 ? items[0] : null;
  // Filter blog posts by category or tags matching this slug
  const allPosts = getAllBlogPosts();
  const blogPosts = allPosts.filter((p) => {
    const matchesCategory = p.category && slugify(p.category) === slug;
    const matchesTag = Array.isArray(p.tags) && p.tags.some((t) => slugify(t) === slug);
    return matchesCategory || matchesTag;
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${catName} Tools`,
    url: `${baseUrl}/category/${slug}`,
    mainEntity: items.map((t) => ({
      '@type': 'SoftwareApplication',
      name: t.name,
      url: `${baseUrl}/tools/${t.slug}`,
      applicationCategory: 'SEO Tool'
    })),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: 'Categories', item: `${baseUrl}/category` },
        { '@type': 'ListItem', position: 3, name: catName, item: `${baseUrl}/category/${slug}` }
      ]
    },
    hasPart: {
      '@type': 'ItemList',
      itemListElement: blogPosts.slice(0, 12).map((p, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Article',
          headline: p.title,
          description: p.description,
          url: `${baseUrl}/blog/${p.slug}`
        }
      }))
    }
  };

  return (
    <main id="main" className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">{catName} Tools</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        Browse curated tools related to {catName}. Click a tool to open its page and run it in your browser.
      </p>
      {slug === 'on-page-optimization' && (
        <div className="mb-6 text-sm text-slate-700 dark:text-slate-300">
          <p>
            Run quick checks to improve clarity and CTR. Use the{' '}
            <Link href="/tools/on-page-seo-audit-checker" className="text-brand-600 hover:underline">on‑page SEO audit checker</Link>{' '}and read the{' '}
            <Link href="/blog/on-page-seo-audit-checker-how-to-use" className="text-brand-600 hover:underline">pillar how‑to guide</Link>{' '}plus the{' '}
            <Link href="/blog/on-page-seo-audit-checker-features-benefits-keywords" className="text-brand-600 hover:underline">features and benefits overview</Link>.
          </p>
        </div>
      )}
      {slug === 'keyword-research' && (
        <div className="mb-6 text-sm text-slate-700 dark:text-slate-300">
          <p>
            Strengthen topical coverage with themed clusters and intent mapping. Explore the{' '}
            <Link href="/tools/keyword-clustering-tool" className="text-brand-600 hover:underline">best free keyword clustering tool</Link>{' '}to group queries, compare coverage with{' '}
            <Link href="/tools/competitor-keyword-overlap-checker" className="text-brand-600 hover:underline">AI keyword clustering benchmarks</Link>{' '}and use{' '}
            <Link href="/tools/keyword-intent-identifier" className="text-brand-600 hover:underline">semantic keyword grouping tool</Link>{' '}to label intent.
          </p>
          <p>
            Generate ideas fast with the{' '}
            <Link href="/tools/keyword-suggestion-tool" className="text-brand-600 hover:underline">keyword suggest tool</Link>{' '}and the{' '}
            <Link href="/blog/keyword-suggestion-tool" className="text-brand-600 hover:underline">keyword ideas guide</Link>. Use these to seed clusters and plan internal links.
          </p>
        </div>
      )}
      <>
        {/* Featured Tool */}
        {featuredTool && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Featured Tool</h2>
            <div className="rounded-lg border border-slate-200 dark:border-white/10 p-6 hover:shadow-md transition">
              <h3 className="font-semibold text-xl mb-2">
                <Link href={`/tools/${featuredTool.slug}`} prefetch={false} className="hover:text-brand-600">{featuredTool.name}</Link>
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">{featuredTool.description}</p>
              <Link href={`/tools/${featuredTool.slug}`} prefetch={false} className="text-brand-600 hover:underline">Open Tool</Link>
            </div>
          </div>
        )}

        {/* Client-side filtering, search, and pagination for tools and articles */}
        <CategoryClient items={items} catName={catName} slug={slug} initialPage={searchParams?.page || 1} relatedPosts={blogPosts} />

        {/* FAQ Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="p-4 rounded-lg border border-slate-200 dark:border-white/10">
              <summary className="font-semibold cursor-pointer">What are {catName} tools?</summary>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {catName} tools are a collection of utilities designed to help you with various aspects of search engine optimization.
              </p>
            </details>
            <details className="p-4 rounded-lg border border-slate-200 dark:border-white/10">
              <summary className="font-semibold cursor-pointer">How can these tools help my SEO?</summary>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                By using these tools, you can analyze your website, find opportunities for improvement, and implement best practices to improve your search engine rankings.
              </p>
            </details>
          </div>
        </div>

        {/* Social Proof */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Trusted by SEOs Worldwide</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4">
              <p className="text-3xl font-bold">10,000+</p>
              <p className="text-slate-600 dark:text-slate-300">Active Users</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold">500+</p>
              <p className="text-slate-600 dark:text-slate-300">5-Star Reviews</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold">1M+</p>
              <p className="text-slate-600 dark:text-slate-300">Tools Run</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold">99.9%</p>
              <p className="text-slate-600 dark:text-slate-300">Uptime</p>
            </div>
          </div>
        </div>
      </>
    </main>
  );
}

// Generate static params from tool categories to avoid runtime misses
export function generateStaticParams() {
  try {
    const tools = getAllToolsMeta();
    const cats = Array.from(new Set(tools.map((t) => t.category).filter(Boolean)));
    const slugs = cats.map((c) => slugify(c));
    const extra = categories.map((c) => slugify(c));
    const unique = Array.from(new Set([...slugs, ...extra]));
    return unique.map((slug) => ({ slug }));
  } catch {
    return categories.map((c) => ({ slug: slugify(c) }));
  }
}
