import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { questions } = await request.json();

        if (!questions) return NextResponse.json({ success: false, error: 'Questions required' }, { status: 400 });

        const lines = questions.replace(/\r/g, '').split('\n').filter(l => l.trim());

        const entities = lines.map(line => {
            const parts = line.split('|');
            if (parts.length < 2) return null;

            let q = parts[0].trim();
            let a = parts[1].trim();

            // Remove "Q:" "A:" prefixes if present
            q = q.replace(/^Q:?\s*/i, '');
            a = a.replace(/^A:?\s*/i, '');

            return {
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": a
                }
            };
        }).filter(x => x);

        if (entities.length === 0) return NextResponse.json({ success: false, error: 'No valid Q&A pairs found. Use format "Question | Answer"' }, { status: 400 });

        const schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": entities
        };

        const script = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;

        return NextResponse.json({ success: true, result: script });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
