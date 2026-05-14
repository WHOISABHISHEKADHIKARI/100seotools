import Link from 'next/link';
import { FiArrowRight, FiHome, FiLayers, FiUsers } from 'react-icons/fi';
import { getAllToolsMeta } from '../../tools';
import { getBaseUrl, siteName } from '../../lib/site';
import { createSocialMetadata } from '../../lib/socialMetadata';
import StructuredData from '../../components/ui/StructuredData';
import {
  categoryDetails,
  getCategoryDetail,
  getCategoryHref,
  getMonthlyUse,
  shortToolName,
  visualColors,
} from '../../components/tools/SeoVisuals';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'All SEO Tools - Free Online SEO Toolkit | 100 SEO Tools',
  description: 'Browse all 100+ free SEO tools for keyword research, on-page optimization, technical SEO, content analysis, and performance tracking. No signup required.',
  alternates: { canonical: `${baseUrl}/tools` },
  ...createSocialMetadata({
    title: 'All SEO Tools - Free Online SEO Toolkit',
    description: 'Browse all 100+ free SEO tools. No signup required, instant results.',
    url: `${baseUrl}/tools`,
    imageAlt: '100 SEO Tools complete toolkit',
  }),
};

export default function ToolsIndexPage() {
  const allTools = getAllToolsMeta();
  const grouped = allTools.reduce((acc, tool) => {
    const category = tool.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(tool);
    return acc;
  }, {});

  const orderedCategories = [
    ...categoryDetails.map((category) => category.label).filter((category) => grouped[category]),
    ...Object.keys(grouped).filter((category) => !categoryDetails.some((item) => item.label === category)).sort(),
  ];

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${baseUrl}/tools` },
    ],
  };

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All SEO Tools',
    description: 'Complete collection of 100+ free SEO tools',
    url: `${baseUrl}/tools`,
    numberOfItems: allTools.length,
    provider: { '@type': 'Organization', name: siteName, url: baseUrl },
  };

  return (
    <main id="main" className="py-8">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm">
        <ol className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400">
          <li>
            <Link href="/" className="inline-flex items-center gap-1 hover:text-violet-700 dark:hover:text-violet-200">
              <FiHome className="h-3.5 w-3.5" aria-hidden />
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="font-bold text-slate-900 dark:text-white">Tools</li>
        </ol>
      </nav>

      <header className="relative left-1/2 mb-12 w-screen -translate-x-1/2 overflow-hidden bg-gradient-to-br from-[#0f0528] via-[#1a085e] to-[#050e3a] text-white">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-violet-100">
            <FiLayers className="h-4 w-4" aria-hidden />
            Complete Toolkit
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">All Free SEO Tools</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/65 md:text-lg">
            Browse {allTools.length} free SEO tools grouped by workflow. No signup, no paywalls, fast browser-based utilities for everyday optimization work.
          </p>
          <div className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-3">
            {[
              [allTools.length, 'Tools'],
              [orderedCategories.length, 'Categories'],
              ['0', 'Signup'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4">
                <div className="text-2xl font-extrabold">{value}</div>
                <div className="text-xs text-white/50">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="space-y-12">
        {orderedCategories.map((category) => {
          const items = grouped[category] || [];
          const detail = getCategoryDetail(category);
          const Icon = detail.icon;
          const color = visualColors[detail.color] || visualColors.violet;

          return (
            <section key={category} aria-labelledby={`cat-${category.replace(/\s+/g, '-').toLowerCase()}`}>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl ${color.icon}`}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h2 id={`cat-${category.replace(/\s+/g, '-').toLowerCase()}`} className="text-2xl font-extrabold text-slate-950 dark:text-white">
                      {category}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{items.length} tools · {detail.description}</p>
                  </div>
                </div>
                <Link href={getCategoryHref(category)} className="inline-flex items-center gap-2 text-sm font-extrabold text-violet-700 hover:underline dark:text-violet-300">
                  View category
                  <FiArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item, index) => (
                  <Link
                    key={`tool-${item.slug}`}
                    href={`/tools/${item.slug}`}
                    prefetch={false}
                    className={`group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-gray-900 ${color.border}`}
                  >
                    <div className={`h-1 bg-gradient-to-r ${color.bar}`} />
                    <div className="p-5">
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${color.icon} text-base font-extrabold`}>
                          {shortToolName(item.name).charAt(0)}
                        </span>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${color.badge}`}>Free</span>
                      </div>
                      <h3 className="line-clamp-2 text-base font-extrabold leading-snug text-slate-900 group-hover:text-violet-700 dark:text-white dark:group-hover:text-violet-200">
                        {shortToolName(item.name)}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.description}</p>
                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs dark:border-white/10">
                        <span className="inline-flex items-center gap-1.5 text-slate-400">
                          <FiUsers className="h-3.5 w-3.5" aria-hidden />
                          {getMonthlyUse(index)}/mo
                        </span>
                        <span className="inline-flex items-center gap-1 font-extrabold text-violet-700 dark:text-violet-300">
                          Open Tool
                          <FiArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" aria-hidden />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <StructuredData data={breadcrumbLd} />
      <StructuredData data={collectionLd} />
    </main>
  );
}
