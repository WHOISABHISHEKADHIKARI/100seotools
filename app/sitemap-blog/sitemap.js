import { getAllBlogPostsPublished } from '../../lib/blog-data.js';
import { getBaseUrl } from '../../lib/site';

/**
 * ============================================
 * BLOG SITEMAP - ROBUST FORMAT
 * ============================================
 *
 * Purpose: Comprehensive sitemap for all blog posts
 * Location: /sitemap-blog.xml
 *
 * Coverage:
 * - Blog index page (/blog)
 * - All published blog posts (/blog/[slug])
 *
 * Priority Strategy:
 * - Blog index: 0.85 (high - main content hub)
 * - Recent posts (<30 days): 0.7 (higher priority)
 * - Standard posts: 0.6 (medium priority)
 * - Older posts (>180 days): 0.5 (lower priority)
 *
 * Update Frequency:
 * - Blog index: daily (new posts added)
 * - Recent posts: weekly (active engagement)
 * - Standard posts: monthly (occasional updates)
 */

/**
 * Validates blog post metadata
 * @param {Object} post - Blog post object
 * @returns {boolean} - Whether the post is valid
 */
function validatePost(post) {
    if (!post || typeof post !== 'object') {
        console.warn('⚠️ Invalid blog post object:', post);
        return false;
    }

    if (!post.slug || typeof post.slug !== 'string') {
        console.warn('⚠️ Blog post missing valid slug:', post);
        return false;
    }

    if (!post.title || typeof post.title !== 'string') {
        console.warn('⚠️ Blog post missing valid title:', post);
        return false;
    }

    return true;
}

/**
 * Calculates post age in days
 * @param {string|Date} datePublished - Publication date
 * @returns {number} - Age in days
 */
function getPostAge(datePublished) {
    if (!datePublished) return Infinity;

    const publishDate = new Date(datePublished);
    const now = new Date();
    const diffTime = Math.abs(now - publishDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

/**
 * Determines priority based on post age
 * @param {Object} post - Blog post metadata
 * @returns {number} - Priority value (0.0-1.0)
 */
function getPostPriority(post) {
    const age = getPostAge(post.datePublished);

    // Featured posts
    if (post.featured) {
        return 0.75;
    }

    // Recent posts (< 30 days)
    if (age < 30) {
        return 0.7;
    }

    // Posts < 90 days
    if (age < 90) {
        return 0.65;
    }

    // Posts < 180 days
    if (age < 180) {
        return 0.6;
    }

    // Older posts
    return 0.5;
}

/**
 * Determines change frequency based on post age
 * @param {Object} post - Blog post metadata
 * @returns {string} - Change frequency
 */
function getPostChangeFreq(post) {
    const age = getPostAge(post.datePublished);

    // Recent posts updated more frequently
    if (age < 30) {
        return 'weekly';
    }

    // Standard posts
    if (age < 180) {
        return 'monthly';
    }

    // Older posts
    return 'yearly';
}

/**
 * Main sitemap generation function for blog
 * @returns {Promise<Array>} Sitemap entries in Next.js format
 */
export default async function sitemap() {
    const baseUrl = getBaseUrl();
    const now = new Date();

    // ============================================
    // BLOG INDEX PAGE
    // ============================================
    const blogIndex = {
        url: `${baseUrl}/blog`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.85,
    };

    // ============================================
    // GET ALL PUBLISHED BLOG POSTS
    // ============================================
    let posts = [];
    try {
        posts = await getAllBlogPostsPublished();
    } catch (error) {
        console.error('❌ Error loading blog posts:', error);
        return [blogIndex]; // Return at least the blog index
    }

    // Validate posts
    const validPosts = posts.filter(validatePost);

    if (validPosts.length !== posts.length) {
        console.warn(`⚠️ Filtered out ${posts.length - validPosts.length} invalid blog posts`);
    }

    // ============================================
    // INDIVIDUAL BLOG POST PAGES
    // ============================================
    const blogEntries = validPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.datePublished || post.dateModified || now),
        changeFrequency: getPostChangeFreq(post),
        priority: getPostPriority(post),
    }));

    // ============================================
    // STATISTICS & LOGGING
    // ============================================
    if (process.env.NODE_ENV === 'development') {
        const recentPosts = validPosts.filter(p => getPostAge(p.datePublished) < 30).length;
        const standardPosts = validPosts.filter(p => {
            const age = getPostAge(p.datePublished);
            return age >= 30 && age < 180;
        }).length;
        const olderPosts = validPosts.filter(p => getPostAge(p.datePublished) >= 180).length;

        console.log('📝 Blog Sitemap Generation:');
        console.log(`   📄 Total posts: ${validPosts.length}`);
        console.log(`   📊 By age:`);
        console.log(`      • Recent (<30 days): ${recentPosts}`);
        console.log(`      • Standard (30-180 days): ${standardPosts}`);
        console.log(`      • Older (>180 days): ${olderPosts}`);
        console.log(`   🔗 Base URL: ${baseUrl}`);
    }

    // ============================================
    // RETURN COMBINED ENTRIES
    // ============================================
    return [blogIndex, ...blogEntries];
}
