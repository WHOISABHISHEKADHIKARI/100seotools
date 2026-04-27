import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { text, target_lang } = await request.json();

        if (!text) return NextResponse.json({ success: false, error: 'Text required' }, { status: 400 });

        // Generate Google Translate Link
        const encText = encodeURIComponent(text);
        const langMap = {
            'spanish': 'es', 'french': 'fr', 'german': 'de', 'italian': 'it',
            'chinese': 'zh-CN', 'japanese': 'ja', 'russian': 'ru', 'hindi': 'hi'
        };
        const langCode = langMap[target_lang.toLowerCase()] || 'auto';

        const translateUrl = `https://translate.google.com/?sl=auto&tl=${langCode}&text=${encText}&op=translate`;

        let output = `Text Translation Assistance\n`;
        output += `===========================\n\n`;

        output += `Real-time server-side translation requires a paid API key.\n`;
        output += `However, you can perform this translation completely free using the link below:\n\n`;

        output += `👉 [**Click here to Translate to ${target_lang} on Google Translate**](${translateUrl})\n\n`;

        output += `### Alternative (DeepL)\n`;
        output += `For higher nuance, try DeepL:\n`;
        output += `👉 [Translate on DeepL](https://www.deepl.com/translator#en/${langCode}/${encText})`;

        return NextResponse.json({ success: true, result: output });

    } catch (error) {
        return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
    }
}
