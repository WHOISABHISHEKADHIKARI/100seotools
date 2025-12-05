import { getAllBlogPosts } from '../lib/blog.js';

const posts = getAllBlogPosts();
const slugCounts = {};
const duplicates = [];

posts.forEach((post, index) => {
    const slug = post.slug;
    if (!slugCounts[slug]) {
        slugCounts[slug] = [];
    }
    slugCounts[slug].push(index);
});

Object.entries(slugCounts).forEach(([slug, indices]) => {
    if (indices.length > 1) {
        duplicates.push({ slug, count: indices.length, indices });
    }
});

if (duplicates.length > 0) {
    console.log(`\n❌ Found ${duplicates.length} duplicate slugs:\n`);
    duplicates.forEach(({ slug, count, indices }) => {
        console.log(`  - "${slug}" appears ${count} times at indices: ${indices.join(', ')}`);
        indices.forEach(i => {
            console.log(`    [${i}] ${posts[i].title}`);
        });
        console.log('');
    });
} else {
    console.log('\n✅ No duplicate slugs found!');
}

console.log(`\nTotal posts: ${posts.length}`);
console.log(`Unique slugs: ${Object.keys(slugCounts).length}`);
