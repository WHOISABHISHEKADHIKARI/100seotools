import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { keyword, topic, type } = await request.json();

        const finalKeyword = keyword || topic;

        if (!finalKeyword) return NextResponse.json({ success: false, error: 'Keyword required' }, { status: 400 });

        const k = finalKeyword.toLowerCase();
        const t = (type || '').toLowerCase();

        let base = 1500;

        // Type Adjustments
        if (t.includes('product') || t.includes('categorical')) base = 800;
        else if (t.includes('news') || t.includes('update')) base = 600;
        else if (t.includes('guide') || t.includes('tutorial')) base = 2500;

        // Keyword Intent Adjustments
        if (k.includes('how to')) base += 500;
        if (k.includes('beginners')) base += 300;
        if (k.includes('guide')) base += 500;
        if (k.includes('best') || k.includes('top')) base += 1000; // Lists are long
        if (k.includes('vs') || k.includes('review')) base += 800;

        // Random variation
        base += Math.floor(Math.random() * 200) - 100;
        base = Math.max(300, base);

        const result = {
            target_word_count: base,
            min: Math.floor(base * 0.9),
            max: Math.ceil(base * 1.1),
            recommendations: [
                "Cover the 'What', 'Why', and 'How' aspects.",
                base > 2000 ? "Include a table of contents for better navigation." : "Keep paragraphs short."
            ]
        };

        let output = `Recommended Content Length for "${keyword}":\n`;
        output += `🎯 Target: ${result.target_word_count} words\n`;
        output += `Range: ${result.min} - ${result.max} words\n\n`;
        output += `Strategy Recommendations:\n`;
        result.recommendations.forEach(r => output += `- ${r}\n`);

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
