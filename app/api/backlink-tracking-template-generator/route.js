import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { project_name } = await request.json();

        if (!project_name || !project_name.trim()) {
            return NextResponse.json({ success: false, error: 'Project Name is required' }, { status: 400 });
        }

        const p = project_name.trim();

        // Generate a CSV-like structure
        let output = `Backlink Tracking Template for: ${p}\n`;
        output += `Format: CSV (Copy and Paste into Excel/Sheets)\n\n`;

        output += `Date,Linking_Site_URL,Target_URL,Anchor_Text,DA,Status,Contact_Person,Notes\n`;
        output += `2025-01-01,https://technews.com/article1,https://mysite.com/tool,best seo tools,85,Live,John Doe,Guest post link\n`;
        output += `2025-01-05,https://bloggers.net/list,https://mysite.com,click here,45,Pending,,Emailed outreach@bloggers.net\n`;
        output += `2025-01-10,https://reviewsite.org,https://mysite.com/review,checking tools,60,Live,Jane Smith,Paid placement\n`;
        output += `2025-01-12,https://forums.web/topic,https://mysite.com/help,source,30,Removed,,Link was deleted by mod\n`;

        output += `\n\n--- Usage Instructions ---\n`;
        output += `1. Copy the text above starting from 'Date'.\n`;
        output += `2. Open Excel or Google Sheets.\n`;
        output += `3. Paste special as CSV or simply paste and use 'Text to Columns' feature.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
