import { getAllToolsMeta } from '../tools';
import { getAllBlogPosts } from '../lib/blog';
import { getBaseUrl } from '../lib/site';

const baseUrl = getBaseUrl();

export default function sitemap() {
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
  // Category index
  entries.push({
    url: `${baseUrl}/category`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7
  });
  // Demo and offline utility pages
  entries.push({
    url: `${baseUrl}/card-demo`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.3
  });
  entries.push({
    url: `${baseUrl}/offline`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.1
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

  return [...entries, ...toolEntries, ...blogEntries, ...seoBlogEntries, ...categoryEntries];
}