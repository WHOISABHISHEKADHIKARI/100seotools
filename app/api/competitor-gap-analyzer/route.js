import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { my_content, competitor_content } = await request.json();

        if (!my_content || !competitor_content) return NextResponse.json({ success: false, error: 'Both text contents are required' }, { status: 400 });

        const tokenize = (text) => text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];

        const myWords = new Set(tokenize(my_content));
        const compWords = new Set(tokenize(competitor_content));

        // Find gap: Words in Competitor but NOT in Mine
        const gap = [...compWords].filter(w => !myWords.has(w));

        // Find overlap
        const overlap = [...compWords].filter(w => myWords.has(w));

        const similarity = (overlap.length / compWords.size) * 100;

        let output = `Competitor Content Gap Analysis\n`;
        output += `===============================\n\n`;

        output += `### Overview\n`;
        output += `- **Similarity Score**: ${similarity.toFixed(1)}%\n`;
        output += `- **Competitor Unique Keywords**: ${gap.length}\n`;
        output += `- **Shared Keywords**: ${overlap.length}\n\n`;

        output += `### 🚨 Missing Keywords (The Gap)\n`;
        output += `Your competitor is using these words, but you are not. Consider adding relevant ones:\n`;

        // Filter out common stop words roughly (simulation of 'smart' filtering)
        const stopWords = new Set(['the', 'and', 'that', 'this', 'with', 'from', 'your', 'have', 'are']);
        const significantGap = gap.filter(w => !stopWords.has(w)).slice(0, 20); // Top 20

        if (significantGap.length > 0) {
            output += significantGap.join(', ') + '\n\n';
        } else {
            output += `(No significant gaps found! Good job coverage matches well.)\n\n`;
        }

        output += `### ✅ Shared Topics\n`;
        output += `You both cover:\n`;
        output += overlap.slice(0, 10).join(', ') + '...\n\n';

        output += `### Recommendations\n`;
        output += `1. **Expand Topical Depth**: Incorporate 3-5 of the missing keywords naturally.\n`;
        output += `2. **Check Context**: Ensure you are answering the same user questions as the competitor.\n`;
        output += `3. **Length Check**: If they have significantly more unique words, your content might be too thin.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
