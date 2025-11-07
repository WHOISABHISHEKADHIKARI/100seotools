"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SearchFilter from '../components/SearchFilter';
import StructuredData from '../components/StructuredData';
import { getBaseUrl } from '../lib/site';
import { generateWebsiteSchema } from '../lib/schema';
import { getAllToolsMeta } from '../tools';

// Lazy load the ToolGrid component; avoid client-only fallback to prevent SSR mismatch
const ToolGrid = dynamic(() => import('../components/ToolGrid'), { ssr: false, loading: () => null });

// Defer BlogSection to idle to trim initial JS on homepage
const BlogSection = dynamic(() => import('../components/BlogSection'), { ssr: false, loading: () => null });

// Loading component for ToolGrid
function ToolGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="card card-interactive p-5 flex flex-col gap-4">
          {/* Header skeleton */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg loading-skeleton"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 loading-skeleton rounded w-3/4"></div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full loading-skeleton"></div>
          </div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-4 loading-skeleton rounded"></div>
            <div className="h-4 loading-skeleton rounded w-5/6"></div>
          </div>

          {/* Footer skeleton */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 mt-auto">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded loading-skeleton"></div>
              <div className="h-3 loading-skeleton rounded w-20"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 loading-skeleton rounded w-16"></div>
              <div className="h-4 loading-skeleton rounded w-12"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

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
      <div className="space-y-8">
        <section className="text-center space-y-3 py-8">
          <p className="text-2xl md:text-3xl font-bold">All Your SEO Tools in One Place</p>
          <p className="text-gray-600 dark:text-gray-400">Loading tools...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {(() => {
        const baseUrl = getBaseUrl();
        const websiteLd = generateWebsiteSchema(baseUrl);
        return <StructuredData data={websiteLd} />;
      })()}
      {/* Defer calculator mount until after first paint/idle to protect LCP */}
      <AfterFirstPaint>
        <SEOCalculator />
      </AfterFirstPaint>

      <section className="text-center space-y-3 py-8">
        <h1 className="text-2xl md:text-3xl font-bold">The Ultimate Suite of Free SEO Tools</h1>
        <p className="text-gray-600 dark:text-gray-400">Your complete collection of 100+ free, fast, and client-side SEO tools online. No login, no subscriptions—just powerful utilities for marketers, bloggers, and developers.</p>
      </section>

      {/* Expanded introduction for better content depth (250+ words) */}
      <section className="max-w-3xl mx-auto space-y-4 text-gray-700 dark:text-gray-300 min-h-[400px]">
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

      <SearchFilter tools={tools} onChange={setFilteredTools} />

      {/* Tools section with accessible heading to ensure sequential order (h1 -> h2 -> h3) */}
      <section aria-labelledby="tools-section-title">
        <h2 id="tools-section-title" className="sr-only">Tools</h2>
        <ToolGrid tools={filteredTools} />
      </section>

      {/* Blog Section */}
      {isIdle ? <BlogSection /> : null}
    </div>
  );
}
