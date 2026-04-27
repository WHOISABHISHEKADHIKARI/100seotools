import { NextResponse } from 'next/server';
import { fetchPage, parseHtmlMeta, ddgSearch, normalizeUrl, hostnameOf } from '../../../lib/realData.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const target = normalizeUrl(body.competitor_url || body.url);
    if (!target) return NextResponse.json({ success: false, error: 'Competitor URL required' }, { status: 400 });

    const page = await fetchPage(target);
    if (!page.ok) return NextResponse.json({ success: false, error: page.error }, { status: 502 });
    const meta = parseHtmlMeta(page.data.html, page.data.finalUrl);
    const host = hostnameOf(page.data.finalUrl);

    // Derive seed phrases from the competitor's real title + H1 + H2s.
    const seeds = new Set();
    if (meta.title) seeds.add(meta.title.split(/[|\-—–:]/)[0].trim().toLowerCase());
    meta.headings.h1.forEach((h) => seeds.add(h.toLowerCase()));
    meta.headings.h2.slice(0, 5).forEach((h) => seeds.add(h.toLowerCase()));
    const seedList = [...seeds].filter((s) => s && s.length > 4 && s.length < 80).slice(0, 4);

    // For each seed, run a real DuckDuckGo search and find the competitor's actual position.
    const opportunities = [];
    for (const seed of seedList) {
      const results = await ddgSearch(seed, { maxResults: 10 });
      if (!results.ok) continue;
      const position = results.data.findIndex((r) => {
        try { return new URL(r.url).hostname.includes(host); } catch { return false; }
      });
      const top3 = results.data.slice(0, 3).map((r) => ({ title: r.title.slice(0, 80), host: hostnameOf(r.url) }));
      opportunities.push({
        keyword: seed,
        competitorPosition: position === -1 ? 'not in top 10' : '#' + (position + 1),
        top3
      });
    }

    const lines = [];
    lines.push(`Real Ranking Opportunities — competitor: ${host}`);
    lines.push('Source: Live competitor page parse + DuckDuckGo SERP scrape');
    lines.push('='.repeat(60));
    lines.push('');
    lines.push(`Competitor page title: ${meta.title || '(none)'}`);
    lines.push(`Competitor word count: ${meta.wordCount}`);
    lines.push(`Competitor H1s: ${meta.headings.h1.join(' | ') || '(none)'}`);
    lines.push('');

    if (!opportunities.length) {
      lines.push('Could not extract usable seed keywords from this page.');
    } else {
      lines.push('REAL SERP CHECKS');
      opportunities.forEach((o, i) => {
        lines.push('');
        lines.push(`${i + 1}. "${o.keyword}"`);
        lines.push(`   Competitor SERP position: ${o.competitorPosition}`);
        lines.push(`   Current top 3:`);
        o.top3.forEach((r, j) => lines.push(`     ${j + 1}. ${r.host} — ${r.title}`));
        lines.push(`   Opportunity: write a deeper page on this keyword (target ${Math.max(meta.wordCount + 300, 1500)}+ words).`);
      });
    }

    lines.push('');
    lines.push('STRATEGY');
    lines.push('  • Target the keywords above with original, deeper content.');
    lines.push('  • Add structured FAQ + HowTo schema to win rich results.');
    lines.push('  • Build internal links from your highest-traffic pages to your new page.');

    return NextResponse.json({ success: true, result: lines.join('\n') });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message || 'Server Error' }, { status: 500 });
  }
}
