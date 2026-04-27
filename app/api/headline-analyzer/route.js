import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { headline } = await request.json();

        if (!headline) return NextResponse.json({ success: false, error: 'Headline required' }, { status: 400 });

        const h = headline.trim();
        const words = h.split(/\s+/).length;
        const chars = h.length;

        // Power words list (mini)
        const powerWords = ['best', 'ultimate', 'guide', 'proven', 'secret', 'hack', 'review', 'vs', 'free', 'easy', 'how to'];
        const emotionalWords = ['amazing', 'shocking', 'critical', 'essential', 'insane', 'love', 'hate', 'powerful'];

        const foundPower = powerWords.filter(w => h.toLowerCase().includes(w));
        const foundEmotion = emotionalWords.filter(w => h.toLowerCase().includes(w));

        let score = 50; // Base
        score += foundPower.length * 10;
        score += foundEmotion.length * 10;
        if (chars >= 40 && chars <= 65) score += 10;
        else score -= 5;

        if (words >= 6 && words <= 12) score += 10;

        score = Math.min(100, Math.max(0, score));

        let output = `Headline Analyzer Report\n`;
        output += `========================\n\n`;

        output += `Headline: "${h}"\n`;
        output += `Score: **${score}/100**\n\n`;

        output += `### Breakdown\n`;
        output += `- **Length**: ${chars} chars (${chars >= 50 && chars <= 60 ? '✅ Perfect' : '⚠️ Aim for 50-60'})\n`;
        output += `- **Word Count**: ${words} words (${words >= 6 ? '✅ Good' : '⚠️ Too short'})\n`;
        output += `- **Power Words**: ${foundPower.length > 0 ? '✅ Found (' + foundPower.join(', ') + ')' : '❌ None found'}\n`;
        output += `- **Emotional Words**: ${foundEmotion.length > 0 ? '✅ Found (' + foundEmotion.join(', ') + ')' : '❌ None found'}\n\n`;

        output += `### Suggestions\n`;
        if (foundPower.length === 0) output += `- Add a power word like "Ultimate", "Best", or "Proven".\n`;
        if (chars < 40) output += `- Expand the title to be more descriptive.\n`;
        if (chars > 70) output += `- Shorten the title to prevent truncation in SERPs.\n`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
