/**
 * Headless Browser Site Crawler & Error Handling Auditor
 * Uses puppeteer-core with a local Chrome/Edge to execute client-side rendering.
 * - Crawls recursively starting from START_URL
 * - Records URL, HTTP status, response time, content-type (from headers), parent, depth
 * - Builds hierarchical sitemap
 * - Detects 404s, records referrers, captures screenshots for problematic 404s
 * - Tests non-existent URLs at various depths
 * - Outputs JSON/CSV and screenshots under reports/crawl/
 */

import puppeteer from 'puppeteer-core';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { existsSync } from 'node:fs';

const START_URL = process.env.START_URL || 'http://localhost:3004/';
const ORIGIN = new URL(START_URL).origin;
const OUTPUT_DIR = path.resolve('reports', 'crawl');
const SCREEN_DIR = path.join(OUTPUT_DIR, 'screenshots');
const MAX_PAGES = Number(process.env.MAX_PAGES || 500);
const NAV_TIMEOUT_MS = Number(process.env.NAV_TIMEOUT_MS || 20000);

const IGNORE_PREFIXES = [
  '/_next', '/static', '/api', '/favicon.ico', '/manifest.json',
  '/polyfills-modern.js', '/polyfills-legacy.js', '/sw', '/icon.svg'
];

function normalizeUrl(u) {
  try {
    const url = new URL(u, ORIGIN);
    url.hash = '';
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.replace(/\/+$/, '');
    }
    return url.toString();
  } catch {
    return null;
  }
}

function isSameOrigin(u) { try { return new URL(u, ORIGIN).origin === ORIGIN; } catch { return false; } }
function isIgnoredPath(u) { try { const { pathname } = new URL(u, ORIGIN); return IGNORE_PREFIXES.some((p) => pathname.startsWith(p)); } catch { return true; } }
function pathFromUrl(u) { try { return new URL(u).pathname; } catch { return '/'; } }

function findBrowserExecutable() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

async function readRobots(browser) {
  try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(NAV_TIMEOUT_MS);
    // Keep JS enabled here; robots.txt is static but evaluate may need DOM
    const res = await page.goto(`${ORIGIN}/robots.txt`, { waitUntil: 'networkidle0' });
    const status = res ? res.status() : 0;
    const text = await page.evaluate(() => document.body.innerText || '');
    await page.close();
    const rules = { disallow: [], allow: [], sitemap: [] };
    if (status >= 200 && status < 400 && text) {
      for (const line of text.split(/\r?\n/)) {
        const l = line.trim();
        if (!l || l.startsWith('#')) continue;
        const m = l.match(/^(User-agent|Disallow|Allow|Sitemap):\s*(.*)$/i);
        if (m) {
          const key = m[1].toLowerCase();
          const val = m[2].trim();
          if (key === 'disallow') rules.disallow.push(val);
          else if (key === 'allow') rules.allow.push(val);
          else if (key === 'sitemap') rules.sitemap.push(val);
        }
      }
    }
    return { status, rules };
  } catch {
    return { status: 0, rules: { disallow: [], allow: [], sitemap: [] } };
  }
}

function isBlockedByRobots(pathname, robots) { return robots.disallow.some((rule) => rule && pathname.startsWith(rule)); }

