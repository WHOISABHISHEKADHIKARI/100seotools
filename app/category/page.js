import Link from 'next/link';
import { getAllToolsMeta } from '../../tools';
import { getBaseUrl, siteName } from '../../lib/site';
import { slugify } from '../../lib/utils';

export const metadata = {
  title: 'Free SEO Tools by Category | Keyword Research, Audit & More',
  description: 'Explore our complete collection of free SEO tools organized by category. Find the right tools for keyword research, on-page SEO, technical analysis, content optimization, and link building.',
  keywords: ['seo tools list', 'seo tools by category', 'free seo tools', 'keyword research tools', 'on-page seo tools', 'technical seo tools', 'link building tools', 'content optimization tools', '100 seo tools'],
  alternates: {
    canonical: `${getBaseUrl()}/category`
  },
  openGraph: {
    title: 'Free SEO Tools by Category | 100 SEO Tools',
    description: 'Find the perfect free SEO tool for your needs. Browse categories including Keyword Research, Technical SEO, Content Optimization, and more.',
    url: `${getBaseUrl()}/category`,
    siteName: siteName,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.jpg', // Ensure this exists or use a generic one
        width: 1200,
        height: 630,
        alt: '100 SEO Tools Categories'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free SEO Tools by Category | 100 SEO Tools',
    description: 'Browse our organized collection of free SEO tools. Everything you need for better rankings.',
    creator: '@100seotools', // Update if you have a specific handle
    images: ['/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const baseUrl = getBaseUrl();

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
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">Browse Free SEO Tools by Category</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        Streamline your workflow with our organized collection of 100+ free SEO tools. Select a category below to find exactly what you need to rank higher.
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <li key={c}>
            <Link
              href={`/category/${slugify(c)}`}
              className="block h-full rounded-lg border border-slate-200 dark:border-white/10 p-4 hover:border-brand-500 hover:shadow-md transition-all duration-200 group"
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
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
