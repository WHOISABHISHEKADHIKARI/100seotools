import Link from 'next/link';
import { getToolBySlug } from '../../../tools';
import { getToolGuide } from '../../../lib/guides';
import { getBlogPostBySlug } from '../../../lib/blog';

const siteName = '100 SEO Tools';
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://100tools.app';

export async function generateMetadata({ params }) {
  const post = getBlogPostBySlug(params.slug);
  if (post) {
    const title = `${post.title} | ${siteName}`;
    const description = post.description;
    const url = `${baseUrl}/blog/${post.slug}`;
    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: { title, description, url, siteName, type: 'article' },
      twitter: { card: 'summary', title, description }
    };
  }
  const tool = getToolBySlug(params.slug);
  if (tool) {
    const title = `How to Use ${tool.name} – Guide | ${siteName}`;
    const description = `Step-by-step guide to using the ${tool.name} for ${tool.category}. Learn purpose, usage, outputs, and benefits.`;
    const url = `${baseUrl}/blog/${tool.slug}`;
    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: { title, description, url, siteName, type: 'article' },
      twitter: { card: 'summary', title, description }
    };
  }
  return { title: `Guide Not Found | ${siteName}`, robots: { index: false, follow: false } };
}

export default function BlogGuidePage({ params }) {
  const post = getBlogPostBySlug(params.slug);
  if (post) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      about: post.category,
      isPartOf: {
        '@type': 'Blog',
        name: `${siteName} Blog`,
        url: `${baseUrl}/blog`
      },
      mainEntityOfPage: `${baseUrl}/blog/${post.slug}`,
      author: { '@type': 'Organization', name: post.author },
      publisher: { '@type': 'Organization', name: siteName },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: `${baseUrl}/blog/${post.slug}` }
        ]
      }
    };

    return (
      <main id="main" className="container mx-auto px-4 py-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <h1 className="text-2xl sm:text-3xl font-bold mb-3">{post.title}</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-6">Category: {post.category}</p>

        <div className="prose dark:prose-invert max-w-none">
          <h2>Overview</h2>
          <p>{post.description}</p>

          <h2>Steps</h2>
          <ul>
            {post.sections.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ul>

          <h2>Tips</h2>
          <ul>
            {post.sections.tips.map((t, i) => <li key={i}>{t}</li>)}
          </ul>

          <h2>Checklist</h2>
          <ul>
            {post.sections.checklist.map((c, i) => <li key={i}>{c}</li>)}
          </ul>

          <h2>FAQ</h2>
          <ul>
            {post.sections.faq.map((qa, i) => <li key={i}><strong>{qa.q}</strong> — {qa.a}</li>)}
          </ul>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <Link href="/blog" className="text-brand-600 hover:underline">Back to Blog</Link>
        </div>
      </main>
    );
  }
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    return (
      <main id="main" className="container mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Guide Not Found</h1>
        <p className="mb-4">We couldn’t find a guide for this tool.</p>
        <Link href="/blog" className="text-brand-600 hover:underline">Back to Blog</Link>
      </main>
    );
  }

  const guide = getToolGuide(tool);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `How to Use ${tool.name}`,
    about: tool.category,
    isPartOf: {
      '@type': 'Blog',
      name: `${siteName} Guides`,
      url: `${baseUrl}/blog`
    },
    mainEntityOfPage: `${baseUrl}/blog/${tool.slug}`,
    author: { '@type': 'Organization', name: siteName },
    publisher: { '@type': 'Organization', name: siteName },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
        { '@type': 'ListItem', position: 3, name: tool.name, item: `${baseUrl}/blog/${tool.slug}` }
      ]
    }
  };

  return (
    <main id="main" className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-2xl sm:text-3xl font-bold mb-3">How to Use {tool.name}</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-6">Category: {tool.category}</p>

      <div className="prose dark:prose-invert max-w-none">
        <h2>Purpose</h2>
        <p>{guide.purpose}</p>

        <h2>How to Use</h2>
        <pre className="bg-slate-100 dark:bg-gray-800 p-4 rounded text-sm overflow-auto whitespace-pre-wrap">{guide.howToUse}</pre>

        <h2>Output Explanation</h2>
        <p>{guide.outputExplanation}</p>

        {guide.benefits?.length ? (
          <>
            <h2>Benefits</h2>
            <ul>
              {guide.benefits.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </>
        ) : null}

        {guide.useCases?.length ? (
          <>
            <h2>Use Cases</h2>
            <ul>
              {guide.useCases.map((u, i) => <li key={i}>{u}</li>)}
            </ul>
          </>
        ) : null}

        {guide.referenceCards?.length ? (
          <>
            <h2>Reference</h2>
            {guide.referenceCards.map((card, i) => (
              <div key={i} className="rounded border border-slate-200 dark:border-white/10 p-4 mb-4">
                <h3 className="font-semibold mb-2">{card.title}</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  {card.items.map((it, j) => (
                    <li key={j} className="flex items-center justify-between">
                      <span className="font-mono">{it.code}</span>
                      <span className="mx-2">{it.label}</span>
                      <span className="text-slate-600 dark:text-slate-300">{it.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        ) : null}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <Link href={`/tools/${tool.slug}`} className="text-brand-600 hover:underline">Open {tool.name}</Link>
        <Link href={`/category/${tool.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`} className="text-slate-500 hover:underline">More in {tool.category}</Link>
      </div>
    </main>
  );
}