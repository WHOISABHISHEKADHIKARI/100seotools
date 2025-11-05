"use client";
import { useState, useEffect, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import SearchFilter from '../components/SearchFilter';
import StructuredData from '../components/StructuredData';
import { getBaseUrl } from '../lib/site';
import { generateWebsiteSchema } from '../lib/schema';
import BlogSection from '../components/BlogSection';
import { getAllToolsMeta } from '../tools';

// Lazy load the ToolGrid component
const ToolGrid = lazy(() => import('../components/ToolGrid'));

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
  const router = useRouter();

  useEffect(() => {
    // Get tools on the client side to avoid hydration mismatch
    const allTools = getAllToolsMeta();
    setTools(allTools);
    setFilteredTools(allTools);
    setIsLoaded(true);
  }, []);

  // Predictive prefetch: prefetch likely first clicks to boost concurrency
  useEffect(() => {
    if (!isLoaded || !tools?.length) return;
    const candidates = tools.slice(0, 5).map((t) => `/tools/${t.slug}`).filter(Boolean);
    // Prefetch top 3 candidates concurrently
    for (const href of candidates.slice(0, 3)) {
      try { router.prefetch(href); } catch (_) {}
    }
  }, [isLoaded, tools, router]);

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
        <h1 className="text-2xl md:text-3xl font-bold">All Your SEO Tools in One Place</h1>
        <p className="text-gray-600 dark:text-gray-400">Free, fast, client-side — no login or card details required. 100+ modular tools for marketers, bloggers, agencies, and developers.</p>
      </section>

      {/* Expanded introduction for better content depth (250+ words) */}
      <section className="max-w-3xl mx-auto space-y-4 text-gray-700 dark:text-gray-300 min-h-[400px]">
        <p className="font-loading-fallback">
          Welcome to 100 SEO Tools — a fast, privacy-friendly collection of browser-based utilities designed to
          simplify everyday optimization tasks. Whether you're planning a content strategy, checking technical
          signals, or refining on-page elements, this toolkit helps you move quickly without installing software or
          connecting accounts. Everything runs client-side, so inputs stay on your device and performance remains
          smooth across modern browsers.
        </p>
        <p className="font-loading-fallback">
          Explore practical helpers for keyword research, metadata generation, heading analysis, schema validation,
          internal linking, local SEO, and more. Use AI-assisted tools to draft titles and descriptions, or leverage
          utilities for word counts, slug formatting, redirects, and robots.txt checks. Each tool focuses on a single
          job with clear inputs and immediate results, making it easy to test ideas, standardize outputs, and share
          results with your team. You can browse by category, search by name, and favorite tools you rely on most.
        </p>
        <p className="font-loading-fallback">
          The experience is tuned for speed: lightweight UI, minimal network requests, and thoughtful accessibility
          features. Dark mode is available for low-light workflows. No sign-ups, paywalls, or rate limits — just
          reliable utilities that help you ship better pages. If you're new to SEO, start with the Meta Tag Generator,
          Heading Analyzer, and Structured Data Validator. If you're optimizing at scale, try the Keyword Clustering
          Tool, Internal Linking Planner, and Local Schema Builder. As we iterate, we aim to keep the interface simple,
          the results transparent, and the tools helpful for real-world publishing.
        </p>
      </section>

      <SearchFilter tools={tools} onChange={setFilteredTools} />

      {/* Tools section with accessible heading to ensure sequential order (h1 -> h2 -> h3) */}
      <section aria-labelledby="tools-section-title">
        <h2 id="tools-section-title" className="sr-only">Tools</h2>
        <Suspense fallback={<ToolGridSkeleton />}>
          <ToolGrid tools={filteredTools} />
        </Suspense>
      </section>

      {/* Blog Section */}
      <BlogSection />
    </div>
  );
}