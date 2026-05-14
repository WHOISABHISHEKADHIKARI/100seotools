import { NextResponse } from 'next/server';
import { requestOpenRouterReport } from '../../../lib/openRouterGateway.js';

export async function POST(request) {
    try {
        const { title, keyword } = await request.json();

        if (!keyword) return NextResponse.json({ success: false, error: 'Keyword required' }, { status: 400 });

        const k = keyword.trim();
        const t = title ? title.trim() : `The Guide to ${k}`;

        if (process.env.OPENROUTER_API_KEY) {
            const report = await requestOpenRouterReport({
                toolName: 'AI Blog Intro Writer',
                toolSlug: 'ai-blog-intro-writer',
                inputs: { title: t, keyword: k }
            });
            return NextResponse.json({ success: true, result: report.result, provider: report.provider, model: report.model });
        }

        // Templates
        const templates = [
            "In the rapidly evolving world of [NICHE], mastering [KEYWORD] is crucial for success. Whether you are a beginner or an expert, understanding these principles can make a huge difference. In this post, we'll dive deep into [TITLE] and show you exactly how to get started.",

            "Are you struggling with [KEYWORD]? You are not alone. Many people find it challenging to navigate the complexities of this topic. That's why we've put together this comprehensive guide on [TITLE]. By the end of this article, you'll have a clear roadmap to achieving your goals.",

            "Have you ever wondered how the experts handle [KEYWORD]? It might seem like a secret, but it really comes down to a few key strategies. Today, we're pulling back the curtain on [TITLE] to reveal the actionable tips you need to know."
        ];

        const fill = (tmpl) => tmpl.replace(/\[KEYWORD\]/g, k).replace(/\[TITLE\]/g, t).replace(/\[NICHE\]/g, 'your industry');

        const options = templates.map((tmpl, i) => `Option ${i + 1}: ${fill(tmpl)}`);

        return NextResponse.json({
            success: true,
            result: {
                summary: `Created three intro directions for "${t}" using the target keyword "${k}".`,
                keyFindings: options,
                recommendations: [
                    'Use the empathy angle when readers are problem-aware.',
                    'Use the curiosity angle when the topic is familiar but needs a fresh hook.',
                    'Place the target keyword naturally in the first two sentences.'
                ],
                nextSteps: [
                    'Choose one intro and edit it to match your brand voice.',
                    'Add a clear promise for what the reader will learn next.',
                    'Run the finished draft through a readability checker before publishing.'
                ]
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
