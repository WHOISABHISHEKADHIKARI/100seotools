import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { current_traffic, growth_rate } = body || {};
        const startingTraffic = Number(current_traffic);
        const rateInput = Number(growth_rate);

        if (!Number.isFinite(startingTraffic) || startingTraffic <= 0) {
            return NextResponse.json({ success: false, error: 'Current traffic must be greater than 0' }, { status: 400 });
        }
        if (!Number.isFinite(rateInput)) {
            return NextResponse.json({ success: false, error: 'Monthly growth rate is required' }, { status: 400 });
        }

        const months = 12;
        let traffic = Math.round(startingTraffic);
        const rate = rateInput / 100;
        let totalTraffic = 0;

        let output = `Organic Growth Forecast (Next 12 Months)\n`;
        output += `========================================\n\n`;
        output += `Starting Traffic: ${traffic.toLocaleString()} visitors/mo\n`;
        output += `Growth Rate: ${(rate * 100).toFixed(1)}% per month\n\n`;
        output += `### Month-by-Month Projection\n`;
        output += `| Month | Traffic | Growth |\n`;
        output += `|-------|---------|--------|\n`;

        for (let i = 1; i <= months; i++) {
            const increase = Math.floor(traffic * rate);
            traffic += increase;
            totalTraffic += traffic;
            output += `| ${i} | ${traffic.toLocaleString()} | ${increase >= 0 ? '+' : ''}${increase.toLocaleString()} |\n`;
        }

        output += `\n### Summary\n`;
        output += `- **End of Year Monthly Traffic**: ${traffic.toLocaleString()}\n`;
        output += `- **Total Annual Visitors**: ${totalTraffic.toLocaleString()}\n`;
        output += `- **Compound Multiplier**: ${(traffic / startingTraffic).toFixed(2)}x\n`;

        return NextResponse.json({ success: true, result: output });
    } catch (error) {
        console.error('organic-growth-forecast-tool error:', error);
        return NextResponse.json({ success: false, error: 'Failed to forecast organic growth' }, { status: 500 });
    }
}
