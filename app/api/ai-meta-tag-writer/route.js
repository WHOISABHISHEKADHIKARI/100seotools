import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { keyword, desc } = await request.json();

        if (!keyword) return NextResponse.json({ success: false, error: 'Focus Keyword required' }, { status: 400 });

        const k = keyword.trim();
        const context = desc ? desc.trim() : `everything about ${k}`;
        const year = new Date().getFullYear();

        const titles = [
            `${k}: The Ultimate Guide (${year})`,
            `How to Master ${k} in ${year} [Step-by-Step]`,
            `${k} Explained: What You Need to Know`,
            `Best Strategies for ${k} That Actually Work`
        ];

        const descriptions = [
            `Looking for help with ${k}? This comprehensive guide covers ${context} and provides actionable tips to boost your results. Read now!`,
            `Discover the secrets of ${k}. In this article, we explain ${context} and show you how to avoid common mistakes. Updated for ${year}.`,
            `Master ${k} with our expert guide. From basics to advanced techniques, we cover ${context}. Click to learn more.`
        ];

        let output = `AI Generated Meta Tags for "${k}":\n\n`;

        output += `--- Option 1 ---\n`;
        output += `Title: ${titles[0]}\n`;
        output += `Desc:  ${descriptions[0]}\n\n`;

        output += `--- Option 2 ---\n`;
        output += `Title: ${titles[1]}\n`;
        output += `Desc:  ${descriptions[1]}\n\n`;

        output += `--- Option 3 ---\n`;
        output += `Title: ${titles[2]}\n`;
        output += `Desc:  ${descriptions[2]}\n`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
