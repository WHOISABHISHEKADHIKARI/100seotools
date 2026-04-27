import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { type } = await request.json();

        const t = (type || '').toLowerCase();

        let checklist = [];
        let title = "General SEO Checklist";

        if (t.includes('tech')) {
            title = "Technical SEO Checklist";
            checklist = [
                "Setup Google Search Console",
                "Create & Submit XML Sitemap",
                "Create Robots.txt",
                "Install SSL (HTTPS)",
                "Fix Broken Links (404s)",
                "Configure Canonical Tags",
                "Optimize Page Speed (Core Web Vitals)",
                "Implement Schema Markup"
            ];
        } else if (t.includes('on') || t.includes('content')) {
            title = "On-Page SEO Checklist";
            checklist = [
                "Include Target Keyword in Title Tag",
                "Include Keyword in H1",
                "Use Keyword in First 100 Words",
                "Optimize Meta Description (CTR)",
                "Use Short, Descriptive URL Slug",
                "Add Alt Text to Images",
                "Use Internal Links",
                "Ensure Mobile Friendliness"
            ];
        } else if (t.includes('local')) {
            title = "Local SEO Checklist";
            checklist = [
                "Create Google Business Profile",
                "Ensure NAP Consistency (Name, Address, Phone)",
                "Get Listed in Local Directories",
                "Collect Google Reviews",
                "Add Local Schema Markup",
                "Create Local Content"
            ];
        } else {
            // Default Mixed
            checklist = [
                "Keyword Research: Identify primary keyword",
                "Title Tag: < 60 chars, includes keyword",
                "Meta Description: < 160 chars, includes CTA",
                "URL Structure: Clean and readable",
                "Headings: H1, H2 structure",
                "Content: High quality, unique",
                "Images: Compressed + Alt text",
                "Technical: SSL, Fast loading"
            ];
        }

        let output = `✅ ${title}:\n\n`;
        checklist.forEach((item, i) => output += `[ ] ${item}\n`);

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
