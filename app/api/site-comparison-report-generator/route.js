import { NextResponse } from 'next/server';
import { fetchPage, parseHtmlMeta, pageSpeedInsights, waybackFirstSnapshot, normalizeUrl, hostnameOf } from '../../../lib/realData.js';

async function snapshot(siteInput) {
  const target = normalizeUrl(siteInput);
  if (!target) return null;
  const [page, psi, wb] = await Promise.all([
    fetchPage(target),
    pageSpeedInsights(target, { strategy: 'mobile', categories: ['performance', 'seo'] }),
    waybackFirstSnapshot(target)
  ]);
  if (!page.ok) return { input: siteInput, error: page.error };
  const meta = parseHtmlMeta(page.data.html, page.data.finalUrl);
  return {
    input: siteInput,
    host: hostnameOf(page.data.finalUrl),
    url: page.data.finalUrl,
    title: meta.title,
    wordCount: meta.wordCount,
    h1Count: meta.headings.h1.length,
    elapsedMs: page.data.elapsedMs,
    bytesKb: Math.round(page.data.bytes / 1024),
    isHttps: page.data.finalUrl.startsWith('https://'),
    canonical: meta.canonical || null,
    jsonLdCount: meta.jsonLd.filter(j => !j._parseError).length,
    imageCount: meta.images.length,
    linkCount: meta.links.length,
    perfScore: psi.ok ? psi.data.scores.performance : null,
    seoScore: psi.ok ? psi.data.scores.seo : null,
    lcp: psi.ok ? psi.data.metrics.largestContentfulPaint : null,
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
    const body = await request.json();
    const inputA = body.site1 || body.a || body.url1;
    const inputB = body.site2 || body.b || body.url2;
    if (!inputA || !inputB) return NextResponse.json({ success: false, error: 'Both sites required' }, { status: 400 });

    const [A, B] = await Promise.all([snapshot(inputA), snapshot(inputB)]);
    if (!A || A.error) return NextResponse.json({ success: false, error: `Site A failed: ${A?.error || 'invalid'}` }, { status: 502 });
    if (!B || B.error) return NextResponse.json({ success: false, error: `Site B failed: ${B?.error || 'invalid'}` }, { status: 502 });

    const lines = [];
    lines.push(`Real Site Comparison`);
    lines.push(`A: ${A.host}    vs    B: ${B.host}`);
    lines.push('Source: Live HTML parse + PageSpeed Insights + Wayback Machine');
    lines.push('='.repeat(72));
    lines.push('');
    lines.push(`  ${'Metric'.padEnd(28)} ${'A'.padStart(14)}   ${'B'.padStart(14)}   Winner`);
    lines.push('  ' + '-'.repeat(70));
    lines.push(row('Domain age (years)', A.ageYears, B.ageYears, 'higher'));
    lines.push(row('PSI performance', A.perfScore, B.perfScore, 'higher'));
    lines.push(row('PSI SEO', A.seoScore, B.seoScore, 'higher'));
    lines.push(row('TTFB (ms)', A.elapsedMs, B.elapsedMs, 'lower'));
    lines.push(row('Page weight (KB)', A.bytesKb, B.bytesKb, 'lower'));
    lines.push(row('Word count', A.wordCount, B.wordCount, 'higher'));
    lines.push(row('Internal links', A.linkCount, B.linkCount, 'higher'));
    lines.push(row('JSON-LD blocks', A.jsonLdCount, B.jsonLdCount, 'higher'));
    lines.push(row('H1 count', A.h1Count, B.h1Count, 'higher'));
    lines.push(row('Images', A.imageCount, B.imageCount, 'higher'));
    lines.push('');
    lines.push('TITLES');
    lines.push(`  A: ${A.title}`);
    lines.push(`  B: ${B.title}`);
    lines.push('');
    lines.push('LCP (mobile)');
    lines.push(`  A: ${A.lcp || 'n/a'}`);
    lines.push(`  B: ${B.lcp || 'n/a'}`);
    return NextResponse.json({ success: true, result: lines.join('\n') });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message || 'Server Error' }, { status: 500 });
  }
}
