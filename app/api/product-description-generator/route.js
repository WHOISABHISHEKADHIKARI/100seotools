import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { product_name, features } = await request.json();

        if (!product_name) return NextResponse.json({ success: false, error: 'Product Name required' }, { status: 400 });

        const p = product_name.trim();
        const f = features ? features.split('\n').map(x => x.trim()).filter(x => x) : [];

        let output = `Generated Product Descriptions for "${p}":\n\n`;

        output += `### Option 1: The "Feature-Rich" Approach\n`;
        output += `Introduce the **${p}**, the ultimate solution designed for those who demand excellence. `;
        if (f.length > 0) {
            output += `Packed with advanced features like ${f.join(', ')}, it stands out in its class. `;
        }
        output += `Whether you are a professional or an enthusiast, the ${p} delivers reliability and performance you can count on. Upgrade your experience today with the ${p}!\n\n`;

        output += `### Option 2: The "Benefit-Drivien" Approach\n`;
        output += `Transform your daily routine with the new **${p}**. `;
        if (f.length > 0) {
            const feat = f[0];
            output += `Imagine achieving more with less effort, thanks to its innovative ${feat}. `;
        }
        output += `It's not just a product; it's a game-changer. Experience the difference that quality makes. reliable, efficient, and stylish – the ${p} is everything you've been looking for.\n\n`;

        output += `### Option 3: Short & Punchy\n`;
        output += `Meet ${p}. The smarter way to handle your needs. Features: ${f.slice(0, 3).join(', ')}. Get yours now.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
