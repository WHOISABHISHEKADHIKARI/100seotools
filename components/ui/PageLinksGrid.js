import { memo } from 'react';
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
    href: '/privacy',
    title: 'Privacy Policy',
    description: 'We do not store your inputs. Tools run in your browser.'
  },
  {
    href: '/terms',
    title: 'Terms of Service',
    description: 'Simple terms that favor usability and educational purposes.'
  },
];

const PageLinksGrid = memo(function PageLinksGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {pages.map((p) => (
        <Card key={p.href} href={p.href} title={p.title} description={p.description} />
      ))}
    </div>
  );
});

export default PageLinksGrid;
