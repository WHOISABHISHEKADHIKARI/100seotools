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

  const fallbackImage = `${baseUrl}/og-image.jpg`;

  const graphLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
        ],
      },
      {
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
          image: post.image || (post.slug ? `${baseUrl}/blog-images/${post.slug}.png` : fallbackImage),
          datePublished: post.datePublished,
          dateModified: post.dateModified || post.datePublished,
          author: {
            '@type': 'Person',
            name: 'Abhishek Adhikari',
            url: `${baseUrl}/author`,
            sameAs: 'https://www.linkedin.com/in/whoisabhishekadhikari/'
          },
          publisher: {
            '@type': 'Organization',
            name: '100 SEO Tools',
            url: baseUrl,
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/logo.png`,
            },
          },
          url: `${baseUrl}/blog/${post.slug}`,
          articleSection: post.category,
          inLanguage: 'en-US',
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What are the best free SEO tools?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '100 SEO Tools offers 100+ free SEO tools for keyword research, on-page optimization, technical SEO, schema generation, backlink analysis, content optimization, and AI-powered SEO — all browser-based with no signup required.'
            }
          },
          {
            '@type': 'Question',
            name: 'How do I learn SEO?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Start with the SEO guides on this blog covering keyword research, on-page SEO, technical SEO, link building, and AI-powered strategies. Each guide pairs with free tools from the 100 SEO Tools toolkit for hands-on practice.'
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <StructuredData data={graphLd} />

      <main role="main" className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 text-sm text-slate-500 dark:text-slate-400">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><Link href="/" className="hover:text-violet-600 dark:hover:text-violet-400">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-800 dark:text-slate-200 font-semibold" aria-current="page">Blog</li>
          </ol>
        </nav>
        <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] dark:border-white/10 dark:bg-[linear-gradient(135deg,#020617_0%,#111827_100%)]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
              <div className="max-w-3xl">
                <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  <BookOpen className="h-3.5 w-3.5 text-indigo-500" aria-hidden />
                  SEO Research Library
                </div>
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-6xl">
                  SEO Blog &mdash; Free SEO Guides with a Clear Path from Insight to Action
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
                      <span className="inline-flex items-center gap-2 text-slate-400">
                        <span aria-hidden>by</span>
                        <a
                          href="/author"
                          rel="author"
                          className="font-medium text-slate-700 underline-offset-2 hover:text-indigo-700 hover:underline dark:text-slate-300 dark:hover:text-indigo-200"
                        >
                          Abhishek Adhikari
                        </a>
                        <a
                          href="https://www.linkedin.com/in/whoisabhishekadhikari/"
                          target="_blank"
                          rel="noopener noreferrer author"
                          className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300"
                          aria-label="Abhishek Adhikari on LinkedIn"
                        >
                          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        </a>
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
          <div className="mb-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-lg font-extrabold text-white">
                AA
              </span>
              <div>
                <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                  Written by <a href="/author" rel="author" className="text-indigo-700 underline-offset-2 hover:underline dark:text-indigo-300">Abhishek Adhikari</a>
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  SEO Expert &amp; Full-Stack Developer. Creator of 100 SEO Tools, building free, privacy-first browser-based SEO utilities for marketers and agencies worldwide. 
                  <a href="https://www.linkedin.com/in/whoisabhishekadhikari/" target="_blank" rel="noopener noreferrer author" className="ml-1 text-indigo-600 hover:underline dark:text-indigo-300">LinkedIn</a>.
                </p>
              </div>
            </div>
          </div>
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
              <h3 className="text-base font-semibold text-slate-950 dark:text-white">Sources & references</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Each guide is built from hands-on SEO experience, platform documentation, and industry best practices from Google Search Central, Schema.org, and Moz.
              </p>
              <div className="mt-3 space-y-2 text-xs">
                {[
                  ['Google Search Central', 'https://developers.google.com/search'],
                  ['Schema.org', 'https://schema.org'],
                  ['W3C Web Standards', 'https://www.w3.org/standards/'],
                ].map(([name, url]) => (
                  <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="block rounded-md border border-slate-100 px-3 py-2 text-slate-600 transition hover:border-indigo-200 hover:text-indigo-700 dark:border-white/10 dark:text-slate-400 dark:hover:text-indigo-300">
                    <span className="font-medium">{name}</span>
                    <span className="ml-2 text-slate-400">↗</span>
                  </a>
                ))}
              </div>
            </aside>
            <aside className="mt-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
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
