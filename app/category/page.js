import Link from 'next/link';
import { FiArrowRight, FiHome, FiLayers } from 'react-icons/fi';
import { getAllToolsMeta } from '../../tools';
import { getBaseUrl } from '../../lib/site';
import { createSocialMetadata } from '../../lib/socialMetadata';
import { slugify } from '../../lib/utils';
import { categoryDetails, getCategoryDetail, getCategoryHref, visualColors } from '../../components/tools/SeoVisuals';

export const metadata = {
  title: 'Free SEO Tools by Category | Keyword Research, Audit & More',
  description: 'Explore our complete collection of free SEO tools organized by category. Find the right tools for keyword research, on-page SEO, technical analysis, content optimization, and link building.',
  keywords: ['seo tools list', 'seo tools by category', 'free seo tools', 'keyword research tools', 'on-page seo tools', 'technical seo tools', 'link building tools', 'content optimization tools', '100 seo tools'],
  alternates: { canonical: `${getBaseUrl()}/category` },
  ...createSocialMetadata({
    title: 'Free SEO Tools by Category | 100 SEO Tools',
    description: 'Browse our organized collection of free SEO tools. Everything you need for better rankings.',
    url: `${getBaseUrl()}/category`,
    imageAlt: '100 SEO Tools Categories',
  }),
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
  const counts = tools.reduce((acc, tool) => {
    if (tool.category) acc[tool.category] = (acc[tool.category] || 0) + 1;
    return acc;
  }, {});
  const categories = [
    ...categoryDetails.map((category) => category.label).filter((label) => counts[label]),
    ...Object.keys(counts).filter((label) => !categoryDetails.some((category) => category.label === label)).sort(),
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All Categories',
    url: `${baseUrl}/category`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: categories.map((category, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${baseUrl}/category/${slugify(category)}`,
        name: category,
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: 'Categories', item: `${baseUrl}/category` },
      ],
    },
  };

  return (
    <main id="main" className="py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="mb-5 text-sm">
        <ol className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400">
          <li>
            <Link href="/" className="inline-flex items-center gap-1 hover:text-violet-700 dark:hover:text-violet-200">
              <FiHome className="h-3.5 w-3.5" aria-hidden />
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="font-bold text-slate-900 dark:text-white">Categories</li>
        </ol>
      </nav>

      <header className="relative left-1/2 mb-12 w-screen -translate-x-1/2 overflow-hidden bg-gradient-to-br from-[#0f0528] via-[#1a085e] to-[#050e3a] text-white">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-violet-100">
            <FiLayers className="h-4 w-4" aria-hidden />
            Browse by Workflow
          </span>
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
          const count = counts[category] || 0;

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
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-extrabold text-slate-500 dark:bg-white/10 dark:text-slate-300">
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
                <FiArrowRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:text-violet-600" aria-hidden />
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
