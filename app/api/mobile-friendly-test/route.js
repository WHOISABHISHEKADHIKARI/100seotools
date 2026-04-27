import { NextResponse } from 'next/server';
import { pageSpeedInsights, fetchPage, parseHtmlMeta, normalizeUrl } from '../../../lib/realData.js';

export async function POST(request) {
  try {
    const { url } = await request.json();
    const target = normalizeUrl(url);
    if (!target) return NextResponse.json({ success: false, error: 'Valid URL required' }, { status: 400 });

    const [psi, page] = await Promise.all([
      pageSpeedInsights(target, { strategy: 'mobile', categories: ['performance', 'seo', 'accessibility'] }),
      fetchPage(target)
    ]);

    const meta = page.ok ? parseHtmlMeta(page.data.html, page.data.finalUrl) : null;
    const lines = [];
    lines.push(`Real Mobile-Friendly Audit: ${target}`);
    lines.push('Source: Google PageSpeed Insights (Lighthouse, mobile emulation)');
    lines.push('='.repeat(60));
    lines.push('');

    if (page.ok) {
      lines.push('PAGE BASICS');
      lines.push(`  HTTP status: ${page.data.status}`);
      lines.push(`  Page weight: ${(page.data.bytes / 1024).toFixed(1)} KB`);
      lines.push(`  Response time: ${page.data.elapsedMs} ms`);
      lines.push(`  Viewport meta tag: ${meta?.viewport ? 'YES — ' + meta.viewport : 'MISSING (critical)'}`);
      lines.push(`  HTML lang attribute: ${meta?.lang || 'missing'}`);
      lines.push('');
    } else {
      lines.push(`Could not fetch page directly: ${page.error}`);
      lines.push('');
    }

    if (psi.ok) {
      lines.push('LIGHTHOUSE MOBILE SCORES');
      lines.push(`  Performance:   ${psi.data.scores.performance ?? 'n/a'}/100`);
      lines.push(`  SEO:           ${psi.data.scores.seo ?? 'n/a'}/100`);
      lines.push(`  Accessibility: ${psi.data.scores.accessibility ?? 'n/a'}/100`);
      lines.push('');
      lines.push('CORE WEB VITALS (mobile)');
      lines.push(`  LCP: ${psi.data.metrics.largestContentfulPaint || 'n/a'}`);
      lines.push(`  CLS: ${psi.data.metrics.cumulativeLayoutShift || 'n/a'}`);
      lines.push(`  TBT: ${psi.data.metrics.totalBlockingTime || 'n/a'}`);
      lines.push('');
      const verdict = (psi.data.scores.performance ?? 0) >= 50 && meta?.viewport
        ? 'PASS — page is mobile-friendly.'
        : 'NEEDS WORK — see opportunities below.';
      lines.push('VERDICT: ' + verdict);
      if (psi.data.opportunities.length) {
        lines.push('');
        lines.push('TOP MOBILE IMPROVEMENT OPPORTUNITIES');
        psi.data.opportunities.forEach((op, i) => lines.push(`  ${i + 1}. ${op.title} ${op.displayValue ? '(' + op.displayValue + ')' : ''}`));
      }
    } else {
      lines.push(`PageSpeed Insights unavailable: ${psi.error}`);
      lines.push('Falling back to viewport-only check.');
    }

    return NextResponse.json({ success: true, result: lines.join('\n') });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message || 'Server Error' }, { status: 500 });
  }
}
