describe('Sitemap generation', () => {
    test('should include blog index with correct priority', async () => {
        const { buildBlogIndexEntry } = require('../../../lib/sitemapBlogCore.cjs');
        const blogIndex = buildBlogIndexEntry('https://example.com', '2026-04-25T00:00:00.000Z');
        expect(blogIndex.url).toBe('https://example.com/blog');
        expect(blogIndex.changeFrequency).toBe('daily');
        expect(blogIndex.priority).toBe(0.85);
    });
});
