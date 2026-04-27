/**
 * Site Crawler & Error Handling Auditor
 * - Crawls the site recursively starting from START_URL
 * - Records URL, status, response time, content-type, parent, depth
 * - Builds hierarchical sitemap (parent -> children relationships)
 * - Detects 404 pages and records referrers and frequency
 * - Tests error handling with non-existent URLs at multiple directory levels
 * - Outputs JSON and CSV under reports/crawl/
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { performance } from 'node:perf_hooks';
import path from 'node:path';

const START_URL = process.env.START_URL || 'http://localhost:3004/';
const ORIGIN = new URL(START_URL).origin;
const OUTPUT_DIR = path.resolve('reports', 'crawl');
const MAX_PAGES = Number(process.env.MAX_PAGES || 300);
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 15000);

// Paths to ignore during crawl (assets and noisy endpoints)
const IGNORE_PREFIXES = [
  '/_next', '/static', '/api', '/favicon.ico', '/manifest.json',
  '/polyfills-modern.js', '/polyfills-legacy.js', '/sw', '/icon.svg'
];

// Normalize URL: remove hash, keep query for RSC cases
function normalizeUrl(u) {
  try {
    const url = new URL(u, ORIGIN);
    url.hash = '';
    // Normalize trailing slash except root
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.replace(/\/+$/, '');
    }
    return url.toString();
  } catch {
    return null;
  }
}

function isSameOrigin(u) {
  try { return new URL(u, ORIGIN).origin === ORIGIN; } catch { return false; }
}

function isIgnoredPath(u) {
  try {
    const { pathname } = new URL(u, ORIGIN);
    return IGNORE_PREFIXES.some((p) => pathname.startsWith(p));
  } catch { return true; }
}

function extractLinks(html, baseUrl) {
  const hrefs = new Set();
  const regex = /href\s*=\s*"([^"]+)"|href\s*=\s*'([^']+)'|href\s*=\s*([^\s>]+)/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const raw = match[1] || match[2] || match[3];
    if (!raw) continue;
    const trimmed = raw.trim();
    // Skip non-http, anchors, tel, mailto, javascript
    if (trimmed.startsWith('#') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:') || trimmed.startsWith('javascript:')) continue;
    try {
      const u = new URL(trimmed, baseUrl).toString();
      if (isSameOrigin(u) && !isIgnoredPath(u)) {
        hrefs.add(normalizeUrl(u));
      }
    } catch {
      // ignore malformed links
    }
  }
  return [...hrefs].filter(Boolean);
}

async function fetchWithTiming(url) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const start = performance.now();
  try {
    const res = await fetch(url, { signal: controller.signal, redirect: 'follow' });
    const ms = Math.round(performance.now() - start);
    const contentType = res.headers.get('content-type') || '';
    const text = contentType.includes('text/html') ? await res.text() : '';
    clearTimeout(t);
    return { status: res.status, ms, contentType, text, headers: Object.fromEntries(res.headers.entries()) };
  } catch (err) {
    clearTimeout(t);
    return { status: 0, ms: Math.round(performance.now() - start), contentType: '', text: '', error: String(err) };
  }
}

async function readRobots() {
  try {
    const { status, text } = await fetchWithTiming(`${ORIGIN}/robots.txt`);
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

function pathFromUrl(u) {
  try { return new URL(u).pathname; } catch { return '/'; }
}

function isBlockedByRobots(pathname, robots) {
  // Simple prefix match for Disallow
  return robots.disallow.some((rule) => rule && pathname.startsWith(rule));
}

async function crawl() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const robotsInfo = await readRobots();
  const robots = robotsInfo.rules;

  const queue = [{ url: normalizeUrl(START_URL), parent: null, depth: 0 }];
  const visited = new Set();
  const pages = new Map(); // url -> record
  const childrenMap = new Map(); // parentUrl -> Set(children)
  const notFoundStats = new Map(); // url -> { count, referrers: Set }
  const noindexPages = new Map(); // url -> reason (meta or header)
  const canonicals = new Map(); // url -> canonicalHref

  // Seed queue with sitemap entries if available in robots
  const sitemapUrls = Array.isArray(robots.sitemap) ? robots.sitemap : [];
  for (const sm of sitemapUrls) {
    try {
      const res = await fetchWithTiming(sm);
      const xml = res.text || '';
      const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/gi)].map((m) => m[1]).map(normalizeUrl).filter(Boolean);
      for (const u of locs) {
        queue.push({ url: u, parent: sm, depth: 1 });
      }
    } catch {}
  }

  while (queue.length && pages.size < MAX_PAGES) {
    const { url, parent, depth } = queue.shift();
    if (!url || visited.has(url)) continue;
    visited.add(url);

    const pathname = pathFromUrl(url);
    const blocked = isBlockedByRobots(pathname, robots);
    const isIgnored = isIgnoredPath(url);

    const result = await fetchWithTiming(url);
    const record = {
      url,
      status: result.status,
      ms: result.ms,
      contentType: result.contentType,
      parent,
      depth,
      blockedByRobots: blocked,
      ignoredByCrawler: isIgnored,
      error: result.error || null,
    };
    pages.set(url, record);

    if (parent) {
      const set = childrenMap.get(parent) || new Set();
      set.add(url);
      childrenMap.set(parent, set);
    }

    if (result.status === 404) {
      const stat = notFoundStats.get(url) || { count: 0, referrers: new Set() };
      stat.count += 1;
      if (parent) stat.referrers.add(parent);
      notFoundStats.set(url, stat);
    }

    // Parse meta robots and canonical from HTML
    if (result.text && String(result.contentType).includes('text/html')) {
      const html = result.text;
      const hasNoindexMeta = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html);
      const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
      if (hasNoindexMeta) {
        noindexPages.set(url, 'meta');
      }
      const xr = String(result.headers?.['x-robots-tag'] || result.headers?.['X-Robots-Tag'] || '').toLowerCase();
      if (xr.includes('noindex')) {
        noindexPages.set(url, noindexPages.get(url) ? noindexPages.get(url) + '+header' : 'header');
      }
      if (canonicalMatch && canonicalMatch[1]) {
        try {
          const cHref = new URL(canonicalMatch[1], url).toString();
          canonicals.set(url, cHref);
        } catch {}
      }
    }

    // Enqueue discovered links from HTML pages when not blocked/ignored
    if (result.text && String(result.contentType).includes('text/html') && !blocked && !isIgnored) {
      const links = extractLinks(result.text, url);
      for (const link of links) {
        if (!visited.has(link) && isSameOrigin(link)) {
          queue.push({ url: link, parent: url, depth: depth + 1 });
        }
      }
    }
  }

  // Error handling tests for non-existent URLs
  const testUrls = [
    `${ORIGIN}/non-existent`,
    `${ORIGIN}/blog/non-existent`,
    `${ORIGIN}/blog/non-existent/p/2`,
    `${ORIGIN}/category/non-existent`,
    `${ORIGIN}/tools/non-existent`,
    `${ORIGIN}/tools/robots-txt-validator/non-existent`,
    `${ORIGIN}/blog/`, // trailing slash
    `${ORIGIN}/category/`,
  ].map(normalizeUrl);

  const errorHandling = [];
  for (const u of testUrls) {
    const res = await fetchWithTiming(u);
    const html = res.text || '';
    const has404Marker = /Page Not Found \(404\)/i.test(html);
    const hasNoIndexMeta = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html);
    errorHandling.push({
      url: u,
      status: res.status,
      ms: res.ms,
      has404Marker,
      hasNoIndexMeta,
      headers: res.headers,
    });
  }

  // Build hierarchical sitemap structure
  const sitemap = [];
  for (const [url, rec] of pages.entries()) {
    const children = Array.from(childrenMap.get(url) || []);
    sitemap.push({ url, parent: rec.parent, depth: rec.depth, children });
  }

  // Outputs
  const allPages = Array.from(pages.values());
  const notFoundList = Array.from(notFoundStats.entries()).map(([url, v]) => ({ url, count: v.count, referrers: Array.from(v.referrers) }));

  // Aggregate metrics
  const avg200 = average(allPages.filter(p => p.status === 200).map(p => p.ms));
  const avg404 = average(allPages.filter(p => p.status === 404).map(p => p.ms));

  await writeJson(path.join(OUTPUT_DIR, 'results.json'), {
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
    noindex: Array.from(noindexPages.entries()).map(([url, reason]) => ({ url, reason })),
    canonicals: Array.from(canonicals.entries()).map(([url, canonical]) => ({ url, canonical })),
  });

  await writeJson(path.join(OUTPUT_DIR, 'sitemap.json'), sitemap);
  await writeCsv(path.join(OUTPUT_DIR, 'results.csv'), allPages);
  await writeJson(path.join(OUTPUT_DIR, '404-details.json'), { notFound: notFoundList });
  await writeJson(path.join(OUTPUT_DIR, 'indexing-health.json'), {
    meta: { origin: ORIGIN, generatedAt: new Date().toISOString() },
    counts: {
      total: allPages.length,
      notFound: notFoundList.length,
      noindex: noindexPages.size,
      canonicals: canonicals.size,
    },
    sample: {
      notFound: notFoundList.slice(0, 10),
      noindex: Array.from(noindexPages.entries()).slice(0, 10).map(([url, reason]) => ({ url, reason })),
      canonicals: Array.from(canonicals.entries()).slice(0, 10).map(([url, canonical]) => ({ url, canonical })),
    }
  });

  console.log(`Crawl completed. Pages: ${allPages.length}. Outputs in ${OUTPUT_DIR}`);
}

function average(arr) { return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0; }

async function writeJson(file, data) {
  const content = JSON.stringify(data, null, 2);
  await writeFile(file, content, 'utf8');
}

async function writeCsv(file, rows) {
  const headers = ['url','status','ms','contentType','parent','depth','blockedByRobots','ignoredByCrawler','error'];
  const lines = [headers.join(',')];
  for (const r of rows) {
    const vals = headers.map(h => escapeCsv(r[h]));
    lines.push(vals.join(','));
  }
  await writeFile(file, lines.join('\n'), 'utf8');
}

function escapeCsv(val) {
  if (val === undefined || val === null) return '';
  const s = String(val).replace(/\r?\n/g, ' ');
  return /[",]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

crawl().catch(err => {
  console.error('Crawler failed:', err);
  process.exitCode = 1;
});
