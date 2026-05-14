import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = process.env.QA_BASE_URL || 'http://127.0.0.1:3002';
const REPORT_DIR = path.resolve('reports');
const STARTED_AT = new Date().toISOString();
const TIMEOUT_MS = 12000;

const issues = [];
const stats = {
  pagesHttpChecked: 0,
  pagesRendered: 0,
  buttonsChecked: 0,
  linksChecked: 0,
  formsChecked: 0,
  apiRoutesChecked: 0,
};

function addIssue(issue) {
  issues.push({
    severity: 'Medium',
    screenshot: '',
    ...issue,
  });
}

function pathFromUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.pathname + parsed.search;
  } catch {
    return url;
  }
}

function escapeMarkdown(value = '') {
  return String(value).replaceAll('|', '\\|').replace(/\s+/g, ' ').trim();
}

async function fetchText(url) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    const text = await response.text();
    return { response, text };
  } finally {
    clearTimeout(id);
  }
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());
}

async function collectSitemapUrls() {
  const { text } = await fetchText(`${BASE_URL}/sitemap.xml`);
  const locs = extractLocs(text);
  const pageUrls = [];
  const sitemapUrls = locs.filter((loc) => loc.includes('sitemap') && loc.endsWith('.xml'));

  for (const sitemapUrl of sitemapUrls) {
    try {
      const localSitemapUrl = new URL(new URL(sitemapUrl).pathname, BASE_URL).toString();
      const { text: sitemapText } = await fetchText(localSitemapUrl);
      pageUrls.push(...extractLocs(sitemapText).map((loc) => new URL(new URL(loc).pathname, BASE_URL).toString()));
    } catch (error) {
      addIssue({
        page: pathFromUrl(sitemapUrl),
        type: 'Sitemap',
        severity: 'High',
        steps: `Fetch ${sitemapUrl}`,
        expected: 'Sitemap should load and be parseable.',
        actual: error.message,
        suggestedFix: 'Check sitemap route generation and server availability.',
      });
    }
  }

  return [...new Set(pageUrls)].sort();
}

async function checkHttpPages(urls) {
  for (const url of urls) {
    try {
      const started = Date.now();
      const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(TIMEOUT_MS) });
      const elapsed = Date.now() - started;
      stats.pagesHttpChecked += 1;
      if (response.status >= 400) {
        addIssue({
          page: pathFromUrl(url),
          type: 'HTTP Status',
          severity: response.status >= 500 ? 'Critical' : 'High',
          steps: `Open ${url}`,
          expected: 'Page should return a successful 2xx/3xx status.',
          actual: `Returned HTTP ${response.status}.`,
          suggestedFix: 'Inspect route generation, dynamic params, and redirects for this path.',
        });
      }
      if (elapsed > 3000) {
        addIssue({
          page: pathFromUrl(url),
          type: 'Performance',
          severity: 'Low',
          steps: `Fetch ${url}`,
          expected: 'Initial response should complete within 3 seconds locally.',
          actual: `Response took ${elapsed}ms.`,
          suggestedFix: 'Profile route data loading and static generation cache behavior.',
        });
      }
    } catch (error) {
      addIssue({
        page: pathFromUrl(url),
        type: 'HTTP Timeout',
        severity: 'High',
        steps: `Open ${url}`,
        expected: 'Page should respond before timeout.',
        actual: error.message,
        suggestedFix: 'Check server logs for route hangs or runtime errors.',
      });
    }
  }
}

async function collectApiRoutes() {
  const apiRoot = path.resolve('app/api');
  const entries = [];

  async function walk(dir) {
    const children = await fs.readdir(dir, { withFileTypes: true });
    if (children.some((child) => child.isFile() && child.name === 'route.js')) {
      entries.push(`/${path.relative(path.resolve('app'), dir).replaceAll(path.sep, '/')}`);
    }
    for (const child of children) {
      if (child.isDirectory()) {
        await walk(path.join(dir, child.name));
      }
    }
  }

  await walk(apiRoot);
  return entries.sort();
}

