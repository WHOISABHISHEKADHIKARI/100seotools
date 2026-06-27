"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Filter, RefreshCw, Search, Star, X } from 'lucide-react';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';
import { slugify } from '../../lib/utils';
import { categoryDetails } from './SeoVisuals';

const categories = categoryDetails.map((category) => category.label);

function useDebounce(value, delay = 220) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [delay, value]);

  return debouncedValue;
}

export default function SearchFilter({ tools, onChange, initialCategory = 'All' }) {
  const { favorites, preferences, actions } = useUserPreferences();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('Name A-Z');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    if (preferences.defaultCategory && initialCategory === 'All') setCategory(preferences.defaultCategory);
    if (preferences.defaultSortBy) setSortBy(preferences.defaultSortBy);
    if (preferences.showFavoritesOnly !== undefined) setFavoritesOnly(preferences.showFavoritesOnly);
  }, []);

  useEffect(() => {
    if (
      preferences.defaultCategory === category &&
      preferences.defaultSortBy === sortBy &&
      preferences.showFavoritesOnly === favoritesOnly
    ) {
      return;
    }

    actions.updatePreferences({
      defaultCategory: category,
      defaultSortBy: sortBy,
      showFavoritesOnly: favoritesOnly,
    });
  }, [actions, category, favoritesOnly, preferences.defaultCategory, preferences.defaultSortBy, preferences.showFavoritesOnly, sortBy]);

  const filteredTools = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    const list = (tools || []).filter((tool) => {
      if (tool.type && tool.type !== 'tool') return false;
      if (favoritesOnly && !favorites.includes(tool.slug)) return false;
      if (category !== 'All' && slugify(tool.category) !== slugify(category)) return false;
      if (!q) return true;
      return `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(q);
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'Name Z-A') return b.name.localeCompare(a.name);
      if (sortBy === 'Category') return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
  }, [category, debouncedQuery, favorites, favoritesOnly, sortBy, tools]);

  useEffect(() => {
    onChange?.(filteredTools);
  }, [filteredTools, onChange]);

  useEffect(() => {
    const value = debouncedQuery.trim();
    if (value) actions.addRecentSearch(value);
  }, [actions, debouncedQuery]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];

    const toolMatches = (tools || [])
      .filter((tool) => tool.name.toLowerCase().includes(q))
      .slice(0, 6)
      .map((tool) => ({ type: 'tool', label: tool.name.replace(/\s*\|.*/, ''), meta: tool.category }));

    const categoryMatches = ['All', ...categories]
      .filter((item) => item.toLowerCase().includes(q))
      .slice(0, 4)
      .map((item) => ({ type: 'category', label: item, meta: 'Category' }));

    return [...toolMatches, ...categoryMatches];
  }, [query, tools]);

  const clearFilters = useCallback(() => {
    setQuery('');
    setCategory('All');
    setSortBy('Name A-Z');
    setFavoritesOnly(false);
  }, []);

  const hasActiveFilters = Boolean(query.trim()) || category !== 'All' || favoritesOnly || sortBy !== 'Name A-Z';

  return (
    <div className="overflow-visible rounded-2xl border border-slate-100 bg-white p-3 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-gray-900" role="search" aria-label="Filter and search tools">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="relative lg:col-span-6">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            id="tool-search"
            type="search"
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-10 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-violet-500/20"
            placeholder="Search 100+ SEO tools..."
            value={query}
            autoComplete="off"
            onChange={(event) => {
              setQuery(event.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(query.trim().length >= 2)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
          />
          {query && (
            <button
              type="button"
              className="absolute right-3 top-1/2 grid min-h-[44px] min-w-[44px] -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          )}

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-gray-900">
              {suggestions.map((suggestion) => (
                <button
                  key={`${suggestion.type}-${suggestion.label}`}
                  type="button"
                  className="flex w-full items-center justify-between gap-4 border-b border-slate-50 px-4 py-3 text-left transition last:border-0 hover:bg-violet-50 dark:border-white/5 dark:hover:bg-white/10"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    if (suggestion.type === 'category') {
                      setCategory(suggestion.label);
                    } else {
                      setQuery(suggestion.label);
                    }
                    setShowSuggestions(false);
                  }}
                >
                  <span className="truncate text-sm font-semibold text-slate-800 dark:text-white">{suggestion.label}</span>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:bg-white/10 dark:text-slate-300">
                    {suggestion.meta}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <select
          className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100 lg:col-span-3 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-violet-500/20"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter by category"
        >
          {['All', ...categories].map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <select
          className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100 lg:col-span-2 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-violet-500/20"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          aria-label="Sort tools"
        >
          {['Name A-Z', 'Name Z-A', 'Category'].map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <button
          type="button"
          className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-extrabold transition lg:col-span-1 ${
            favoritesOnly
              ? 'border-yellow-200 bg-yellow-50 text-yellow-600 dark:border-yellow-400/30 dark:bg-yellow-400/10'
              : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
          }`}
          onClick={() => setFavoritesOnly((value) => !value)}
          aria-label={favoritesOnly ? 'Show all tools' : 'Show favorites'}
          aria-pressed={favoritesOnly}
        >
          <Star className={favoritesOnly ? 'fill-current' : ''} aria-hidden />
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Filter className="h-4 w-4" aria-hidden />
          <span aria-live="polite">
            <strong className="text-slate-800 dark:text-white">{filteredTools.length}</strong> tools found
          </span>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/10 dark:hover:text-white"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          Reset
        </button>
      </div>
    </div>
  );
}
