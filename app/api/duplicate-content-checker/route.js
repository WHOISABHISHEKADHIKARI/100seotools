import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { a, b } = await request.json();

        if (!a || !b) {
            return NextResponse.json({ success: false, error: 'Both text inputs (Text A and Text B) are required.' }, { status: 400 });
        }

        const tokenize = (str) => {
            return str.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .split(/\s+/)
                .filter(w => w.length > 0);
        };

        const tokensA = tokenize(a);
        const tokensB = tokenize(b);

        const setA = new Set(tokensA);
        const setB = new Set(tokensB);

        // Intersection
        const intersection = new Set([...setA].filter(x => setB.has(x)));

        // Union
        const union = new Set([...setA, ...setB]);

        // Jaccard Index
        const jaccard = union.size === 0 ? 0 : (intersection.size / union.size);
        const percentage = (jaccard * 100).toFixed(2);

        const result = `Similarity Score: ${percentage}%\n` +
            `Unique Words in Text A: ${setA.size}\n` +
            `Unique Words in Text B: ${setB.size}\n` +
            `Common Words: ${intersection.size}\n\n` +
            `Common Words List:\n${Array.from(intersection).slice(0, 50).join(', ')}` +
            (intersection.size > 50 ? '...' : '');

        return NextResponse.json({
            success: true,
            result: result
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
