import { NextResponse } from 'next/server';
import { fetchPage, parseHtmlMeta, normalizeUrl } from '../../../lib/realData.js';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const target = normalizeUrl(body.url);
    if (!target) {
      return NextResponse.json({ success: false, error: 'A URL is required.' }, { status: 400 });
    }
    const industry = (body.industry || 'general').toLowerCase();

    const page = await fetchPage(target);
    if (!page.ok) return NextResponse.json({ success: false, error: page.error }, { status: 502 });

    const meta = parseHtmlMeta(page.data.html, page.data.finalUrl);
    const html = page.data.html;

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

    // Internal-link richness
    let internalLinks = 0;
    try {
      const hostname = new URL(page.data.finalUrl).hostname;
      internalLinks = meta.links.filter((l) => !l.host || l.host === hostname).length;
    } catch {}
    if (internalLinks < 5) { modifier += 5; reasons.push(`Few internal links (${internalLinks}) (+5%)`); }
    else if (internalLinks > 25) { modifier -= 3; reasons.push(`Strong internal linking (${internalLinks}) (-3%)`); }

    // Image count (too many = slow = bounce)
    if (meta.images.length > 20) { modifier += 4; reasons.push(`Many images (${meta.images.length}) (+4%)`); }
    else if (meta.images.length > 0 && meta.images.length <= 5) { modifier -= 1; reasons.push(`Lean images (${meta.images.length}) (-1%)`); }

    // Render-blocking indicators
    const stylesheets = (html.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi) || []).length;
    if (stylesheets > 8) { modifier += 5; reasons.push(`${stylesheets} stylesheets may block rendering (+5%)`); }

    // Inline scripts
    const inlineScripts = (html.match(/<script[^>]*>[^<]/gi) || []).length;
    if (inlineScripts > 15) { modifier += 4; reasons.push(`${inlineScripts} inline scripts may slow parsing (+4%)`); }

    // Lazy loading
    if (html.includes('loading="lazy"') || html.includes("loading='lazy'")) {
      modifier -= 2; reasons.push('Lazy loading detected (-2%)');
    }

    // Font display
    if (html.includes('font-display') && html.includes('swap')) {
      modifier -= 1; reasons.push('font-display: swap detected (-1%)');
    }

    // Missing preconnect
    if (!html.includes('preconnect') && (stylesheets > 3 || inlineScripts > 8)) {
      modifier += 2; reasons.push('No preconnect hints for external resources (+2%)');
    }

    const estimated = Math.max(15, Math.min(95, baseRate + modifier));
    const status = estimated < 40 ? 'Excellent' : estimated < 55 ? 'Good' : estimated < 70 ? 'Average' : 'Poor';

    const lines = [];
    lines.push(`Real-Signal Bounce Rate Estimate — ${page.data.finalUrl}`);
    lines.push('Source: Live page HTML analysis (no API needed)');
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
    console.error('bounce-rate-estimator error:', err);
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}
