import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { content } = await request.json();

        if (!content) return NextResponse.json({ success: false, error: 'Content required' }, { status: 400 });

        const text = content;

        // 1. Identify Capitalized Phrases (Potential Entities)
        // Matches "Word Word" inside text (not at start of sentence is hard to detect without NLP,
        // but we'll simplisticly match Capitalized words that aren't first word? No, simply match all Caps sequences)
        const capRegex = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
        const caps = text.match(capRegex) || [];

        // 2. Frequency Analysis
        const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 4);
        const freq = {};
        const stops = new Set(['about', 'after', 'again', 'below', 'could', 'every', 'first', 'found', 'great', 'hours', 'large', 'later', 'money', 'never', 'often', 'other', 'place', 'point', 'price', 'power', 'right', 'short', 'since', 'small', 'sound', 'state', 'still', 'study', 'their', 'there', 'these', 'thing', 'think', 'those', 'three', 'today', 'under', 'water', 'where', 'which', 'world', 'would', 'write']);

        words.forEach(w => {
            if (!stops.has(w)) freq[w] = (freq[w] || 0) + 1;
        });

        const topWords = Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(x => x[0]);

        // Combine
        const candidates = new Set([...caps.filter(c => c.length > 3 && !stops.has(c.toLowerCase())), ...topWords]);

        const list = Array.from(candidates).slice(0, 20);

        let output = `Found ${list.length} potential internal link opportunities in your text.\n`;
        output += `Consider linking these phrases to relevant pages on your site:\n\n`;

        list.forEach(item => {
            output += `🔗 ${item}\n`;
        });

        output += `\n(Tip: Validating these against your actual sitemap would require site crawling, currently this tool analyzes content potential only)`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
