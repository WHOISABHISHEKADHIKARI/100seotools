import { tokenize, countWords } from './utils';

// Template definitions provide fields and an action label
export function getTemplateDefinition(key) {
  const defs = {
    keywordSuggestions: {
      actionLabel: 'Generate',
      fields: [
        { name: 'seed', label: 'Seed Keyword', type: 'text', placeholder: 'e.g., coffee beans' },
        { name: 'locale', label: 'Locale (optional)', type: 'text', placeholder: 'e.g., US' }
      ]
    },
    longTailKeywords: {
      actionLabel: 'Generate',
      fields: [
        { name: 'seed', label: 'Seed Keyword', type: 'text', placeholder: 'e.g., vegan recipes' },
        { name: 'modifiers', label: 'Modifiers (comma-separated)', type: 'text', placeholder: 'best, how to, for beginners' }
      ]
    },
    keywordDensity: {
      actionLabel: 'Analyze',
      fields: [
        { name: 'text', label: 'Text Content', type: 'textarea', placeholder: 'Paste your content here...' },
        { name: 'focus', label: 'Focus Keyword', type: 'text', placeholder: 'e.g., apple pie recipe' }
      ]
    },
    metaTagGenerator: {
      actionLabel: 'Generate',
      fields: [
        { name: 'title', label: 'Title', type: 'text', placeholder: 'Page title' },
        { name: 'description', label: 'Meta Description', type: 'textarea', placeholder: 'Page description' },
        { name: 'url', label: 'Canonical URL', type: 'text', placeholder: 'https://example.com/page' }
      ]
    },
    metaDescriptionOptimizer: {
      actionLabel: 'Optimize',
      fields: [
        { name: 'description', label: 'Meta Description', type: 'textarea', placeholder: 'Enter meta description...' }
      ]
    },
    headingAnalyzer: {
      actionLabel: 'Analyze',
      fields: [
        { name: 'html', label: 'HTML', type: 'textarea', placeholder: '<h1>Title</h1>\n<h2>Subtitle</h2>' }
      ]
    },
    readabilityScore: {
      actionLabel: 'Calculate',
      fields: [
        { name: 'text', label: 'Text Content', type: 'textarea', placeholder: 'Paste your content...' }
      ]
    },
    duplicateContentChecker: {
      actionLabel: 'Compare',
      fields: [
        { name: 'a', label: 'Text A', type: 'textarea', placeholder: 'First text...' },
        { name: 'b', label: 'Text B', type: 'textarea', placeholder: 'Second text...' }
      ]
    },
    robotsTxtValidator: {
      actionLabel: 'Validate',
      fields: [
        { name: 'robots', label: 'robots.txt', type: 'textarea', placeholder: 'Paste robots.txt content' }
      ]
    },
    xmlSitemapVisualizer: {
      actionLabel: 'Visualize',
      fields: [
        { name: 'xml', label: 'Sitemap XML', type: 'textarea', placeholder: '<urlset>...</urlset>' }
      ]
    },
    titleMetaLengthCounter: {
      actionLabel: 'Count',
      fields: [
        { name: 'title', label: 'Title', type: 'text', placeholder: 'Enter page title' },
        { name: 'description', label: 'Meta Description', type: 'textarea', placeholder: 'Enter meta desc' }
      ]
    },
    aiArticleLengthOptimizer: {
      actionLabel: 'Optimize',
      fields: [
        { name: 'topic', label: 'Article Topic', type: 'text', placeholder: 'e.g., keyword research for beginners' },
        { name: 'intent', label: 'Search Intent', type: 'select', options: [
          { value: 'informational', label: 'Informational' },
          { value: 'commercial', label: 'Commercial' },
          { value: 'transactional', label: 'Transactional' },
          { value: 'navigational', label: 'Navigational' }
        ] },
        { name: 'competitorAvgWords', label: 'Competitor Average Word Count', type: 'number', placeholder: 'e.g., 1500' },
        { name: 'sectionCount', label: 'Planned Sections', type: 'number', placeholder: 'e.g., 8' },
        { name: 'audienceLevel', label: 'Audience Level', type: 'select', options: [
          { value: 'beginner', label: 'Beginner' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'advanced', label: 'Advanced' }
        ] }
      ]
    },
    schemaMarkupGenerator: {
      actionLabel: 'Generate',
      fields: [
        { name: 'type', label: 'Schema Type', type: 'text', placeholder: 'Article, Product, FAQPage, LocalBusiness' },
        { name: 'name', label: 'Name', type: 'text', placeholder: 'Entity name' },
        { name: 'url', label: 'URL', type: 'text', placeholder: 'https://example.com' },
        { name: 'desc', label: 'Description', type: 'textarea', placeholder: 'Short description' }
      ]
    },
    urlSlugGenerator: {
      actionLabel: 'Generate',
      fields: [
        { name: 'title', label: 'Title or Phrase', type: 'text', placeholder: 'e.g., 10 Tips for Better Sleep' }
      ]
    },
    ogTagGenerator: {
      actionLabel: 'Generate',
      fields: [
        { name: 'title', label: 'OG Title', type: 'text', placeholder: 'Title' },
        { name: 'desc', label: 'OG Description', type: 'textarea', placeholder: 'Description' },
        { name: 'image', label: 'OG Image URL', type: 'text', placeholder: 'https://...' },
        { name: 'url', label: 'Page URL', type: 'text', placeholder: 'https://...' }
      ]
    },
    searchPreviewSimulator: {
      actionLabel: 'Preview',
      fields: [
        { name: 'title', label: 'Title', type: 'text', placeholder: 'Title' },
        { name: 'description', label: 'Meta Description', type: 'textarea', placeholder: 'Description' },
        { name: 'url', label: 'URL', type: 'text', placeholder: 'https://example.com/page' }
      ]
    },
    reverseImageSearch: {
      actionLabel: 'Search',
      fields: [
        { name: 'imageUrl', label: 'Image URL', type: 'text', placeholder: 'https://example.com/image.jpg' },
        { name: 'imageFile', label: 'Or Upload Image', type: 'file', accept: 'image/*' }
      ]
    },
    aiContentDetector: {
      actionLabel: 'Analyze',
      fields: [
        { name: 'text', label: 'Text Content', type: 'textarea', placeholder: 'Paste the text you want to analyze for AI detection...' }
      ]
    },
    textTranslator: {
      actionLabel: 'Translate',
      fields: [
        { name: 'text', label: 'Text to Translate', type: 'textarea', placeholder: 'Enter text to translate...' },
        { name: 'fromLang', label: 'From Language', type: 'select', options: [
          { value: 'auto', label: 'Auto-detect' },
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
          { value: 'fr', label: 'French' },
          { value: 'de', label: 'German' },
          { value: 'it', label: 'Italian' },
          { value: 'pt', label: 'Portuguese' },
          { value: 'ru', label: 'Russian' },
          { value: 'ja', label: 'Japanese' },
          { value: 'ko', label: 'Korean' },
          { value: 'zh', label: 'Chinese' },
          { value: 'ar', label: 'Arabic' },
          { value: 'hi', label: 'Hindi' }
        ]},
        { name: 'toLang', label: 'To Language', type: 'select', options: [
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
          { value: 'fr', label: 'French' },
          { value: 'de', label: 'German' },
          { value: 'it', label: 'Italian' },
          { value: 'pt', label: 'Portuguese' },
          { value: 'ru', label: 'Russian' },
          { value: 'ja', label: 'Japanese' },
          { value: 'ko', label: 'Korean' },
          { value: 'zh', label: 'Chinese' },
          { value: 'ar', label: 'Arabic' },
          { value: 'hi', label: 'Hindi' }
        ]}
      ]
    }
  };
  return defs[key] || { actionLabel: 'Run', fields: [{ name: 'input', label: 'Input', type: 'textarea', placeholder: 'Enter input...' }] };
}

