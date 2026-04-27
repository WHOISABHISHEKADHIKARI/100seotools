import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { title, description } = await request.json();

        const t = title || '';
        const d = description || '';

        // Pixel Estimation (Rough)
        // Avg char width for Title (larger font) ~ 10px
        // Avg char width for Desc (smaller font) ~ 7px
        // Real calculation requires canvas, backend estimation is approximated.

        // Weights: W=13, I=4, etc.
        const calcWidth = (str, factor) => {
            let width = 0;
            for (let char of str) {
                if ('ili'.includes(char)) width += 0.4 * factor;
                else if ('mwMW'.includes(char)) width += 1.2 * factor;
                else if ('t'.includes(char)) width += 0.5 * factor;
                else if (/[A-Z]/.test(char)) width += 0.9 * factor;
                else width += 0.7 * factor;
            }
            return Math.round(width * 10); // Scale roughly to pixels
        };

        const tPx = calcWidth(t, 1.4); // Title font larger
        const dPx = calcWidth(d, 0.9); // Desc font smaller

        let output = `Analysis Results:\n\n`;

        output += `TITLE: "${t}"\n`;
        output += `- Length: ${t.length} chars (Limit: 60)\n`;
        output += `- Width: ~${tPx}px (Limit: 580px)\n`;
        output += `- Status: ${t.length > 60 || tPx > 580 ? '❌ Too Long' : '✅ Good'}\n\n`;

        output += `DESCRIPTION: "${d}"\n`;
        output += `- Length: ${d.length} chars (Limit: 160)\n`;
        output += `- Width: ~${dPx}px (Limit: 920px)\n`;
        output += `- Status: ${d.length > 160 || dPx > 920 ? '❌ Too Long' : '✅ Good'}`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
