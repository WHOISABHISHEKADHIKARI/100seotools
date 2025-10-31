import StructuredData from '../../../components/StructuredData';
import Link from 'next/link';
import { getAllToolsMeta } from '../../../tools';

export async function generateMetadata({ params }) {
  const { slug } = params;
  const tools = getAllToolsMeta();
  const categoryName = tools.find(t => t.category && t.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug)?.category || slug.replace(/-/g, ' ');
  const title = `${categoryName} SEO Tools – Free, No Login`;
  const description = `Explore free ${categoryName} SEO tools. No login, no card details required. Fast, client-side.`;
  const url = `/category/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'website'
    },
    twitter: {
      card: 'summary',
      title,
      description
    }
  };
}

function slugify(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function CategoryPage({ params }) {
  const { slug } = params;
  const tools = getAllToolsMeta();
  const categoryTools = tools.filter(t => slugify(t.category) === slug);
  const categoryName = categoryTools[0]?.category || slug.replace(/-/g, ' ');

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${categoryName} SEO Tools`,
    itemListElement: categoryTools.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `/tools/${t.slug}`,
      name: t.name
    }))
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
      { '@type': 'ListItem', position: 2, name: categoryName, item: `/category/${slug}` }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <StructuredData data={breadcrumbJsonLd} />
      <StructuredData data={itemListJsonLd} />
      <h1 className="text-3xl font-bold mb-2">{categoryName} SEO Tools</h1>
      <p className="text-muted-foreground mb-6">Free, fast, client-side — no login or card details required.</p>
      {categoryTools.length === 0 ? (
        <p>No tools found in this category.</p>
      ) : (
        <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTools.map(tool => (
            <li key={tool.slug} className="card p-4">
              <Link href={`/tools/${tool.slug}`} className="font-semibold hover:underline">
                {tool.name}
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{tool.description}</p>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Category: {tool.category}</div>
              <div className="mt-3 flex gap-3">
                <Link href={`/tools/${tool.slug}`} className="text-primary hover:underline">Open Tool</Link>
                <Link href={`/blog/${tool.slug}`} className="hover:underline">Guide</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}