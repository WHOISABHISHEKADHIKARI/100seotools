import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { current_rank, previous_rank } = body || {};
        const cur = Number(current_rank);
        const prev = Number(previous_rank);

        if (!Number.isInteger(cur) || !Number.isInteger(prev) || cur < 1 || prev < 1) {
            return NextResponse.json({ success: false, error: 'Current and previous ranks must be positive whole numbers' }, { status: 400 });
        }

        const diff = prev - cur;
        const status = diff > 0 ? 'Improved' : diff < 0 ? 'Declined' : 'Stable';

        let output = `Ranking Progress Report\n`;
        output += `=======================\n\n`;
        output += `### Movement: ${Math.abs(diff)} Positions ${status}\n`;
        output += `- Previous: #${prev}\n`;
        output += `- Current:  #${cur}\n\n`;
        output += `### Analysis\n`;

        if (cur === 1) output += `**Champion**: You are ranking #1. Focus on CTR optimization (Titles/Meta).\n`;
        else if (cur <= 3) output += `**Top 3**: Excellent. Check for "Position Zero" (Featured Snippet) opportunities.\n`;
        else if (cur <= 10) output += `**Page 1**: Good visibility. Build a few backlinks to push closer to top 3.\n`;
        else if (cur <= 20) output += `**Page 2**: "Striking Distance". Update content freshness to jump to Page 1.\n`;
        else output += `**Developing**: Keep building authority and relevance.\n`;

        return NextResponse.json({ success: true, result: output });
    } catch (error) {
        console.error('ranking-progress-tracker error:', error);
        return NextResponse.json({ success: false, error: 'Failed to track ranking progress' }, { status: 500 });
    }
}
