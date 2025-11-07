import ArticleCard from '@/components/ArticleCard';
import '@/app/components/article-card.css';

export default function ArticleCardDemo() {
  const sampleArticles = [
    {
      title: "SEO Basics: Complete SEO Guide 12 - Boost Rankings Fast",
      description: "Master SEO fundamentals with our complete guide 12. Learn keyword research, on-page optimization, technical SEO, link building, and content strategies that boost rankings in 2025. Free tools, actionable tips, and proven techniques for better search visibility.",
      category: "SEO Foundations",
      readTime: "12 min read",
      author: "Alex Thompson",
      authorAvatar: "https://ui-avatars.com/api/?name=Alex+Thompson&background=random&size=64",
      image: "/icon.svg",
      href: "/blog/seo-basics-complete-guide",
      publishedAt: "2024-01-15"
    },
    {
      title: "Technical SEO Audit: A Complete Step-by-Step Guide",
      description: "Learn how to perform a comprehensive technical SEO audit. Covering site architecture, crawlability, indexability, page speed, mobile optimization, and advanced technical factors that impact search rankings.",
      category: "Technical SEO",
      readTime: "18 min read",
      author: "Maria Rodriguez",
      authorAvatar: "https://ui-avatars.com/api/?name=Maria+Rodriguez&background=random&size=64",
      image: "/icon.svg",
      href: "/blog/technical-seo-audit-guide",
      publishedAt: "2024-01-12"
    },
    {
      title: "Content Marketing Strategy: Drive Traffic and Engagement",
      description: "Discover proven content marketing strategies that drive organic traffic, engage audiences, and convert visitors into customers. Includes content planning, creation, distribution, and measurement techniques.",
      category: "Content Marketing",
      readTime: "15 min read",
      author: "David Kim",
      authorAvatar: "https://ui-avatars.com/api/?name=David+Kim&background=random&size=64",
      image: "/icon.svg",
      href: "/blog/content-marketing-strategy",
      publishedAt: "2024-01-10"
    },
    {
      title: "Link Building in 2024: Ethical Strategies That Work",
      description: "Explore modern link building techniques that comply with Google's guidelines. Learn about digital PR, content partnerships, guest posting, and relationship-based link acquisition strategies.",
      category: "Link Building",
      readTime: "10 min read",
      author: "Sarah Johnson",
      authorAvatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random&size=64",
      image: "/icon.svg",
      href: "/blog/link-building-strategies-2024",
      publishedAt: "2024-01-08"
    },
    {
      title: "Local SEO: Dominate Local Search Results",
      description: "Complete guide to local SEO optimization. Learn Google Business Profile optimization, local citations, review management, and location-based keyword strategies for local businesses.",
      category: "Local SEO",
      readTime: "14 min read",
      author: "James Wilson",
      authorAvatar: "https://ui-avatars.com/api/?name=James+Wilson&background=random&size=64",
      image: "/icon.svg",
      href: "/blog/local-seo-complete-guide",
      publishedAt: "2024-01-05"
    },
    {
      title: "E-commerce SEO: Optimize Your Online Store",
      description: "Master e-commerce SEO with this comprehensive guide. Covering product page optimization, category structure, schema markup, and conversion-focused SEO strategies for online retailers.",
      category: "E-commerce SEO",
      readTime: "20 min read",
      author: "Lisa Chen",
      authorAvatar: "https://ui-avatars.com/api/?name=Lisa+Chen&background=random&size=64",
      image: "/icon.svg",
      href: "/blog/ecommerce-seo-guide",
      publishedAt: "2024-01-03"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Article Card Component Redesign
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Modern, accessible, and responsive article cards with enhanced visual hierarchy and interactive elements.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Modern Aesthetics
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Clean design with subtle shadows, smooth transitions, and contemporary visual elements.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Accessibility First
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              WCAG 2.1 AA compliant with proper ARIA attributes, keyboard navigation, and screen reader support.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Responsive Design
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Mobile-first approach with adaptive layouts for all screen sizes and devices.
            </p>
          </div>
        </div>

        {/* Demo Sections */}

        {/* Full Featured Cards */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Full Featured Article Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleArticles.map((article, index) => (
              <ArticleCard
                key={index}
                title={article.title}
                description={article.description}
                category={article.category}
                readTime={article.readTime}
                author={article.author}
                authorAvatar={article.authorAvatar}
                image={article.image}
                href={article.href}
                publishedAt={article.publishedAt}
                priority={index < 2}
              />
            ))}
          </div>
        </section>

        {/* Minimal Cards */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Minimal Article Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleArticles.slice(0, 4).map((article, index) => (
              <ArticleCard
                key={`minimal-${index}`}
                title={article.title}
                description={article.description}
                category={article.category}
                readTime={article.readTime}
                href={article.href}
              />
            ))}
          </div>
        </section>

        {/* Non-Interactive Cards */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Non-Interactive Display Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleArticles.slice(0, 3).map((article, index) => (
              <ArticleCard
                key={`static-${index}`}
                title={article.title}
                description={article.description}
                category={article.category}
                readTime={article.readTime}
                author={article.author}
                authorAvatar={article.authorAvatar}
                image={article.image}
                publishedAt={article.publishedAt}
              />
            ))}
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Technical Specifications
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Component Props
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">title</code> - Article title (required)</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">description</code> - Article description</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">category</code> - Article category</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">readTime</code> - Estimated read time</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">author</code> - Author name</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">authorAvatar</code> - Author avatar URL</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">image</code> - Article thumbnail URL</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">href</code> - Article URL (makes card interactive)</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">publishedAt</code> - Publication date</li>
                  <li><code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">priority</code> - Image loading priority</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Features
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>✅ WCAG 2.1 AA compliant</li>
                  <li>✅ Mobile-first responsive design</li>
                  <li>✅ Smooth hover animations</li>
                  <li>✅ Keyboard navigation support</li>
                  <li>✅ Screen reader optimized</li>
                  <li>✅ Image lazy loading</li>
                  <li>✅ Dark mode support</li>
                  <li>✅ Performance optimized</li>
                  <li>✅ Cross-browser compatible</li>
                  <li>✅ Print-friendly styles</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Implementation Examples
          </h2>
          <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
            <pre className="text-green-400 text-sm">
{`// Basic usage
<ArticleCard
  title="SEO Best Practices"
  description="Learn essential SEO techniques..."
  category="SEO"
  readTime="5 min read"
  href="/blog/seo-basics"
/>

// Full featured
<ArticleCard
  title="Technical SEO Guide"
  description="Complete technical SEO audit..."
  category="Technical SEO"
  readTime="15 min read"
  author="John Doe"
  authorAvatar="/avatar.jpg"
  image="/thumbnail.jpg"
  href="/blog/technical-seo"
  publishedAt="2024-01-15"
  priority={true}
/>

// Non-interactive
<ArticleCard
  title="Featured Article"
  description="Display-only card..."
  category="Featured"
  readTime="3 min read"
/>`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}
