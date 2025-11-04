"use client";
import { useState, useEffect, Suspense, lazy } from 'react';
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
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
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

export default function HomePage() {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Get tools on the client side to avoid hydration mismatch
    const allTools = getAllToolsMeta();
    setTools(allTools);
    setFilteredTools(allTools);
    setIsLoaded(true);
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
      {/* Dynamically loaded SEO Calculator section at the very top */}
      <SEOCalculator />

      <section className="text-center space-y-3 py-8">
        <h1 className="text-2xl md:text-3xl font-bold">All Your SEO Tools in One Place</h1>
        <p className="text-gray-600 dark:text-gray-400">Free, fast, client-side — no login or card details required. 100+ modular tools for marketers, bloggers, agencies, and developers.</p>
      </section>

      {/* Expanded introduction for better content depth (250+ words) */}
      <section className="max-w-3xl mx-auto space-y-4 text-gray-700 dark:text-gray-300">
        <p>
          Welcome to 100 SEO Tools — a fast, privacy-friendly collection of browser-based utilities designed to
          simplify everyday optimization tasks. Whether you’re planning a content strategy, checking technical
          signals, or refining on-page elements, this toolkit helps you move quickly without installing software or
          connecting accounts. Everything runs client-side, so inputs stay on your device and performance remains
          smooth across modern browsers.
        </p>
        <p>
          Explore practical helpers for keyword research, metadata generation, heading analysis, schema validation,
          internal linking, local SEO, and more. Use AI-assisted tools to draft titles and descriptions, or leverage
          utilities for word counts, slug formatting, redirects, and robots.txt checks. Each tool focuses on a single
          job with clear inputs and immediate results, making it easy to test ideas, standardize outputs, and share
          results with your team. You can browse by category, search by name, and favorite tools you rely on most.
        </p>
        <p>
          The experience is tuned for speed: lightweight UI, minimal network requests, and thoughtful accessibility
          features. Dark mode is available for low-light workflows. No sign-ups, paywalls, or rate limits — just
          reliable utilities that help you ship better pages. If you’re new to SEO, start with the Meta Tag Generator,
          Heading Analyzer, and Structured Data Validator. If you’re optimizing at scale, try the Keyword Clustering
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