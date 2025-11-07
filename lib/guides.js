import { getTemplateDefinition } from './templates';

// Generic guidance generator applied across all tools
// Produces purpose, howToUse, outputExplanation, benefits, useCases
export function getToolGuide(tool) {
  const def = getTemplateDefinition(tool.template);

  // Purpose: reuse tool description when available
  const purpose = tool.description || `This tool helps with ${tool.name.toLowerCase()}.`;

  // How to use: describe fields and action
  const fieldSteps = (def.fields || []).map((f) => {
    const example = f.placeholder ? ` e.g., ${f.placeholder}` : '';
    return `- ${f.label}:${example ? example : ''}`;
  }).join('\n');
  const howToUse = [
    `1) Fill the form inputs:`,
    fieldSteps,
    `2) Click "${def.actionLabel || 'Run'}" to process the inputs.`,
    `3) Review the Output panel. Copy or download results as needed.`,
  ].filter(Boolean).join('\n');

  // Output explanation: special-cases for common templates, otherwise generic
  let outputExplanation = 'The output reflects the processed result of your inputs, formatted for quick review and reuse.';
  switch (tool.template) {
    case 'keywordSuggestions':
      outputExplanation = 'Lists keyword variations built with common prefixes and suffixes around your seed keyword, each on a new line for easy copying.';
      break;
    case 'longTailKeywords':
      outputExplanation = 'Generates long-tail keyword phrases by combining your seed keyword with modifiers (e.g., intents, audiences, qualifiers).';
      break;
    case 'keywordDensity':
      outputExplanation = 'Reports total words, focus keyword occurrences, and density percentage to guide on-page optimization.';
      break;
    case 'metaTagGenerator':
      outputExplanation = 'Produces HTML `<title>`, meta description, and optional canonical tag you can paste into your page.';
      break;
    case 'schemaMarkupGenerator':
      outputExplanation = 'Outputs valid JSON-LD based on your inputs, ready to embed in `<script type="application/ld+json">`.';
      break;
    case 'urlSlugGenerator':
      outputExplanation = 'Returns a clean, SEO-friendly URL slug derived from your title or phrase.';
      break;
    case 'ogTagGenerator':
      outputExplanation = 'Generates Open Graph meta tags for better social sharing previews (title, description, image, URL).';
      break;
    case 'searchPreviewSimulator':
      outputExplanation = 'Shows a truncated SERP-style preview: title, URL, and meta description as search engines may display.';
      break;
    default:
      // keep generic
      break;
  }

  // Benefits and use-cases by category
  const categoryBenefits = {
    'Keyword Research': [
      'Discover new keyword opportunities and long-tail variations',
      'Improve topical coverage and content planning',
      'Support PPC keyword expansion and clustering',
      'Identify search intents to align content'
    ],
    'On-Page Optimization': [
      'Enhance metadata quality and relevance',
      'Improve content structure and readability',
      'Align headings and copy with target keywords',
      'Increase chances of rich results and better CTR'
    ],
    'Technical SEO': [
      'Validate tags and structured data for crawlability',
      'Spot technical issues before they impact indexing',
      'Optimize for discoverability across devices and locales',
      'Strengthen site foundations for performance'
    ],
    'Backlink & Link-Building': [
      'Find relevant link opportunities and categories',
      'Assess link quality and anchor text relevance',
      'Organize outreach with structured templates',
      'Grow authority with ethical acquisition strategies'
    ],
    'Content SEO': [
      'Create clearer, more engaging content',
      'Calibrate tone and headings for UX and SEO',
      'Balance keyword use with readability',
      'Support ideation with AI-powered helpers'
    ],
    'SEO Performance': [
      'Estimate potential traffic and CTR changes',
      'Track ranking progress with simple outputs',
      'Simulate performance scenarios to plan improvements',
      'Prioritize changes with data-backed signals'
    ],
    'Local SEO': [
      'Optimize for local intent and citations',
      'Structure business info for consistency',
      'Strengthen local presence with focused content',
      'Support GBP optimization and review responses'
    ],
    'Competitor Analysis': [
      'Identify gaps versus competitors at a glance',
      'Analyze overlap in keywords and backlinks',
      'Spot ranking opportunities and content angles',
      'Build reports for strategy alignment'
    ],
    'AI-Powered SEO': [
      'Generate helpful, structured AI outputs quickly',
      'Accelerate ideation with prompts and templates',
      'Improve drafts while keeping human oversight',
      'Adapt outputs to brand tone and goals'
    ],
    'SEO Utility': [
      'Use handy, focused tools for quick tasks',
      'Format, count, and validate common inputs',
      'Speed up everyday SEO checks and prep',
      'Reduce context switching with in-browser utilities'
    ]
  };

  const categoryUseCases = {
    'Keyword Research': [
      'Plan blog topics around clusters and modifiers',
      'Build PPC ad groups with themed variants',
      'Enrich product and category page keywords',
      'Prepare briefs with search intent mapping'
    ],
    'On-Page Optimization': [
      'Write better titles and descriptions',
      'Organize headings for clarity and SEO',
      'Calibrate keyword density and semantic coverage',
      'Check SERP previews before publishing'
    ],
    'Technical SEO': [
      'Validate robots.txt and sitemaps fast',
      'Generate schema for common entities',
      'Check meta lengths and HTML structure',
      'Simulate status and redirects during audits'
    ],
    'Backlink & Link-Building': [
      'Find outreach ideas based on categories',
      'Draft email templates and track efforts',
      'Review anchor text distribution for balance',
      'Segment sources by relevance and risk'
    ],
    'Content SEO': [
      'Tune tone and readability for audiences',
      'Structure paragraphs with keyword alignment',
      'Generate FAQs and product copy drafts',
      'Find freshness gaps and update ideas'
    ],
    'SEO Performance': [
      'Forecast traffic potential for topics',
      'Gauge CTR impacts from titles and snippets',
      'Compare sites to benchmark efforts',
      'Prioritize actions with simple calculators'
    ],
    'Local SEO': [
      'Draft consistent NAP and local schema',
      'Plan location content with geo-modifiers',
      'Optimize GBP responses and categories',
      'Identify local citation opportunities'
    ],
    'Competitor Analysis': [
      'Map keyword overlaps and gaps quickly',
      'Find backlink strategies competitors use',
      'Generate comparison reports for stakeholders',
      'Surface ranking opportunities by theme'
    ],
    'AI-Powered SEO': [
      'Create outlines and titles with guardrails',
      'Rewrite competitor titles for testing',
      'Improve draft content for clarity and tone',
      'Generate schemas from structured inputs'
    ],
    'SEO Utility': [
      'Convert text to HTML and validate tags',
      'Count words or visualize sitemaps',
      'Generate slugs and OG tags in seconds',
      'Run quick checks without external tools'
    ]
  };

  const benefits = categoryBenefits[tool.category] || [
    'Quick, client-side processing with no login',
    'Clear outputs designed for copy/paste use',
    'Lightweight helpers that speed up workflows',
    'Consistent UI across 100+ free tools'
  ];
  const useCases = categoryUseCases[tool.category] || [
    'Everyday SEO tasks and quick validation',
    'Content prep and metadata tuning',
    'Research and audit support',
    'Sharing simple outputs with teammates'
  ];

  // Optional reference cards for specific tools
  let referenceCards = [];
  const httpStatusItems = [
    { code: '200', label: 'OK', note: 'Page successfully loaded (good for SEO).' },
    { code: '301', label: 'Moved Permanently', note: 'Use this for SEO-friendly redirects.' },
    { code: '302', label: 'Found (Temporary Redirect)', note: 'Temporary redirect; not ideal for SEO.' },
    { code: '304', label: 'Not Modified', note: 'Used for caching to reduce load times.' },
    { code: '307', label: 'Temporary Redirect', note: 'Preserves method; similar to 302 but safer.' },
    { code: '308', label: 'Permanent Redirect', note: 'Similar to 301 but preserves request method.' },
    { code: '400', label: 'Bad Request', note: 'Client sent invalid data (fix syntax or parameters).' },
    { code: '403', label: 'Forbidden', note: 'User is not authorized to view content.' },
    { code: '404', label: 'Not Found', note: 'Important to customize for SEO and UX.' },
    { code: '410', label: 'Gone', note: 'Tell search engines a page is permanently deleted.' },
    { code: '429', label: 'Too Many Requests', note: 'Helps rate-limit bots or excessive requests.' },
    { code: '500–503', label: 'Server Errors', note: 'Fix quickly; they harm SEO and user trust.' },
  ];

  if ([
    'http-status-code-tester',
    'redirect-checker',
    'redirect-301-generator',
    'canonical-url-builder'
  ].includes(tool.slug)) {
    referenceCards.push({
      title: 'HTTP Status Codes – Quick Reference',
      items: httpStatusItems
    });
  }

  // Minimal structured sections aligned with instruction/guide.txt
  const hero = {
    h1: `${tool.name} | Free AI SEO Tool by 100SEOTools`,
    subheadline: `Generate and optimize with fast, helpful outputs`,
    oneLiner: purpose,
    ctaText: def.actionLabel || 'Generate'
  };

  const introduction = `${tool.name} is a free ${tool.category.toLowerCase()} tool designed to help you work faster with clear, copy‑ready outputs. It runs entirely in your browser with no login and keeps your workflow simple: enter inputs, click ${def.actionLabel || 'Run'}, and reuse the results immediately. If you’re drafting, validating, or improving content and metadata, this tool helps you get consistent, SEO‑friendly results with minimal effort.`;

  const whatItDoes = `This tool processes your inputs using a structured template for ${tool.name.toLowerCase()}. It formats outputs for quick review and reuse, and it emphasizes clarity, relevance, and basic SEO guardrails. Typical results include concise text blocks, lists, or JSON snippets that are ready for copying to your CMS or codebase.`;

  const whyItMattersSEO = `Clear, structured outputs improve crawlability and user engagement. By aligning titles, descriptions, headings, and copy with keywords and intent, you set content up for better indexing and richer snippets. Lightweight client‑side tools also reduce friction for everyday checks, keeping your SEO process responsive and consistent.`;

  const howToSteps = (def.fields || []).map((f, i) => ({
    step: `Step ${i + 1}: Enter ${f.label.toLowerCase()}`,
    tip: `Pro tip: Use specific, audience‑aware phrasing${f.placeholder ? ` (e.g., ${f.placeholder})` : ''}.`
  })).concat([
    { step: `Step ${Math.max(2, (def.fields || []).length + 1)}: Click ${def.actionLabel || 'Run'}`,
      tip: 'Pro tip: Keep inputs focused; iterate quickly for improvements.' },
    { step: `Step ${Math.max(3, (def.fields || []).length + 2)}: Review the output`,
      tip: 'Pro tip: Edit lightly to match brand voice and intent.' }
  ]);

  const features = [
    'Fast, client‑side processing with no login',
    'Clear outputs designed for copy/paste',
    'Consistent UI across tools',
    'Basic SEO guardrails baked into templates',
    'Accessible form controls and keyboard‑friendly actions',
    'Download and copy utilities for reuse'
  ];

  const exampleResults = `Example outputs are concise and structured for immediate use. Expect clean lines, readable lists, or small blocks of text that you can drop into drafts, metadata, or documentation. Adjust tone and specificity to match your audience.`;

  const bestPractices = [
    'Write for humans first; be clear and specific',
    'Use primary keywords naturally; avoid stuffing',
    'Prefer short paragraphs and descriptive headings',
    'Iterate: small input tweaks can improve outputs',
    'Keep accessibility in mind for labels and CTAs'
  ];

  // Minimal related tools (ensure slugs exist)
  const relatedTools = [
    'blog-title-generator',
    'heading-analyzer',
    'ai-content-improver',
    'ai-meta-tag-writer',
    'keyword-gap-finder',
    'sitemap-generator',
    'og-tag-generator',
    'url-slug-generator'
  ];

  // Minimal FAQs
  const faqs = [
    { q: `How do I use ${tool.name}?`, a: howToUse.replace(/\n/g, ' ') },
    { q: `Is ${tool.name} free?`, a: 'Yes, it is free to use with no login. All processing happens in your browser.' },
    { q: 'Does it work on mobile?', a: 'Yes. The UI is mobile‑friendly and supports touch and keyboard.' },
    { q: 'What makes this better than competitors?', a: 'It is fast, simple, and focused on clear, reusable outputs with basic SEO guardrails.' },
    { q: 'How accurate is it?', a: 'Outputs reflect your inputs and templates. Review and edit for brand voice and specificity.' },
    { q: 'Can I customize tone and audience?', a: 'Yes. Provide context in inputs; adjust wording after generation as needed.' },
    { q: 'Is my data private?', a: 'Yes. Processing is local to your browser; we do not store inputs or outputs.' },
    { q: 'Can I download results?', a: 'Yes. Use the Download button to save outputs for reuse.' }
  ];

  const cta = `Generate your result now and move forward with a clear, copy‑ready output that aligns with your SEO goals.`;

  return { purpose, howToUse, outputExplanation, benefits, useCases, referenceCards,
    hero, introduction, whatItDoes, whyItMattersSEO, howToSteps, features,
    exampleResults, bestPractices, relatedTools, faqs, cta };
}