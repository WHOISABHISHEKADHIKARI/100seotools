import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { topic, intent, competitorAvgWords, sectionCount, audienceLevel } = await request.json();

        if (!topic) return NextResponse.json({ success: false, error: 'Topic required' }, { status: 400 });

        const k = topic.toLowerCase();
        const i = (intent || 'informational').toLowerCase();
        const avg = Number(competitorAvgWords || 0);

        let base = 1500;

        // Intent Adjustments
        if (i === 'transactional') base = 800;
        else if (i === 'navigational') base = 600;
        else if (i === 'commercial') base = 1800;
        else if (i === 'informational') base = 1400;

        // Competitor influence
        if (avg > 0) {
            base = Math.round((base * 0.6) + (avg * 0.4));
        }

        // Section count influence
        const sections = Number(sectionCount || 8);
        base += (sections * 150);

        // Audience Level Adjustment
        if (audienceLevel === 'advanced') base = Math.round(base * 1.2);
        else if (audienceLevel === 'beginner') base = Math.round(base * 0.9);

        // Keyword depth hints
        if (k.includes('how to')) base += 300;
        if (k.includes('beginners')) base += 200;
        if (k.includes('best') || k.includes('top')) base += 500;

        // Random variation for more "natural" feel
        base += Math.floor(Math.random() * 100) - 50;
        base = Math.max(300, base);

        const result = {
            target_word_count: base,
            min: Math.floor(base * 0.85),
            max: Math.ceil(base * 1.15),
            recommendations: [
                ai - article - length - optimizer`Structure your content into ${sections} clear sections.`,
                `Target an audience at the ${audienceLevel || 'intermediate'} level.`,
                base > 2000 ? "Include a detailed table of contents and deep-dive case studies." : "Focus on direct answers and concise explanations."
            ]
        };

        let output = `Recommended Content Length for: "${topic}"\n`;
        output += `🎯 Target: ${result.target_word_count} words\n`;
        output += `Range: ${result.min} - ${result.max} words\n\n`;
        output += `Strategy Recommendations:\n`;
        result.recommendations.forEach(r => output += `- ${r}\n`);

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
