import { getAllBlogPostsPublished } from '../../lib/blog-data';
import { getBaseUrl } from '../../lib/site';

/**
 * Sitemap for all blog posts
 * Located at /sitemap-blog.xml
 */
export default async function sitemap() {
    const baseUrl = getBaseUrl();
    const now = new Date();

    // Blog index page
    const blogIndex = {
        url: `${baseUrl}/blog`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.8,
    };

    // All blog posts
    const posts = await getAllBlogPostsPublished();
    const blogEntries = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.datePublished || now),
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    return [blogIndex, ...blogEntries];
}
