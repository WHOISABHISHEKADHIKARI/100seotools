import { getAllToolsMeta } from '../tools';
import { getAllBlogPostsPublished } from '../lib/blog-data';
import { getBaseUrl } from '../lib/site';

const baseUrl = getBaseUrl();

export default async function sitemap() {
  const now = new Date();
  const entries = [
    // Homepage
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0
    }
  ];

  // Blog index
  entries.push({
    url: `${baseUrl}/blog`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7
  });

  // Static pages
  entries.push({
    url: `${baseUrl}/about`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6
  });
  entries.push({
    url: `${baseUrl}/faq`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6
  });
  entries.push({
    url: `${baseUrl}/privacy`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.3
  });
  entries.push({
    url: `${baseUrl}/terms`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.3
  });
  // Category index
  entries.push({
    url: `${baseUrl}/category`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7
  });
  // Offline utility page
  entries.push({
    url: `${baseUrl}/offline`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.1
  });

  // Static blog articles
  entries.push({
    url: `${baseUrl}/blog/latest-ai-based-tips-and-tricks-for-fast-web-crawling`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  });

  // SEO Calculator page
  entries.push({
    url: `${baseUrl}/seo-calculator`,
    lastModified: new Date('2025-11-02'),
    changeFrequency: 'weekly',
    priority: 0.9
  });

  // SEO Cost Calculator page
  entries.push({
    url: `${baseUrl}/seo-cost-calculator`,
    lastModified: new Date('2025-11-02'),
    changeFrequency: 'weekly',
    priority: 0.85
  });

  const tools = getAllToolsMeta();
  const posts = await getAllBlogPostsPublished();
  // posts provided above via published facade
  const slugify = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const categories = Array.from(new Set(tools.map((t) => t.category).filter(Boolean)));
  const toolEntries = tools.map((t) => ({
    url: `${baseUrl}/tools/${t.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // Blog guides per tool
  const blogEntries = tools.map((t) => ({
    url: `${baseUrl}/blog/${t.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6
  }));

  // Generic SEO blog posts
  const seoBlogEntries = posts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: p.datePublished ? new Date(p.datePublished) : now,
    changeFrequency: 'monthly',
    priority: 0.5
  }));

  const categoryEntries = categories.map((cat) => ({
    url: `${baseUrl}/category/${slugify(cat)}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6
  }));

  // Paginated blog listing pages (posts)
  const postsPerPage = 24;
  const totalPostPages = Math.max(1, Math.ceil(posts.length / postsPerPage));
  const blogListingPages = Array.from({ length: totalPostPages - 1 }, (_, i) => i + 2).map((p) => ({
    url: `${baseUrl}/blog/p/${p}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6
  }));

  // Paginated tools subsection pages
  const toolsPerPage = 12;
  const totalToolPages = Math.max(1, Math.ceil(tools.length / toolsPerPage));
  const toolsListingPages = Array.from({ length: totalToolPages - 1 }, (_, i) => i + 2).map((p) => ({
    url: `${baseUrl}/blog/tp/${p}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6
  }));

  return [
    ...entries,
    ...toolEntries,
    ...blogEntries,
    ...seoBlogEntries,
    ...categoryEntries,
    ...blogListingPages,
    ...toolsListingPages,
  ];
}
