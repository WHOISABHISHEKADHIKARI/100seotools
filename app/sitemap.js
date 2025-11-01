import { getAllToolsMeta } from '../tools';
import { getAllBlogPosts } from '../lib/blog';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://100tools.app';

export default function sitemap() {
  const entries = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0
    }
  ];

  // Blog index
  entries.push({
    url: `${baseUrl}/blog`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7
  });

  // Static pages
  entries.push({
    url: `${baseUrl}/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6
  });
  entries.push({
    url: `${baseUrl}/faq`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6
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
  const posts = getAllBlogPosts();
  const slugify = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const categories = Array.from(new Set(tools.map((t) => t.category).filter(Boolean)));
  const toolEntries = tools.map((t) => ({
    url: `${baseUrl}/tools/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  // Blog guides per tool
  const blogEntries = tools.map((t) => ({
    url: `${baseUrl}/blog/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6
  }));

  // Generic SEO blog posts
  const seoBlogEntries = posts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5
  }));

  const categoryEntries = categories.map((cat) => ({
    url: `${baseUrl}/category/${slugify(cat)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6
  }));

  return [...entries, ...toolEntries, ...blogEntries, ...seoBlogEntries, ...categoryEntries];
}