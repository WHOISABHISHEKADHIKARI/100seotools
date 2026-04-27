import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { seed } = await request.json();

        if (!seed) return NextResponse.json({ success: false, error: 'Seed keyword required' }, { status: 400 });

        // 1. Fetch Suggestions (like Suggestion Tool)
        const fetchSugg = async (q) => {
            const url = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(q)}`;
            try {
                const res = await fetch(url);
                if (!res.ok) return [];
                const data = await res.json();
                return data[1] || [];
            } catch { return []; }
        };

        const base = await fetchSugg(seed);
        const modifiers = ['best', 'how to', 'vs', 'guide', 'review'];
        const extraPromises = modifiers.map(m => fetchSugg(`${m} ${seed}`));
        const extra = await Promise.all(extraPromises);

        // Flatten and Dedup
        const all = new Set([...base, ...extra.flat()]);
        const keywords = Array.from(all);

        // 2. Cluster Analysis
        // Simple logic: Group by words that appear in at least 3 keywords
        const wordCounts = {};
        const ignore = new Set(['the', 'a', 'an', 'in', 'on', 'for', 'to', 'of', 'and', 'with', 'is', 'are', seed.toLowerCase()]); // ignore stop words AND the seed itself

        keywords.forEach(k => {
            k.toLowerCase().split(/\s+/).forEach(w => {
                if (w.length > 2 && !ignore.has(w)) {
                    wordCounts[w] = (wordCounts[w] || 0) + 1;
                }
            });
        });

        const clusters = {};
        const unclustered = new Set(keywords);

        // Identify "Cluster Heads" (words appearing >= 3 times)
        Object.entries(wordCounts).sort((a, b) => b[1] - a[1]).forEach(([word, count]) => {
            if (count >= 3) {
                clusters[word] = [];
                // Assign keywords to this cluster
                Array.from(unclustered).forEach(k => {
                    if (k.toLowerCase().includes(word)) {
                        clusters[word].push(k);
                        unclustered.delete(k); // A keyword only belongs to the primary cluster (simplification)
                    }
                });
            }
        });

        // Format output
        let output = `Generated ${keywords.length} keywords from seed "${seed}" and clustered them by theme:\n\n`;

        Object.entries(clusters).forEach(([theme, list]) => {
            if (list.length > 0) {
                output += `📂 Cluster: ${theme.toUpperCase()} (${list.length})\n`;
                list.forEach(k => output += `  - ${k}\n`);
                output += '\n';
            }
        });

        if (unclustered.size > 0) {
            output += `📂 Cluster: MISC / LONG TAIL (${unclustered.size})\n`;
            Array.from(unclustered).forEach(k => output += `  - ${k}\n`);
        }

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
