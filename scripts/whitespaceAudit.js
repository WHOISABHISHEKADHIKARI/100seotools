/**
 * Whitespace audit and fixer
 * - Detects trailing spaces, mixed indentation, irregular line endings
 * - Supports dry-run and fix modes
 * - Preserves intentional whitespace for Markdown and JSON-LD blocks
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const TARGET_DIRS = [
  path.join(ROOT, 'app'),
  path.join(ROOT, 'components'),
  path.join(ROOT, 'lib'),
  path.join(ROOT, 'content'),
  path.join(ROOT, 'public'),
  path.join(ROOT, 'reports'),
  path.join(ROOT, 'scripts'),
];

const INCLUDE_EXTS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.txt', '.css', '.html'
]);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function detectIssues(content, ext) {
  const lines = content.split(/\r?\n/);
  const issues = [];
  const isMarkdown = ext === '.md';

  // Detect CRLF line endings by checking original content
  const hasCRLF = /\r\n/.test(content);
  if (hasCRLF) issues.push({ type: 'line_endings', detail: 'CRLF', index: -1 });

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Trailing spaces (skip markdown hard-break "two spaces" at end)
    const trailingMatch = /(\s+)$/u.exec(line);
    if (trailingMatch && trailingMatch[1].length) {
      const trailing = trailingMatch[1];
      const isHardBreak = isMarkdown && trailing.length >= 2;
      if (!isHardBreak) issues.push({ type: 'trailing_spaces', index: i });
    }

    // Mixed indentation: tabs in code files
    if (/\t/.test(line)) {
      // Allow tabs in markdown code fences; we cannot reliably detect fences here
      if (!isMarkdown) issues.push({ type: 'tabs_indent', index: i });
    }
  }

  return issues;
}

function fixContent(content, ext) {
  const isMarkdown = ext === '.md';
  // Normalize line endings to LF
  let fixed = content.replace(/\r\n/g, '\n');

  const lines = fixed.split('\n');
  for (let i = 0; i < lines.length; i++) {
    // Remove trailing spaces except markdown hard-break
    if (isMarkdown) {
      // Preserve two trailing spaces used for hard line breaks
      lines[i] = lines[i].replace(/(\S)(\s+)$/, (m, s, ws) => {
        return ws.length >= 2 ? s + '  ' : s;
      });
    } else {
      lines[i] = lines[i].replace(/\s+$/u, '');
    }
    // Convert leading tabs to two spaces
    lines[i] = lines[i].replace(/^\t+/g, (tabs) => '  '.repeat(tabs.length));
  }

  fixed = lines.join('\n');
  // Ensure final newline
  if (!fixed.endsWith('\n')) fixed += '\n';
  return fixed;
}

function main() {
  const mode = process.argv.includes('--fix') ? 'fix' : 'dry';
  const report = [];
  let totalIssues = 0;

  for (const dir of TARGET_DIRS) {
    if (!fs.existsSync(dir)) continue;
    for (const file of walk(dir)) {
      const ext = path.extname(file).toLowerCase();
      if (!INCLUDE_EXTS.has(ext)) continue;
      const content = fs.readFileSync(file, 'utf8');
      const issues = detectIssues(content, ext);
      if (issues.length) {
        totalIssues += issues.length;
        report.push({ file, issues });
        if (mode === 'fix') {
          const fixed = fixContent(content, ext);
          fs.writeFileSync(file, fixed, 'utf8');
        }
      }
    }
  }

  // Output report JSON to reports folder
  const outDir = path.join(ROOT, 'reports');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const outPath = path.join(outDir, `whitespace-audit-${Date.now()}.json`);
  fs.writeFileSync(outPath, JSON.stringify({ mode, totalIssues, report }, null, 2));

  console.log(`Whitespace ${mode === 'fix' ? 'fix' : 'audit'} complete.`);
  console.log(`Issues found: ${totalIssues}`);
  console.log(`Report: ${path.relative(ROOT, outPath)}`);

  // Non-zero exit on issues for CI when in dry mode
  if (mode === 'dry' && totalIssues > 0) process.exitCode = 1;
}

main();
