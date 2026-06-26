"use client";

import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

export default function StickySearchBar({ onSearch }) {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    const toolSection = document.getElementById('tools');
    if (toolSection) {
      toolSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
    inputRef.current?.focus();
  };

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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            placeholder="Search all 100+ SEO tools..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-200 dark:border-white/10 dark:bg-gray-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-violet-500 dark:focus:ring-violet-500/30"
            aria-label="Search SEO tools"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
