import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import tls from 'node:tls';
import { jsPDF } from 'jspdf';

const ORIGIN = process.env.START_URL || 'https://www.100seotools.com/';
const MAX_PAGES = Number(process.env.MAX_PAGES || 300);
const TIMEOUT_MS = Number(process.env.TIMEOUT_MS || 15000);
const CONCURRENCY = Number(process.env.CONCURRENCY || 3);
const REQUEST_DELAY_MS = Number(process.env.REQUEST_DELAY_MS || 250);

const REPORTS_ROOT = path.resolve('docs', 'Reports');
const SUBFOLDERS = {
  Structure: path.join(REPORTS_ROOT, 'Structure'),
  Content: path.join(REPORTS_ROOT, 'Content'),
  SEO: path.join(REPORTS_ROOT, 'SEO'),
  Performance: path.join(REPORTS_ROOT, 'Performance'),
  Security: path.join(REPORTS_ROOT, 'Security'),
  Summary: path.join(REPORTS_ROOT, 'Summary'),
  Errors: path.join(REPORTS_ROOT, 'Errors'),
};

function nowStamp() {
  const d = new Date();
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const HH = String(d.getHours()).padStart(2, '0');
  const MM = String(d.getMinutes()).padStart(2, '0');
  const SS = String(d.getSeconds()).padStart(2, '0');
  return `${yyyy}${mm}${dd}_${HH}${MM}${SS}`;
}

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

function isSameOrigin(u) {
  try { return new URL(u, ORIGIN).origin === new URL(ORIGIN).origin; } catch { return false; }
}

const IGNORE_PREFIXES = ['/\\_next', '/static', '/api', '/favicon.ico', '/manifest.json'];
function isIgnoredPath(u) {
  try {
    const { pathname } = new URL(u, ORIGIN);
    return IGNORE_PREFIXES.some((p) => pathname.startsWith(p));
  } catch { return true; }
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
    const { status, text } = await fetchWithTiming(new URL('/robots.txt', ORIGIN).toString());
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

function pathFromUrl(u) { try { return new URL(u).pathname; } catch { return '/'; } }
function isBlockedByRobots(pathname, robots) { return robots.disallow.some((rule) => rule && pathname.startsWith(rule)); }

function extractLinks(html, baseUrl) {
  const hrefs = new Set();
  const regex = /href\s*=\s*"([^"]+)"|href\s*=\s*'([^']+)'|href\s*=\s*([^\s>]+)/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const raw = match[1] || match[2] || match[3];
    if (!raw) continue;
    const trimmed = raw.trim();
    if (trimmed.startsWith('#') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:') || trimmed.startsWith('javascript:')) continue;
    try {
      const u = new URL(trimmed, baseUrl).toString();
      if (isSameOrigin(u) && !isIgnoredPath(u)) {
        hrefs.add(normalizeUrl(u));
      }
    } catch {}
  }
  return [...hrefs].filter(Boolean);
}

function simpleTextStats(html) {
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean);
  const stop = new Set(['the','and','a','an','of','to','in','is','for','on','with','by','at','from','it','this','that']);
  const freq = new Map();
  for (const w of words) {
    const k = w.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!k || stop.has(k)) continue;
    freq.set(k, (freq.get(k) || 0) + 1);
  }
  const sorted = Array.from(freq.entries()).sort((a,b) => b[1]-a[1]).slice(0, 15);
  return { wordCount: words.length, topTerms: sorted.map(([t,c]) => ({ term: t, count: c, density: Number((c/words.length).toFixed(4)) })) };
}

function extractSEO(html) {
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i);
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
  const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
  const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;
  const textStats = simpleTextStats(html);
  return {
    title: titleMatch ? titleMatch[1].trim() : '',
    titleLength: titleMatch ? titleMatch[1].trim().length : 0,
    metaDescription: descMatch ? descMatch[1].trim() : '',
    metaDescriptionLength: descMatch ? descMatch[1].trim().length : 0,
    robotsMeta: robotsMatch ? robotsMatch[1].trim() : '',
    canonicalUrl: canonicalMatch ? canonicalMatch[1].trim() : '',
    h1Count, h2Count, h3Count,
    wordCount: textStats.wordCount,
    topTerms: textStats.topTerms,
  };
}

function extractContentInventory(html) {
  const images = Array.from(html.matchAll(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi)).map(m => m[1]);
  const imgNoAlt = Array.from(html.matchAll(/<img\b[^>]*((?:(?!alt=).)*)>/gi)).length - Array.from(html.matchAll(/<img\b[^>]*alt=["'][^"']+["']/gi)).length;
  const videos = Array.from(html.matchAll(/<video\b[^>]*src=["']([^"']+)["'][^>]*>|<source\b[^>]*src=["']([^"']+)["'][^>]*>/gi)).map(m => m[1] || m[2]).filter(Boolean);
  const audios = Array.from(html.matchAll(/<audio\b[^>]*src=["']([^"']+)["'][^>]*>|<source\b[^>]*src=["']([^"']+)["'][^>]*>/gi)).map(m => m[1] || m[2]).filter(Boolean);
  return { imageCount: images.length, images, imagesMissingAlt: Math.max(0, imgNoAlt), videoCount: videos.length, videos, audioCount: audios.length, audios };
}

