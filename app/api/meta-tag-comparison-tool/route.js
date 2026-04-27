import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { a, b } = await request.json();

        if (!a || !b) return NextResponse.json({ success: false, error: 'Both inputs required' }, { status: 400 });

        const clean = (txt) => txt.split('\n').map(l => l.trim()).filter(l => l);
        const linesA = clean(a);
        const linesB = clean(b);

        const setA = new Set(linesA);
        const setB = new Set(linesB);

        const missingInB = linesA.filter(x => !setB.has(x));
        const missingInA = linesB.filter(x => !setA.has(x));
        const shared = linesA.filter(x => setB.has(x));

        let output = `Comparison Result:\n`;
        output += `Set A: ${linesA.length} lines | Set B: ${linesB.length} lines\n\n`;

        output += `✅ MATCHING (${shared.length}):\n`;
        output += shared.join('\n') + '\n\n';

        output += `❌ MISSING IN B (Present in A):\n`;
        output += missingInB.length ? missingInB.join('\n') : '(None)';
        output += '\n\n';

        output += `🆕 NEW IN B (Missing in A):\n`;
        output += missingInA.length ? missingInA.join('\n') : '(None)';

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
