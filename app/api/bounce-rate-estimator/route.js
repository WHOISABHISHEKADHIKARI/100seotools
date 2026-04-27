import { NextResponse } from 'next/server';
import { fetchPage, parseHtmlMeta, pageSpeedInsights, normalizeUrl } from '../../../lib/realData.js';

// Bounce rate is not directly observable without analytics access.
// We compute a real-data-derived estimate by combining live page signals
// known to correlate with bounce: TTFB, page weight, viewport, content depth, LCP.
export async function POST(request) {
  try {
    const body = await request.json();
    const target = normalizeUrl(body.url);
    if (!target) {
      return NextResponse.json({ success: false, error: 'A URL is required (we measure real page signals).' }, { status: 400 });
    }
    const industry = (body.industry || 'general').toLowerCase();

    const [page, psi] = await Promise.all([
      fetchPage(target),
      pageSpeedInsights(target, { strategy: 'mobile', categories: ['performance'] })
    ]);

    if (!page.ok) return NextResponse.json({ success: false, error: page.error }, { status: 502 });
    const meta = parseHtmlMeta(page.data.html, page.data.finalUrl);

    const baseRate = industry.includes('blog') || industry.includes('news') ? 70
      : industry.includes('commerce') || industry.includes('shop') ? 38
      : industry.includes('b2b') || industry.includes('service') ? 50
      : industry.includes('landing') ? 75
      : 50;

    let modifier = 0;
    const reasons = [];

    // Server response time
    if (page.data.elapsedMs > 2500) { modifier += 12; reasons.push(`Slow TTFB ${page.data.elapsedMs}ms (+12%)`); }
    else if (page.data.elapsedMs > 1500) { modifier += 6; reasons.push(`Moderate TTFB ${page.data.elapsedMs}ms (+6%)`); }
    else { modifier -= 3; reasons.push(`Fast TTFB ${page.data.elapsedMs}ms (-3%)`); }

    // Page weight
    const kb = page.data.bytes / 1024;
    if (kb > 1500) { modifier += 8; reasons.push(`Heavy page ${kb.toFixed(0)}KB (+8%)`); }
    else if (kb < 200) { modifier -= 2; reasons.push(`Light page ${kb.toFixed(0)}KB (-2%)`); }

    // Viewport / mobile readiness
    if (!meta.viewport) { modifier += 10; reasons.push('Missing viewport tag (+10%)'); }

    // Content depth
    if (meta.wordCount < 200) { modifier += 8; reasons.push(`Thin content ${meta.wordCount} words (+8%)`); }
    else if (meta.wordCount > 1200) { modifier -= 4; reasons.push(`Substantive content ${meta.wordCount} words (-4%)`); }

    // Internal-link richness (engagement potential)
    const internalLinks = meta.links.filter((l) => !l.host || l.host === new URL(page.data.finalUrl).hostname).length;
    if (internalLinks < 5) { modifier += 5; reasons.push(`Few internal links (${internalLinks}) (+5%)`); }
    else if (internalLinks > 25) { modifier -= 3; reasons.push(`Strong internal linking (${internalLinks}) (-3%)`); }

    // Real LCP from PSI if available
    if (psi.ok && psi.data.metrics.largestContentfulPaint) {
      const lcpStr = String(psi.data.metrics.largestContentfulPaint);
      const num = parseFloat(lcpStr);
      if (!Number.isNaN(num)) {
        if (num > 4) { modifier += 8; reasons.push(`Real LCP ${lcpStr} > 4s (+8%)`); }
        else if (num < 2.5) { modifier -= 4; reasons.push(`Real LCP ${lcpStr} < 2.5s (-4%)`); }
      }
    }

    const estimated = Math.max(15, Math.min(95, baseRate + modifier));
    const status = estimated < 40 ? 'Excellent' : estimated < 55 ? 'Good' : estimated < 70 ? 'Average' : 'Poor';

    const lines = [];
    lines.push(`Real-Signal Bounce Rate Estimate — ${page.data.finalUrl}`);
    lines.push('Source: Live page fetch + PageSpeed Insights LCP');
    lines.push('='.repeat(60));
    lines.push('');
    lines.push(`Estimated Bounce Rate: ${estimated}%  (${status})`);
    lines.push(`Industry baseline (${industry}): ${baseRate}%`);
    lines.push('');
    lines.push('SIGNALS DETECTED');
    reasons.forEach((r) => lines.push('  • ' + r));
    lines.push('');
    lines.push('NOTE: True bounce rate requires analytics access. This estimate uses real page signals known to correlate with bounce.');
    return NextResponse.json({ success: true, result: lines.join('\n') });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message || 'Server Error' }, { status: 500 });
  }
}
