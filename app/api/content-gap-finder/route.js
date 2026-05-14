import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { my_content, competitor_content } = body || {};

        if (typeof my_content !== 'string' || typeof competitor_content !== 'string' || !my_content.trim() || !competitor_content.trim()) {
            return NextResponse.json({ success: false, error: 'My content and competitor content are required' }, { status: 400 });
        }

        const tokenize = (text) => text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
        const mySet = new Set(tokenize(my_content));
        const compSet = new Set(tokenize(competitor_content));
        const missing = [...compSet].filter((word) => !mySet.has(word));
        const significant = missing.filter((word) => word.length > 4).slice(0, 30);

        let output = `Content Gap Discovery\n`;
        output += `=====================\n\n`;
        output += `### The Gap\n`;
        output += `Your competitor mentions **${missing.length}** unique terms that you do not.\n\n`;
        output += `### Top Missing Terms\n`;
        output += `${significant.join(', ') || 'No significant missing terms found.'}\n\n`;
        output += `### Recommendation\n`;
        output += `Review the list above. Identify high-value topics or entities that are relevant to your user's intent and create a section covering them.`;

        return NextResponse.json({ success: true, result: output });
    } catch (error) {
        console.error('content-gap-finder error:', error);
        return NextResponse.json({ success: false, error: 'Failed to analyze content gap' }, { status: 500 });
    }
}
