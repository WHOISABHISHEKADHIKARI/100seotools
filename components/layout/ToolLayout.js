import Link from 'next/link';
import { getToolGuide, getInstructionEntry } from '../../lib/guides';
import StructuredData from '../ui/StructuredData';
import ErrorBoundary from './ErrorBoundary';
import { ArrowRight, BookOpen, CheckCircle, Shield, Zap } from 'lucide-react';
import { getCategoryDetail, shortToolName, visualColors } from '../tools/SeoVisuals';

export default function ToolLayout({ tool, children, relatedTools = [], extraSchema = [] }) {
  const guide = getToolGuide(tool);
  const override = getInstructionEntry(tool.slug);
  const detail = getCategoryDetail(tool.category);
  const Icon = detail.icon;
  const color = visualColors[detail.color] || visualColors.violet;
  const displayName = shortToolName(tool.name);

  const guideSubpages = [
    ['How to Use', '#how-to-heading', 'Step-by-step workflow'],
    ['Features', '#what-heading', 'Benefits and keywords'],
    ['Best Practices', '#seo-heading', 'Practical checks'],
    ['Checklist', '#tool-form', 'Repeatable process'],
    ['Search Terms', '#faq-heading', 'Related queries'],
  ];

  const relatedItems = (() => {
    const seen = new Set();
    const items = [];
    if (Array.isArray(guide?.relatedTools)) {
      guide.relatedTools.forEach((slug) => {
        if (seen.has(slug)) return;
        seen.add(slug);
        items.push({
          slug,
          name: slug.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        });
      });
    }
    if (Array.isArray(relatedTools)) {
      relatedTools.forEach((relatedTool) => {
        if (seen.has(relatedTool.slug)) return;
        seen.add(relatedTool.slug);
        items.push({ slug: relatedTool.slug, name: relatedTool.name });
      });
    }
    return items.slice(0, 5);
  })();

  return (
    <div className="space-y-5">
      <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-b border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] dark:border-white/10 dark:bg-[linear-gradient(180deg,#0f172a_0%,#020617_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-12">
          <div className="max-w-4xl">
            <div className="mb-5 flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color.icon} shadow-sm`}>
                <Icon className="h-7 w-7" aria-hidden />
              </div>
              <div>
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{tool.category}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Free, no signup</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 md:text-5xl dark:text-white">{displayName}</h1>
              </div>
            </div>

            <p className="max-w-3xl text-base leading-7 text-slate-600 md:text-lg dark:text-slate-300">{tool.description}</p>

            <div className="mt-7 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <CheckCircle className="h-4 w-4 text-emerald-600" /> Clear output
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <Shield className="h-4 w-4 text-slate-500" /> Privacy focused
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm dark:border-white/10 dark:bg-white/5">
                <Zap className="h-4 w-4 text-amber-500" /> Fast workflow
              </span>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#tool-form" className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                Open tool
              </a>
              <a href="#intro-heading" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
                Read guide
                <BookOpen className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-gray-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-white/5">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Guide sections for better results.</p>
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-extrabold ${color.badge}`}>
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {tool.category}
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {guideSubpages.map(([label, href, meta]) => (
            <a
              key={href}
              href={href}
              className="group rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <span className="block text-sm font-extrabold text-slate-900 group-hover:text-slate-700 dark:text-white">{label}</span>
              <span className="mt-1 block text-[11px] leading-tight text-slate-500 dark:text-slate-400">{meta}</span>
            </a>
          ))}
        </div>
      </div>

      <div id="tool-form" className="scroll-mt-20">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-gray-900">
          <div className="p-4 sm:p-5 md:p-6">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['Clear', 'Readable Results', CheckCircle, 'text-emerald-500'],
          ['Free', 'No Signup', Zap, 'text-amber-500'],
          ['Private', 'Focused Flow', Shield, 'text-blue-500'],
          ['Fast', 'Simple Checks', Zap, 'text-slate-500'],
        ].map(([value, label, StatIcon, iconColor]) => (
          <div key={label} className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-white/10 dark:bg-gray-900">
            <StatIcon className={`mb-2 h-5 w-5 ${iconColor}`} aria-hidden />
            <span className="text-lg font-extrabold text-slate-950 dark:text-white">{value}</span>
            <span className="mt-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{label}</span>
          </div>
        ))}
      </div>

      {guide && (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-5">
            <div className="space-y-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7 dark:border-white/10 dark:bg-gray-900">
              <section aria-labelledby="intro-heading" className="space-y-3">
                <h2 id="intro-heading" className="text-2xl font-extrabold text-slate-900 dark:text-white">Introduction</h2>
                <p className="leading-7 text-slate-600 dark:text-slate-300">{guide.introduction}</p>
              </section>

              <div className="grid gap-6 sm:grid-cols-2">
                <section aria-labelledby="what-heading" className="space-y-3">
                  <h3 id="what-heading" className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-900 dark:bg-white" />
                    Why this tool is needed
                  </h3>
                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{guide.whatItDoes}</p>
                </section>
                <section aria-labelledby="seo-heading" className="space-y-3">
                  <h3 id="seo-heading" className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-900 dark:bg-white" />
                    Role in SEO
                  </h3>
                  <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{guide.whyItMattersSEO}</p>
                </section>
              </div>

              <section className="space-y-4 border-t border-slate-100 pt-7 dark:border-white/5">
                <h2 id="how-to-heading" className="scroll-mt-24 text-xl font-extrabold text-slate-900 dark:text-white">How to use it well</h2>
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{guide.howToUse}</p>
                {Array.isArray(guide.howToSteps) && guide.howToSteps.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {guide.howToSteps.map((step, index) => (
                      <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Step {index + 1}</span>
                        <p className="mt-1 text-xs font-bold text-slate-900 dark:text-white">{step.step}</p>
                        <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{step.tip}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {Array.isArray(guide.faqs) && guide.faqs.length > 0 && (
                <section className="space-y-4 border-t border-slate-100 pt-7 dark:border-white/5">
                  <h2 id="faq-heading" className="scroll-mt-24 text-xl font-extrabold text-slate-900 dark:text-white">Frequently asked questions</h2>
                  <div className="divide-y divide-slate-100 dark:divide-white/5">
                    {guide.faqs.map((faq, index) => (
                      <div key={index} className="py-4 first:pt-0">
                        <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">{faq.q}</h3>
                        <p className="text-sm leading-7 text-slate-500 dark:text-slate-400">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {guide.exampleResults && (
                <section className="space-y-3 border-t border-slate-100 pt-7 dark:border-white/5">
                  <h2 className="scroll-mt-24 text-xl font-extrabold text-slate-900 dark:text-white">Example output</h2>
                  <pre className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 whitespace-pre-wrap">{guide.exampleResults}</pre>
                </section>
              )}

              {Array.isArray(guide.bestPractices) && guide.bestPractices.length > 0 && (
                <section className="space-y-3 border-t border-slate-100 pt-7 dark:border-white/5">
                  <h2 className="scroll-mt-24 text-xl font-extrabold text-slate-900 dark:text-white">Best practices</h2>
                  <ul className="space-y-2">
                    {guide.bestPractices.map((bp, index) => (
                      <li key={index} className="flex gap-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        <CheckCircle className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-500" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>

          <aside className="space-y-5">
            {relatedItems.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900">
                <h3 className="mb-4 text-xs font-extrabold uppercase tracking-[0.15em] text-slate-400">Related tools</h3>
                <div className="space-y-2">
                  {relatedItems.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/tools/${item.slug}`}
                      className="group flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                    >
                      <span className="truncate pr-4 text-xs font-bold text-slate-700 transition-colors group-hover:text-slate-950 dark:text-slate-300 dark:group-hover:text-white">{item.name}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-slate-600" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(guide.benefits) && guide.benefits.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900">
                <h3 className="mb-4 text-xs font-extrabold uppercase tracking-[0.15em] text-slate-400">What improves</h3>
                <ul className="space-y-3">
                  {guide.benefits.slice(0, 5).map((benefit, index) => (
                    <li key={index} className="flex gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      <CheckCircle className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-500" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(guide.useCases) && guide.useCases.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-900">
                <h3 className="mb-4 text-xs font-extrabold uppercase tracking-[0.15em] text-slate-400">Use cases</h3>
                <ul className="space-y-3">
                  {guide.useCases.slice(0, 5).map((uc, index) => (
                    <li key={index} className="flex gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      <Zap className="mt-1 h-4 w-4 flex-shrink-0 text-amber-500" />
                      <span>{uc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      )}

      {extraSchema.map((schema, index) => (
        <StructuredData key={index} data={schema} />
      ))}
    </div>
  );
}
