import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { keyword } = await request.json();

        if (!keyword) return NextResponse.json({ success: false, error: 'Keyword required' }, { status: 400 });

        const k = keyword.trim();

        // Simulating an explanation structure
        let output = `**Term**: ${k}\n\n`;
        output += `**Definition**:\n`;
        output += `${k} is a specific term used in its respective field to describe a particular process, object, or concept. It is often characterized by its unique properties and functions that distinguish it from related terms.\n\n`;

        output += `**Key Characteristics**:\n`;
        output += `- Integral to modern strategies.\n`;
        output += `- Can be measured or observed.\n`;
        output += `- Often evolves with technology and trends.\n\n`;

        output += `**Why it Matters**:\n`;
        output += `Understanding ${k} is essential for professionals because it impacts decision-making and performance. Ignoring it can lead to missed opportunities or sub-optimal results.\n\n`;

        output += `**Example Usage**:\n`;
        output += `"We need to improve our ${k} to see better ROI next quarter."`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
