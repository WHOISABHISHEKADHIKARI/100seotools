"use client";
import React, { useEffect, useState, memo } from 'react';
import Link from 'next/link';
import Card from './Card';
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

// Color mapping for category icons to visually distinguish tool types
const categoryColorMap = {
  'Keyword Research': 'text-blue-500',
  'On-Page Optimization': 'text-green-500',
  'Technical SEO': 'text-purple-500',
  'Backlink & Link-Building': 'text-amber-500',
  'Content SEO': 'text-emerald-500',
  'SEO Performance': 'text-rose-500',
  'Local SEO': 'text-cyan-500',
  'Competitor Analysis': 'text-orange-500',
  'AI-Powered SEO': 'text-indigo-500',
  'SEO Utility': 'text-teal-500'
};

function ToolCardGrid({ tools }) {
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
      {tools.map((tool) => {
        const Icon = categoryIconMap[tool.category] || FiTool;
        const iconColor = categoryColorMap[tool.category] || 'text-brand-500';
        const isFavorite = favorites.includes(tool.slug);
        
        return (
          <Card
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            title={tool.name}
            description={tool.description}
            icon={Icon}
            meta={tool.category}
            iconColor={iconColor}
            className="h-full"
          >
            <button
              className="btn-secondary p-1.5 text-xs"
              onClick={(e) => { e.preventDefault(); toggleFavorite(tool.slug); }}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={isFavorite}
            >
              <FiStar aria-hidden className={isFavorite ? 'text-yellow-500' : 'text-gray-400'} />
            </button>
            <Link 
              href={`/blog/${tool.slug}`} 
              className="text-xs text-gray-500 hover:underline ml-auto"
              onClick={(e) => e.stopPropagation()}
            >
              Guide
            </Link>
            <Link 
              href={`/tools/${tool.slug}`} 
              className="btn text-xs py-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              Open <FiChevronRight className="w-3.5 h-3.5" />
            </Link>
          </Card>
        );
      })}
    </div>
  );
}

export default memo(ToolCardGrid);