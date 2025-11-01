"use client";
import { useState, useEffect } from 'react';
import ToolCardGrid from '../../components/ToolCardGrid';
import Card from '../../components/Card';
import { getAllToolsMeta } from '../../tools';
import { FiTool, FiSearch, FiTag, FiLink } from 'react-icons/fi';

export default function CardDemoPage() {
  const [tools, setTools] = useState([]);
  
  useEffect(() => {
    // Get a subset of tools for the demo
    const allTools = getAllToolsMeta();
    setTools(allTools.slice(0, 8));
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Modern Card UI Demo</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Individual Card Examples</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Basic card */}
          <Card
            title="Meta Tag Generator"
            description="Create SEO-ready meta tags in seconds for better search visibility."
            icon={FiTag}
            meta="Technical SEO"
            href="/tools/meta-tag-generator"
            iconColor="text-purple-500"
          />
          
          {/* Card with custom actions */}
          <Card
            title="Keyword Research Tool"
            description="Find high-value keywords for your content strategy."
            icon={FiSearch}
            meta="Keyword Research"
            href="/tools/keyword-suggestion-tool"
            iconColor="text-blue-500"
          >
            <button className="btn-secondary p-1.5 text-xs">
              <FiSearch />
            </button>
            <button className="btn text-xs py-1.5 ml-auto">
              Open
            </button>
          </Card>
          
          {/* Card with no icon */}
          <Card
            title="Backlink Analyzer"
            description="Analyze your backlink profile and find opportunities for improvement."
            meta="Backlink & Link-Building"
            href="/tools/backlink-idea-generator"
          />
          
          {/* Non-interactive card */}
          <Card
            title="Information Card"
            description="This card is not interactive and serves as an information display only."
            icon={FiTool}
          />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Tool Card Grid</h2>
        <ToolCardGrid tools={tools} />
      </div>
    </div>
  );
}