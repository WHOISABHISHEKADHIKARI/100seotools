import Link from 'next/link';
import StructuredData from '../../../components/ui/StructuredData';
import ShareActions from '../../../components/ui/ShareActions';
import NewsletterForm from '../../../components/ui/NewsletterForm';
import { getBaseUrl, siteName } from '../../../lib/site';

export const dynamic = 'force-static';

const baseUrl = getBaseUrl();

export const metadata = {
  title: 'Latest SEO Guides & Tutorials to Master Search Optimization',
  description: 'Explore curated, up-to-date SEO guides and tutorials with AI-assisted analysis, proven strategies, and essential tools — optimized for clean structure and fast performance.',
  alternates: { canonical: `${baseUrl}/blog/latest-seo-guides` },
  openGraph: {
    title: 'Latest SEO Guides & Tutorials to Master Search Optimization',
    description: 'Curated SEO guides and tutorials with AI tools, strategies, and resources.',
    type: 'website',
    url: `${baseUrl}/blog/latest-seo-guides`
  },
  twitter: {
    card: 'summary',
    title: 'Latest SEO Guides & Tutorials to Master Search Optimization',
    description: 'Explore curated SEO guides, AI tools, and proven strategies.'
  }
};

export default function LatestSEOGuidesPage() {
  const baseUrl = getBaseUrl();

  // Featured articles metadata
  const features = [
    {
      title: 'AI Content Detection: Complete 2024 Guide to Identifying Machine-Generated Text',
      description: 'Learn proven methods to detect AI-generated content using the latest tools and techniques to ensure content authenticity in 2024.',
      url: '/blog/ai-content-detection-guide-2024',
      published: '2024-01-15',
      tags: ['AI Detection', 'Content Quality', 'SEO Tools'],
      readTime: 9,
      image: '/blog-images/ai-content-detection-guide-2024.png',
      alt: 'AI content detection tutorial hero image'
    },
    {
      title: 'Reverse Image Search: Expert Guide to Finding Original Image Sources',
      description: 'Master reverse image search techniques with our ultimate guide to verifying image authenticity and protecting your content.',
      url: '/blog/reverse-image-search-guide',
      published: '2024-01-14',
      tags: ['Image Search', 'Content Verification', 'SEO Tools'],
      readTime: 8,
      image: '/blog-images/reverse-image-search-guide.png',
      alt: 'Reverse image search tutorial hero image'
    },
    {
      title: 'SEO Basics 2026: Complete Beginner\'s Guide to Search Engine Optimization',
      description: 'Master SEO fundamentals with our comprehensive 2026 guide. Learn on-page optimization, technical SEO, link building, keyword research, and content strategy.',
      url: '/blog/seo-basics',
      published: '2024-01-13',
      tags: ['SEO Basics', 'Free Resources', 'Digital Marketing'],
      readTime: 20,
      image: '/blog-images/seo-basics-guide.png',
      alt: 'SEO Basics guide hero image'
    }
  ];

  // Breadcrumb JSON-LD
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: 'Latest SEO Guides', item: `${baseUrl}/blog/latest-seo-guides` }
    ]
  };

  // FAQ JSON-LD
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are the most important SEO strategies in 2024?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Focus on high-quality, intent-matched content, robust schema markup, strong internal linking, and performance optimization. Complement this with E-E-A-T signals like author expertise, sourcing, and helpful examples.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do AI tools replace manual SEO work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AI assists research and drafting but should be guided by human oversight. Use AI for outlines and analysis, then refine with expert judgment to ensure accuracy and originality.'
        }
      },
      {
        '@type': 'Question',
        name: 'How can I improve indexing depth?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use clean information architecture, contextual internal links, comprehensive FAQs, and validated structured data. Keep pages fast and mobile-friendly to reduce crawl waste.'
        }
      }
    ]
  };

  // Article JSON-LD for each feature
  const articleLds = features.map(f => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: f.title,
    description: f.description,
    datePublished: f.published,
    author: { '@type': 'Organization', name: siteName },
    publisher: { '@type': 'Organization', name: siteName },
    mainEntityOfPage: `${baseUrl}${f.url}`,
    url: `${baseUrl}${f.url}`,
    image: `${baseUrl}${f.image}`,
    keywords: f.tags.join(', ')
  }));

  return (
    <main id="main" className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
          <li><Link href="/" prefetch={false} className="hover:text-brand-600">Home</Link></li>
          <li aria-hidden className="mx-1">›</li>
          <li><Link href="/blog" prefetch={false} className="hover:text-brand-600">Blog</Link></li>
          <li aria-hidden className="mx-1">›</li>
          <li className="font-medium text-slate-900 dark:text-white">Latest SEO Guides</li>
        </ol>
      </nav>

      {/* H1 */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Latest SEO Guides & Tutorials to Master Search Optimization</h1>

      {/* Social sharing for the page */}
      <div className="mb-6"><ShareActions url={`${baseUrl}/blog/latest-seo-guides`} title="Latest SEO Guides & Tutorials" /></div>

      {/* H2: Featured AI Tools for Content Analysis */}
      <section aria-labelledby="featured-ai-tools" className="space-y-4">
        <h2 id="featured-ai-tools" className="text-xl font-semibold">Featured AI Tools for Content Analysis</h2>
        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.slice(0, 1).map((f, i) => (
            <article key={i} className="card p-4 space-y-3">
              <img src={f.image} alt={f.alt} className="w-full h-40 object-cover rounded" loading="lazy" />
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-300">{f.description}</p>
              <div className="text-sm text-slate-500 dark:text-slate-400">Published: {new Date(f.published).toLocaleDateString()} • {f.readTime} min read</div>
              <div className="flex flex-wrap gap-2 text-xs">
                {f.tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-1 rounded bg-slate-100 dark:bg-white/10">{t}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <Link href={f.url} prefetch={false} className="btn" aria-label={`Read: ${f.title}`}>Read Guide</Link>
                <ShareActions url={`${baseUrl}${f.url}`} title={f.title} />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* H2: Essential SEO Tools for Digital Marketers */}
      <section aria-labelledby="essential-seo-tools" className="space-y-4 mt-8">
        <h2 id="essential-seo-tools" className="text-xl font-semibold">Essential SEO Tools for Digital Marketers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Link to safe, existing tool pages */}
          <Link href="/tools/meta-tag-generator" prefetch={false} className="card p-4">
            <h3 className="text-lg font-semibold">Meta Tag Generator</h3>
            <p className="text-slate-600 dark:text-slate-300">Create optimized titles and descriptions quickly.</p>
          </Link>
          <Link href="/tools/keyword-density-checker" prefetch={false} className="card p-4">
            <h3 className="text-lg font-semibold">Keyword Density Checker</h3>
            <p className="text-slate-600 dark:text-slate-300">Analyze keyword distribution and avoid stuffing.</p>
          </Link>
          <Link href="/tools/heading-analyzer" prefetch={false} className="card p-4">
            <h3 className="text-lg font-semibold">Heading Analyzer</h3>
            <p className="text-slate-600 dark:text-slate-300">Review structure for clarity and indexing.</p>
          </Link>
        </div>
      </section>

      {/* H2: Proven SEO Strategies for 2024 */}
      <section aria-labelledby="proven-seo-strategies" className="space-y-4 mt-8">
        <h2 id="proven-seo-strategies" className="text-xl font-semibold">Proven SEO Strategies for 2024</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.slice(1).map((f, i) => (
            <article key={i} className="card p-4 space-y-3">
              <img src={f.image} alt={f.alt} className="w-full h-40 object-cover rounded" loading="lazy" />
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-300">{f.description}</p>
              <div className="text-sm text-slate-500 dark:text-slate-400">Published: {new Date(f.published).toLocaleDateString()} • {f.readTime} min read</div>
              <div className="flex flex-wrap gap-2 text-xs">
                {f.tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-1 rounded bg-slate-100 dark:bg-white/10">{t}</span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <Link href={f.url} prefetch={false} className="btn" aria-label={`Read: ${f.title}`}>Read Guide</Link>
                <ShareActions url={`${baseUrl}${f.url}`} title={f.title} />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Related articles */}
      <section aria-labelledby="related-articles" className="space-y-3 mt-10">
        <h2 id="related-articles" className="text-xl font-semibold">Related Articles</h2>
        <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300">
          <li><Link className="text-brand-600 hover:underline" href="/blog">Browse all blog articles</Link></li>
          <li><Link className="text-brand-600 hover:underline" href="/tools/ai-content-improver">Use AI Content Improver</Link></li>
          <li><Link className="text-brand-600 hover:underline" href="/tools/structured-data-validator">Validate structured data</Link></li>
        </ul>
      </section>

      {/* Newsletter signup */}
      <section aria-labelledby="newsletter" className="mt-8">
        <h2 id="newsletter" className="sr-only">Newsletter</h2>
        <NewsletterForm />
      </section>

      {/* JSON-LD */}
      <StructuredData data={breadcrumbLd} />
      <StructuredData data={faqLd} />
      {articleLds.map((ld, idx) => (<StructuredData key={idx} data={ld} />))}
    </main>
  );
}