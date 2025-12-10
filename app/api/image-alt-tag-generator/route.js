import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { filename, context } = await request.json();

        if (!filename) return NextResponse.json({ success: false, error: 'Filename required' }, { status: 400 });

        let text = filename;

        // Remove extension
        text = text.replace(/\.[^/.]+$/, "");

        // Replace separators
        text = text.replace(/[-_]/g, " ");

        // Remove numbers if they look like IDs (long sequences)
        text = text.replace(/\d{4,}/g, "");

        // Capitalize Words
        text = text.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));

        // Clean up
        text = text.replace(/\s+/g, " ").trim();

        // Context Integration
        if (context) {
            text += ` - ${context}`;
        }

        const output = `<img src="${filename}" alt="${text}" />\n\nGenerated Alt Text: "${text}"`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
