import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { business_name, category, description } = await request.json();

        if (!business_name) return NextResponse.json({ success: false, error: 'Business Name required' }, { status: 400 });

        let output = `GMB Optimization Audit for "${business_name}"\n`;
        output += `===========================================\n\n`;

        output += `1. **Category Check**: You selected "${category || 'None'}".\n`;
        output += `   - Ensure this marks your *primary* service. Add secondary categories like "Service Provider" or "Consultant" if applicable.\n\n`;

        const descLen = description ? description.length : 0;
        output += `2. **Description Audit**:\n`;
        if (descLen < 200) {
            output += `   ⚠️ **Too Short** (${descLen} chars). Utilize the 750 character limit. Focus on keywords and USP.\n`;
        } else if (descLen > 750) {
            output += `   ⚠️ **Too Long** (${descLen} chars). Trim to under 750 characters.\n`;
        } else {
            output += `   ✅ **Good Length** (${descLen} chars).\n`;
        }

        output += `\n### Optimization Checklist\n`;
        output += `- [ ] **Photos**: Upload at least 3 exterior and 3 interior photos.\n`;
        output += `- [ ] **Posts**: Create a "Welcome Offer" or "Update" post immediately.\n`;
        output += `- [ ] **Q&A**: Pre-populate your Q&A section with common customer questions.\n`;
        output += `- [ ] **Reviews**: Reply to 100% of reviews (even negative ones).\n`;

        output += `\n### Recommended Attributes to Add\n`;
        output += `- "Wheelchair accessible"\n`;
        output += `- "Woman-led" (if applicable)\n`;
        output += `- "Online appointments"\n`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
