import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { image_url } = await request.json();

        if (!image_url) return NextResponse.json({ success: false, error: 'Image URL required' }, { status: 400 });

        const encUrl = encodeURIComponent(image_url);

        const googleUrl = `https://lens.google.com/uploadbyurl?url=${encUrl}`;
        const bingUrl = `https://www.bing.com/images/search?view=detailv2&iss=sbi&form=SBIHMP&q=imgurl:${encUrl}`;
        const yandexUrl = `https://yandex.com/images/search?rpt=imageview&url=${encUrl}`;
        const tineyeUrl = `https://tineye.com/search?url=${encUrl}`;

        let output = `Reverse Image Search Links\n`;
        output += `==========================\n\n`;

        output += `Since direct API access to reverse search is restricted, click these links to instantly search your image:\n\n`;

        output += `- 🔍 [Search on Google Lens](${googleUrl})\n`;
        output += `- 🔍 [Search on Bing Images](${bingUrl})\n`;
        output += `- 🔍 [Search on TinEye](${tineyeUrl})\n`;
        output += `- 🔍 [Search on Yandex](${yandexUrl})\n\n`;

        output += `### Why use multiple?\n`;
        output += `Different engines index different parts of the web. Yandex is great for facial recognition, TinEye for exact matches, and Google for products.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
