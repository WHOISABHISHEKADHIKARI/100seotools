import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { volume, difficulty } = await request.json();

        const vol = parseInt(volume) || 1000;
        const kd = parseInt(difficulty) || 50; // 0-100

        // Heuristic: Higher difficulty = lower immediate share
        // Assume we can rank on Page 1 eventually if we work hard.
        // Let's protect realistic CTR share.

        // KD 0-20 (Easy): Share ~ 20% (Pos 1-3 likely)
        // KD 21-50 (Med): Share ~ 5% (Pos 5-10 likely)
        // KD 51+ (Hard): Share ~ 0.5% (Page 2 likely initially)

        let sharePct = 0;
        let difficultyLabel = '';

        if (kd <= 20) { sharePct = 20; difficultyLabel = 'Easy'; }
        else if (kd <= 50) { sharePct = 5; difficultyLabel = 'Medium'; }
        else if (kd <= 80) { sharePct = 1; difficultyLabel = 'Hard'; }
        else { sharePct = 0.1; difficultyLabel = 'Very Hard'; }

        const estTraffic = Math.round(vol * (sharePct / 100));

        let output = `Keyword Share of Voice Estimation\n`;
        output += `=================================\n\n`;

        output += `Inputs:\n- Volume: ${vol}\n- Difficulty: ${kd} (${difficultyLabel})\n\n`;

        output += `### Estimates\n`;
        output += `Expected Search Share: ~${sharePct}%\n`;
        output += `Estimated Monthly Traffic: **${estTraffic} visitors**\n\n`;

        output += `### Insight\n`;
        if (kd > 60) {
            output += `This is a highly competitive term. It will take significant links and time to capture even a small share.`;
        } else if (kd < 30) {
            output += `This is a low-hanging fruit! You can capture significant traffic relatively quickly.`;
        } else {
            output += `Moderate effort required. Good target for consistent content strategy.`;
        }

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
