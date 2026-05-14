import { getBaseUrl } from '../../lib/site';
import StructuredData from '../../components/ui/StructuredData';
import { Scale, FileText, ShieldAlert, CheckCircle, ArrowRight, Clock, Info, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'Terms of Service – 100 SEO Tools | Usage Guidelines',
  description: 'Read the terms governing your use of 100 SEO Tools. Client-side utilities provided as-is for professional SEO productivity.',
  alternates: { canonical: `${baseUrl}/terms` },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "Terms of Service - 100 SEO Tools",
        "description": "Read the terms governing your use of 100 SEO Tools. Client-side utilities provided as-is for professional SEO productivity.",
        "url": `${baseUrl}/terms`,
        "publisher": {
          "@type": "Organization",
          "name": "100 SEO Tools",
          "url": baseUrl
        }
      }
    ]
  };

  const sections = [
    { id: 'acceptance', title: 'Acceptance of Terms', icon: CheckCircle },
    { id: 'usage', title: 'Use of Tools', icon: FileText },
    { id: 'availability', title: 'Availability & Changes', icon: Clock },
    { id: 'disclaimer', title: 'Disclaimer & Liability', icon: ShieldAlert },
    { id: 'contact', title: 'Contact', icon: HelpCircle },
  ];

  return (
    <div className="bg-[#fafbfc] dark:bg-[#020617] min-h-screen">
      <StructuredData data={jsonLd} />

      {/* ── PREMIUM HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f0528] via-[#1a085e] to-[#050e3a] text-white pt-20 pb-24">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-[500px] h-full bg-violet-600/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-violet-100">
            <Scale className="h-3.5 w-3.5" />
            Legal Agreement
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Terms of <span className="text-violet-400">Service</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            Please read these terms carefully before using our free SEO toolkit. They govern your access and use of our platform.
          </p>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest">
            <Clock className="w-4 h-4" />
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12 items-start">

          {/* ── SIDEBAR NAVIGATION ── */}
          <aside className="hidden lg:block sticky top-24">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm p-5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-3">Sections</p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group"
                  >
                    <s.icon className="w-4 h-4 text-slate-300 group-hover:text-violet-600" />
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>

            <div className="mt-6 bg-slate-50 dark:bg-white/5 rounded-3xl p-6 border border-slate-100 dark:border-white/10">
              <Info className="w-6 h-6 text-violet-600 mb-4" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Fair Use Policy</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Our tools are free for everyone. We request that you do not use automated scripts to scrape data from our platform.
              </p>
            </div>
          </aside>

          {/* ── CONTENT AREA ── */}
          <article className="min-w-0 space-y-12">
            <div className="bg-white dark:bg-gray-900 rounded-[40px] border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-violet-600 via-blue-600 to-indigo-600" />

              <div className="p-8 md:p-12 space-y-12 prose prose-slate dark:prose-invert max-w-none">

                <section id="acceptance" className="scroll-mt-24">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-2 h-8 bg-violet-600 rounded-full" />
                    Acceptance of Terms
                  </h2>
                  <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                    By accessing or using <strong>100 SEO Tools</strong>, you acknowledge that you have read, understood,
                    and agree to be bound by these Terms of Service. If you do not agree with any part of these terms,
                    you must immediately discontinue use of the platform.
                  </p>
                </section>

                <section id="usage" className="scroll-mt-24">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-2 h-8 bg-violet-600 rounded-full" />
                    Use of Tools
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Our tools are provided for professional productivity, educational purposes, and informational use.
                    You are granted a non-exclusive, non-transferable right to use the outputs generated by our tools
                    within your own projects.
                  </p>
                  <div className="bg-violet-50 dark:bg-violet-500/10 rounded-2xl p-6 border border-violet-100 dark:border-violet-500/20 not-prose">
                    <h4 className="text-sm font-black text-violet-900 dark:text-violet-400 mb-3 uppercase tracking-wider">Prohibited Actions</h4>
                    <ul className="grid sm:grid-cols-2 gap-4 list-none p-0">
                      {[
                        'Automated scraping of tool outputs',
                        'Reselling tool access as a service',
                        'Circumventing site security measures',
                        'Using tools for malicious activities',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                          <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section id="availability" className="scroll-mt-24">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-2 h-8 bg-violet-600 rounded-full" />
                    Availability & Changes
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    We strive to maintain 100% uptime for our toolkit. However, we reserve the right to modify,
                    suspend, or discontinue any tool or feature at any time without prior notice. As a free platform,
                    we do not guarantee uninterrupted access or permanent availability of any specific utility.
                  </p>
                </section>

                <section id="disclaimer" className="scroll-mt-24">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-2 h-8 bg-violet-600 rounded-full" />
                    Disclaimer & Liability
                  </h2>
                  <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 not-prose">
                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-widest text-center">Important Legal Notice</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic text-center">
                      "ALL TOOLS ARE PROVIDED 'AS-IS' WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                      100 SEO TOOLS SHALL NOT BE LIABLE FOR ANY DAMAGES RESULTING FROM THE USE OR INABILITY TO USE OUR TOOLS."
                    </p>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-6">
                    While we aim for high accuracy in our technical SEO auditors and AI generators, the dynamic nature
                    of search algorithms means that you should always verify outputs before implementation.
                  </p>
                </section>

                <section id="contact" className="scroll-mt-24 pt-10 border-t border-slate-50 dark:border-white/5">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Contact</h2>
                  <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="shrink-0 w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm">
                      <HelpCircle className="w-8 h-8 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Legal Inquiries?</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                        If you have any questions regarding these terms or wish to discuss a partnership, please contact our legal team.
                      </p>
                      <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-black text-violet-600 hover:underline">
                        Contact Support <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </section>

              </div>
            </div>

            {/* Bottom Nav */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/privacy" className="text-xs font-black text-slate-400 hover:text-violet-600 uppercase tracking-widest transition-colors">Privacy Policy</Link>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <Link href="/faq" className="text-xs font-black text-slate-400 hover:text-violet-600 uppercase tracking-widest transition-colors">FAQ</Link>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <Link href="/about" className="text-xs font-black text-slate-400 hover:text-violet-600 uppercase tracking-widest transition-colors">About Us</Link>
            </div>
          </article>

        </div>
      </div>
    </div>
  );
}
