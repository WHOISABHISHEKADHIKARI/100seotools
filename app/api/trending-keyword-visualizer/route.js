import { NextResponse } from 'next/server';
import { googleTrendsDaily, googleSuggest } from '../../../lib/realData.js';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const seed = (body.seed || '').trim();
    const geo = (body.geo || 'US').toUpperCase();

    const [trends, related] = await Promise.all([
      googleTrendsDaily({ geo }),
      seed ? googleSuggest(seed, { gl: geo }) : Promise.resolve({ ok: true, data: [] })
    ]);

    const lines = [];
    lines.push(`Real Trending Keywords (geo=${geo})`);
    lines.push('Source: Google Trends daily RSS + Google Suggest');
    lines.push('='.repeat(60));
    lines.push('');

    if (trends.ok && trends.data.length) {
      lines.push(`TODAY'S TOP TRENDING SEARCHES IN ${geo}`);
      trends.data.slice(0, 20).forEach((t, i) => {
        const traffic = t.traffic ? `  (${t.traffic})` : '';
        lines.push(`  ${String(i + 1).padStart(2, ' ')}. ${t.title}${traffic}`);
        if (t.news) lines.push(`       ↳ ${t.news.slice(0, 100)}`);
      });
    } else {
      lines.push(`Trends unavailable (${trends.error || 'no data'}).`);
    }

    if (seed) {
      lines.push('');
      lines.push(`RELATED RISING QUERIES FOR "${seed}"`);
      if (related.ok && related.data.length) {
        related.data.slice(0, 15).forEach((q) => lines.push('  • ' + q));
      } else {
        lines.push('  (no autocomplete data)');
      }
    }

    lines.push('');
    lines.push(`Open the live Google Trends explorer:`);
    lines.push(`  https://trends.google.com/trends/explore?geo=${geo}${seed ? '&q=' + encodeURIComponent(seed) : ''}`);

    return NextResponse.json({ success: true, result: lines.join('\n') });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message || 'Server Error' }, { status: 500 });
  }
}
