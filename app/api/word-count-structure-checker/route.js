import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ success: false, error: 'Text input is required' }, { status: 400 });
        }

        const cleanText = text.replace(/\s+/g, ' ').trim();
        if (!cleanText) {
            return NextResponse.json({ success: true, result: 'Empty text.' });
        }

        const words = cleanText.split(' ').length;
        const chars = text.length;
        const charsNoSpace = text.replace(/\s/g, '').length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

        // Reading Time (avg 200 wpm)
        const readingTimeMin = Math.ceil(words / 200);

        // Speaking Time (avg 130 wpm)
        const speakingTimeMin = Math.ceil(words / 130);

        const result = [
            '--- Statistics ---',
            `Words: ${words}`,
            `Characters: ${chars}`,
            `Characters (no spaces): ${charsNoSpace}`,
            `Sentences: ${sentences || 1}`,
            `Paragraphs: ${paragraphs || 1}`,
            '',
            '--- Estimations ---',
            `Reading Time: ~${readingTimeMin} min`,
            `Speaking Time: ~${speakingTimeMin} min`,
            '',
            '--- Density Top 5 ---',
        ];

        // Simple density
        const wordMap = {};
        cleanText.toLowerCase().replace(/[^\w\s]/g, '').split(' ').forEach(w => {
            if (w.length > 3) wordMap[w] = (wordMap[w] || 0) + 1;
        });

        const sorted = Object.entries(wordMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
        sorted.forEach(([w, c]) => result.push(`${w}: ${c}`));

        return NextResponse.json({
            success: true,
            result: result.join('\n')
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
