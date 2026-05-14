"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, ChevronRight, Star, Users } from 'lucide-react';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';
import {
  getCategoryDetail,
  getMonthlyUse,
  getToolBadge,
  getToolInitial,
  shortToolName,
  visualColors,
} from './SeoVisuals';

const batchSize = 12;

function ToolGrid({ tools }) {
  const { favorites, actions } = useUserPreferences();
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const [mounted, setMounted] = useState(false);
  const loadMoreRef = useRef(null);

  const uniqueTools = useMemo(() => {
    const seen = new Set();
    return (tools || []).filter((tool, index) => {
      const key = tool?.slug ? `${tool.type || 'tool'}-${tool.slug}` : `tool-${index}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [tools]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setVisibleCount(batchSize);
  }, [uniqueTools]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || visibleCount >= uniqueTools.length) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((count) => Math.min(count + batchSize, uniqueTools.length));
        }
      },
      { rootMargin: '180px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [uniqueTools.length, visibleCount]);

  const toggleFavorite = useCallback((slug) => {
    if (mounted && slug) actions.toggleFavorite(slug);
  }, [actions, mounted]);

  const rememberTool = useCallback((tool) => {
    actions.addToHistory(tool);
  }, [actions]);

  const visibleTools = uniqueTools.slice(0, visibleCount);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleTools.map((tool, index) => (
          <ToolCard
            key={tool?.slug ? `${tool.type || 'tool'}-${tool.slug}` : `tool-${index}`}
            tool={tool}
            index={index}
            isFavorite={tool?.slug ? favorites.includes(tool.slug) : false}
            onToggleFavorite={toggleFavorite}
            onToolClick={rememberTool}
          />
        ))}
      </div>

      {visibleCount < uniqueTools.length && (
        <div ref={loadMoreRef} className="flex justify-center py-8">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => Math.min(count + batchSize, uniqueTools.length))}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-violet-600/20 transition hover:opacity-90"
          >
            Load more tools
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}
    </>
  );
}

function ToolCard({ tool, index, isFavorite, onToggleFavorite, onToolClick }) {
  const isBlog = tool?.type === 'blog';
  const title = shortToolName(tool?.name || tool?.title || 'Untitled Tool');
  const description = tool?.description || tool?.tldr || 'A free SEO utility built for quick, practical optimization work.';
  const category = getCategoryDetail(tool?.category);
  const Icon = category.icon;
  const color = visualColors[category.color] || visualColors.violet;
  const href = tool?.slug ? (isBlog ? `/blog/${tool.slug}` : `/tools/${tool.slug}`) : '#';
  const guideHref = tool?.slug ? `/blog/${tool.slug}-how-to-use` : '#';

  return (
    <article className={`group relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl dark:border-white/10 dark:bg-gray-900 ${color.border}`}>
      <div className={`h-1.5 bg-gradient-to-r ${color.bar}`} />
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <a
            href={href}
            onClick={() => onToolClick(tool)}
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${color.icon} text-lg font-extrabold shadow-sm`}
            aria-label={`Open ${title}`}
          >
            {getToolInitial(title)}
          </a>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${color.badge}`}>
              {isBlog ? 'Guide' : getToolBadge(tool, index)}
            </span>
            {!isBlog && (
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-yellow-200 hover:bg-yellow-50 hover:text-yellow-500 dark:border-white/10 dark:hover:bg-yellow-500/10"
                onClick={(event) => {
                  event.preventDefault();
                  onToggleFavorite(tool?.slug);
                }}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                aria-pressed={isFavorite}
              >
                <Star className={`h-4 w-4 ${isFavorite ? 'fill-current text-yellow-500' : ''}`} aria-hidden />
              </button>
            )}
          </div>
        </div>

        <a href={href} onClick={() => onToolClick(tool)} className="block">
          <h3 className="line-clamp-2 text-base font-extrabold leading-snug text-slate-900 transition group-hover:text-violet-700 dark:text-white dark:group-hover:text-violet-200">
            {title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </a>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {tool?.category || 'SEO Tool'}
          </span>
          {!isBlog && (
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" aria-hidden />
              {getMonthlyUse(index)}/mo
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-white/10">
          {!isBlog && tool?.slug && (
            <a
              href={guideHref}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden />
              Guide
            </a>
          )}
          <a
            href={href}
            onClick={() => onToolClick(tool)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-slate-950 px-3.5 py-2 text-xs font-extrabold text-white transition hover:bg-violet-700 dark:bg-white dark:text-slate-950 dark:hover:bg-violet-200"
          >
            {isBlog ? 'Read Guide' : 'Open Tool'}
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </article>
  );
}

export default memo(ToolGrid);
