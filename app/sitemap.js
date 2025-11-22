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
    priority: 0.75
  });
  // Exclude offline and error utility pages from sitemap

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

  // Blog guides now merged into the single /blog page; avoid per‑post URLs in sitemap
  const blogEntries = posts.map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.datePublished || now),
    changeFrequency: 'monthly',
    priority: 0.6
  }));
  const seoBlogEntries = [];

  const categoryEntries = categories.map((cat) => ({
    url: `${baseUrl}/category/${slugify(cat)}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75
  }));

  // Exclude paginated listing pages from sitemap; canonical remains /blog

  return [
    ...entries,
    ...toolEntries,
    ...blogEntries,
    ...seoBlogEntries,
    ...categoryEntries,
  ];
}
