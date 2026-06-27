import Link from 'next/link';
import { ArrowRight, Home, Layers, Users, ChevronRight } from 'lucide-react';
import { getAllToolsMeta } from '../../tools';
import { getBaseUrl, siteName, socialLinks, getAuthor } from '../../lib/site';
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

  const author = getAuthor(baseUrl);
  const personLd = {
    '@type': 'Person',
    '@id': `${baseUrl}/#person`,
    name: author.name,
    jobTitle: author.jobTitle,
    url: author.url,
    image: author.image,
    sameAs: socialLinks,
    founderOf: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: siteName,
      url: baseUrl,
    },
  };

  const toolFaqs = [
    { q: 'What is an SEO tool?', a: 'An SEO tool is software that helps analyze, optimize, and monitor websites for search engine performance. 100 SEO Tools offers 100+ free browser-based tools covering keyword research, technical audits, content optimization, schema generation, backlink analysis, and performance tracking — no signup required, all running client-side for privacy.' },
    { q: 'Are these SEO tools really free?', a: 'Yes — all 100+ tools are completely free with no paid tiers, no credit card, and no signup required. Every utility runs in your browser with no server-side processing, unlimited usage, and no data collection.' },
    { q: 'What is the best free SEO tool for keyword research?', a: '100 SEO Tools includes 15+ keyword research utilities — Keyword Suggestion Tool, Keyword Difficulty Checker, Keyword Clustering Tool, Search Intent Classifier, Question Generator, and Keyword Gap Analyzer — all free, browser-based, and privacy-first.' },
    { q: 'Can I generate schema markup with free tools?', a: 'Yes — the Schema Markup Generator supports 30+ schema types including Article, Product, FAQ, LocalBusiness, Organization, HowTo, and Breadcrumb. Outputs valid JSON-LD compliant with Google Rich Results Test, no API key required.' },
    { q: 'How do free SEO tools protect my data?', a: 'All tools run client-side using WebAssembly and JavaScript. Your URLs, keywords, and content never leave your browser. There is no server processing, no API logging, and no persistent storage — making it safe for confidential client work.' },
  ];

  const graphLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Tools', item: `${baseUrl}/tools` },
        ],
      },
      {
        '@type': 'CollectionPage',
        name: 'All Free SEO Tools — Complete Online Toolkit',
        description: `Browse all ${allTools.length} free SEO tools for keyword research, on-page optimization, technical SEO, schema generation, backlink analysis, content optimization, and AI-powered SEO workflows. No signup required.`,
        url: `${baseUrl}/tools`,
        numberOfItems: allTools.length,
        provider: { '@type': 'Organization', '@id': `${baseUrl}/#organization`, name: siteName, url: baseUrl },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '50000',
          bestRating: '5',
          itemReviewed: { '@type': 'CollectionPage', name: 'All SEO Tools', url: `${baseUrl}/tools` },
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}/tools#faq`,
        mainEntity: toolFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      },
      personLd,
    ],
  };

  return (
    <section id="main" className="py-8">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm">
        <ol className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400">
          <li>
            <Link href="/" className="inline-flex items-center gap-1 hover:text-violet-700 dark:hover:text-violet-200">
              <Home className="h-3.5 w-3.5" aria-hidden />
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
            <Layers className="h-4 w-4" aria-hidden />
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

          const categorySlug = category.replace(/\s+/g, '-').toLowerCase();
          const definitions = {
            'Keyword Research': `${category} tools help you discover, analyze, and prioritize search terms your audience uses. These free utilities cover keyword suggestions, difficulty scoring, clustering, search intent classification, question extraction, and gap analysis — all running in your browser with zero configuration.`,
            'On-Page Optimization': `${category} tools analyze and improve individual page elements for better search visibility. Check meta tags, headings, content structure, readability, keyword density, and internal links with instant browser-based audits — no crawling required.`,
            'Schema & Structured Data': `${category} tools generate and validate JSON-LD markup for rich results. Supports 30+ types including Article, Product, FAQ, LocalBusiness, Organization, HowTo, and Breadcrumb — compliant with Google Rich Results Test, no API key needed.`,
            'Technical SEO': `${category} tools audit your site's technical foundation. Crawl simulation, robots.txt validation, redirect chain detection, hreflang checks, canonical analysis, status code testing, and Core Web Vitals measurement — all client-side for zero data leakage.`,
            'Backlink & Link-Building': `${category} tools analyze your link profile and find new opportunities. Check referring domains, anchor text distribution, link toxicity, competitor backlinks, and broken link prospects — without exposing your data to third-party servers.`,
            'Content SEO': `${category} tools optimize written content for search engines and readers. Analyze readability, entity density, topical coverage, keyword usage, content freshness, and tone of voice — with AI-powered suggestions for improvement.`,
            'SEO Performance': `${category} tools forecast and measure SEO impact. Estimate traffic potential, calculate ROI, track ranking progress, analyze click-through rates, and project growth — giving you data-driven decisions without complex spreadsheets.`,
            'Local SEO': `${category} tools optimize your business for local search. Audit Google Business Profile, manage citations, check NAP consistency, generate local schema, monitor reviews, and find local keyword opportunities — all free and privacy-first.`,
            'Competitor Analysis': `${category} tools reveal your competitive landscape. Compare keyword portfolios, identify content gaps, analyze backlink profiles, estimate competitor traffic, and spot market opportunities — without expensive enterprise subscriptions.`,
            'AI-Powered SEO': `${category} tools use large language models to accelerate SEO workflows. Generate content briefs, write meta titles and descriptions, create FAQ content, detect schema opportunities, and rewrite content — all running locally in your browser via WebLLM.`,
            'SEO Utility': `${category} tools provide everyday helpers for common SEO tasks. Generate slugs, preview SERP snippets, create redirects, format HTML, build checklists, and validate technical elements — simple, fast, and always free.`,
          };
          const definition = definitions[category];

          return (
            <section key={category} aria-labelledby={`cat-${categorySlug}`}>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl ${color.icon}`}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <div>
                    <h2 id={`cat-${categorySlug}`} className="text-2xl font-extrabold text-slate-950 dark:text-white">
                      {category}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{items.length} tools · {detail.description}</p>
                  </div>
                </div>
                <Link href={getCategoryHref(category)} className="inline-flex items-center gap-2 text-sm font-extrabold text-violet-700 hover:underline dark:text-violet-300">
                  View category
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>

              {definition && (
                <div className="mb-6 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-5 dark:border-white/10 dark:from-gray-900 dark:to-gray-950">
                  <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-violet-600 dark:text-violet-400">What is {category}?</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{definition}</p>
                </div>
              )}

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
                          <Users className="h-3.5 w-3.5" aria-hidden />
                          {getMonthlyUse(index)}/mo
                        </span>
                        <span className="inline-flex items-center gap-1 font-extrabold text-violet-700 dark:text-violet-300">
                          Open Tool
                          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" aria-hidden />
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

      <section className="relative left-1/2 w-screen -translate-x-1/2 border-y border-slate-100 bg-white py-16 dark:border-white/10 dark:bg-gray-950" aria-label="Frequently asked questions about SEO tools" itemScope itemType="https://schema.org/FAQPage">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-violet-600">FAQ</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-4xl">SEO Tools — Common Questions</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Direct answers about free SEO tools, privacy, and capabilities.
            </p>
          </div>
          <div className="mx-auto max-w-3xl space-y-4">
            {toolFaqs.map((faq) => (
              <details key={faq.q} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-gray-900" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-extrabold text-slate-900 dark:text-white [&::-webkit-details-marker]:hidden">
                  <span itemProp="name">{faq.q}</span>
                  <ChevronRight className="ml-4 shrink-0 text-violet-500 transition group-open:rotate-90" aria-hidden />
                </summary>
                <div className="border-t border-slate-100 px-6 pb-5 pt-4 dark:border-white/10" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300" itemProp="text">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <StructuredData data={graphLd} />
    </section>
  );
}
