import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { content, keyword } = await request.json();

        if (!content || !keyword) return NextResponse.json({ success: false, error: 'Input required' }, { status: 400 });

        const result = content.replace(
            new RegExp(`(${keyword})`, 'gi'),
            '**$1**' // Markdown bold for highlight simulation in output
        );

        const count = (content.match(new RegExp(keyword, 'gi')) || []).length;

        let output = `Keyword Placement Highlight Report\n`;
        output += `==================================\n\n`;

        output += `Total Occurrences: ${count}\n\n`;
        output += `### Highlighted Content Preview\n`;
        output += `(Keywords are bolded below)\n\n`;
        output += result;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
