import { NextResponse } from 'next/server';
import { fetchPage, parseHtmlMeta, waybackFirstSnapshot, normalizeUrl, hostnameOf } from '../../../lib/realData.js';

function estimateScore(html, meta, elapsedMs, bytes) {
  let score = 100;
  const kb = bytes / 1024;

  // TTFB
  if (elapsedMs > 3000) score -= 30;
  else if (elapsedMs > 1800) score -= 15;
  else if (elapsedMs > 1000) score -= 5;

  // Weight
  if (kb > 5000) score -= 25;
  else if (kb > 3000) score -= 15;
  else if (kb > 1500) score -= 5;

  // Images
  const images = html.match(/<img[^>]*>/gi) || [];
  const unopt = images.filter(i => !i.includes('loading=') && !i.includes('decoding='));
  if (unopt.length > 5) score -= 10;

  // Scripts
  const scripts = (html.match(/<script[^>]*>/gi) || []).length;
  const asyncScripts = (html.match(/<script[^>]*(async|defer)[^>]*>/gi) || []).length;
  if (scripts > 5 && asyncScripts < scripts * 0.5) score -= 10;

  // Viewport
  if (!meta.viewport) score -= 15;

  // Content
  if (meta.wordCount < 100) score -= 10;
  if (meta.headings.h1.length === 0) score -= 10;
  if (meta.headings.h1.length > 1) score -= 5;

  return Math.max(0, Math.min(100, score));
}

async function snapshot(siteInput) {
  const target = normalizeUrl(siteInput);
  if (!target) return null;
  const [page, wb] = await Promise.all([
    fetchPage(target),
    waybackFirstSnapshot(target)
  ]);
  if (!page.ok) return { input: siteInput, error: page.error };
  const meta = parseHtmlMeta(page.data.html, page.data.finalUrl);
  const perfScore = estimateScore(page.data.html, meta, page.data.elapsedMs, page.data.bytes);
  return {
    input: siteInput,
    host: hostnameOf(page.data.finalUrl),
    url: page.data.finalUrl,
    title: meta.title,
    description: meta.description,
    wordCount: meta.wordCount,
    h1Count: meta.headings.h1.length,
    elapsedMs: page.data.elapsedMs,
    bytesKb: Math.round(page.data.bytes / 1024),
    isHttps: page.data.finalUrl.startsWith('https://'),
    canonical: meta.canonical || null,
    jsonLdCount: meta.jsonLd.filter(j => !j._parseError).length,
    imageCount: meta.images.length,
    linkCount: meta.links.length,
    perfScore,
    ageYears: wb.ok ? wb.data.ageYears : null
  };
}

function row(label, a, b, betterIs = 'higher') {
  const av = a == null ? '–' : a;
  const bv = b == null ? '–' : b;
  let winner = '—';
  if (a != null && b != null && a !== b) {
    const aBetter = betterIs === 'higher' ? a > b : a < b;
    winner = aBetter ? '◀ A' : 'B ▶';
  }
  return `  ${label.padEnd(28)} ${String(av).padStart(14)}   ${String(bv).padStart(14)}   ${winner}`;
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const inputA = body.site1 || body.a || body.url1;
    const inputB = body.site2 || body.b || body.url2;
    if (!inputA || !inputB) return NextResponse.json({ success: false, error: 'Both sites required' }, { status: 400 });

    const [A, B] = await Promise.all([snapshot(inputA), snapshot(inputB)]);
    if (!A || A.error) return NextResponse.json({ success: false, error: `Site A failed: ${A?.error || 'invalid'}` }, { status: 502 });
    if (!B || B.error) return NextResponse.json({ success: false, error: `Site B failed: ${B?.error || 'invalid'}` }, { status: 502 });

    const lines = [];
    lines.push(`Real Site Comparison`);
    lines.push(`A: ${A.host}    vs    B: ${B.host}`);
    lines.push('Source: Live HTML analysis (no API needed)');
    lines.push('='.repeat(72));
    lines.push('');
    lines.push(`  ${'Metric'.padEnd(28)} ${'A'.padStart(14)}   ${'B'.padStart(14)}   Winner`);
    lines.push('  ' + '-'.repeat(70));
    lines.push(row('Domain age (years)', A.ageYears, B.ageYears, 'higher'));
    lines.push(row('Performance score', A.perfScore, B.perfScore, 'higher'));
    lines.push(row('TTFB (ms)', A.elapsedMs, B.elapsedMs, 'lower'));
    lines.push(row('Page weight (KB)', A.bytesKb, B.bytesKb, 'lower'));
    lines.push(row('Word count', A.wordCount, B.wordCount, 'higher'));
    lines.push(row('Internal links', A.linkCount, B.linkCount, 'higher'));
    lines.push(row('JSON-LD blocks', A.jsonLdCount, B.jsonLdCount, 'higher'));
    lines.push(row('H1 count', A.h1Count, B.h1Count, 'higher'));
    lines.push(row('Images', A.imageCount, B.imageCount, 'higher'));
    lines.push(row('HTTPS', A.isHttps ? 'Yes' : 'No', B.isHttps ? 'Yes' : 'No', 'higher'));
    lines.push(row('Canonical tag', A.canonical ? 'Yes' : 'No', B.canonical ? 'Yes' : 'No', 'higher'));
    lines.push('');
    lines.push('TITLES');
    lines.push(`  A: ${A.title || 'none'}`);
    lines.push(`  B: ${B.title || 'none'}`);
    lines.push('');
    lines.push('DESCRIPTIONS');
    lines.push(`  A: ${A.description || 'none'}`);
    lines.push(`  B: ${B.description || 'none'}`);
    return NextResponse.json({ success: true, result: lines.join('\n') });
  } catch (err) {
    console.error('site-comparison-report-generator error:', err);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}
