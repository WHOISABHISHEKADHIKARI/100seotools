import { NextResponse } from 'next/server';

function tokenize(text) {
    return text.toLowerCase().match(/\b\w+\b/g) || [];
}

function stripHtmlToText(html) {
    return html.replace(/<[^>]+>/g, ' ');
}

export async function POST(request) {
    try {
        const { title, description } = await request.json(); // description here maps to 'Main Content' per template

        const tRaw = title || '';
        const cRaw = description || '';

        const t = stripHtmlToText(tRaw).trim();
        const c = stripHtmlToText(cRaw).trim();

        if (!c && !t) return NextResponse.json({ success: false, error: 'Input required' }, { status: 400 });

        const nowYear = new Date().getFullYear();
        const words = tokenize(c);
        const wordCount = words.length;

        // --- Freshness Signals ---

        // 1. Year Analysis
        const yearMatches = [...c.matchAll(/\b(20\d{2})\b/g)].map(m => Number(m[1]));
        const hasOldYears = yearMatches.some(y => y >= 2010 && y <= nowYear - 3);
        const hasRecentYears = yearMatches.some(y => y >= nowYear - 1 && y <= nowYear + 1);

        // 2. Outdated Terminology (SEO context example, but works generally)
        const outdatedSignals = [
            /\bmeta\s*keywords\b/i,
            /\bkeyword\s*stuffing\b/i,
            /\bGoogle\s*\+/i,
            /\bTwitter\b/i // vs X ? debatable
        ];
        const outdatedHits = outdatedSignals.filter(rx => rx.test(c));

        // 3. Stats & Data
        const hasStats = /\b(\d{1,3}%|\d+(?:,\d+)?\s*(?:users|people|dollars|revenue))\b/i.test(c);

        // --- Scoring ---
        let score = 60; // Base score
        if (hasRecentYears) score += 20;
        if (hasOldYears) score -= 15;
        if (outdatedHits.length > 0) score -= 10 * outdatedHits.length;
        if (hasStats) score += 10;
        if (wordCount > 800) score += 10; // Depth bonus

        score = Math.max(0, Math.min(100, score));

        let output = `Content Freshness Report\n`;
        output += `========================\n\n`;
        output += `### Freshness Score: ${score}/100\n`;
        output += `Status: ${score >= 80 ? '🟢 Fresh' : score >= 50 ? '🟡 Needs Update' : '🔴 Outdated'}\n\n`;

        output += `### Analysis\n`;
        output += `- **Recent Years**: ${hasRecentYears ? '✅ Found (' + nowYear + ' range)' : '❌ Missing recent year references'}\n`;
        output += `- **Old Years**: ${hasOldYears ? '⚠️ Found outdated years (check context)' : '✅ None detected'}\n`;
        output += `- **Data/Stats**: ${hasStats ? '✅ Found data points' : '❌ No obvious statistics found'}\n`;

        if (outdatedHits.length > 0) {
            output += `- **Outdated Terms**: ⚠️ Found potentially legacy terms: \n`;
            // Regex to string is messy, so just warning
            output += `  (Check for legacy technology or platforms)\n`;
        }

        output += `\n### Recommendations\n`;
        if (!hasRecentYears) output += `1. **Update Dates**: Mention ${nowYear} to signal relevance.\n`;
        if (hasOldYears) output += `2. **Audit Years**: Remove or update references to years before ${nowYear - 3}.\n`;
        if (!hasStats) output += `3. **Add Data**: Cite recent studies or statistics to boost credibility.\n`;
        if (wordCount < 500) output += `4. **Expand Content**: Thin content (<500 words) often signals low value.\n`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
