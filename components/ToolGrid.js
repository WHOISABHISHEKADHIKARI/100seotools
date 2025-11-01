"use client";
import React, { useEffect, useState, memo } from 'react';
import Link from 'next/link';
import {
  FiSearch,
  FiTag,
  FiLink,
  FiBarChart2,
  FiMapPin,
  FiUsers,
  FiCpu,
  FiTool,
  FiStar,
  FiChevronRight
} from 'react-icons/fi';

const categoryIconMap = {
  'Keyword Research': FiSearch,
  'On-Page Optimization': FiTag,
  'Technical SEO': FiTool,
  'Backlink & Link-Building': FiLink,
  'Content SEO': FiTag,
  'SEO Performance': FiBarChart2,
  'Local SEO': FiMapPin,
  'Competitor Analysis': FiUsers,
  'AI-Powered SEO': FiCpu,
  'SEO Utility': FiTool
};

function ToolGrid({ tools }) {
  const [favorites, setFavorites] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(favs);
    } catch (e) {
      setFavorites([]);
    }
  }, []);

  const toggleFavorite = (slug) => {
    if (!mounted) return;
    
    setFavorites((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      localStorage.setItem('favorites', JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tools.map((tool, index) => (
        <article
          key={tool.slug}
          className="card card-interactive p-4 flex flex-col gap-3 focus:outline-none focus:ring-2 focus:ring-brand-500 relative"
          itemScope
          itemType="https://schema.org/SoftwareApplication"
          aria-labelledby={`tool-title-${tool.slug}`}
          aria-describedby={`tool-desc-${tool.slug}`}
        >
          {/* Full-card click target: open the tool */}
          <a
            href={`/tools/${tool.slug}`}
            aria-label={`Open tool: ${tool.name}`}
            className="absolute inset-0 z-10"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {(() => {
                const Icon = categoryIconMap[tool.category] || FiTool;
                return <Icon aria-hidden className="w-6 h-6 text-brand-500 relative z-20" />;
              })()}
              <h3 id={`tool-title-${tool.slug}`} className="font-medium relative z-20" itemProp="name">
                <Link href={`/tools/${tool.slug}`} className="hover:underline">
                  {tool.name}
                </Link>
              </h3>
            </div>
            <button
              className="btn-secondary flex items-center gap-1 relative z-20"
              onClick={(e) => { e.preventDefault(); toggleFavorite(tool.slug); }}
              aria-label={favorites.includes(tool.slug) ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={favorites.includes(tool.slug)}
            >
              <FiStar aria-hidden className={favorites.includes(tool.slug) ? 'text-yellow-500' : 'text-gray-400'} />
              <span className="text-xs">{favorites.includes(tool.slug) ? 'Favorited' : 'Not favorited'}</span>
            </button>
          </div>
          <p id={`tool-desc-${tool.slug}`} className="text-sm text-gray-600 dark:text-gray-400 relative z-20" itemProp="description">
            {tool.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 flex items-center gap-1 relative z-20">
              {(() => {
                const Icon = categoryIconMap[tool.category] || FiTool;
                return <Icon aria-hidden className="w-3.5 h-3.5" />;
              })()}
              <span itemProp="applicationCategory">{tool.category}</span>
            </span>
            <div className="flex items-center gap-3 relative z-20">
              <Link href={`/tools/${tool.slug}`} className="inline-flex items-center gap-1 text-brand-600 hover:underline" itemProp="url" aria-label={`Open ${tool.name}`}>
                Open <FiChevronRight aria-hidden className="w-4 h-4" />
              </Link>
              <Link href={`/blog/${tool.slug}`} className="text-sm text-gray-500 hover:underline" aria-label={`Read guide for ${tool.name}`}>
                Read Guide
              </Link>
            </div>
          </div>
          <meta itemProp="operatingSystem" content="Web browser" />
          <meta itemProp="offers" content="Free" />
        </article>
      ))}
    </div>
  );
}

export default memo(ToolGrid);