import { NextResponse } from 'next/server';
import { fetchPage, parseHtmlMeta, fetchRobotsTxt, fetchSitemap, normalizeUrl, hostnameOf } from '../../../lib/realData.js';

export async function POST(request) {
  try {
    const { url } = await request.json();
    const target = normalizeUrl(url);
    if (!target) return NextResponse.json({ success: false, error: 'Valid URL required' }, { status: 400 });

    const [page, robots, sitemap] = await Promise.all([
      fetchPage(target),
      fetchRobotsTxt(target),
      fetchSitemap(target)
    ]);
    if (!page.ok) return NextResponse.json({ success: true, result: `Could not access site: ${page.error}\nHealth Score: 0/100 (Unreachable)` });

    const meta = parseHtmlMeta(page.data.html, page.data.finalUrl);
    const host = hostnameOf(page.data.finalUrl);

    const checks = [];
    let score = 0;
    const add = (pts, ok, label) => { if (ok) score += pts; checks.push(`${ok ? '✓' : '✗'} ${label} (${ok ? '+' : ''}${ok ? pts : 0}/${pts})`); };

    add(10, page.data.status === 200, `HTTP 200 OK (got ${page.data.status})`);
    add(10, page.data.finalUrl.startsWith('https://'), 'HTTPS encryption');
    add(5, !!page.data.headers['strict-transport-security'], 'HSTS header present');
    add(5, page.data.elapsedMs < 1500, `Server response under 1.5s (was ${page.data.elapsedMs}ms)`);
    add(8, meta.title.length >= 30 && meta.title.length <= 70, `Title length 30-70 (was ${meta.title.length})`);
    add(8, meta.metaDescription.length >= 80 && meta.metaDescription.length <= 200, `Meta description length 80-200 (was ${meta.metaDescription.length})`);
    add(6, meta.headings.h1.length === 1, `Exactly one H1 (found ${meta.headings.h1.length})`);
    add(4, meta.headings.h2.length >= 2, `At least 2 H2s (found ${meta.headings.h2.length})`);
    add(6, !!meta.canonical, 'Canonical link present');
    add(4, !!meta.viewport, 'Viewport meta tag present');
    add(4, !!meta.lang, 'HTML lang attribute set');
    add(6, meta.jsonLd.filter(j => !j._parseError).length > 0, `JSON-LD structured data (${meta.jsonLd.length} blocks)`);
    add(5, robots.ok && robots.data.status === 200 && robots.data.body.trim().length > 0, 'robots.txt exists');
    add(5, sitemap.ok && sitemap.data.status === 200 && sitemap.data.urls.length > 0, `sitemap.xml with ${sitemap.ok ? sitemap.data.urls.length : 0} URLs`);
    add(4, meta.wordCount >= 300, `At least 300 words (was ${meta.wordCount})`);
    const imgsWithoutAlt = meta.images.filter(i => !i.hasAlt || !i.alt).length;
    add(5, meta.images.length === 0 || imgsWithoutAlt === 0, `All ${meta.images.length} images have alt text (${imgsWithoutAlt} missing)`);
    const internal = meta.links.filter(l => !l.host || l.host === host).length;
    add(5, internal >= 3, `At least 3 internal links (was ${internal})`);

    score = Math.min(100, score);
    const tier = score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Fair' : score >= 30 ? 'Poor' : 'Critical';

    const lines = [];
    lines.push(`Real SEO Health Score — ${page.data.finalUrl}`);
    lines.push('Source: Live page fetch + robots/sitemap probes');
    lines.push('='.repeat(60));
    lines.push('');
    lines.push(`SCORE: ${score}/100  (${tier})`);
    lines.push('');
    lines.push('CHECK RESULTS');
    checks.forEach((c) => lines.push('  ' + c));
    return NextResponse.json({ success: true, result: lines.join('\n') });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message || 'Server Error' }, { status: 500 });
  }
}
