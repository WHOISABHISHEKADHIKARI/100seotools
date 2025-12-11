import Link from 'next/link';
import StructuredData from '../../components/StructuredData';
import { getAllBlogPostsPublished } from '../../lib/blog-data';
import { getBaseUrl } from '../../lib/site';
import BlogGrid from './BlogGrid';

const baseUrl = getBaseUrl();

// Metadata moved to separate file or synced here
export { metadata } from './metadata';

export default async function BlogPage() {
  const posts = await getAllBlogPostsPublished();
  const categories = ['All', ...new Set(posts.map(p => p.category).filter(Boolean))];

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${baseUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${baseUrl}/blog` }
    ]
  };

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: '100 SEO Tools Blog - Free SEO Guides & Tutorials 2026',
    description: 'Comprehensive SEO guides, tutorials, and best practices. Learn keyword research, on-page optimization, technical SEO, link building, and AI-powered SEO strategies.',
    url: `${baseUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: '100 SEO Tools',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    blogPost: posts.slice(0, 10).map(p => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.datePublished,
      author: { '@type': 'Organization', name: '100 SEO Tools' },
      url: `${baseUrl}/blog/${p.slug}`,
      articleSection: p.category
    }))
  };

  return (
    <>
      <StructuredData data={breadcrumbLd} />
      <StructuredData data={collectionLd} />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm mb-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{posts.length}+ SEO Guides</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              SEO Guides & Tutorials
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-4">
              Master SEO with comprehensive guides on keyword research, on-page optimization, technical SEO, link building, and AI-powered strategies.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-6">
              <span className="inline-flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free Forever
              </span>
              <span className="inline-flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Updated 2026
              </span>
              <span className="inline-flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Expert Insights
              </span>
            </div>
          </div>
        </section>

        {/* Blog Grid Component (Client-side filtering) */}
        <BlogGrid initialPosts={posts} initialCategories={categories} />

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          <div className="card p-8 md:p-12 text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Ready to Boost Your SEO?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Try our 100+ free SEO tools to optimize your website and improve rankings.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/" className="btn">
                Browse All Tools
              </Link>
              <Link href="/author" className="btn-secondary">
                About the Creator
              </Link>
            </div>
          </div>
        </section>

        {/* SEO Footer */}
        <section className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-200 dark:border-gray-800">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-3">Popular Categories</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                {categories.filter(c => c !== 'All').slice(0, 5).map(cat => (
                  <li key={cat}>
                    <Link href={`/blog?category=${encodeURIComponent(cat)}`} className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3">Quick Links</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><Link href="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition">All Tools</Link></li>
                <li><Link href="/blog/seo-basics" className="hover:text-brand-600 dark:hover:text-brand-400 transition">SEO Basics</Link></li>
                <li><Link href="/author" className="hover:text-brand-600 dark:hover:text-brand-400 transition">About</Link></li>
                <li><Link href="/sitemap.xml" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Sitemap</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3">Latest Guides</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                {posts.slice(0, 5).map(post => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="hover:text-brand-600 dark:hover:text-brand-400 transition line-clamp-1">
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
