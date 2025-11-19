import Link from 'next/link';
import { getBaseUrl, siteName } from '../../../lib/site';

import ShareActions from '../../../components/ShareActions';
import StructuredData from '../../../components/StructuredData';
import GeneratedConfigSection from '../../../components/GeneratedConfigSection';
import { generateArticleSchema, generateFAQSchema } from '../../../lib/schema';
import { getToolBySlug, getAllToolsMeta } from '../../../tools';
import { notFound } from 'next/navigation';
import { getToolGuide } from '../../../lib/guides';
import { getAllBlogPosts } from '../../../lib/blog';
import { getBlogPostPublishedBySlug } from '../../../lib/blog-data';
import { slugify } from '../../../lib/utils';


// Ensure static generation for better performance and crawl stability
export const dynamic = 'force-static';
export const dynamicParams = true;


export function generateStaticParams() {
  const posts = getAllBlogPosts();
  const tools = getAllToolsMeta();
  const postParams = posts.map((p) => ({ slug: p.slug }));
  const toolParams = tools.map((t) => ({ slug: t.slug }));
  return [...postParams, ...toolParams];
}

export async function generateMetadata({ params }) {
  // Next.js 16: params may be a Promise. Await to safely access slug.
  const { slug } = await params;
  const baseUrl = getBaseUrl();
  const post = await getBlogPostPublishedBySlug(slug);
  const tool = getToolBySlug(slug);

  if (post) {
    const shareUrl = `${baseUrl}/blog/${post.slug}`;
    const title = `${post.title} | ${siteName}`;
    const description = post.description;
    const url = `${baseUrl}/blog/${post.slug}`;
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
        type: 'article',
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: siteName }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/twitter-image.png'],
      }
    };
  }
  if (tool) {
    const title = `How to Use ${tool.name} – Guide | ${siteName}`;
    const description = `Step-by-step guide to using the ${tool.name} for ${tool.category}. Learn purpose, usage, outputs, and benefits.`;
    const url = `${baseUrl}/blog/${tool.slug}`;
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
        type: 'article',
        images: [{ url: '/og-image.png', width: 1200, height: 630, alt: siteName }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['/twitter-image.png'],
      }
    };
  }
  // No post or tool guide found → set proper 404
  notFound();
}

