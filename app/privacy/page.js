import { getBaseUrl } from '../../lib/site';
import StructuredData from '../../components/ui/StructuredData';
import { ShieldCheck, Lock, Eye, FileText, ArrowRight, Info, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { createSocialMetadata } from '../../lib/socialMetadata';

const baseUrl = getBaseUrl();

export const metadata = {
  ...createSocialMetadata({ url: `${baseUrl}/privacy`, title: 'Privacy Policy – 100 SEO Tools | Your Data Security Matters', description: 'Learn how 100 SEO Tools handles data, privacy, and cookies. We are a browser-based platform and do not store or sell your personal data.' }),
  title: 'Privacy Policy – 100 SEO Tools | Your Data Security Matters',
  description: 'Learn how 100 SEO Tools handles data, privacy, and cookies. We are a browser-based platform and do not store or sell your personal data.',
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "name": "Privacy Policy - 100 SEO Tools",
        "description": "Learn how 100 SEO Tools handles data, privacy, and cookies. We are browser-based and do not store personal data.",
        "url": `${baseUrl}/privacy`,
        "publisher": {
          "@type": "Organization",
          "name": "100 SEO Tools",
          "url": baseUrl
        }
      }
    ]
  };

  const sections = [
    { id: 'introduction', title: 'Introduction', icon: Info },
    { id: 'data-processing', title: 'Data Processing', icon: Database },
    { id: 'analytics', title: 'Analytics', icon: BarChart },
    { id: 'cookies', title: 'Cookies', icon: Lock },
    { id: 'contact', title: 'Contact Information', icon: Mail },
  ];

  return (
    <div className="bg-[#fafbfc] dark:bg-[#020617] min-h-screen">
      <StructuredData data={jsonLd} />

      {/* ── PREMIUM HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f0528] via-[#1a085e] to-[#050e3a] text-white pt-20 pb-24">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute top-0 right-0 w-[500px] h-full bg-emerald-600/10 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-emerald-100">
            <ShieldCheck className="h-3.5 w-3.5" />
            Privacy & Security
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            Your Privacy is Our <span className="text-emerald-400">Priority</span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            We are committed to protecting your data. Learn how we handle information across our browser-based SEO toolkit.
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
                    <s.icon className="w-4 h-4 text-slate-300 group-hover:text-emerald-600" />
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>

            <div className="mt-6 bg-emerald-50 dark:bg-emerald-500/5 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-500/20">
              <Lock className="w-6 h-6 text-emerald-600 mb-4" />
              <h3 className="text-sm font-black text-emerald-900 dark:text-emerald-400 mb-2 uppercase tracking-tight">Encryption Standards</h3>
              <p className="text-[11px] text-emerald-700/70 dark:text-emerald-400/60 leading-relaxed">
                All data transmitted to our public validators is encrypted via SSL/TLS (HTTPS) to ensure secure processing.
              </p>
            </div>
          </aside>

          {/* ── CONTENT AREA ── */}
          <article className="min-w-0 space-y-12">
            <div className="bg-white dark:bg-gray-900 rounded-[40px] border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

              <div className="p-8 md:p-12 space-y-12 prose prose-slate dark:prose-invert max-w-none">

                <section id="introduction" className="scroll-mt-24">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                    Introduction
                  </h2>
                  <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                    100 SEO Tools is a collection of professional-grade utilities built for digital marketers.
                    Our primary goal is to provide maximum value with minimum data collection. Unlike traditional SEO platforms,
                    we are <strong>browser-based</strong>, meaning the vast majority of our tools process your information
                    locally on your own device.
                  </p>
                </section>

                <section id="data-processing" className="scroll-mt-24 space-y-6">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                    Data Processing
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6 not-prose">
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                      <div className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest mb-3">
                        <Lock className="w-4 h-4" /> Client-Side Tools
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        90% of our tools run entirely in your browser. Inputs never leave your computer, ensuring absolute privacy.
                      </p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
                      <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest mb-3">
                        <Eye className="w-4 h-4" /> Public Validators
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Some tools (like sitemap validators) fetch public web resources. We do not store the URLs you validate.
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    We do not store, sell, or rent your personal data to third parties. We do not require account creation,
                    so we do not have a database of user profiles or email addresses unless you contact us directly.
                  </p>
                </section>

                <section id="analytics" className="scroll-mt-24">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                    Analytics
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    We use privacy-friendly analytics (such as Google Analytics with IP anonymization) to understand how
                    users interact with our toolkit. This data helps us identify which tools are most popular and where
                    we can improve the user experience.
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-3 not-prose list-none p-0">
                    {[
                      'Anonymized IP addresses',
                      'No cross-site tracking',
                      'Aggregated usage patterns',
                      'Browser & device statistics',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                <section id="cookies" className="scroll-mt-24">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                    Cookies
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Cookies are small files stored on your device. We use them sparingly to:
                  </p>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                    <li>Remember your theme preference (Light vs. Dark mode).</li>
                    <li>Store your "Favorite" tools for quick access (localStorage).</li>
                    <li>Ensure security during form submissions.</li>
                  </ul>
                </section>

                <section id="contact" className="scroll-mt-24 pt-10 border-t border-slate-50 dark:border-white/5">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Contact Us</h2>
                  <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="shrink-0 w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm">
                      <Mail className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Privacy Concerns?</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                        If you have any questions regarding this policy or how your data is handled, please reach out to our team.
                      </p>
                      <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-black text-emerald-600 hover:underline">
                        Message Privacy Team <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </section>

              </div>
            </div>

            {/* Bottom Nav */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/terms" className="text-xs font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors">Terms of Service</Link>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <Link href="/faq" className="text-xs font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors">FAQ</Link>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <Link href="/about" className="text-xs font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors">About Us</Link>
            </div>
          </article>

        </div>
      </div>
    </div>
  );
}

const Database = ({ className }) => <FileText className={className} />;
const BarChart = ({ className }) => <ShieldCheck className={className} />;
const Mail = ({ className }) => <ShieldCheck className={className} />;
