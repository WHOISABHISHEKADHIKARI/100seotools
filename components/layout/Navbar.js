"use client";

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, Compass, Menu, Search, X, Zap } from 'lucide-react';
import { categoryDetails, getCategoryHref } from '../tools/SeoVisuals';

const navItems = [
  { label: 'Tools', href: '/#tools' },
  { label: 'Blog', href: '/blog' },
  { label: 'Guides', href: '/blog/seo-basics' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
    setCategoriesOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onOutsideClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCategoriesOpen(false);
      }
    }

    document.addEventListener('mousedown', onOutsideClick);
    return () => document.removeEventListener('mousedown', onOutsideClick);
  }, []);

  return (
    <>
      <div className="relative left-1/2 w-screen -translate-x-1/2 border-b border-slate-200 bg-[linear-gradient(90deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-2 text-center text-xs font-semibold text-slate-700 dark:border-white/10 dark:bg-[linear-gradient(90deg,#020617_0%,#111827_100%)] dark:text-slate-200">
        All 100+ SEO tools are free, fast, and ready to use.{' '}
        <a href="/tools" className="text-indigo-700 underline decoration-indigo-300 underline-offset-4 hover:text-indigo-900 dark:text-indigo-200 dark:decoration-indigo-400/50 dark:hover:text-white">
          Browse the toolkit
        </a>
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-gray-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
          <a href="/" className="flex shrink-0 items-center gap-2" aria-label="Go to homepage">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950">
              <Compass className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-slate-950 dark:text-white">
              100SEO<span className="text-indigo-600 dark:text-indigo-300">Tools</span>
            </span>
          </a>

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-indigo-200"
                aria-haspopup="menu"
                aria-expanded={categoriesOpen}
                onClick={() => setCategoriesOpen((value) => !value)}
              >
                Categories
                <ChevronDown className={`h-4 w-4 transition ${categoriesOpen ? 'rotate-180' : ''}`} aria-hidden />
              </button>

              {categoriesOpen && (
                <div
                  role="menu"
                  aria-label="Tool categories"
                  className="absolute left-0 top-full mt-2 w-[22rem] overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10 dark:border-white/10 dark:bg-gray-900"
                >
                  <a
                    href="/category"
                    className="mb-2 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-indigo-700 dark:bg-white/5 dark:text-indigo-200"
                    role="menuitem"
                  >
                    View all categories
                    <Zap className="h-3.5 w-3.5" aria-hidden />
                  </a>
                  <div className="grid grid-cols-1 gap-1">
                    {categoryDetails.map((category) => {
                      const Icon = category.icon;
                      return (
                        <a
                          key={category.label}
                          href={getCategoryHref(category.label)}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-indigo-200"
                          role="menuitem"
                        >
                          <Icon className="h-4 w-4 shrink-0" aria-hidden />
                          <span className="font-medium">{category.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-slate-100 hover:text-indigo-700 dark:hover:bg-white/10 dark:hover:text-indigo-200 ${
                  pathname === item.href ? 'text-indigo-700 dark:text-indigo-200' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href="/tools"
              aria-label="Search tools"
              className="grid h-10 w-10 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-white/10"
            >
              <Search className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="/tools"
              className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
            >
              Get Started Free
            </a>
          </div>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-700 md:hidden dark:border-white/10 dark:text-white"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 shadow-xl md:hidden dark:border-white/10 dark:bg-gray-950">
            <div className="mx-auto grid max-w-7xl gap-1">
              <a href="/category" className="rounded-lg px-3 py-2.5 text-sm font-bold text-indigo-700 dark:text-indigo-200">
                Categories
              </a>
              {categoryDetails.slice(0, 6).map((category) => (
                <a
                  key={category.label}
                  href={getCategoryHref(category.label)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-white/10"
                >
                  {category.label}
                </a>
              ))}
              <div className="my-2 border-t border-slate-100 dark:border-white/10" />
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
