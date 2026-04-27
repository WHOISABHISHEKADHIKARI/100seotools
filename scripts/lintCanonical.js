/**
 * Canonical linter for 100 SEO Tools
 * - Reports manual <link rel="canonical"> tags in the codebase
 * - Encourages using Next.js metadata.alternates.canonical instead
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGET_DIRS = [path.join(ROOT, 'app'), path.join(ROOT, 'components')];
const CANON_REGEX = /<link[^>]+rel=["']canonical["'][^>]*>/gi;

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

function main() {
  let found = [];
  for (const dir of TARGET_DIRS) {
    if (!fs.existsSync(dir)) continue;
    for (const file of walk(dir)) {
      const content = fs.readFileSync(file, 'utf8');
      if (CANON_REGEX.test(content)) {
        found.push(file);
      }
    }
  }

  if (found.length) {
    console.log('Manual canonical tags found in files:');
    for (const f of found) console.log('-', path.relative(ROOT, f));
    console.log('\nFix: remove manual <link rel="canonical"> and use metadata.alternates.canonical');
    process.exitCode = 1;
  } else {
    console.log('No manual canonical tags found. Using Next.js metadata is clean.');
  }
}

main();