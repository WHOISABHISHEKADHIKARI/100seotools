import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { cpc, conversion_rate, value } = body || {};
        const cost = Number(cpc);
        const cvrInput = Number(conversion_rate);
        const ltv = Number(value);

        if (!Number.isFinite(cost)) return NextResponse.json({ success: false, error: 'Cost Per Click is required' }, { status: 400 });
        if (!Number.isFinite(cvrInput)) return NextResponse.json({ success: false, error: 'Conversion Rate is required' }, { status: 400 });
        if (!Number.isFinite(ltv)) return NextResponse.json({ success: false, error: 'Customer Value is required' }, { status: 400 });
        if (cost <= 0) return NextResponse.json({ success: false, error: 'CPC must be greater than 0' }, { status: 400 });
        if (cvrInput < 0) return NextResponse.json({ success: false, error: 'Conversion Rate cannot be negative' }, { status: 400 });
        if (ltv < 0) return NextResponse.json({ success: false, error: 'Customer Value cannot be negative' }, { status: 400 });

        const cvr = cvrInput / 100;
        const clicks = 100;
        const totalCost = clicks * cost;
        const conversions = clicks * cvr;
        const revenue = conversions * ltv;
        const profit = revenue - totalCost;
        const roi = (profit / totalCost) * 100;

        let output = `Keyword ROI Projection (per 100 clicks)\n`;
        output += `=======================================\n\n`;
        output += `### Inputs\n`;
        output += `- CPC: $${cost}\n`;
        output += `- Conv. Rate: ${cvrInput}%\n`;
        output += `- Cust. Value: $${ltv}\n\n`;
        output += `### Financials\n`;
        output += `- Total Cost: $${totalCost.toFixed(2)}\n`;
        output += `- Revenue: $${revenue.toFixed(2)}\n`;
        output += `- Profit: $${profit.toFixed(2)}\n\n`;
        output += `### ROI: ${roi.toFixed(2)}%\n`;
        output += `Verdict: **${roi > 0 ? 'Positive' : 'Negative'}**\n\n`;

        if (roi < 0) {
            const breakEvenCPC = (revenue / clicks).toFixed(2);
            output += `To break even, your CPC needs to be under **$${breakEvenCPC}** (or improve conversion rate).`;
        }

        return NextResponse.json({ success: true, result: output });
    } catch (error) {
        console.error('keyword-roi-calculator error:', error);
        return NextResponse.json({ success: false, error: 'Failed to calculate keyword ROI' }, { status: 500 });
    }
}
