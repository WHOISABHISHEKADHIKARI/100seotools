import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { my_content, competitor_content } = await request.json();

        if (!my_content || !competitor_content) return NextResponse.json({ success: false, error: 'Input required' }, { status: 400 });

        const count = (text) => {
            const words = text.trim().split(/\s+/).length;
            const chars = text.length;
            const paras = text.split(/\n\s*\n/).length;
            return { words, chars, paras };
        };

        const myStats = count(my_content);
        const compStats = count(competitor_content);

        const diff = myStats.words - compStats.words;
        const diffPercent = ((diff / compStats.words) * 100).toFixed(1);

        let output = `Content Length Comparison\n`;
        output += `=========================\n\n`;

        output += `### Statistics\n`;
        output += `| Metric | My Content | Competitor | Difference |\n`;
        output += `|--------|------------|------------|------------|\n`;
        output += `| Words  | ${myStats.words} | ${compStats.words} | ${diff > 0 ? '+' : ''}${diff} |\n`;
        output += `| Paras  | ${myStats.paras} | ${compStats.paras} | ${myStats.paras - compStats.paras} |\n\n`;

        output += `### Analysis\n`;
        if (diff < -200) {
            output += `⚠️ **Too Short**: Your content is significantly shorter (${Math.abs(diff)} fewer words) than the competitor. This usually indicates 'thin content'. Consider expanding deep topics.\n`;
        } else if (diff > 500) {
            output += `⚠️ **Very Long**: Your content is much longer. Ensure it's not fluffy. Quality > Quantity.\n`;
        } else {
            output += `✅ **Optimal Length**: Your content length is competitive (within reasonable range).\n`;
        }

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
