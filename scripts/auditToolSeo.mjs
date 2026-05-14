import fs from 'node:fs';
import path from 'node:path';
import { tools } from '../tools/registry.js';
import { getBaseUrl } from '../lib/site.js';
import {
  cleanToolName,
  getCompetitorSerpPatterns,
  standardizeToolSeo,
} from '../lib/toolSeo.js';

const reportsDir = path.join(process.cwd(), 'reports');
const docsDir = path.join(process.cwd(), 'docs');
fs.mkdirSync(reportsDir, { recursive: true });
fs.mkdirSync(docsDir, { recursive: true });

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function writeCsv(filePath, rows) {
  const headers = Object.keys(rows[0] || {});
  const csv = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(',')),
  ].join('\n');
  fs.writeFileSync(filePath, `${csv}\n`);
}

function countBy(rows, selector) {
  const counts = new Map();
  rows.forEach((row) => {
    const key = selector(row);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return counts;
}

const baseUrl = getBaseUrl();
const rows = tools.map((tool) => {
  const seo = standardizeToolSeo(tool);
  return {
    slug: tool.slug,
    url: `${baseUrl}/tools/${tool.slug}`,
    category: tool.category,
    current_name: tool.name,
    clean_tool_name: cleanToolName(tool),
    previous_meta_title: tool.metaTitle || '',
    new_meta_title: seo.title,
    title_length: seo.title.length,
    title_status: seo.title.length <= 60 ? 'pass' : 'fail',
    previous_meta_description: tool.metaDescription || tool.description || '',
    new_meta_description: seo.description,
    description_length: seo.description.length,
    description_status: seo.description.length >= 150 && seo.description.length <= 160 ? 'pass' : 'fail',
    canonical_url: `${baseUrl}/tools/${tool.slug}`,
    robots: 'index,follow',
    keywords: seo.keywords.join('; '),
    competitor_pattern_applied: 'Free [Tool Name] + action/result + online/no signup style',
  };
});

const titleCounts = countBy(rows, (row) => row.new_meta_title.toLowerCase());
const descriptionCounts = countBy(rows, (row) => row.new_meta_description.toLowerCase());
const enrichedRows = rows.map((row) => ({
  ...row,
  duplicate_title_count: titleCounts.get(row.new_meta_title.toLowerCase()),
  duplicate_description_count: descriptionCounts.get(row.new_meta_description.toLowerCase()),
}));

const csvPath = path.join(reportsDir, 'tool-seo-metadata-audit.csv');
const jsonPath = path.join(reportsDir, 'tool-seo-metadata-audit.json');
const mdPath = path.join(docsDir, 'tool-seo-competitor-metadata-report.md');

writeCsv(csvPath, enrichedRows);
fs.writeFileSync(jsonPath, `${JSON.stringify(enrichedRows, null, 2)}\n`);

const summary = {
  totalTools: rows.length,
  titleLengthIssues: enrichedRows.filter((row) => row.title_status !== 'pass').length,
  descriptionLengthIssues: enrichedRows.filter((row) => row.description_status !== 'pass').length,
  duplicateTitles: enrichedRows.filter((row) => row.duplicate_title_count > 1).length,
  duplicateDescriptions: enrichedRows.filter((row) => row.duplicate_description_count > 1).length,
};

const markdown = `# Tool SEO Competitor Metadata Report

Generated: ${new Date().toISOString()}

## Scope

This report standardizes SEO titles and descriptions for all tool detail pages. The live metadata is now generated through \`lib/toolSeo.js\`, so each tool receives a unique, competitor-informed title, description, keyword list, canonical URL, and index/follow robots directive.

## Competitor SERP Patterns Used

${getCompetitorSerpPatterns().map((pattern) => `- ${pattern.competitor}: \`${pattern.pattern}\` with emphasis on ${pattern.emphasis}.`).join('\n')}

## Implementation Rules

- Titles use a "Free [Tool Name] - Online SEO Tool" style and are capped at 60 characters.
- Descriptions are action-led, tool-specific, and kept between 150 and 160 characters.
- Canonicals remain stable at \`/tools/[slug]\` to avoid unnecessary ranking disruption.
- Existing tool slugs are already lowercase, hyphenated, and indexable, so no redirect migration is required for tool pages.

## Audit Summary

| Metric | Count |
|---|---:|
| Tools audited | ${summary.totalTools} |
| Title length issues | ${summary.titleLengthIssues} |
| Description length issues | ${summary.descriptionLengthIssues} |
| Duplicate titles | ${summary.duplicateTitles} |
| Duplicate descriptions | ${summary.duplicateDescriptions} |

## Generated Files

- \`reports/tool-seo-metadata-audit.csv\`
- \`reports/tool-seo-metadata-audit.json\`

## Google Indexing Workflow

1. Deploy the metadata changes.
2. In Google Search Console, submit \`${baseUrl}/sitemap.xml\` and \`${baseUrl}/sitemap-tools/sitemap.xml\` if available.
3. Use URL Inspection for priority tool pages, starting with keyword, SERP, sitemap, robots, schema, and meta tag tools.
4. Track discovered, crawled, indexed, duplicate, and excluded statuses weekly for 30 days.
5. Export the Coverage/Page Indexing report and join it to \`reports/tool-seo-metadata-audit.csv\` by URL.
`;

fs.writeFileSync(mdPath, markdown);

console.log(JSON.stringify(summary, null, 2));
