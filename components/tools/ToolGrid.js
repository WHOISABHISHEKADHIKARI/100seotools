"use client";
import React, { useEffect, useState, memo, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserPreferences } from '../../contexts/UserPreferencesContext';
import UnifiedCard from '../ui/UnifiedCard';
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
  FiChevronRight,
  FiBookOpen
} from 'react-icons/fi';
//hello boss
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
  'Schema & Structured Data': FiBookOpen,
  'SEO Utility': FiTool
};

// Tool card component for better performance
const ToolCard = memo(({ tool, isFavorite, onToggleFavorite, onToolClick }) => {
  const router = useRouter();
  const hasSlug = Boolean(tool?.slug);
  const isBlog = tool?.type === 'blog';
  const safeName = tool?.name ?? 'Untitled Tool';
  const Icon = categoryIconMap[tool?.category] || FiTool;

  const handleToolClick = () => {
    onToolClick(tool);
  };

  const mainHref = hasSlug ? (isBlog ? `/blog/${tool.slug}` : `/tools/${tool.slug}`) : undefined;

  return (
    <UnifiedCard
      href={mainHref}
      title={safeName}
      description={tool.description}
      icon={Icon}
      meta={tool.category}
      iconColor={isBlog ? "text-blue-500" : "text-brand-500"}
      variant="tool"
      className="h-full"
    >
      <button
        className="btn-secondary h-8 w-8 p-0 grid place-items-center"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (tool?.slug) onToggleFavorite(tool.slug); }}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        aria-pressed={isFavorite}
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <FiStar aria-hidden className={isFavorite ? 'text-yellow-500 fill-current' : 'text-gray-400'} />
      </button>
      {hasSlug && !isBlog ? (
        <button
          type="button"
          className="btn-secondary text-xs px-2.5 py-1.5"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/blog/${tool.slug}`); }}
          aria-label={`Open guide for ${safeName}`}
        >
          Guide
        </button>
      ) : hasSlug && isBlog ? (
        <span className="text-[10px] uppercase tracking-wider bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 py-1 rounded font-bold">Expert Guide</span>
      ) : (
        <span className="btn-secondary opacity-50 cursor-not-allowed text-xs px-2.5 py-1.5">Guide</span>
      )}
      {hasSlug ? (
        <button
          type="button"
          className={`btn text-xs px-3 py-1.5 ml-auto ${isBlog ? 'btn-primary' : ''}`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(mainHref); }}
          aria-label={`Open ${isBlog ? 'guide' : 'tool'} ${safeName}`}
        >
          {isBlog ? 'Read Guide' : 'Open Tool'} <FiChevronRight className="w-3.5 h-3.5" />
        </button>
      ) : (
        <span className="btn opacity-50 cursor-not-allowed text-xs px-3 py-1.5">Open <FiChevronRight className="w-3.5 h-3.5" /></span>
      )}
    </UnifiedCard>
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

  // Ensure unique tools by slug and type to prevent duplicate React keys and duplicate cards
  const uniqueTools = useMemo(() => {
    const seen = new Set();
    const result = [];
    for (const t of tools || []) {
      const slug = t?.slug;
      if (!slug) {
        // Keep items without slug as-is, but attach a synthetic slug to avoid collisions
        result.push(t);
        continue;
      }
      // Use type-slug combo to allow a tool and a blog to have the same slug name
      const id = `${t.type || 'tool'}-${slug}`;
      if (!seen.has(id)) {
        seen.add(id);
        result.push(t);
      }
    }
    return result;
  }, [tools]);

  // Generate stable keys for tools to avoid index-based keys
  const getStableKey = useCallback((tool) => {
    if (!tool?.slug) return `ns-${uniqueTools.indexOf(tool)}`;
    return `${tool.type || 'tool'}-${tool.slug}`;
  }, [uniqueTools]);

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
      try { observerRef.current.unobserve(loadingRef.current); } catch (_) { }
    }
    // Simulate loading delay for better UX
    const startIndex = visibleTools.length;
    const nextBatch = uniqueTools.slice(startIndex, startIndex + batchSize);
    // Merge and de-duplicate by type-slug to avoid duplicate key warnings
    setVisibleTools((prev) => {
      const merged = [...prev, ...nextBatch];
      const seen = new Set();
      return merged.filter((t) => {
        const key = t?.slug ? `${t.type || 'tool'}-${t.slug}` : `idx-${uniqueTools.indexOf(t)}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    });
    setIsLoading(false);
    isLoadingRef.current = false;
    // Resume observing after batch is appended
    if (observerRef.current && loadingRef.current) {
      try { observerRef.current.observe(loadingRef.current); } catch (_) { }
    }
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
      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleTools.map((tool) => (
          <ToolCard
            key={getStableKey(tool)}
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
          style={{ minHeight: skeletonHeight > 0 ? `${skeletonHeight + 32}px` : '80px' }}
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
