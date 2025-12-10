import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { title, description, url } = await request.json();

        const t = title || 'Example Title';
        const d = description || 'Example description...';
        const u = url || 'example.com';

        let output = `Google Search Result Preview (Text Representation):\n\n`;

        output += `[favicon] ${new URL(u.startsWith('http') ? u : 'http://' + u).hostname}\n`;
        output += `https://${new URL(u.startsWith('http') ? u : 'http://' + u).hostname} > ...\n`;

        output += `\n${t}\n`; // Title
        output += `--------------------------------------------------\n`;
        output += `${d}\n\n`; // Desc

        output += `(Note: This is a text preview. The actual search snippet styling depends on your browser and Google's current design)`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
