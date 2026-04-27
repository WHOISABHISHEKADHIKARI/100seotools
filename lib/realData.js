import { getBaseUrl } from './site';

// Shared real-data utilities for SEO tools.
// Uses only FREE, no-key public endpoints.
// Pattern: every helper returns { ok, data, error } so callers can compose safely.

const baseUrl = getBaseUrl();
const UA = `Mozilla/5.0 (compatible; 100SEOToolsBot/1.0; +${baseUrl})`;
const DEFAULT_TIMEOUT = 8000;

export function normalizeUrl(input) {
  if (!input) return null;
  const s = String(input).trim();
  if (!s) return null;
  try {
    const u = new URL(s.startsWith('http') ? s : 'https://' + s);
    return u.toString();
  } catch {
    return null;
  }
}

export function hostnameOf(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return null; }
}

export async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: { 'User-Agent': UA, ...(options.headers || {}) }
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

// Fetch HTML and basic response metadata for any URL.
export async function fetchPage(url, { method = 'GET', timeoutMs = DEFAULT_TIMEOUT, maxBytes = 1_500_000 } = {}) {
  const target = normalizeUrl(url);
  if (!target) return { ok: false, error: 'Invalid URL' };
  const t0 = Date.now();
  try {
    const res = await fetchWithTimeout(target, { method, redirect: 'follow' }, timeoutMs);
    const elapsedMs = Date.now() - t0;
    const headers = Object.fromEntries(res.headers.entries());
    let html = '';
    let bytes = 0;
    if (method === 'GET') {
      const text = await res.text();
      bytes = new TextEncoder().encode(text).length;
      html = bytes > maxBytes ? text.slice(0, maxBytes) : text;
    } else {
      bytes = parseInt(headers['content-length'] || '0', 10) || 0;
    }
    return {
      ok: true,
      data: {
        finalUrl: res.url || target,
        status: res.status,
        statusText: res.statusText,
        headers,
        elapsedMs,
        bytes,
        html,
        contentType: headers['content-type'] || ''
      }
    };
  } catch (err) {
    return { ok: false, error: err.name === 'AbortError' ? 'Request timed out' : (err.message || 'Fetch failed') };
  }
}

