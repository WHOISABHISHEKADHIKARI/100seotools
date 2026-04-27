import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { current_rank, previous_rank } = await request.json();

        const cur = parseInt(current_rank);
        const prev = parseInt(previous_rank);

        if (isNaN(cur) || isNaN(prev)) return NextResponse.json({ success: false, error: 'Valid ranks required' }, { status: 400 });

        const diff = prev - cur; // Positive means improvement (e.g. 15 -> 12 = 3 positions gained)
        let status = '';
        let icon = '';

        if (diff > 0) { status = 'Improved'; icon = '📈'; }
        else if (diff < 0) { status = 'Declined'; icon = '📉'; }
        else { status = 'Stable'; icon = '➖'; }

        let output = `Ranking Progress Report\n`;
        output += `=======================\n\n`;

        output += `### Movement: ${icon} ${Math.abs(diff)} Positions ${status}\n`;
        output += `- Previous: #${prev}\n`;
        output += `- Current:  #${cur}\n\n`;

        output += `### Analysis\n`;
        if (cur === 1) output += `🏆 **Champion**: You are ranking #1. Focus on CTR optimization (Titles/Meta).\n`;
        else if (cur <= 3) output += `🔥 **Top 3**: Excellent. Check for "Position Zero" (Featured Snippet) opportunities.\n`;
        else if (cur <= 10) output += `✅ **Page 1**: Good visibility. Build a few backlinks to push closer to top 3.\n`;
        else if (cur <= 20) output += `⚠️ **Page 2**: "Striking Distance". update content freshness to jump to Page 1.\n`;
        else output += `⏳ **Developing**: Keep building authority and relevance.\n`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
