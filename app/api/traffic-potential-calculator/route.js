import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { volume, position } = await request.json();

        if (!volume || !position) return NextResponse.json({ success: false, error: 'Volume and Position required' }, { status: 400 });

        const vol = parseInt(volume);
        const pos = parseInt(position);

        // Standard CTR Curve (Approximate)
        const curve = {
            1: 0.31, 2: 0.16, 3: 0.11, 4: 0.07, 5: 0.05,
            6: 0.03, 7: 0.02, 8: 0.02, 9: 0.01, 10: 0.01
        };

        // Fallback for > 10
        const ctr = curve[pos] || (pos <= 20 ? 0.005 : 0);

        const traffic = Math.round(vol * ctr);

        let output = `Estimated Monthly Traffic: ${traffic} visits\n\n`;
        output += `Parameters:\n`;
        output += `- Search Volume: ${vol}\n`;
        output += `- Ranking Position: ${pos}\n`;
        output += `- Estimated CTR: ${(ctr * 100).toFixed(1)}%\n\n`;

        output += `Scenario Analysis:\n`;
        if (pos > 1) output += `- If you rank #1: ~${Math.round(vol * 0.31)} visits (+${Math.round(vol * 0.31) - traffic})\n`;
        if (pos > 3) output += `- If you rank #3: ~${Math.round(vol * 0.11)} visits (+${Math.round(vol * 0.11) - traffic})\n`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
