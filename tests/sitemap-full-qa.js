// Node 18+ has global fetch
// Node 18+ has global fetch

const BASE_URL = 'http://localhost:3000';

const SITEMAPS = [
    '/sitemap-index.xml',
    '/sitemap-static/sitemap.xml',
    '/sitemap-tools/sitemap.xml',
    '/sitemap-blog/sitemap.xml',
    '/sitemap-guides/sitemap.xml',
    '/sitemap-categories/sitemap.xml',
    '/sitemap-author/sitemap.xml'
];

async function runQA() {
    console.log('🚀 Starting Full Sitemap QA...\n');
    let hasErrors = false;

    for (const path of SITEMAPS) {
        const url = `${BASE_URL}${path}`;
        try {
            console.log(`Checking: ${path}`);
            const res = await fetch(url);

            if (res.status !== 200) {
                console.error(`❌ HTTP Error: ${res.status} ${res.statusText}`);
                hasErrors = true;
                continue;
            }

            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('xml')) {
                console.warn(`⚠️ Warning: Content-Type is ${contentType}, expected application/xml or text/xml`);
            }

            const text = await res.text();

            // Basic XML validation
            if (!text.trim().startsWith('<?xml')) {
                console.error('❌ Does not start with XML declaration');
                hasErrors = true;
                continue;
            }

            // Check for correct root element
            const isIndex = path.includes('index');
            const expectedRoot = isIndex ? '<sitemapindex' : '<urlset';
            if (!text.includes(expectedRoot)) {
                console.error(`❌ Missing expected root element: ${expectedRoot}`);
                hasErrors = true;
                continue;
            }

            // Count URLs
            const locCount = (text.match(/<loc>/g) || []).length;
            console.log(`✅ Valid XML | Found ${locCount} entries`);

            // Check for any obvious malformed URLs
            const locs = text.match(/<loc>(.*?)<\/loc>/g);
            if (locs) {
                const invalidUrls = locs.filter(l => {
                    const u = l.replace('<loc>', '').replace('</loc>', '');
                    return u.includes('undefined') || u.includes('null') || !u.startsWith('http');
                });
                if (invalidUrls.length > 0) {
                    console.error('❌ Found malformed URLs:', invalidUrls);
                    hasErrors = true;
                }
            }

            // Specific check for sitemap index children connectivity
            if (isIndex) {
                const children = text.match(/<loc>(.*?)<\/loc>/g).map(l => l.replace('<loc>', '').replace('</loc>', ''));
                console.log(`   ℹ️ Index references: ${children.length} sitemaps`);
                // Verify children URLs match our known list logic (optional, but good for diagnostics)
            }

        } catch (error) {
            console.error(`❌ Connection Failed: ${error.message}`);
            hasErrors = true;
        }
        console.log('---');
    }

    if (hasErrors) {
        console.log('\n❌ QA Completed with ERRORS');
        process.exit(1);
    } else {
        console.log('\n✅ QA Completed: All Sitemaps Valid');
        process.exit(0);
    }
}

runQA();
