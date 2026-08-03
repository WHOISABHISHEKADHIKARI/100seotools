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
    imageAlt: 'About 100 SEO Tools',
  })
};

const faqs = [
  {
    question: 'How do AI crawlers interpret SEO tools?',
    answer: 'AI crawlers prioritize structured data, fast load times, and semantic relevance. Our tools are optimized with comprehensive JSON-LD (SoftwareApplication, HowTo, and FAQ schema) to provide clean, machine-readable signals.'
  },
  {
    question: 'What is the "Live Preview" feature in your tools?',
    answer: 'Most of our tools feature real-time processing. As you type in the input fields, the logic executes immediately, allowing you to see results and optimize your metadata or content without multiple clicks.'
  },
  {
    question: 'Are the tools safe for my data?',
    answer: 'Yes. All our tools run entirely client-side in your browser. We do not store or transmit your inputs or generated outputs to any server, ensuring 100% privacy and lightning-fast performance.'
  },
  {
    question: 'How do these tools help with technical SEO?',
    answer: 'By providing instant validation for robots.txt, sitemaps, and canonical tags, our tools help you identify and fix crawlability issues that might be hindering your site\'s indexation.'
  },
  {
    question: 'Can I use these tools on mobile devices?',
    answer: 'Absolutely. Every tool is built with a responsive, mobile-first design, ensuring that you can audit and optimize your SEO strategy on the go.'
  }
];

