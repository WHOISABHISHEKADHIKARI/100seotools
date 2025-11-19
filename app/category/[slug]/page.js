import Link from 'next/link';
import { getAllBlogPosts } from '../../../lib/blog';
import { getAllToolsMeta } from '../../../tools';
import { notFound } from 'next/navigation';
import { getBaseUrl, siteName } from '../../../lib/site';
import CategoryClient from '../../../components/CategoryClient';

const baseUrl = getBaseUrl();

function slugify(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

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
  const catName = categories.find((c) => slugify(c) === slug) || slug;
  const items = tools.filter((t) => t.category && slugify(t.category) === slug);
  // Do not return 404; render category page even if no items to avoid unintended noindex
  const title = `${catName} Tools | ${siteName}`;
  const description = `Explore ${catName} tools to improve your SEO. Browse curated utilities, analyzers, and generators tailored to ${catName}.`;
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
      type: 'website'
    },
    twitter: {
      card: 'summary',
      title,
      description
    }
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const tools = getAllToolsMeta();
  const catName = categories.find((c) => slugify(c) === slug) || slug;
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
        { '@type': 'ListItem', position: 2, name: 'Categories', item: `${baseUrl}/` },
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
