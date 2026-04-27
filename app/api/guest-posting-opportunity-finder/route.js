import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { niche } = await request.json();

        if (!niche) return NextResponse.json({ success: false, error: 'Niche required' }, { status: 400 });

        const n = niche.trim();

        // Extended search operators for guest posting
        const operators = [
            `"${n}" + "write for us"`,
            `"${n}" + "guest post"`,
            `"${n}" + "submit article"`,
            `"${n}" + "contribute"`,
            `"${n}" + "become a contributor"`,
            `intitle:"guest post" + "${n}"`,
            `inurl:"write-for-us" + "${n}"`
        ];

        let output = `Guest Posting Opportunities for: "${n}"\n`;
        output += `======================================\n\n`;

        output += `Use these specific Google search queries to find targets:\n\n`;

        operators.forEach(op => {
            output += `> ${op}\n`;
        });

        output += `\n### Outreach Tips\n`;
        output += `1. **Read Guidelines**: Always checking the target site's "Write for Us" page first.\n`;
        output += `2. **Personalize**: Mention a specific article of theirs you enjoyed.\n`;
        output += `3. **Pitch 3 Ideas**: Offer 3 distinct headline ideas in your first email.\n\n`;

        output += `### Simulated Targets (Examples)\n`;
        output += `- https://blog.${n.replace(/\s+/g, '')}daily.com\n`;
        output += `- https://www.${n.replace(/\s+/g, '')}insider.net/contribute\n`;
        output += `- https://medium.com/tag/${n.replace(/\s+/g, '-')}\n`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
