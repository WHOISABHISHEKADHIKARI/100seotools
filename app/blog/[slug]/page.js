import Image from 'next/image';
import Link from 'next/link';
import StructuredData from '../../../components/ui/StructuredData';
import { getAllBlogPostsPublished, getBlogPostPublishedBySlug } from '../../../lib/blog-data';
import { getBaseUrl, siteName, getAuthor } from '../../../lib/site';
import { notFound, permanentRedirect } from 'next/navigation';
import { getAllToolsMeta } from '../../../tools';

const baseUrl = getBaseUrl();

// Optimized for static generation and large-scale indexing
// We use generateStaticParams to pre-build 800+ posts
export const dynamicParams = true;
export const revalidate = 3600; // Revalidate every hour

// Pre-generate all blog post routes at build time for maximum performance and reliability
// This resolves GSC 404 and 504 errors for dynamic routes
export async function generateStaticParams() {
  const posts = await getAllBlogPostsPublished();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const page = Number((await searchParams)?.page || 1);
  const post = await getBlogPostPublishedBySlug(slug);

  if (!post) {
    // Check if the slug belongs to a tool - if so, redirect metadata canonical
    const tools = getAllToolsMeta();
    const isTool = tools.some(t => t.slug === slug);
    if (isTool) {
      return {
        alternates: { canonical: `${baseUrl}/tools/${slug}` },
        robots: { index: false, follow: true } // Don't index the blog version of a tool slug
      };
    }
    notFound();
  }

  const title = post.title;
  const description = post.description;

  // Self-referencing canonical for all blog posts
  // This resolves GSC "Alternative page with proper canonical tag"
  const canonical = `${baseUrl}/blog/${post.slug}`;
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
    // Redirect plain tool slugs to /tools/[slug] to avoid duplicate content/404s
    // This handles the old slugs that used to be blog posts
    const tools = getAllToolsMeta();
    if (tools.some(t => t.slug === slug)) {
      permanentRedirect(`/tools/${slug}`);
    }
    notFound();
  }

  // Get all posts for navigation
  const allPosts = await getAllBlogPostsPublished();
  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

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
    <>
      <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-gradient-to-br from-[#0f0528] via-[#1a085e] to-[#050e3a] text-white">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute right-0 top-0 w-[600px] h-full bg-blue-600 opacity-10 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {post.category && (
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-violet-500/30 text-violet-200 border border-violet-500/40">{post.category}</span>
              )}
              <span className="text-xs text-white/50">{post.readTimeMinutes || 6} min read</span>
              <span className="text-xs text-white/50">Published {new Date(post.datePublished).toLocaleDateString()}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4">{post.title}</h1>
            <p className="text-white/60 text-base md:text-lg leading-relaxed mb-7 max-w-3xl">{post.description}</p>
            <div className="flex items-center gap-3">
              <Image
                src="/author.png"
                alt="Abhishek Adhikari"
                width={48}
                height={48}
                className="rounded-full border-2 border-violet-300"
              />
              <div>
                <Link href="/author" className="text-sm font-extrabold hover:text-violet-200 transition-colors">
                  Abhishek Adhikari
                </Link>
                <div className="text-xs text-white/50">SEO Expert and Full-Stack Developer</div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-10 overflow-hidden">
          <svg viewBox="0 0 1440 40" className="absolute bottom-0 w-full" preserveAspectRatio="none">
            <path d="M0,20 C360,40 720,0 1080,20 C1260,32 1380,24 1440,20 L1440,40 L0,40 Z" fill="#f4f6fb" />
          </svg>
        </div>
      </section>

      <main className="relative left-1/2 w-screen -translate-x-1/2 bg-[#f4f6fb] dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid lg:grid-cols-[1fr_300px] gap-8 items-start">
            <article className="min-w-0 space-y-8 rounded-[1.75rem] border border-white/70 bg-white/95 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-slate-900/[0.03] transition-shadow duration-300 hover:shadow-[0_28px_90px_rgba(15,23,42,0.11)] md:p-9 dark:border-white/10 dark:bg-white/[0.04]">
      <header className="sr-only">
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

      <section className="space-y-6 text-[1.03rem] leading-8">

        {/* TL;DR Section */}
        {post.tldr && (
          <div className="my-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm dark:border-blue-500/20 dark:from-blue-500/10 dark:to-white/[0.03]">
            <h2 className="mb-2 text-lg font-extrabold text-blue-800 dark:text-blue-200">Quick take</h2>
            <p className="text-gray-700 dark:text-gray-300">{post.tldr}</p>
          </div>
        )}

        {post.sections?.intro && (<p className="text-gray-700 dark:text-gray-300">{post.sections.intro}</p>)}
        {post.sections?.what && (<div className="space-y-2"><h2 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">What it does</h2><p className="text-gray-700 dark:text-gray-300">{post.sections.what}</p></div>)}
        {post.sections?.why && (<div className="space-y-2"><h2 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">Why it matters</h2><p className="text-gray-700 dark:text-gray-300">{post.sections.why}</p></div>)}

        {Array.isArray(post.sections?.how) && post.sections.how.length > 0 && (
          <div>
            <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">How to use it</h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              {post.sections.how.map((h, i) => (
                <li key={i} className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3 dark:border-white/10 dark:bg-white/5"><Link href={h.slug ? `/tools/${h.slug}` : '#'} className="font-semibold text-brand-600 hover:underline">{h.label || h.text}</Link></li>
              ))}
            </ul>
          </div>
        )}

        {Array.isArray(post.sections?.howDetailed) && post.sections.howDetailed.length > 0 && (
          <div>
            <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">Steps</h2>
            <ol className="space-y-3 text-gray-700 dark:text-gray-300">
              {post.sections.howDetailed.map((s, i) => (<li key={i} className="flex gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5"><span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-extrabold text-white">{i + 1}</span><span>{s}</span></li>))}
            </ol>
          </div>
        )}

        {Array.isArray(post.sections?.tips) && post.sections.tips.length > 0 && (
          <div>
            <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">Practical tips</h2>
            <ul className="grid gap-3 text-gray-700 dark:text-gray-300">
              {post.sections.tips.map((t, i) => (<li key={i} className="rounded-2xl bg-emerald-50/70 px-4 py-3 text-sm leading-6 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:ring-emerald-500/20">{t}</li>))}
            </ul>
          </div>
        )}

        {Array.isArray(post.sections?.faq) && post.sections.faq.length > 0 && (
          <div>
            <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">FAQ</h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              {post.sections.faq.map((f, i) => (
                <li key={i} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/5"><span className="block font-bold text-slate-950 dark:text-white">{f.q || f.question}</span><span className="mt-1 block text-sm leading-6">{f.a || f.answer}</span></li>
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

            </article>

            <aside className="space-y-5">
              <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm p-5 sticky top-24">
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Article Actions</p>
                <div className="grid gap-2">
                  <Link href="/blog" className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/10 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">
                    Back to blog
                  </Link>
                  <Link href="/tools" className="px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-sm font-extrabold text-white hover:opacity-90 transition-opacity">
                    Browse free tools
                  </Link>
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 to-blue-800 rounded-2xl p-5 text-white">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                <div className="relative">
                  <p className="text-[10px] font-extrabold text-violet-200 uppercase tracking-wider mb-2">Keep Optimizing</p>
                  <h2 className="text-xl font-extrabold mb-2">Use the toolkit after reading</h2>
                  <p className="text-sm text-white/65 leading-relaxed mb-4">Run audits, generate metadata, validate schema, and turn this guide into measurable SEO work.</p>
                  <Link href="/tools/keyword-suggestion-tool" className="inline-flex px-4 py-2.5 bg-white text-violet-700 text-sm font-extrabold rounded-xl hover:shadow-xl transition-shadow">
                    Start with keywords
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <StructuredData data={articleLd} />
      {faqLd && <StructuredData data={faqLd} />}
      {howToLd && <StructuredData data={howToLd} />}
      <StructuredData data={breadcrumbLd} />
    </>
  );
}
