import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { text } = await request.json();

        if (!text) return NextResponse.json({ success: false, error: 'Text required' }, { status: 400 });

        // Basic Flesch-Kincaid simulation
        const words = text.split(/\s+/).length;
        const sentences = text.split(/[.!?]+/).length;
        const syllables = text.length / 3; // Rough approximation

        // Formula: 206.835 - 1.015(total words / total sentences) - 84.6(total syllables / total words)
        const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);

        let grade = '';
        if (score > 90) grade = 'Very Easy (5th grade)';
        else if (score > 80) grade = 'Easy (6th grade)';
        else if (score > 60) grade = 'Standard (8th-9th grade)';
        else if (score > 50) grade = 'Fairly Difficult (High School)';
        else if (score > 30) grade = 'Difficult (College)';
        else grade = 'Very Difficult (Academic)';

        const longSentences = text.split(/[.!?]+/).filter(s => s.trim().split(/\s+/).length > 20);

        let output = `Readability Analysis\n`;
        output += `====================\n\n`;

        output += `### Scores\n`;
        output += `- **Readability Score**: ${Math.round(score)}/100\n`;
        output += `- **Grade Level**: ${grade}\n\n`;

        output += `### Suggestions\n`;
        if (longSentences.length > 0) {
            output += `⚠️ **Shorten these sentences** (over 20 words):\n`;
            longSentences.slice(0, 3).forEach(s => output += `> "${s.trim()}..."\n`);
            if (longSentences.length > 3) output += `...and ${longSentences.length - 3} more.\n`;
        } else {
            output += `✅ Sentence lengths are good.\n`;
        }

        if (score < 60) output += `\n💡 **Tip**: Use shorter words and paragraphs to improve score.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
