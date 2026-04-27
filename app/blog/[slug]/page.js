import Image from 'next/image';
import Link from 'next/link';
import StructuredData from '../../../components/ui/StructuredData';
import { getAllBlogPostsPublished, getBlogPostPublishedBySlug } from '../../../lib/blog-data';
import { getBaseUrl, siteName, getAuthor } from '../../../lib/site';
import { notFound, permanentRedirect } from 'next/navigation';

const baseUrl = getBaseUrl();

// Enable dynamic rendering for blog posts to prevent 404s
// The blog system generates 810+ posts dynamically, so we use dynamic rendering
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// All blog posts are rendered dynamically on-demand
// No static pre-generation needed for 810+ posts

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const page = Number((await searchParams)?.page || 1);
  const post = await getBlogPostPublishedBySlug(slug);
  if (!post) {
    notFound();
  }

  const title = `${post.title}`;
  // Use a richer description if available from content snippets, or fallback to the standard description
  let description = post.description || '';

  if (!description || description.length < 50) {
    const t = post.title.toLowerCase();

    // 1. Specific Title Overrides
    if (t.includes('100 free seo tools')) {
      description = 'Explore 100+ free SEO tools for keyword research, on-page optimization, technical checks, backlinks, local SEO, AI writing, and performance.';
    }
    // 2. Keyword-based Template Selection independent of section order
    else if ((t.includes('calculator') || t.includes('checklist') || t.includes('keyword share')) && post.sections?.checklist?.length > 0) {
      description = `Follow a simple checklist and workflow for ${post.title}. Use repeatable steps to reduce errors and ship faster results.`;
    }
    else if ((t.includes('keyword share') || t.includes('guide') || t.includes('tone of voice') || t.includes('analyzer')) && post.sections?.howDetailed?.length > 0) {
      description = `Step-by-step guide to using ${post.title}. Learn purpose, setup, outputs, and how it supports ${post.category || 'SEO'} workflows.`;
    }
    else if (t.includes('rewriter') && post.sections?.relevantKeywords?.length > 0) {
      description = `Explore popular search terms around ${post.title}, how to optimize your usage for better results, and what to measure for success.`;
    }
    else if ((t.includes('estimator') || t.includes('generator') || t.includes('301') || t.includes('validator')) && post.sections?.costConsiderations?.length > 0) {
      description = `Apply best practices when using ${post.title}, pair it with complementary tools, and review cost considerations including time and optional upgrades.`;
    }
    else if (t.includes('validator') && post.sections?.intro) {
      description = `Understand ${post.title} features, the SEO benefits you can expect, and relevant keywords to target for discoverability.`;
    }

    // 3. Fallbacks if no specific keyword matched or specific section was missing
    if (!description || description.length < 50) {
      if (post.sections?.checklist && post.sections.checklist.length > 0) {
        description = `Follow a simple checklist and workflow for ${post.title}. Use repeatable steps to reduce errors and ship faster results.`;
      } else if (post.sections?.howDetailed && post.sections.howDetailed.length > 0) {
        description = `Step-by-step guide for ${post.title}. Learn exactly how to optimize your workflow with clear instructions and examples.`;
      } else if (post.sections?.relevantKeywords && post.sections.relevantKeywords.length > 0) {
        description = `Explore popular search terms around ${post.title}, how to optimize your usage for better results, and what to measure for success.`;
      } else if (post.sections?.costConsiderations && post.sections.costConsiderations.length > 0) {
        description = `Apply best practices when using ${post.title}, pair it with complementary tools, and review cost considerations including time and optional upgrades.`;
      } else if (post.tldr) {
        description = post.tldr.slice(0, 155);
      } else if (post.sections?.intro) {
        description = `Understand ${post.title} features, the SEO benefits you can expect, and relevant keywords to target for discoverability.`;
      }
    }
  }
  let individualCanonical = `${baseUrl}/blog/${post.slug}`;

  // Handle canonical for auto-generated tool variant posts
  // These are duplicate content of the main tool page, so we point canonical to the tool
  const toolSuffixes = [
    '-how-to-use',
    '-features-benefits-keywords',
    '-best-practices-integrations-costs',
    '-checklist-workflow',
    '-popular-search-terms'
  ];

  for (const suffix of toolSuffixes) {
    if (slug.endsWith(suffix)) {
      const toolSlug = slug.replace(suffix, '');
      individualCanonical = `${baseUrl}/tools/${toolSlug}`;
      break;
    }
  }

  const canonical = individualCanonical;
  const url = page > 1 ? `${canonical}?page=${page}` : canonical;

  return {
    title,
    description,
    alternates: { canonical },
    robots: page > 1 ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    }
  };
}

