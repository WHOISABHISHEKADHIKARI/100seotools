import { getAllBlogPosts } from '../lib/blog.js';
const posts = getAllBlogPosts();
console.log(`Total posts: ${posts.length}`);

const overviewPosts = posts.filter(p => p.slug.endsWith('-overview'));
console.log(`Overview posts: ${overviewPosts.length}`);
console.log('First 5 overview slugs:', overviewPosts.slice(0, 5).map(p => p.slug));

const variantPosts = posts.filter(p => p.slug.includes('-how-to-use'));
console.log(`How-to-use posts: ${variantPosts.length}`);

const toolSlugs = posts.filter(p => !p.slug.includes('-') && !p.slug.startsWith('seo-basics'));
console.log(`Potential colliding slugs: ${toolSlugs.length}`);
if (toolSlugs.length > 0) {
    console.log('Colliding slugs:', toolSlugs.map(p => p.slug));
}
