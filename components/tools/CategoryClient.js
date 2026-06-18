"use client";
import { useState, useMemo, useEffect } from 'react';
import SearchFilter from './SearchFilter';
import ToolGrid from './ToolGrid';
import UnifiedCard from '../ui/UnifiedCard';
import { ArrowLeft, ArrowRight, BarChart2, BookOpen, Database, Tag, LayoutGrid, RotateCcw } from 'lucide-react';

export default function CategoryClient({ items = [], catName, slug, initialPage = 1, pageSize = 6, relatedPosts = [] }) {
  const [filteredTools, setFilteredTools] = useState(items);
  const [page, setPage] = useState(Math.max(1, Number(initialPage) || 1));
  const [isLoading, setIsLoading] = useState(true);

  // Simulate progressive loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [filteredTools, page]);

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
    <div className="space-y-12">
      {/* ── FILTERING SECTION ── */}
      <section className="bg-white dark:bg-gray-900 rounded-[32px] border border-slate-100 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none p-6 md:p-8">
        <SearchFilter tools={items} onChange={setFilteredTools} initialCategory={catName} />

        <div className="mt-8 pt-6 border-t border-slate-50 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-200 dark:shadow-none">
              <LayoutGrid className="text-white w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Displaying</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">{totalTools} {toolsPlural} in {catName}</p>
            </div>
          </div>
          <button
            onClick={() => setFilteredTools(items)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-xs font-black hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset filters
          </button>
        </div>
      </section>

      {/* ── TOOLS GRID ── */}
      {filteredTools.length > 0 ? (
        <ToolGrid tools={filteredTools} />
      ) : (
        <div className="rounded-[32px] border-2 border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900 p-20 text-center">
          <LayoutGrid className="w-12 h-12 mx-auto mb-4 text-slate-200 dark:text-white/10" />
          <p className="font-black text-xl text-slate-900 dark:text-white mb-2">No tools match your filters</p>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">Try adjusting your search terms or clearing the active category filters.</p>
        </div>
      )}

      {/* ── RELATED ARTICLES ── */}
      <section aria-labelledby="related-articles" className="space-y-8 pt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-violet-600">Educational Resources</p>
            <h2 id="related-articles" className="text-3xl font-black text-slate-950 dark:text-white">Related Guides</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={currentPage <= 1}
              aria-label="Previous page"
              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goNext}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {visibleArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleArticles.map((post) => (
              <UnifiedCard
                key={post.slug}
                href={`/blog/${post.slug}`}
                title={post.title}
                description={post.description}
                category="Guide"
                readTime={post.readTimeMinutes ? `${post.readTimeMinutes} min read` : 'Deep Dive'}
                variant="article"
                loading={isLoading}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-[32px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-center">
            <p className="text-sm font-bold text-slate-500">No related articles found for this category yet.</p>
          </div>
        )}

        {/* Mobile Pagination */}
        <div className="flex sm:hidden items-center justify-between">
           <button onClick={goPrev} disabled={currentPage <= 1} className="px-6 py-3 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 text-xs font-black disabled:opacity-50">Prev</button>
           <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
           <button onClick={goNext} disabled={currentPage >= totalPages} className="px-6 py-3 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 text-xs font-black disabled:opacity-50">Next</button>
        </div>
      </section>

      {/* ── HELPFUL RESOURCES ── */}
      <section aria-labelledby="helpful-resources" className="space-y-8 pt-12 border-t border-slate-100 dark:border-white/5">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600">Advanced Workflow</p>
          <h2 id="helpful-resources" className="text-3xl font-black text-slate-950 dark:text-white">Helpful Resources</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            ['/seo-calculator', 'SEO Calculator', 'Estimate impact from improvements.', BarChart2, 'text-rose-600', 'bg-rose-50 dark:bg-rose-500/10'],
            ['/tools/structured-data-validator', 'Structured Data Validator', 'Check JSON-LD for common issues.', Database, 'text-emerald-600', 'bg-emerald-50 dark:bg-emerald-500/10'],
            ['/tools/keyword-clustering-tool', 'Keyword Clustering Tool', 'Group queries by topical themes.', BookOpen, 'text-violet-600', 'bg-violet-50 dark:bg-violet-500/10'],
            ['/tools/meta-tag-generator', 'Meta Tag Generator', 'Draft clean titles and descriptions.', Tag, 'text-amber-600', 'bg-amber-50 dark:bg-amber-500/10'],
          ].map(([href, title, desc, Icon, iconColor, iconBg]) => (
            <a key={href} href={href} className="group flex items-center gap-6 p-6 rounded-[28px] border border-slate-100 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
              <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${iconBg} ${iconColor} transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                <Icon className="w-6 h-6" />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block font-black text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors">{title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-500 dark:text-slate-400">{desc}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-200 group-hover:text-violet-600 transition-all group-hover:translate-x-1" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
