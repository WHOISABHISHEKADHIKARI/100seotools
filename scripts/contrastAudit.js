/*
  Contrast Audit using axe-core + Puppeteer
  - Visits key pages of the site
  - Runs axe with color-contrast rule
  - Outputs JSON report and fails on violations
*/

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function runAxe(page) {
  // Inject axe-core from node_modules
  const axePath = require.resolve('axe-core/axe.min.js');
  await page.addScriptTag({ path: axePath });
  return await page.evaluate(async () => {
    // Run only color-contrast rule
    return await axe.run(document, {
      runOnly: ['color-contrast'],
      rules: {
        // Allow checking of elements inside shadow DOM if present
        'color-contrast': { enabled: true },
      },
    });
  });
}

async function audit() {
  const baseUrl = process.env.AUDIT_BASE_URL || 'http://0.0.0.0:3002';
  const pagesToTest = [
    '/',
    '/about',
  ];

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: 'C:\\Users\\AbhishekAdhikari\\.cache\\puppeteer\\chrome\\win64-142.0.7444.59\\chrome-win64\\chrome.exe', // Adjust this path as needed
    args: ['--disable-web-security', '--disable-site-isolation-trials'],
  });
  const results = [];
  let totalViolations = 0;

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(60000);

    for (const route of pagesToTest) {
      const url = baseUrl + route;
      console.log(`\n[Contrast Audit] Preparing to visit: ${url}`); // Added log
      await new Promise(r => setTimeout(r, 20000)); // Increased delay to 20 seconds
      console.log(`\n[Contrast Audit] Visiting: ${url}`);
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      console.log(`[Contrast Audit] Successfully navigated to: ${url}`);

      // Small wait to ensure fonts/styles have applied
      await new Promise(r => setTimeout(r, 10000)); // Give the page some time to render

      const axeResult = await runAxe(page);
      const violations = axeResult.violations || [];
      totalViolations += violations.length;
      results.push({ route, violations });

      if (violations.length > 0) {
        console.log(`[Violations] ${violations.length} issues found on ${route}`);
        violations.forEach(v => {
          console.log(`- ${v.id}: ${v.description}`);
          v.nodes.slice(0, 5).forEach(n => {
            console.log(`  selector: ${n.target.join(', ')}`);
            if (n.failureSummary) console.log(`  summary: ${n.failureSummary}`);
          });
        });
      } else {
        console.log(`[OK] No color-contrast violations on ${route}`);
      }
    }

    // Write report
    const reportsDir = path.join(process.cwd(), 'reports');
    try { fs.mkdirSync(reportsDir, { recursive: true }); } catch (_) {}
    const outPath = path.join(reportsDir, `contrast-report-${Date.now()}.json`);
    fs.writeFileSync(outPath, JSON.stringify({ baseUrl, results }, null, 2));
    console.log(`\n[Contrast Audit] Report written to: ${outPath}`);

    if (totalViolations > 0) {
      console.error(`\n[Contrast Audit] FAILED: ${totalViolations} total violations found.`);
      process.exitCode = 1;
    } else {
      console.log(`\n[Contrast Audit] PASSED: No violations detected.`);
    }
  } catch (err) {
    console.error('[Contrast Audit] Error:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

audit();