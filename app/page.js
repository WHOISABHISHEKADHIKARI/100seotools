"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SearchFilter from '../components/SearchFilter';
import StructuredData from '../components/StructuredData';
import { getBaseUrl } from '../lib/site';
import { generateWebsiteSchema } from '../lib/schema';
import { getAllToolsMeta } from '../tools';
import BlogGrid from '../components/BlogGrid';
import PageLinksGrid from '../components/PageLinksGrid';

// Lazy load the ToolGrid component; avoid client-only fallback to prevent SSR mismatch
const ToolGrid = dynamic(() => import('../components/ToolGrid'), { ssr: false, loading: () => null });

// (Deprecated here) BlogSection was used previously; replaced by BlogGrid directly below Tools.

// Loading skeleton removed: ToolGrid now defers loading without a heavy placeholder

const SEOCalculator = dynamic(() => import('../components/SEOCalculator'), {
  ssr: false,
  loading: () => (
    <div className="card p-4 max-w-3xl mx-auto">
      <p className="text-sm text-slate-600 dark:text-slate-300">Loading SEO Calculator…</p>
    </div>
  )
});

// Mount children after first paint/idle to avoid impacting LCP
function AfterFirstPaint({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const run = () => setMounted(true);
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      // Give the browser a short idle window before mounting
      window.requestIdleCallback(run, { timeout: 200 });
    } else {
      // Fallback – next tick
      setTimeout(run, 0);
    }
  }, []);
  if (!mounted) return null;
  return children;
}

