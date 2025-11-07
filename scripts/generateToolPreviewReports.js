// Generates standardized preview reports for all available tools.
// Outputs:
// - reports/tools-preview-reports.md (human-readable)
// - reports/tools-preview-reports.json (machine-readable)

import fs from 'fs';
import path from 'path';
import { tools as allTools } from '../tools/index.js';
import { getBaseUrl } from '../lib/site.js';

function sortByName(a, b) {
  return (a.name || '').localeCompare(b.name || '');
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function buildMarkdown(tools, baseUrl) {
  const header = [
    '# Tool Preview Reports',
    '',
    `Base URL: ${baseUrl}`,
    '',
    'This report provides a standardized preview for each tool, enabling easy comparison across key operational and SEO-relevant fields.',
    '',
    'Fields:',
    '- Identification: name, id (slug), location (URL)',
    '- Operational status: availability and page rendering state',
    '- Pricing: structure and rates',
    '- Traffic: volume statistics (if available)',
    '- Historical performance: uptime or trends (if available)',
    '- Visual: screenshot/OG image link',
    '',
  ].join('\n');

  const sections = tools.map((t) => {
    const name = t.name || 'Unknown';
    const slug = t.slug || 'unknown-slug';
    const url = `${baseUrl}/tools/${slug}`;
    const category = t.category || 'Uncategorized';
    const description = t.description || '';
    const screenshot = `${baseUrl}/screenshots/${slug}.png`;
    const ogImage = `${baseUrl}/og-image.jpg`;

    return [
      `## ${name}`,
      '',
      '**Identification**',
      `- Name: ${name}`,
      `- ID (slug): ${slug}`,
      `- Location: ${url}`,
      `- Category: ${category}`,
      description ? `- Description: ${description}` : '',
      '',
      '**Operational Status**',
      '- Status: Online (static page available)',
      '- Rendering: App Router static page with structured data',
      '',
      '**Pricing Structure**',
      '- Price: $0 (Free)',
      '- Billing: Not applicable',
      '- Usage: In-browser, no login required',
      '',
      '**Traffic Volume**',
      '- Page Views: Not instrumented',
      '- Unique Visitors: Not instrumented',
      '- Source Mix: Not instrumented',
      '',
      '**Historical Performance**',
      '- Uptime: Not tracked',
      '- Error Rate: Not tracked',
      '- Response Times: Not tracked',
      '',
      '**Visual Representation**',
      `- Screenshot: ${screenshot} (may be placeholder if not generated)`,
      `- OG Image: ${ogImage}`,
      '',
      '---',
      '',
    ].filter(Boolean).join('\n');
  });

  return `${header}${sections.join('\n')}`;
}

function buildJSON(tools, baseUrl) {
  return tools.map((t) => {
    const slug = t.slug || 'unknown-slug';
    const url = `${baseUrl}/tools/${slug}`;
    return {
      identification: {
        name: t.name || 'Unknown',
        id: slug,
        location: url,
        category: t.category || 'Uncategorized',
        description: t.description || ''
      },
      operationalStatus: {
        status: 'online',
        rendering: 'static-app-router',
      },
      pricing: {
        priceUSD: 0,
        billing: 'free',
        usage: 'in-browser, no login required'
      },
      trafficVolume: {
        pageViews: null,
        uniqueVisitors: null,
        sources: null,
        notes: 'Analytics not instrumented in repo'
      },
      historicalPerformance: {
        uptime: null,
        errorRate: null,
        responseTimesMs: null,
        notes: 'No historical metrics available in repo'
      },
      visuals: {
        screenshot: `${baseUrl}/screenshots/${slug}.png`,
        ogImage: `${baseUrl}/og-image.jpg`
      }
    };
  });
}

function main() {
  const baseUrl = getBaseUrl();
  const tools = [...allTools].sort(sortByName);
  const outDir = path.join(process.cwd(), 'reports');
  ensureDir(outDir);

  const md = buildMarkdown(tools, baseUrl);
  const json = buildJSON(tools, baseUrl);

  fs.writeFileSync(path.join(outDir, 'tools-preview-reports.md'), md, 'utf8');
  fs.writeFileSync(path.join(outDir, 'tools-preview-reports.json'), JSON.stringify(json, null, 2), 'utf8');

  console.log(`Generated ${tools.length} tool previews.`);
  console.log(`- Markdown: reports/tools-preview-reports.md`);
  console.log(`- JSON:     reports/tools-preview-reports.json`);
}

main();