"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays, Clock, Search, SlidersHorizontal, X } from "lucide-react";

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const PAGE_SIZE = 12;

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function getCategoryCount(posts, category) {
  if (category === "All") return posts.length;
  return posts.filter((post) => post.category === category).length;
}

export default function BlogGrid({ initialPosts = [], initialCategories = [], limit }) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("All");
  const [page, setPage] = React.useState(1);

  const categories = React.useMemo(() => {
    if (initialCategories.length) return initialCategories;
    return ["All", ...new Set(initialPosts.map((post) => post.category).filter(Boolean))];
  }, [initialCategories, initialPosts]);

  const filtered = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let list = [...initialPosts];

    if (category !== "All") {
      list = list.filter((post) => post.category === category);
    }

    if (normalizedQuery) {
      list = list.filter((post) => {
        const haystack = [
          post.title,
          post.description,
          post.category,
          Array.isArray(post.tags) ? post.tags.join(" ") : "",
        ].join(" ").toLowerCase();
        return haystack.includes(normalizedQuery);
      });
    }

    return typeof limit === "number" ? list.slice(0, limit) : list;
  }, [category, initialPosts, limit, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visiblePosts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const topCategories = categories.filter((item) => item !== "All").slice(0, 10);

  React.useEffect(() => {
    setPage(1);
  }, [category, query]);

  return (
    <section id="guides" className="relative left-1/2 w-screen -translate-x-1/2 border-y border-slate-200 bg-white py-12 dark:border-white/10 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-300">
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              Guide library
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-4xl">
              Browse clear, practical SEO articles.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Filter by topic, search by workflow, and open the guide that matches the job in front of you.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 shadow-sm dark:border-white/10 dark:bg-white/5">
            <label className="sr-only" htmlFor="blog-search">Search guides</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                id="blog-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search guides, topics, workflows..."
                className="h-12 w-full rounded-lg border border-transparent bg-white pl-10 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-200 focus:ring-4 focus:ring-indigo-100 dark:bg-slate-950/70 dark:text-white dark:focus:border-indigo-400/30 dark:focus:ring-indigo-400/10"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
            Topics
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.slice(0, 18).map((item) => {
              const active = category === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`flex shrink-0 items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition ${
                    active
                      ? "border-slate-950 bg-slate-950 text-white shadow-sm dark:border-white dark:bg-white dark:text-slate-950"
                      : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-slate-950 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                  }`}
                >
                  {item}
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${active ? "bg-white/15 text-white dark:bg-slate-950/10 dark:text-slate-700" : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"}`}>
                    {getCategoryCount(initialPosts, item)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div>
            {visiblePosts.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-6 py-20 text-center dark:border-white/10 dark:bg-white/[0.03]">
                <p className="text-lg font-semibold text-slate-800 dark:text-white">No guides found</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Try another topic or clear the search field.</p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("All");
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950"
                >
                  Reset filters
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visiblePosts.map((post) => {
                  const href = `/blog/${post.slug}`;

                  return (
                    <a
                      key={post.slug}
                      href={href}
                      className="group flex min-h-[286px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-100 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.07]"
                    >
                      <article className="flex h-full flex-col">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          {post.category ? (
                            <Link
                              href={`/category/${slugify(post.category)}`}
                              className="rounded-md border border-indigo-100 bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-400/20 dark:bg-indigo-400/10 dark:text-indigo-200 dark:hover:bg-indigo-400/20"
                            >
                              {post.category}
                            </Link>
                          ) : (
                            <Link
                              href="/category/seo"
                              className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                            >
                              SEO
                            </Link>
                          )}
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="h-3.5 w-3.5" aria-hidden />
                            {post.readTimeMinutes || 6} min
                          </span>
                        </div>

                        <h3 className="text-base font-semibold leading-6 tracking-tight text-slate-950 transition group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-200">
                          <span className="line-clamp-3">{post.title}</span>
                        </h3>
                        <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {post.description}
                        </p>

                        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                            <time dateTime={post.datePublished}>{formatDate(post.datePublished)}</time>
                          </span>
                          <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700 transition group-hover:text-indigo-700 dark:text-slate-200 dark:group-hover:text-indigo-200">
                            Read
                            <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden />
                          </span>
                        </div>
                      </article>
                    </a>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Showing {visiblePosts.length} of {filtered.length} guides
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((value) => Math.max(1, value - 1))}
                    disabled={page === 1}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden />
                    Prev
                  </button>
                  <span className="rounded-lg bg-slate-950 px-3.5 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
                    {page} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                    disabled={page === totalPages}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white shadow-sm dark:border-white/10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Workflow tip</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">Read, check, improve.</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Use each guide as the thinking layer, then validate the page with the toolkit before publishing changes.
              </p>
              <a href="/tools" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                Open tools
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
              <h3 className="text-sm font-semibold text-slate-950 dark:text-white">Popular topics</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {topCategories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-slate-950 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-300 dark:hover:bg-white/10"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
