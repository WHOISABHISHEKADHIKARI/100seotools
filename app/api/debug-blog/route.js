import { getAllBlogPostsPublished } from '../../../lib/blog-data';

export async function GET() {
    const posts = await getAllBlogPostsPublished();

    return Response.json({
        totalPosts: posts.length,
        sampleSlugs: posts.slice(0, 20).map(p => p.slug),
        hasRedirect: posts.some(p => p.slug === 'redirect-301-generator'),
        hasSeoBasics1: posts.some(p => p.slug === 'seo-basics-1'),
        hasAiSchema: posts.some(p => p.slug === 'ai-schema-generator'),
    });
}
