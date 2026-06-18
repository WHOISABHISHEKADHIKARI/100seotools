"use client";

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  ArrowRight,
  BarChart2,
  CheckCircle,
  Globe,
  Lock,
  Play,
  RefreshCw,
  Search,
  Shield,
  Smartphone,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import SearchFilter from '../components/tools/SearchFilter';
import ToolGrid from '../components/tools/ToolGrid';
import PageLinksGrid from '../components/ui/PageLinksGrid';
import {
  categoryDetails,
  getCategoryHref,
  getMonthlyUse,
  shortToolName,
  visualColors,
} from '../components/tools/SeoVisuals';

const SEOCalculator = dynamic(() => import('../components/tools/SEOCalculator'), {
  loading: () => (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-white/10 dark:bg-gray-900 dark:text-slate-300">
      Loading SEO calculator...
    </div>
  ),
});

function AfterFirstPaint({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const run = () => setMounted(true);
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 200 });
      return () => window.cancelIdleCallback?.(id);
    }
    const timeout = setTimeout(run, 0);
    return () => clearTimeout(timeout);
  }, []);

  return mounted ? children : null;
}

function followNativeHref(href) {
  return (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    window.location.assign(href);
  };
}

const trustItems = [
  [Lock, 'No credit card required', 'text-emerald-500'],
  [Zap, 'Instant results', 'text-amber-500'],
  [Shield, 'Privacy-first processing', 'text-blue-500'],
  [Globe, 'Works worldwide', 'text-violet-500'],
  [RefreshCw, 'Updated for modern SEO', 'text-rose-500'],
  [Smartphone, 'Mobile-friendly', 'text-sky-500'],
];

const workflow = [
  ['01', 'Find your keywords', 'Build a keyword map with suggestion, clustering, intent, and gap tools.', Search],
  ['02', 'Optimize content', 'Improve metadata, headings, readability, density, and internal links.', BarChart2],
  ['03', 'Fix technical issues', 'Validate robots, sitemaps, redirects, schema, and page speed signals.', Zap],
  ['04', 'Build authority', 'Plan links, outreach, citations, and competitive content moves.', TrendingUp],
];

const testimonials = [
  ['Marcus T.', 'SEO Lead', 'We replaced several paid utilities with this toolkit. The workflow is faster and the outputs are practical.'],
  ['Priya S.', 'SEO Consultant', 'The keyword and content tools save me hours every week. Clients get cleaner recommendations sooner.'],
  ['Ryan M.', 'Content Manager', 'The AI and metadata tools are now part of our publishing checklist for every campaign.'],
];

