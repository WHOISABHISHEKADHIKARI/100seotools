import StructuredData from '../../components/ui/StructuredData';
import { getBaseUrl } from '../../lib/site';
import { createSocialMetadata } from '../../lib/socialMetadata';
import Link from 'next/link';
import {
  Search,
  HelpCircle,
  ChevronRight,
  Zap,
  ShieldCheck,
  Globe,
  Settings,
  FileText,
  BarChart2,
  Link as LinkIcon,
  Target,
  ArrowRight,
  MessageSquare
} from 'lucide-react';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'FAQ - 300+ SEO Tools Questions Answered | Complete Guide 2025',
  description: 'Comprehensive FAQ with 300+ answers about 100 SEO Tools: features, pricing, privacy, keyword research, backlink analysis, technical SEO, and more.',
  alternates: { canonical: `${baseUrl}/faq` },
  ...createSocialMetadata({
    title: 'FAQ - 300+ SEO Tools Questions Answered | 100 SEO Tools',
    description: 'Comprehensive FAQ covering all aspects of 100 SEO Tools platform.',
    url: `${baseUrl}/faq`,
    imageAlt: '100 SEO Tools FAQ',
  }),
};

const faqCategories = [
  {
    category: 'General & Platform',
    icon: HelpCircle,
    color: 'violet',
    faqs: [
      { q: 'What is 100 SEO Tools?', a: '100 SEO Tools is a comprehensive, free SEO platform offering 100+ professional-grade tools for keyword research, backlink analysis, technical SEO audits, and more. All tools are completely free with no registration required.' },
      { q: 'Are all tools completely free to use?', a: 'Yes, all 100+ SEO tools are completely free with no hidden costs, subscriptions, or premium tiers. You get full access to all features without any limitations.' },
      { q: 'Do I need to create an account?', a: 'No registration is required. All tools are instantly accessible without creating an account or providing email.' },
    ],
  },
  {
    category: 'Keyword Research',
    icon: Search,
    color: 'blue',
    faqs: [
      { q: 'What keyword tools are available?', a: 'We offer Keyword Density Checker, Difficulty Analyzer, Long-Tail Finder, LSI Generator, and Clustering tools.' },
      { q: 'How often is keyword data updated?', a: 'Keyword metrics are updated regularly, with search volume data refreshed monthly and competition metrics updated weekly.' },
    ],
  },
  {
    category: 'Technical SEO',
    icon: Settings,
    color: 'orange',
    faqs: [
      { q: 'How do I test my website speed?', a: 'Use our Website Speed Test which analyzes page load time and provides actionable recommendations to improve speed.' },
      { q: 'What are Core Web Vitals?', a: 'Core Web Vitals are Google\'s page experience metrics: LCP, FID, and CLS. They directly impact rankings.' },
    ],
  },
  {
    category: 'Privacy & Security',
    icon: ShieldCheck,
    color: 'emerald',
    faqs: [
      { q: 'Is my data private?', a: 'Yes, we prioritize user privacy. Most tools process data client-side in your browser and never leave your device.' },
      { q: 'Do you use cookies?', a: 'We use minimal cookies for essential functionality and anonymous analytics. No tracking or advertising cookies.' },
    ],
  },
];

export default function FAQPage() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqCategories.flatMap(cat => cat.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a
      }
    })))
  };

  return (
    <div className="bg-[#fafbfc] dark:bg-[#020617] min-h-screen">
      <StructuredData data={faqLd} />

      {/* ── PREMIUM HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f0528] via-[#1a085e] to-[#050e3a] text-white pt-20 pb-24">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-[500px] h-full bg-violet-600/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-violet-100">
            <HelpCircle className="h-3.5 w-3.5" />
            Knowledge Base
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Common Questions <span className="text-violet-400">Answered</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Find instant answers to questions about our 100+ SEO tools, privacy policies, and technical implementation.
          </p>

          <div className="mt-10 max-w-2xl mx-auto relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
            <input
              type="text"
              placeholder="Search for a topic (e.g. 'privacy', 'backlinks')..."
              className="w-full h-16 bg-white/10 border border-white/20 rounded-2xl pl-14 pr-6 text-white placeholder:text-white/30 focus:bg-white/15 focus:ring-4 focus:ring-violet-500/20 outline-none transition-all font-medium"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 items-start">

          {/* Sidebar Nav */}
          <aside className="hidden lg:block sticky top-24">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-4 pt-2">Categories</p>
              <nav className="space-y-1">
                {faqCategories.map((cat) => (
                  <button key={cat.category} className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                    <span className="flex items-center gap-3">
                      <cat.icon className="h-4 w-4 text-slate-400 group-hover:text-violet-600" />
                      {cat.category}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-6 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-violet-200 dark:shadow-none">
              <MessageSquare className="h-6 w-6 mb-4 text-violet-200" />
              <h3 className="text-lg font-black mb-2">Still have questions?</h3>
              <p className="text-xs text-white/70 leading-relaxed mb-6">Our team is here to help you with any custom tool requests or technical issues.</p>
              <Link href="/contact" className="inline-flex items-center justify-center w-full py-3 bg-white text-violet-700 text-xs font-black rounded-xl hover:scale-105 active:scale-95 transition-all">
                Contact Support
              </Link>
            </div>
          </aside>

          {/* FAQ Content */}
          <div className="space-y-16">
            {faqCategories.map((cat) => (
              <section key={cat.category}>
                <div className="flex items-center gap-3 mb-8">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400`}>
                    <cat.icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">{cat.category}</h2>
                </div>

                <div className="grid gap-4">
                  {cat.faqs.map((faq, i) => (
                    <div key={i} className="group bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-white/10 p-6 hover:border-violet-200 dark:hover:border-violet-500/30 transition-all shadow-sm">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-start gap-3">
                        <span className="text-violet-600 dark:text-violet-400 mt-0.5 font-black text-sm">Q.</span>
                        {faq.q}
                      </h3>
                      <div className="pl-7 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        {faq.a}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Bottom CTA */}
            <div className="bg-slate-50 dark:bg-white/5 rounded-[40px] p-12 text-center border border-slate-100 dark:border-white/10">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Can't find what you're looking for?</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
                We're constantly updating our documentation and tools. If you have a specific question or feature request, we'd love to hear from you.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact" className="px-8 py-4 bg-violet-600 text-white font-black rounded-2xl hover:bg-violet-700 transition-all shadow-xl shadow-violet-200 dark:shadow-none">
                  Get in Touch
                </Link>
                <Link href="/tools" className="px-8 py-4 bg-white dark:bg-gray-800 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 font-black rounded-2xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
                  Browse All Tools
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
