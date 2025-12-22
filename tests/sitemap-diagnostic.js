import fs from 'fs';
import path from 'path';

// Simulation of fetch for local diagnostic
const checkSitemapLocal = async (url) => {
    // In next.js app router, sitemaps are generated at build time or runtime
    // We can check if the route file exists

    const route = url.replace('https://www.100seotools.com', '')
        .replace('/sitemap.xml', '/sitemap.js')
        .replace('/sitemap-index.xml', '/sitemap-index.xml/route.js');

    let filePath = path.join(process.cwd(), 'app', route);

    // Check various possibilities for where the file might be
    const possiblePaths = [
        path.join(process.cwd(), 'app', url.replace('https://www.100seotools.com/', '').replace('sitemap.xml', 'sitemap.js')),
        path.join(process.cwd(), 'app', url.replace('https://www.100seotools.com/', '').replace('/sitemap.xml', ''), 'sitemap.js'),
    ];

    let found = false;
    for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
            console.log(`✅ FOUND SOURCE: ${p}`);
            found = true;
            break;
        }
    }

    if (!found) {
        console.log(`❌ FILE NOT FOUND for ${url}`);
        console.log(`   Checked paths: ${possiblePaths.join(', ')}`);
    } else {
        // try to see if it exports a default function
        try {
            const content = fs.readFileSync(possiblePaths.find(p => fs.existsSync(p)), 'utf8');
            if (content.includes('export default function sitemap')) {
                console.log(`   ✅ Exports sitemap function`);
            } else {
                console.log(`   ⚠️ Does not seem to export sitemap function`);
            }
        } catch (e) {
            console.log(`   ❌ Error reading file: ${e.message}`);
        }
    }
};

const sitemaps = [
    'https://www.100seotools.com/sitemap-index.xml',
    'https://www.100seotools.com/sitemap-static/sitemap.xml',
    'https://www.100seotools.com/sitemap-tools/sitemap.xml',
    'https://www.100seotools.com/sitemap-blog/sitemap.xml'
];

console.log('--- SITEMAP DIAGNOSTIC ---');
for (const s of sitemaps) {
    console.log(`\nChecking ${s}...`);
    await checkSitemapLocal(s);
}
