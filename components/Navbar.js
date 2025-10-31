"use client";
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { FiCompass } from 'react-icons/fi';

export default function Navbar() {
  return (
    <header className="flex items-center justify-between py-4">
      <a href="#main" className="sr-only focus:not-sr-only focus:px-3 focus:py-2 focus:bg-brand-50 focus:rounded focus:outline-none" aria-label="Skip to main content">Skip to content</a>
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2" aria-label="Go to homepage">
          <FiCompass aria-hidden className="w-7 h-7 text-brand-500" />
          <span className="font-semibold text-lg">100 SEO Tools</span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden sm:block">
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
          </ul>
        </nav>
      </div>
      <ThemeToggle />
    </header>
  );
}