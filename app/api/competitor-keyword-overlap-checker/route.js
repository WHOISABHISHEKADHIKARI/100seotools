import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const my_content = body.a || body.my_content;
        const competitor_content = body.b || body.competitor_content;

        if (!my_content || !competitor_content) return NextResponse.json({ success: false, error: 'Input required' }, { status: 400 });

        const tokenize = (text) => {
            if (!text || typeof text !== 'string') return [];
            return text.toLowerCase()
                .replace(/[^a-z0-9\s-]/g, ' ')
                .split(/\s+/)
                .filter(w => w.length >= 2); // Include 2+ letter words like "ai", "seo"
        };
        const myWords = tokenize(my_content);
        const compWords = tokenize(competitor_content);

        const mySet = new Set(myWords);
        const compSet = new Set(compWords);
        const totalUnique = new Set([...mySet, ...compSet]).size;

        // Overlap
        const overlap = [...compSet].filter(w => mySet.has(w));

        // Overlap Score
        const overlapScore = totalUnique > 0 ? (overlap.length / totalUnique) * 100 : 0;

        let output = `Competitor Keyword Overlap Report\n`;
        output += `=================================\n\n`;

        output += `### Overlap Analysis\n`;
        output += `- **Shared Unique Keywords**: ${overlap.length}\n`;
        output += `- **Overlap Index**: ${overlapScore.toFixed(1)}%\n\n`;

        output += `### Top Shared Keywords\n`;
        output += overlap.slice(0, 20).join(', ') + '\n\n';

        output += `### Strategic Insight\n`;
        if (overlapScore > 50) {
            output += `You have high content parity with your competitor. To win, focus on **User Experience** and **Backlinks** as content is similar.`;
        } else if (overlapScore > 20) {
            output += `Moderate overlap. You cover some similar ground but have distinct angles. Look at what they have that you don't (Content Gap).`;
        } else {
            output += `Low overlap. You are likely targeting different sub-niches or intents. Ensure you aren't missing the core industry terms.`;
        }

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
