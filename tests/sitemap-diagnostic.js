import fs from 'fs';
import path from 'path';
import { getBaseUrl } from '../lib/site.js';

// Simulation of fetch for local diagnostic
const checkSitemapLocal = async (url) => {
    // In next.js app router, sitemaps are generated at build time or runtime
    // We can check if the route file exists

    const baseUrl = getBaseUrl();
    const route = url.replace(baseUrl, '')
        .replace('/sitemap.xml', '/sitemap.js')
        .replace('/sitemap-index.xml', '/sitemap-index.xml/route.js');

    let filePath = path.join(process.cwd(), 'app', route);

    // Check various possibilities for where the file might be
    const baseUrlSlash = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
    const possiblePaths = [
        path.join(process.cwd(), 'app', url.replace(baseUrlSlash, '').replace('sitemap.xml', 'sitemap.js')),
        path.join(process.cwd(), 'app', url.replace(baseUrlSlash, '').replace('/sitemap.xml', ''), 'sitemap.js'),
        path.join(process.cwd(), 'app', url.replace(baseUrlSlash, '') + '/route.js'), // For sitemap-index.xml/route.js
    ];

    let foundPath = null;
    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            // Ensure it is a file, not a directory
            if (fs.statSync(p).isFile()) {
                console.log(`✅ FOUND SOURCE: ${p}`);
                foundPath = p;
                break;
            }
        }
    }

    if (!foundPath) {
        console.log(`❌ FILE NOT FOUND for ${url}`);
        console.log(`   Checked paths: ${possiblePaths.join(', ')}`);
    } else {
        // try to see if it exports a default function
        try {
            const content = fs.readFileSync(foundPath, 'utf8');
            if (content.match(/export (default )?(async )?function/)) {
                console.log(`   ✅ Exports function (Route or Sitemap)`);
            } else {
                console.log(`   ⚠️ Does not seem to export function (Check manually)`);
            }
        } catch (e) {
            console.log(`   ❌ Error reading file: ${e.message}`);
        }
    }
};

const baseUrl = getBaseUrl();
const sitemaps = [
    `${baseUrl}/sitemap-index.xml`,
    `${baseUrl}/sitemap-static/sitemap.xml`,
    `${baseUrl}/sitemap-tools/sitemap.xml`,
    `${baseUrl}/sitemap-blog/sitemap.xml`,
    `${baseUrl}/sitemap-author/sitemap.xml`,
    `${baseUrl}/sitemap-guides/sitemap.xml`
];

console.log('--- SITEMAP DIAGNOSTIC ---');
for (const s of sitemaps) {
    console.log(`\nChecking ${s}...`);
    await checkSitemapLocal(s);
}
