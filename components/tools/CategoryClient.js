"use client";
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import SearchFilter from './SearchFilter';
import UnifiedCard from '../ui/UnifiedCard';
import ToolGrid from './ToolGrid';

export default function CategoryClient({ items = [], catName, slug, initialPage = 1, pageSize = 6, relatedPosts = [] }) {
  const [filteredTools, setFilteredTools] = useState(items);
  const [page, setPage] = useState(Math.max(1, Number(initialPage) || 1));

  // When filter changes, reset to page 1
  useEffect(() => { setPage(1); }, [filteredTools]);

  const totalTools = filteredTools.length;
  const toolsPlural = totalTools === 1 ? 'tool' : 'tools';

  // Blog/article pagination
  const totalArticles = relatedPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const visibleArticles = useMemo(() => relatedPosts.slice(startIndex, endIndex), [relatedPosts, startIndex, endIndex]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="space-y-8">
      {/* Filtering and search */}
      <SearchFilter tools={items} onChange={setFilteredTools} />

      {/* Tools count and grid */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-300">{totalTools} {toolsPlural} in {catName}</p>
        <Link href={`/category/${slug}`} prefetch={false} className="text-sm text-slate-600 dark:text-slate-300 hover:underline">Reset</Link>
      </div>

      {filteredTools.length > 0 ? (
        <ToolGrid tools={filteredTools} />
      ) : (
        <div className="card p-6 text-sm text-slate-600 dark:text-slate-300">No tools match your filters.</div>
      )}

      {/* Related articles */}
      <section aria-labelledby="related-articles" className="space-y-4">
        <h2 id="related-articles" className="text-2xl font-bold">Related Articles</h2>
        {visibleArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleArticles.map((post) => (
              <UnifiedCard
                key={post.slug}
                href={`/blog/${post.slug}`}
                title={post.title}
                description={post.description}
                variant="article"
                meta={post.readTimeMinutes ? `${post.readTimeMinutes} min read` : undefined}
                className="p-6"
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-300">No related articles found.</p>
        )}

        {/* Pagination controls */}
        <div className="flex items-center justify-between mt-2">
          <button
            type="button"
            className="btn btn-outline disabled:opacity-50"
            onClick={goPrev}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >Prev</button>
          <span className="text-sm text-slate-600 dark:text-slate-300">Page {currentPage} of {totalPages}</span>
          <button
            type="button"
            className="btn btn-outline disabled:opacity-50"
            onClick={goNext}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >Next</button>
        </div>
      </section>

      {/* Helpful resources */}
      <section aria-labelledby="helpful-resources" className="space-y-3">
        <h2 id="helpful-resources" className="text-2xl font-bold">Helpful Resources</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <li className="card p-4">
            <Link href="/seo-calculator" prefetch={false} className="hover:underline">SEO Calculator</Link>
            <p className="text-sm text-slate-600 dark:text-slate-300">Estimate impact from improvements.</p>
          </li>
          <li className="card p-4">
            <Link href="/tools/structured-data-validator" prefetch={false} className="hover:underline">Structured Data Validator</Link>
            <p className="text-sm text-slate-600 dark:text-slate-300">Check JSON-LD for common issues.</p>
          </li>
          <li className="card p-4">
            <Link href="/tools/keyword-clustering-tool" prefetch={false} className="hover:underline">Keyword Clustering Tool</Link>
            <p className="text-sm text-slate-600 dark:text-slate-300">Group queries by topical themes.</p>
          </li>
          <li className="card p-4">
            <Link href="/tools/meta-tag-generator" prefetch={false} className="hover:underline">Meta Tag Generator</Link>
            <p className="text-sm text-slate-600 dark:text-slate-300">Draft clean titles and descriptions.</p>
          </li>
        </ul>
      </section>
    </div>
  );
}