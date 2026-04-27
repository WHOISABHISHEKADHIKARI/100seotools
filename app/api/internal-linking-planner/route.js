import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { content, keywords } = await request.json();

        if (!content || !keywords) return NextResponse.json({ success: false, error: 'Content and Keywords required' }, { status: 400 });

        const text = content;
        const kwList = keywords.split(',').map(k => k.trim()).filter(k => k);

        // Find opportunities
        const opportunities = [];
        kwList.forEach(kw => {
            const regex = new RegExp(`\\b${kw}\\b`, 'gi');
            const matchCount = (text.match(regex) || []).length;
            if (matchCount > 0) {
                opportunities.push({ keyword: kw, count: matchCount });
            }
        });

        // Plan output
        let output = `Internal Linking Plan\n`;
        output += `=====================\n\n`;

        output += `### Linking Opportunities Found\n`;
        if (opportunities.length > 0) {
            opportunities.forEach(op => {
                output += `- **"${op.keyword}"**: Found ${op.count} times. Link to relevant page.\n`;
            });
        } else {
            output += `No direct matches found for your keywords. consider adding a section about them.\n`;
        }

        output += `\n### Strategy Tips\n`;
        output += `1. **Anchor Text**: Use exact match anchors sparingly (varied is better).\n`;
        output += `2. **Relevance**: Ensure the linked page actually expands on the keyword topic.\n`;
        output += `3. **Placement**: Links high up in the content pass more value.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
