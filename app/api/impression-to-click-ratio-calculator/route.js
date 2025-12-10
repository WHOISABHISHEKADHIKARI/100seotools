import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { impressions, clicks } = await request.json();

        const imp = parseInt(impressions) || 0;
        const clk = parseInt(clicks) || 0;

        if (imp === 0) return NextResponse.json({ success: true, result: 'Impressions cannot be zero.' });

        const ctr = ((clk / imp) * 100).toFixed(2);

        // Benchmarks
        let status = 'Average';
        if (ctr < 1) status = 'Low (Poor)';
        else if (ctr > 5) status = 'High (Excellent)';
        else if (ctr > 2) status = 'Good';

        let output = `Impression-to-Click Ratio (CTR) Calculator\n`;
        output += `==========================================\n\n`;

        output += `Inputs:\n`;
        output += `- Impressions: ${imp}\n`;
        output += `- Clicks: ${clk}\n\n`;

        output += `### CTR: ${ctr}%\n`;
        output += `Status: **${status}**\n\n`;

        output += `### Analysis\n`;
        if (ctr < 2) {
            output += `Your CTR is on the lower side. This typically means your ranking is low (page 2+) OR your title/meta description is not enticing.\n`;
        } else {
            output += `You have a healthy CTR. Keep monitoring.\n`;
        }

        output += `\n### Optimization Tips\n`;
        output += `1. **Power Words**: Use "Best", "Free", "2025" in title.\n`;
        output += `2. **Meta Description**: Ensure it answers the user's intent immediately.\n`;
        output += `3. **Position**: Improving rank is the #1 way to boost CTR.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