export default async function BlogGuidePage({ params, searchParams }) {
  // Unwrap params if it's a Promise (Next.js 16 typed routes)
  const { slug } = await params;
  const post = await getBlogPostPublishedBySlug(slug);
  const baseUrl = getBaseUrl();
  const allTools = getAllToolsMeta();
  const allPosts = getAllBlogPosts();

  if (post) {
    const jsonLd = generateArticleSchema(post, baseUrl);
    const breadcrumbLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: `${baseUrl}/blog/${post.slug}` }
      ]
    };
    const faqItems = Array.isArray(post.sections?.faq)
      ? post.sections.faq.map((f) => ({ question: f.question || f.q, answer: f.answer || f.a }))
      : [];
    const faqJsonLd = faqItems.length ? generateFAQSchema(faqItems) : null;
    const shareUrl = `${baseUrl}/blog/${post.slug}`;

    return (
      <main id="main" className="container mx-auto px-4 py-8">
        <StructuredData data={jsonLd} />
        <StructuredData data={breadcrumbLd} />
        {faqJsonLd ? <StructuredData data={faqJsonLd} /> : null}

        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{post.title}</h1>
        <div className="text-sm text-slate-600 dark:text-slate-300 mb-4 flex flex-wrap items-center gap-3">
          <span>Category: {post.category}</span>
          {post.readTimeMinutes ? <span>• {post.readTimeMinutes} min read</span> : null}
          {post.datePublished ? <time dateTime={post.datePublished}>• {new Date(post.datePublished).toLocaleDateString()}</time> : null}
        </div>
        <div className="mb-6"><ShareActions url={shareUrl} title={post.title} /></div>
        {post.tags?.length ? (
          <div className="mb-6 flex flex-wrap gap-2">
            {post.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 rounded bg-slate-100 dark:bg-white/10 text-xs text-slate-700 dark:text-slate-200">{tag}</span>
            ))}
          </div>
        ) : null}



        {/* Enhanced, visually-scannable content with quick links, callouts, and tool cards */}
        <article className="prose prose-slate dark:prose-invert max-w-3xl leading-relaxed mb-10 space-y-6">
          {post.description ? <p>{post.description}</p> : null}
          {post.sections?.intro ? <p>{post.sections.intro}</p> : null}

          {/* Quick Links */}
          <nav aria-label="Quick links" className="not-prose mb-6">
            <ul className="flex flex-wrap gap-3 text-sm">
              <li><a href="#what" className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition">What</a></li>
              <li><a href="#why" className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition">Why</a></li>
              <li><a href="#how" className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition">How</a></li>
              <li><a href="#to-whom" className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition">To Whom</a></li>
              {Array.isArray(post.sections?.possibleUses) && post.sections.possibleUses.length ? (
                <li><a href="#uses" className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition">Uses</a></li>
              ) : null}
              {Array.isArray(post.sections?.whoBenefits) && post.sections.whoBenefits.length ? (
                <li><a href="#who-benefits" className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition">Who Benefits</a></li>
              ) : null}
              {Array.isArray(post.sections?.reasonsToUse) && post.sections.reasonsToUse.length ? (
                <li><a href="#reasons" className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition">Reasons</a></li>
              ) : null}
              {Array.isArray(post.sections?.seoBenefits) && post.sections.seoBenefits.length ? (
                <li><a href="#seo-benefits" className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition">SEO Benefits</a></li>
              ) : null}
              {Array.isArray(post.sections?.opportunities) && post.sections.opportunities.length ? (
                <li><a href="#opportunities" className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition">Opportunities</a></li>
              ) : null}
              {Array.isArray(post.sections?.competition) && post.sections.competition.length ? (
                <li><a href="#competition" className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition">Competition</a></li>
              ) : null}
              {Array.isArray(post.sections?.costConsiderations) && post.sections.costConsiderations.length ? (
                <li><a href="#cost" className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition">Cost</a></li>
              ) : null}
              {Array.isArray(post.sections?.integrations) && post.sections.integrations.length ? (
                <li><a href="#integrations" className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition">Integrations</a></li>
              ) : null}
              {Array.isArray(post.sections?.relevantKeywords) && post.sections.relevantKeywords.length ? (
                <li><a href="#keywords" className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition">Keywords</a></li>
              ) : null}
              {Array.isArray(post.sections?.faq) && post.sections.faq.length ? (
                <li><a href="#faq" className="px-3 py-1.5 rounded-md bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition">FAQ</a></li>
              ) : null}
            </ul>
          </nav>

          {post.sections?.what ? (
            <section id="what" className="not-prose rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-5 mb-6">
              <h2 className="text-xl font-semibold mb-2">🔍 What</h2>
              <p className="text-base"><strong>SEO basics</strong>: {post.sections.what}</p>
            </section>
          ) : null}

          {post.sections?.why ? (
            <section id="why" className="not-prose rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-5 mb-6">
              <h2 className="text-xl font-semibold mb-2">🎯 Why</h2>
              <p className="text-base">{post.sections.why}</p>
              {/* Pro Tip callout */}
              <div role="note" className="mt-3 rounded bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-4 text-base">
                <span className="font-semibold">💡 Pro tip:</span> Write concise titles and meta descriptions; keep pages fast and accessible.
              </div>
            </section>
          ) : null}

          {/* Generated Config section (if present for this post) */}
          {post.sections?.generatedConfig ? (
            <GeneratedConfigSection title="Generated Config" config={post.sections.generatedConfig} language="json" />
          ) : null}

          {post.sections?.how?.length ? (
            <section id="how" className="not-prose">
              <h2 className="text-xl font-semibold mb-2">⚙️ How</h2>
              <ul className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                {post.sections.how.map((h, i) => (
                  <li key={i} className="rounded-lg border border-slate-200 dark:border-white/10 p-4 bg-white dark:bg-slate-900/40">
                    <div className="font-medium mb-1">{h.label}</div>
                    <p className="text-base mb-2">{h.text}</p>
                    <div className="text-sm leading-relaxed">
                      <Link href={`/tools/${h.slug}`} className="text-brand-600">Open tool</Link>
                      <span className="text-slate-600 dark:text-slate-300"> — How to use: open, fill the form, run, and review output.</span>
                    </div>
                  </li>
                ))}
              </ul>
              {/* AI Crawler Tip */}
              <div className="mt-4 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-4 text-base">
                <span className="font-semibold">🤖 AI crawler tip:</span> Submit your sitemap and allow crawling in robots.txt. Use canonical tags and structured data.
                <div className="mt-2 flex flex-wrap gap-3">
                  <Link href="/tools/xml-sitemap-visualizer" className="text-brand-600">XML Sitemap Generator</Link>
                  <Link href="/tools/robots-txt-creator" className="text-brand-600">Robots.txt Creator</Link>
                  <Link href="/tools/schema-markup-generator" className="text-brand-600">Schema Markup Generator</Link>
                </div>
              </div>
            </section>
          ) : null}

          {post.sections?.toWhom ? (
            <section id="to-whom" className="not-prose rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-5 mt-4">
              <h2 className="text-xl font-semibold mb-2">👥 To Whom</h2>
              <p className="text-base">{post.sections.toWhom}</p>
            </section>
          ) : null}

          {post.sections?.possibleUses?.length ? (
            <section id="uses" className="not-prose rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-5 mt-4">
              <h2 className="text-xl font-semibold mb-2">📌 Possible Uses</h2>
              <ul className="list-disc pl-5 space-y-1 text-base">
                {post.sections.possibleUses.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {post.sections?.whoBenefits?.length ? (
            <section id="who-benefits" className="not-prose rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-5 mt-4">
              <h2 className="text-xl font-semibold mb-2">👤 Who Can Benefit</h2>
              <div className="flex flex-wrap gap-2">
                {post.sections.whoBenefits.map((w, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-slate-100 dark:bg-white/10 text-sm">{w}</span>
                ))}
              </div>
            </section>
          ) : null}

          {post.sections?.reasonsToUse?.length ? (
            <section id="reasons" className="not-prose rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-5 mt-4">
              <h2 className="text-xl font-semibold mb-2">✅ Reasons to Use</h2>
              <ul className="list-disc pl-5 space-y-1 text-base">
                {post.sections.reasonsToUse.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {Array.isArray(post.sections?.seoBenefits) && post.sections.seoBenefits.length ? (
            <section id="seo-benefits" className="not-prose rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-5 mt-4">
              <h2 className="text-xl font-semibold mb-2">📈 SEO Benefits</h2>
              <ul className="list-disc pl-5 space-y-1 text-base">
                {post.sections.seoBenefits.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {Array.isArray(post.sections?.opportunities) && post.sections.opportunities.length ? (
            <section id="opportunities" className="not-prose rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-5 mt-4">
              <h2 className="text-xl font-semibold mb-2">🚀 Opportunities</h2>
              <ul className="list-disc pl-5 space-y-1 text-base">
                {post.sections.opportunities.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {(() => {
            const comp = Array.isArray(post.sections?.competition)
              ? post.sections.competition
              : (post.sections?.competition ? [post.sections.competition] : []);
            return comp.length ? (
              <section id="competition" className="not-prose rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-5 mt-4">
                <h2 className="text-xl font-semibold mb-2">🆚 Competition</h2>
                <ul className="list-disc pl-5 space-y-1 text-base">
                  {comp.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </section>
            ) : null;
          })()}

          {Array.isArray(post.sections?.costConsiderations) && post.sections.costConsiderations.length ? (
            <section id="cost" className="not-prose rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-5 mt-4">
              <h2 className="text-xl font-semibold mb-2">💰 Cost Considerations</h2>
              <ul className="list-disc pl-5 space-y-1 text-base">
                {post.sections.costConsiderations.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {Array.isArray(post.sections?.integrations) && post.sections.integrations.length ? (
            <section id="integrations" className="not-prose rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-5 mt-4">
              <h2 className="text-xl font-semibold mb-2">🔗 Related Tools & Integrations</h2>
              <div className="flex flex-wrap gap-3">
                {post.sections.integrations.map((tool, i) => (
                  typeof tool === 'string'
                    ? <span key={i} className="text-slate-700 dark:text-slate-200">{tool}</span>
                    : <Link key={i} href={`/tools/${tool.slug}`} className="text-brand-600">{tool.name}</Link>
                ))}
              </div>
            </section>
          ) : null}

          {Array.isArray(post.sections?.relevantKeywords) && post.sections.relevantKeywords.length ? (
            <section id="keywords" className="not-prose rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-5 mt-4">
              <h2 className="text-xl font-semibold mb-2">🏷️ Relevant Keywords</h2>
              <div className="flex flex-wrap gap-2">
                {post.sections.relevantKeywords.map((k, i) => (
                  <span key={i} className="px-2 py-1 rounded bg-slate-100 dark:bg-white/10 text-sm">{k}</span>
                ))}
              </div>
            </section>
          ) : null}

          {Array.isArray(post.sections?.howDetailed) && post.sections.howDetailed.length ? (
            <section id="how-detailed" className="not-prose rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-5 mt-4">
              <h2 className="text-xl font-semibold mb-2">🧭 How (Detailed)</h2>
              <ol className="list-decimal pl-5 space-y-1 text-base">
                {post.sections.howDetailed.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </section>
          ) : null}

          {Array.isArray(post.sections?.faq) && post.sections.faq.length ? (
            <section id="faq" className="not-prose mt-6">
              <h3 className="text-lg font-semibold mb-3">❓ FAQ</h3>
              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                {post.sections.faq.map((f, i) => (
                  <div key={i} className="rounded border border-slate-200 dark:border-white/10 p-4">
                    <p className="text-base font-medium mb-1">{f.q}</p>
                    <p className="text-base">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </article>

        <div className="mt-8 flex items-center gap-4">
          <Link href="/blog" prefetch={false} className="text-brand-600 hover:underline">Back to Blog</Link>
        </div>
      </main>
    );
  }

  const tool = getToolBySlug(slug);
  if (!tool) {
    return notFound();
  }

  const guide = getToolGuide(tool);
  const shareUrlTool = `${baseUrl}/blog/${tool.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `How to Use ${tool.name}`,
    about: tool.category,
    isPartOf: {
      '@type': 'Blog',
      name: `${siteName} Guides`,
      url: `${baseUrl}/blog`
    },
    mainEntityOfPage: `${baseUrl}/blog/${tool.slug}`,
    author: { '@type': 'Organization', name: siteName },
    publisher: { '@type': 'Organization', name: siteName },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
        { '@type': 'ListItem', position: 3, name: tool.name, item: `${baseUrl}/blog/${tool.slug}` }
      ]
    }
  };

  return (
    <main id="main" className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-2xl sm:text-3xl font-bold mb-3">How to Use {tool.name}</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-6">Category: {tool.category}</p>
      <div className="mb-6"><ShareActions url={shareUrlTool} title={`How to Use ${tool.name}`} /></div>

      <nav aria-label="Table of contents" className="rounded border border-slate-200 dark:border-white/10 p-4 mb-6">
        <ul className="grid sm:grid-cols-2 gap-2 text-sm">
          <li><a href="#purpose" className="text-brand-600 hover:underline">Purpose</a></li>
          <li><a href="#how-to-use" className="text-brand-600 hover:underline">How to Use</a></li>
          <li><a href="#output-explanation" className="text-brand-600 hover:underline">Output</a></li>
          <li><a href="#benefits" className="text-brand-600 hover:underline">Benefits</a></li>
          <li><a href="#use-cases" className="text-brand-600 hover:underline">Use Cases</a></li>
          {guide.referenceCards?.length ? <li><a href="#reference" className="text-brand-600 hover:underline">Reference</a></li> : null}
        </ul>
      </nav>

      <div className="prose dark:prose-invert max-w-none">
        <h2 id="purpose">Purpose</h2>
        <p>{guide.purpose}</p>

        <h2 id="how-to-use">How to Use</h2>
        <pre className="bg-slate-100 dark:bg-gray-800 p-4 rounded text-sm overflow-auto whitespace-pre-wrap">{guide.howToUse}</pre>

        <h2 id="output-explanation">Output Explanation</h2>
        <p>{guide.outputExplanation}</p>

        {guide.benefits?.length ? (
          <>
            <h2 id="benefits">Benefits</h2>
            <ul>
              {guide.benefits.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </>
        ) : null}

        {guide.useCases?.length ? (
          <>
            <h2 id="use-cases">Use Cases</h2>
            <ul>
              {guide.useCases.map((u, i) => <li key={i}>{u}</li>)}
            </ul>
          </>
        ) : null}

        {guide.referenceCards?.length ? (
          <>
            <h2 id="reference">Reference</h2>
            {guide.referenceCards.map((card, i) => (
              <div key={i} className="rounded border border-slate-200 dark:border-white/10 p-4 mb-4">
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {card.items.map((it, j) => (
                    <li key={j} className="flex items-center justify-between">
                      <span className="font-mono">{it.code}</span>
                      <span className="mx-2">{it.label}</span>
                      <span className="text-slate-600 dark:text-slate-300">{it.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        ) : null}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Recommended Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allTools
            .filter((t) => t && t.slug && t.category === tool.category)
            .slice(0, 6)
            .map((t) => (
              <div key={t.slug} className="card p-4 relative hover:shadow-md transition will-change-transform">
                {/* Full-card click target: open the tool */}
                <Link href={`/tools/${t.slug}`} prefetch={false} aria-label={`Open tool: ${t.name}`} className="absolute inset-0 z-10">
                  <span className="sr-only">Open tool: {t.name}</span>
                </Link>
                <h3 className="font-medium">{t.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.category}</p>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <Link href={`/tools/${t.slug}`} prefetch={false} className="relative z-20 text-brand-600 hover:underline" aria-label={`Open tool: ${t.name}`}>Open tool</Link>
                  <Link href={`/blog/${t.slug}`} prefetch={false} className="relative z-20 text-brand-600 hover:underline" aria-label={`Read guide for ${t.name}`}>Read Guide: {t.name}</Link>
                </div>
              </div>
            ))}
        </div>
        <div className="mt-4">
          <Link href={`/category/${slugify(tool.category)}`} className="text-slate-500 hover:underline text-sm">More in {tool.category}</Link>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Related Guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {allPosts
            .filter((p) => p && p.slug && p.category === tool.category)
            .slice(0, 6)
            .map((p) => (
              <div key={p.slug} className="card p-4 relative hover:shadow-md transition will-change-transform">
                {/* Full-card click target: read the post */}
                <Link href={`/blog/${p.slug}`} prefetch={false} aria-label={`Read post: ${p.title}`} className="absolute inset-0 z-10">
                  <span className="sr-only">Read post: {p.title}</span>
                </Link>
                <h3 className="font-medium">{p.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{p.category}</p>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <Link href={`/blog/${p.slug}`} prefetch={false} className="relative z-20 text-brand-600 hover:underline" aria-label={`Read post: ${p.title}`}>Read Post: {p.title}</Link>
                </div>
              </div>
            ))}
        </div>
      </section>

      <div className="mt-8 flex items-center gap-4">
        <Link href={`/tools/${tool.slug}`} className="text-brand-600 hover:underline">Open {tool.name}</Link>
        <Link href={`/category/${slugify(tool.category)}`} className="text-slate-500 hover:underline">More in {tool.category}</Link>
      </div>
    </main>
  );
}
