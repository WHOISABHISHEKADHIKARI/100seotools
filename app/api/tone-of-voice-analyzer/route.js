import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { content } = await request.json();

        if (!content) return NextResponse.json({ success: false, error: 'Content required' }, { status: 400 });

        const text = content.toLowerCase();

        let tone = 'Neutral';
        let sentiment = 'Objective';

        // Simple keyword heuristics
        const formalWords = ['therefore', 'furthermore', 'consequently', 'regarding', 'ensure'];
        const casualWords = ['cool', 'awesome', 'stuff', 'super', 'guess', 'check out'];
        const aggressiveWords = ['buy now', 'hurry', 'limited time', 'don\'t miss', 'act fast'];
        const helpfulWords = ['guide', 'help', 'learn', 'understand', 'steps', 'how to'];

        const count = (arr) => arr.reduce((acc, w) => acc + (text.includes(w) ? 1 : 0), 0);

        if (count(aggressiveWords) > 0) { tone = 'Urgent / Salesy'; sentiment = 'High Energy'; }
        else if (count(formalWords) > count(casualWords)) { tone = 'Formal / Professional'; sentiment = 'Serious'; }
        else if (count(casualWords) > count(formalWords)) { tone = 'Casual / Friendly'; sentiment = 'Relaxed'; }
        else if (count(helpfulWords) > 1) { tone = 'Educational / Helpful'; sentiment = 'Supportive'; }

        let output = `Tone of Voice Analysis\n`;
        output += `======================\n\n`;

        output += `### Detected Tone: **${tone}**\n`;
        output += `### Sentiment: **${sentiment}**\n\n`;

        output += `### Key Indicators\n`;
        if (tone.includes('Formal')) output += `- Uses structured transition words (e.g. therefore, regarding).\n- Good for B2B or academic content.\n`;
        else if (tone.includes('Casual')) output += `- Uses conversational language.\n- Good for blogs and social media.\n`;
        else if (tone.includes('Sales')) output += `- Uses strong Call-to-Actions (CTAs).\n- Good for landing pages.\n`;
        else output += `- Balanced language detected.\n`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
