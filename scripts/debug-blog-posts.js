
import { getAllBlogPosts } from '../lib/blog.js';

console.log('Checking for redirect-301-generator post...');
const posts = getAllBlogPosts();
const post = posts.find(p => p.slug === 'redirect-301-generator');

if (post) {
    console.log('Found post:', post.title);
    console.log('Slug:', post.slug);
} else {
    console.log('Post NOT found!');
}

console.log('Total posts:', posts.length);
