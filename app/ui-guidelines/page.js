import React from 'react';
import {
  Palette,
  Type,
  Square,
  Layers,
  Smartphone,
  Monitor,
  Accessibility,
  Zap,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Code,
  Layout
} from 'lucide-react';
import UnifiedCard from '../../components/ui/UnifiedCard';

export const metadata = {
  title: 'Design System & Style Guide | 100 SEO Tools',
  description: 'Comprehensive design system, component specifications, and brand guidelines for 100 SEO Tools.',
  robots: { index: false }
};

export default function StyleGuidePage() {
  return (
    <div className="bg-[#fafbfc] dark:bg-[#020617] min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <header className="mb-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-violet-50 dark:bg-violet-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-violet-700 dark:text-violet-400">
            <Layout className="h-3.5 w-3.5" />
            Design System v2.0
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">Visual Identity & <span className="text-violet-600">UX Standards</span></h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed font-medium">
            A comprehensive framework for building consistent, accessible, and high-performance SEO tools.
            Built on WCAG 2.2 AA standards with a focus on perceived latency reduction.
          </p>
        </header>

        <div className="grid lg:grid-cols-[240px_1fr] gap-16">

          {/* Side Nav */}
          <aside className="hidden lg:block sticky top-24">
            <nav className="space-y-1">
              {['Colors', 'Typography', 'Components', 'Accessibility', 'Motion'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block px-4 py-3 rounded-xl text-sm font-black text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                >
                  {item}
                </a>
              ))}
            </nav>
          </aside>

          <main className="space-y-32">

            {/* ── COLORS ── */}
            <section id="colors" className="scroll-mt-24 space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-200 dark:shadow-none">
                  <Palette className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Color Palette</h2>
              </div>

              <div className="grid gap-12">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Primary Brand (Violet)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[50, 100, 300, 500, 600, 700, 900].map((weight) => (
                      <div key={weight} className="space-y-2">
                        <div className={`h-24 rounded-2xl shadow-sm border border-black/5 bg-violet-${weight}`} />
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Violet {weight}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Neutrals (Slate) - WCAG Optimized</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[50, 200, 400, 600, 900].map((weight) => (
                      <div key={weight} className="space-y-2">
                        <div className={`h-24 rounded-2xl shadow-sm border border-black/5 bg-slate-${weight}`} />
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Slate {weight}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── TYPOGRAPHY ── */}
            <section id="typography" className="scroll-mt-24 space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200 dark:shadow-none">
                  <Type className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Typography</h2>
              </div>

              <div className="space-y-8 p-10 rounded-[40px] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Headings - Inter Black</p>
                  <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">The quick brown fox jumps over the lazy dog</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Body - Inter Medium</p>
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-medium">
                    Our body text is optimized for readability with a 1.625 line-height and specific weight variations to ensure maximum clarity across all devices.
                  </p>
                </div>
              </div>
            </section>

            {/* ── COMPONENTS ── */}
            <section id="components" className="scroll-mt-24 space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200 dark:shadow-none">
                  <Square className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Core Components</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Unified Card (Interactive)</h3>
                  <UnifiedCard
                    title="Meta Tag Generator"
                    description="Preview how your site appears in Google, Facebook, and Twitter search results."
                    category="Utility"
                    interactive={true}
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Skeleton Loading State</h3>
                  <UnifiedCard
                    loading={true}
                  />
                </div>
              </div>
            </section>

            {/* ── ACCESSIBILITY ── */}
            <section id="accessibility" className="scroll-mt-24 space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-200 dark:shadow-none">
                  <Accessibility className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Accessibility Standards</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  [ShieldCheck, 'Contrast Ratio', 'Minimum 4.5:1 for normal text and 3:1 for large text across all themes.'],
                  [Zap, 'Focus States', 'Distinct high-contrast focus rings for all interactive elements.'],
                  [Smartphone, 'Touch Targets', 'Minimum 44x44px target area for all mobile interactive components.'],
                ].map(([Icon, title, desc]) => (
                  <div key={title} className="p-8 rounded-3xl bg-white dark:bg-gray-900 border border-slate-100 dark:border-white/10 shadow-sm">
                    <Icon className="w-6 h-6 text-amber-600 mb-4" />
                    <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">{title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── MOTION ── */}
            <section id="motion" className="scroll-mt-24 space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-200 dark:shadow-none">
                  <Zap className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Motion & Performance</h2>
              </div>

              <div className="bg-slate-950 rounded-[40px] p-12 text-white overflow-hidden relative">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="relative grid md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-2xl font-black mb-6">Optimistic UI Strategy</h3>
                    <p className="text-white/60 text-base leading-relaxed mb-8">
                      We use immediate state updates for all user actions, backed by robust error handling.
                      Perceived latency is minimized through pre-emptive rendering and resource hints.
                    </p>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="w-8 h-8 rounded-full bg-rose-500 animate-pulse flex-shrink-0" />
                      <div className="text-xs font-bold uppercase tracking-widest text-rose-200">System response: &lt;150ms</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                      <Code className="text-blue-400 w-5 h-5" />
                      <code className="text-[10px] font-mono text-blue-200">--ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1)</code>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                      <Layers className="text-violet-400 w-5 h-5" />
                      <code className="text-[10px] font-mono text-violet-200">--duration-normal: 250ms</code>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
