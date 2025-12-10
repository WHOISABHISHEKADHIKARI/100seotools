import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { content, query } = await request.json();

        if (!content || !query) return NextResponse.json({ success: false, error: 'Content and Query required' }, { status: 400 });

        const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
        const qWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);

        const scored = sentences.map(s => {
            let score = 0;
            const sLow = s.toLowerCase();

            // Match words
            qWords.forEach(w => {
                if (sLow.includes(w)) score += 10;
            });

            // Exact phrase bonus
            if (sLow.includes(query.toLowerCase())) score += 30;

            // Length penalty (Snippets usually 40-60 words)
            const words = s.split(/\s+/).length;
            if (words < 10) score -= 10;
            if (words > 60) score -= 5;
            if (words > 100) score -= 20;

            // "Is a" bonus (Definition style)
            if (sLow.includes(' is ') || sLow.includes(' are ') || sLow.includes(' refers to ')) score += 5;

            return { text: s.trim(), score };
        });

        scored.sort((a, b) => b.score - a.score);
        const best = scored[0];

        let output = `AI Suggested Snippet for "${query}":\n\n`;

        if (best && best.score > 0) {
            output += `"${best.text}"\n\n`;
            output += `(Confidence Score: ${best.score})`;
        } else {
            output += `Could not find a high-confidence snippet in the provided text. Try ensuring the text explicitly defines the query.`;
        }

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