// Lightweight HTML parser using regex — sufficient for SEO surface signals.
export function parseHtmlMeta(html, baseUrl = '') {
  const get = (re) => { const m = html.match(re); return m ? (m[1] || '').trim() : ''; };
  const all = (re) => { const out = []; let m; while ((m = re.exec(html)) !== null) out.push(m); return out; };

  const title = get(/<title[^>]*>([\s\S]*?)<\/title>/i)
    .replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const metaDescription = get(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)
    || get(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const metaKeywords = get(/<meta[^>]+name=["']keywords["'][^>]*content=["']([^"']*)["']/i);
  const canonical = get(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)
    || get(/<link[^>]+href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
  const robots = get(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']*)["']/i);
  const viewport = get(/<meta[^>]+name=["']viewport["'][^>]*content=["']([^"']*)["']/i);
  const charset = get(/<meta[^>]+charset=["']?([^"'>\s]+)/i);
  const lang = get(/<html[^>]+lang=["']([^"']*)["']/i);

  const ogTags = {};
  for (const m of all(/<meta[^>]+property=["']og:([^"']+)["'][^>]*content=["']([^"']*)["']/gi)) {
    ogTags[m[1]] = m[2];
  }
  const twitterTags = {};
  for (const m of all(/<meta[^>]+name=["']twitter:([^"']+)["'][^>]*content=["']([^"']*)["']/gi)) {
    twitterTags[m[1]] = m[2];
  }

  const headings = { h1: [], h2: [], h3: [], h4: [], h5: [], h6: [] };
  for (const m of all(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const tag = m[1].toLowerCase();
    const text = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (text) headings[tag].push(text);
  }

  const links = [];
  for (const m of all(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = m[1];
    const text = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    let absolute = href;
    try { absolute = new URL(href, baseUrl || undefined).toString(); } catch { /* keep raw */ }
    let host = '';
    try { host = new URL(absolute).hostname; } catch { /* relative or invalid */ }
    links.push({ href, absolute, text, host, isAnchor: href.startsWith('#'), isMailto: href.startsWith('mailto:') });
  }

  const images = [];
  for (const m of all(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)) {
    const src = m[1];
    const altMatch = m[0].match(/alt=["']([^"']*)["']/i);
    const alt = altMatch ? altMatch[1] : null;
    images.push({ src, alt, hasAlt: alt !== null });
  }

  const jsonLd = [];
  for (const m of all(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const raw = m[1].trim();
    try { jsonLd.push(JSON.parse(raw)); } catch { jsonLd.push({ _parseError: true, _raw: raw.slice(0, 500) }); }
  }

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;

  return {
    title, metaDescription, metaKeywords, canonical, robots, viewport, charset, lang,
    ogTags, twitterTags, headings, links, images, jsonLd, text, wordCount
  };
}

// Google Suggest — free, no key, returns autocomplete list.
export async function googleSuggest(query, { hl = 'en', gl = 'US' } = {}) {
  if (!query) return { ok: false, error: 'query required' };
  try {
    const url = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}&hl=${hl}&gl=${gl}`;
    const res = await fetchWithTimeout(url, {}, 5000);
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const data = await res.json();
    return { ok: true, data: Array.isArray(data?.[1]) ? data[1] : [] };
  } catch (err) {
    return { ok: false, error: err.message || 'Suggest fetch failed' };
  }
}

// Google PageSpeed Insights v5 — free, no key required for low rate.
// Returns real Lighthouse scores and Core Web Vitals.
export async function pageSpeedInsights(url, { strategy = 'mobile', categories = ['performance'], timeoutMs = 30000 } = {}) {
  const target = normalizeUrl(url);
  if (!target) return { ok: false, error: 'Invalid URL' };
  const params = new URLSearchParams();
  params.set('url', target);
  params.set('strategy', strategy);
  for (const c of categories) params.append('category', c);
  const apiKey = process.env.PAGESPEED_API_KEY || process.env.GOOGLE_API_KEY;
  if (apiKey) params.set('key', apiKey);
  try {
    const res = await fetchWithTimeout(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`,
      {}, timeoutMs
    );
    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      return { ok: false, error: `PSI HTTP ${res.status}: ${errText.slice(0, 200)}` };
    }
    const json = await res.json();
    const lh = json?.lighthouseResult || {};
    const cats = lh.categories || {};
    const audits = lh.audits || {};
    const pick = (id) => audits[id]?.displayValue || audits[id]?.numericValue || null;
    return {
      ok: true,
      data: {
        finalUrl: lh.finalUrl || target,
        strategy,
        scores: {
          performance: cats.performance ? Math.round(cats.performance.score * 100) : null,
          accessibility: cats.accessibility ? Math.round(cats.accessibility.score * 100) : null,
          'best-practices': cats['best-practices'] ? Math.round(cats['best-practices'].score * 100) : null,
          seo: cats.seo ? Math.round(cats.seo.score * 100) : null
        },
        metrics: {
          firstContentfulPaint: pick('first-contentful-paint'),
          largestContentfulPaint: pick('largest-contentful-paint'),
          totalBlockingTime: pick('total-blocking-time'),
          cumulativeLayoutShift: pick('cumulative-layout-shift'),
          speedIndex: pick('speed-index'),
          interactive: pick('interactive')
        },
        opportunities: Object.values(audits)
          .filter((a) => a?.details?.type === 'opportunity' && a.score !== null && a.score < 0.9)
          .map((a) => ({ id: a.id, title: a.title, displayValue: a.displayValue || '' }))
          .slice(0, 8)
      }
    };
  } catch (err) {
    return { ok: false, error: err.name === 'AbortError' ? 'PSI timed out' : (err.message || 'PSI failed') };
  }
}

// Wayback Machine — free, no key. Returns earliest snapshot for domain age proxy.
export async function waybackFirstSnapshot(url) {
  const target = normalizeUrl(url);
  if (!target) return { ok: false, error: 'Invalid URL' };
  const host = hostnameOf(target);

  // Strategy 1: CDX API — gives the truly first snapshot (most reliable for popular sites).
  try {
    const cdx = await fetchWithTimeout(
      `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(host)}&output=json&limit=1&from=19960101&filter=statuscode:200`,
      { headers: { 'User-Agent': '100SEOTools/1.0' } }, 9000
    );
    if (cdx.ok) {
      const arr = await cdx.json().catch(() => null);
      if (Array.isArray(arr) && arr.length >= 2) {
        const ts = arr[1][1]; // [fields..., [timestamp, original, ...]]
        if (ts && ts.length >= 8) {
          const date = new Date(Date.UTC(+ts.slice(0, 4), +ts.slice(4, 6) - 1, +ts.slice(6, 8)));
          const ageYears = Math.round(((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25)) * 10) / 10;
          return { ok: true, data: { firstSeen: date.toISOString().slice(0, 10), ageYears, snapshotUrl: `https://web.archive.org/web/${ts}/${arr[1][2]}` } };
        }
      }
    }
  } catch { /* fall through */ }

  // Strategy 2: availability API with full URL (some hosts only respond when a scheme is provided).
  try {
    const res = await fetchWithTimeout(
      `https://archive.org/wayback/available?url=${encodeURIComponent(target)}&timestamp=19960101`,
      { headers: { 'User-Agent': '100SEOTools/1.0' } }, 8000
    );
    if (!res.ok) return { ok: false, error: `Wayback HTTP ${res.status}` };
    const json = await res.json();
    const snap = json?.archived_snapshots?.closest;
    if (!snap?.timestamp) return { ok: true, data: { firstSeen: null, ageYears: null } };
    const ts = snap.timestamp;
    const date = new Date(Date.UTC(+ts.slice(0, 4), +ts.slice(4, 6) - 1, +ts.slice(6, 8)));
    const ageYears = Math.round(((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25)) * 10) / 10;
    return { ok: true, data: { firstSeen: date.toISOString().slice(0, 10), ageYears, snapshotUrl: snap.url } };
  } catch (err) {
    return { ok: false, error: err.message || 'Wayback failed' };
  }
}

// Google Trends daily-trending RSS — free, no key. Returns trending topics for a country.
export async function googleTrendsDaily({ geo = 'US' } = {}) {
  try {
    const res = await fetchWithTimeout(
      `https://trends.google.com/trending/rss?geo=${encodeURIComponent(geo)}`,
      {}, 8000
    );
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const xml = await res.text();
    const items = [];
    const itemRe = /<item>([\s\S]*?)<\/item>/g;
    let m;
    while ((m = itemRe.exec(xml)) !== null) {
      const block = m[1];
      const title = (block.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/) || [])[1]?.trim() || '';
      const traffic = (block.match(/<ht:approx_traffic>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/ht:approx_traffic>/) || [])[1]?.trim() || '';
      const news = (block.match(/<ht:news_item_title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/ht:news_item_title>/) || [])[1]?.trim() || '';
      if (title) items.push({ title, traffic, news });
    }
    return { ok: true, data: items.slice(0, 25) };
  } catch (err) {
    return { ok: false, error: err.message || 'Trends fetch failed' };
  }
}

// DuckDuckGo HTML SERP — free, no key. Lightweight result extraction.
// Tries the lite endpoint (more stable) then html endpoint.
export async function ddgSearch(query, { maxResults = 10 } = {}) {
  if (!query) return { ok: false, error: 'query required' };
  const ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
  const endpoints = [
    `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
    `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
    `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`
  ];
  for (const ep of endpoints) {
    try {
      const res = await fetchWithTimeout(ep, {
        headers: {
          'User-Agent': ua,
          Accept: 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      }, 12000);
      if (!res.ok) continue;
      const html = await res.text();
      const results = [];
      // Pattern A: result__a class anchor
      const reA = /<a[^>]+class="[^"]*result__a[^"]*"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
      let m;
      while ((m = reA.exec(html)) !== null && results.length < maxResults) {
        let url = m[1];
        try {
          const u = new URL(url, 'https://duckduckgo.com/');
          const real = u.searchParams.get('uddg');
          if (real) url = decodeURIComponent(real);
        } catch { /* keep */ }
        const title = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
        if (title && /^https?:/.test(url)) results.push({ title, url });
      }
      // Pattern B (lite endpoint): plain anchors with uddg redirect, in <a>...
      if (!results.length) {
        const reB = /<a[^>]+href="(\/l\/\?[^"]*uddg=[^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
        while ((m = reB.exec(html)) !== null && results.length < maxResults) {
          try {
            const u = new URL(m[1], 'https://duckduckgo.com/');
            const real = u.searchParams.get('uddg');
            if (!real) continue;
            const url = decodeURIComponent(real);
            const title = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
            if (title && /^https?:/.test(url)) results.push({ title, url });
          } catch { /* skip */ }
        }
      }
      // Pattern C (lite endpoint): direct https links inside results table
      if (!results.length) {
        const reC = /<a[^>]+href="(https?:\/\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
        while ((m = reC.exec(html)) !== null && results.length < maxResults) {
          const url = m[1];
          if (url.includes('duckduckgo.com')) continue;
          const title = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
          if (title && title.length > 5) results.push({ title, url });
        }
      }
      if (results.length) return { ok: true, data: results };
    } catch { /* try next */ }
  }
  return { ok: false, error: 'DDG returned no parseable results' };
}

// Validate robots.txt by fetching the real file.
export async function fetchRobotsTxt(siteUrl) {
  const target = normalizeUrl(siteUrl);
  if (!target) return { ok: false, error: 'Invalid URL' };
  try {
    const u = new URL(target);
    const robotsUrl = `${u.protocol}//${u.host}/robots.txt`;
    const res = await fetchWithTimeout(robotsUrl, {}, 6000);
    const body = await res.text().catch(() => '');
    return { ok: true, data: { url: robotsUrl, status: res.status, body } };
  } catch (err) {
    return { ok: false, error: err.message || 'robots.txt fetch failed' };
  }
}

// Fetch sitemap.xml or sitemap-index and list URLs.
export async function fetchSitemap(siteUrl) {
  const target = normalizeUrl(siteUrl);
  if (!target) return { ok: false, error: 'Invalid URL' };
  try {
    const u = new URL(target);
    const sitemapUrl = `${u.protocol}//${u.host}/sitemap.xml`;
    const res = await fetchWithTimeout(sitemapUrl, {}, 8000);
    if (!res.ok) return { ok: true, data: { url: sitemapUrl, status: res.status, urls: [] } };
    const xml = await res.text();
    const urls = [];
    const re = /<loc>([\s\S]*?)<\/loc>/g;
    let m;
    while ((m = re.exec(xml)) !== null) {
      urls.push(m[1].trim());
    }
    return { ok: true, data: { url: sitemapUrl, status: res.status, urls } };
  } catch (err) {
    return { ok: false, error: err.message || 'sitemap fetch failed' };
  }
}

// Follow redirect chain (manual) — useful for redirect checker / 301 audits.
export async function followRedirects(url, { maxHops = 10, timeoutMs = 6000 } = {}) {
  let current = normalizeUrl(url);
  if (!current) return { ok: false, error: 'Invalid URL' };
  const chain = [];
  for (let i = 0; i < maxHops; i++) {
    try {
      const res = await fetchWithTimeout(current, { method: 'HEAD', redirect: 'manual' }, timeoutMs);
      const status = res.status;
      const location = res.headers.get('location');
      chain.push({ url: current, status });
      if (status >= 300 && status < 400 && location) {
        try { current = new URL(location, current).toString(); } catch { break; }
        continue;
      }
      break;
    } catch (err) {
      chain.push({ url: current, status: 0, error: err.message });
      break;
    }
  }
  return { ok: true, data: { hops: chain.length, chain, finalUrl: chain[chain.length - 1]?.url || current } };
}

export const __test = { UA, DEFAULT_TIMEOUT };
