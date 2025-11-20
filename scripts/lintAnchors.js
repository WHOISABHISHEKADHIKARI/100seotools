/**
 * Anchor lint for 100 SEO Tools
 * - Detects <a> tags with no inner text and no sr-only content
 * - Flags self-closing <a ... /> and empty <a ...></a>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');
const TARGET_DIRS = [path.join(ROOT, 'app'), path.join(ROOT, 'components')];

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

function findIssues(file, content) {
  const issues = [];
  // self-closing anchors
  const selfClosingRegex = /<a[^>]*\/>(?!\s*<\/a>)/g;
  let m;
  while ((m = selfClosingRegex.exec(content)) !== null) {
    issues.push({ type: 'self-closing', index: m.index });
  }

  // empty content anchors (no sr-only span)
  const emptyRegex = /<a[^>]*>(\s*)<\/a>/g;
  while ((m = emptyRegex.exec(content)) !== null) {
    const snippet = content.slice(m.index, m.index + m[0].length);
    if (!/sr-only/.test(snippet)) {
      issues.push({ type: 'empty', index: m.index });
    }
  }
  return issues;
}

function main() {
  let totalIssues = 0;
  for (const dir of TARGET_DIRS) {
    if (!fs.existsSync(dir)) continue;
    for (const file of walk(dir)) {
      const content = fs.readFileSync(file, 'utf8');
      const issues = findIssues(file, content);
      if (issues.length) {
        totalIssues += issues.length;
        console.log(`\n${path.relative(ROOT, file)}:`);
        for (const i of issues) {
          console.log(`- Anchor without text (${i.type}) at index ${i.index}`);
        }
      }
    }
  }

  if (totalIssues) {
    console.log(`\nFound ${totalIssues} anchor issues. Add visible text or sr-only content.`);
    process.exitCode = 1;
  } else {
    console.log('No empty anchor issues detected.');
  }
}

main();
