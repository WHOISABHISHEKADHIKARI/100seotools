import Link from 'next/link';
import { getAllToolsMeta } from '../../../tools';

const siteName = '100 SEO Tools';
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://100tools.app';

function slugify(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

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

export async function generateMetadata({ params }) {
  const tools = getAllToolsMeta();
  const catName = categories.find((c) => slugify(c) === params.slug) || params.slug;
  const title = `${catName} Tools | ${siteName}`;
  const description = `Explore ${catName} tools to improve your SEO. Browse curated utilities, analyzers, and generators tailored to ${catName}.`;
  const url = `${baseUrl}/category/${params.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: 'website'
    },
    twitter: {
      card: 'summary',
      title,
      description
    }
  };
}

export default function CategoryPage({ params }) {
  const tools = getAllToolsMeta();
  const catName = categories.find((c) => slugify(c) === params.slug) || params.slug;
  const items = tools.filter((t) => t.category && slugify(t.category) === params.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${catName} Tools`,
    url: `${baseUrl}/category/${params.slug}`,
    mainEntity: items.map((t) => ({
      '@type': 'SoftwareApplication',
      name: t.name,
      url: `${baseUrl}/tools/${t.slug}`,
      applicationCategory: 'SEO Tool'
    })),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: 'Categories', item: `${baseUrl}/` },
        { '@type': 'ListItem', position: 3, name: catName, item: `${baseUrl}/category/${params.slug}` }
      ]
    }
  };

  return (
    <main id="main" className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">{catName} Tools</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        Browse curated tools related to {catName}. Click a tool to open its page and run it in your browser.
      </p>
      {items.length === 0 ? (
        <div className="rounded-lg border border-slate-200 dark:border-white/10 p-6">
          <p className="mb-2">No tools found for this category.</p>
          <Link href="/" className="text-brand-600 hover:underline">Go back to all tools</Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((t) => (
            <li key={t.slug} className="rounded-lg border border-slate-200 dark:border-white/10 p-4 relative">
              {/* Full-card click target: open the tool */}
              <a href={`/tools/${t.slug}`} aria-label={`Open tool: ${t.name}`} className="absolute inset-0 z-10" />
              <h2 className="font-semibold text-lg mb-2 relative z-20">
                <Link href={`/tools/${t.slug}`} className="hover:text-brand-600">{t.name}</Link>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 relative z-20">{t.description}</p>
              <div className="flex items-center gap-3 relative z-20">
                <Link href={`/tools/${t.slug}`} className="text-sm text-brand-600 hover:underline">Open Tool</Link>
                <Link href={`/blog/${t.slug}`} className="text-sm text-slate-500 hover:underline">Read Guide</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}