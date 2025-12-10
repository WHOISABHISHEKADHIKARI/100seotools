import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { domain, age, backlinks } = await request.json();

        if (!domain) return NextResponse.json({ success: false, error: 'Domain required' }, { status: 400 });

        const d = domain.trim();
        const a = parseInt(age) || 1;
        const b = parseInt(backlinks) || 0;

        // Simulate DA calculation (0-100 logarithmic scale simulation)
        // Heuristic: Age contributes up to 20, Backlinks log scale contributes up to 60, TLD/Name bonus 20

        let score = 1;

        // Age Logic
        score += Math.min(20, a * 2);

        // Backlink Logic (Log 10)
        if (b > 0) {
            score += Math.min(60, Math.log10(b) * 12);
        }

        // TLD Bonus
        if (d.endsWith('.com') || d.endsWith('.org') || d.endsWith('.edu')) {
            score += 10;
        }

        score = Math.min(100, Math.round(score));

        let output = `Domain Authority Simulation for ${d}\n`;
        output += `===================================\n\n`;

        output += `### Simulated DA Score: ${score}/100\n`;
        output += `Rating: ${score > 60 ? 'Excellent' : score > 30 ? 'Good' : 'Growing'}\n\n`;

        output += `### factor Breakdown\n`;
        output += `- **Domain Age**: ${a} years (${Math.min(20, a * 2)} pts)\n`;
        output += `- **Backlinks**: ${b} estimated links (${b > 0 ? (Math.min(60, Math.log10(b) * 12)).toFixed(0) : 0} pts)\n`;

        output += `\n### How to Improve\n`;
        output += `1. **Build Quality Links**: Focus on getting links from high-DA sites in your niche.\n`;
        output += `2. **Content Marketing**: Create link-worthy assets like tools or studies.\n`;
        output += `3. **Patience**: Domain age is a trust factor that grows with time.`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