async function checkApis(routes) {
  for (const route of routes) {
    try {
      const response = await fetch(`${BASE_URL}${route}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({}),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      stats.apiRoutesChecked += 1;
      if (response.status >= 500) {
        const body = await response.text();
        addIssue({
          page: route,
          type: 'API Failure',
          severity: 'Critical',
          steps: `POST empty JSON to ${route}`,
          expected: 'API should return validation error or useful response, not crash.',
          actual: `Returned HTTP ${response.status}: ${body.slice(0, 180)}`,
          suggestedFix: 'Add request validation guards and structured error handling in this API route.',
        });
      }
      if (response.status === 404 || response.status === 405) {
        addIssue({
          page: route,
          type: 'API Method',
          severity: 'Low',
          steps: `POST empty JSON to ${route}`,
          expected: 'Public API route should document or handle supported methods.',
          actual: `Returned HTTP ${response.status}.`,
          suggestedFix: 'If POST is unsupported, add explicit method handling or exclude this route from tool API checks.',
        });
      }
    } catch (error) {
      addIssue({
        page: route,
        type: 'API Timeout',
        severity: 'High',
        steps: `POST empty JSON to ${route}`,
        expected: 'API should respond before timeout.',
        actual: error.message,
        suggestedFix: 'Check route runtime, upstream calls, and timeout handling.',
      });
    }
  }
}

async function renderPage(browser, url, viewport, label) {
  const context = await browser.newContext({ viewport, serviceWorkers: 'block' });
  const page = await context.newPage();
  const consoleErrors = [];
  const failedRequests = [];
  const networkErrors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));
  page.on('requestfailed', (request) => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText || ''}`));
  page.on('response', (response) => {
    if (response.status() >= 400) networkErrors.push(`${response.status()} ${response.url()}`);
  });

  try {
    const response = await page.goto(url, { waitUntil: 'networkidle', timeout: TIMEOUT_MS });
    stats.pagesRendered += 1;
    const data = await page.evaluate(() => {
      const visibleText = document.body?.innerText?.trim() || '';
      return {
        title: document.title,
        h1: document.querySelector('h1')?.textContent?.trim() || '',
        bodyLength: visibleText.length,
        links: [...document.querySelectorAll('a[href]')].map((anchor) => ({
          text: anchor.textContent.trim().replace(/\s+/g, ' ').slice(0, 90),
          href: anchor.href,
        })),
        buttons: [...document.querySelectorAll('button, [role="button"]')].map((button) => button.textContent.trim().replace(/\s+/g, ' ').slice(0, 90) || button.getAttribute('aria-label') || 'Unlabeled button'),
        forms: [...document.querySelectorAll('form')].map((form) => ({
          action: form.getAttribute('action') || '',
          inputs: [...form.querySelectorAll('input, textarea, select')].map((input) => ({
            name: input.getAttribute('name') || input.getAttribute('aria-label') || input.getAttribute('placeholder') || input.id || input.tagName,
            required: input.hasAttribute('required'),
            type: input.getAttribute('type') || input.tagName.toLowerCase(),
          })),
        })),
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      };
    });

    stats.buttonsChecked += data.buttons.length;
    stats.formsChecked += data.forms.length;

    if (!response || response.status() >= 400) {
      addIssue({
        page: pathFromUrl(url),
        type: 'Page Load',
        severity: response?.status() >= 500 ? 'Critical' : 'High',
        steps: `Open ${url} at ${label}`,
        expected: 'Page should load successfully.',
        actual: `Navigation returned ${response?.status() || 'no response'}.`,
        suggestedFix: 'Inspect route handling and server logs.',
      });
    }
    if (!data.h1 || data.bodyLength < 100) {
      addIssue({
        page: pathFromUrl(url),
        type: 'Missing Content',
        severity: 'High',
        steps: `Open ${url} at ${label}`,
        expected: 'Page should render meaningful content with a primary heading.',
        actual: `h1="${data.h1}", body text length=${data.bodyLength}.`,
        suggestedFix: 'Check page component rendering and data loading fallback.',
      });
    }
    if (data.horizontalOverflow) {
      const screenshot = path.resolve(REPORT_DIR, `qa-overflow-${label}-${pathFromUrl(url).replace(/[^a-z0-9]+/gi, '-')}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      addIssue({
        page: pathFromUrl(url),
        type: 'Responsive Layout',
        severity: 'Medium',
        steps: `Open ${url} at ${viewport.width}x${viewport.height}`,
        expected: 'No horizontal overflow.',
        actual: `scrollWidth=${data.scrollWidth}, clientWidth=${data.clientWidth}.`,
        screenshot,
        suggestedFix: 'Find fixed-width elements, oversized grids, or unwrapped text on this viewport.',
      });
    }
    if (consoleErrors.length) {
      addIssue({
        page: pathFromUrl(url),
        type: 'Console Error',
        severity: 'High',
        steps: `Open ${url} at ${label} and inspect console.`,
        expected: 'No JavaScript console errors.',
        actual: consoleErrors.slice(0, 3).join(' | '),
        suggestedFix: 'Trace the component or script throwing the console error.',
      });
    }
    if (failedRequests.length || networkErrors.length) {
      addIssue({
        page: pathFromUrl(url),
        type: 'Network Failure',
        severity: 'Medium',
        steps: `Open ${url} at ${label} and inspect network panel.`,
        expected: 'No failed asset/API requests.',
        actual: [...failedRequests, ...networkErrors].slice(0, 5).join(' | '),
        suggestedFix: 'Fix missing assets, incorrect routes, or API failures.',
      });
    }

    const localLinks = data.links
      .filter((link) => link.href.startsWith(BASE_URL))
      .filter((link) => !link.href.includes('/_next/'))
      .slice(0, 80);
    for (const link of localLinks) {
      stats.linksChecked += 1;
      try {
        const linkResponse = await fetch(link.href, { redirect: 'manual', signal: AbortSignal.timeout(8000) });
        if (linkResponse.status >= 400) {
          addIssue({
            page: pathFromUrl(url),
            type: 'Broken Link',
            severity: linkResponse.status >= 500 ? 'High' : 'Medium',
            steps: `On ${pathFromUrl(url)}, open link "${link.text || link.href}"`,
            expected: 'Link should resolve to an existing page or valid redirect.',
            actual: `${pathFromUrl(link.href)} returned HTTP ${linkResponse.status}.`,
            suggestedFix: 'Update the href or add the missing target route/redirect.',
          });
        }
      } catch (error) {
        addIssue({
          page: pathFromUrl(url),
          type: 'Broken Link',
          severity: 'Medium',
          steps: `On ${pathFromUrl(url)}, open link "${link.text || link.href}"`,
          expected: 'Link should resolve before timeout.',
          actual: error.message,
          suggestedFix: 'Check target route performance and existence.',
        });
      }
    }

    return data;
  } catch (error) {
    addIssue({
      page: pathFromUrl(url),
      type: 'Render Timeout',
      severity: 'High',
      steps: `Open ${url} at ${label}`,
      expected: 'Page should render before timeout.',
      actual: error.message,
      suggestedFix: 'Inspect route for slow loading, runtime errors, or blocked requests.',
    });
    return null;
  } finally {
    await context.close();
  }
}

async function testForms(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  try {
    await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle', timeout: TIMEOUT_MS });
    const contactForms = await page.locator('form').count();
    stats.formsChecked += contactForms;
    if (contactForms === 0) {
      addIssue({
        page: '/contact',
        type: 'Form',
        severity: 'High',
        steps: 'Open /contact',
        expected: 'Contact page should expose a contact form.',
        actual: 'No form element found.',
        suggestedFix: 'Add or restore the contact form component.',
      });
    } else {
      await page.locator('form button[type="submit"], form button').first().click({ timeout: 5000 });
      const text = await page.locator('body').innerText({ timeout: 5000 });
      if (!/required|valid|error|message|name|email/i.test(text)) {
        addIssue({
          page: '/contact',
          type: 'Form Validation',
          severity: 'Medium',
          steps: 'Open /contact and submit empty form.',
          expected: 'User should see required-field validation or clear error message.',
          actual: 'No obvious validation message appeared in page text.',
          suggestedFix: 'Add visible validation messages near required fields.',
        });
      }
    }
  } catch (error) {
    addIssue({
      page: '/contact',
      type: 'Form Test',
      severity: 'High',
      steps: 'Open /contact and submit form.',
      expected: 'Contact form should be testable.',
      actual: error.message,
      suggestedFix: 'Inspect contact form selectors, validation, and route.',
    });
  } finally {
    await context.close();
  }
}

async function main() {
  await fs.mkdir(REPORT_DIR, { recursive: true });
  const urls = await collectSitemapUrls();
  await checkHttpPages(urls);
  const apiRoutes = await collectApiRoutes();
  await checkApis(apiRoutes);

  const keyPaths = [
    '/',
    '/tools',
    '/blog',
    '/category/content-seo',
    '/tools/keyword-suggestion-tool',
    '/tools/robots-txt-creator',
    '/seo-calculator',
    '/contact',
    '/about',
    '/faq',
    '/privacy',
    '/terms',
  ];

  const sampleUrls = [
    ...new Set([
      ...keyPaths.map((item) => `${BASE_URL}${item}`),
      ...urls.filter((url) => url.includes('/tools/')).slice(0, 20),
      ...urls.filter((url) => url.includes('/blog/')).slice(0, 20),
      ...urls.filter((url) => url.includes('/category/')).slice(0, 12),
    ]),
  ];

  const browser = await chromium.launch({ headless: true });
  for (const url of sampleUrls) {
    await renderPage(browser, url, { width: 1440, height: 900 }, 'desktop');
    await renderPage(browser, url, { width: 390, height: 844 }, 'mobile');
  }
  await testForms(browser);
  await browser.close();

  const summary = {
    startedAt: STARTED_AT,
    finishedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    stats,
    totalPagesInSitemap: urls.length,
    totalBugsFound: issues.length,
    severityCounts: issues.reduce((acc, issue) => {
      acc[issue.severity] = (acc[issue.severity] || 0) + 1;
      return acc;
    }, {}),
    issues,
  };

  const jsonPath = path.resolve(REPORT_DIR, 'qa-audit-report.json');
  await fs.writeFile(jsonPath, JSON.stringify(summary, null, 2));

  const tableRows = issues.map((issue) => (
    `| ${escapeMarkdown(issue.page)} | ${escapeMarkdown(issue.type)} | ${issue.severity} | ${escapeMarkdown(issue.steps)} | ${escapeMarkdown(issue.expected)} | ${escapeMarkdown(issue.actual)} | ${escapeMarkdown(issue.screenshot || 'N/A')} | ${escapeMarkdown(issue.suggestedFix)} |`
  ));

  const markdown = [
    '# QA Audit Report',
    '',
    `Base URL: ${BASE_URL}`,
    `Started: ${STARTED_AT}`,
    `Finished: ${summary.finishedAt}`,
    '',
    '## Summary',
    '',
    `- Total sitemap pages checked by HTTP: ${stats.pagesHttpChecked}`,
    `- Total browser renders: ${stats.pagesRendered}`,
    `- Total links checked: ${stats.linksChecked}`,
    `- Total buttons discovered: ${stats.buttonsChecked}`,
    `- Total forms checked: ${stats.formsChecked}`,
    `- Total API routes checked: ${stats.apiRoutesChecked}`,
    `- Total bugs found: ${issues.length}`,
    '',
    '## Issues',
    '',
    '| Page / URL | Issue Type | Severity | Steps to Reproduce | Expected Result | Actual Result | Screenshot | Suggested Fix |',
    '|---|---|---|---|---|---|---|---|',
    ...(tableRows.length ? tableRows : ['| All sampled routes | None | Low | Run automated QA | No issues | No issues found in tested scope | N/A | Continue manual exploratory QA before release |']),
    '',
  ].join('\n');

  const mdPath = path.resolve(REPORT_DIR, 'qa-audit-report.md');
  await fs.writeFile(mdPath, markdown);

  console.log(JSON.stringify({
    report: jsonPath,
    markdown: mdPath,
    stats: summary.stats,
    totalPagesInSitemap: summary.totalPagesInSitemap,
    totalBugsFound: summary.totalBugsFound,
    severityCounts: summary.severityCounts,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
