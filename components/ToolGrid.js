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

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(favs);
  }, []);

  const toggleFavorite = (slug) => {
    setFavorites((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      localStorage.setItem('favorites', JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tools.map((tool) => (
        <Link
          key={tool.slug}
          href={`/tools/${tool.slug}`}
          className="card p-4 flex flex-col gap-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label={`Open ${tool.name} tool`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {(() => {
                const Icon = categoryIconMap[tool.category] || FiTool;
                return <Icon aria-hidden className="w-6 h-6 text-brand-500" />;
              })()}
              <h3 className="font-medium">{tool.name}</h3>
            </div>
            <button
              className="btn-secondary flex items-center gap-1"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(tool.slug); }}
              aria-label={favorites.includes(tool.slug) ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={favorites.includes(tool.slug)}
            >
              <FiStar aria-hidden className={favorites.includes(tool.slug) ? 'text-yellow-500' : 'text-gray-400'} />
              <span className="sr-only">{favorites.includes(tool.slug) ? 'Favorited' : 'Not favorited'}</span>
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 flex items-center gap-1">
              {(() => {
                const Icon = categoryIconMap[tool.category] || FiTool;
                return <Icon aria-hidden className="w-3.5 h-3.5" />;
              })()}
              {tool.category}
            </span>
            <span className="inline-flex items-center gap-1 text-brand-600">
              Open <FiChevronRight aria-hidden className="w-4 h-4" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default memo(ToolGrid);