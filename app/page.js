"use client";
import { useState } from 'react';
import ToolGrid from '../components/ToolGrid';
import SearchFilter from '../components/SearchFilter';
import { getAllToolsMeta } from '../tools';

export default function HomePage() {
  const tools = getAllToolsMeta();
  const [filteredTools, setFilteredTools] = useState(tools);

  return (
    <div className="space-y-8">
      <section className="text-center space-y-3 py-8">
        <h1 className="text-2xl md:text-3xl font-bold">All Your SEO Tools in One Place</h1>
        <p className="text-gray-600 dark:text-gray-400">Free, fast, client-side — no login or card details required. 100+ modular tools for marketers, bloggers, agencies, and developers.</p>
      </section>

      <SearchFilter tools={tools} onChange={setFilteredTools} />
      <ToolGrid tools={filteredTools} />
    </div>
  );
}