// Runner logic: produce meaningful output per template, client-side only
export function runTemplate(key, inputs) {
  switch (key) {
    case 'keywordSuggestions': {
      const seed = (inputs.seed || '').trim();
      if (!seed) return 'Enter a seed keyword.';
      const prefixes = ['best', 'top', 'how to', 'what is', 'guide to', 'cheap', 'near me', 'vs', 'for beginners'];
      const suffixes = ['2025', 'tips', 'ideas', 'examples', 'tools', 'free', 'review', 'comparison'];
      const variants = [];
      prefixes.forEach((p) => variants.push(`${p} ${seed}`));
      suffixes.forEach((s) => variants.push(`${seed} ${s}`));
      return variants.join('\n');
    }
    case 'longTailKeywords': {
      const seed = (inputs.seed || '').trim();
      const mods = (inputs.modifiers || '').split(',').map((m) => m.trim()).filter(Boolean);
      if (!seed) return 'Enter a seed keyword.';
      const baseMods = mods.length ? mods : ['for beginners', 'step by step', 'without oven', 'at home', 'near me', 'in 2025'];
      return baseMods.map((m) => `${seed} ${m}`).join('\n');
    }
    case 'keywordDensity': {
      const words = tokenize(inputs.text || '');
      const total = words.length;
      const focus = (inputs.focus || '').toLowerCase();
      const freq = words.filter((w) => w === focus).length;
      const density = total ? ((freq / total) * 100).toFixed(2) : '0.00';
      return `Words: ${total}\nFocus occurrences: ${freq}\nDensity: ${density}%`;
    }
    case 'metaTagGenerator': {
      const { title, description, url } = inputs;
      return [
        `<title>${title || ''}</title>`,
        `<meta name="description" content="${(description || '').replace(/"/g, '&quot;')}" />`,
        url ? `<link rel="canonical" href="${url}" />` : ''
      ].filter(Boolean).join('\n');
    }
    case 'metaDescriptionOptimizer': {
      const d = (inputs.description || '').trim();
      const len = d.length;
      const within = len >= 120 && len <= 160;
      return `Length: ${len} chars\nRecommended: 120–160\nStatus: ${within ? 'Good' : len < 120 ? 'Too short' : 'Too long'}`;
    }
    case 'headingAnalyzer': {
      const html = inputs.html || '';
      const matches = [...html.matchAll(/<(h[1-6])[^>]*>(.*?)<\/\1>/gi)].map((m) => ({ tag: m[1].toUpperCase(), text: m[2].replace(/<[^>]+>/g, '') }));
      if (!matches.length) return 'No headings found.';
      return matches.map((m) => `${m.tag}: ${m.text}`).join('\n');
    }
    case 'readabilityScore': {
      const text = inputs.text || '';
      const words = countWords(text);
      const sentences = (text.match(/[.!?]+/g) || []).length || 1;
      const syllables = (text.toLowerCase().match(/[aeiouy]{1,2}/g) || []).length;
      const flesch = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words || 0);
      const score = Math.max(0, Math.min(100, Math.round(flesch)));
      return `Words: ${words}\nSentences: ${sentences}\nEstimated syllables: ${syllables}\nFlesch Reading Ease: ${score}`;
    }
    case 'duplicateContentChecker': {
      const a = tokenize(inputs.a || '');
      const b = tokenize(inputs.b || '');
      const setA = new Set(a);
      const overlap = b.filter((w) => setA.has(w));
      const percent = (overlap.length / (b.length || 1)) * 100;
      return `Overlap words: ${overlap.length}\nSimilarity: ${percent.toFixed(2)}%\nCommon: ${[...new Set(overlap)].slice(0, 50).join(', ')}`;
    }
    case 'robotsTxtValidator': {
      const lines = (inputs.robots || '').split(/\r?\n/);
      const issues = [];
      lines.forEach((line, i) => {
        const l = line.trim();
        if (!l || l.startsWith('#')) return;
        if (!/^(User-agent|Disallow|Allow|Sitemap):/i.test(l)) issues.push(`Line ${i + 1}: Unrecognized directive "${l}"`);
      });
      return issues.length ? issues.join('\n') : 'robots.txt looks valid.';
    }
    case 'xmlSitemapVisualizer': {
      const xml = inputs.xml || '';
      const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/gi)].map((m) => m[1]);
      return urls.length ? urls.join('\n') : 'No <loc> entries found.';
    }
    case 'titleMetaLengthCounter': {
      const title = inputs.title || '';
      const desc = inputs.description || '';
      return `Title: ${title.length} chars (50–60 recommended)\nMeta Description: ${desc.length} chars (120–160 recommended)`;
    }
    case 'aiArticleLengthOptimizer': {
      const topic = (inputs.topic || '').trim();
      const intent = inputs.intent || 'informational';
      const competitorAvg = Number(inputs.competitorAvgWords || 0) || 0;
      const sectionCount = Math.max(1, Number(inputs.sectionCount || 0) || 8);
      const audience = inputs.audienceLevel || 'beginner';

      if (!topic) return 'Enter an article topic to optimize length.';

      // Baseline by intent
      const intentBaseline = {
        informational: 1400,
        commercial: 1800,
        transactional: 900,
        navigational: 600,
      }[intent] || 1400;

      // Audience adjustment
      const audienceAdj = {
        beginner: 1.15,
        intermediate: 1.0,
        advanced: 0.9,
      }[audience] || 1.0;

      // Competitor influence (weighted 40%)
      const compWeighted = competitorAvg ? Math.round(0.4 * competitorAvg + 0.6 * intentBaseline) : intentBaseline;

      // Section heuristic: ~150–250 words per section
      const perSection = 180;
      const sectionWords = sectionCount * perSection;

      // Aggregate and adjust
      let recommended = Math.round((compWeighted + sectionWords) * audienceAdj);
      // Clamp reasonable bounds
      recommended = Math.max(600, Math.min(4000, recommended));

      const outline = [
        'Introduction (80–120 words)',
        'Key Concepts (200–300 words)',
        'Step-by-Step/How-To (400–600 words)',
        'Examples/Use Cases (250–400 words)',
        'Common Pitfalls (150–250 words)',
        'Advanced Tips (200–300 words)',
        'Conclusion & Next Steps (100–180 words)'
      ];

      const tips = [
        'Aim for clear subheadings every 150–250 words.',
        'Use short paragraphs and scannable lists to improve readability.',
        'Include internal links to supporting guides and tools.',
        'Add a summary or TL;DR for advanced audiences.',
      ];

      return [
        `Topic: ${topic}`,
        `Intent: ${intent}`,
        `Audience: ${audience}`,
        competitorAvg ? `Competitor Avg: ${competitorAvg} words` : 'Competitor Avg: n/a',
        `Planned Sections: ${sectionCount}`,
        '',
        `Recommended Length: ${recommended} words`,
        '',
        'Suggested Outline:',
        ...outline.map((o, i) => `${i + 1}. ${o}`),
        '',
        'Optimization Tips:',
        ...tips.map((t) => `- ${t}`),
      ].join('\n');
    }
    case 'schemaMarkupGenerator': {
      const { type, name, url, desc } = inputs;
      const data = {
        '@context': 'https://schema.org',
        '@type': type || 'Thing',
        name: name || '',
        url: url || undefined,
        description: desc || ''
      };
      return JSON.stringify(data, null, 2);
    }
    case 'urlSlugGenerator': {
      const title = inputs.title || '';
      const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
      return slug;
    }
    case 'ogTagGenerator': {
      const { title, desc, image, url } = inputs;
      return [
        `<meta property="og:title" content="${title || ''}" />`,
        `<meta property="og:description" content="${(desc || '').replace(/"/g, '&quot;')}" />`,
        image ? `<meta property="og:image" content="${image}" />` : '',
        url ? `<meta property="og:url" content="${url}" />` : ''
      ].filter(Boolean).join('\n');
    }
    case 'searchPreviewSimulator': {
      const { title, description, url } = inputs;
      const t = title || '';
      const d = description || '';
      const trimmedT = t.length > 60 ? t.slice(0, 57) + '...' : t;
      const trimmedD = d.length > 160 ? d.slice(0, 157) + '...' : d;
      return `${trimmedT}\n${url || 'https://example.com'}\n${trimmedD}`;
    }
    case 'reverseImageSearch': {
      const { imageUrl, imageFile } = inputs;
      if (!imageUrl && !imageFile) return 'Please provide an image URL or upload an image file.';

      const searchEngines = [
        'Google Images: https://images.google.com/searchbyimage?image_url=' + encodeURIComponent(imageUrl || ''),
        'TinEye: https://tineye.com/search?url=' + encodeURIComponent(imageUrl || ''),
        'Yandex Images: https://yandex.com/images/search?rpt=imageview&url=' + encodeURIComponent(imageUrl || ''),
        'Bing Visual Search: https://www.bing.com/images/searchbyimage?cbir=sbi&imgurl=' + encodeURIComponent(imageUrl || '')
      ];

      return `Reverse Image Search Results:\n\n${searchEngines.join('\n\n')}\n\nNote: Click on the links above to search for similar images across different search engines.`;
    }
    case 'aiContentDetector': {
      const text = inputs.text || '';
      if (!text.trim()) return 'Please enter text to analyze.';

      const words = text.split(/\s+/).length;
      const sentences = (text.match(/[.!?]+/g) || []).length;
      const avgWordsPerSentence = sentences > 0 ? (words / sentences).toFixed(1) : 0;

      // Simple heuristics for AI detection (this is a basic implementation)
      const aiIndicators = [];
      const humanIndicators = [];

      // Check for repetitive patterns
      const repetitiveWords = text.toLowerCase().match(/\b(\w+)\b(?=.*\b\1\b)/g);
      if (repetitiveWords && repetitiveWords.length > words * 0.1) {
        aiIndicators.push('High word repetition detected');
      } else {
        humanIndicators.push('Natural word variation');
      }

      // Check sentence length consistency
      if (avgWordsPerSentence > 20) {
        aiIndicators.push('Consistently long sentences');
      } else if (avgWordsPerSentence < 10) {
        humanIndicators.push('Varied sentence lengths');
      }

      // Check for common AI phrases
      const aiPhrases = ['furthermore', 'moreover', 'in conclusion', 'it is important to note', 'additionally'];
      const aiPhraseCount = aiPhrases.filter(phrase => text.toLowerCase().includes(phrase)).length;
      if (aiPhraseCount > 2) {
        aiIndicators.push('Common AI transition phrases detected');
      }

      const aiScore = Math.min(100, (aiIndicators.length / (aiIndicators.length + humanIndicators.length)) * 100);
      const humanScore = 100 - aiScore;

      return `AI Content Detection Analysis:

Text Statistics:
- Words: ${words}
- Sentences: ${sentences}
- Average words per sentence: ${avgWordsPerSentence}

Detection Results:
- AI Likelihood: ${aiScore.toFixed(1)}%
- Human Likelihood: ${humanScore.toFixed(1)}%

AI Indicators Found:
${aiIndicators.length > 0 ? aiIndicators.map(i => `• ${i}`).join('\n') : '• None detected'}

Human Indicators Found:
${humanIndicators.length > 0 ? humanIndicators.map(i => `• ${i}`).join('\n') : '• None detected'}

Note: This is a basic analysis. For more accurate detection, consider using specialized AI detection services.`;
    }
    case 'textTranslator': {
      const { text, fromLang, toLang } = inputs;
      if (!text.trim()) return 'Please enter text to translate.';
      if (!toLang) return 'Please select a target language.';

      const langNames = {
        'auto': 'Auto-detect',
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'pt': 'Portuguese',
        'ru': 'Russian',
        'ja': 'Japanese',
        'ko': 'Korean',
        'zh': 'Chinese',
        'ar': 'Arabic',
        'hi': 'Hindi'
      };

      const fromLangName = langNames[fromLang] || fromLang;
      const toLangName = langNames[toLang] || toLang;

      // This is a demo implementation - in a real app, you'd integrate with Google Translate API or similar
      const translationServices = [
        `Google Translate: https://translate.google.com/?sl=${fromLang || 'auto'}&tl=${toLang}&text=${encodeURIComponent(text)}`,
        `DeepL: https://www.deepl.com/translator#${fromLang || 'auto'}/${toLang}/${encodeURIComponent(text)}`,
        `Bing Translator: https://www.bing.com/translator?from=${fromLang || 'auto'}&to=${toLang}&text=${encodeURIComponent(text)}`
      ];

      return `Translation Request:
From: ${fromLangName}
To: ${toLangName}

Original Text:
${text}

Translation Services:
${translationServices.join('\n')}

Note: Click on the links above to translate using different services. For API integration, consider Google Translate API, DeepL API, or Azure Translator.`;
    }
    default: {
      // Generic fallback
      const input = inputs.input || '';
      return input ? `Result for ${key}:\n${input}` : 'Provide input and run.';
    }
  }
}
