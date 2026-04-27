import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { my_content, competitor_content } = await request.json();

        if (!my_content || !competitor_content) return NextResponse.json({ success: false, error: 'Input required' }, { status: 400 });

        // Content Gap logic focuses on what is MISSING
        const tokenize = (text) => text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
        const mySet = new Set(tokenize(my_content));
        const compSet = new Set(tokenize(competitor_content));

        const missing = [...compSet].filter(w => !mySet.has(w));

        let output = `Content Gap Discovery\n`;
        output += `=====================\n\n`;

        output += `### The Gap\n`;
        output += `Your competitor mentions **${missing.length}** unique terms that you do not.\n\n`;

        output += `### Top Missing Terms\n`;
        const significant = missing.filter(w => w.length > 4).slice(0, 30);
        output += significant.join(', ') + '\n\n';

        output += `### Recommendation\n`;
        output += `Review the list above. Identify high-value topics or entities (not just random words) that are relevant to your user's intent and create a section covering them.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
