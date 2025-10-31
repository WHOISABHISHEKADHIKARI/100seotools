"use client";
import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  FiSearch,
  FiX,
  FiStar,
  FiRefreshCw,
  FiFilter,
  FiTag,
  FiLink,
  FiBarChart2,
  FiMapPin,
  FiUsers,
  FiCpu,
  FiTool
} from 'react-icons/fi';

const categories = [
  'Keyword Research',
  'On-Page Optimization',
  'Technical SEO',
  'Backlink & Link-Building',
  'Content SEO',
  'SEO Performance',
  'Local SEO',
  'Competitor Analysis',
  'AI-Powered SEO',
  'SEO Utility'
];

export default function SearchFilter({ tools, onChange }) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Relevance');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  useEffect(() => {
    // Persist filters if needed
    const favOnly = localStorage.getItem('favoritesOnly');
    if (favOnly) setFavoritesOnly(favOnly === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('favoritesOnly', String(favoritesOnly));
  }, [favoritesOnly]);

  useEffect(() => {
    // Safely read favorites from localStorage on client
    try {
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (Array.isArray(favs)) setFavorites(favs);
    } catch (_) {
      setFavorites([]);
    }
  }, []);

  // Debounce query to improve UX and reduce re-renders
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 150);
    return () => clearTimeout(id);
  }, [query]);

  const filteredTools = useMemo(() => {
    const list = tools.filter((t) => {
      if (favoritesOnly && !favorites.includes(t.slug)) return false;
      if (category !== 'All' && t.category !== category) return false;
      if (!debouncedQuery) return true;
      const hay = `${t.name} ${t.description}`.toLowerCase();
      return hay.includes(debouncedQuery.toLowerCase());
    });
    const sorted = [...list];
    switch (sortBy) {
      case 'Name A-Z':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Name Z-A':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Category':
        sorted.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
        break;
      case 'Relevance':
      default:
        // Keep natural order (e.g., as defined in tools index)
        break;
    }
    return sorted;
  }, [tools, debouncedQuery, category, favoritesOnly, favorites, sortBy]);

  const filteredCount = filteredTools.length;

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(filteredTools);
    }
  }, [filteredTools, onChange]);

  const clearQuery = useCallback(() => setQuery(''), []);
  const clearFilters = useCallback(() => {
    setQuery('');
    setCategory('All');
    setFavoritesOnly(false);
  }, []);

  const onCategoryKeyDown = useCallback((e) => {
    const cats = ['All', ...categories];
    const idx = cats.indexOf(category);
    if (e.key === 'ArrowRight') {
      const next = cats[(idx + 1) % cats.length];
      setCategory(next);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      const prev = cats[(idx - 1 + cats.length) % cats.length];
      setCategory(prev);
      e.preventDefault();
    }
  }, [category]);

  const hasActiveFilters = favoritesOnly || category !== 'All' || (debouncedQuery && debouncedQuery.trim().length > 0);

  // Icons per category to visually distinguish filter chips
  const categoryIconMap = {
    All: FiFilter,
    'Keyword Research': FiSearch,
    'On-Page Optimization': FiTag,
    'Technical SEO': FiTool,
    'Backlink & Link-Building': FiLink,
    'Content SEO': FiTag,
    'SEO Performance': FiBarChart2,
    'Local SEO': FiMapPin,
    'Competitor Analysis': FiUsers,
    'AI-Powered SEO': FiCpu,
    'SEO Utility': FiTool
  };

  return (
    <div className="card p-6 space-y-5" role="search" aria-label="Filter and search tools">
      <div className="flex items-center justify-between gap-3 sticky top-2 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-md px-3 py-2">
        <div className="space-y-1">
          <h2 className="text-lg md:text-xl font-semibold">Find Tools</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Filter by category, favorites, or search by name/description.</p>
        </div>
        <div className="inline-flex items-center gap-2 text-sm">
          <span className="rounded-full px-2 py-1 bg-gray-100 dark:bg-gray-800">{filteredCount} tools</span>
          <button
            type="button"
            className="btn-secondary px-3 py-1"
            onClick={clearFilters}
            aria-label="Reset all filters"
            disabled={!hasActiveFilters}
          >
            <FiRefreshCw aria-hidden className="w-4 h-4" />
            Reset
          </button>
          <button
            type="button"
            className="btn-secondary px-3 py-1 md:hidden"
            onClick={() => setShowFiltersMobile((v) => !v)}
            aria-expanded={showFiltersMobile}
            aria-controls="filters-mobile"
          >
            <FiFilter aria-hidden className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        <div>
          <label htmlFor="tool-search" className="block text-sm mb-1">Search tools</label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Search by tool name or description.</p>
          <div className="relative">
            <FiSearch aria-hidden className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="tool-search"
              type="search"
              className="input w-full pl-9 pr-10"
              placeholder="Search tools…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search tools by name or description"
            />
            {query && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={clearQuery}
                aria-label="Clear search"
              >
                <FiX aria-hidden className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        <div className={showFiltersMobile ? '' : 'hidden md:block'} id="filters-mobile">
          <span className="block text-sm mb-1">Category</span>
          {/* Mobile: Horizontal chips */}
          <div
            className="md:hidden -mx-1 overflow-x-auto whitespace-nowrap snap-x snap-mandatory pb-1"
            role="radiogroup"
            aria-label="Filter by category"
          >
            {['All', ...categories].map((c) => {
              const active = category === c;
              const Icon = categoryIconMap[c] || FiTool;
              return (
                <button
                  key={c}
                  type="button"
                  className={(active ? 'btn ' : 'btn-secondary ') + 'inline-flex items-center gap-2 px-3 py-1 text-sm mx-1 snap-start transition-colors'}
                  onClick={() => setCategory(c)}
                  role="radio"
                  aria-checked={active}
                  aria-label={`Category ${c}`}
                >
                  <Icon aria-hidden className="w-4 h-4" />
                  {c}
                </button>
              );
            })}
          </div>
          {/* Desktop: Chips */}
          <div
            className="hidden md:flex w-full gap-2 min-w-0 md:flex-wrap"
            role="radiogroup"
            aria-label="Filter by category"
            onKeyDown={onCategoryKeyDown}
          >
              {['All', ...categories].map((c) => {
                const active = category === c;
                const Icon = categoryIconMap[c] || FiTool;
                return (
                  <button
                    key={c}
                    type="button"
                    className={(active ? 'btn ' : 'btn-secondary ') + 'inline-flex items-center gap-2 max-w-full px-3 py-1 text-sm whitespace-normal break-words text-center transition-colors'}
                    onClick={() => setCategory(c)}
                    role="radio"
                    aria-checked={active}
                    aria-label={`Category ${c}`}
                  >
                    <Icon aria-hidden className="w-4 h-4" />
                    {c}
                  </button>
                );
              })}
          </div>
        </div>
      <div className={(showFiltersMobile ? '' : 'hidden md:flex') + ' flex items-center gap-3 flex-wrap md:justify-end md:self-start flex-shrink-0'}>
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-sm">Sort</label>
            <select
              id="sort-select"
              className="input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort tools"
            >
              {['Relevance', 'Name A-Z', 'Name Z-A', 'Category'].map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <button
            className="btn-secondary inline-flex items-center gap-2"
            onClick={() => setFavoritesOnly((v) => !v)}
            aria-pressed={favoritesOnly}
            aria-label={favoritesOnly ? 'Show all tools' : 'Show only favorites'}
          >
            <FiStar aria-hidden className={favoritesOnly ? 'text-yellow-500' : 'text-gray-400'} />
            {favoritesOnly ? 'Show All' : 'Show Favorites'}
          </button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 text-sm" aria-live="polite">
          <span className="text-gray-600 dark:text-gray-400">Active filters:</span>
          {debouncedQuery && debouncedQuery.trim() && (
            <button
              type="button"
              onClick={clearQuery}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800"
              aria-label="Clear search filter"
            >
              “{debouncedQuery}” <FiX aria-hidden className="w-3 h-3" />
            </button>
          )}
          {category !== 'All' && (
            <button
              type="button"
              onClick={() => setCategory('All')}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800"
              aria-label="Clear category filter"
            >
              {category} <FiX aria-hidden className="w-3 h-3" />
            </button>
          )}
          {favoritesOnly && (
            <button
              type="button"
              onClick={() => setFavoritesOnly(false)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800"
              aria-label="Clear favorites filter"
            >
              Favorites <FiX aria-hidden className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}