export default async function Page({ params, searchParams }) {
  const { slug } = await params;
  const page = Number((await searchParams)?.page || 1);

  // If a page parameter is present for an individual blog post,
  // redirect to the base URL since individual posts are not paginated.
  // This resolves GSC "Redirect error" for URLs like ?page=2.
  if (page > 1) {
    permanentRedirect(`/blog/${slug}`);
  }

  const post = await getBlogPostPublishedBySlug(slug);
  if (!post) {
    notFound();
  }

  // Get all posts for navigation
  const allPosts = await getAllBlogPostsPublished();
  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const anchorUrl = `${baseUrl}/blog#${post.slug}`;

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    author: {
      '@type': 'Person',
      ...getAuthor(baseUrl)
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    url: `${baseUrl}/blog/${post.slug}`,
    mainEntityOfPage: `${baseUrl}/blog/${post.slug}`,
    inLanguage: 'en-US',
    keywords: Array.isArray(post.tags) ? post.tags.join(', ') : undefined,
  };

  const faqLd = Array.isArray(post.sections?.faq) && post.sections.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: `${baseUrl}/blog/${post.slug}`,
    isPartOf: `${baseUrl}/blog/${post.slug}`,
    mainEntity: post.sections.faq.map((f) => ({ '@type': 'Question', name: f.q || f.question, acceptedAnswer: { '@type': 'Answer', text: f.a || f.answer } }))
  } : null;

  const howToLd = Array.isArray(post.sections?.howDetailed) && post.sections.howDetailed.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    url: `${baseUrl}/blog/${post.slug}`,
    isPartOf: `${baseUrl}/blog/${post.slug}`,
    name: post.title,
    description: post.description,
    step: post.sections.howDetailed.map((s) => ({ '@type': 'HowToStep', text: s }))
  } : null;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${baseUrl}/blog/${post.slug}` }
    ]
  };

  return (
    <article className="max-w-3xl mx-auto py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{post.title}</h1>
        <p className="text-gray-700 dark:text-gray-300">{post.description}</p>
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>{new Date(post.datePublished).toLocaleDateString()}</span>
          <span>·</span>
          <span>{post.readTimeMinutes || 6} min read</span>
          {post.category && (
            <>
              <span>·</span>
              <span className="px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">{post.category}</span>
            </>
          )}
        </div>
        {/* Author Byline */}
        <div className="flex items-center gap-3 py-4 border-y border-slate-200 dark:border-white/10">
          <Image
            src="/author.png"
            alt="Abhishek Adhikari"
            width={48}
            height={48}
            className="rounded-full border-2 border-brand-500"
          />
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              <Link href="/author" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Abhishek Adhikari
              </Link>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              SEO Expert & Full-Stack Developer
            </div>
          </div>
        </div>
      </header>

      <div className="rounded-md bg-slate-50 dark:bg-white/5 p-4 border border-slate-200 dark:border-white/10">
        <p>
          This guide is also available in the merged Blog page. View in context:
          {' '}<Link className="text-brand-600 hover:underline" href={anchorUrl}>/blog#{post.slug}</Link>
        </p>
      </div>

      <section className="space-y-4">

        {/* TL;DR Section */}
        {post.tldr && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 my-6 rounded-r">
            <h2 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-2">TL;DR</h2>
            <p className="text-gray-700 dark:text-gray-300">{post.tldr}</p>
          </div>
        )}

        {post.sections?.intro && (<p className="text-gray-700 dark:text-gray-300">{post.sections.intro}</p>)}
        {post.sections?.what && (<div><h2 className="text-lg font-semibold">What</h2><p className="text-gray-700 dark:text-gray-300">{post.sections.what}</p></div>)}
        {post.sections?.why && (<div><h2 className="text-lg font-semibold">Why</h2><p className="text-gray-700 dark:text-gray-300">{post.sections.why}</p></div>)}

        {Array.isArray(post.sections?.how) && post.sections.how.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">How</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              {post.sections.how.map((h, i) => (
                <li key={i}><Link href={h.slug ? `/tools/${h.slug}` : '#'} className="text-brand-600 hover:underline">{h.label || h.text}</Link></li>
              ))}
            </ul>
          </div>
        )}

        {Array.isArray(post.sections?.howDetailed) && post.sections.howDetailed.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">Steps</h2>
            <ol className="list-decimal pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              {post.sections.howDetailed.map((s, i) => (<li key={i}>{s}</li>))}
            </ol>
          </div>
        )}

        {Array.isArray(post.sections?.tips) && post.sections.tips.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">Tips</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              {post.sections.tips.map((t, i) => (<li key={i}>{t}</li>))}
            </ul>
          </div>
        )}

        {Array.isArray(post.sections?.faq) && post.sections.faq.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">FAQ</h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              {post.sections.faq.map((f, i) => (
                <li key={i}><span className="font-medium">Q:</span> {f.q || f.question} <br /><span className="font-medium">A:</span> {f.a || f.answer}</li>
              ))}
            </ul>
          </div>
        )}
      </section>



      {/* Next/Previous Navigation */}
      <nav className="border-t border-slate-200 dark:border-white/10 pt-8 mt-12" aria-label="Blog post navigation">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {previousPost ? (
            <Link
              href={`/blog/${previousPost.slug}`}
              className="group p-4 rounded-lg border border-slate-200 dark:border-white/10 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md transition-all"
            >
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </div>
              <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 line-clamp-2">
                {previousPost.title}
              </div>
              {previousPost.category && (
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{previousPost.category}</div>
              )}
            </Link>
          ) : (
            <div className="p-4 rounded-lg border border-slate-200 dark:border-white/10 opacity-50">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">No previous post</div>
            </div>
          )}

          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="group p-4 rounded-lg border border-slate-200 dark:border-white/10 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md transition-all text-right"
            >
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center justify-end gap-1">
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 line-clamp-2">
                {nextPost.title}
              </div>
              {nextPost.category && (
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{nextPost.category}</div>
              )}
            </Link>
          ) : (
            <div className="p-4 rounded-lg border border-slate-200 dark:border-white/10 opacity-50 text-right">
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">No next post</div>
            </div>
          )}
        </div>

        {/* Back to all posts */}
        <div className="mt-6 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            View All Blog Posts
          </Link>
        </div>
      </nav>

      <StructuredData data={articleLd} />
      {faqLd && <StructuredData data={faqLd} />}
      {howToLd && <StructuredData data={howToLd} />}
      <StructuredData data={breadcrumbLd} />
    </article>
  );
}

