"use client";
import { useState, useEffect, Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';
import SearchFilter from '../components/SearchFilter';
import StructuredData from '../components/StructuredData';
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
          <h1 className="text-2xl md:text-3xl font-bold">All Your SEO Tools in One Place</h1>
          <p className="text-gray-600 dark:text-gray-400">Loading tools...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {(() => {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://100tools.app';
        const websiteLd = generateWebsiteSchema(baseUrl);
        return <StructuredData data={websiteLd} />;
      })()}
      {/* Dynamically loaded SEO Calculator section at the very top */}
      <SEOCalculator />

      <section className="text-center space-y-3 py-8">
        <h1 className="text-2xl md:text-3xl font-bold">All Your SEO Tools in One Place</h1>
        <p className="text-gray-600 dark:text-gray-400">Free, fast, client-side — no login or card details required. 100+ modular tools for marketers, bloggers, agencies, and developers.</p>
      </section>

      <SearchFilter tools={tools} onChange={setFilteredTools} />

      <Suspense fallback={<ToolGridSkeleton />}>
        <ToolGrid tools={filteredTools} />
      </Suspense>

      {/* Blog Section */}
      <BlogSection />
    </div>
  );
}