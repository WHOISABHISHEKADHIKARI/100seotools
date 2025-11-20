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

  let exampleResults = `Example outputs are concise and structured for immediate use. Expect clean lines, readable lists, or small blocks of text that you can drop into drafts, metadata, or documentation. Adjust tone and specificity to match your audience.\n\nSample JSON:\n{\n  \"tool\": \"${tool.slug}\",\n  \"inputs\": ${JSON.stringify((def.fields || []).reduce((acc, f) => { acc[f.name] = f.placeholder || ''; return acc; }, {}))},\n  \"outputHint\": \"Copy/paste into CMS, HTML tags, or docs\"\n}`;

  const bestPractices = [
    'Write for humans first; be clear and specific',
    'Use primary keywords naturally; avoid stuffing',
    'Prefer short paragraphs and descriptive headings',
    'Iterate: small input tweaks can improve outputs',
    'Keep accessibility in mind for labels and CTAs'
  ];

  let qualityAccessibility = [
    'Use H1 for page title; H2/H3 for sections',
    'Accessible link/button text with sufficient color contrast',
    'Consistent terms: Tool, Feature, Input, Output, Results, Settings'
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

  if (tool.slug === 'content-freshness-checker') {
    faqs.unshift(
      { q: 'What counts as fresh content in 2025?', a: 'Recent data points (2024–2025), updated examples, and current best practices aligned to search guidelines. Remove legacy tactics and add internal links to topical pages.' },
      { q: 'How do I prioritize updates?', a: 'Fix outdated claims first, refresh statistics and sources, improve heading hierarchy, and tune titles/meta for CTR. Add a last‑updated note where appropriate.' },
      { q: 'Can this help E‑E‑A‑T?', a: 'Yes. Encourages current citations, clearer explanations, and practical steps, which support experience and expertise signals.' },
      { q: 'How is the freshness score computed?', a: 'We weigh recent sources, year references, structural clarity, and metadata completeness. Issues receive severity tags; the score reflects how much work is needed to align with current expectations.' },
      { q: 'Should I compare against competitors?', a: 'Yes. Benchmark headings, internal links, and recency against top pages. Use Keyword Clustering and Competitor Overlap to identify gaps.' }
    );
    bestPractices.push('Cite primary sources from 2024–2025 and link to them');
    bestPractices.push('Add a “last updated” note for transparency when appropriate');
    bestPractices.push('Strengthen internal links to category hubs and related tools');
    benefits.push('Higher trust signals with transparent updates and sources');
    useCases.push('Audit evergreen guides for outdated claims and stale references');
    useCases.push('Standardize refresh workflow for editors and SEO teams');
    exampleResults = `Example: Freshness Audit\n\nFindings:\n- Outdated year mentions (2018, 2019) in intro\n- Missing citations for 2024 data point\n- Meta description too long (178 chars)\n- Passive voice across 3 paragraphs\n\nFixes:\n- Update examples with 2024–2025 sources\n- Add internal links to category hubs and relevant tools\n- Tighten meta description (≤155 chars)\n- Rewrite passive sentences for clarity\n\nScore: 64/100 → After fixes: 86/100`;
    qualityAccessibility.push('Use transparent “last updated” and cite sources consistently');
    relatedTools.unshift('ai-content-detector', 'heading-analyzer', 'keyword-clustering-tool', 'competitor-keyword-overlap-checker');
  }

  if (tool.slug === 'ai-schema-generator') {
    faqs.unshift(
      { q: 'How do I connect WebPage and Article in JSON‑LD?', a: 'Use a connected @graph. Include a WebPage node with @id set to the canonical page URL, and set Article.isPartOf to { "@id": <page URL> }.' },
      { q: 'How do I add FAQ to a page?', a: 'Parse Q|A lines into Question and Answer entities within a FAQPage node. Only use FAQs that reflect visible content on the page.' },
      { q: 'How should I validate schema?', a: 'Run the output through Google’s Rich Results Test and verify it matches visible content. Avoid excessive properties or unsupported types.' },
      { q: 'Does the output avoid HTML fragments?', a: 'Yes. Copy uses normalized plain text with StartFragment/EndFragment markers removed to prevent invalid JSON.' },
      { q: 'Which types are supported?', a: 'Article, Product, LocalBusiness, FAQPage, and SoftwareApplication templates are supported via inputs.' }
    );
    // Expand example outputs for clarity
    exampleResults = exampleResults + '\n\nExamples (plain JSON‑LD):\n\nArticle:\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Title",\n  "mainEntityOfPage": "https://example.com/blog/post"\n}\n\nProduct:\n{\n  "@context": "https://schema.org",\n  "@type": "Product",\n  "name": "Product Name",\n  "offers": { "@type": "Offer", "price": "19.99", "priceCurrency": "USD" }\n}\n\nLocalBusiness:\n{\n  "@context": "https://schema.org",\n  "@type": "LocalBusiness",\n  "name": "Business Name",\n  "address": { "@type": "PostalAddress", "streetAddress": "123 Main St" }\n}\n\nFAQPage:\n{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": [{ "@type": "Question", "name": "Q?", "acceptedAnswer": { "@type": "Answer", "text": "A." } }]\n}';
    // Step-by-step usage emphasis
    howToSteps.push(
      { step: 'Step: Choose entity type', tip: 'Select Article, Product, LocalBusiness, or FAQPage based on content.' },
      { step: 'Step: Add canonical URL', tip: 'Use the exact page URL for WebPage/@id and isPartOf.' },
      { step: 'Step: Generate and copy', tip: 'Copy clean JSON‑LD; avoid adding HTML tags.' },
      { step: 'Step: Validate', tip: 'Test in Rich Results; ensure properties match visible content.' }
    );
    // Best practices and accessibility
    bestPractices.push('Validate JSON‑LD in Rich Results Test before publishing');
    bestPractices.push('Benchmark schema coverage against top pages for “100 SEO tools”');
    qualityAccessibility.push('Ensure outputs are clean strings (no HTML fragments)');
    // Related tools for interlinking
    relatedTools.unshift('schema-markup-generator', 'structured-data-validator', 'xml-sitemap-visualizer');
  }

  if (tool.slug === 'keyword-suggestion-tool') {
    faqs.unshift(
      { q: 'How do I find long‑tail variations?', a: 'Generate suggestions from a specific seed, then add qualifiers like audience, location, price, and use cases. Select phrases with clear intent and lower competition.' },
      { q: 'How do I build keyword clusters?', a: 'Group related suggestions by theme (problem, solution, brand, comparison). Map each cluster to a hub page with supporting articles and interlink them.' },
      { q: 'How can I compare against competitors?', a: 'Use Competitor Overlap and Keyword Gap tools to see which themes competitors cover. Prioritize clusters where your site has thin or no coverage.' },
      { q: 'Which search intents should I target?', a: 'Balance informational (how/why), transactional (buy/price), navigational (brand), and commercial investigation (best vs compare). Match intent to page type and CTAs.' }
    );
    bestPractices.push('Group suggestions into themed clusters');
    bestPractices.push('Map clusters to search intent and page types');
    bestPractices.push('Expand long‑tail and LSI variants for depth');
    bestPractices.push('Prioritize low‑competition, high‑intent phrases');
    bestPractices.push('Interlink cluster pages with descriptive anchors');
    qualityAccessibility.push('Use concise, descriptive anchor text when interlinking clusters');
    relatedTools.unshift('long-tail-keyword-generator', 'keyword-clustering-tool', 'keyword-intent-identifier', 'competitor-keyword-overlap-checker', 'keyword-gap-finder');
    howToSteps.push(
      { step: 'Step: Seed and generate', tip: 'Start with a focused seed and produce suggestions.' },
      { step: 'Step: Expand variants', tip: 'Add long‑tail and LSI modifiers to deepen coverage.' },
      { step: 'Step: Cluster and label', tip: 'Group ideas by theme and tag intent (info/transactional/commercial).' },
      { step: 'Step: Benchmark competitors', tip: 'Compare clusters to competitor coverage; flag gaps to target.' },
      { step: 'Step: Plan internal links', tip: 'Link hub ↔ spokes with keyword‑rich, natural anchors.' }
    );
    exampleResults = `Keyword Clusters\n\nSeed: keyword suggestion tool\n\nInformational\n- how to get keyword suggestions\n- keyword suggestion examples\n- what is a keyword cluster\n\nCommercial Investigation\n- best keyword suggestion tools\n- keyword suggestion tool vs generator\n- keyword clustering tool alternatives\n\nTransactional\n- buy keyword research software\n- keyword tool pricing\n- free keyword suggestion online\n\nNext Steps\n- Choose 1–2 clusters to publish first\n- Draft hub page and 3–5 supporting articles\n- Add internal links and compare to competitors`;
  }

  if (tool.slug === 'on-page-seo-audit-checker') {
    faqs.unshift(
      { q: 'What does an on‑page audit check?', a: 'Titles, meta descriptions, headings, body copy clarity, internal links and anchors, image alt text, canonical, JSON‑LD validity, and indexation hints.' },
      { q: 'How often should I audit?', a: 'Before publishing and after major template or content changes. Re‑audit core pages quarterly.' },
      { q: 'How do I use results?', a: 'Apply fixes in a small loop: metadata → headings → copy → links → schema. Record changes and measure CTR and rankings.' }
    );
    bestPractices.push('Keep titles and meta descriptive and intent‑aligned');
    bestPractices.push('Use one H1 and descriptive H2/H3 sections');
    bestPractices.push('Link hubs ↔ spokes with varied, natural anchors');
    bestPractices.push('Validate schema; avoid conflicting microdata');
    bestPractices.push('Consolidate overlapping pages to prevent cannibalization');
    qualityAccessibility.push('Ensure headings follow a logical hierarchy');
    qualityAccessibility.push('Provide alt text for meaningful images');
    relatedTools.unshift('meta-tag-generator', 'heading-analyzer', 'structured-data-validator', 'internal-linking-planner');
    howToSteps.push(
      { step: 'Step: Analyze URL', tip: 'Run the audit and capture baseline signals.' },
      { step: 'Step: Fix metadata', tip: 'Clarify title and meta description; align with intent.' },
      { step: 'Step: Repair headings', tip: 'Use single H1; add descriptive H2/H3.' },
      { step: 'Step: Improve copy', tip: 'Add examples, evidence, and references to raise trust.' },
      { step: 'Step: Link planning', tip: 'Add 3–5 internal links using descriptive anchors.' },
      { step: 'Step: Validate schema', tip: 'Check JSON‑LD; correct required properties.' }
    );
    exampleResults = `Audit Summary\n\nMetadata\n- Title: concise, intent‑aligned\n- Meta description: clear benefit, correct length\n\nHeadings\n- H1: unique\n- H2/H3: descriptive sections\n\nContent\n- Clarity: good\n- Evidence: add references in section 3\n\nLinks\n- Internal anchors: add hub ↔ spokes\n\nMedia\n- Alt text: missing on 2 images\n\nTechnical\n- Canonical: set\n- JSON‑LD: Article valid (missing image)\n\nNext Steps\n- Fix alt text\n- Add 4 internal links\n- Add FAQ section and validate schema`;
  }

  if (tool.slug === 'keyword-clustering-tool') {
    faqs.unshift(
      { q: 'How do I choose cluster names?', a: 'Use clear, descriptive labels that reflect the dominant theme and intent. Prefer user‑language over internal jargon.' },
      { q: 'How should I tag search intent?', a: 'Start with informational, commercial investigation, transactional, and navigational. Map each cluster to a matching page type.' },
      { q: 'How do I avoid cannibalization?', a: 'Consolidate overlapping topics and use hub‑and‑spoke structure. Link spokes to hubs with descriptive anchors; avoid publishing near‑duplicate pages.' },
      { q: 'How can I compare clusters vs competitors?', a: 'Run Competitor Overlap and Keyword Gap tools on top domains. Flag themes competitors rank for where you have thin or zero coverage; publish those clusters first.' },
      { q: 'What is short‑tail intent for "keyword suggest"?', a: 'Short‑tail searches expect fast idea lists and clear categories. Provide concise outputs with semantic groups and quick export options.' },
      { q: 'Free vs paid keyword clustering tools?', a: 'Free tools are great for planning and ideation, producing clean cluster lists and URL maps. Paid tools add automation, SERP scraping, and large‑scale datasets. Start free, validate architecture, then consider paid for scale.' },
      { q: 'How does NLP‑based grouping work?', a: 'NLP groups queries by semantic similarity using tokenization, embeddings, and distance thresholds. Label clusters with intent (info, commercial, transactional, navigational) and map one URL per theme.' },
      { q: 'What is pillar (hub) architecture?', a: 'Create a pillar page for the main theme, then publish supporting articles for subtopics. Link hub ↔ spokes with natural anchors to distribute authority and improve discovery.' },
      { q: 'Step‑by‑step clustering workflow?', a: 'Collect 100–500 keywords → remove noise → cluster by theme → tag intent → assign one hub URL per theme → plan 3–5 spokes → add internal links → benchmark against competitors.' }
    );
    bestPractices.push('Name clusters by theme and intent, not exact strings');
    bestPractices.push('Map cluster → URL before drafting copy');
    bestPractices.push('Plan 3–5 internal links per page with natural anchors');
    bestPractices.push('Benchmark coverage against 2–3 competitors');
    bestPractices.push('Use free clustering to prototype; scale with paid if needed');
    bestPractices.push('Label intent per cluster and match page types');
    qualityAccessibility.push('Use scannable H2/H3 with clear intent labels');
    relatedTools.unshift('keyword-intent-identifier', 'competitor-keyword-overlap-checker', 'keyword-gap-finder', 'internal-linking-planner');
    howToSteps.push(
      { step: 'Step: Prepare list', tip: 'Paste 100–500 keywords; remove duplicates and noise.' },
      { step: 'Step: Cluster', tip: 'Group by semantic similarity; label each theme with intent.' },
      { step: 'Step: Map URLs', tip: 'Assign one hub per theme and supporting articles for subtopics.' },
      { step: 'Step: Plan links', tip: 'Define anchors and link paths hub ↔ spokes.' },
      { step: 'Step: Benchmark', tip: 'Compare to competitors; add missing subtopics to clusters.' },
      { step: 'Step: Export', tip: 'Export cluster lists and URL mapping; move to briefs.' }
    );
    exampleResults = `Clustering Examples\n\nSeed List (sample)\n- keyword clustering\n- best free keyword clustering tool\n- semantic keyword grouping\n- nlp keyword clusters\n- pillar page architecture\n- topic cluster examples\n\nClusters\nTheme: Keyword Clustering Basics (informational)\n- what is keyword clustering\n- how keyword clustering works\n- nlp keyword clustering explained\n\nTheme: Tools & Comparisons (commercial investigation)\n- best free keyword clustering tool\n- ai keyword clustering vs manual grouping\n- semantic keyword grouping tool online\n\nTheme: Architecture & Planning (informational)\n- pillar page architecture\n- hub and spoke internal linking\n- map clusters to urls\n\nTheme: Implementation (transactional)\n- export keyword clusters csv\n- plan internal links anchors\n- publish topic clusters\n\nNext Steps\n- Assign one hub URL per theme\n- Draft hub + 3–5 spokes\n- Add intent labels and internal links\n- Benchmark coverage vs competitors`;
  }

  const cta = `Generate your result now and move forward with a clear, copy‑ready output that aligns with your SEO goals.`;

  // 13) Installation and Setup
  const installationSetup = {
    access: `Open ${tool.name} at /tools/${tool.slug} — no installation required`,
    devices: 'Desktop, tablet, mobile (responsive UI)',
    requirements: 'Modern browser; JavaScript enabled',
    optional: 'Optional: sign in or save preferences if supported'
  };

  // 14) Core Functionality
  const coreFunctionality = {
    inputs: (def.fields || []).map(f => `${f.label}`),
    processing: `Runs a client‑side template for ${tool.template || 'the selected tool'} to transform inputs into structured outputs`,
    outputs: [
      'Copy‑ready text blocks',
      'Lists or tables where applicable',
      'Optional JSON/HTML snippets'
    ],
    actions: ['Copy', 'Download', 'Share (where available)']
  };

  // 15) Advanced Features & Configuration
  const advancedFeatures = {
    settings: (def.fields || []).map(f => `Configure ${f.label} (${f.type || 'text'})`),
    integrations: ['Export JSON', 'Export CSV', 'Copy HTML'],
    performance: 'Use smaller batches or shorter inputs when processing large texts',
    accessibility: 'Keyboard navigation, focus states, and high‑contrast support in UI'
  };

  // 16) Troubleshooting
  const troubleshooting = [
    'Empty results: verify inputs; clear filters; try simpler queries',
    'Slow performance: reduce input size; check network; try again later',
    'Export issues: validate file format; re‑run; report if persistent',
    'Unexpected behavior: refresh page; clear cache; retry default settings'
  ];

  // 17) Contact and Support
  const contactSupport = {
    email: 'support@100seotools.com',
    feedback: 'Use the site contact form or issue tracker',
    updates: 'Check tool page notes for version changes and improvements'
  };

  // 18) SEO Requirements (guidance text, not enforced)
  const primaryKeyword = Array.isArray(tool.keywords) && tool.keywords.length > 0
    ? tool.keywords[0]
    : (tool.slug || '').replace(/-/g, ' ');
  const keywordVariations = (Array.isArray(tool.keywords) && tool.keywords.length > 1)
    ? tool.keywords.slice(1, 12)
    : [
      `${primaryKeyword} tool`,
      `free ${primaryKeyword}`,
      `${primaryKeyword} generator`,
      `${primaryKeyword} online`,
      `${primaryKeyword} seo`
    ];
  const metaDescriptionShort = (tool.metaDescription || tool.description || `${tool.name} – free online ${tool.category.toLowerCase()} tool`).slice(0, 155);
  const seoRequirements = {
    primaryKeyword,
    keywordVariations,
    metaDescription: metaDescriptionShort,
    internalLinksHint: 'Add 8+ internal links to relevant tools or categories',
    tone: 'Friendly, clear; Flesch Reading Ease ≥70; short paragraphs'
  };

  // 19) Schema Markup (JSON‑LD) – enumerated types used
  const schemaSections = ['SoftwareApplication', 'FAQPage', 'BreadcrumbList'];

  // 20) Quality & Accessibility
  // qualityAccessibility already declared earlier; may be extended per tool

  return { purpose, howToUse, outputExplanation, benefits, useCases, referenceCards,
    hero, introduction, whatItDoes, whyItMattersSEO, howToSteps, features,
    exampleResults, bestPractices, relatedTools, faqs, cta,
    installationSetup, coreFunctionality, advancedFeatures, troubleshooting,
    contactSupport, seoRequirements, schemaSections, qualityAccessibility };
}
