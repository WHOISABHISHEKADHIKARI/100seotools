"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { getAllBlogPosts } from "../lib/blog";

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function clampText(text, max) {
  if (!text) return "";
  const t = text.trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1) + "…";
}

export default function BlogGrid({ limit = 12 }) {
  const router = useRouter();
  const posts = React.useMemo(() => {
    // Load dynamically from lib; replace with API when available
    const all = getAllBlogPosts?.() || [];
    return all.slice(0, limit);
  }, [limit]);

  return (
    <section aria-labelledby="blog-section-heading" className="content-transition">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-6 sm:mb-8">
          <h1
            id="blog-section-heading"
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100"
          >
            Blog — Smart SEO Guides & Playbooks
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Practical SEO tips, tool walkthroughs, and deep-dives to level up.
          </p>
        </header>

        <div
          className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {posts.map((post) => {
            const href = post.href || `/blog/${post.slug || ""}`;
            const title = post.title || "Untitled";
            const excerpt = clampText(post.description || post.excerpt || "", 120);
            const date = formatDate(post.date || post.publishedAt || new Date().toISOString());

            // Placeholder featured image block (16:9)
            // Replace with real image URLs when available
            const seed = (post.slug || title).replace(/\s+/g, "-").toLowerCase();
            const bg = `linear-gradient(135deg, rgba(99,102,241,0.12), rgba(16,185,129,0.12))`;
            const bg2 = `linear-gradient(135deg, rgba(99,102,241,0.25), rgba(16,185,129,0.25))`;

            return (
              <article
                key={href}
                className="relative group rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow"
              >
                <a
                  href={href}
                  className="absolute inset-0 z-10"
                  aria-label={title}
                >
                  <span className="sr-only">{title}</span>
                </a>

                {/* Featured image with 16:9 aspect ratio */}
                <div className="relative rounded-t-lg overflow-hidden">
                  <div
                    className="relative w-full"
                    style={{ paddingTop: "56.25%" }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{ backgroundImage: bg, backgroundSize: "cover" }}
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundImage: bg2, backgroundSize: "cover" }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-20 p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold line-clamp-2 text-slate-900 dark:text-slate-100">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 line-clamp-3">
                    {excerpt}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <time dateTime={post.date || post.publishedAt}>{date}</time>
                    <div className="pointer-events-auto">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 rounded-md bg-gray-900 text-white text-xs font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(href);
                        }}
                      >
                        Read more
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
