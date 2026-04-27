import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { name, phone, address } = await request.json();

        if (!name) return NextResponse.json({ success: false, error: 'Business Name required' }, { status: 400 });

        let output = `NAP Consistency Check: ${name}\n`;
        output += `=============================\n\n`;

        output += `### Baseline Data\n`;
        output += `- Name: ${name}\n`;
        output += `- Address: ${address || 'N/A'}\n`;
        output += `- Phone: ${phone || 'N/A'}\n\n`;

        output += `### Consistency Analysis (Simulated)\n`;
        output += `We compared your baseline against common directory formats:\n\n`;

        const issues = [];
        if (address && (address.includes('Street') || address.includes('St.'))) {
            issues.push(`**Address Abbreviation**: Some dirs use "St" vs "Street". Ensure you use exactly "${address}" everywhere.`);
        }
        if (phone && !phone.includes('(')) {
            issues.push(`**Phone Formatting**: Ensure you use a standard format (e.g. (555) 123-4567) consistently.`);
        }

        if (issues.length > 0) {
            output += `⚠️ **Potential Inconsistencies Detected**:\n`;
            issues.forEach(i => output += `- ${i}\n`);
            output += `\n`;
        } else {
            output += `✅ **Looks Good**: No obvious formatting risks detected in your baseline inputs.\n\n`;
        }

        output += `### Next Steps\n`;
        output += `1. Google "My Business Name" + "Phone Number" to spot mismatched listings.\n`;
        output += `2. Update any old addresses immediately.\n`;
        output += `3. Use the same exact spelling (e.g. "LLC" vs no "LLC") everywhere.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
