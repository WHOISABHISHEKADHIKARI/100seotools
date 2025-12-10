import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { text } = await request.json();

        if (!text || typeof text !== 'string') {
            return NextResponse.json({ success: false, error: 'Text input is required' }, { status: 400 });
        }

        // Basic Markdown-like parser
        const lines = text.split(/\r?\n/);
        let html = '';
        let inList = false;
        let listType = null; // 'ul' or 'ol'

        const closeListIfNeeded = () => {
            if (inList) {
                html += `</${listType}>\n`;
                inList = false;
                listType = null;
            }
        };

        lines.forEach(line => {
            const trimmed = line.trim();

            if (!trimmed) {
                closeListIfNeeded();
                return;
            }

            // Headings
            const hMatch = trimmed.match(/^(#{1,6})\s+(.*)/);
            if (hMatch) {
                closeListIfNeeded();
                const level = hMatch[1].length;
                html += `<h${level}>${hMatch[2]}</h${level}>\n`;
                return;
            }

            // Unordered List
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                if (!inList || listType !== 'ul') {
                    closeListIfNeeded();
                    inList = true;
                    listType = 'ul';
                    html += '<ul>\n';
                }
                html += `  <li>${trimmed.substring(2)}</li>\n`;
                return;
            }

            // Ordered List
            const olMatch = trimmed.match(/^\d+\.\s+(.*)/);
            if (olMatch) {
                if (!inList || listType !== 'ol') {
                    closeListIfNeeded();
                    inList = true;
                    listType = 'ol';
                    html += '<ol>\n';
                }
                html += `  <li>${olMatch[1]}</li>\n`;
                return;
            }

            closeListIfNeeded();
            // Paragraphs
            html += `<p>${trimmed}</p>\n`;
        });

        closeListIfNeeded();

        return NextResponse.json({
            success: true,
            result: html
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
