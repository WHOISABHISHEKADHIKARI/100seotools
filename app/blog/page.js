import Link from 'next/link';
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, Clock, Layers3 } from 'lucide-react';
import StructuredData from '../../components/ui/StructuredData';
import { getAllBlogPostsPublished } from '../../lib/blog-data';
import { getBaseUrl } from '../../lib/site';
import BlogGrid from '../../components/blog/BlogGrid';
import { permanentRedirect } from 'next/navigation';

const baseUrl = getBaseUrl();

export { metadata } from './metadata';

function cleanDate(value) {
  try {
    return new Date(value).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

function getToolGuidePosts(posts) {
  return posts.filter((post) => post.slug.includes('-how-to-use')).slice(0, 4);
}

export default async function BlogPage({ searchParams }) {
  const page = Number((await searchParams)?.page || 1);
  if (page > 1) {
    permanentRedirect('/blog');
  }

  const posts = await getAllBlogPostsPublished();
  const toolSuffixes = ['-how-to-use', '-features-benefits-keywords', '-best-practices-integrations-costs', '-checklist-workflow', '-popular-search-terms'];
  const visiblePosts = posts.filter((post) => !toolSuffixes.some((suffix) => post.slug.endsWith(suffix)));
  const categories = ['All', ...new Set(visiblePosts.map((post) => post.category).filter(Boolean))];
  const featuredPost = visiblePosts[0] || posts[0];
  const guidePosts = getToolGuidePosts(posts);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
    ],
  };

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: '100 SEO Tools Blog - Free SEO Guides & Tutorials 2026',
    description: 'Comprehensive SEO guides, tutorials, and best practices. Learn keyword research, on-page optimization, technical SEO, link building, and AI-powered SEO strategies.',
    url: `${baseUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: '100 SEO Tools',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    blogPost: visiblePosts.slice(0, 50).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      datePublished: post.datePublished,
      author: { '@type': 'Organization', name: '100 SEO Tools' },
      url: `${baseUrl}/blog/${post.slug}`,
      articleSection: post.category,
    })),
  };

  return (
    <>
      <StructuredData data={breadcrumbLd} />
      <StructuredData data={collectionLd} />

      <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
        <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] dark:border-white/10 dark:bg-[linear-gradient(135deg,#020617_0%,#111827_100%)]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
              <div className="max-w-3xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  <BookOpen className="h-3.5 w-3.5 text-indigo-500" aria-hidden />
                  SEO Research Library
                </div>
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-6xl">
                  Practical SEO guides with a clear path from insight to action.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 md:text-lg">
                  Browse focused tutorials, strategy notes, and workflow playbooks written for marketers who need useful decisions, not noisy dashboards.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="#guides" className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100">
                    Browse guides
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                  <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-slate-950 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10">
                    Open toolkit
                    <Layers3 className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-lg border border-white bg-white/70 p-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                {[
                  { value: visiblePosts.length, label: 'Editorial guides' },
                  { value: categories.length - 1, label: 'Topics' },
                  { value: '100+', label: 'Free tools' },
                  { value: '2026', label: 'Current SEO' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-slate-100 bg-white p-4 dark:border-white/10 dark:bg-slate-950/40">
                    <div className="text-2xl font-semibold tracking-tight">{stat.value}</div>
                    <div className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {featuredPost && (
          <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <Link href={`/blog/${featuredPost.slug}`} className="group block rounded-lg border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/[0.07]">
              <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_340px]">
                <article className="p-6 sm:p-8 lg:p-10">
                  <div className="mb-5 flex flex-wrap items-center gap-2">
                    {featuredPost.category && (
                      <span className="rounded-md border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-200">
                        {featuredPost.category}
                      </span>
                    )}
                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                      Featured guide
                    </span>
                  </div>
                  <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-slate-950 transition group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-200 md:text-4xl">
                    {featuredPost.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 md:text-base">
                    {featuredPost.description}
                  </p>
                  <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" aria-hidden />
                      {cleanDate(featuredPost.datePublished)}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock className="h-4 w-4" aria-hidden />
                      {featuredPost.readTimeMinutes || 6} min read
                    </span>
                  </div>
                </article>
                <div className="border-t border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] p-6 dark:border-white/10 dark:bg-[linear-gradient(135deg,#0f172a_0%,#111827_100%)] lg:border-l lg:border-t-0">
                  <div className="flex h-full min-h-56 flex-col justify-between rounded-lg border border-white bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-slate-950/30">
                    <div>
                      <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                        <CheckCircle2 className="h-5 w-5" aria-hidden />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Editorial Pick</p>
                      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        Start here for a polished, practical workflow before exploring the full library.
                      </p>
                    </div>
                    <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 dark:text-indigo-200">
                      Read guide
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        <BlogGrid initialPosts={visiblePosts} initialCategories={categories} />

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-300">Next step</p>
              <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-3xl">
                Turn reading into a repeatable SEO workflow.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                Pair each guide with the free tools to check metadata, validate technical fixes, plan content, and produce cleaner reports.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100">
                  Browse all tools
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link href="/author" className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-slate-950 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10">
                  About the creator
                </Link>
              </div>
            </div>

            <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
              <h3 className="text-base font-semibold text-slate-950 dark:text-white">Latest tool guides</h3>
              <div className="mt-4 space-y-3">
                {guidePosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="block rounded-lg border border-slate-100 p-3 text-sm transition hover:border-indigo-200 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5">
                    <span className="line-clamp-2 font-medium text-slate-800 dark:text-slate-100">{post.title}</span>
                    <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{post.readTimeMinutes || 5} min read</span>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
