import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { keyword } = await request.json();

        if (!keyword) return NextResponse.json({ success: false, error: 'Keyword required' }, { status: 400 });

        const k = keyword.trim();
        const year = new Date().getFullYear();

        const titles = [
            `10 Best ${k} Tips for ${year}`,
            `How to Master ${k} in 5 Simple Steps`,
            `The Ultimate Guide to ${k} (Beginner Friendly)`,
            `Why ${k} is Important for Your Success`,
            `${k}: Everything You Need to Know`,
            `Top 5 Mistakes People Make With ${k}`,
            `The Future of ${k}: What to Expect`,
            `How to Get Better Results With ${k}`,
            `${k} vs The Competitors: Which is Best?`,
            `Simple Hacks to Improve Your ${k}`
        ];

        let output = `Generated ${titles.length} Blog Titles for "${k}":\n\n`;
        titles.forEach((t, i) => output += `${i + 1}. ${t}\n`);

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
