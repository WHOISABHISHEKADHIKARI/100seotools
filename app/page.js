"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SearchFilter from '../components/SearchFilter';
import StructuredData from '../components/StructuredData';
import { getBaseUrl } from '../lib/site';
import { generateWebsiteSchema } from '../lib/schema';
import { getAllToolsMeta } from '../tools';
import BlogGrid from '../components/BlogGrid';
import PageLinksGrid from '../components/PageLinksGrid';

// Lazy load the ToolGrid component; avoid client-only fallback to prevent SSR mismatch
const ToolGrid = dynamic(() => import('../components/ToolGrid'), { ssr: false, loading: () => null });

// (Deprecated here) BlogSection was used previously; replaced by BlogGrid directly below Tools.

// Loading skeleton removed: ToolGrid now defers loading without a heavy placeholder

const SEOCalculator = dynamic(() => import('../components/SEOCalculator'), {
  ssr: false,
  loading: () => (
    <div className="card p-4 max-w-3xl mx-auto">
      <p className="text-sm text-slate-600 dark:text-slate-300">Loading SEO Calculator…</p>
    </div>
  )
});

// Mount children after first paint/idle to avoid impacting LCP
function AfterFirstPaint({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const run = () => setMounted(true);
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      // Give the browser a short idle window before mounting
      window.requestIdleCallback(run, { timeout: 200 });
    } else {
      // Fallback – next tick
      setTimeout(run, 0);
    }
  }, []);
  if (!mounted) return null;
  return children;
}

export default function HomePage() {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    // Get tools on the client side to avoid hydration mismatch
    const allTools = getAllToolsMeta();
    setTools(allTools);
    setFilteredTools(allTools);
    setIsLoaded(true);
  }, []);

  // Removed predictive prefetch to avoid navigation races and ERR_ABORTED in dev

  // Gate non-critical homepage content behind idle time
  useEffect(() => {
    const onIdle = () => setIsIdle(true);
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(onIdle, { timeout: 2000 });
      return () => window.cancelIdleCallback && window.cancelIdleCallback(id);
    } else {
      const t = setTimeout(onIdle, 2000);
      return () => clearTimeout(t);
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto px-4">
        <section className="text-center space-y-4 py-10">
          <p className="text-2xl md:text-3xl font-bold">All Your SEO Tools in One Place</p>
          <p className="text-gray-600 dark:text-gray-400">Loading tools...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4">
      {(() => {
        const baseUrl = getBaseUrl();
        const websiteLd = generateWebsiteSchema(baseUrl);
        return <StructuredData data={websiteLd} />;
      })()}
      {/* Tools section placed at the very top */}
      <section id="tools" aria-labelledby="tools-section-title" className="space-y-6">
        <div className="sticky top-0 z-40 supports-[backdrop-filter]:backdrop-blur bg-white/95 dark:bg-gray-950/95 border-b border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h2 id="tools-section-title" className="text-2xl md:text-3xl font-bold tracking-tight">
                The Ultimate Suite of Free SEO Tools
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 max-w-3xl">
                100+ free, fast, client‑side tools for marketers, bloggers, developers, agencies, and SMBs — no login, no subscriptions.
                Inspired by <span className="font-semibold">Small SEO Tools</span>, refined for speed, accuracy, and crawler accessibility.
                Explore the best <span className="font-semibold">Free SEO Tools</span> to audit pages, generate metadata, validate schema, analyze headings, and more.
              </p>
            </div>
            <a href="#calculator" className="shrink-0 text-sm text-blue-700 dark:text-blue-400 hover:underline">Go to Calculator</a>
          </div>
        </div>
        <div className="pt-2">
          <SearchFilter tools={tools} onChange={setFilteredTools} />
        </div>
        <ToolGrid tools={filteredTools} />
      </section>

      {/* Blog section positioned directly below Tools */}
      <section id="blog" className="space-y-6">
        <BlogGrid />
      </section>

      {/* Hero with clear CTAs; now placed after Tools */}
      <section className="text-center space-y-5 py-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          100% Free SEO Tools — Fast, Accurate, Search‑Optimized
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          A comprehensive suite of top‑performing, search‑friendly tools built for real‑world SEO. Completely free, client‑side, and tuned for speed—no logins, no subscriptions.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="#tools" className="btn transition-all duration-200 hover:scale-[1.02]">
            Explore Tools
          </a>
          <a href="#calculator" className="btn btn-outline transition-all duration-200 hover:scale-[1.02]">
            Try Calculator
          </a>
        </div>
      </section>

      {/* Expanded introduction for better content depth (250+ words) */}
      <section className="max-w-3xl mx-auto space-y-4 text-gray-700 dark:text-gray-300">
        <p className="font-loading-fallback">
          Welcome to 100 SEO Tools — your destination for a comprehensive collection of browser-based utilities designed to streamline your optimization workflow. Our suite of **free SEO tools** helps you tackle everything from content strategy to technical analysis without installing software or connecting accounts. Whether you're a seasoned digital marketer or just starting, you'll find the right **SEO tools** to get the job done. Everything runs client-side, ensuring your data stays private and performance remains fast.
        </p>
        <p className="font-loading-fallback">
          Dive into our practical helpers, including a powerful **keyword research tool** that helps you uncover valuable opportunities and assess **keyword difficulty**. Perform in-depth **competitor analysis SEO** to gain an edge, or run a complete technical **SEO audit tool** to identify and fix issues. Our toolkit also features a reliable **backlink checker** and an intuitive **rank tracker** to monitor your progress. From metadata generation to schema validation and internal linking, our **seo tools online** are built for efficiency. Each tool delivers immediate results, making it easy to test ideas, standardize outputs, and collaborate with your team. We believe these are some of the **best seo tools 2025** will have to offer.
        </p>
        <p className="font-loading-fallback">
          The experience is tuned for speed, with a lightweight UI and thoughtful accessibility features. No sign-ups or paywalls—just reliable utilities that help you publish better content. New to SEO? Start with our Meta Tag Generator and Heading Analyzer. Optimizing at scale? Try the Keyword Clustering Tool and Local Schema Builder. We are constantly iterating to keep the interface simple, the results transparent, and our tools genuinely helpful for real-world publishing.
        </p>
      </section>

      {/* Calculator section deferred to protect LCP but visually near top */}
      <section id="calculator" className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-semibold">SEO Calculator</h2>
        <AfterFirstPaint>
          <div className="calculator-container content-transition">
            <SEOCalculator />
          </div>
        </AfterFirstPaint>
      </section>

      {/* (Removed) Old BlogSection deferred to idle; replaced by BlogGrid above */}

      {/* Pages section: clear visual separation, below current content */}
      <section id="pages" aria-labelledby="pages-section-title" className="space-y-4 pt-8 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h2 id="pages-section-title" className="text-2xl md:text-3xl font-semibold">Explore Pages</h2>
          <a href="#tools" className="text-sm text-blue-700 dark:text-blue-400 hover:underline">Back to Tools</a>
        </div>
        <PageLinksGrid />
      </section>
    </div>
  );
}
