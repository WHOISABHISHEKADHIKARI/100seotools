import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ success: false, error: 'Text input is required' }, { status: 400 });
        }

        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;

        // Syllable counting heuristic
        const countSyllables = (word) => {
            word = word.toLowerCase().replace(/[^a-z]/g, '');
            if (word.length <= 3) return 1;
            word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
            word = word.replace(/^y/, '');
            const syl = word.match(/[aeiouy]{1,2}/g);
            return syl ? syl.length : 1;
        };

        const syllables = text.split(/\s+/).reduce((acc, word) => acc + countSyllables(word), 0);

        // Flesch Reading Ease Formula
        // 206.835 - 1.015 (total words / total sentences) - 84.6 (total syllables / total words)
        const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
        const finalScore = Math.max(0, Math.min(100, parseFloat(score.toFixed(1))));

        let difficulty = '';
        if (finalScore >= 90) difficulty = 'Very Easy (5th grade)';
        else if (finalScore >= 80) difficulty = 'Easy (6th grade)';
        else if (finalScore >= 70) difficulty = 'Fairly Easy (7th grade)';
        else if (finalScore >= 60) difficulty = 'Standard (8th-9th grade)';
        else if (finalScore >= 50) difficulty = 'Fairly Difficult (10th-12th grade)';
        else if (finalScore >= 30) difficulty = 'Difficult (College)';
        else difficulty = 'Very Difficult (Professional)';

        const result = {
            score: finalScore,
            difficulty,
            metrics: {
                words,
                sentences,
                syllables,
                avgWordsPerSentence: (words / sentences).toFixed(1),
                avgSyllablesPerWord: (syllables / words).toFixed(1)
            }
        };

        // Return as string for generic display, or modify ToolRunner for JSON.
        // ToolRunner in "api" mode dumps string or JSON.stringify.
        // Let's provide a formatted string for better UX.
        const formattedResult = `Readability Score (Flesch): ${finalScore}/100\nDifficulty: ${difficulty}\n\nMetrics:\n- Words: ${words}\n- Sentences: ${sentences}\n- Syllables: ${syllables}\n- Avg Words/Sentence: ${(words / sentences).toFixed(1)}`;

        return NextResponse.json({
            success: true,
            result: formattedResult
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
