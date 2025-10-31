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
  const [sortBy, setSortBy] = useState('Name A-Z');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Persist filters if needed
    const favOnly = localStorage.getItem('favoritesOnly');
    if (favOnly) setFavoritesOnly(favOnly === 'true');
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('favoritesOnly', String(favoritesOnly));
    }
  }, [favoritesOnly, mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    // Safely read favorites from localStorage on client
    try {
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (Array.isArray(favs)) setFavorites(favs);
    } catch (_) {
      setFavorites([]);
    }
  }, [mounted]);

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
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
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
    <div className="card p-4 space-y-4" role="search" aria-label="Filter and search tools">
      {/* Minimal toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-center">
        <div className="md:col-span-6">
          <div className="relative">
            <FiSearch aria-hidden className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="tool-search"
              type="search"
              className="input w-full pl-9 pr-9"
              placeholder="Search tools…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search tools"
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
        <div className="md:col-span-3">
          <select
            id="category-select"
            className="input w-full"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            {['All', ...categories].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <select
            id="sort-select"
            className="input w-full"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort tools"
          >
            {['Name A-Z', 'Name Z-A', 'Category'].map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-1 flex md:justify-end">
          <button
            className="btn-secondary inline-flex items-center justify-center w-full md:w-auto p-2"
            onClick={() => setFavoritesOnly((v) => !v)}
            aria-pressed={favoritesOnly}
            aria-label={favoritesOnly ? 'Show all tools' : 'Show only favorites'}
            title={favoritesOnly ? 'Showing favorites' : 'Show only favorites'}
          >
            <FiStar aria-hidden className={favoritesOnly ? 'text-yellow-500' : 'text-gray-400'} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs md:text-sm">
        <span aria-live="polite">{filteredCount} tools</span>
        <button
          type="button"
          className="btn-secondary inline-flex items-center gap-1 px-2 py-1"
          onClick={clearFilters}
          aria-label="Reset all filters"
          disabled={!hasActiveFilters}
        >
          <FiRefreshCw aria-hidden className="w-4 h-4" />
          <span className="hidden md:inline">Reset</span>
        </button>
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