import Link from 'next/link';
import { FiCompass, FiGithub, FiMail, FiRss, FiTwitter, FiYoutube } from 'react-icons/fi';
import { categoryDetails, getCategoryHref } from '../tools/SeoVisuals';

const topTools = [
  ['Keyword Density Checker', '/tools/keyword-density-checker'],
  ['Meta Tag Generator', '/tools/meta-tag-generator'],
  ['XML Sitemap Visualizer', '/tools/xml-sitemap-visualizer'],
  ['Backlink Idea Generator', '/tools/backlink-idea-generator'],
  ['On-Page SEO Audit', '/tools/on-page-seo-audit-checker'],
  ['Schema Markup Generator', '/tools/schema-markup-generator'],
];

const resources = [
  ['SEO Blog', '/blog'],
  ['SEO Basics', '/blog/seo-basics'],
  ['All Tools', '/#tools'],
  ['Categories', '/category'],
  ['FAQ', '/faq'],
];

const company = [
  ['About', '/about'],
  ['Contact', '/contact'],
  ['Privacy', '/privacy'],
  ['Terms', '/terms'],
  ['Sitemap', '/sitemap.xml'],
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative left-1/2 mt-16 w-screen -translate-x-1/2 bg-[#0b0d1a] text-white" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2" aria-label="Go to homepage">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 text-white shadow-lg">
                <FiCompass className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-lg font-extrabold">
                100SEO<span className="text-violet-300">Tools</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-6 text-slate-400">
              A complete collection of free SEO tools for keyword research, technical audits, content optimization,
              local SEO, schema, links, and performance forecasting.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[
                ['Twitter', FiTwitter, '#'],
                ['GitHub', FiGithub, 'https://github.com/WHOISABHISHEKADHIKARI'],
                ['YouTube', FiYoutube, '#'],
                ['RSS', FiRss, '/blog'],
                ['Email', FiMail, 'mailto:hashtagsolutionsocail@gmail.com'],
              ].map(([label, Icon, href]) => (
                <a
                  key={label}
                  href={href}
                  className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 text-slate-400 transition hover:bg-violet-600 hover:text-white"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Top Tools" items={topTools} />
          <FooterColumn title="Categories" items={categoryDetails.slice(0, 7).map((item) => [item.label, getCategoryHref(item.label)])} />
          <div className="grid gap-8 sm:grid-cols-2 md:col-span-1 md:block">
            <FooterColumn title="Resources" items={resources} />
            <div className="mt-8">
              <FooterColumn title="Company" items={company} />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {year} 100 SEO Tools. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
            All tools operational
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="transition hover:text-violet-300">Privacy</Link>
            <Link href="/terms" className="transition hover:text-violet-300">Terms</Link>
            <Link href="/contact" className="transition hover:text-violet-300">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }) {
  return (
    <nav aria-label={title}>
      <h2 className="mb-4 text-sm font-bold text-slate-200">{title}</h2>
      <ul className="space-y-2.5">
        {items.map(([label, href]) => (
          <li key={`${title}-${label}`}>
            <Link href={href} prefetch={false} className="text-sm leading-5 text-slate-500 transition hover:text-violet-300">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
