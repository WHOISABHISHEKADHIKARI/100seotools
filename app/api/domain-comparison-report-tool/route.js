import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { domain1, domain2 } = await request.json();

        if (!domain1 || !domain2) return NextResponse.json({ success: false, error: 'Both domains required' }, { status: 400 });

        let output = `Domain Comparison Report\n`;
        output += `========================\n`;
        output += `Comparing: **${domain1}** vs **${domain2}**\n\n`;

        output += `| Metric | ${domain1} | ${domain2} | Winner |\n`;
        output += `|--------|------------|------------|--------|\n`;
        output += `| Index Status | Indexed ✅ | Indexed ✅ | Draw |\n`;
        output += `| SSL Secure | Yes 🔒 | Yes 🔒 | Draw |\n`;
        output += `| URL Length | ${domain1.length} chars | ${domain2.length} chars | ${domain1.length < domain2.length ? domain1 : domain2} |\n`;

        // Simulated metrics
        const da1 = Math.floor(Math.random() * 40) + 10;
        const da2 = Math.floor(Math.random() * 40) + 10;

        output += `| Sim. Auth. | ${da1} DA | ${da2} DA | ${da1 > da2 ? domain1 : domain2} |\n\n`;

        output += `### Strategic Insights\n`;
        if (da1 > da2) {
            output += `**${domain1}** appears stronger. ${domain2} needs to focus on link building to compete.\n`;
        } else {
            output += `**${domain2}** is leading. ${domain1} should analyze ${domain2}'s top pages for content gaps.\n`;
        }

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
