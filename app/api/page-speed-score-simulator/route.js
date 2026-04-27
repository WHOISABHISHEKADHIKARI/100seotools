import { NextResponse } from 'next/server';
import { pageSpeedInsights, normalizeUrl } from '../../../lib/realData.js';

export async function POST(request) {
  try {
    const { url } = await request.json();
    const target = normalizeUrl(url);
    if (!target) return NextResponse.json({ success: false, error: 'Valid URL required' }, { status: 400 });

    const [mobile, desktop] = await Promise.all([
      pageSpeedInsights(target, { strategy: 'mobile', categories: ['performance', 'seo', 'accessibility', 'best-practices'] }),
      pageSpeedInsights(target, { strategy: 'desktop', categories: ['performance'] })
    ]);

    const m = mobile.ok ? mobile.data : null;
    const d = desktop.ok ? desktop.data : null;

    const lines = [];
    lines.push(`Real PageSpeed Insights Report for ${target}`);
    lines.push('Source: Google PageSpeed Insights (Lighthouse)');
    lines.push('='.repeat(60));
    lines.push('');

    if (!m && !d) {
      lines.push('PageSpeed Insights is currently unavailable (likely a rate limit on the public quota).');
      lines.push(`Mobile request: ${mobile.error || 'failed'}`);
      lines.push(`Desktop request: ${d ? 'ok' : (desktop.error || 'failed')}`);
      lines.push('');
      lines.push('Tip: set the env var PAGESPEED_API_KEY (or GOOGLE_API_KEY) for a higher quota.');
      lines.push('You can still test directly: https://pagespeed.web.dev/analysis?url=' + encodeURIComponent(target));
      return NextResponse.json({ success: true, result: lines.join('\n') });
    }

    lines.push('SCORES (0-100, higher is better)');
    lines.push(`  Mobile   Performance:    ${m?.scores.performance ?? 'n/a'}`);
    lines.push(`  Desktop  Performance:    ${d?.scores.performance ?? 'n/a'}`);
    if (m?.scores.seo != null) lines.push(`  Mobile   SEO:            ${m.scores.seo}`);
    if (m?.scores.accessibility != null) lines.push(`  Mobile   Accessibility:  ${m.scores.accessibility}`);
    if (m?.scores['best-practices'] != null) lines.push(`  Mobile   Best Practices: ${m.scores['best-practices']}`);
    lines.push('');
    if (m) {
      lines.push('CORE WEB VITALS (mobile)');
      lines.push(`  Largest Contentful Paint (LCP): ${m.metrics.largestContentfulPaint || 'n/a'}`);
      lines.push(`  First Contentful Paint (FCP):   ${m.metrics.firstContentfulPaint || 'n/a'}`);
      lines.push(`  Total Blocking Time (TBT):      ${m.metrics.totalBlockingTime || 'n/a'}`);
      lines.push(`  Cumulative Layout Shift (CLS):  ${m.metrics.cumulativeLayoutShift || 'n/a'}`);
      lines.push(`  Speed Index:                    ${m.metrics.speedIndex || 'n/a'}`);
      lines.push(`  Time to Interactive:            ${m.metrics.interactive || 'n/a'}`);
      lines.push('');
    }
    if (m?.opportunities?.length) {
      lines.push('TOP OPPORTUNITIES TO IMPROVE');
      m.opportunities.forEach((op, i) => lines.push(`  ${i + 1}. ${op.title} ${op.displayValue ? '(' + op.displayValue + ')' : ''}`));
    } else {
      lines.push('No high-impact opportunities detected — page is well optimized.');
    }
    return NextResponse.json({ success: true, result: lines.join('\n') });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message || 'Server Error' }, { status: 500 });
  }
}
