import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { input } = await request.json(); // Standard fallback field

        if (!input) return NextResponse.json({ success: false, error: 'Keywords required' }, { status: 400 });

        const keywords = input.split(/[\n,]+/).map(k => k.trim()).filter(k => k);

        if (keywords.length === 0) return NextResponse.json({ success: false, error: 'No valid keywords found' }, { status: 400 });

        let result = `Comparison of ${keywords.length} keywords:\n\n`;

        // Header
        result += `KEYWORD | WORDS | CHARS | TYPE\n`;
        result += `--- | --- | --- | ---\n`;

        keywords.forEach(k => {
            const w = k.split(/\s+/).length;
            const c = k.length;
            let type = 'Head';
            if (w >= 3) type = 'Body';
            if (w >= 5) type = 'Long Tail';

            result += `${k} | ${w} | ${c} | ${type}\n`;
        });

        result += `\n\nTotal Words: ${keywords.reduce((a, b) => a + b.split(/\s+/).length, 0)}`;

        return NextResponse.json({ success: true, result });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
