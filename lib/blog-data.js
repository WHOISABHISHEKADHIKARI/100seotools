import { getAllBlogPosts, getBlogPostBySlug } from './blog.js';
import { isIndexableBlogPost } from './blogCanonical.js';

// Returns published posts from KV if available, otherwise falls back to static posts.
export async function getAllBlogPostsPublished() {
  // Scheduling has been removed; return static posts only
  return getAllBlogPosts().filter(isIndexableBlogPost);
}

export async function getBlogPostPublishedBySlug(slug) {
  // Scheduling has been removed; resolve from static content only
  return getBlogPostBySlug(slug);
}
