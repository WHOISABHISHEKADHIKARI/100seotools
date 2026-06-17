import { NextResponse } from 'next/server';
import { fetchPage, parseHtmlMeta, normalizeUrl } from '../../../lib/realData.js';

export async function POST(request) {
  try {
    const { url } = await request.json().catch(() => ({}));
    if (!url) return NextResponse.json({ success: false, error: 'URL required' }, { status: 400 });

    const page = await fetchPage(normalizeUrl(url));
    if (!page.ok) {
      return NextResponse.json({ success: false, error: `Failed to fetch URL: ${page.error}` }, { status: 502 });
    }

    const meta = parseHtmlMeta(page.data.html, page.data.finalUrl);
    const targetUrl = page.data.finalUrl;

    // Build audit findings (put ISSUES first)
    const issues = [];
    const passes = [];

    // Title
    if (!meta.title) issues.push('❌ **Title Tag Missing** — Crucial for SEO. Every page needs a unique title.');
    else if (meta.title.length < 30) issues.push(`⚠️ **Title Too Short** (${meta.title.length} chars) — Aim for 50–60 characters.`);
    else if (meta.title.length > 60) issues.push(`⚠️ **Title Too Long** (${meta.title.length} chars) — Google may truncate in SERPs.`);
    else passes.push(`✅ **Title Optimized** — ${meta.title.length} chars.`);

    // Meta Description
    if (!meta.metaDescription) issues.push('❌ **Meta Description Missing** — Missed CTR opportunity. Add a compelling 150–160 char description.');
    else if (meta.metaDescription.length < 100) issues.push(`⚠️ **Meta Description Too Short** (${meta.metaDescription.length} chars) — Aim for 150–160.`);
    else if (meta.metaDescription.length > 160) issues.push(`⚠️ **Meta Description Too Long** (${meta.metaDescription.length} chars) — Shorten to ~150–160.`);
    else passes.push(`✅ **Meta Description Optimized** — ${meta.metaDescription.length} chars.`);

    // H1
    if (meta.headings.h1.length === 0) issues.push('❌ **H1 Tag Missing** — Page structure is unclear. Use exactly one H1.');
    else if (meta.headings.h1.length > 1) issues.push(`⚠️ **Multiple H1 Tags** (${meta.headings.h1.length} found) — Use exactly one H1 per page.`);
    else passes.push(`✅ **H1 Present** — "${meta.headings.h1[0].slice(0, 80)}"`);

    // Canonical
    if (!meta.canonical) issues.push('⚠️ **Canonical Tag Missing** — Add a self-referencing canonical to prevent duplicate content issues.');
    else passes.push(`✅ **Canonical Tag Present** — ${meta.canonical}`);

    // Content length
    if (meta.wordCount < 300) issues.push(`⚠️ **Thin Content** — Only ~${meta.wordCount} words. Aim for 500+ words for meaningful SEO impact.`);
    else if (meta.wordCount < 500) issues.push(`⚠️ **Content Could Be Deeper** — ~${meta.wordCount} words. 600+ words typically ranks better.`);
    else passes.push(`✅ **Content Length Good** — ~${meta.wordCount} words.`);

    // Images without alt text
    const imgsNoAlt = meta.images.filter(i => !i.hasAlt || !i.alt);
    if (meta.images.length > 0 && imgsNoAlt.length > 0) {
      issues.push(`⚠️ **${imgsNoAlt.length} Image(s) Missing Alt Text** — Add descriptive alt attributes for accessibility and SEO.`);
    } else if (meta.images.length > 0) {
      passes.push(`✅ **All ${meta.images.length} images have alt text**`);
    }

    // Internal links
    const internalLinks = meta.links.filter(l => !l.isAnchor && !l.isMailto && l.host && page.data.finalUrl.includes(l.host));
    if (internalLinks.length < 2) issues.push(`⚠️ **Few Internal Links** (${internalLinks.length}) — Add 3+ internal links to help crawl and distribute authority.`);
    else passes.push(`✅ **${internalLinks.length} Internal Links Found**`);

    // Open Graph
    if (!meta.ogTags.title) issues.push('⚠️ **Open Graph Title Missing** — Controls how your page appears when shared on social media.');
    if (!meta.metaDescription && !meta.ogTags.description) issues.push('⚠️ **OG Description Missing** — Add og:description for social sharing.');

    // Viewport
    if (!meta.viewport) issues.push('⚠️ **Viewport Meta Tag Missing** — Required for mobile responsiveness.');
    else passes.push('✅ **Viewport Meta Tag Present**');

    // Word count per H2 (structure)
    const h2Count = meta.headings.h2.length;
    if (h2Count < 2) issues.push(`⚠️ **Only ${h2Count} H2 Subheadings** — Add more H2s to improve scannability and keyword targeting.`);

    const issueCount = issues.length;
    const passCount = passes.length;
    const totalChecks = issueCount + passCount;
    const score = totalChecks ? Math.round((passCount / totalChecks) * 100) : 0;

    // SCORE + SUMMARY AT THE TOP
    const lines = [];
    lines.push(`# On-Page SEO Audit Report`);
    lines.push('');
    lines.push(`**URL:** ${targetUrl}`);
    lines.push(`**SEO Score:** ${score}/100 (${score >= 80 ? 'Good' : score >= 50 ? 'Needs Work' : 'Critical'})`);
    lines.push(`**Checks Passed:** ${passCount}/${totalChecks}`);
    lines.push('');

    // Issues FIRST — the user asked for issues to appear at the top
    lines.push('## Issues Found');
    if (issues.length) {
      issues.forEach(i => lines.push(`- ${i}`));
    } else {
      lines.push('- ✅ No critical issues detected!');
    }
    lines.push('');

    lines.push('## What\'s Working');
    if (passes.length) {
      passes.forEach(p => lines.push(`- ${p}`));
    } else {
      lines.push('- No passing checks yet.');
    }
    lines.push('');

    lines.push('## Page Signals');
    lines.push(`| Signal | Value |`);
    lines.push(`|---|---|`);
    lines.push(`| **Title** | ${meta.title || 'N/A'} |`);
    lines.push(`| **Meta Description** | ${(meta.metaDescription || 'N/A').slice(0, 200)} |`);
    lines.push(`| **H1** | ${meta.headings.h1[0] || 'N/A'} |`);
    lines.push(`| **Canonical** | ${meta.canonical || 'Missing'} |`);
    lines.push(`| **Word Count** | ${meta.wordCount} |`);
    lines.push(`| **Images** | ${meta.images.length} total, ${imgsNoAlt.length} missing alt text |`);
    lines.push(`| **Internal Links** | ${internalLinks.length} |`);
    lines.push(`| **H2 Headings** | ${h2Count} |`);
    lines.push(`| **Viewport** | ${meta.viewport || 'Missing'} |`);
    lines.push(`| **JSON-LD Blocks** | ${meta.jsonLd.length} |`);
    lines.push('');

    if (meta.headings.h2.length) {
      lines.push('## H2 Headings Found');
      meta.headings.h2.forEach(h => lines.push(`- ${h.slice(0, 100)}`));
      lines.push('');
    }

    return NextResponse.json({ success: true, result: lines.join('\n') });

  } catch (error) {
    console.error('on-page-seo-audit error:', error);
    return NextResponse.json({ success: false, error: 'Audit failed. The URL might be blocking bots.' }, { status: 500 });
  }
}
