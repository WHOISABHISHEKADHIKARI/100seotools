import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { title, keyword } = await request.json();

        if (!keyword) return NextResponse.json({ success: false, error: 'Keyword required' }, { status: 400 });

        const k = keyword.trim();
        const t = title ? title.trim() : `The Guide to ${k}`;

        // Templates
        const templates = [
            "In the rapidly evolving world of [NICHE], mastering [KEYWORD] is crucial for success. Whether you are a beginner or an expert, understanding these principles can make a huge difference. In this post, we'll dive deep into [TITLE] and show you exactly how to get started.",

            "Are you struggling with [KEYWORD]? You are not alone. Many people find it challenging to navigate the complexities of this topic. That's why we've put together this comprehensive guide on [TITLE]. By the end of this article, you'll have a clear roadmap to achieving your goals.",

            "Have you ever wondered how the experts handle [KEYWORD]? It might seem like a secret, but it really comes down to a few key strategies. Today, we're pulling back the curtain on [TITLE] to reveal the actionable tips you need to know."
        ];

        const fill = (tmpl) => tmpl.replace(/\[KEYWORD\]/g, k).replace(/\[TITLE\]/g, t).replace(/\[NICHE\]/g, 'your industry');

        let output = `Here are 3 intro options for "${t}":\n\n`;
        templates.forEach((tmpl, i) => {
            output += `--- Option ${i + 1} ---\n${fill(tmpl)}\n\n`;
        });
        output += `Tip: pick the angle (urgency, empathy, curiosity) that matches your audience.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
