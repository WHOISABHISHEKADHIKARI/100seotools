import Link from 'next/link';
import { FiFacebook, FiInstagram, FiLinkedin, FiMail, FiPhone, FiArrowUpRight, FiGithub } from 'react-icons/fi';

// Categories to surface in footer
const categories = [
  'Keyword Research',
  'On-Page Optimization',
  'Technical SEO',
  'Backlink & Link-Building',
  'Content SEO',
  'SEO Performance',
  'Local SEO',
  'Competitor Analysis',
  'AI-Powered SEO',
  'SEO Utility'
];

function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/&/g, ' ') // normalize ampersand
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer role="contentinfo" className="bg-white text-slate-800 dark:bg-gray-900 dark:text-white py-12 md:py-16 mt-12 md:mt-16" aria-labelledby="footerHeading">
      <h2 id="footerHeading" className="sr-only">Site footer</h2>
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid gap-10 md:gap-12 sm:grid-cols-2 lg:grid-cols-4 items-start">
          {/* Brand Info */}
          <div>
            <h3 className="text-2xl font-bold">Hashtag Solutions</h3>
            <p className="mt-3 text-slate-600 dark:text-gray-400">Empowering businesses and individuals with web solutions, SEO tools, and digital growth strategies.</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href="mailto:hashtagsolutionsocail@gmail.com" className="inline-flex items-center gap-2 rounded-lg border border-slate-300/60 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm transition-transform will-change-transform hover:scale-[1.01]" aria-label="Email Hashtag Solutions">
              <FiMail aria-hidden className="w-4 h-4" /> Email us
            </a>
            <a href="tel:+9779823405140" className="inline-flex items-center gap-2 rounded-lg border border-slate-300/60 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm transition-transform will-change-transform hover:scale-[1.01]" aria-label="Call Hashtag Solutions">
              <FiPhone aria-hidden className="w-4 h-4" /> +977-9823405140
            </a>
            <a href="https://github.com/hashtagsolutions" className="inline-flex items-center gap-2 rounded-lg border border-slate-300/60 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm transition-transform will-change-transform hover:scale-[1.01]" rel="noopener noreferrer" target="_blank" aria-label="Visit Hashtag Solutions GitHub">
              <FiGithub className="h-4 w-4" />
              GitHub
            </a>
          </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2.5 text-slate-600 dark:text-gray-300">
              <li><Link href="/" className="transition-transform will-change-transform hover:scale-[1.01] focus-visible:underline">Home</Link></li>
              <li><Link href="/about" className="transition-transform will-change-transform hover:scale-[1.01] focus-visible:underline">About Us</Link></li>
              <li><Link href="/blog" className="transition-transform will-change-transform hover:scale-[1.01] focus-visible:underline">Blog</Link></li>
            </ul>
          </nav>

          {/* Categories */}
          <nav aria-label="Tool categories">
            <h3 className="text-lg font-semibold">Categories</h3>
            <ul className="mt-4 space-y-2.5 text-slate-600 dark:text-gray-300">
              {categories.map((c) => (
                <li key={c}>
                  <Link href={`/category/${toSlug(c)}`} className="transition-transform will-change-transform hover:scale-[1.01] focus-visible:underline">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social & Contact */}
          <div>
            <h3 className="text-lg font-semibold">Follow</h3>
            <div className="mt-4 flex items-center gap-3">
              <a href="https://www.facebook.com/hashtagwebsolutionsnepal" className="inline-flex items-center gap-2 rounded-lg border border-slate-300/60 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm transition-transform will-change-transform hover:scale-[1.01]" rel="noopener noreferrer" target="_blank" aria-label="Facebook">
                <FiFacebook aria-hidden className="w-4 h-4" /> Facebook <FiArrowUpRight aria-hidden className="w-3 h-3" />
              </a>
              <a href="https://www.instagram.com/hashtag" className="inline-flex items-center gap-2 rounded-lg border border-slate-300/60 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm transition-transform will-change-transform hover:scale-[1.01]" rel="noopener noreferrer" target="_blank" aria-label="Instagram">
                <FiInstagram aria-hidden className="w-4 h-4" /> Instagram <FiArrowUpRight aria-hidden className="w-3 h-3" />
              </a>
              <a href="https://www.linkedin.com/company/hashtag" className="inline-flex items-center gap-2 rounded-lg border border-slate-300/60 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-gray-800 dark:text-white px-3 py-2 text-sm transition-transform will-change-transform hover:scale-[1.01]" rel="noopener noreferrer" target="_blank" aria-label="LinkedIn">
                <FiLinkedin aria-hidden className="w-4 h-4" /> LinkedIn <FiArrowUpRight aria-hidden className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 dark:border-gray-800 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-slate-600 dark:text-gray-400">
          <p>© {year} Hashtag Solutions. Building digital solutions, one click at a time.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="transition-transform will-change-transform hover:scale-[1.01] focus-visible:underline">Home</Link>
            <Link href="/blog" className="transition-transform will-change-transform hover:scale-[1.01] focus-visible:underline">Blog</Link>
            <Link href="/sitemap.xml" className="transition-transform will-change-transform hover:scale-[1.01] focus-visible:underline">Sitemap</Link>
            <Link href="/robots.txt" className="transition-transform will-change-transform hover:scale-[1.01] focus-visible:underline">Robots</Link>
            <Link href="/privacy" className="transition-transform will-change-transform hover:scale-[1.01] focus-visible:underline">Privacy Policy</Link>
            <Link href="/terms" className="transition-gpu will-change-transform-opacity hover:opacity-85 focus-visible:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}