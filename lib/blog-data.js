import { listPublishedPosts, getPublishedPostBySlug } from './schedule';
import { getAllBlogPosts, getBlogPostBySlug } from './blog';

// Returns published posts from KV if available, otherwise falls back to static posts.
export async function getAllBlogPostsPublished() {
  try {
    const dynamic = await listPublishedPosts();
    const staticPosts = getAllBlogPosts();
    // Merge: static first, then dynamic published not duplicating slugs
    const seen = new Set(staticPosts.map((p) => p.slug));
    const merged = [...staticPosts];
    for (const p of dynamic) {
      if (!seen.has(p.slug)) merged.push(p);
    }
    // Sort by datePublished/publishAt desc where available
    return merged.sort((a, b) => {
      const ad = Number(new Date(a.datePublished || a.publishAt || 0));
      const bd = Number(new Date(b.datePublished || b.publishAt || 0));
      return bd - ad;
    });
  } catch {
    return getAllBlogPosts();
  }
}

export async function getBlogPostPublishedBySlug(slug) {
  try {
    const dynamicPost = await getPublishedPostBySlug(slug);
    if (dynamicPost) return dynamicPost;
  } catch {}
  return getBlogPostBySlug(slug);
}