export default function HomePageClient({ initialTools = [] }) {
  const [tools] = useState(initialTools);
  const [filteredTools, setFilteredTools] = useState(initialTools);

  const categoryCounts = useMemo(() => {
    return tools.reduce((acc, tool) => {
      acc[tool.category] = (acc[tool.category] || 0) + 1;
      return acc;
    }, {});
  }, [tools]);

  const popularTools = useMemo(() => tools.slice(0, 9), [tools]);
  const aiTools = useMemo(() => tools.filter((tool) => tool.category === 'AI-Powered SEO').slice(0, 6), [tools]);

  return (
    <div className="space-y-0">
      <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-gradient-to-br from-[#0f0528] via-[#1a085e] to-[#050e3a] text-white">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute -top-40 left-1/2 h-[560px] w-[980px] -translate-x-1/2 rounded-full bg-violet-700 opacity-25 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-blue-600 opacity-15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 text-center sm:px-6">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-extrabold text-violet-100">
            <Star className="h-3.5 w-3.5 text-yellow-300" aria-hidden />
            100+ Free Tools · No Signup · Built for SEO teams
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
            The Complete Suite of{' '}
            <span className="block bg-gradient-to-r from-violet-200 via-blue-200 to-cyan-200 bg-clip-text text-transparent">100+ Free SEO Tools</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/60 md:text-xl">
            Keyword research, technical SEO, AI content, local search, competitor analysis, schema, links, and performance tools in one fast, free workspace.
          </p>

          <div className="mx-auto mt-10 max-w-2xl">
            <a
              href="/tools"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-extrabold text-violet-700 shadow-2xl shadow-black/40 transition hover:scale-[1.01] sm:w-auto"
            >
              Search all tools
              <ArrowRight className="h-5 w-5" aria-hidden />
            </a>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ['100+', 'Free Tools'],
              ['50K+', 'Marketers'],
              ['0', 'Signup Required'],
              ['24/7', 'Browser Access'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-5 backdrop-blur">
                <div className="text-2xl font-extrabold">{value}</div>
                <div className="mt-1 text-xs text-white/50">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative left-1/2 w-screen -translate-x-1/2 border-b border-slate-100 bg-white py-5 dark:border-white/10 dark:bg-gray-950">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 text-sm font-semibold text-slate-500 dark:text-slate-300 sm:px-6">
          {trustItems.map(([Icon, label, color]) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${color}`} aria-hidden />
              {label}
            </div>
          ))}
        </div>
      </section>

      <section className="py-20" id="tools">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-violet-600">Browse by Category</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white md:text-4xl">Find the Right Tool Fast</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
            Every utility is organized by workflow, with fast search and clean tool cards so you can jump straight into the job.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoryDetails.map((category) => {
            const Icon = category.icon;
            const color = visualColors[category.color] || visualColors.violet;
            const href = getCategoryHref(category.label);
            return (
              <a
                key={category.label}
                href={href}
                onClick={followNativeHref(href)}
                aria-label={`Explore ${category.label} category`}
                className={`group block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 dark:border-white/10 dark:bg-gray-900 dark:focus-visible:ring-violet-500/30 ${color.border}`}
              >
                <div className={`h-1.5 bg-gradient-to-r ${color.bar}`} />
                <div className="pointer-events-none p-5">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <span className={`grid h-12 w-12 place-items-center rounded-2xl ${color.icon}`}>
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-extrabold text-slate-500 dark:bg-white/10 dark:text-slate-300">
                      {categoryCounts[category.label] || 0} tools
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-violet-700 dark:text-white dark:group-hover:text-violet-200">{category.label}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{category.description}</p>
                </div>
                <div className="pointer-events-none flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs font-bold text-slate-400 dark:border-white/10">
                  Explore category
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:text-violet-600" aria-hidden />
                </div>
              </a>
            );
          })}
        </div>

        <div className="mb-8">
          <SearchFilter tools={tools} onChange={setFilteredTools} />
        </div>
        <ToolGrid tools={filteredTools} />
      </section>

      <section className="relative left-1/2 w-screen -translate-x-1/2 border-y border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 py-20 dark:border-white/10 dark:from-gray-950 dark:to-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-violet-600">Most Used This Month</p>
              <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white md:text-4xl">Popular Tools</h2>
            </div>
            <a href="/tools" className="hidden items-center gap-2 text-sm font-extrabold text-violet-700 hover:underline sm:flex">
              Browse all tools <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool, index) => {
              const color = visualColors[categoryDetails.find((item) => item.label === tool.category)?.color || 'violet'] || visualColors.violet;
              return (
                <a key={tool.slug} href={`/tools/${tool.slug}`} className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-gray-900">
                  <div className={`h-1 bg-gradient-to-r ${color.bar}`} />
                  <div className="flex items-center gap-4 p-4">
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${color.icon} text-lg font-extrabold`}>
                      {shortToolName(tool.name).charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-extrabold text-slate-900 group-hover:text-violet-700 dark:text-white">{shortToolName(tool.name)}</div>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                        <span>{tool.category}</span>
                        <span>·</span>
                        <Users className="h-3 w-3" aria-hidden />
                        <span>{getMonthlyUse(index)}/mo</span>
                      </div>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${color.badge}`}>Live</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mb-14 text-center">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-violet-600">Simple Workflow</p>
          <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white md:text-4xl">How the SEO Toolkit Works</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {workflow.map(([number, title, description, Icon]) => (
            <div key={number} className="text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-xl shadow-violet-200 dark:shadow-none">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <div className="text-[11px] font-extrabold text-violet-600">{number}</div>
              <h3 className="mt-1 text-sm font-extrabold text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f0528] via-[#1a085e] to-[#050e3a] p-8 text-white md:p-12">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-extrabold text-indigo-100">
                <Zap className="h-3.5 w-3.5 text-yellow-300" aria-hidden />
                AI-powered SEO tools
              </div>
              <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">Work faster with AI SEO helpers</h2>
              <p className="mt-4 text-sm leading-6 text-white/60">
                Generate outlines, write introductions, improve content, build FAQs, and create metadata without leaving the toolkit.
              </p>
              <a href={getCategoryHref('AI-Powered SEO')} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-violet-700">
                Explore AI tools <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
            <div className="grid gap-3">
              {aiTools.map((tool) => (
                <a key={tool.slug} href={`/tools/${tool.slug}`} className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 transition hover:bg-white/15">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-sm font-extrabold text-indigo-700">{shortToolName(tool.name).charAt(0)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold">{shortToolName(tool.name)}</span>
                    <span className="text-[11px] text-white/40">{tool.category}</span>
                  </span>
                  <Zap className="h-4 w-4 text-yellow-300" aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="calculator" className="py-20">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-violet-600">Forecast Impact</p>
            <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white">SEO Calculator</h2>
          </div>
          <a href="/tools" className="text-sm font-bold text-violet-700 hover:underline">Back to tools</a>
        </div>
        <AfterFirstPaint>
          <SEOCalculator />
        </AfterFirstPaint>
      </section>

      <section className="relative left-1/2 w-screen -translate-x-1/2 border-y border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 py-20 dark:border-white/10 dark:from-gray-950 dark:to-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-violet-600">What Marketers Say</p>
            <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white md:text-4xl">Trusted by SEO Professionals</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map(([name, role, text]) => (
              <div key={name} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-gray-900">
                <div className="mb-4 flex items-center gap-1 text-yellow-400">
                  {[0, 1, 2, 3, 4].map((item) => <Star key={item} className="h-4 w-4 fill-current" aria-hidden />)}
                </div>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">"{text}"</p>
                <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-white/10">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-sm font-extrabold text-white">{name.charAt(0)}</span>
                  <span>
                    <span className="block text-sm font-extrabold text-slate-900 dark:text-white">{name}</span>
                    <span className="text-xs text-slate-400">{role}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pages" className="py-20">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-3xl font-extrabold text-slate-950 dark:text-white">Explore Pages</h2>
          <a href="/tools" className="text-sm font-bold text-violet-700 hover:underline">Back to Tools</a>
        </div>
        <PageLinksGrid />
      </section>

      <section className="pb-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-blue-700 to-indigo-800 p-10 text-center text-white shadow-2xl shadow-violet-200/50 md:p-14 dark:shadow-none">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-extrabold">
            <CheckCircle className="h-4 w-4" aria-hidden />
            Ready when you are
          </div>
          <h2 className="text-3xl font-extrabold md:text-5xl">Start ranking higher today</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/70">
            Every tool you need to research, audit, optimize, and ship better SEO work is already here.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="/tools" className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-base font-extrabold text-violet-700">
              Browse all tools <ArrowRight className="h-5 w-5" aria-hidden />
            </a>
            <a href="/blog/seo-basics" className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-7 py-4 text-base font-bold text-white transition hover:bg-white/25">
              <Play className="h-4 w-4" aria-hidden />
              Read SEO basics
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
