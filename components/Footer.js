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
    <footer role="contentinfo" className="bg-white text-slate-800 dark:bg-gray-900 dark:text-white py-10 md:py-14 xl:py-16 mt-10 md:mt-14 xl:mt-16" aria-labelledby="footerHeading">
      <h2 id="footerHeading" className="sr-only">Site footer</h2>
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 xl:gap-12 items-start">
          {/* Brand Info */}
          <div>
            <h3 className="text-xl md:text-2xl xl:text-3xl font-bold">Hashtag Solutions</h3>
            <p className="mt-3 text-slate-600 dark:text-gray-400 break-words">Empowering businesses and individuals with web solutions, SEO tools, and digital growth strategies.</p>
            <div className="mt-6 flex flex-wrap items-center gap-2 md:gap-3 xl:gap-4">
              <a href="mailto:hashtagsolutionsocail@gmail.com" className="inline-flex items-center gap-2 rounded-lg border border-slate-300/60 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-gray-800 dark:text-white px-2.5 md:px-3 xl:px-3.5 py-1.5 md:py-2 xl:py-2.5 text-xs md:text-sm xl:text-base transition-transform will-change-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900" aria-label="Email Hashtag Solutions">
                <FiMail aria-hidden className="w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6" /> Email us
              </a>
              <a href="tel:+9779823405140" className="inline-flex items-center gap-2 rounded-lg border border-slate-300/60 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-gray-800 dark:text-white px-2.5 md:px-3 xl:px-3.5 py-1.5 md:py-2 xl:py-2.5 text-xs md:text-sm xl:text-base transition-transform will-change-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900" aria-label="Call Hashtag Solutions">
                <FiPhone aria-hidden className="w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6" /> +977-9823405140
              </a>
              <a href="https://github.com/hashtagsolutions" className="inline-flex items-center gap-2 rounded-lg border border-slate-300/60 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-gray-800 dark:text-white px-2.5 md:px-3 xl:px-3.5 py-1.5 md:py-2 xl:py-2.5 text-xs md:text-sm xl:text-base transition-transform will-change-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900" rel="noopener noreferrer" target="_blank" aria-label="Visit Hashtag Solutions GitHub">
                <FiGithub className="h-4 w-4 md:w-5 md:h-5 xl:w-6 xl:h-6" />
                GitHub
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h3 className="text-base md:text-lg xl:text-xl font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2 md:space-y-2.5 xl:space-y-3 text-slate-600 dark:text-gray-300">
              <li><Link href="/" className="transition-transform will-change-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900">Home</Link></li>
              <li><Link href="/about" prefetch={false} className="transition-transform will-change-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900">About Us</Link></li>
              <li><Link href="/blog" prefetch={false} className="transition-transform will-change-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900">Blog</Link></li>
              <li><Link href="/contact" prefetch={false} className="transition-transform will-change-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900">Contact</Link></li>
              <li><Link href="/faq" prefetch={false} className="transition-transform will-change-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900">FAQ</Link></li>
            </ul>
          </nav>

          {/* Categories */}
          <nav aria-label="Tool categories">
            <h3 className="text-base md:text-lg xl:text-xl font-semibold">Categories</h3>
            <ul className="mt-4 space-y-2 md:space-y-2.5 xl:space-y-3 text-slate-600 dark:text-gray-300 break-words">
              {categories.map((c) => (
                <li key={c}>
                  <Link href={`/category/${toSlug(c)}`} prefetch={false} className="transition-transform will-change-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social & Contact */}
          <div>
            <h3 className="text-base md:text-lg xl:text-xl font-semibold">Follow</h3>
            <div className="mt-4 flex flex-wrap items-center gap-2 md:gap-3 xl:gap-4">
              <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.100seotools.com%2F" className="inline-flex items-center gap-2 rounded-lg border border-slate-300/60 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-gray-800 dark:text-white px-2.5 md:px-3 xl:px-3.5 py-1.5 md:py-2 xl:py-2.5 text-xs md:text-sm xl:text-base transition-transform will-change-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900" rel="noopener noreferrer" target="_blank" aria-label="Facebook" data-external="true">
                <FiFacebook aria-hidden className="w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6" /> Facebook <FiArrowUpRight aria-hidden className="w-3 h-3 md:w-4 md:h-4 xl:w-5 xl:h-5" />
              </a>
              <a href="https://www.instagram.com/hashtag" className="inline-flex items-center gap-2 rounded-lg border border-slate-300/60 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-gray-800 dark:text-white px-2.5 md:px-3 xl:px-3.5 py-1.5 md:py-2 xl:py-2.5 text-xs md:text-sm xl:text-base transition-transform will-change-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900" rel="noopener noreferrer" target="_blank" aria-label="Instagram">
                <FiInstagram aria-hidden className="w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6" /> Instagram <FiArrowUpRight aria-hidden className="w-3 h-3 md:w-4 md:h-4 xl:w-5 xl:h-5" />
              </a>
              <a href="https://www.linkedin.com/company/hashtag" className="inline-flex items-center gap-2 rounded-lg border border-slate-300/60 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-gray-800 dark:text-white px-2.5 md:px-3 xl:px-3.5 py-1.5 md:py-2 xl:py-2.5 text-xs md:text-sm xl:text-base transition-transform will-change-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900" rel="noopener noreferrer" target="_blank" aria-label="LinkedIn">
                <FiLinkedin aria-hidden className="w-4 h-4 md:w-5 md:h-5 xl:w-6 xl:h-6" /> LinkedIn <FiArrowUpRight aria-hidden className="w-3 h-3 md:w-4 md:h-4 xl:w-5 xl:h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 dark:border-gray-800 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs md:text-sm xl:text-base text-slate-600 dark:text-gray-400">
          <p className="break-words">© {year} <a href="https://hashtagweb.com.np/projects/" target="_blank" rel="noopener noreferrer" className="hover:underline">Hashtag Solutions</a>. Building digital solutions, one click at a time.</p>
          <div className="flex items-center flex-wrap gap-3 md:gap-4 min-w-0">
            <Link href="/" prefetch={false} className="transition-transform will-change-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900">Home</Link>
            <Link href="/blog" prefetch={false} className="transition-transform will-change-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900">Blog</Link>
            <Link href="/contact" prefetch={false} className="transition-transform will-change-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900">Contact</Link>
            <Link href="/robots.txt" prefetch={false} className="transition-transform will-change-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900">Robots</Link>
            <Link href="/privacy" prefetch={false} className="transition-transform will-change-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900">Privacy Policy</Link>
            <Link href="/terms" prefetch={false} className="transition-gpu will-change-transform-opacity hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
