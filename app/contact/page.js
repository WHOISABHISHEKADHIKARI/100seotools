import ContactForm from './ContactForm';
import { getBaseUrl, siteName, logoImage } from '../../lib/site';
import { generateStaticPageSchema } from '../../lib/schema';
import Link from 'next/link';
import Image from 'next/image';

const baseUrl = getBaseUrl();

export const metadata = {
  ...createSocialMetadata({ url: `${baseUrl}/contact`, title: 'Contact Us | 100 SEO Tools', description: 'Get in touch with 100 SEO Tools for guest posting, backlink opportunities, tool suggestions, or general inquiries. 24-48h response time.' }),
  title: 'Contact Us | 100 SEO Tools',
  description: 'Get in touch with 100 SEO Tools for guest posting, backlink opportunities, tool suggestions, or general inquiries. 24-48h response time.',
  robots: { index: true, follow: true },
  alternates: { canonical: `${baseUrl}/contact` },
};

// Enhanced ContactPage schema with Organization and contactPoint for GEO/SEO
const pageSchema = generateStaticPageSchema({
  path: '/contact',
  title: 'Contact Us | 100 SEO Tools',
  description: 'Get in touch with 100 SEO Tools for guest posting, backlink opportunities, tool suggestions, or general inquiries. 24-48h response time.',
}, baseUrl);

pageSchema['@type'] = 'ContactPage';
pageSchema['@context'] = 'https://schema.org';
pageSchema.contactPoint = {
  '@type': 'ContactPoint',
  telephone: '+1 (555) 123-4567',
  contactType: 'customer service',
  areaServed: 'Global',
  availableLanguage: ['English', 'Nepali'],
  url: `${baseUrl}/contact`,
};
pageSchema.telephone = 'tel:+15551234567';
pageSchema.email = 'contact@100seotools.com';

pageSchema['@type'] = 'Organization';
pageSchema.name = '100 SEO Tools';
pageSchema.url = baseUrl;
pageSchema.sameAs = ['https://www.linkedin.com/in/whoisabhishekadhikari/'];

export default function ContactPage() {
  const pageSchema = generateStaticPageSchema({
    path: '/contact',
    title: 'Contact Us | 100 SEO Tools',
    description: 'Get in touch with 100 SEO Tools for guest posting, backlink opportunities, tool suggestions, or general inquiries. 24-48h response time.',
  }, baseUrl);

  pageSchema['@type'] = 'ContactPage';
  pageSchema['@context'] = 'https://schema.org';
  pageSchema.contactPoint = {
    '@type': 'ContactPoint',
    telephone: '+1 (555) 123-4567',
    contactType: 'customer service',
    areaServed: 'Global',
    availableLanguage: ['English', 'Nepali'],
    url: `${baseUrl}/contact`,
  };
  pageSchema.telephone = 'tel:+15551234567';
  pageSchema.email = 'contact@100seotools.com';
  pageSchema['@type'] = 'Organization';
  pageSchema.name = '100 SEO Tools';
  pageSchema.url = baseUrl;
  pageSchema.sameAs = ['https://www.linkedin.com/in/whoisabhishekadhikari/'];

  return (
    <div className="bg-[#fafbfc] dark:bg-[#020617] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-100 dark:border-white/10 shadow-lg p-8 md:p-10 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="shrink-0 w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm">
              <Link href="/" className="text-xl font-black text-emerald-600">
                <svg className="h-7 w-7" viewBox="0 0 24 24" aria-hidden><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </Link>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                Contact Us
              </h1>
              <p className="text-sm font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
                Get in touch with 100 SEO Tools
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                24-48h response time
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-12 items-start">

            {/* ── SIDEBAR NAVIGATION ── */}
            <aside className="hidden lg:block sticky top-24">
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-100 dark:border-white/10 shadow-sm p-5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-3">Sections</p>
                <nav className="space-y-1">
                  <a
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group"
                  >
                    <Home className="w-4 h-4 text-slate-300" aria-hidden />
                    Home
                  </a>
                  <a
                    href="/about"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group"
                  >
                    <FileText className="w-4 h-4 text-slate-300 group-hover:text-emerald-600" />
                    About
                  </a>
                  <a
                    href="/tools"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group"
                  >
                    <Layers3 className="w-4 h-4 text-slate-300 group-hover:text-indigo-200" />
                    Tools
                  </a>
                  <a
                    href="/faq"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-300 group-hover:text-violet-600" />
                    FAQ
                  </a>
                  <a
                    href="/privacy"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Privacy
                  </a>
                </nav>
              </div>
            </aside>

            {/* ── FORM AREA ── */}
            <div className="lg:block">
              <ContactForm />
            </div>

            {/* ── INFO AREA ── */}
            <div>
              <div className="bg-emerald-50 dark:bg-emerald-500/5 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-500/20 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h3 className="text-emerald-600 font-black text-sm uppercase tracking-widest mb-1">Trust & Privacy</h3>
                    <p className="text-sm text-emerald-700/70 dark:text-emerald-400/60 leading-relaxed">
                      All communications are confidential. We do not share your data with third parties.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-6 border border-slate-100 dark:border-white/10 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-5 h-5 text-slate-600" />
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">Contact Details</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Email: <a href="mailto:contact@100seotools.com" className="font-black text-emerald-600 hover:underline dark:text-violet-400 dark:hover:text-violet-300">
                        contact@100seotools.com
                      </a>
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Response Time: 24-48 hours
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-violet-50 dark:bg-violet-500/10 rounded-3xl p-6 border border-violet-100 dark:border-violet-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <HelpCircle className="w-5 h-5 text-violet-600" />
                  <div>
                    <h3 className="text-sm font-black text-violet-900 dark:text-white uppercase tracking-widest mb-1">Quick Links</h3>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <li>
                    <a href="/tools" className="font-black text-violet-600 hover:underline dark:text-violet-400 dark:hover:text-violet-300">
                      Browse 100+ SEO Tools
                    </a>
                  </li>
                  <li>
                    <a href="/blog" className="font-black text-violet-600 hover:underline dark:text-violet-400 dark:hover:text-violet-300">
                      Read SEO Guides & Tutorials
                    </a>
                  </li>
                  <li>
                    <a href="/about" className="font-black text-violet-600 hover:underline dark:text-violet-400 dark:hover:text-violet-300">
                      About 100 SEO Tools
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── Bottom Nav ── */}
          <div className="pt-8 border-t border-slate-100 dark:border-white/10">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/privacy" className="text-xs font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors">Privacy Policy</Link>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <Link href="/terms" className="text-xs font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors">Terms of Service</Link>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <Link href="/about" className="text-xs font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors">About Us</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}