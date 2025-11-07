import Link from 'next/link';
import { getAllToolsMeta } from '../../tools';
import { getBaseUrl, siteName } from '../../lib/site';

const baseUrl = getBaseUrl();

function slugify(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function generateMetadata() {
  const title = `All Categories | ${siteName}`;
  const description = 'Browse all SEO tool categories. Jump into keyword research, on-page optimization, technical SEO, and more.';
  const url = `${baseUrl}/category`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName, type: 'website' },
    twitter: { card: 'summary', title, description }
  };
}

export default function CategoryIndexPage() {
  const tools = getAllToolsMeta();
  const categories = Array.from(new Set(tools.map((t) => t.category).filter(Boolean)));
  const counts = categories.reduce((acc, c) => {
    acc[c] = tools.filter((t) => t.category === c).length;
    return acc;
  }, {});

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All Categories',
    url: `${baseUrl}/category`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: categories.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${baseUrl}/category/${slugify(c)}`,
        name: c
      }))
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: 'Categories', item: `${baseUrl}/category` }
      ]
    }
  };

  return (
    <main id="main" className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">All Categories</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-6">Pick a category to explore related SEO tools and guides.</p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <li key={c} className="rounded-lg border border-slate-200 dark:border-white/10 p-4 relative">
            {/* Full-card click target: open category */}
            <a href={`/category/${slugify(c)}`} aria-label={`Open category: ${c}`} className="absolute inset-0 z-10">
              <span className="sr-only">Open category: {c}</span>
            </a>
            <h2 className="font-semibold text-lg mb-2 relative z-20">
              <Link href={`/category/${slugify(c)}`} prefetch={false} className="hover:text-brand-600">{c}</Link>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 relative z-20">{counts[c]} tool{counts[c] !== 1 ? 's' : ''}</p>
            <div className="flex items-center gap-3 relative z-20">
              <Link href={`/category/${slugify(c)}`} prefetch={false} className="text-brand-600 hover:underline">Browse Tools</Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}