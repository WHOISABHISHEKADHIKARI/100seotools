import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { old, new: newUrl } = await request.json(); // 'new' is reserved keyword

        if (!old || !newUrl) return NextResponse.json({ success: false, error: 'Both URLs required' }, { status: 400 });

        const o = old.trim();
        const n = newUrl.trim();

        let output = `Generated 301 Redirect Code:\n\n`;

        output += `### .htaccess (Apache)\n`;
        output += `Redirect 301 ${o} ${n}\n\n`;

        output += `### Nginx\n`;
        output += `location ${o} {\n  return 301 ${n};\n}\n\n`;

        output += `### PHP\n`;
        output += `<?php\nheader("Location: ${n}", true, 301);\nexit();\n?>\n\n`;

        output += `### JavaScript (Client-side)\n`;
        output += `window.location.replace("${n}");\n\n`;

        output += `### HTML Meta Refresh\n`;
        output += `<meta http-equiv="refresh" content="0; url=${n}">\n`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
