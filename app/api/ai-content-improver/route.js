import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { content } = await request.json();

        if (!content) return NextResponse.json({ success: false, error: 'Content required' }, { status: 400 });

        const text = content.trim();
        const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
        const wordCount = text.split(/\s+/).length;

        // Simple heuristics
        const longSentences = sentences.filter(s => s.split(/\s+/).length > 20);
        const passiveVoice = sentences.filter(s => /\b(am|is|are|was|were|be|been|being)\b\s+\w+ed\b/i.test(s));

        let output = `AI Content Improvement Suggestions\n`;
        output += `==================================\n\n`;

        output += `### Analysis\n`;
        output += `- **Total Words**: ${wordCount}\n`;
        output += `- **Sentences**: ${sentences.length}\n`;
        output += `- **Long Sentences**: ${longSentences.length} (Recommend shortening)\n`;
        output += `- **Passive Voice Detections**: ${passiveVoice.length} (Recommend active voice)\n\n`;

        output += `### Key Improvements\n`;
        if (longSentences.length > 0) {
            output += `1. **Shorten Sentences**: Your text has complex sentences. Try breaking them down. Example: "${longSentences[0].substring(0, 50)}..."\n`;
        } else {
            output += `1. **Sentence Length**: Good job! Your sentences are concise.\n`;
        }

        if (passiveVoice.length > 0) {
            output += `2. **Use Active Voice**: We found passive phrasing. Switch to active voice for better engagement. Example: "${passiveVoice[0].substring(0, 50)}..."\n`;
        } else {
            output += `2. **Voice**: Great usage of active voice.\n`;
        }

        output += `3. **Structure**: Ensure you use H2 and H3 subheadings every 300 words.\n`;
        output += `4. **Transitions**: Add words like "However", "Therefore", "Moreover" to improve flow.\n\n`;

        output += `### Rewritten Intro Snippet (Simulated)\n`;
        output += `"${sentences[0] || text.substring(0, 100)}... this helps readers immediately understand the value."`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
