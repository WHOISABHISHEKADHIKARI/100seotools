import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOOLS_DIR = path.join(__dirname, '../tools');
const BASE_URL = 'http://localhost:3000/tools/';

// The 3 required strings to find in the HTML
const CHECKS = [
    'Why This Tool Is Needed',
    'Role of This Tool in SEO',
    'Frequently Asked Questions'
];

async function loadTools() {
    try {
        const files = await fs.promises.readdir(TOOLS_DIR);
        const tools = [];
        for (const file of files) {
            if (file === 'index.js' || !file.endsWith('.js')) continue;
            try {
                const content = await fs.promises.readFile(path.join(TOOLS_DIR, file), 'utf8');
                const slugMatch = content.match(/[\'\"]?slug[\'\"]?\s*:\s*[\'\"]([^\'\"]+)[\'\"]/);
                if (slugMatch) {
                    tools.push(slugMatch[1]);
                }
            } catch (e) {
                console.error(`Failed to load ${file}:`, e);
            }
        }
        return tools;
    } catch (e) {
        console.error('Failed to read tools directory:', e);
        return [];
    }
}

function checkToolPage(slug) {
    return new Promise((resolve) => {
        const url = BASE_URL + slug;
        const req = http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    resolve({ slug, success: false, error: `Status ${res.statusCode}` });
                    return;
                }

                const missing = CHECKS.filter(check => !data.includes(check));
                if (missing.length === 0) {
                    resolve({ slug, success: true });
                } else {
                    resolve({ slug, success: false, missing });
                }
            });
        });

        req.on('error', (e) => {
            resolve({ slug, success: false, error: e.message });
        });

        req.setTimeout(5000, () => {
            req.abort();
            resolve({ slug, success: false, error: 'Timeout' });
        });
    });
}

async function run() {
    console.log('Loading tool list...');
    const tools = await loadTools();
    console.log(`Found ${tools.length} tools. Starting verification...`);

    let passed = 0;
    let failed = 0;
    const failures = [];

    // Process in batches to avoid overwhelming the server
    const batchSize = 5;
    for (let i = 0; i < tools.length; i += batchSize) {
        const batch = tools.slice(i, i + batchSize);
        const results = await Promise.all(batch.map(slug => checkToolPage(slug)));

        results.forEach(res => {
            if (res.success) {
                passed++;
                // console.log(`[PASS] ${res.slug}`);
            } else {
                failed++;
                console.error(`[FAIL] ${res.slug}: ${res.error || 'Missing: ' + res.missing.join(', ')}`);
                failures.push(res);
            }
        });

        process.stdout.write(`\rProgress: ${i + batch.length}/${tools.length} (Passed: ${passed}, Failed: ${failed})`);
    }

    console.log('\n\n--- Final Report ---');
    console.log(`Total Tools: ${tools.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);

    if (failures.length > 0) {
        console.log('\nFailures details:');
        failures.forEach(f => console.log(`- ${f.slug}: ${f.error || f.missing.join(', ')}`));
        process.exit(1);
    } else {
        console.log('\nAll tools verified successfully!');
        process.exit(0);
    }
}

run();
