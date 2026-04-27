import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { recipient_name, topic, my_name } = await request.json();

        const r = recipient_name || '[Recipient Name]';
        const t = topic || 'collaboration';
        const m = my_name || '[My Name]';

        let output = `Outreach Email Templates for "${t}":\n\n`;

        output += `--- Option 1: The "Compliment & Pitch" ---\n`;
        output += `Subject: Quick question about your article on ${t}\n\n`;
        output += `Hi ${r},\n\n`;
        output += `I was reading your recent post about ${t} and found it really insightful. I especially liked how you covered [Specific Point].\n\n`;
        output += `I actually created a resource that covers [Related Aspect] which I think would be a great addition for your readers. Would you be open to taking a look?\n\n`;
        output += `Best,\n${m}\n\n`;

        output += `--- Option 2: The "Guest Post" Request ---\n`;
        output += `Subject: Guest post idea for your site: ${t}\n\n`;
        output += `Hi ${r},\n\n`;
        output += `I've been following your blog for a while and love your content on ${t}.\n\n`;
        output += `I have a few unique article ideas that I think your audience would love:\n`;
        output += `1. Top 5 Myths about ${t}\n`;
        output += `2. How to Master ${t} in 30 Days\n`;
        output += `3. The Future of ${t}: Trends to Watch\n\n`;
        output += `Let me know if any of these catch your eye, or if there's another topic you'd prefer!\n\n`;
        output += `Cheers,\n${m}\n\n`;

        output += `--- Option 3: The "Link Building" Ask ---\n`;
        output += `Subject: Resource for your ${t} guide\n\n`;
        output += `Hello ${r},\n\n`;
        output += `I noticed you linked to [Competitor Link] in your ${t} guide. That's a great resource, but it's a bit outdated.\n\n`;
        output += `I just published a completely updated guide on ${t} that includes new data for 2025. It might be more useful for your readers.\n\n`;
        output += `Here is the link: [Your Link]\n\n`;
        output += `Thanks,\n${m}`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
