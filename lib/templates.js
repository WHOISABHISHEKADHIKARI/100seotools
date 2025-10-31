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
    default: {
      // Generic fallback
      const input = inputs.input || '';
      return input ? `Result for ${key}:\n${input}` : 'Provide input and run.';
    }
  }
}