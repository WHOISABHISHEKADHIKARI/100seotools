import StructuredData from '../../../components/StructuredData';
import { getAllBlogPostsPublished, getBlogPostPublishedBySlug } from '../../../lib/blog-data';
import { getBaseUrl, siteName } from '../../../lib/site';
import { notFound, redirect } from 'next/navigation';

const baseUrl = getBaseUrl();

// Enable dynamic rendering for blog posts to prevent 404s
// The blog system generates 600+ posts dynamically, so we use ISR
export const dynamic = 'auto';
export const dynamicParams = true;
export const revalidate = 3600; // Cache for 1 hour

// Pre-generate high-priority posts at build time
export async function generateStaticParams() {
  // Only pre-build the most important posts to keep build times reasonable
  const priorityPosts = [
    '100-free-seo-tools-ultimate-list',
    'seo-basics',
    'seo-basics-0',
    'keyword-clustering-tool',
    'keyword-suggestion-tool',
    'keyword-density-checker-guide'
  ];

  return priorityPosts.map(slug => ({ slug }));
}

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const page = Number((await searchParams)?.page || 1);
  const post = await getBlogPostPublishedBySlug(slug);
  if (!post) {
    notFound();
  }

  const title = `${post.title}`;
  const description = post.description;
  const canonical = `${baseUrl}/blog/${post.slug}`;
  const url = page > 1 ? `${canonical}?page=${page}` : canonical;

  return {
    title,
    description,
    alternates: { canonical },
    robots: page > 1 ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    }
  };
}

export default async function BlogGuidePage({ params, searchParams }) {
  const { slug } = await params;
  const page = Number((await searchParams)?.page || 1);
  const post = await getBlogPostPublishedBySlug(slug);
  if (!post) {
    notFound();
  }

  const anchorUrl = `${baseUrl}/blog#${post.slug}`;

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    author: { '@type': 'Organization', name: siteName },
    publisher: { '@type': 'Organization', name: siteName },
    url: `${baseUrl}/blog/${post.slug}`,
    mainEntityOfPage: `${baseUrl}/blog/${post.slug}`,
    inLanguage: 'en-US',
    keywords: Array.isArray(post.tags) ? post.tags.join(', ') : undefined,
  };

  const faqLd = Array.isArray(post.sections?.faq) && post.sections.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: `${baseUrl}/blog/${post.slug}`,
    isPartOf: `${baseUrl}/blog/${post.slug}`,
    mainEntity: post.sections.faq.map((f) => ({ '@type': 'Question', name: f.q || f.question, acceptedAnswer: { '@type': 'Answer', text: f.a || f.answer } }))
  } : null;

  const howToLd = Array.isArray(post.sections?.howDetailed) && post.sections.howDetailed.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    url: `${baseUrl}/blog/${post.slug}`,
    isPartOf: `${baseUrl}/blog/${post.slug}`,
    name: post.title,
    description: post.description,
    step: post.sections.howDetailed.map((s) => ({ '@type': 'HowToStep', text: s }))
  } : null;

  return (
    <article className="max-w-3xl mx-auto py-10 space-y-8">
      <StructuredData data={articleLd} />
      {faqLd && <StructuredData data={faqLd} />}
      {howToLd && <StructuredData data={howToLd} />}

      <header className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{post.title}</h1>
        <p className="text-gray-700 dark:text-gray-300">{post.description}</p>
        <div className="text-xs text-slate-500 dark:text-slate-400">{new Date(post.datePublished).toLocaleDateString()} · {post.readTimeMinutes || 6} min read</div>
      </header>

      <div className="rounded-md bg-slate-50 dark:bg-white/5 p-4 border border-slate-200 dark:border-white/10">
        <p>
          This guide is also available in the merged Blog page. View in context:
          {' '}<a className="text-brand-600 hover:underline" href={anchorUrl}>/blog#{post.slug}</a>
        </p>
      </div>

      <section className="space-y-4">
        {post.sections?.intro && (<p className="text-gray-700 dark:text-gray-300">{post.sections.intro}</p>)}
        {post.sections?.what && (<div><h2 className="text-lg font-semibold">What</h2><p className="text-gray-700 dark:text-gray-300">{post.sections.what}</p></div>)}
        {post.sections?.why && (<div><h2 className="text-lg font-semibold">Why</h2><p className="text-gray-700 dark:text-gray-300">{post.sections.why}</p></div>)}

        {Array.isArray(post.sections?.how) && post.sections.how.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">How</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              {post.sections.how.map((h, i) => (
                <li key={i}><a href={h.slug ? `/tools/${h.slug}` : '#'} className="text-brand-600 hover:underline">{h.label || h.text}</a></li>
              ))}
            </ul>
          </div>
        )}

        {Array.isArray(post.sections?.howDetailed) && post.sections.howDetailed.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">Steps</h2>
            <ol className="list-decimal pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              {post.sections.howDetailed.map((s, i) => (<li key={i}>{s}</li>))}
            </ol>
          </div>
        )}

        {Array.isArray(post.sections?.tips) && post.sections.tips.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">Tips</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              {post.sections.tips.map((t, i) => (<li key={i}>{t}</li>))}
            </ul>
          </div>
        )}

        {Array.isArray(post.sections?.faq) && post.sections.faq.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">FAQ</h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              {post.sections.faq.map((f, i) => (
                <li key={i}><span className="font-medium">Q:</span> {f.q || f.question} <br /><span className="font-medium">A:</span> {f.a || f.answer}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </article>
  );
}

