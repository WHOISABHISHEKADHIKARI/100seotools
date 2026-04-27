"use client";
import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';
import { slugify } from '../../lib/utils';
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
  FiTool,
  FiLoader,
  FiBookOpen
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
  'SEO Utility',
  'Schema & Structured Data'
];

// Custom hook for debounced value
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchFilter({ tools, onChange, initialCategory = 'All' }) {
  const { favorites, preferences, actions } = useUserPreferences();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('Name A-Z');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef(null);

  // Use debounced query for filtering
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    setMounted(true);
    // Initialize from user preferences only once on mount
    if (preferences.showFavoritesOnly !== undefined) {
      setFavoritesOnly(preferences.showFavoritesOnly);
    }
    if (preferences.defaultCategory && initialCategory === 'All') {
      setCategory(preferences.defaultCategory);
    }
    if (preferences.defaultSortBy) {
      setSortBy(preferences.defaultSortBy);
    }
  }, []); // Only run once on mount

  useEffect(() => {
    if (mounted) {
      actions.updatePreferences({
        showFavoritesOnly: favoritesOnly,
        defaultCategory: category,
        defaultSortBy: sortBy
      });
    }
  }, [favoritesOnly, category, sortBy, mounted]);

  // Show searching indicator when query changes but debounced query hasn't caught up
  useEffect(() => {
    if (query !== debouncedQuery) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [query, debouncedQuery]);

  const filteredTools = useMemo(() => {
    // Only show items of type 'tool' in this grid
    const list = tools.filter((t) => {
      // If type is present, only show tools. If type is missing, assume it's a tool.
      if (t.type && t.type !== 'tool') return false;
      if (favoritesOnly && !favorites.includes(t.slug)) return false;
      
      // Handle category filtering
      if (category !== 'All' && t.category !== category) {
        // Fallback: check if slugified categories match
        if (slugify(t.category) !== slugify(category)) {
          return false;
        }
      }

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

  // Build suggestions from tool names and categories
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];
    const nameMatches = tools
      .filter(t => t.name.toLowerCase().includes(q))
      .slice(0, 8)
      .map(t => ({ type: 'tool', text: t.name, slug: t.slug, category: t.category }));
    const categoryMatches = ['All', ...categories]
      .filter(c => c.toLowerCase().includes(q))
      .slice(0, 4)
      .map(c => ({ type: 'category', text: c }));
    return [...nameMatches, ...categoryMatches];
  }, [query, tools]);

  // Memoize the onChange call to prevent infinite loops
  const handleFilterChange = useCallback(() => {
    if (typeof onChange === 'function') {
      onChange(filteredTools);
    }
  }, [filteredTools, onChange]);

  useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]);

  // Track search queries when they change
  useEffect(() => {
    if (debouncedQuery && debouncedQuery.trim().length > 0) {
      actions.addRecentSearch(debouncedQuery.trim());
    }
  }, [debouncedQuery]);

  const clearQuery = useCallback(() => {
    setQuery('');
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  }, []);
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
    'Schema & Structured Data': FiBookOpen,
    'SEO Utility': FiTool
  };

  return (
    <div className="card p-4 space-y-4" role="search" aria-label="Filter and search tools">
      {/* Minimal toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3 items-center">
        <div className="md:col-span-6">
          <div className="relative">
            {isSearching && (
              <FiLoader aria-hidden className="pointer-events-none w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
            )}
            <input
              id="tool-search"
              type="search"
              className="input w-full pl-12 pr-10"
              placeholder="Search tools…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
                setActiveSuggestionIndex(-1);
              }}
              aria-label="Search tools"
              autoComplete="off"
              onFocus={() => {
                if (query.trim().length >= 2) setShowSuggestions(true);
              }}
              onBlur={() => {
                // Slight delay so clicks on suggestions can register
                setTimeout(() => setShowSuggestions(false), 120);
              }}
              onKeyDown={(e) => {
                if (!showSuggestions || suggestions.length === 0) return;
                if (e.key === 'ArrowDown') {
                  setActiveSuggestionIndex((i) => Math.min(i + 1, suggestions.length - 1));
                  e.preventDefault();
                } else if (e.key === 'ArrowUp') {
                  setActiveSuggestionIndex((i) => Math.max(i - 1, 0));
                  e.preventDefault();
                } else if (e.key === 'Enter' && activeSuggestionIndex >= 0) {
                  const s = suggestions[activeSuggestionIndex];
                  if (s.type === 'category') {
                    setCategory(s.text);
                  } else {
                    setQuery(s.text);
                  }
                  setShowSuggestions(false);
                  setActiveSuggestionIndex(-1);
                  e.preventDefault();
                } else if (e.key === 'Escape') {
                  setShowSuggestions(false);
                  setActiveSuggestionIndex(-1);
                }
              }}
              ref={inputRef}
            />
            {query && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                onClick={clearQuery}
                aria-label="Clear search"
              >
                <FiX aria-hidden className="w-4 h-4" />
              </button>
            )}

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                className="absolute left-0 right-0 mt-2 z-20 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-lg"
                role="listbox"
                aria-label="Search suggestions"
                onMouseDown={(e) => e.preventDefault()}
              >
                {suggestions.map((s, idx) => (
                  <div
                    key={`${s.type}:${s.text}:${s.slug || ''}`}
                    className={`flex items-center justify-between w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-white/5 ${idx === activeSuggestionIndex ? 'bg-slate-50 dark:bg-white/10' : ''}`}
                    onClick={() => {
                      if (s.type === 'category') {
                        setCategory(s.text);
                      } else {
                        setQuery(s.text);
                      }
                      setShowSuggestions(false);
                      setActiveSuggestionIndex(-1);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (s.type === 'category') {
                          setCategory(s.text);
                        } else {
                          setQuery(s.text);
                        }
                        setShowSuggestions(false);
                        setActiveSuggestionIndex(-1);
                      }
                    }}
                    role="option"
                    aria-selected={idx === activeSuggestionIndex}
                    tabIndex={0}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-sm truncate">
                        {s.type === 'category' ? `Category: ${s.text}` : s.text}
                      </span>
                    </div>
                    {s.type !== 'category' && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 shrink-0 ml-2">{s.category}</span>
                    )}
                  </div>
                ))}
              </div>
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
            onKeyDown={onCategoryKeyDown}
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
            className="btn-secondary inline-flex items-center justify-center w-full md:w-auto p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
          className="btn-secondary inline-flex items-center gap-1 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Clear search filter"
            >
              "{debouncedQuery}" <FiX aria-hidden className="w-3 h-3" />
            </button>
          )}
          {category !== 'All' && (
            <button
              type="button"
              onClick={() => setCategory('All')}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Clear category filter"
            >
              {category} <FiX aria-hidden className="w-3 h-3" />
            </button>
          )}
          {favoritesOnly && (
            <button
              type="button"
              onClick={() => setFavoritesOnly(false)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Clear favorites filter"
            >
              Favorites <FiX aria-hidden className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {filteredCount === 0 && hasActiveFilters && (
        <div className="py-4" aria-live="assertive">
          <div className="text-center py-8">
            <FiSearch className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No tools found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {debouncedQuery
                ? `No results for "${debouncedQuery}". Try adjusting your search or filters.`
                : 'No tools match your current filters. Try adjusting your selection.'
              }
            </p>
            <button
              onClick={clearFilters}
              className="btn"
              aria-label="Clear all filters"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" aria-hidden />
              Clear all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
