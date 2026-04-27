import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { business_name } = await request.json();

        const b = business_name || 'My Business';

        let output = `Local SEO Audit Checklist for: ${b}\n`;
        output += `===================================\n\n`;

        output += `### 1. Google Business Profile (GBP)\n`;
        output += `- [ ] Claimed and verified listing?\n`;
        output += `- [ ] Accurate business category selected?\n`;
        output += `- [ ] Business hours correct and updated?\n`;
        output += `- [ ] Photos of exterior/interior added?\n\n`;

        output += `### 2. Website Optimization\n`;
        output += `- [ ] NAP (Name, Address, Phone) in footer matches GBP exactly?\n`;
        output += `- [ ] Embedded Google Map on contact page?\n`;
        output += `- [ ] Location page created for each city served?\n`;
        output += `- [ ] LocalBusiness Schema Markup implemented?\n\n`;

        output += `### 3. Citations & Reviews\n`;
        output += `- [ ] Listed on major aggregators (Yelp, Bing, Facebook)?\n`;
        output += `- [ ] Average rating > 4.0 stars?\n`;
        output += `- [ ] Responded to last 5 reviews?\n`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
