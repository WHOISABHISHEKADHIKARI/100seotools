"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from '../ui/ThemeToggle';
import { FiCompass, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { slugify } from '../../lib/utils';

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
  'SEO Utility',
  'Schema & Structured Data'
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openCalc, setOpenCalc] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCatsOpen, setMobileCatsOpen] = useState(false);
  const [mobileCalcOpen, setMobileCalcOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);
  const calcDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const calculators = [
    { name: 'SEO Calculator', href: '/seo-calculator' },
    { name: 'SEO Cost Calculator', href: '/seo-cost-calculator' }
  ];

  useEffect(() => setMounted(true), []);

  // Close mobile menus when route changes (ensures menu closes after navigation)
  useEffect(() => {
    if (mobileOpen || mobileCatsOpen || mobileCalcOpen) {
      setMobileOpen(false);
      setMobileCatsOpen(false);
      setMobileCalcOpen(false);
    }
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (open && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (openCalc && calcDropdownRef.current && !calcDropdownRef.current.contains(event.target)) {
        setOpenCalc(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, openCalc]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!mobileOpen) return;

    function handleClickOutside(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileOpen]);

  // Handle escape key press
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.key === 'Escape') {
        if (open) setOpen(false);
        if (openCalc) setOpenCalc(false);
        if (mobileOpen) setMobileOpen(false);
        if (mobileCatsOpen) setMobileCatsOpen(false);
        if (mobileCalcOpen) setMobileCalcOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [open, openCalc, mobileOpen, mobileCatsOpen, mobileCalcOpen]);

  return (
    <header className="sticky top-0 z-40 py-3 backdrop-blur bg-white/80 dark:bg-gray-950/80 border-b border-slate-200 dark:border-white/10">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="Go to homepage">
          <FiCompass aria-hidden="true" className="w-7 h-7 text-brand-500" />
          <span className="font-semibold text-lg">100 SEO Tools</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            className="md:hidden inline-flex items-center gap-2 px-3 py-2 rounded border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <>
                <FiX aria-hidden="true" className="w-5 h-5" />
                <span className="text-sm">Close</span>
              </>
            ) : (
              <>
                <FiMenu aria-hidden="true" className="w-5 h-5" />
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
            <Link
              href="/"
              aria-current={pathname === '/' ? 'page' : undefined}
              prefetch={false}
              className={`text-sm hover:text-brand-600 focus:outline-none focus:underline ${pathname === '/' ? 'text-brand-600 font-medium' : ''}`}
            >Home</Link>
          </li>
          <li>
            <Link
              href="/blog"
              aria-current={pathname?.startsWith('/blog') ? 'page' : undefined}
              prefetch={false}
              className={`text-sm hover:text-brand-600 focus:outline-none focus:underline ${pathname?.startsWith('/blog') ? 'text-brand-600 font-medium' : ''}`}
            >Blog</Link>
          </li>
          <li>
            <Link
              href="/contact"
              aria-current={pathname === '/contact' ? 'page' : undefined}
              prefetch={false}
              className={`text-sm hover:text-brand-600 focus:outline-none focus:underline ${pathname === '/contact' ? 'text-brand-600 font-medium' : ''}`}
            >Contact</Link>
          </li>
          <li className="relative" ref={dropdownRef}>
            <button
              type="button"
              className="text-sm inline-flex items-center gap-1 hover:text-brand-600 focus:outline-none focus:underline"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setOpen((v) => !v);
                }
              }}
            >
              Categories
              <FiChevronDown aria-hidden="true" className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
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
                        href={`/category/${slugify(c)}`}
                        prefetch={false}
                        className="block px-3 py-2 hover:bg-slate-50 hover:text-brand-600 dark:hover:bg-gray-800 focus:outline-none focus:bg-slate-50 focus:text-brand-600 dark:focus:bg-gray-800"
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
          <li className="relative" ref={calcDropdownRef}>
            <button
              type="button"
              className="text-sm inline-flex items-center gap-1 hover:text-brand-600 focus:outline-none focus:underline"
              aria-haspopup="menu"
              aria-expanded={openCalc}
              onClick={() => setOpenCalc((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setOpenCalc((v) => !v);
                }
              }}
            >
              Calculators
              <FiChevronDown aria-hidden="true" className={`w-4 h-4 transition-transform ${openCalc ? 'rotate-180' : ''}`} />
            </button>
            {mounted && openCalc && (
              <div
                role="menu"
                aria-label="Calculators"
                className="absolute left-0 mt-2 w-64 max-h-72 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg dark:border-white/10 dark:bg-gray-900 z-50"
              >
                <ul className="py-2 text-sm">
                  {calculators.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block px-3 py-2 hover:bg-slate-50 hover:text-brand-600 dark:hover:bg-gray-800 focus:outline-none focus:bg-slate-50 focus:text-brand-600 dark:focus:bg-gray-800"
                        role="menuitem"
                        onClick={() => setOpenCalc(false)}
                      >
                        {item.name}
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
          ref={mobileMenuRef}
        >
          <ul className="p-3 space-y-2 text-sm">
            <li>
              <Link href="/" aria-current={pathname === '/' ? 'page' : undefined} className="block px-2 py-1 hover:text-brand-600 focus:outline-none focus:bg-slate-50 focus:text-brand-600 dark:focus:bg-gray-800 rounded" onClick={() => setMobileOpen(false)}>Home</Link>
            </li>
            <li>
              <Link href="/blog" aria-current={pathname?.startsWith('/blog') ? 'page' : undefined} className="block px-2 py-1 hover:text-brand-600 focus:outline-none focus:bg-slate-50 focus:text-brand-600 dark:focus:bg-gray-800 rounded" onClick={() => setMobileOpen(false)}>Blog</Link>
            </li>
            <li>
              <Link href="/contact" aria-current={pathname === '/contact' ? 'page' : undefined} className="block px-2 py-1 hover:text-brand-600 focus:outline-none focus:bg-slate-50 focus:text-brand-600 dark:focus:bg-gray-800 rounded" onClick={() => setMobileOpen(false)}>Contact</Link>
            </li>
            <li>
              <button
                type="button"
                className="w-full text-left inline-flex items-center justify-between gap-2 px-2 py-1 rounded hover:bg-slate-50 dark:hover:bg-gray-800 focus:outline-none focus:bg-slate-50 focus:text-brand-600 dark:focus:bg-gray-800"
                aria-haspopup="menu"
                aria-expanded={mobileCatsOpen}
                onClick={() => setMobileCatsOpen((v) => !v)}
              >
                <span>Categories</span>
                <FiChevronDown aria-hidden="true" className={`w-4 h-4 transition-transform ${mobileCatsOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileCatsOpen && (
                <div className="mt-2 max-h-60 overflow-auto rounded border border-slate-200 dark:border-white/10">
                  <ul className="py-1 text-sm">
                    {categories.map((c) => (
                      <li key={c}>
                        <Link
                          href={`/category/${slugify(c)}`}
                          className="block px-3 py-2 hover:bg-slate-50 hover:text-brand-600 dark:hover:bg-gray-800 focus:outline-none focus:bg-slate-50 focus:text-brand-600 dark:focus:bg-gray-800"
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
            <li>
              <button
                type="button"
                className="w-full text-left inline-flex items-center justify-between gap-2 px-2 py-1 rounded hover:bg-slate-50 dark:hover:bg-gray-800 focus:outline-none focus:bg-slate-50 focus:text-brand-600 dark:focus:bg-gray-800"
                aria-haspopup="menu"
                aria-expanded={mobileCalcOpen}
                onClick={() => setMobileCalcOpen((v) => !v)}
              >
                <span>Calculators</span>
                <FiChevronDown aria-hidden="true" className={`w-4 h-4 transition-transform ${mobileCalcOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileCalcOpen && (
                <div className="mt-2 max-h-60 overflow-auto rounded border border-slate-200 dark:border-white/10">
                  <ul className="py-1 text-sm">
                    {calculators.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="block px-3 py-2 hover:bg-slate-50 hover:text-brand-600 dark:hover:bg-gray-800 focus:outline-none focus:bg-slate-50 focus:text-brand-600 dark:focus:bg-gray-800"
                          role="menuitem"
                          onClick={() => {
                            setMobileOpen(false);
                            setMobileCalcOpen(false);
                          }}
                        >
                          {item.name}
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
