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
    return { url, ok: res.ok, status: res.status, finalUrl: res.url };
  } catch (err) {
    return { url, ok: false, status: 0, error: String(err.message || err) };
  }
}

async function main() {
  const urls = collectExternalUrls();
  console.log(`Found ${urls.length} external URLs to check...`);

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

  const failures = results.filter((r) => !r.ok);
  if (failures.length) {
    console.log(`\nBroken external links (${failures.length}):`);
    for (const f of failures) {
      console.log(`- ${f.url} -> status: ${f.status}${f.error ? ` error: ${f.error}` : ''}`);
    }
    process.exitCode = 1;
  } else {
    console.log('\nAll external links responded OK');
  }
}

main().catch((e) => {
  console.error('Link check failed:', e);
  process.exit(2);
});