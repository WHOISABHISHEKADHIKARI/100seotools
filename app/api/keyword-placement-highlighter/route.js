import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { content, keyword } = body || {};

        if (typeof content !== 'string' || typeof keyword !== 'string' || !content.trim() || !keyword.trim()) {
            return NextResponse.json({ success: false, error: 'Content and keyword are required' }, { status: 400 });
        }

        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const keywordRegex = new RegExp(`(${escapedKeyword})`, 'gi');
        const result = content.replace(keywordRegex, '**$1**');
        const count = (content.match(new RegExp(escapedKeyword, 'gi')) || []).length;

        let output = `Keyword Placement Highlight Report\n`;
        output += `==================================\n\n`;
        output += `Total Occurrences: ${count}\n\n`;
        output += `### Highlighted Content Preview\n`;
        output += `(Keywords are bolded below)\n\n`;
        output += result;

        return NextResponse.json({ success: true, result: output });
    } catch (error) {
        console.error('keyword-placement-highlighter error:', error);
        return NextResponse.json({ success: false, error: 'Failed to highlight keyword placement' }, { status: 500 });
    }
}