async function crawl() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  await mkdir(SCREEN_DIR, { recursive: true });
  const execPath = findBrowserExecutable();
  const launchOpts = { headless: 'new' };
  if (execPath) launchOpts.executablePath = execPath;
  const browser = await puppeteer.launch(launchOpts);
  const robotsInfo = await readRobots(browser);
  const robots = robotsInfo.rules;

  const queue = [{ url: normalizeUrl(START_URL), parent: null, depth: 0 }];
  const visited = new Set();
  const pages = new Map();
  const childrenMap = new Map();
  const notFoundStats = new Map();

  while (queue.length && pages.size < MAX_PAGES) {
    const { url, parent, depth } = queue.shift();
    if (!url || visited.has(url)) continue;
    visited.add(url);

    const pathname = pathFromUrl(url);
    const blocked = isBlockedByRobots(pathname, robots);
    const ignored = isIgnoredPath(url);

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(NAV_TIMEOUT_MS);
    const start = Date.now();
    let response, status = 0, contentType = '';
    let error = null;
    try {
      response = await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('body', { timeout: NAV_TIMEOUT_MS }).catch(() => {});
      // Small delay to allow minimal hydration without full SPA navigation
      await page.waitForTimeout(200);
      status = response ? response.status() : 0;
      contentType = response ? (response.headers()['content-type'] || '') : '';
    } catch (e) {
      error = String(e);
    }
    const ms = Date.now() - start;

    const record = { url, status, ms, contentType, parent, depth, blockedByRobots: blocked, ignoredByCrawler: ignored, error };
    pages.set(url, record);
    if (parent) {
      const set = childrenMap.get(parent) || new Set();
      set.add(url);
      childrenMap.set(parent, set);
    }
    if (status === 404) {
      const stat = notFoundStats.get(url) || { count: 0, referrers: new Set() };
      stat.count += 1;
      if (parent) stat.referrers.add(parent);
      notFoundStats.set(url, stat);
    }

    if (!blocked && !ignored && status >= 200 && status < 400) {
      // Extract links after client hydration
      let links = [];
      try {
        links = await page.evaluate(() => Array.from(document.querySelectorAll('a[href]')).map(a => a.href));
      } catch (e1) {
        // Retry once if execution context was destroyed due to navigation
        await page.waitForTimeout(300);
        try {
          links = await page.evaluate(() => Array.from(document.querySelectorAll('a[href]')).map(a => a.href));
        } catch (e2) {
          links = [];
        }
      }
      for (const l of links) {
        const n = normalizeUrl(l);
        if (!n || !isSameOrigin(n) || isIgnoredPath(n)) continue;
        if (!visited.has(n)) queue.push({ url: n, parent: url, depth: depth + 1 });
      }
    }

    await page.close();
  }

  // Error handling tests with non-existent URLs
  const testUrls = [
    `${ORIGIN}/non-existent`,
    `${ORIGIN}/blog/non-existent`,
    `${ORIGIN}/blog/non-existent/p/2`,
    `${ORIGIN}/category/non-existent`,
    `${ORIGIN}/tools/non-existent`,
    `${ORIGIN}/tools/robots-txt-validator/non-existent`,
    `${ORIGIN}/blog/`,
    `${ORIGIN}/category/`,
  ].map(normalizeUrl);

  const errorHandling = [];
  for (const u of testUrls) {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(NAV_TIMEOUT_MS);
    // Keep JS disabled for error tests to avoid SPA redirects interfering with status
    await page.setJavaScriptEnabled(false);
    const start = Date.now();
    let response = null;
    let status = 0;
    let headers = {};
    try {
      response = await page.goto(u, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('body', { timeout: NAV_TIMEOUT_MS }).catch(() => {});
      await page.waitForTimeout(200);
      status = response ? response.status() : 0;
      headers = response ? response.headers() : {};
    } catch {}
    const ms = Date.now() - start;
    let has404Marker = false;
    let hasNoIndexMeta = false;
    try {
      has404Marker = await page.evaluate(() => /Page Not Found \(404\)/i.test(document.body.innerText || ''));
    } catch {}
    try {
      hasNoIndexMeta = await page.evaluate(() => !!document.querySelector('meta[name="robots"][content*="noindex"]'));
    } catch {}

    const screenshotPath = path.join(SCREEN_DIR, `error-test-${encodeURIComponent(u.replace(ORIGIN, '')) || 'root'}.png`);
    if (!(status === 404 && has404Marker && hasNoIndexMeta)) {
      await page.screenshot({ path: screenshotPath, fullPage: true });
    }
    await page.close();
    errorHandling.push({ url: u, status, ms, has404Marker, hasNoIndexMeta, headers, screenshot: !(status === 404 && has404Marker && hasNoIndexMeta) ? screenshotPath : null });
  }

  const sitemap = [];
  for (const [url, rec] of pages.entries()) {
    const children = Array.from(childrenMap.get(url) || []);
    sitemap.push({ url, parent: rec.parent, depth: rec.depth, children });
  }

  const allPages = Array.from(pages.values());
  const notFoundList = Array.from(notFoundStats.entries()).map(([url, v]) => ({ url, count: v.count, referrers: Array.from(v.referrers) }));
  const avg200 = average(allPages.filter(p => p.status === 200).map(p => p.ms));
  const avg404 = average(allPages.filter(p => p.status === 404).map(p => p.ms));

  await writeJson(path.join(OUTPUT_DIR, 'headless-results.json'), {
    meta: {
      origin: ORIGIN,
      crawledCount: allPages.length,
      maxPages: MAX_PAGES,
      robots: robots,
      avg200ms: avg200,
      avg404ms: avg404,
      generatedAt: new Date().toISOString(),
    },
    pages: allPages,
    notFound: notFoundList,
    errorHandling,
  });

  await writeJson(path.join(OUTPUT_DIR, 'headless-sitemap.json'), sitemap);
  await writeCsv(path.join(OUTPUT_DIR, 'headless-results.csv'), allPages);
  await writeJson(path.join(OUTPUT_DIR, 'headless-404-details.json'), { notFound: notFoundList, errorHandling });

  console.log(`Headless crawl completed. Pages: ${allPages.length}. Outputs in ${OUTPUT_DIR}`);
  await browser.close();
}

function average(arr) { return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0; }
async function writeJson(file, data) { await writeFile(file, JSON.stringify(data, null, 2), 'utf8'); }
async function writeCsv(file, rows) {
  const headers = ['url','status','ms','contentType','parent','depth','blockedByRobots','ignoredByCrawler','error'];
  const lines = [headers.join(',')];
  for (const r of rows) lines.push(headers.map(h => escapeCsv(r[h])).join(','));
  await writeFile(file, lines.join('\n'), 'utf8');
}
function escapeCsv(val) { if (val === undefined || val === null) return ''; const s = String(val).replace(/\r?\n/g, ' '); return /[",]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }

crawl().catch(err => { console.error('Headless crawler failed:', err); process.exitCode = 1; });