import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { current_traffic, growth_rate } = await request.json();

        // 12 month forecast
        const months = 12;
        let traffic = parseInt(current_traffic) || 0;
        const rate = parseFloat(growth_rate) / 100 || 0;

        if (traffic <= 0) return NextResponse.json({ success: false, error: 'Current traffic must be > 0' }, { status: 400 });

        let output = `Organic Growth Forecast (Next 12 Months)\n`;
        output += `========================================\n\n`;
        output += `Starting Traffic: ${traffic.toLocaleString()} visitors/mo\n`;
        output += `Growth Rate: ${(rate * 100).toFixed(1)}% per month\n\n`;

        output += `### Month-by-Month Projection\n`;
        output += `| Month | Traffic | Growth |\n`;
        output += `|-------|---------|--------|\n`;

        let totalTraffic = 0;

        for (let i = 1; i <= months; i++) {
            const increase = Math.floor(traffic * rate);
            traffic += increase;
            totalTraffic += traffic;
            output += `| ${i} | ${traffic.toLocaleString()} | +${increase.toLocaleString()} |\n`;
        }

        output += `\n### Summary\n`;
        output += `- **End of Year Monthly Traffic**: ${traffic.toLocaleString()}\n`;
        output += `- **Total Annual Visitors**: ${totalTraffic.toLocaleString()}\n`;
        output += `- **Compound Multiplier**: ${(traffic / parseInt(current_traffic)).toFixed(2)}x\n`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
