import { NextResponse } from 'next/server';
import { waybackFirstSnapshot, fetchPage, parseHtmlMeta, fetchRobotsTxt, fetchSitemap, normalizeUrl, hostnameOf } from '../../../lib/realData.js';

// Real-signal "Authority Score" derived from publicly fetchable, free data:
// - Wayback Machine first-seen date (proxy for domain age trust)
// - HTTPS and HSTS presence (security signal)
// - Robots.txt + sitemap.xml presence (technical SEO maturity)
// - JSON-LD structured data presence (modern SEO signal)
// - Internal/external link counts and total page weight
// This is transparent and reproducible (no random numbers).
export async function POST(request) {
  try {
    const { domain } = await request.json();
    const target = normalizeUrl(domain);
    if (!target) return NextResponse.json({ success: false, error: 'Valid domain or URL required' }, { status: 400 });

    const [page, wb, robots, sitemap] = await Promise.all([
      fetchPage(target),
      waybackFirstSnapshot(target),
      fetchRobotsTxt(target),
      fetchSitemap(target)
    ]);

    if (!page.ok) {
      return NextResponse.json({ success: false, error: `Could not fetch ${target}: ${page.error}` }, { status: 502 });
    }
    const meta = parseHtmlMeta(page.data.html, page.data.finalUrl);
    const host = hostnameOf(page.data.finalUrl);
    const breakdown = [];
    let score = 0;

    // Age (max 25)
    const ageYears = wb.ok ? (wb.data.ageYears || 0) : 0;
    const agePts = Math.min(25, Math.round(ageYears * 1.8));
    score += agePts;
    breakdown.push(`Age: ${ageYears ? ageYears + ' yrs (since ' + wb.data.firstSeen + ')' : 'unknown'} → ${agePts}/25`);

    // HTTPS + HSTS (max 15)
    const isHttps = page.data.finalUrl.startsWith('https://');
    const hsts = !!page.data.headers['strict-transport-security'];
    const securityPts = (isHttps ? 10 : 0) + (hsts ? 5 : 0);
    score += securityPts;
    breakdown.push(`Security: ${isHttps ? 'HTTPS ✓' : 'HTTP ✗'}${hsts ? ' + HSTS ✓' : ''} → ${securityPts}/15`);

    // robots.txt + sitemap (max 15)
    const hasRobots = robots.ok && robots.data.status === 200 && robots.data.body.trim().length > 0;
    const hasSitemap = sitemap.ok && sitemap.data.status === 200 && sitemap.data.urls.length > 0;
    const techPts = (hasRobots ? 7 : 0) + (hasSitemap ? 8 : 0);
    score += techPts;
    breakdown.push(`Technical: robots.txt ${hasRobots ? '✓' : '✗'}, sitemap.xml ${hasSitemap ? '✓ (' + sitemap.data.urls.length + ' URLs)' : '✗'} → ${techPts}/15`);

    // Structured data (max 10)
    const validJsonLd = meta.jsonLd.filter((j) => !j._parseError).length;
    const sdPts = Math.min(10, validJsonLd * 4);
    score += sdPts;
    breakdown.push(`Structured data: ${validJsonLd} valid JSON-LD blocks → ${sdPts}/10`);

    // On-page SEO basics (max 15)
    const titleOk = meta.title.length >= 30 && meta.title.length <= 70;
    const descOk = meta.metaDescription.length >= 80 && meta.metaDescription.length <= 200;
    const h1Ok = meta.headings.h1.length === 1;
    const canonicalOk = !!meta.canonical;
    const onpagePts = (titleOk ? 4 : 0) + (descOk ? 4 : 0) + (h1Ok ? 4 : 0) + (canonicalOk ? 3 : 0);
    score += onpagePts;
    breakdown.push(`On-page basics: title ${titleOk ? '✓' : '✗'}, meta-desc ${descOk ? '✓' : '✗'}, single H1 ${h1Ok ? '✓' : '✗'}, canonical ${canonicalOk ? '✓' : '✗'} → ${onpagePts}/15`);

    // Link profile (max 10)
    const internal = meta.links.filter((l) => l.host === host || !l.host).length;
    const external = meta.links.filter((l) => l.host && l.host !== host).length;
    const linkPts = Math.min(10, Math.floor(Math.log10(internal + external + 1) * 4));
    score += linkPts;
    breakdown.push(`Link profile: ${internal} internal, ${external} external → ${linkPts}/10`);

    // Performance proxy (max 10)
    const perfPts = page.data.elapsedMs < 600 ? 10 : page.data.elapsedMs < 1500 ? 6 : page.data.elapsedMs < 3000 ? 3 : 0;
    score += perfPts;
    breakdown.push(`Server response: ${page.data.elapsedMs} ms, ${(page.data.bytes / 1024).toFixed(0)} KB → ${perfPts}/10`);

    score = Math.min(100, score);
    const tier = score >= 80 ? 'Excellent' : score >= 60 ? 'Strong' : score >= 40 ? 'Moderate' : score >= 20 ? 'Developing' : 'Weak';

    const lines = [];
    lines.push(`Real-Signal Authority Report — ${host}`);
    lines.push('Source: Wayback Machine + live page fetch + robots/sitemap probes');
    lines.push('='.repeat(60));
    lines.push('');
    lines.push(`AUTHORITY SCORE: ${score}/100  (${tier})`);
    lines.push('');
    lines.push('SIGNAL BREAKDOWN');
    breakdown.forEach((b) => lines.push('  ' + b));
    lines.push('');
    lines.push('NOTE: This score is computed only from publicly fetchable signals — no Math.random.');
    lines.push('It is not Moz DA or Ahrefs DR; it is a transparent, free alternative score useful for self-audit.');

    return NextResponse.json({ success: true, result: lines.join('\n') });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message || 'Server Error' }, { status: 500 });
  }
}