async function checkSSL(hostname) {
  return new Promise((resolve) => {
    try {
      const port = 443;
      const socket = tls.connect({ host: hostname, port, servername: hostname, rejectUnauthorized: false }, () => {
        const cert = socket.getPeerCertificate();
        const validTo = cert.valid_to || '';
        const validFrom = cert.valid_from || '';
        const issuer = cert.issuer ? JSON.stringify(cert.issuer) : '';
        socket.end();
        resolve({ ok: !!cert, validFrom, validTo, issuer });
      });
      socket.on('error', (err) => resolve({ ok: false, error: String(err) }));
    } catch (err) {
      resolve({ ok: false, error: String(err) });
    }
  });
}

async function run() {
  for (const k of Object.values(SUBFOLDERS)) {
    await mkdir(k, { recursive: true });
  }
  const stamp = nowStamp();
  const errors = [];

  const robotsInfo = await readRobots();
  const robots = robotsInfo.rules;

  const queue = [{ url: normalizeUrl(ORIGIN), parent: null, depth: 0 }];
  const visited = new Set();
  const pages = new Map();
  const childrenMap = new Map();

  let running = 0;
  async function processNext() {
    if (!queue.length || pages.size >= MAX_PAGES) return;
    const { url, parent, depth } = queue.shift();
    if (!url || visited.has(url)) return;
    visited.add(url);
    running += 1;
    try {
      const pathname = pathFromUrl(url);
      const blocked = isBlockedByRobots(pathname, robots);
      const ignored = isIgnoredPath(url);
      const result = await fetchWithTiming(url);
      const record = {
        url, status: result.status, ms: result.ms, contentType: result.contentType,
        parent, depth, blockedByRobots: blocked, ignoredByCrawler: ignored,
        error: result.error || null,
      };
      pages.set(url, record);
      if (parent) {
        const set = childrenMap.get(parent) || new Set();
        set.add(url);
        childrenMap.set(parent, set);
      }

      if (result.text && String(result.contentType).includes('text/html') && !blocked && !ignored) {
        const links = extractLinks(result.text, url);
        for (const link of links) {
          if (!visited.has(link) && isSameOrigin(link)) {
            queue.push({ url: link, parent: url, depth: depth + 1 });
          }
        }
      }
    } catch (err) {
      errors.push({ url, error: String(err) });
    } finally {
      running -= 1;
      await new Promise(r => setTimeout(r, REQUEST_DELAY_MS));
    }
  }

  while ((queue.length && pages.size < MAX_PAGES) || running > 0) {
    while (running < CONCURRENCY && queue.length && pages.size < MAX_PAGES) {
      processNext();
    }
    await new Promise(r => setTimeout(r, 50));
  }

  const sitemap = [];
  for (const [url, rec] of pages.entries()) {
    const children = Array.from(childrenMap.get(url) || []);
    sitemap.push({ url, parent: rec.parent, depth: rec.depth, children });
  }

  const htmlPages = Array.from(pages.values()).filter(p => p.contentType.includes('text/html'));
  const contentReports = [];
  const seoReports = [];
  const perfReports = [];

  for (const p of htmlPages) {
    const html = (await fetchWithTiming(p.url)).text || '';
    const contentInv = extractContentInventory(html);
    const seo = extractSEO(html);
    contentReports.push({ url: p.url, ...contentInv });
    seoReports.push({ url: p.url, ...seo });
    perfReports.push({ url: p.url, responseMs: p.ms, status: p.status });
    await new Promise(r => setTimeout(r, REQUEST_DELAY_MS));
  }

  const hostname = new URL(ORIGIN).hostname;
  const sslInfo = await checkSSL(hostname);
  const securityHeadersSamples = [];
  for (const p of htmlPages.slice(0, 50)) {
    securityHeadersSamples.push({ url: p.url, headers: p.headers });
  }

  async function writeCsv(file, rows, headers) {
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

  function writePdf(file, title, sections) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    let y = 40;
    doc.setFontSize(16);
    doc.text(title, 40, y);
    y += 24;
    doc.setFontSize(10);
    for (const s of sections) {
      doc.text(s, 40, y);
      y += 14;
      if (y > 780) { doc.addPage(); y = 40; }
    }
    const buf = doc.output('arraybuffer');
    return writeFile(file, Buffer.from(buf));
  }

  const meta = { origin: ORIGIN, maxPages: MAX_PAGES, generatedAt: new Date().toISOString(), robots: robots };
  const stampName = nowStamp();

  await writeFile(path.join(SUBFOLDERS.Structure, `Structure_${stampName}.csv`), 'url,parent,depth,children\n' + sitemap.map(s => [escapeCsv(s.url), escapeCsv(s.parent), s.depth, escapeCsv((s.children||[]).join(' '))].join(',')).join('\n'), 'utf8');
  await writePdf(path.join(SUBFOLDERS.Structure, `Structure_${stampName}.pdf`), 'Website Structure', [
    `Origin: ${ORIGIN}`,
    `Pages crawled: ${pages.size}`,
    `Includes hierarchy and children relationships`,
  ]);

  await writeCsv(path.join(SUBFOLDERS.Content, `Content_${stampName}.csv`), contentReports, ['url','imageCount','imagesMissingAlt','videoCount','audioCount','images','videos','audios']);
  await writePdf(path.join(SUBFOLDERS.Content, `Content_${stampName}.pdf`), 'Content Inventory', [
    `Origin: ${ORIGIN}`,
    `HTML pages: ${htmlPages.length}`,
    `Images total: ${contentReports.reduce((a,b)=>a+b.imageCount,0)}`,
  ]);

  await writeCsv(path.join(SUBFOLDERS.SEO, `SEO_${stampName}.csv`), seoReports, ['url','title','titleLength','metaDescription','metaDescriptionLength','robotsMeta','canonicalUrl','h1Count','h2Count','h3Count','wordCount','topTerms']);
  await writePdf(path.join(SUBFOLDERS.SEO, `SEO_${stampName}.pdf`), 'SEO Metrics', [
    `Origin: ${ORIGIN}`,
    `Pages with H1: ${seoReports.filter(r=>r.h1Count>0).length}`,
    `Pages missing meta description: ${seoReports.filter(r=>!r.metaDescription).length}`,
  ]);

  await writeCsv(path.join(SUBFOLDERS.Performance, `Performance_${stampName}.csv`), perfReports, ['url','status','responseMs']);
  await writePdf(path.join(SUBFOLDERS.Performance, `Performance_${stampName}.pdf`), 'Performance Assessment', [
    `Origin: ${ORIGIN}`,
    `Avg response (200): ${avg(pages,200)} ms`,
    `Avg response (404): ${avg(pages,404)} ms`,
  ]);

  const securityCsvRows = [{ url: ORIGIN, sslOk: sslInfo.ok, validFrom: sslInfo.validFrom || '', validTo: sslInfo.validTo || '', issuer: sslInfo.issuer || '', error: sslInfo.error || '' }];
  await writeCsv(path.join(SUBFOLDERS.Security, `Security_${stampName}.csv`), securityCsvRows, ['url','sslOk','validFrom','validTo','issuer','error']);
  const secHeadersSummary = [
    `Origin: ${ORIGIN}`,
    `SSL OK: ${sslInfo.ok}`,
    `Valid From: ${sslInfo.validFrom || 'n/a'}`,
    `Valid To: ${sslInfo.validTo || 'n/a'}`,
  ];
  await writePdf(path.join(SUBFOLDERS.Security, `Security_${stampName}.pdf`), 'Security Checks', secHeadersSummary);

  const summaryLines = [
    `Scan meta: ${JSON.stringify(meta)}`,
    `Structure pages: ${pages.size}`,
    `Content pages: ${htmlPages.length}`,
    `SEO pages: ${seoReports.length}`,
    `Errors: ${errors.length}`,
  ];
  await writeFile(path.join(SUBFOLDERS.Summary, `Summary_${stampName}.csv`), 'metric,value\n' + summaryLines.map((l,i)=>`line${i+1},${escapeCsv(l)}`).join('\n'), 'utf8');
  await writePdf(path.join(SUBFOLDERS.Summary, `Summary_${stampName}.pdf`), 'Scan Summary', summaryLines);

  if (errors.length) {
    await writeFile(path.join(SUBFOLDERS.Errors, `ScanErrors_${stampName}.csv`), 'url,error\n' + errors.map(e => `${escapeCsv(e.url)},${escapeCsv(e.error)}`).join('\n'), 'utf8');
  }
}

function avg(pagesMap, statusCode) {
  const arr = Array.from(pagesMap.values()).filter(p => p.status === statusCode).map(p => p.ms);
  if (!arr.length) return 0;
  return Math.round(arr.reduce((a,b)=>a+b,0) / arr.length);
}

run().catch(err => {
  const stamp = nowStamp();
  const errFile = path.join(SUBFOLDERS.Errors, `ScanErrors_${stamp}.csv`);
  mkdir(path.dirname(errFile), { recursive: true }).then(() => {
    writeFile(errFile, `error\n${escapeCsv(String(err))}`);
  }).finally(() => {
    console.error('Site scanner failed:', err);
    process.exit(1);
  });
});
