import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { title, desc, image, url } = await request.json();

        let output = '';
        if (title) output += `<meta property="og:title" content="${title}" />\n`;
        if (desc) output += `<meta property="og:description" content="${desc}" />\n`;
        if (image) output += `<meta property="og:image" content="${image}" />\n`;
        if (url) output += `<meta property="og:url" content="${url}" />\n`;

        output += `<meta property="og:type" content="website" />`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
