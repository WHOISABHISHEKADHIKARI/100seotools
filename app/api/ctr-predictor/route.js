import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { keyword, position } = await request.json();

        if (!keyword) return NextResponse.json({ success: false, error: 'Keyword required' }, { status: 400 });

        const pos = parseInt(position) || 5;

        // Base generic average CTR curve (heuristic)
        // Pos 1: ~30%, Pos 2: ~15%, Pos 3: ~10%...
        const ctrCurve = {
            1: 31.7, 2: 24.7, 3: 18.6, 4: 13.6, 5: 9.5,
            6: 6.2, 7: 4.1, 8: 3.1, 9: 2.9, 10: 2.5
        };

        const predictedCTR = ctrCurve[pos] || 1.0;

        // Adjust for keyword length (longer keywords = higher intent = slightly higher CTR typically)
        const words = keyword.trim().split(/\s+/).length;
        const adjustment = words > 3 ? 1.2 : 1.0;

        const finalCTR = (predictedCTR * adjustment).toFixed(2);

        // Traffic estimation (assuming 1000 vol for demo)
        const vol = 1000;
        const potentialTraffic = Math.round(vol * (finalCTR / 100));

        let output = `CTR Prediction Report\n`;
        output += `=====================\n\n`;

        output += `Keyword: "${keyword}"\n`;
        output += `Target Position: ${pos}\n\n`;

        output += `### Predicted CTR: ${finalCTR}%\n`;
        output += `Estimated Clicks (per 1k vol): ${potentialTraffic}\n\n`;

        output += `### Recommendations to Improve CTR\n`;
        output += `1. **Title Optimization**: Ensure your title matches the intent behind "${keyword}".\n`;
        output += `2. **Meta Description**: Include a clear call-to-action.\n`;
        output += `3. **Rich Snippets**: Try to win star ratings or FAQ schema to increase visibility space.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
