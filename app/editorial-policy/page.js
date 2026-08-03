import { getBaseUrl } from '../../lib/site';
import StructuredData from '../../components/ui/StructuredData';
import { FileText, ShieldCheck, CheckCircle, ArrowRight, Star, Search, Globe } from 'lucide-react';
import Link from 'next/link';
import { createSocialMetadata } from '../../lib/socialMetadata';

const baseUrl = getBaseUrl();

export const metadata = {
  ...createSocialMetadata({ url: `${baseUrl}/editorial-policy`, title: 'Editorial Policy – 100 SEO Tools | Content & AI Standards', description: 'Our editorial standards: how we create, review, and update SEO content. Transparency in AI-assisted writing, human expertise, and factual accuracy.' }),
  title: 'Editorial Policy – 100 SEO Tools | Content & AI Standards',
  description: 'Our editorial standards: how we create, review, and update SEO content. Transparency in AI-assisted writing, human expertise, and factual accuracy.',
  alternates: { canonical: `${baseUrl}/editorial-policy` },
  robots: { index: true, follow: true },
};

export default function EditorialPolicyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
          { "@type": "ListItem", "position": 2, "name": "Editorial Policy", "item": `${baseUrl}/editorial-policy` },
        ]
      },
      {
        "@type": "WebPage",
        "name": "Editorial Policy - 100 SEO Tools",
        "description": "Our editorial standards: how we create, review, and update SEO content. Transparency in AI-assisted writing, human expertise, and factual accuracy.",
        "url": `${baseUrl}/editorial-policy`,
        "publisher": {
          "@type": "Organization",
          "name": "100 SEO Tools",
          "url": baseUrl
        }
      }
    ]
  };

  const sections = [
    { id: 'standards', title: 'Editorial Standards', icon: FileText },
    { id: 'ai-use', title: 'AI & Human Expertise', icon: Star },
    { id: 'accuracy', title: 'Accuracy & Corrections', icon: ShieldCheck },
    { id: 'updates', title: 'Content Updates', icon: Globe },
  ];

  return (
    <div className="bg-[#fafbfc] dark:bg-[#020617] min-h-screen">
      <StructuredData data={jsonLd} />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f0528] via-[#1a085e] to-[#050e3a] text-white pt-20 pb-24">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-[500px] h-full bg-violet-600/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-violet-100">
            <FileText className="h-3.5 w-3.5" />
            Transparency
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Editorial <span className="text-violet-400">Policy</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            How we research, write, review, and maintain content on 100 SEO Tools. We believe in transparency about AI-assisted workflows and human editorial oversight.
          </p>
        </div>
      </section>

      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 text-sm text-slate-500 dark:text-slate-400">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-violet-600 dark:hover:text-violet-400">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-slate-800 dark:text-slate-200 font-semibold" aria-current="page">Editorial Policy</li>
        </ol>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-100 dark:border-white/10 shadow-2xl">
          <div className="h-2 bg-gradient-to-r from-violet-600 via-blue-600 to-indigo-600 rounded-t-3xl" />

          <div className="grid lg:grid-cols-[280px_1fr] gap-12 p-8 md:p-12">
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-4 border border-slate-100 dark:border-white/10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4 pt-2">On this page</p>
                  <nav className="space-y-1">
                    {sections.map((s) => (
                      <a key={s.id} href={`#${s.id}`} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-white/5 transition-all group">
                        <s.icon className="w-4 h-4 text-slate-400 group-hover:text-violet-600" />
                        {s.title}
                      </a>
                    ))}
                  </nav>
                </div>

                <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-violet-200 dark:shadow-none">
                  <Search className="h-6 w-6 mb-4 text-violet-200" />
                  <h3 className="text-lg font-black mb-2">Explore our tools</h3>
                  <p className="text-xs text-white/70 leading-relaxed mb-6">All 100+ tools are free, browser-based, and require no signup.</p>
                  <Link href="/tools" className="inline-flex items-center justify-center w-full py-3 bg-white text-violet-700 text-xs font-black rounded-xl hover:scale-105 active:scale-95 transition-all">
                    Browse Tools
                  </Link>
                </div>
              </div>
            </aside>

            <article className="min-w-0 space-y-12">
              <div className="space-y-12 prose prose-slate dark:prose-invert max-w-none">
                <section id="standards" className="scroll-mt-24">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-2 h-8 bg-violet-600 rounded-full" />
                    Editorial Standards
                  </h2>
                  <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                    Every piece of content on 100 SEO Tools is created with a single goal: to provide accurate, actionable, and trustworthy information for SEO professionals. Our editorial process emphasizes practical utility over fluff.
                  </p>
                  <ul className="space-y-4 not-prose list-none p-0 mt-6">
                    {[
                      ['Expert Review', 'Content is reviewed by Abhishek Adhikari, a practicing SEO professional and full-stack developer with hands-on experience in technical SEO, schema markup, and content strategy.'],
                      ['Practical Focus', 'Every article and guide is grounded in real-world SEO workflows. We prioritize actionable steps, clear examples, and tools you can use immediately.'],
                      ['Original Research', 'Where possible, we cite authoritative sources, industry studies, and official documentation. Tool descriptions are based on actual functionality, not marketing claims.'],
                      ['Clear Attribution', 'If content references external data, studies, or quotes, we link to the original source. AI-assisted content is disclosed in this policy.'],
                    ].map(([title, desc]) => (
                      <li key={title} className="flex gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                        <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white mb-1">{title}</div>
                          <div className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                <section id="ai-use" className="scroll-mt-24">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-2 h-8 bg-violet-600 rounded-full" />
                    AI & Human Expertise
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    100 SEO Tools uses AI-assisted workflows to accelerate content creation. However, all content undergoes human editorial review before publication. Our approach:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-6 not-prose mt-6">
                    {[
                      ['AI-Assisted Drafting', 'We use AI to generate initial drafts, outlines, and code examples. This allows us to cover more topics while maintaining consistency.'],
                      ['Human Review', 'Every draft is reviewed, edited, and fact-checked by an SEO professional before publication. AI output is never published verbatim.'],
                      ['Tool Data Accuracy', 'All tool descriptions, feature lists, and capability claims are verified against the actual tool implementation — not generated from AI knowledge.'],
                      ['Continuous Improvement', 'Reader feedback, search data, and algorithm updates inform content revisions. We treat content as living documentation.'],
                    ].map(([title, desc]) => (
                      <div key={title} className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                        <div className="font-bold text-sm text-slate-900 dark:text-white mb-2">{title}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</div>
                      </div>
                    ))}
                  </div>
                </section>

                <section id="accuracy" className="scroll-mt-24">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-2 h-8 bg-violet-600 rounded-full" />
                    Accuracy & Corrections
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    We strive for accuracy but recognize that SEO is an evolving field. If you identify an error, outdated information, or broken tool behavior, please contact us so we can correct it promptly.
                  </p>
                  <div className="not-prose mt-6">
                    <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-black text-violet-600 hover:underline">
                      Report an issue <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </section>

                <section id="updates" className="scroll-mt-24">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-2 h-8 bg-violet-600 rounded-full" />
                    Content Updates
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Blog posts and tool guides display a "Last updated" date so readers know when content was reviewed. Major updates include changelog notes. We review high-traffic content quarterly and update all content at least annually.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                    Tool pages reflect the current functionality of each utility. When a tool is updated, deprecated, or added, the corresponding guide content is revised within the same release cycle.
                  </p>
                </section>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-8 border-t border-slate-100 dark:border-white/10">
                <Link href="/privacy" className="text-xs font-black text-slate-400 hover:text-violet-600 uppercase tracking-widest transition-colors">Privacy Policy</Link>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <Link href="/terms" className="text-xs font-black text-slate-400 hover:text-violet-600 uppercase tracking-widest transition-colors">Terms of Service</Link>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <Link href="/about" className="text-xs font-black text-slate-400 hover:text-violet-600 uppercase tracking-widest transition-colors">About Us</Link>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
