"use client";
import Card from './Card';

const pages = [
  {
    href: '/about',
    title: 'About 100 SEO Tools',
    description: 'Learn our mission: build 100+ free, fast, client‑side SEO tools with no login and no subscriptions.'
  },
  {
    href: '/faq',
    title: 'SEO Tools FAQ',
    description: 'Answers to common questions about our Free SEO Tools, privacy, speed, and usage.'
  },
  {
    href: '/blog',
    title: 'Latest SEO Guides',
    description: 'Actionable tutorials and updates to help you rank faster and fix issues.'
  },
  {
    href: '/category',
    title: 'Browse Tool Categories',
    description: 'Explore curated categories: metadata, schema, headings, links, crawling, and more.'
  },
  {
    href: '/seo-calculator',
    title: 'SEO Calculator',
    description: 'Estimate impact with quick scenarios. 100% client‑side and fast.'
  },
  {
    href: '/privacy',
    title: 'Privacy Policy',
    description: 'We do not store your inputs. Tools run in your browser.'
  },
  {
    href: '/terms',
    title: 'Terms of Service',
    description: 'Simple terms that favor usability and educational purposes.'
  },
  {
    href: '/ui-guidelines',
    title: 'UI Guidelines',
    description: 'Design system and accessibility guidelines behind our tool interfaces.'
  },
  {
    href: '/alternative',
    title: 'Best Alternatives',
    description: 'See comparable Small SEO Tools alternatives and how we differ.'
  },
  {
    href: '/offline',
    title: 'Offline Mode',
    description: 'Service worker support to keep core tools usable offline.'
  },
];

export default function PageLinksGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {pages.map((p) => (
        <Card key={p.href} href={p.href} title={p.title} description={p.description} />
      ))}
    </div>
  );
}

