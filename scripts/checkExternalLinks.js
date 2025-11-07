/**
 * External link checker for 100 SEO Tools
 * - Scans project files for external URLs (http/https)
 * - Performs HEAD requests to validate reachability and status codes
 * - Skips mailto:, tel:, and internal relative links
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGET_DIRS = [path.join(ROOT, 'app'), path.join(ROOT, 'components')];
const HTTP_REGEX = /(href|src)=["'](https?:\/\/[^"']+)["']/gi;
const HEAD_BLOCKERS = [
  'facebook.com',
  'www.facebook.com',
  'm.facebook.com',
  'instagram.com',
  'www.instagram.com'
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(full));
    else if (/\.(js|jsx|ts|tsx)$/.test(e.name)) files.push(full);
  }
  return files;
}

function collectExternalUrls() {
  const urls = new Set();
  for (const dir of TARGET_DIRS) {
    if (!fs.existsSync(dir)) continue;
    for (const file of walk(dir)) {
      const content = fs.readFileSync(file, 'utf8');
      let match;
      while ((match = HTTP_REGEX.exec(content)) !== null) {
        const url = match[2];
        // exclude localhost, same-site examples, and analytics placeholders
        if (/localhost|127\.0\.0\.1/.test(url)) continue;
        urls.add(url);
      }
    }
  }
  return Array.from(urls);
}

async function checkUrl(url, signal) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal });
    if (res.ok) return { url, ok: true, status: res.status, finalUrl: res.url, method: 'HEAD' };
    // Fallback for providers that reject HEAD
    const hostname = new URL(url).hostname;
    if (HEAD_BLOCKERS.includes(hostname) || res.status >= 400) {
      const resGet = await fetch(url, { method: 'GET', redirect: 'follow', signal, headers: { 'Accept': 'text/html' } });
      return { url, ok: resGet.ok, status: resGet.status, finalUrl: resGet.url, method: 'GET' };
    }
    return { url, ok: false, status: res.status, finalUrl: res.url, method: 'HEAD' };
  } catch (err) {
    return { url, ok: false, status: 0, error: String(err.message || err) };
  }
}

async function main() {
  const urls = collectExternalUrls();
  console.log(`Found ${urls.length} external URLs to check...`);
  urls.forEach(u => console.log(`- checking: ${u}`));

  const controller = new AbortController();
  const { signal } = controller;
  const results = [];
  const BATCH = 10;
  for (let i = 0; i < urls.length; i += BATCH) {
    const batch = urls.slice(i, i + BATCH);
    const settled = await Promise.allSettled(batch.map((u) => checkUrl(u, signal)));
    for (const s of settled) {
      if (s.status === 'fulfilled') results.push(s.value);
      else results.push({ url: batch[results.length], ok: false, status: 0, error: String(s.reason || 'Unknown') });
    }
  }

  const ignorable = results.filter((r) => {
    try {
      const host = new URL(r.url).hostname;
      return HEAD_BLOCKERS.includes(host) && r.status >= 400;
    } catch {
      return false;
    }
  });
  const failures = results.filter((r) => !r.ok && !ignorable.includes(r));
  if (failures.length) {
    console.log(`\nBroken external links (${failures.length}):`);
    for (const f of failures) {
      console.log(`- ${f.url} -> status: ${f.status}${f.method ? ` via ${f.method}` : ''}${f.error ? ` error: ${f.error}` : ''}`);
    }
    process.exitCode = 1;
  } else {
    console.log('\nAll external links responded OK');
  }
  if (ignorable.length) {
    console.log(`\nIgnored known HEAD/GET blockers (${ignorable.length}):`);
    for (const ig of ignorable) {
      console.log(`- ${ig.url} -> status: ${ig.status}${ig.method ? ` via ${ig.method}` : ''}`);
    }
  }
}

main().catch((e) => {
  console.error('Link check failed:', e);
  process.exit(2);
});