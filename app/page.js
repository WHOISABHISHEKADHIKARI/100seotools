"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ToolGrid from '../components/ToolGrid';
import SearchFilter from '../components/SearchFilter';
import StructuredData from '../components/StructuredData';
import { getAllToolsMeta } from '../tools';

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
        const websiteLd = {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: '100 SEO Tools',
          url: `${baseUrl}/`,
          inLanguage: 'en-US',
          publisher: {
            '@type': 'Organization',
            name: 'Hashtag Solutions'
          }
        };
        return <StructuredData data={websiteLd} />;
      })()}
      {/* Dynamically loaded SEO Calculator section at the very top */}
      <SEOCalculator />

      <section className="text-center space-y-3 py-8">
        <h1 className="text-2xl md:text-3xl font-bold">All Your SEO Tools in One Place</h1>
        <p className="text-gray-600 dark:text-gray-400">Free, fast, client-side — no login or card details required. 100+ modular tools for marketers, bloggers, agencies, and developers.</p>
      </section>

      <SearchFilter tools={tools} onChange={setFilteredTools} />

      <ToolGrid tools={filteredTools} />
    </div>
  );
}