export default function AboutPage() {
  const aboutSchema = generateStaticPageSchema({
    path: '/about',
    title: metadata.title,
    description: metadata.description
  }, baseUrl);

  aboutSchema['@type'] = 'AboutPage';
  aboutSchema['headline'] = 'About 100 SEO Tools';
  aboutSchema['author'] = {
    '@type': 'Person',
    'name': 'Abhishek Adhikari',
    'url': `${baseUrl}/author`
  };

  const faqSchema = generateFAQSchema(faqs);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'About', item: `${baseUrl}/about` },
    ]
  };

  return (
    <div className="bg-[#fafbfc] dark:bg-[#020617] min-h-screen">
      <StructuredData data={[aboutSchema, faqSchema, breadcrumbSchema]} />

      {/* ── PREMIUM HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f0528] via-[#1a085e] to-[#050e3a] text-white pt-20 pb-24">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-violet-100">
            <Award className="h-3.5 w-3.5 text-yellow-300" />
            Built for Excellence
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
            The Ultimate <span className="text-violet-400">Browser-Based</span>
            <br />
            SEO Toolkit
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            Empowering 50,000+ marketers with authoritative, high-performance tools and AI-driven solutions to dominate the search results.
          </p>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              ['100+', 'SEO Utilities', Zap, 'text-amber-400'],
              ['50k+', 'Monthly Users', Users, 'text-blue-400'],
              ['100%', 'Privacy Focused', ShieldCheck, 'text-emerald-400'],
              ['Free', 'Forever', Award, 'text-violet-400'],
            ].map(([val, label, Icon, iconColor]) => (
              <div key={label} className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Icon className={`h-6 w-6 mx-auto mb-3 ${iconColor}`} />
                <div className="text-2xl font-black">{val}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</div>
              </div>
            ))}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 relative z-10">
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-100 dark:border-white/10 shadow-2xl p-8 md:p-12">
          <div className="grid lg:grid-cols-[1fr_350px] gap-16">
            <div className="space-y-12">
              {/* Mission */}
              <section>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <div className="w-2 h-10 bg-violet-600 rounded-full" />
                  Our Mission
                </h2>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    In an era where search algorithms evolve daily, having reliable <strong>technical SEO</strong> and indexing utilities is non-negotiable.
                    <Link href="/" className="text-violet-600 font-bold hover:underline mx-1">100 SEO Tools</Link>
                    was built to bridge the gap between complex enterprise software and accessible, browser-based efficiency.
                    We provide a comprehensive suite of 100+ utilities designed to streamline your workflow without annoying login barriers or paywalls.
                  </p>
                </div>
              </section>

              {/* Pillars */}
              <section className="grid md:grid-cols-2 gap-8">
                <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 hover-lift">
                  <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-violet-200 dark:shadow-none">
                    <Zap className="text-white h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">Human-First Usability</h2>
                  <ul className="space-y-3">
                    {[
                      ['Live Preview', 'See changes reflected instantly as you type.'],
                      ['Example Data', 'One-click loading for best-practice inputs.'],
                      ['Session Persistence', 'Your inputs are remembered across refreshes.'],
                      ['One-Click Reset', 'Quickly clear workspace for new analysis.'],
                    ].map(([title, desc]) => (
                      <li key={title} className="flex gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">{title}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{desc}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 hover-lift">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 dark:shadow-none">
                    <Code className="text-white h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mb-4">Automated JSON-LD</h2>
                  <ul className="space-y-3">
                    {[
                      ['SoftwareApplication', 'Identifies tool category and availability.', null],
                      ['HowTo Schema', 'Step-by-step instructions for search bots.', '/tools/howto-schema-generator'],
                      ['FAQPage Schema', 'Dynamic generation based on tool logic.', '/tools/faq-schema-generator'],
                      ['BreadcrumbList', 'Ensures clear navigation for rich snippets.', '/tools/breadcrumb-schema-generator'],
                    ].map(([title, desc, link]) => (
                      <li key={title} className="flex gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                        <div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white">
                            {link ? <Link href={link} className="hover:text-violet-600 dark:hover:text-violet-400">{title}</Link> : title}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{desc}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Commitment */}
              <section className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-10 text-white relative overflow-hidden shadow-xl shadow-violet-200 dark:shadow-none">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                <div className="relative">
                  <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                    <ShieldCheck className="h-8 w-8 text-violet-200" />
                    EEAT & Data Accuracy
                  </h2>
                  <p className="text-white/80 leading-relaxed mb-8 font-medium">
                    Google's Experience, Expertise, Authoritativeness, and Trustworthiness guidelines are the cornerstone of our development process.
                    We ensure every tool delivers accurate, actionable data backed by industry standards.
                  </p>
                  <div className="grid sm:grid-cols-3 gap-6">
                    {[
                      ['Expertise', 'Curated by seasoned SEO professionals.'],
                      ['Authority', 'Referenced by technical audits globally.'],
                      ['Trust', 'Privacy-first with no data retention.'],
                    ].map(([title, desc]) => (
                      <div key={title}>
                        <div className="text-lg font-black text-violet-200 mb-1">{title}</div>
                        <div className="text-xs text-white/60 leading-relaxed">{desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* FAQs */}
              <section>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="p-6 rounded-2xl border border-slate-100 dark:border-white/10 bg-white dark:bg-gray-800/50">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{faq.question}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Link href="/faq" className="inline-flex items-center gap-2 text-sm font-black text-violet-600 hover:underline">
                    Find more answers in our full FAQ section <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              {/* Author Profile */}
              <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-8 border border-slate-100 dark:border-white/10 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Author & Creator</p>
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-violet-500 blur-2xl opacity-20 rounded-full" />
                  <Image
                    src="/author.png"
                    alt="Abhishek Adhikari"
                    width={120}
                    height={120}
                    className="relative rounded-3xl border-4 border-white dark:border-slate-800 shadow-xl"
                  />
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Abhishek Adhikari</h2>
                <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-4">Lead Developer & SEO Strategist</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                  Passionate about building accessible <strong>AI SEO tools</strong> and automation workflows for the digital marketing community.
                </p>
                <Link href="/author" className="inline-flex items-center justify-center gap-2 w-full py-4 bg-white dark:bg-gray-800 text-slate-900 dark:text-white text-sm font-black rounded-2xl border border-slate-200 dark:border-white/10 hover:border-violet-300 transition-all shadow-sm">
                  View Profile <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Quick Links */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-slate-100 dark:border-white/10">
                <h4 className="text-sm font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest">Resources</h4>
                <div className="space-y-3">
                  {[
                    ['All SEO Tools', '/tools', LayoutGrid],
                    ['SEO Guides', '/blog', BookOpen],
                    ['Contact Us', '/contact', Globe],
                    ['Privacy Policy', '/privacy', ShieldCheck],
                  ].map(([label, href, Icon]) => (
                    <Link key={label} href={href} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-violet-600">{label}</span>
                      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-violet-600 transition-all group-hover:translate-x-1" />
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

const LayoutGrid = ({ className }) => <Database className={className} />;
const BookOpen = ({ className }) => <Globe className={className} />;
