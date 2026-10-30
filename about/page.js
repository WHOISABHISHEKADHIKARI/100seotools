import { getBaseUrl } from '../../lib/site';
import { createSocialMetadata } from '../../lib/socialMetadata';
import Link from 'next/link';
import Image from 'next/image';
import StructuredData from '../../components/ui/StructuredData';
import { generateStaticPageSchema, generateFAQSchema } from '../../lib/schema';
import {
  Zap,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Code,
  Globe,
  Database,
  Award
} from 'lucide-react';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'About 100 SEO Tools - Trusted AI & Technical SEO Solutions',
  description: '100 SEO Tools is a trusted, free platform offering AI SEO tools, indexing solutions, and technical auditors. Built for maximum crawlability and EEAT compliance.',
  alternates: { canonical: `${baseUrl}/about` },
  ...createSocialMetadata({
    title: 'About 100 SEO Tools - Trusted AI & Technical SEO Solutions',
    description: '100 SEO Tools is a trusted, free platform offering AI SEO tools, indexing solutions, and technical auditors. Built for maximum crawlability and EEAT compliance.',
    url: `${baseUrl}/about`,
    imageAlt: '100 SEO Tools About Page',
  }),
};

const faqs = [
  { q: 'What is 100 SEO Tools?', a: '100 SEO Tools is a comprehensive, free SEO platform offering 100+ professional-grade tools for keyword research, backlink analysis, technical SEO audits, and more. All tools are completely free with no registration required.' },
  { q: 'Are all tools completely free to use?', a: 'Yes, all 100+ SEO tools are completely free with no hidden costs, subscriptions, or premium tiers. You get full access to all features without any limitations.' },
  { q: 'Do I need to create an account?', a: 'No registration is required. All tools are instantly accessible without creating an account or providing email.' },
];

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
    { '@type': 'ListItem', position: 2, name: 'About', item: `${baseUrl}/about` },
  ]
};

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: '100 SEO Tools',
  url: baseUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${baseUrl}/logo.png`,
  },
  founder: 'Abhishek Adhikari',
  founded: '2024',
};

export default function AboutPage() {
  const faqLd = generateFAQSchema(faqs);
  
  const pageSchema = generateStaticPageSchema({
    path: '/about',
    title: 'About 100 SEO Tools - Trusted AI & Technical SEO Solutions',
    description: '100 SEO Tools is a trusted, free platform offering AI SEO tools, indexing solutions, and technical auditors. Built for maximum crawlability and EEAT compliance.',
  }, baseUrl);

  pageSchema['@type'] = 'AboutPage';
  pageSchema['@graph'] = [aboutSchema, faqLd, breadcrumbSchema];

  return (
    <div className="bg-[#fafbfc] dark:bg-[#020617] min-h-screen">
      <StructuredData data={pageSchema} />

      {/* ── PREMIUM HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f0528] via-[#1a085e] to-[#050e3a] text-white pt-20 pb-24">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-[500px] h-full bg-gradient-to-br from-[#1a085e] via-[#050e3a] to-[#0f0528] bg-emerald-600/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-emerald-100">
            <Zap className="h-3.5 w-3.5" />
            Trusted Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            The Team Behind <span className="text-emerald-400">100 SEO Tools</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            100 SEO Tools is a trusted, free platform offering AI SEO tools, indexing solutions, and technical auditors. Built for maximum crawlability and EEAT compliance.
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest">
            <Clock className="w-4 h-4" />
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </section>

      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 text-sm text-slate-500 dark:text-slate-400">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-violet-600 dark:hover:text-violet-400">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li className="text-slate-800 dark:text-slate-200 font-semibold" aria-current="page">About</li>
        </ol>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 items-start">

          {/* ── SIDEBAR NAVIGATION ── */}
          <aside className="hidden lg:block sticky top-24">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm p-5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-3">Sections</p>
              <nav className="space-y-1">
                {['About Me', 'Our Mission', 'Our Tools', 'Contact'].map((section, i) => (
                  <a
                    key={section}
                    href={`#${section.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group"
                  >
                    {i === 0 ? (
                      <Database className="w-4 h-4 text-slate-300 group-hover:text-emerald-600" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-slate-300 group-hover:text-emerald-600" />
                    )}
                    {section}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* ── CONTENT AREA ── */}
          <article className="min-w-0 space-y-12">
            <div className="bg-white dark:bg-gray-900 rounded-[40px] border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

              <div className="p-8 md:p-12 space-y-12 prose prose-slate dark:prose-invert max-w-none">

                <section id="about-me" className="scroll-mt-24">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                    About Me
                  </h2>
                  <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                    100 SEO Tools is a trusted, free platform offering AI SEO tools, indexing solutions, and technical auditors. Built for maximum crawlability and EEAT compliance.
                  </p>
                  <div className="mt-6 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/5 dark:bg-emerald-500/10">
                    <h3 className="text-emerald-600 font-black mb-4">Abhishek Adhikari</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      SEO expert and full-stack developer dedicated to democratizing SEO tools for everyone. 
                      Built 100+ free browser-based tools used by professionals across 150+ countries.
                    </p>
                  </div>
                </section>

                <section id="mission" className="scroll-mt-24">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                    Our Mission
                  </h2>
                  <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                    To provide maximum value with minimum data collection. Unlike traditional SEO platforms, we are 
                    <strong>browser-based</strong>, meaning the vast majority of our tools process your information locally 
                    on your own device. Privacy is our priority.
                  </p>
                </section>

                <section id="tools" className="scroll-mt-24">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                    Our Tools
                  </h2>
                  <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                    100+ professional-grade SEO tools covering keyword research, on-page optimization, technical SEO, 
                    content optimization, link building, local SEO, and AI-powered SEO. All tools are free, require no 
                    signup, and process data client-side for maximum privacy.
                  </p>
                  <ul className="grid grid-cols-2 gap-4 mt-4 not-prose list-none p-0">
                    <li className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                      <strong>Keyword Research:</strong> Suggestion tool, difficulty analyzer, long-tail finder, LSI generator, clustering
                    </li>
                    <li className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                      <strong>On-Page SEO:</strong> Meta tag generator, content checker, title/length counter, heading analyzer
                    </li>
                    <li className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                      <strong>Technical SEO:</strong> Robots.txt generator, sitemap generator, canonical checker, redirect generator
                    </li>
                    <li className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                      <strong>Content SEO:</strong> Content improver, keyword density checker, tone analyzer, readability checker
                    </li>
                  </ul>
                </section>

                <section id="contact" className="scroll-mt-24 pt-10 border-t border-slate-50 dark:border-white/5">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Contact Us</h2>
                  <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="shrink-0 w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm">
                      <Mail className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Have Questions?</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                        If you have any questions regarding this about page or want to get in touch, please reach out to our team.
                      </p>
                      <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-black text-emerald-600 hover:underline">
                        Message Team <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </section>

              </div>
            </div>

            {/* Bottom Nav */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/tools" className="text-xs font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors">Tools</Link>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <Link href="/blog" className="text-xs font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors">Blog</Link>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <Link href="/contact" className="text-xs font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors">Contact</Link>
            </div>
          </article>

        </div>
      </div>
    </div>
  );
}