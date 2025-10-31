import StructuredData from '../../../components/StructuredData';
import Link from 'next/link';
import { getToolBySlug, getAllToolsMeta } from '../../../tools';

export async function generateMetadata({ params }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    return { title: 'Guide not found', description: 'No guide available for this tool.' };
  }
  const title = `How to use ${tool.name} – ${tool.category} guide`;
  const description = `${tool.description} Learn practical use cases, steps, tips, and related tools.`;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${tool.slug}` },
    openGraph: { title, description, url: `/blog/${tool.slug}`, type: 'article' },
    twitter: { card: 'summary', title, description }
  };
}

function relatedKeywords(name, category) {
  const base = [category, 'SEO', 'guide', 'how to', 'tips'];
  const words = name.split(/\s+/).filter(Boolean).map(w => w.toLowerCase());
  return Array.from(new Set([...base, ...words])).slice(0, 12);
}

export default function ToolGuidePage({ params }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    return (
      <article className="max-w-3xl mx-auto py-12">
        <h1 className="text-2xl font-semibold">Guide not found</h1>
        <p className="text-gray-600 dark:text-gray-400">No guide is available for this tool.</p>
      </article>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const keywords = relatedKeywords(tool.name, tool.category);
  const allTools = getAllToolsMeta();
  const relatedTools = allTools
    .filter(t => t.category === tool.category && t.slug !== tool.slug)
    .slice(0, 6);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: tool.name, item: `${baseUrl}/blog/${tool.slug}` }
    ]
  };

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `How to use ${tool.name}`,
    description: `${tool.description}`,
    keywords: keywords.join(', '),
    author: { '@type': 'Organization', name: '100 SEO Tools' },
    publisher: { '@type': 'Organization', name: '100 SEO Tools' },
    mainEntityOfPage: `${baseUrl}/blog/${tool.slug}`,
    url: `${baseUrl}/blog/${tool.slug}`
  };

  return (
    <article className="max-w-3xl mx-auto py-10 space-y-8">
      <StructuredData data={breadcrumbLd} />
      <StructuredData data={articleLd} />

      <header className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold">How to use {tool.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {tool.description} This guide covers what it does, when to use it, and
          practical steps to get reliable results.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">{tool.category}</span>
          <Link href={`/tools/${tool.slug}`} className="text-sm text-brand-600 hover:underline">Open the tool</Link>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">What it does</h2>
        <p className="text-gray-700 dark:text-gray-300">
          {tool.name} is part of our {tool.category} toolkit. It helps with {tool.description.toLowerCase()}.
          Use it to speed up workflows, reduce manual effort, and improve consistency.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">When to use it</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>You need a quick, browser-based helper for {tool.category.toLowerCase()} tasks.</li>
          <li>You want repeatable outputs without complex setup or logins.</li>
          <li>You’re validating ideas, content, or checks before deeper analysis.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">How to use</h2>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            Open the tool: <Link href={`/tools/${tool.slug}`} className="text-brand-600 hover:underline">{tool.name}</Link>.
          </li>
          <li>Enter your inputs and adjust options as needed.</li>
          <li>Review outputs and copy what’s useful to your workflow.</li>
          <li>Iterate: rerun with different inputs to refine results.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">Tips</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Start with clear, concise inputs to improve output quality.</li>
          <li>Use consistent formatting for easier comparison across runs.</li>
          <li>Combine this tool with others in {tool.category.toLowerCase()} for better coverage.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">Related keywords</h2>
        <div className="flex flex-wrap gap-2">
          {keywords.map(k => (
            <span key={k} className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">{k}</span>
          ))}
        </div>
      </section>

      {relatedTools.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold">Related tools in {tool.category}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {relatedTools.map(rt => (
              <div key={rt.slug} className="card p-4">
                <h3 className="font-medium">{rt.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{rt.description}</p>
                <div className="mt-2 flex items-center gap-4">
                  <Link href={`/tools/${rt.slug}`} className="text-brand-600 hover:underline text-sm">Try tool</Link>
                  <Link href={`/blog/${rt.slug}`} className="text-brand-600 hover:underline text-sm">Read guide</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Prefer a quick start? <Link href={`/tools/${tool.slug}`} className="text-brand-600 hover:underline">Open {tool.name}</Link> now.
        </p>
      </footer>
    </article>
  );
}