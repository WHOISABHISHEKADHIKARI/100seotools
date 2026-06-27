"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUp, Search, X } from 'lucide-react';

export default function StickySearchBar({ onSearch }) {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          const heroBottom = document.querySelector('section')?.offsetHeight || 600;
          setVisible(window.scrollY > heroBottom - 80);
          ticking.current = false;
        });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    const toolSection = document.getElementById('tools');
    if (toolSection) {
      toolSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, [query, onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    if (onSearch) onSearch('');
    inputRef.current?.focus();
  }, [onSearch]);

  return (
    <div
      className={`fixed top-16 left-0 right-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md transition-all duration-300 dark:border-white/10 dark:bg-gray-950/95 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
      role="search"
      aria-label="Search tools"
    >
      <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
        <form onSubmit={handleSubmit} className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => {
              setQuery(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            placeholder="Search all 100+ SEO tools..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-24 text-base text-slate-900 placeholder-slate-400 shadow-sm transition-all focus:bg-white focus:outline-none dark:border-white/10 dark:bg-gray-900 dark:text-white dark:placeholder-slate-500 dark:focus:bg-gray-800"
            style={{
              borderColor: focused ? 'rgb(139, 92, 246)' : undefined,
              boxShadow: focused ? '0 4px 20px rgba(139, 92, 246, 0.15), 0 0 0 2px rgba(139, 92, 246, 0.25)' : '0 1px 3px rgba(0,0,0,0.05)',
            }}
            aria-label="Search SEO tools"
          />
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
            {query ? (
              <>
                <button
                  type="submit"
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-violet-600 text-white transition hover:bg-violet-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                  aria-label="Search"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <kbd className="hidden rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500 sm:inline-block dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                ⌘K
              </kbd>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
