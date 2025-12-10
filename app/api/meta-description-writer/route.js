import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { title, keyword } = await request.json();

        if (!keyword) return NextResponse.json({ success: false, error: 'Keyword required' }, { status: 400 });

        const k = keyword.trim();
        const t = title || 'this page';

        const options = [
            `Looking for ${k}? Discover everything you need to know about ${t} and how to get the best results. Click to learn more!`,
            `The ultimate guide to ${k}. We cover top strategies, tips, and tricks in ${t}. Read now to boost your knowledge.`,
            `Don't miss out on ${k}. Find out why ${t} is crucial for your success. Get the full details here.`,
            `Get the best ${k} advice. Our comprehensive review of ${t} reveals what experts are saying.`
        ];

        let output = `Generated Meta Descriptions for "${k}":\n\n`;
        options.forEach((opt, i) => {
            output += `Option ${i + 1} (${opt.length} chars):\n${opt}\n\n`;
        });

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
