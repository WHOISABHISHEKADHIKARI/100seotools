import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { content, keyword } = await request.json();

        if (!content) return NextResponse.json({ success: false, error: 'Content required' }, { status: 400 });

        const k = (keyword || '').toLowerCase();
        const text = content.toLowerCase();
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const count = words.length;

        let output = `Content Analysis:\n`;
        output += `Total Words: ${count}\n`;
        output += `Reading Time: ~${Math.ceil(count / 200)} min\n\n`;

        if (k) {
            // Exact match
            const matches = (text.match(new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
            const density = ((matches / count) * 100).toFixed(2);

            output += `Keyword: "${keyword}"\n`;
            output += `- Frequency: ${matches} times\n`;
            output += `- Density: ${density}%\n`;

            if (density < 0.5) output += `⚠️ Density too low (< 0.5%). Consider adding keyword more.\n`;
            else if (density > 2.5) output += `⚠️ Density too high (> 2.5%). Risk of stuffing.\n`;
            else output += `✅ Optimal Density.\n`;

            // First 100 words check
            const first100 = words.slice(0, 100).join(' ');
            if (first100.includes(k)) output += `✅ Keyword appears in first 100 words.\n`;
            else output += `❌ Keyword distinctively missing from intro (first 100 words).\n`;
        } else {
            output += `(Enter a target keyword to check density)`;
        }

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
