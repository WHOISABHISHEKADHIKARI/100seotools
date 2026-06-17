import { NextResponse } from 'next/server';

function getAdvice(rank) {
  if (rank === 1) return 'Champion position! Focus on CTR optimization (titles/meta) and monitor for featured snippet opportunities.';
  if (rank <= 3) return 'Excellent visibility. Optimize for "Position Zero" (Featured Snippet) and build brand mentions.';
  if (rank <= 5) return 'Strong Page 1 position. Create supplementary content (FAQ, video) to capture more SERP real estate.';
  if (rank <= 10) return 'Good visibility. Build 2-3 quality backlinks and improve content freshness to climb higher.';
  if (rank <= 15) return 'Bottom of Page 1. Add internal links from high-authority pages and refresh outdated content.';
  if (rank <= 20) return 'Page 2 — "Striking Distance". Update title/meta for better CTR, bulk up content with examples.';
  if (rank <= 30) return 'Page 3. Improve E-E-A-T signals, add schema markup, and target long-tail variations.';
  if (rank <= 50) return 'Deep in results. Focus on topical authority, comprehensive content, and backlinks from related sites.';
  return 'Low visibility. Build foundational SEO: quality content, technical basics, and consistent link building.';
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));

    // Support both single entry and batch entries
    let entries = [];

    if (body.entries && Array.isArray(body.entries)) {
      // JSON BATCH mode: [{ keyword, current_rank, previous_rank }, ...]
      entries = body.entries.map(e => ({
        keyword: e.keyword || `Keyword ${entries.length + 1}`,
        cur: Number(e.current_rank),
        prev: Number(e.previous_rank)
      })).filter(e => Number.isInteger(e.cur) && Number.isInteger(e.prev) && e.cur >= 1 && e.prev >= 1);

      if (entries.length === 0) {
        return NextResponse.json({ success: false, error: 'Provide at least one valid entry with current_rank and previous_rank' }, { status: 400 });
      }
    } else if (body.keywords && typeof body.keywords === 'string' && body.keywords.trim()) {
      // TEXTAREA BATCH mode: "keyword,#12,#15\nkeyword,#8,#10\n..."
      const rawLines = body.keywords.split('\n').filter(Boolean);
      entries = rawLines.map(line => {
        const parts = line.split(',').map(s => s.trim().replace(/^#/, ''));
        if (parts.length < 3) return null;
        const keyword = parts[0];
        const cur = Number(parts[1]);
        const prev = Number(parts[2]);
        if (!Number.isInteger(cur) || !Number.isInteger(prev) || cur < 1 || prev < 1) return null;
        return { keyword, cur, prev };
      }).filter(Boolean);

      if (entries.length === 0) {
        return NextResponse.json({ success: false, error: 'Could not parse any entries. Use format: keyword,current_rank,previous_rank' }, { status: 400 });
      }
    } else {
      // SINGLE mode: { current_rank, previous_rank }
      const cur = Number(body.current_rank);
      const prev = Number(body.previous_rank);
      if (!Number.isInteger(cur) || !Number.isInteger(prev) || cur < 1 || prev < 1) {
        return NextResponse.json({ success: false, error: 'Current and previous ranks must be positive whole numbers' }, { status: 400 });
      }
      entries = [{ keyword: 'Primary Keyword', cur, prev }];
    }

    const totalImprovement = entries.reduce((sum, e) => sum + (e.prev - e.cur), 0);
    const avgPrev = Math.round(entries.reduce((sum, e) => sum + e.prev, 0) / entries.length);
    const avgCur = Math.round(entries.reduce((sum, e) => sum + e.cur, 0) / entries.length);
    const avgPosChange = totalImprovement / entries.length;
    const improved = entries.filter(e => e.cur < e.prev).length;
    const declined = entries.filter(e => e.cur > e.prev).length;
    const stable = entries.filter(e => e.cur === e.prev).length;

    const lines = [];
    lines.push(`# Ranking Progress Report`);
    lines.push('');
    lines.push(`**Keywords Tracked:** ${entries.length}`);
    lines.push(`**Average Position:** #${avgPrev} → #${avgCur} (${avgPosChange >= 0 ? '+' : ''}${avgPosChange.toFixed(1)} positions)`);
    lines.push(`**Improved:** ${improved}  |  **Declined:** ${declined}  |  **Stable:** ${stable}`);
    lines.push(`**Total Movement:** ${Math.abs(totalImprovement)} position${Math.abs(totalImprovement) === 1 ? '' : 's'} ${totalImprovement >= 0 ? 'up' : 'down'}`);
    lines.push('');

    lines.push('## Per-Keyword Breakdown');
    lines.push('');
    entries.forEach((e, i) => {
      const diff = e.prev - e.cur;
      const arrow = diff > 0 ? '↑' : diff < 0 ? '↓' : '→';
      lines.push(`### ${i + 1}. ${e.keyword}`);
      lines.push(`- **Previous:** #${e.prev} → **Current:** #${e.cur} ${arrow}${diff !== 0 ? ` ${Math.abs(diff)} position${Math.abs(diff) === 1 ? '' : 's'} ${diff > 0 ? 'improved' : 'declined'}` : ''}`);
      lines.push(`- ${getAdvice(e.cur)}`);
      lines.push('');
    });

    lines.push('## Optimization Plan');
    if (avgCur <= 10) {
      lines.push('- ✅ Your average position is strong. Focus on CTR optimization and branded traffic.');
      lines.push('- Add FAQ schema and video markup to compete for rich results.');
    } else if (avgCur <= 20) {
      lines.push('- 🎯 Target keywords just above your average with refreshed content and better internal linking.');
      lines.push('- Prioritize keywords where you dropped in position — audit those pages for technical issues.');
      lines.push('- Build 1-2 contextual backlinks per week to pages in positions 11-20.');
    } else {
      lines.push('- 🚀 Focus on low-competition, long-tail keywords to build ranking momentum.');
      lines.push('- Ensure all tracked pages have unique titles, meta descriptions, and H1 tags.');
      lines.push('- Improve page speed and Core Web Vitals for pages outside the top 20.');
    }
    lines.push('- Track rankings weekly and update this report to measure progress.');
    lines.push('');

    lines.push('## Recommendations');
    lines.push(`| Action | Priority |`);
    lines.push(`|---|---|`);
    if (declined > 0) lines.push(`| Audit declined keywords for technical/content issues | High |`);
    if (avgCur > 10) lines.push(`| Improve internal linking to pages outside top 10 | High |`);
    lines.push(`| Refresh content on pages ranked 11-20 | Medium |`);
    lines.push(`| Build topic clusters around your best-performing keywords | Medium |`);
    if (avgCur <= 10) lines.push(`| Optimize titles/meta for featured snippet opportunities | Medium |`);
    lines.push(`| Monitor weekly ranking changes and adjust strategy | Ongoing |`);

    return NextResponse.json({ success: true, result: lines.join('\n') });
  } catch (error) {
    console.error('ranking-progress-tracker error:', error);
    return NextResponse.json({ success: false, error: 'Failed to track ranking progress' }, { status: 500 });
  }
}
