import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { paragraph, keywords } = await request.json();

        if (!paragraph || !keywords) return NextResponse.json({ success: false, error: 'Input required' }, { status: 400 });

        const kwList = keywords.split(',').map(k => k.trim()).filter(k => k);
        const text = paragraph;

        let output = `Paragraph Optimization Report\n`;
        output += `=============================\n\n`;

        output += `### Analysis\n`;

        kwList.forEach(kw => {
            const regex = new RegExp(`\\b${kw}\\b`, 'gi');
            const match = text.match(regex);
            const count = match ? match.length : 0;

            output += `- **"${kw}"**: `;
            if (count === 0) output += `❌ Not found. Try inserting it naturally.\n`;
            else if (count > 3) output += `⚠️ Found ${count} times. Risk of keyword stuffing.\n`;
            else output += `✅ Found ${count} times. Good usage.\n`;
        });

        output += `\n### Optimization Suggestion\n`;
        output += `*Original length: ${text.split(' ').length} words.*\n\n`;

        // Simple insertion suggestion (heuristic)
        const missing = kwList.filter(kw => !new RegExp(`\\b${kw}\\b`, 'gi').test(text));

        if (missing.length > 0) {
            output += `Try adding a sentence like this to include missing terms:\n`;
            output += `> "Consider using **${missing.join('** and **')}** to improve your results."`;
        } else {
            output += `Great job! All target keywords are present. Focus on readability now.`;
        }

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
