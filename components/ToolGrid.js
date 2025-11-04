"use client";
import React, { useEffect, useState, memo, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
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

// Tool card component for better performance
const ToolCard = memo(({ tool, isFavorite, onToggleFavorite, onToolClick }) => {
  const Icon = categoryIconMap[tool.category] || FiTool;
  
  const handleToolClick = () => {
    onToolClick(tool);
  };
  
  return (
    <article
      className="card card-interactive p-4 flex flex-col gap-3 focus:outline-none focus:ring-2 focus:ring-brand-500 relative overflow-hidden card-content"
      itemScope
      itemType="https://schema.org/SoftwareApplication"
      aria-labelledby={`tool-title-${tool.slug}`}
      aria-describedby={`tool-desc-${tool.slug}`}
    >
      {/* Full-card click target: open the tool */}
      <a
        href={`/tools/${tool.slug}`}
        onClick={handleToolClick}
        aria-label={`Open tool: ${tool.name}`}
        className="absolute inset-0 z-10 hover:bg-transparent"
      >
        <span className="sr-only">Open tool: {tool.name}</span>
      </a>
      <div className="flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <div className="card-icon-container">
            <Icon aria-hidden className="w-6 h-6 text-brand-500" />
          </div>
          <h3 id={`tool-title-${tool.slug}`} className="card-title tool-card-text" itemProp="name">
            <Link href={`/tools/${tool.slug}`} prefetch={false} className="hover:underline">
              {tool.name}
            </Link>
          </h3>
        </div>
        <button
          className="btn-secondary flex items-center gap-1 relative z-30"
          onClick={(e) => { e.preventDefault(); onToggleFavorite(tool.slug); }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={isFavorite}
        >
          <FiStar aria-hidden className={isFavorite ? 'text-yellow-500' : 'text-gray-400'} />
          <span className="sr-only">{isFavorite ? 'Favorited' : 'Not favorited'}</span>
        </button>
      </div>
      <p id={`tool-desc-${tool.slug}`} className="card-desc tool-card-text" itemProp="description">
        {tool.description}
      </p>
      <div className="flex items-center justify-between relative z-20">
        <span className="card-meta flex items-center gap-1" itemProp="applicationCategory">
          <Icon aria-hidden className="w-3.5 h-3.5" />
          {tool.category}
        </span>
        <div className="flex items-center gap-3">
          <Link href={`/tools/${tool.slug}`} prefetch={false} className="tap-target gap-1 text-brand-600" itemProp="url" aria-label={`Open ${tool.name}`}>
            Open <FiChevronRight aria-hidden className="w-4 h-4 flex-shrink-0" />
          </Link>
          <Link href={`/blog/${tool.slug}`} prefetch={false} className="tap-target text-sm text-accessibleGray-600" aria-label={`Read guide for ${tool.name}`}>
            Read Guide
          </Link>
        </div>
      </div>
      <meta itemProp="operatingSystem" content="Web browser" />
      <meta itemProp="offers" content="Free" />
    </article>
  );
});

ToolCard.displayName = 'ToolCard';

function ToolGrid({ tools }) {
  const { favorites, actions } = useUserPreferences();
  const [mounted, setMounted] = useState(false);
  const [visibleTools, setVisibleTools] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const loadTimeoutRef = useRef(null);
  const lastLoadAtRef = useRef(0);
  const batchSize = 12; // Number of tools to load at once
  const cooldownMs = 600; // cooldown between auto-loads to prevent flicker

  // Reserve space for loading skeleton to prevent layout shifts
  const [skeletonHeight, setSkeletonHeight] = useState(0);
  const gridRef = useRef(null);

  // Ensure unique tools by slug to prevent duplicate React keys and duplicate cards
  const uniqueTools = useMemo(() => {
    const seen = new Set();
    const result = [];
    for (const t of tools || []) {
      if (!t?.slug) {
        // Keep items without slug as-is, but attach a synthetic slug to avoid collisions
        // This preserves rendering while preventing duplicate key warnings
        result.push(t);
        continue;
      }
      if (!seen.has(t.slug)) {
        seen.add(t.slug);
        result.push(t);
      }
    }
    return result;
  }, [tools]);

  useEffect(() => {
    setMounted(true);
    // Measure grid item height for consistent skeleton sizing
    if (gridRef.current && visibleTools.length > 0) {
      const firstItem = gridRef.current.querySelector('article');
      if (firstItem) {
        setSkeletonHeight(firstItem.offsetHeight);
      }
    }
  }, []);

  useEffect(() => {
    // Cancel any pending load when the tools list changes
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
    setIsLoading(false);

    // Initialize with first batch of tools from the unique list
    setVisibleTools(uniqueTools.slice(0, batchSize));

    // Set up intersection observer for infinite scrolling
    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      const now = Date.now();
      // Guard against stale state and rapid retriggers while layout shifts
      if (entry.isIntersecting && !isLoadingRef.current && (now - lastLoadAtRef.current > cooldownMs)) {
        loadMoreTools();
      }
    }, { rootMargin: '100px' });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [uniqueTools]);

  useEffect(() => {
    if (loadingRef.current && observerRef.current) {
      observerRef.current.observe(loadingRef.current);
    }
    return () => {
      if (loadingRef.current && observerRef.current) {
        observerRef.current.unobserve(loadingRef.current);
      }
    };
  }, [visibleTools]);

  const loadMoreTools = useCallback(() => {
    if (visibleTools.length >= uniqueTools.length) return;
    if (isLoadingRef.current) return;

    setIsLoading(true);
    isLoadingRef.current = true;
    lastLoadAtRef.current = Date.now();
    // Pause observing while we append the next batch to avoid double-trigger
    if (observerRef.current && loadingRef.current) {
      try { observerRef.current.unobserve(loadingRef.current); } catch (_) {}
    }
    // Simulate loading delay for better UX
    loadTimeoutRef.current = setTimeout(() => {
      const startIndex = visibleTools.length;
      const nextBatch = uniqueTools.slice(startIndex, startIndex + batchSize);
      // Merge and de-duplicate by slug to avoid duplicate key warnings
      setVisibleTools((prev) => {
        const merged = [...prev, ...nextBatch];
        const seen = new Set();
        return merged.filter((t) => {
          const key = t?.slug ?? `idx-${uniqueTools.indexOf(t)}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      });
      setIsLoading(false);
      isLoadingRef.current = false;
      loadTimeoutRef.current = null;
      // Resume observing after batch is appended
      if (observerRef.current && loadingRef.current) {
        try { observerRef.current.observe(loadingRef.current); } catch (_) {}
      }
    }, 300);
  }, [visibleTools, uniqueTools]);

  const toggleFavorite = useCallback((slug) => {
    if (!mounted) return;
    actions.toggleFavorite(slug);
  }, [mounted, actions]);

  const handleToolClick = useCallback((tool) => {
    actions.addToHistory(tool);
  }, [actions]);

  return (
    <>
      <div ref={gridRef} className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleTools.map((tool, idx) => (
          <ToolCard 
            key={tool.slug ?? `tool-${idx}`} 
            tool={tool} 
            isFavorite={tool?.slug ? favorites.includes(tool.slug) : false} 
            onToggleFavorite={toggleFavorite}
            onToolClick={handleToolClick}
          />
        ))}
      </div>
      
      {visibleTools.length < uniqueTools.length && (
        <div 
          ref={loadingRef} 
          className="flex justify-center items-center py-8"
          style={{ minHeight: skeletonHeight > 0 ? `${skeletonHeight + 32}px` : 'auto' }}
          aria-live="polite"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-t-brand-500 border-r-brand-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <span>Loading more tools...</span>
            </div>
          ) : (
            <button 
              onClick={loadMoreTools}
              className="btn"
              aria-label="Load more tools"
            >
              Load more tools
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default memo(ToolGrid);