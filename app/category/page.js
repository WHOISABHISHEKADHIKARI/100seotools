'use client';
import Link from 'next/link';
import { getAllToolsMeta } from '../../tools';
import { getBaseUrl, siteName } from '../../lib/site';
import { useRouter } from 'next/navigation';

const baseUrl = getBaseUrl();

function slugify(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function CategoryIndexPage() {
  const router = useRouter();
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

  const handleCategoryClick = (category) => {
    router.push(`/category/${slugify(category)}`);
  };

  const handleKeyDown = (e, category) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCategoryClick(category);
    }
  };

  return (
    <main id="main" className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">All Categories</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-6">Pick a category to explore related SEO tools and guides.</p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <li
            key={c}
            className="rounded-lg border border-slate-200 dark:border-white/10 p-4 hover:border-brand-500 hover:shadow-md transition-all duration-200 cursor-pointer group"
            onClick={() => handleCategoryClick(c)}
            onKeyDown={(e) => handleKeyDown(e, c)}
            tabIndex={0}
            role="button"
            aria-label={`Open ${c} category with ${counts[c]} tool${counts[c] !== 1 ? 's' : ''}`}
          >
            <h2 className="font-semibold text-lg mb-2 group-hover:text-brand-600 transition-colors">
              {c}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
              {counts[c]} tool{counts[c] !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2 text-brand-600 text-sm font-medium group-hover:gap-3 transition-all">
              <span>Browse Tools</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
