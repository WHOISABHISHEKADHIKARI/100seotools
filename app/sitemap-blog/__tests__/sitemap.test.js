import sitemap from '../sitemap.js';

describe('Sitemap generation', () => {
    test('should include blog index with correct priority', async () => {
        const entries = await sitemap();
        expect(Array.isArray(entries)).toBe(true);
        const blogIndex = entries.find(e => e.url && e.url.endsWith('/blog'));
        expect(blogIndex).toBeDefined();
        expect(blogIndex.priority).toBe(0.85);
    });
});