export default function HomePage() {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    // Get tools on the client side to avoid hydration mismatch
    const allTools = getAllToolsMeta();
    setTools(allTools);
    setFilteredTools(allTools);
    setIsLoaded(true);
  }, []);

  // Removed predictive prefetch to avoid navigation races and ERR_ABORTED in dev

  // Gate non-critical homepage content behind idle time
  useEffect(() => {
    const onIdle = () => setIsIdle(true);
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(onIdle, { timeout: 2000 });
      return () => window.cancelIdleCallback && window.cancelIdleCallback(id);
    } else {
      const t = setTimeout(onIdle, 2000);
      return () => clearTimeout(t);
    }
  }, []);

  if (!isLoaded) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto px-4">
        <section className="text-center space-y-4 py-10">
          <h1 className="text-3xl md:text-4xl font-bold">100 SEO Tools: Free, Fast, Crawl‑Friendly</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Complete collection of 100+ free SEO tools for keyword research, on‑page optimization,
            technical validation, and performance tracking — all free and browser‑based.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-6">
            <span className="inline-flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% Free Forever
            </span>
            <span className="inline-flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No Signup Required
            </span>
            <span className="inline-flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Instant Results
            </span>
          </div>
        </section>

        {/* Static tool categories for SEO */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">🔍 Keyword Research</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover profitable keywords with our keyword suggestion tool, long-tail generator,
              clustering tool, and difficulty checker.
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">📊 On-Page SEO</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Optimize your pages with meta tag generator, SEO audit checker, heading analyzer,
              and keyword density tools.
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">⚙️ Technical SEO</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Validate robots.txt, generate sitemaps, check structured data, and ensure your
              site is technically sound.
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">📝 Content Tools</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Check readability, detect AI content, find duplicate content, and optimize your
              writing for search engines.
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">🔗 Link Building</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Analyze backlinks, find broken links, check anchor text, and discover guest post
              opportunities.
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">📍 Local SEO</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Check NAP consistency, find local citations, optimize Google Business Profile,
              and dominate local search.
            </p>
          </div>
        </section>

        <section className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Why Choose 100 SEO Tools?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div>
              <p className="text-4xl font-bold text-brand-600 mb-2">100+</p>
              <p className="text-gray-600 dark:text-gray-400">Free SEO Tools</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-brand-600 mb-2">50K+</p>
              <p className="text-gray-600 dark:text-gray-400">Active Users</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-brand-600 mb-2">100%</p>
              <p className="text-gray-600 dark:text-gray-400">Free Forever</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-brand-600 mb-2">0</p>
              <p className="text-gray-600 dark:text-gray-400">Signup Required</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4">
      {(() => {
        const baseUrl = getBaseUrl();
        const websiteLd = generateWebsiteSchema(baseUrl);
        const webPageLd = {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "100 SEO Tools - Free Online SEO Toolkit 2025",
          "description": "Complete collection of 100+ free SEO tools for keyword research, on-page optimization, technical SEO, content analysis, and performance tracking. No signup required, instant results.",
          "url": baseUrl,
          "keywords": [
            "100 SEO tools",
            "100 seo tools",
            "free SEO tools list",
            "SEO tool comparison",
            "best SEO tools for 2024",
            "100 free seo tools",
            "free seo toolkit",
            "seo tools website",
            "100 seo",
            "free online seo tools"
          ],
          "about": {
            "@type": "Thing",
            "name": "Search Engine Optimization Tools",
            "description": "Comprehensive collection of SEO tools for digital marketers"
          }
        };
        return (
          <>
            <StructuredData data={websiteLd} />
            <StructuredData data={webPageLd} />
          </>
        );
      })()}
      {/* Hero Section - Optimized for "100 seo tools" keyword */}
      <section className="text-center space-y-6 py-12 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent">
          100 SEO Tools - Free Online SEO Toolkit 2025
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto">
          Complete collection of <strong>100+ free SEO tools</strong> for keyword research, on-page optimization, technical SEO, and content analysis. No signup required.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="inline-flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            100% Free Forever
          </span>
          <span className="inline-flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            No Signup Required
          </span>
          <span className="inline-flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Instant Results
          </span>
          <span className="inline-flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Used by 50,000+ Marketers
          </span>
        </div>
      </section>

      {/* Static content for crawlers (no JavaScript required) */}
      <noscript>
        <section className="space-y-8 py-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">100+ Free SEO Tools - No Signup Required</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Complete collection of free SEO tools for keyword research, on-page optimization,
              technical SEO, content analysis, and performance tracking. All tools are 100% free,
              require no signup, and provide instant results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">🔍 Keyword Research Tools</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Keyword Suggestion Tool</li>
                <li>• Long-Tail Keyword Generator</li>
                <li>• Keyword Clustering Tool</li>
                <li>• Keyword Difficulty Checker</li>
                <li>• Keyword Intent Identifier</li>
              </ul>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">📊 On-Page SEO Tools</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• On-Page SEO Audit Checker</li>
                <li>• Meta Tag Generator</li>
                <li>• Meta Description Optimizer</li>
                <li>• Heading Analyzer</li>
                <li>• Keyword Density Checker</li>
              </ul>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">⚙️ Technical SEO Tools</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Robots.txt Validator</li>
                <li>• Sitemap Generator</li>
                <li>• Structured Data Validator</li>
                <li>• Canonical Tag Checker</li>
                <li>• SSL Certificate Checker</li>
              </ul>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">📝 Content Tools</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• SEO Content Checker</li>
                <li>• Readability Score Calculator</li>
                <li>• AI Content Detector</li>
                <li>• Duplicate Content Checker</li>
                <li>• Word Counter</li>
              </ul>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">🔗 Link Building Tools</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Backlink Analyzer</li>
                <li>• Broken Link Finder</li>
                <li>• Anchor Text Analyzer</li>
                <li>• Link Building Outreach</li>
                <li>• Guest Post Finder</li>
              </ul>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">📍 Local SEO Tools</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• NAP Consistency Checker</li>
                <li>• Local Citation Finder</li>
                <li>• GMB Optimization Helper</li>
                <li>• Local Keyword Generator</li>
                <li>• Review Response Generator</li>
              </ul>
            </div>
          </div>

          <div className="text-center py-8 border-t border-gray-200">
            <p className="text-lg font-semibold mb-4">Why Choose 100 SEO Tools?</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
              <div>
                <p className="font-bold text-2xl text-brand-600">100+</p>
                <p className="text-sm text-gray-600">Free SEO Tools</p>
              </div>
              <div>
                <p className="font-bold text-2xl text-brand-600">50,000+</p>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
              <div>
                <p className="font-bold text-2xl text-brand-600">100%</p>
                <p className="text-sm text-gray-600">Free Forever</p>
              </div>
              <div>
                <p className="font-bold text-2xl text-brand-600">0</p>
                <p className="text-sm text-gray-600">Signup Required</p>
              </div>
            </div>
          </div>
        </section>
      </noscript>


      {/* Tools section placed at the very top */}
      <section id="tools" aria-labelledby="tools-section-title" className="space-y-6">
        <div className="sticky top-0 z-40 supports-[backdrop-filter]:backdrop-blur bg-white/95 dark:bg-gray-950/95 border-b border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h2 id="tools-section-title" className="text-2xl md:text-3xl font-bold tracking-tight">
                Browse All 100 Free SEO Tools
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 max-w-3xl">
                Our <strong>100 SEO tools</strong> collection includes everything you need: <a href="/tools/keyword-suggestion-tool" className="font-semibold text-brand-600 hover:underline">keyword research tools</a>, <a href="/tools/on-page-seo-audit-checker" className="font-semibold text-brand-600 hover:underline">on-page SEO checkers</a>, <a href="/tools/robots-txt-validator" className="font-semibold text-brand-600 hover:underline">technical SEO validators</a>, <a href="/tools/meta-tag-generator" className="font-semibold text-brand-600 hover:underline">meta tag generators</a>, and more. This <strong>free SEO toolkit</strong> is trusted by marketers worldwide.
              </p>
            </div>
            <a href="#calculator" className="shrink-0 text-sm text-blue-700 dark:text-blue-400 hover:underline">Go to Calculator</a>
          </div>
        </div>
        <div className="pt-2">
          <SearchFilter tools={tools} onChange={setFilteredTools} />
        </div>
        <ToolGrid tools={filteredTools} />
      </section>

      {/* Blog section positioned directly below Tools */}
      <section id="blog" className="space-y-6">
        <BlogGrid />
      </section>

      {/* Hero with clear CTAs; now placed after Tools */}
      <section className="text-center space-y-5 py-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          100 SEO Tools: Free, Accurate, and Ready for 2024–2025
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          A comprehensive suite of top‑performing, search‑friendly tools. Run <span className="font-semibold">SEO tool comparison</span> checks, build schema, and ship updates faster. Everything is free, client‑side, and tuned for speed — no logins.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a href="#tools" className="btn transition-all duration-200 hover:scale-[1.02]">
            Explore Tools
          </a>
          <a href="#calculator" className="btn btn-outline transition-all duration-200 hover:scale-[1.02]">
            Try Calculator
          </a>
        </div>
      </section>

      {/* Expanded introduction for better content depth (250+ words) */}
      <section className="max-w-3xl mx-auto space-y-4 text-gray-700 dark:text-gray-300">
        <p className="font-loading-fallback">
          Welcome to <a href="/" className="hover:underline">100 SEO Tools</a> — a comprehensive, browser‑based toolkit for modern optimization. This curated <strong>free SEO tools list</strong> covers keyword research, on‑page improvements, technical validation, and performance checks. Use it to run quick audits, compare outputs, and publish with confidence.
        </p>
        <p className="font-loading-fallback">
          Explore keyword ideas, analyze intent, and structure content using headings, schema, and internal links. For technical SEO, validate <a href="/tools/structured-data-validator" className="hover:underline">structured data</a> and check <a href="/tools/robots-txt-validator" className="hover:underline">robots.txt</a>. For market insight, perform <strong>SEO tool comparison</strong> and benchmark against top pages. See the <a href="/blog/100-free-seo-tools-ultimate-list" className="hover:underline">100 SEO Tools ultimate list</a>.
        </p>
        <p className="font-loading-fallback">
          The experience prioritizes E‑E‑A‑T: accurate outputs, transparent processing, and practical guidance. Start with Meta Tag Generator and Heading Analyzer. For 2024, try our <strong>best SEO tools</strong> lineup to improve clarity, speed, and discoverability.
        </p>
      </section>

      {/* Calculator section deferred to protect LCP but visually near top */}
      <section id="calculator" className="space-y-4">
        <h2 className="text-2xl md:text-3xl font-semibold">SEO Calculator</h2>
        <AfterFirstPaint>
          <div className="calculator-container content-transition">
            <SEOCalculator />
          </div>
        </AfterFirstPaint>
      </section>

      {/* (Removed) Old BlogSection deferred to idle; replaced by BlogGrid above */}

      {/* Pages section: clear visual separation, below current content */}
      <section id="pages" aria-labelledby="pages-section-title" className="space-y-4 pt-8 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h2 id="pages-section-title" className="text-2xl md:text-3xl font-semibold">Explore Pages</h2>
          <a href="#tools" className="text-sm text-blue-700 dark:text-blue-400 hover:underline">Back to Tools</a>
        </div>
        <PageLinksGrid />
      </section>
    </div>
  );
}
