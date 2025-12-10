import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { title } = await request.json();

        if (!title) return NextResponse.json({ success: false, error: 'Title required' }, { status: 400 });

        const t = title.trim();
        const year = new Date().getFullYear();

        const variations = [
            `The Ultimate Guide to ${t}`,
            `${t}: Everything You Need to Know in ${year}`,
            `Mastering ${t}: Tips, Tricks, and Strategies`,
            `Why ${t} Matters for Your Business`,
            `How to Optimize ${t} for Maximum Results`,
            `10 Proven Strategies for ${t}`,
            `${t} Explained: A Beginner's Guide`,
            `Advanced Technqiues for ${t}`,
            `${t} vs Competitors: What Wins?`,
            `The Secret to Success with ${t}`
        ];

        let output = `AI Rewritten Titles for: "${t}"\n\n`;
        output += `### High CTR Variations\n`;
        variations.slice(0, 4).forEach(v => output += `- ${v}\n`);

        output += `\n### SEO Optimized Variations\n`;
        variations.slice(4, 8).forEach(v => output += `- ${v}\n`);

        output += `\n### Question Based\n`;
        output += `- What is ${t} and How Does it Work?\n`;
        output += `- Is ${t} Worth the Investment?\n`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
