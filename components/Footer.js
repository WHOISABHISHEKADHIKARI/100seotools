import Link from 'next/link';
import { FiFacebook, FiInstagram, FiLinkedin, FiMail, FiPhone, FiArrowUpRight } from 'react-icons/fi';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-gray-900 text-white py-10" aria-labelledby="footerHeading">
      <h2 id="footerHeading" className="sr-only">Site footer</h2>
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div>
            <h3 className="text-2xl font-bold">Hashtag Solutions</h3>
            <p className="mt-2 text-gray-400">Empowering businesses and individuals with web solutions, SEO tools, and digital growth strategies.</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <a href="mailto:hashtagsolutionsocail@gmail.com" className="inline-flex items-center gap-2 rounded bg-gray-800 hover:bg-gray-700 px-3 py-2 text-sm transition" aria-label="Email Hashtag Solutions">
              <FiMail aria-hidden className="w-4 h-4" /> Email us
            </a>
            <a href="tel:+9779823405140" className="inline-flex items-center gap-2 rounded bg-gray-800 hover:bg-gray-700 px-3 py-2 text-sm transition" aria-label="Call Hashtag Solutions">
              <FiPhone aria-hidden className="w-4 h-4" /> +977-9823405140
            </a>
            <a href="https://hashtagweb.com.np/" className="inline-flex items-center gap-2 rounded bg-gray-800 hover:bg-gray-700 px-3 py-2 text-sm transition" rel="noopener noreferrer" target="_blank" aria-label="Visit Hashtag Solutions website">
              <FiArrowUpRight aria-hidden className="w-4 h-4" /> Website
            </a>
          </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-gray-300">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/services" className="hover:text-white transition">Services</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </nav>

          {/* Useful */}
          <nav aria-label="Useful links">
            <h3 className="font-semibold">Useful</h3>
            <ul className="mt-3 space-y-2 text-gray-300">
              <li><Link href="/sitemap.xml" className="hover:text-white transition">Sitemap</Link></li>
              <li><Link href="/robots.txt" className="hover:text-white transition">Robots.txt</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link href="/" className="hover:text-white transition">All Tools</Link></li>
            </ul>
          </nav>

          {/* Social & Contact */}
          <div>
            <h3 className="font-semibold">Follow</h3>
            <div className="mt-3 flex items-center gap-3">
              <a href="https://www.facebook.com/hashtag" className="inline-flex items-center gap-2 rounded bg-gray-800 hover:bg-gray-700 px-3 py-2 text-sm transition" rel="noopener noreferrer" target="_blank" aria-label="Facebook">
                <FiFacebook aria-hidden className="w-4 h-4" /> Facebook <FiArrowUpRight aria-hidden className="w-3 h-3" />
              </a>
              <a href="https://www.instagram.com/hashtag" className="inline-flex items-center gap-2 rounded bg-gray-800 hover:bg-gray-700 px-3 py-2 text-sm transition" rel="noopener noreferrer" target="_blank" aria-label="Instagram">
                <FiInstagram aria-hidden className="w-4 h-4" /> Instagram <FiArrowUpRight aria-hidden className="w-3 h-3" />
              </a>
              <a href="https://www.linkedin.com/company/hashtag" className="inline-flex items-center gap-2 rounded bg-gray-800 hover:bg-gray-700 px-3 py-2 text-sm transition" rel="noopener noreferrer" target="_blank" aria-label="LinkedIn">
                <FiLinkedin aria-hidden className="w-4 h-4" /> LinkedIn <FiArrowUpRight aria-hidden className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-gray-400">
          <p>© {year} Hashtag Solutions. Building digital solutions, one click at a time.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link>
            <Link href="/robots.txt" className="hover:text-white">Robots</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}