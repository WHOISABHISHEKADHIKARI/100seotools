import { tools } from './registry.js';
import { getAllBlogPosts } from '../lib/blog.js';

export { tools };
export function getAllToolsMeta() { 
  return tools.map(tool => ({
    ...tool,
    type: 'tool'
  })); 
}
export function getToolBySlug(slug) { return tools.find(t => t.slug === slug); }

/**
 * Returns all searchable content including tools and blog posts.
 * Useful for site-wide indexing, search, and related content features.
 */
export function getAllContentMeta() {
  const blogs = getAllBlogPosts().map(post => ({
    ...post,
    type: 'blog',
    // Map blog fields to tool-like fields for consistency in UI components
    name: post.title,
    description: post.description || post.tldr,
    category: post.category || 'Blog'
  }));

  const toolsWithMeta = tools.map(tool => ({
    ...tool,
    type: 'tool'
  }));

  return [...toolsWithMeta, ...blogs];
}

export { getAllBlogPosts };
