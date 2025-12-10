import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { a, b } = await request.json();

        if (!a || !b) return NextResponse.json({ success: false, error: 'Both lists required' }, { status: 400 });

        const parse = (text) => new Set(text.split(/[\n,]+/).map(t => t.trim().toLowerCase()).filter(t => t));

        const yourKeywords = parse(a);
        const competitorKeywords = parse(b);

        // Gap: In Competitor, Not in Yours
        const gap = Array.from(competitorKeywords).filter(x => !yourKeywords.has(x));

        // Shared: In Both
        const shared = Array.from(competitorKeywords).filter(x => yourKeywords.has(x));

        // Unique: In Yours, Not Competitor
        const unique = Array.from(yourKeywords).filter(x => !competitorKeywords.has(x));

        let output = `Keyword Gap Analysis:\n`;
        output += `Left List: ${yourKeywords.size} | Right List: ${competitorKeywords.size}\n\n`;

        output += `🔥 THE GAP (Missing Keywords - ${gap.length}):\n`;
        output += gap.length > 0 ? gap.join('\n') : '(None - You cover all competitor keywords)';

        output += `\n\n✅ SHARED (${shared.length}):\n`;
        output += shared.slice(0, 50).join('\n') + (shared.length > 50 ? '\n...' : '');

        output += `\n\n🛡️ UNIQUE TO YOU (${unique.length}):\n`;
        output += unique.slice(0, 50).join('\n') + (unique.length > 50 ? '\n...' : '');

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
