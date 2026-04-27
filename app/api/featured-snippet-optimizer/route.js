import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { keyword, content } = await request.json();

        if (!keyword) return NextResponse.json({ success: false, error: 'Keyword required' }, { status: 400 });

        const text = content || '';
        const words = text.split(/\s+/).length;

        // Heuristics for Position Zero (Featured Snippet)
        // Ideally 40-60 words roughly.
        // Definitions often start with "X is..."
        // Lists are good for "How to..."

        const isQuestion = /^(what|how|why|when|where|who)/i.test(keyword);
        const isList = text.includes('\n-') || text.includes('\n1.');
        const startsWithDirectAnswer = new RegExp(`^${keyword} is`, 'i').test(text) || /is (a|the|an)/i.test(text.substring(0, 20));

        let score = 0;
        if (words >= 40 && words <= 60) score += 40;
        else if (words > 20 && words < 80) score += 20;

        if (startsWithDirectAnswer) score += 30;
        if (isList && keyword.toLowerCase().includes('how')) score += 30;

        score = Math.min(100, score);

        let output = `Featured Snippet Optimization Report\n`;
        output += `====================================\n\n`;

        output += `Target: "${keyword}"\n`;
        output += `Snippet Score: **${score}/100**\n\n`;

        output += `### Analysis\n`;
        output += `- **Length**: ${words} words (${words >= 40 && words <= 60 ? '✅ Perfect range 40-60w' : '⚠️ Aim for 40-60 words'})\n`;
        output += `- **Direct Answer**: ${startsWithDirectAnswer ? '✅ Starts with direct definition' : '⚠️ Start directly with the answer (e.g. "X is...")'}\n`;
        output += `- **Format**: ${isList ? 'List detected' : 'Paragraph detected'}. ${keyword.toLowerCase().includes('how') && !isList ? '💡 "How-to" queries prefer Lists.' : ''}\n\n`;

        output += `### Optimization Template\n`;
        if (keyword.toLowerCase().includes('how')) {
            output += `**${keyword}**\n\n1. Step one...\n2. Step two...\n3. Step three...`;
        } else {
            output += `**${keyword}**\n\n${keyword} is a [definition] that [function]. It is used for [benefit].`;
        }

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
