import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { text } = await request.json();

        if (!text || text.length < 50) return NextResponse.json({ success: false, error: 'Please enter at least 50 characters.' }, { status: 400 });

        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);

        // Calculate Variance
        const mean = sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length;
        const variance = sentenceLengths.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / sentenceLengths.length;

        // AI Score (Simple Heuristic: Low variance = AI)
        // Human variance is usually high (short sentence. long sentence. medium.)
        // AI is often very uniform (medium. medium. medium.)

        let aiScore = 0;
        if (variance < 10) aiScore += 60;
        else if (variance < 20) aiScore += 40;
        else if (variance < 40) aiScore += 10;

        // Check for AI "tells"
        const aiWords = ['furthermore', 'morover', 'in conclusion', 'it is worth noting', 'delve into', 'comprehensive', 'landscape', 'tapestry'];
        const foundAiWords = aiWords.filter(w => text.toLowerCase().includes(w));
        aiScore += foundAiWords.length * 10;

        aiScore = Math.min(99, Math.max(1, aiScore));
        let humanScore = 100 - aiScore;

        let verdict = '';
        if (aiScore > 80) verdict = 'Likely AI-Generated';
        else if (aiScore > 50) verdict = 'Mixed / Uncertain';
        else verdict = 'Likely Human-Written';

        const output = `AI Content Analysis:\n` +
            `AI Probability: ${aiScore}%\n` +
            `Human Probability: ${humanScore}%\n` +
            `Verdict: ${verdict}\n\n` +
            `Indicators:\n` +
            `- Sentence Variance: ${variance.toFixed(1)} (Lower = More Robotic)\n` +
            `- AI Stopwords Found: ${foundAiWords.length > 0 ? foundAiWords.join(', ') : 'None'}`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
