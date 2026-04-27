/**
 * Headless crawler to verify HTTP status codes, console errors, responsiveness, and basic performance.
 * Runs against a local Next.js dev server by default (http://localhost:3004).
 * Outputs a summary to stdout and writes a detailed markdown report to reports/final-crawl-report.md
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const axePath = require.resolve('axe-core/axe.min.js');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3004';

const validRoutes = [
  '/',
  '/blog',
  '/tools/meta-tag-generator',
  '/category/keyword-research',
];

const invalidRoutes = [
  '/blog/non-existent-post-12345',
  '/tools/non-existent-tool-12345',
  '/category/non-existent-category-12345',
];

const viewports = [
  { width: 1920, height: 1080, label: 'desktop-1920x1080' },
  { width: 1440, height: 900, label: 'desktop-1440x900' },
  { width: 1280, height: 800, label: 'desktop-1280x800' },
  { width: 1024, height: 768, label: 'tablet-1024x768' },
  { width: 768, height: 1024, label: 'tablet-768x1024' },
  { width: 414, height: 896, label: 'mobile-414x896' },
  { width: 375, height: 667, label: 'mobile-375x667' },
  { width: 360, height: 640, label: 'mobile-360x640' },
];

async function measurePerformance(page) {
  // Capture basic navigation timings
  const perf = await page.evaluate(() => {
    const timing = performance.timing || performance.getEntriesByType('navigation')[0];
    const navStart = timing.navigationStart || (timing.startTime || 0);
    return {
      domContentLoaded: (timing.domContentLoadedEventEnd || timing.domContentLoadedEventStart || 0) - navStart,
      loadEvent: (timing.loadEventEnd || 0) - navStart,
      firstPaint: (performance.getEntriesByName && performance.getEntriesByName('first-paint')[0]?.startTime) || null,
    };
  });
  return perf;
}

async function run() {
  // Wait for server to be reachable
  async function waitForServer(url, retries = 5, delayMs = 1500) {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url + '/blog', { method: 'GET', headers: { 'Accept': 'text/html' } });
        if (res.ok || res.status) return true;
      } catch (_) {}
      await new Promise(r => setTimeout(r, delayMs));
    }
    return false;
  }

  const serverOk = await waitForServer(BASE_URL);
  if (!serverOk) {
    throw new Error(`Server not reachable at ${BASE_URL}`);
  }
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 1280, height: 800 },
  });
  const page = await browser.newPage();

  async function injectAxe() {
    try {
      // Reinject axe after each navigation; DOM resets on page.goto
      await page.addScriptTag({ path: axePath });
    } catch (_) {
      // Ignore if already injected or blocked; evaluation will fail if missing
    }
  }

  const results = {
    baseUrl: BASE_URL,
    timestamp: new Date().toISOString(),
    httpStatus: [],
    consoleErrors: [],
    responsiveness: [],
    performance: [],
    accessibility: [],
  };

  // Capture console warnings/errors
  const consoleLogs = [];
  page.on('console', (msg) => {
    const type = msg.type();
    if (type === 'warning' || type === 'error') {
      consoleLogs.push({ type, text: msg.text() });
    }
  });

  // Helper to fetch HEAD status using Node's fetch
  async function headStatus(url) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      return res.status;
    } catch {
      return 0;
    }
  }

  // Verify valid routes
  for (const route of validRoutes) {
    const url = `${BASE_URL}${route}`;
    const resp = await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    const status = resp?.status() || 0;
    const head = await headStatus(url);
    results.httpStatus.push({ route, status, head, expected: 200 });
    const perf = await measurePerformance(page);
    results.performance.push({ route, perf });

    // Accessibility: run axe color-contrast
    await injectAxe();
    const axeResult = await page.evaluate(async () => {
      return await axe.run(document, { runOnly: ['color-contrast'] });
    });
    const violations = axeResult.violations || [];
    results.accessibility.push({ route, violationsCount: violations.length, violations });
  }

  // Verify invalid routes should be 404
  for (const route of invalidRoutes) {
    const url = `${BASE_URL}${route}`;
    const resp = await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    const status = resp?.status() || 0;
    const head = await headStatus(url);
    results.httpStatus.push({ route, status, head, expected: 404 });
    const perf = await measurePerformance(page);
    results.performance.push({ route, perf });
  }

  // Responsiveness checks for valid routes at different viewports
  for (const route of validRoutes) {
    const url = `${BASE_URL}${route}`;
    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      const resp = await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
      const status = resp?.status() || 0;
      const layout = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      }));
      results.responsiveness.push({ route, viewport: vp.label, status, hasHorizontalOverflow: layout.hasHorizontalOverflow });
    }
  }

  const errorCount = consoleLogs.filter((l) => l.type === 'error').length;
  const warnCount = consoleLogs.filter((l) => l.type === 'warning').length;
  results.consoleErrors.push({ errors: errorCount, warnings: warnCount, sample: consoleLogs.slice(0, 10) });

  await browser.close();

  // Prepare markdown report
  const lines = [];
  lines.push('# Final Crawl Verification Report');
  lines.push('');
  lines.push(`- Base URL: ${results.baseUrl}`);
  lines.push(`- Timestamp: ${results.timestamp}`);
  lines.push('');
  lines.push('**HTTP Status Checks**');
  for (const h of results.httpStatus) {
    const combined = `page.goto=${h.status}, HEAD=${h.head || 'n/a'}`;
    lines.push(`- Route ${h.route}: ${combined} (expected ${h.expected})`);
  }
  lines.push('');
  lines.push('**Console Logs**');
  lines.push(`- Errors: ${errorCount}`);
  lines.push(`- Warnings: ${warnCount}`);
  if (errorCount || warnCount) {
    lines.push('- Sample:');
    for (const s of (consoleLogs.slice(0, 10))) {
      lines.push(`  - [${s.type}] ${s.text}`);
    }
  }
  lines.push('');
  lines.push('**Responsiveness**');
  for (const r of results.responsiveness) {
    lines.push(`- ${r.route} @ ${r.viewport}: status ${r.status}, horizontal overflow: ${r.hasHorizontalOverflow}`);
  }
  lines.push('');
  lines.push('**Performance (ms from navigation start)**');
  for (const p of results.performance) {
    const { domContentLoaded, loadEvent, firstPaint } = p.perf;
    lines.push(`- ${p.route}: DCL=${domContentLoaded || 'n/a'} | Load=${loadEvent || 'n/a'} | FP=${firstPaint || 'n/a'}`);
  }
  lines.push('');
  lines.push('**Accessibility (color-contrast)**');
  for (const a of results.accessibility) {
    lines.push(`- ${a.route}: violations=${a.violationsCount}`);
    for (const v of (a.violations || []).slice(0, 5)) {
      lines.push(`  - ${v.id}: ${v.description}`);
    }
  }
  lines.push('');
  lines.push('Summary: All checks completed. Use these results to update the audit report and error log.');

  const outPath = path.join(process.cwd(), 'reports', 'final-crawl-report.md');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, lines.join('\n'), 'utf-8');

  // Print compact summary to stdout
  console.log(JSON.stringify(results, null, 2));
}

run().catch((err) => {
  console.error('Crawler failed:', err);
  process.exit(1);
});