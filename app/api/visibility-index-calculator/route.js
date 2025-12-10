import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { rankings } = await request.json();

        if (!rankings) return NextResponse.json({ success: false, error: 'Rankings required' }, { status: 400 });

        const posList = rankings.split(',').map(r => parseInt(r.trim())).filter(r => !isNaN(r));

        if (posList.length === 0) return NextResponse.json({ success: false, error: 'No valid numbers found' }, { status: 400 });

        // Simple Visibility Index Calculation
        // Pos 1 = 100pts
        // Pos 2 = 80pts
        // Pos 3 = 60pts
        // Pos 4-10 = 20pts
        // Pos 11+ = 0pts

        let totalScore = 0;
        let maxPossible = posList.length * 100;

        posList.forEach(p => {
            if (p === 1) totalScore += 100;
            else if (p === 2) totalScore += 80;
            else if (p === 3) totalScore += 60;
            else if (p <= 10) totalScore += 20;
            else totalScore += 0;
        });

        const visibilityPct = (totalScore / maxPossible) * 100;

        let output = `SEO Visibility Index\n`;
        output += `====================\n\n`;

        output += `### Score: ${visibilityPct.toFixed(1)} / 100\n\n`;

        output += `### Breakdown\n`;
        output += `- **Total Keywords Evaluated**: ${posList.length}\n`;
        output += `- **Weighted Points**: ${totalScore}\n`;

        output += `\n### Interpretation\n`;
        if (visibilityPct > 80) output += `🚀 **Dominant**: You "own" the SERPs for these terms. Excellent!`;
        else if (visibilityPct > 50) output += `✅ **Strong**: Good presence, mostly Page 1 rankings.`;
        else if (visibilityPct > 20) output += `⚠️ **Visible**: You are seen, but likely at the bottom of Page 1 or top of Page 2.`;
        else output += `❌ **Invisible**: Most rankings are deep in Page 2+. Need aggressive SEO.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
