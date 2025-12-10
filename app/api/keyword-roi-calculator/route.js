import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { cpc, conversion_rate, value } = await request.json();

        const cost = parseFloat(cpc) || 0;
        const cvr = parseFloat(conversion_rate) / 100 || 0;
        const ltv = parseFloat(value) || 0;

        if (!cpc && cpc !== 0) return NextResponse.json({ success: false, error: 'Cost Per Click is required' }, { status: 400 });
        if (!conversion_rate && conversion_rate !== 0) return NextResponse.json({ success: false, error: 'Conversion Rate is required' }, { status: 400 });
        if (!value && value !== 0) return NextResponse.json({ success: false, error: 'Customer Value is required' }, { status: 400 });

        if (cost <= 0) return NextResponse.json({ success: false, error: 'CPC must be greater than 0' }, { status: 400 });

        // Per 100 clicks simulation
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
        output += `- Conv. Rate: ${(cvr * 100)}%\n`;
        output += `- Cust. Value: $${ltv}\n\n`;

        output += `### Financials\n`;
        output += `- Total Cost: $${totalCost.toFixed(2)}\n`;
        output += `- Revenue: $${revenue.toFixed(2)}\n`;
        output += `- Profit: $${profit.toFixed(2)}\n\n`;

        output += `### ROI: ${roi.toFixed(2)}%\n`;
        output += `Verdict: **${roi > 0 ? 'Positive ✅' : 'Negative ❌'}**\n\n`;

        if (roi < 0) {
            const breakEvenCPC = (revenue / clicks).toFixed(2);
            output += `💡 To break even, your CPC needs to be under **$${breakEvenCPC}** (or improve conversion rate).`;
        }

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
