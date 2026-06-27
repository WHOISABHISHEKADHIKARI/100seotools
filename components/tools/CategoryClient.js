"use client";
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import SearchFilter from './SearchFilter';
import ToolGrid from './ToolGrid';
import UnifiedCard from '../ui/UnifiedCard';
import { ArrowLeft, ArrowRight, BarChart2, BookOpen, Database, Tag, LayoutGrid, RotateCcw, Search, Settings, Globe, ShieldCheck, TrendingUp, FileText, Link as LinkIcon, Target, Zap, HelpCircle } from 'lucide-react';

const categoryResources = {
  'Keyword Research': [
    { href: '/tools/keyword-suggestion-tool', title: 'Keyword Suggestion Tool', desc: 'Discover profitable keywords for your niche.', Icon: Search, iconColor: 'text-sky-600', iconBg: 'bg-sky-50 dark:bg-sky-500/10' },
    { href: '/tools/keyword-density-checker', title: 'Keyword Density Checker', desc: 'Analyze keyword usage density in content.', Icon: BarChart2, iconColor: 'text-blue-600', iconBg: 'bg-blue-50 dark:bg-blue-500/10' },
    { href: '/tools/keyword-difficulty-estimator', title: 'Keyword Difficulty Estimator', desc: 'Evaluate how hard it is to rank for a query.', Icon: Target, iconColor: 'text-indigo-600', iconBg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { href: '/blog/keyword-difficulty-estimator-how-to-use', title: 'Keyword Research Guide', desc: 'Complete workflow for keyword discovery.', Icon: BookOpen, iconColor: 'text-violet-600', iconBg: 'bg-violet-50 dark:bg-violet-500/10' },
  ],
  'Technical SEO': [
    { href: '/tools/robots-txt-validator', title: 'Robots.txt Validator', desc: 'Check your robots.txt for crawl issues.', Icon: Settings, iconColor: 'text-amber-600', iconBg: 'bg-amber-50 dark:bg-amber-500/10' },
    { href: '/tools/xml-sitemap-visualizer', title: 'Sitemap Visualizer', desc: 'Preview XML sitemap structure and URLs.', Icon: FileText, iconColor: 'text-orange-600', iconBg: 'bg-orange-50 dark:bg-orange-500/10' },
    { href: '/tools/broken-link-finder', title: 'Broken Link Finder', desc: 'Find and report broken links on any page.', Icon: LinkIcon, iconColor: 'text-red-600', iconBg: 'bg-red-50 dark:bg-red-500/10' },
    { href: '/tools/mobile-friendly-test', title: 'Mobile-Friendly Test', desc: 'Test pages for mobile usability.', Icon: Globe, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  ],
  'On-Page Optimization': [
    { href: '/tools/meta-tag-generator', title: 'Meta Tag Generator', desc: 'Draft clean titles and descriptions.', Icon: Tag, iconColor: 'text-amber-600', iconBg: 'bg-amber-50 dark:bg-amber-500/10' },
    { href: '/tools/heading-analyzer', title: 'Heading Analyzer', desc: 'Review H1-H6 hierarchy on any page.', Icon: FileText, iconColor: 'text-orange-600', iconBg: 'bg-orange-50 dark:bg-orange-500/10' },
    { href: '/tools/image-alt-tag-generator', title: 'Alt Tag Generator', desc: 'Generate optimized image alt text.', Icon: BookOpen, iconColor: 'text-indigo-600', iconBg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { href: '/tools/readability-score-calculator', title: 'Readability Score', desc: 'Check content readability level.', Icon: BarChart2, iconColor: 'text-violet-600', iconBg: 'bg-violet-50 dark:bg-violet-500/10' },
  ],
  'Content SEO': [
    { href: '/tools/headline-analyzer', title: 'Headline Analyzer', desc: 'Score headlines for click-through impact.', Icon: Target, iconColor: 'text-pink-600', iconBg: 'bg-pink-50 dark:bg-pink-500/10' },
    { href: '/tools/featured-snippet-optimizer', title: 'Featured Snippet Optimizer', desc: 'Optimize content for position zero.', Icon: Zap, iconColor: 'text-yellow-600', iconBg: 'bg-yellow-50 dark:bg-yellow-500/10' },
    { href: '/tools/content-gap-finder', title: 'Content Gap Finder', desc: 'Identify missing topics in your content.', Icon: Search, iconColor: 'text-sky-600', iconBg: 'bg-sky-50 dark:bg-sky-500/10' },
    { href: '/tools/faq-generator', title: 'FAQ Generator', desc: 'Create FAQ sections fast.', Icon: HelpCircle, iconColor: 'text-violet-600', iconBg: 'bg-violet-50 dark:bg-violet-500/10' },
  ],
  'Schema & Structured Data': [
    { href: '/tools/structured-data-validator', title: 'Structured Data Validator', desc: 'Check JSON-LD for common issues.', Icon: Database, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { href: '/tools/schema-markup-generator', title: 'Schema Markup Generator', desc: 'Generate any schema type in seconds.', Icon: FileText, iconColor: 'text-teal-600', iconBg: 'bg-teal-50 dark:bg-teal-500/10' },
    { href: '/tools/local-schema-builder', title: 'Local Schema Builder', desc: 'Build LocalBusiness schema for SEO.', Icon: Globe, iconColor: 'text-blue-600', iconBg: 'bg-blue-50 dark:bg-blue-500/10' },
    { href: '/blog/structured-data-markup-how-to-use', title: 'Schema Guide', desc: 'Learn how structured data boosts SEO.', Icon: BookOpen, iconColor: 'text-indigo-600', iconBg: 'bg-indigo-50 dark:bg-indigo-500/10' },
  ],
  'Backlink & Link-Building': [
    { href: '/tools/anchor-text-analyzer', title: 'Anchor Text Analyzer', desc: 'Analyze anchor text distribution.', Icon: LinkIcon, iconColor: 'text-rose-600', iconBg: 'bg-rose-50 dark:bg-rose-500/10' },
    { href: '/tools/link-toxicity-checker', title: 'Link Toxicity Checker', desc: 'Detect harmful backlink patterns.', Icon: ShieldCheck, iconColor: 'text-red-600', iconBg: 'bg-red-50 dark:bg-red-500/10' },
    { href: '/tools/outreach-email-template-generator', title: 'Outreach Template', desc: 'Write effective link-building emails.', Icon: FileText, iconColor: 'text-orange-600', iconBg: 'bg-orange-50 dark:bg-orange-500/10' },
    { href: '/tools/backlink-idea-generator', title: 'Backlink Idea Generator', desc: 'Find link-building opportunities.', Icon: Search, iconColor: 'text-violet-600', iconBg: 'bg-violet-50 dark:bg-violet-500/10' },
  ],
  'Competitor Analysis': [
    { href: '/tools/competitor-gap-analyzer', title: 'Competitor Gap Analyzer', desc: 'Find holes in competitor strategies.', Icon: BarChart2, iconColor: 'text-cyan-600', iconBg: 'bg-cyan-50 dark:bg-cyan-500/10' },
    { href: '/tools/competitor-keyword-overlap-checker', title: 'Keyword Overlap Checker', desc: 'See where your keywords compete.', Icon: Search, iconColor: 'text-blue-600', iconBg: 'bg-blue-50 dark:bg-blue-500/10' },
    { href: '/tools/domain-comparison-report-tool', title: 'Domain Comparison', desc: 'Compare domains side-by-side.', Icon: Globe, iconColor: 'text-indigo-600', iconBg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { href: '/tools/ranking-opportunity-finder', title: 'Ranking Opportunities', desc: 'Find pages you can easily outrank.', Icon: TrendingUp, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50 dark:bg-emerald-500/10' },
  ],
  'Local SEO': [
    { href: '/tools/local-citation-finder', title: 'Local Citation Finder', desc: 'Find citation opportunities near you.', Icon: Globe, iconColor: 'text-teal-600', iconBg: 'bg-teal-50 dark:bg-teal-500/10' },
    { href: '/tools/gmb-optimization-helper', title: 'GMB Optimization', desc: 'Optimize your Google Business Profile.', Icon: Settings, iconColor: 'text-blue-600', iconBg: 'bg-blue-50 dark:bg-blue-500/10' },
    { href: '/tools/nap-consistency-checker', title: 'NAP Consistency Checker', desc: 'Check name, address, phone consistency.', Icon: ShieldCheck, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { href: '/tools/local-keyword-generator', title: 'Local Keyword Generator', desc: 'Geo-targeted keyword ideas.', Icon: Target, iconColor: 'text-orange-600', iconBg: 'bg-orange-50 dark:bg-orange-500/10' },
  ],
  'AI-Powered SEO': [
    { href: '/tools/ai-meta-tag-writer', title: 'AI Meta Tag Writer', desc: 'AI generates optimized meta tags.', Icon: Zap, iconColor: 'text-violet-600', iconBg: 'bg-violet-50 dark:bg-violet-500/10' },
    { href: '/tools/ai-content-improver', title: 'AI Content Improver', desc: 'AI-powered content enhancement.', Icon: FileText, iconColor: 'text-purple-600', iconBg: 'bg-purple-50 dark:bg-purple-500/10' },
    { href: '/tools/ai-snippet-generator', title: 'AI Snippet Generator', desc: 'Generate rich snippets with AI.', Icon: Database, iconColor: 'text-indigo-600', iconBg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { href: '/tools/ai-keyword-explainer', title: 'AI Keyword Explainer', desc: 'Understand keyword intent with AI.', Icon: Search, iconColor: 'text-sky-600', iconBg: 'bg-sky-50 dark:bg-sky-500/10' },
  ],
  'SEO Performance': [
    { href: '/tools/site-comparison-report-generator', title: 'Site Comparison Report', desc: 'Compare site performance metrics.', Icon: BarChart2, iconColor: 'text-blue-600', iconBg: 'bg-blue-50 dark:bg-blue-500/10' },
    { href: '/tools/organic-growth-forecast-tool', title: 'Growth Forecast', desc: 'Predict organic traffic growth.', Icon: TrendingUp, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { href: '/tools/seo-health-score-calculator', title: 'SEO Health Score', desc: 'Score your site SEO health.', Icon: ShieldCheck, iconColor: 'text-green-600', iconBg: 'bg-green-50 dark:bg-green-500/10' },
    { href: '/tools/ranking-progress-tracker', title: 'Ranking Progress', desc: 'Track keyword ranking changes.', Icon: Target, iconColor: 'text-orange-600', iconBg: 'bg-orange-50 dark:bg-orange-500/10' },
  ],
  'SEO Utility': [
    { href: '/tools/url-slug-generator', title: 'URL Slug Generator', desc: 'Create SEO-friendly URL slugs.', Icon: LinkIcon, iconColor: 'text-slate-600', iconBg: 'bg-slate-50 dark:bg-slate-500/10' },
    { href: '/tools/redirect-301-generator', title: '301 Redirect Generator', desc: 'Generate proper 301 redirects.', Icon: Settings, iconColor: 'text-amber-600', iconBg: 'bg-amber-50 dark:bg-amber-500/10' },
    { href: '/tools/robots-txt-creator', title: 'Robots.txt Creator', desc: 'Build robots.txt from scratch.', Icon: FileText, iconColor: 'text-indigo-600', iconBg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { href: '/tools/sitemap-generator', title: 'Sitemap Generator', desc: 'Generate XML sitemaps quickly.', Icon: Database, iconColor: 'text-violet-600', iconBg: 'bg-violet-50 dark:bg-violet-500/10' },
  ],
};

export default function CategoryClient({ items = [], catName, slug, initialPage = 1, pageSize = 6, relatedPosts = [] }) {
  const resources = categoryResources[catName] || categoryResources['Keyword Research'];
  const [filteredTools, setFilteredTools] = useState(items);
  const [page, setPage] = useState(Math.max(1, Number(initialPage) || 1));
  const [isLoading, setIsLoading] = useState(true);

  // Simulate progressive loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [filteredTools, page]);

  // When filter changes, reset to page 1
  useEffect(() => { setPage(1); }, [filteredTools]);

  const totalTools = filteredTools.length;
  const toolsPlural = totalTools === 1 ? 'tool' : 'tools';

  // Blog/article pagination
  const totalArticles = relatedPosts.length;
  const totalPages = Math.max(1, Math.ceil(totalArticles / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const visibleArticles = useMemo(() => relatedPosts.slice(startIndex, endIndex), [relatedPosts, startIndex, endIndex]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="space-y-12">
      {/* ── FILTERING SECTION ── */}
      <section className="bg-white dark:bg-gray-900 rounded-[32px] border border-slate-100 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none p-6 md:p-8">
        <SearchFilter tools={items} onChange={setFilteredTools} initialCategory={catName} />

        <div className="mt-8 pt-6 border-t border-slate-50 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-200 dark:shadow-none">
              <LayoutGrid className="text-white w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Displaying</p>
              <p className="text-sm font-black text-slate-900 dark:text-white">{totalTools} {toolsPlural} in {catName}</p>
            </div>
          </div>
          <button
            onClick={() => setFilteredTools(items)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 text-xs font-black hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset filters
          </button>
        </div>
      </section>

      {/* ── TOOLS GRID ── */}
      {filteredTools.length > 0 ? (
        <ToolGrid tools={filteredTools} />
      ) : (
        <div className="rounded-[32px] border-2 border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-gray-900 p-20 text-center">
          <LayoutGrid className="w-12 h-12 mx-auto mb-4 text-slate-200 dark:text-white/10" />
          <p className="font-black text-xl text-slate-900 dark:text-white mb-2">No tools match your filters</p>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">Try adjusting your search terms or clearing the active category filters.</p>
        </div>
      )}

      {/* ── RELATED ARTICLES ── */}
      <section aria-labelledby="related-articles" className="space-y-8 pt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-violet-600">Educational Resources</p>
            <h2 id="related-articles" className="text-3xl font-black text-slate-950 dark:text-white">Related Guides</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={currentPage <= 1}
              aria-label="Previous page"
              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goNext}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
              className="w-10 h-10 rounded-xl border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {visibleArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleArticles.map((post) => (
              <UnifiedCard
                key={post.slug}
                href={`/blog/${post.slug}`}
                title={post.title}
                description={post.description}
                category="Guide"
                readTime={post.readTimeMinutes ? `${post.readTimeMinutes} min read` : 'Deep Dive'}
                variant="article"
                loading={isLoading}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-[32px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-center">
            <p className="text-sm font-bold text-slate-500">No related articles found for this category yet.</p>
          </div>
        )}

        {/* Mobile Pagination */}
        <div className="flex sm:hidden items-center justify-between">
           <button onClick={goPrev} disabled={currentPage <= 1} className="px-6 py-3 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 text-xs font-black disabled:opacity-50">Prev</button>
           <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
           <button onClick={goNext} disabled={currentPage >= totalPages} className="px-6 py-3 rounded-xl bg-white dark:bg-gray-900 border border-slate-200 text-xs font-black disabled:opacity-50">Next</button>
        </div>
      </section>

      {/* ── HELPFUL RESOURCES ── */}
      <section aria-labelledby="helpful-resources" className="space-y-8 pt-12 border-t border-slate-100 dark:border-white/5">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600">Advanced Workflow</p>
          <h2 id="helpful-resources" className="text-3xl font-black text-slate-950 dark:text-white">Helpful Resources</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resources.map(({ href, title, desc, Icon, iconColor, iconBg }) => (
            <Link key={href} href={href} className="group flex items-center gap-6 p-6 rounded-[28px] border border-slate-100 dark:border-white/10 bg-white dark:bg-gray-900 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
              <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${iconBg} ${iconColor} transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                <Icon className="w-6 h-6" />
              </span>
              <div className="min-w-0 flex-1">
                <span className="block font-black text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors">{title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-500 dark:text-slate-400">{desc}</span>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-200 group-hover:text-violet-600 transition-all group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
