import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { json } = await request.json();

        if (!json) return NextResponse.json({ success: false, error: 'JSON content required' }, { status: 400 });

        let parsed;
        try {
            parsed = JSON.parse(json);
        } catch (e) {
            return NextResponse.json({ success: true, result: `❌ Invalid JSON Syntax:\n${e.message}` });
        }

        const checks = [];
        let valid = true;

        if (parsed['@context'] && (parsed['@context'] === 'https://schema.org' || parsed['@context'] === 'http://schema.org')) {
            checks.push('✅ Correct @context (schema.org)');
        } else {
            valid = false;
            checks.push('❌ Missing or incorrect @context');
        }

        if (parsed['@type']) {
            checks.push(`✅ Found @type: "${parsed['@type']}"`);
        } else {
            valid = false;
            checks.push('❌ Missing @type');
        }

        let result = valid
            ? '✅ VALID STRUCTURED DATA\nThe JSON-LD syntax is correct and contains basic Schema.org properties.'
            : '⚠️ VALIDATION ISSUES FOUND';

        result += `\n\nDetails:\n` + checks.join('\n');

        // Check known required fields for common types
        const type = parsed['@type'];
        if (type === 'FAQPage' && !parsed.mainEntity) result += '\n⚠️ FAQPage usually requires "mainEntity" array.';
        if (type === 'Article' && !parsed.headline) result += '\n⚠️ Article usually requires "headline".';

        return NextResponse.json({ success: true, result });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
