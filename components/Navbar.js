"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { FiCompass, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';

// Categories surfaced in dropdown
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

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCatsOpen, setMobileCatsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <header className="py-4">
      <a href="#main" className="sr-only focus:not-sr-only focus:px-3 focus:py-2 focus:bg-brand-50 focus:rounded focus:outline-none" aria-label="Skip to main content">Skip to content</a>
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="Go to homepage">
          <FiCompass aria-hidden className="w-7 h-7 text-brand-500" />
          <span className="font-semibold text-lg">100 SEO Tools</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            className="md:hidden inline-flex items-center gap-2 px-3 py-2 rounded border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-gray-800"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <>
                <FiX aria-hidden className="w-5 h-5" />
                <span className="text-sm">Close</span>
              </>
            ) : (
              <>
                <FiMenu aria-hidden className="w-5 h-5" />
                <span className="text-sm">Menu</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Desktop navigation */}
      <nav aria-label="Primary navigation" className="hidden md:block mt-3">
        <ul className="flex items-center gap-4">
          <li>
            <Link href="/" className="text-sm hover:text-brand-600">Home</Link>
          </li>
          <li>
            <Link href="/blog" className="text-sm hover:text-brand-600">Blog</Link>
          </li>
          <li>
            <Link href="/sitemap.xml" className="text-sm hover:text-brand-600">Sitemap</Link>
          </li>
          <li className="relative" tabIndex={0} onBlur={() => setOpen(false)}>
            <button
              type="button"
              className="text-sm inline-flex items-center gap-1 hover:text-brand-600 focus:outline-none"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              Categories
              <FiChevronDown aria-hidden className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            {mounted && open && (
              <div
                role="menu"
                aria-label="Categories"
                className="absolute left-0 mt-2 w-64 max-h-72 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-white/10 dark:bg-gray-900 z-50"
              >
                <ul className="py-2 text-sm">
                  {categories.map((c) => (
                    <li key={c}>
                      <Link
                        href={`/category/${toSlug(c)}`}
                        className="block px-3 py-2 hover:bg-slate-50 hover:text-brand-600 dark:hover:bg-gray-800"
                        role="menuitem"
                        onClick={() => setOpen(false)}
                      >
                        {c}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        </ul>
      </nav>

      {/* Mobile menu panel */}
      {mounted && mobileOpen && (
        <div
          id="mobile-menu"
          role="menu"
          aria-label="Mobile navigation"
          className="md:hidden mt-3 rounded-lg border border-slate-200 bg-white dark:bg-gray-900 shadow-lg"
        >
          <ul className="p-3 space-y-2 text-sm">
            <li>
              <Link href="/" className="block px-2 py-1 hover:text-brand-600" onClick={() => setMobileOpen(false)}>Home</Link>
            </li>
            <li>
              <Link href="/blog" className="block px-2 py-1 hover:text-brand-600" onClick={() => setMobileOpen(false)}>Blog</Link>
            </li>
            <li>
              <Link href="/sitemap.xml" className="block px-2 py-1 hover:text-brand-600" onClick={() => setMobileOpen(false)}>Sitemap</Link>
            </li>
            <li>
              <button
                type="button"
                className="w-full text-left inline-flex items-center justify-between gap-2 px-2 py-1 rounded hover:bg-slate-50 dark:hover:bg-gray-800"
                aria-haspopup="menu"
                aria-expanded={mobileCatsOpen}
                onClick={() => setMobileCatsOpen((v) => !v)}
              >
                <span>Categories</span>
                <FiChevronDown aria-hidden className={`w-4 h-4 transition-transform ${mobileCatsOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileCatsOpen && (
                <div className="mt-2 max-h-60 overflow-auto rounded border border-slate-200 dark:border-white/10">
                  <ul className="py-1 text-sm">
                    {categories.map((c) => (
                      <li key={c}>
                        <Link
                          href={`/category/${toSlug(c)}`}
                          className="block px-3 py-2 hover:bg-slate-50 hover:text-brand-600 dark:hover:bg-gray-800"
                          role="menuitem"
                          onClick={() => {
                            setMobileOpen(false);
                            setMobileCatsOpen(false);
                          }}
                        >
                          {c}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}