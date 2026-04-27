import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const a = body.a || body.input || '';
        const b = body.b || '';

        if (!a) return NextResponse.json({ success: false, error: 'Keywords required' }, { status: 400 });

        const parse = (text) => text.split(/[\n,]+/).map(k => k.trim()).filter(k => k);
        const keywordsA = parse(a);
        const keywordsB = parse(b);

        if (keywordsA.length === 0 && keywordsB.length === 0) {
            return NextResponse.json({ success: false, error: 'No valid keywords found' }, { status: 400 });
        }

        let result = `Keyword Comparison Report\n`;
        result += `=========================\n\n`;

        if (keywordsB.length > 0) {
            // Comparative view
            result += `| Metric | List A | List B |\n`;
            result += `| :--- | :--- | :--- |\n`;
            result += `| Total Keywords | ${keywordsA.length} | ${keywordsB.length} |\n`;
            
            const setA = new Set(keywordsA.map(k => k.toLowerCase()));
            const setB = new Set(keywordsB.map(k => k.toLowerCase()));
            const shared = [...setA].filter(k => setB.has(k));
            
            result += `| Shared Keywords | ${shared.length} | ${shared.length} |\n`;
            result += `| Unique to List | ${keywordsA.length - shared.length} | ${keywordsB.length - shared.length} |\n\n`;
            
            result += `### Detailed Analysis\n\n`;
            result += `**List A Overview:**\n`;
            result += `- Avg Length: ${Math.round(keywordsA.join('').length / keywordsA.length)} chars\n`;
            result += `- Long-tail (>3 words): ${keywordsA.filter(k => k.split(/\s+/).length > 3).length}\n\n`;
            
            result += `**List B Overview:**\n`;
            result += `- Avg Length: ${Math.round(keywordsB.join('').length / keywordsB.length)} chars\n`;
            result += `- Long-tail (>3 words): ${keywordsB.filter(k => k.split(/\s+/).length > 3).length}\n`;
        } else {
            // Single list analysis
            result += `Analysis of ${keywordsA.length} keywords:\n\n`;
            result += `| KEYWORD | WORDS | CHARS | TYPE |\n`;
            result += `| :--- | :--- | :--- | :--- |\n`;

            keywordsA.forEach(k => {
                const w = k.split(/\s+/).length;
                const c = k.length;
                let type = 'Head';
                if (w >= 3) type = 'Body';
                if (w >= 5) type = 'Long Tail';
                result += `| ${k} | ${w} | ${c} | ${type} |\n`;
            });
        }

        return NextResponse.json({ success: true, result });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
