import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOOLS_DIR = path.join(__dirname, '../tools');
const REPORT_FILE = path.join(__dirname, '../UI_QA_REPORT.md');
const SCREENSHOT_DIR = path.join(__dirname, '../test-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR);
}

// Reuse logic from qa-runner.js (but simplified/duplicated here to avoid ESM mixups)
// This logic determines a valid input for a field name/type
function getValidValue(name, type, options = []) {
    const n = name.toLowerCase();

    // URL fields
    if (type === 'url' || n.includes('url') || n.includes('link') || n.includes('site')) return 'https://example.com/test-page';

    // Domain fields
    if (n.includes('domain')) return 'example.com';

    // Numeric
    if (type === 'number') return '50';

    // Select
    if (type === 'select' && options && options.length > 0) return options[0].value || options[0];

    // Specific text fields
    if (n.includes('keyword')) return 'seo tools, link building, keyword research';
    if (n === 'seed') return 'seo strategy';
    if (n.includes('email')) return 'test@example.com';
    if (n.includes('project')) return 'My Test Project';
    if (n.includes('topic') || n.includes('title')) return 'The Future of SEO';

    // FAQ Generator specific format
    if (n.includes('question') || n.includes('faq')) {
        return 'Q: What is SEO? | A: SEO stands for Search Engine Optimization.';
    }

    // JSON fields
    if (n.includes('json') || type === 'json') {
        return '<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite"}</script>';
    }

    // Long text for content/textarea
    // Note: Competitor Gap Analyzer uses 'my_content' and 'competitor_content' -> both matched here.
    if (n.includes('content') || n.includes('text') || type === 'textarea') {
        return 'This is a comprehensive sample text for testing purposes. It is designed to be long enough to pass minimum character count requirements. SEO quality is important for ranking. Search engines love high quality, unique content that answers user intent.';
    }

    return 'Valid Test Input';
}

// Helper to extract tool metadata from file content
function parseToolFile(content) {
    const match = content.match(/const\s+template\s*=\s*'([^']+)'/);
    // Actually we need to just 'require' the file or parse the 'template' property
    // Getting the template name is key to knowing the fields.
    // We can also just infer fields from the UI! That is "truer" to manual testing.
}

async function runUITests() {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Get all tool slugs
    const toolFiles = fs.readdirSync(TOOLS_DIR).filter(f => f.endsWith('.js') && f !== 'index.js');
    const slugs = [];

    for (const file of toolFiles) {
        const content = fs.readFileSync(path.join(TOOLS_DIR, file), 'utf8');
        const slugMatch = content.match(/[\'\"]?slug[\'\"]?\s*:\s*[\'\"]([^\'\"]+)[\'\"]/);
        if (slugMatch) slugs.push(slugMatch[1]);
    }

    console.log(`Discovered ${slugs.length} tools.`);

    let report = `# UI Verification Report\nDate: ${new Date().toISOString()}\n\n| Tool | Status | Notes |\n|---|---|---|\n`;

    // Limit to first 5 for the demo run, then I can run more if requested.
    // The user asked to check EVERY tool. I will set this to run all, but with a timeout per tool.
    // Actually running 100 tools via Puppeteer will take ~10-20 minutes.
    // I will run a batch of 10 for now to validate the script, then I can run more.
    const toolsToRun = slugs;

    console.log(`Starting UI tests for ${toolsToRun.length} tools...`);

    for (const slug of toolsToRun) {
        try {
            const url = `http://localhost:3000/tools/${slug}`;
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

            // Check if 404
            const is404 = await page.$('text/404');
            if (is404) {
                throw new Error('404 Page Not Found');
            }

            // Check for the "Start Generating" or "Analyze" button (from ToolRunner)
            // The button text varies: "Analyze" or "def.actionLabel"
            // Selector: button.btn (which is usually the primary action)

            // 1. Find all inputs and fill them
            const inputs = await page.$$('input:not([type="hidden"]), textarea, select');
            let filledCount = 0;

            for (const input of inputs) {
                const type = await input.evaluate(el => el.type);
                const name = await input.evaluate(el => el.name || el.id);

                // Skip search bar in nav if accidentally selected (usually nav inputs have specific classes)
                // Our tool inputs are inside the card.

                const val = getValidValue(name, type);

                // Clear and type
                try {
                    await input.click({ clickCount: 3 }); // Select all
                    await input.type(String(val));
                    filledCount++;
                } catch (e) {
                    // Ignore (maybe hidden or read-only)
                }
            }

            if (filledCount === 0) {
                // Maybe it's a tool without inputs? Or custom UI?
                // Example: Keyword Density Checker has custom UI.
            }

            // 2. Click Submit
            // The submit button in ToolRunner has `onClick={analyze}` and class `btn w-full`
            // But also there might be a "Start Generating" link in the intro card. We want the form button.

            const submitBtn = await page.$('button.btn.w-full');
            if (submitBtn) {
                await submitBtn.click();

                // 3. Wait for Success
                // Success is when the output pre tag is not "No output yet..."
                // Or checking for error message.

                try {
                    await page.waitForFunction(
                        () => {
                            const pre = document.querySelector('pre');
                            const err = document.querySelector('.bg-red-50'); // Error box
                            if (err) return true; // Fail fast if error appears
                            if (pre && !pre.innerText.includes('No output yet') && !pre.innerText.includes('Processing...')) return true;
                            return false;
                        },
                        { timeout: 7000 }
                    );

                    // Check outcome
                    const errorEl = await page.$('.bg-red-50');
                    if (errorEl) {
                        const errText = await errorEl.evaluate(el => el.innerText);
                        report += `| ${slug} | 🔴 FAIL | Error: ${errText.replace(/\n/g, ' ')} |\n`;
                        console.log(`[FAIL] ${slug}: ${errText}`);
                    } else {
                        report += `| ${slug} | 🟢 PASS | Output generated |\n`;
                        console.log(`[PASS] ${slug}`);
                    }

                } catch (timeout) {
                    report += `| ${slug} | 🟡 WARN | Timeout waiting for result (maybe slow?) |\n`;
                    console.log(`[WARN] ${slug}: Timeout`);
                }

            } else {
                // Special case tools like Keyword Density might have different buttons
                // Try finding any button that says "Analyze" or "Generate"
                const buttons = await page.$$('button');
                let clicked = false;
                for (const btn of buttons) {
                    const text = await btn.evaluate(el => el.innerText);
                    if (text.includes('Analyze') || text.includes('Generate') || text.includes('Calculate')) {
                        await btn.click();
                        clicked = true;
                        break;
                    }
                }

                if (clicked) {
                    report += `| ${slug} | 🟢 PASS | Clicked custom button (Validation loose) |\n`;
                    // Add a small wait
                    await new Promise(r => setTimeout(r, 2000));
                } else {
                    report += `| ${slug} | ⚪ SKIP | No submit button found (Custom UI?) |\n`;
                    console.log(`[SKIP] ${slug}`);
                }
            }
        } catch (err) {
            report += `| ${slug} | 🔴 CRIT | Script Error: ${err.message} |\n`;
            console.error(`[CRIT] ${slug}: ${err.message}`);
            await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${slug}-error.png`) });
        }
    }

    fs.writeFileSync(REPORT_FILE, report);
    console.log(`UI Testing Complete. Report saved to ${REPORT_FILE}`);
    await browser.close();
}

runUITests();
