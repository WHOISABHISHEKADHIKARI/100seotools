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
    oneLiner: purpose.length > 20 ? purpose : `Use the ${tool.name} to optimize your ${tool.category.toLowerCase()} workflow.`,
    ctaText: def.actionLabel || 'Generate'
  };

  const specificBenefit = (categoryBenefits[tool.category] || [])[0] || 'improve your SEO workflow';
  let introduction = `${tool.name} is a free ${tool.category.toLowerCase()} tool designed to help you ${specificBenefit.toLowerCase()}. It runs entirely in your browser with no login and keeps your workflow simple: enter inputs, click ${def.actionLabel || 'Run'}, and reuse the results immediately. If you’re drafting, validating, or improving content and metadata, this tool helps you get consistent, SEO‑friendly results with minimal effort.`;

  let whatItDoes = `This tool processes your inputs using a structured template for ${tool.name.toLowerCase()}. It formats outputs for quick review and reuse, and it emphasizes clarity, relevance, and basic SEO guardrails. Typical results include concise text blocks, lists, or JSON snippets that are ready for copying to your CMS or codebase.`;

  let whyItMattersSEO = `Clear, structured outputs improve crawlability and user engagement. By aligning titles, descriptions, headings, and copy with keywords and intent, you set content up for better indexing and richer snippets. Lightweight client‑side tools also reduce friction for everyday checks, keeping your SEO process responsive and consistent.`;

  let howToSteps = (def.fields || []).map((f, i) => ({
    step: `Step ${i + 1}: Enter ${f.label.toLowerCase()}`,
    tip: `Pro tip: Use specific, audience‑aware phrasing${f.placeholder ? ` (e.g., ${f.placeholder})` : ''}.`
  })).concat([
    {
      step: `Step ${Math.max(2, (def.fields || []).length + 1)}: Click ${def.actionLabel || 'Run'}`,
      tip: 'Pro tip: Keep inputs focused; iterate quickly for improvements.'
    },
    {
      step: `Step ${Math.max(3, (def.fields || []).length + 2)}: Review the output`,
      tip: 'Pro tip: Edit lightly to match brand voice and intent.'
    }
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

  let bestPractices = [
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
      { q: 'What counts as fresh content in 2026?', a: 'Recent data points (2024–2026), updated examples, and current best practices aligned to search guidelines. Remove legacy tactics and add internal links to topical pages.' },
      { q: 'How do I prioritize updates?', a: 'Fix outdated claims first, refresh statistics and sources, improve heading hierarchy, and tune titles/meta for CTR. Add a last‑updated note where appropriate.' },
      { q: 'Can this help E‑E‑A‑T?', a: 'Yes. Encourages current citations, clearer explanations, and practical steps, which support experience and expertise signals.' },
      { q: 'How is the freshness score computed?', a: 'We weigh recent sources, year references, structural clarity, and metadata completeness. Issues receive severity tags; the score reflects how much work is needed to align with current expectations.' },
      { q: 'Should I compare against competitors?', a: 'Yes. Benchmark headings, internal links, and recency against top pages. Use Keyword Clustering and Competitor Overlap to identify gaps.' }
    );
    bestPractices.push('Cite primary sources from 2024–2026 and link to them');
    bestPractices.push('Add a “last updated” note for transparency when appropriate');
    bestPractices.push('Strengthen internal links to category hubs and related tools');
    benefits.push('Higher trust signals with transparent updates and sources');
    useCases.push('Audit evergreen guides for outdated claims and stale references');
    useCases.push('Standardize refresh workflow for editors and SEO teams');
    exampleResults = `Example: Freshness Audit\n\nFindings:\n- Outdated year mentions (2018, 2019) in intro\n- Missing citations for 2024 data point\n- Meta description too long (178 chars)\n- Passive voice across 3 paragraphs\n\nFixes:\n- Update examples with 2024–2026 sources\n- Add internal links to category hubs and relevant tools\n- Tighten meta description (≤155 chars)\n- Rewrite passive sentences for clarity\n\nScore: 64/100 → After fixes: 86/100`;
    qualityAccessibility.push('Use transparent “last updated” and cite sources consistently');
    relatedTools.unshift('ai-content-detector', 'heading-analyzer', 'keyword-clustering-tool', 'competitor-keyword-overlap-checker');
  }

  if (tool.slug === 'local-seo-audit-checklist') {
    const kwPrimary = 'free local seo checklist';
    const kwVars = [
      'local SEO checklist free',
      'local SEO audit checklist',
      'checklist for local SEO',
      'free local SEO audit tool'
    ];

    hero.h1 = `${tool.name} | Free Local SEO Checklist Tool`;
    introduction = `${tool.name} helps you perform a complete local SEO audit. Check Google Business Profile (GBP), NAP consistency, local citations, reviews, on‑page local factors, map pack optimization, LocalBusiness schema, mobile performance, local keyword usage, and local link opportunities — without changing your UI.`;
    whatItDoes = `The checklist standardizes local audits across GBP, NAP, citations, reviews, on‑page signals, schema, indexability, and performance. It produces a clear list of tasks and examples you can apply directly to boost local rankings and visibility in the map pack.`;
    whyItMattersSEO = `Local rankings depend on accurate business data, consistent citations, strong reviews, clear on‑page location signals, and crawl‑safe schema. A repeatable local audit improves map pack eligibility, reduces confusion for crawlers, and strengthens E‑E‑A‑T.`;

    howToSteps.push(
      { step: 'Step: Google Business Profile', tip: 'Add categories, services, hours, photos, Q&A. Use consistent name and address.' },
      { step: 'Step: NAP Consistency', tip: 'Ensure Name, Address, Phone match across site, GBP, and directories.' },
      { step: 'Step: Local Citations', tip: 'Claim and correct listings on major directories; remove duplicates.' },
      { step: 'Step: Reviews', tip: 'Request reviews, respond politely, and highlight service keywords naturally.' },
      { step: 'Step: On‑Page Local SEO', tip: 'Include city/region in title/H1/H2 when relevant; add location pages.' },
      { step: 'Step: Map Pack Optimization', tip: 'Pick precise categories, add services, attributes, and local photos.' },
      { step: 'Step: LocalBusiness Schema', tip: 'Publish clean JSON‑LD with name, address, phone, sameAs, and openingHours.' },
      { step: 'Step: Mobile Performance', tip: 'Compress images, optimize LCP, minimize JS; ensure tap targets and forms are friendly.' },
      { step: 'Step: Local Keywords', tip: 'Use natural city/area terms; avoid stuffing. Add neighborhood context where useful.' },
      { step: 'Step: Local Links', tip: 'Earn links from local partners, events, and directories with descriptive anchors.' }
    );

    exampleResults = `Local SEO Audit — Sample Tasks\n\nGBP\n- Primary category set; services added\n- Hours accurate; photos and posts updated\n\nNAP & Citations\n- NAP consistent across top directories\n- Duplicate listings merged/removed\n\nReviews\n- Monthly review cadence; owner responses\n\nOn‑Page\n- City in title/H1; location page published\n\nSchema\n- LocalBusiness JSON‑LD valid with address and phone\n\nPerformance\n- Mobile LCP < 2.5s; images compressed`;

    bestPractices.push('Use one canonical NAP across site, GBP, and citations');
    bestPractices.push('Map category → service pages; add internal links');
    bestPractices.push('Respond to reviews; avoid templated responses');
    bestPractices.push('Add LocalBusiness schema with required properties');
    bestPractices.push('Optimize mobile performance and contact UX');

    qualityAccessibility.push('Ensure addresses are readable text, not images');
    qualityAccessibility.push('Use accessible forms and clear phone/tap targets');

    relatedTools.unshift('nap-consistency-checker', 'local-citation-finder', 'local-schema-builder', 'gmb-optimization-helper', 'structured-data-validator');

    schemaSections = ['SoftwareApplication', 'FAQPage', 'HowTo', 'BreadcrumbList'];
    seoRequirements = {
      primaryKeyword: kwPrimary,
      keywordVariations: kwVars,
      metaDescription: 'Free local SEO audit checklist: GBP, NAP, citations, reviews, on‑page, schema, mobile, local keywords, and local links. Step‑by‑step with examples.',
      internalLinksHint: 'Link from Homepage, Local SEO category, citation tools, schema tools, and related audit tools.',
      tone: 'Clear, ESL‑friendly, practical'
    };

    faqs.unshift(
      { q: 'What is a local SEO checklist?', a: 'A standardized list of tasks to audit GBP, NAP, citations, reviews, on‑page local signals, schema, performance, local keywords, and local links for better local rankings.' },
      { q: 'Why is NAP consistency important?', a: 'Search engines rely on consistent Name, Address, and Phone across your site, GBP, and citations. Inconsistency reduces trust and can harm rankings.' },
      { q: 'How do I optimize Google Business Profile?', a: 'Choose precise categories, add services and attributes, maintain hours, post updates, add local photos, and answer Q&A with helpful details.' },
      { q: 'Which schema should I use for local?', a: 'Use LocalBusiness JSON‑LD with name, address, phone, openingHours, sameAs (social). Keep it clean and aligned with visible content.' },
      { q: 'How do reviews affect local rankings?', a: 'Review volume, velocity, and owner responses influence trust and click behavior. Avoid incentives; request honest feedback and address issues.' },
      { q: 'What are common local issues?', a: 'Duplicate listings, inconsistent NAP, wrong categories, thin location pages, missing LocalBusiness schema, slow mobile pages, and weak local links.' },
      { q: 'How should I compare competitors?', a: 'Benchmark GBP categories, reviews, photos, and posting cadence; compare location page depth, schema coverage, and local links from partners and events.' }
    );
  }

  if (tool.slug === 'on-page-seo-audit-checker') {
    const kwPrimary = 'on page checker tool';
    const kwVars = [
      'on‑page checker',
      'SEO on page checker',
      'website on‑page audit tool',
      'on‑page SEO analysis tool'
    ];

    hero.h1 = `${tool.name} | Free On‑Page Checker Tool`;
    introduction = `${tool.name} analyzes titles, meta descriptions, headings (H1–H3), keyword usage, content quality, internal links, schema markup, page speed hints, image optimization, indexability, and technical elements. It outputs a clear audit summary with prioritized fixes, examples, and guidance.`;
    whatItDoes = `The on‑page checker normalizes inputs and runs lightweight heuristics to evaluate clarity, structure, and crawl signals. It flags issues in metadata, heading hierarchy, keyword placement, anchors, alt text, canonical/schema, and performance hints, then lists concrete fixes and sample outputs to implement.`;
    whyItMattersSEO = `Pages that align with searcher intent and present clean, consistent signals rank better and earn higher CTR. A repeatable on‑page audit protects against regressions, improves crawlability, and strengthens E‑E‑A‑T by encouraging examples, references, and clear structure.`;

    howToSteps.push(
      { step: 'Step: Enter URL or HTML', tip: 'Paste the page HTML or provide the URL (where supported). Avoid scripts.' },
      { step: 'Step: Analyze Titles/Meta', tip: 'Check length, clarity, and intent alignment. Include the primary keyword naturally.' },
      { step: 'Step: Review Headings', tip: 'Ensure one H1 and descriptive H2/H3. Remove duplicates and off‑intent sections.' },
      { step: 'Step: Keyword Placement', tip: 'Mention early in the opening paragraph. Keep density ≈0.5–2.5% without stuffing.' },
      { step: 'Step: Internal Links', tip: 'Add 3–5 descriptive anchors to pillar pages and related articles.' },
      { step: 'Step: Images', tip: 'Write alt text, compress images, and lazy‑load where appropriate.' },
      { step: 'Step: Schema', tip: 'Validate JSON‑LD (Article/WebPage). Include required properties only; keep clean.' },
      { step: 'Step: Indexability', tip: 'Confirm canonical, robots allow, sitemap lists the page, and avoid duplicates.' },
      { step: 'Step: Performance', tip: 'Reduce heavy assets; improve LCP and minimize JS. Test mobile.' },
      { step: 'Step: Compare Competitors', tip: 'Benchmark depth, headings, examples, FAQs, and internal links; add 10–20% more depth.' }
    );

    exampleResults = `On‑Page Audit — Sample Output\n\nMetadata\n- Title: 58 chars (keyword present)\n- Meta: 150 chars (clear benefit; non‑truncated)\n\nHeadings\n- H1 present; H2/H3 descriptive; no duplicates\n\nKeywords\n- Density: 1.2% (Good)\n- Early mention: Yes\n\nLinks\n- 4 internal anchors to pillar pages\n\nImages\n- Alt text present; compressed\n\nSchema\n- Article JSON‑LD valid; required props only\n\nIndexability\n- Canonical self‑referential; robots allow; sitemap includes page\n\nPerformance\n- Mobile LCP ≈2.2s; deferred non‑critical JS`;

    bestPractices.push('Use descriptive, intent‑aligned titles and headings');
    bestPractices.push('Avoid keyword stuffing; prefer variants and natural phrasing');
    bestPractices.push('Add internal links with varied, descriptive anchors');
    bestPractices.push('Keep JSON‑LD clean and aligned to visible content');
    bestPractices.push('Benchmark competitors and add depth with examples and FAQs');

    relatedTools.unshift('meta-tag-generator', 'heading-analyzer', 'structured-data-validator', 'internal-linking-planner', 'seo-content-checker');

    schemaSections = ['SoftwareApplication', 'FAQPage', 'HowTo', 'BreadcrumbList'];
    seoRequirements = {
      primaryKeyword: kwPrimary,
      keywordVariations: kwVars,
      metaDescription: 'Free on‑page checker tool: analyze titles, meta, headings, keywords, content, internal links, schema, speed, images, and indexability. Clear fixes and examples.',
      internalLinksHint: 'Link from Homepage, SEO Tools category, related audit tools, and content optimization tools.',
      tone: 'Clear, ESL‑friendly, practical'
    };

    faqs.unshift(
      { q: 'What is an on‑page checker tool?', a: 'An online tool that audits a page’s metadata, headings, keyword usage, content quality, internal links, schema, performance hints, and indexability to surface fixes for better rankings.' },
      { q: 'Which SEO factors are analyzed?', a: 'Titles and meta descriptions, H1–H3 headings, keyword placement and density, content clarity and uniqueness, internal links and anchors, image alt text/compression, JSON‑LD schema, canonical/robots, sitemap/indexability, and basic performance hints.' },
      { q: 'How do I interpret results?', a: 'Prioritize high‑impact fixes: clarify titles/meta, fix heading hierarchy, add examples and references, add 3–5 internal links, validate schema and canonical/robots, and trim heavy assets.' },
      { q: 'Do I need to change the UI?', a: 'No. The tool focuses on analysis and guidance while preserving your existing layout and components.' },
      { q: 'Common issues found?', a: 'Missing/duplicated H1, vague titles/meta, thin content, weak anchors, missing alt text, invalid schema properties, conflicting canonicals, blocked robots, and slow mobile performance.' },
      { q: 'Screenshots and samples?', a: 'Use the sample audit outputs provided; capture your page states before/after. Visual evidence helps track changes and teach teams repeatable fixes.' }
    );
  }

  if (tool.slug === 'headline-analyzer') {
    const kwPrimary = 'free headline analyzer tool';
    const kwVars = [
      'headline analyzer free',
      'SEO headline analyzer',
      'headline score checker',
      'title analyzer tool',
      'headline optimization tool'
    ];

    hero.h1 = `${tool.name} | Free Headline Analyzer Tool`;
    introduction = `${tool.name} evaluates headline strength to improve SEO and CTR. Analyze emotional value, power words, readability, structure, length (≈50–60 chars), and keyword placement. Use clear guidance to rewrite headlines that match search intent and earn more clicks.`;
    whatItDoes = `The analyzer normalizes your headline input and runs lightweight checks for length, clarity, keyword presence, and emotional/power modifiers. It surfaces simple recommendations to refine word choice, structure, and placement so headlines remain compelling without resorting to clickbait.`;
    whyItMattersSEO = `Headlines strongly influence CTR and perceived relevance. Balanced emotional value, descriptive phrasing, and correct length improve engagement. Aligning keywords naturally in titles helps topical clarity and discoverability while keeping readability high.`;

    howToSteps = [
      { step: 'Step 1: Enter headline', tip: 'Paste your title into the field; use natural language and avoid all caps.' },
      { step: 'Step 2: Count length', tip: 'Aim for ≈50–60 characters; adjust extremes that truncate or feel vague.' },
      { step: 'Step 3: Check keyword placement', tip: 'Place the primary keyword early when natural; avoid stuffing.' },
      { step: 'Step 4: Add power words sparingly', tip: 'Use relevant emotional modifiers (e.g., “free”, “simple”, “quick”) without clickbait.' },
      { step: 'Step 5: Improve readability', tip: 'Prefer concise phrasing, avoid filler, and keep intent explicit.' },
      { step: 'Step 6: Compare alternatives', tip: 'Draft 2–3 variations; test clarity and emotional pull.' }
    ];

    exampleResults = `Headline Scoring Examples\n\nOptimized (≈56 chars):\nFree Headline Analyzer Tool – Improve SEO Titles and CTR\n- Keyword early: Yes\n- Length: Good\n- Emotional value: Balanced\n\nOver‑optimized:\nBest Headline Ever!!! Free!!! #1 Tool for SEO CTR 2026\n- Clickbait: High\n- Readability: Poor\n- Length: Okay but noisy\n\nImproved version:\nFree Headline Analyzer – Check SEO Title Length and Score`;

    bestPractices.push('Aim for ≈50–60 chars; avoid vague or overly long titles');
    bestPractices.push('Place primary keyword early when natural');
    bestPractices.push('Use specific, descriptive phrasing over hype');
    bestPractices.push('Avoid clickbait; ensure the page matches the promise');
    bestPractices.push('Iterate with 2–3 variations; choose clarity and value');

    relatedTools.unshift('blog-title-generator', 'seo-content-checker', 'meta-tag-generator', 'search-preview-simulator', 'keyword-intent-identifier');

    schemaSections = ['SoftwareApplication', 'FAQPage', 'HowTo', 'BreadcrumbList'];
    seoRequirements = {
      primaryKeyword: kwPrimary,
      keywordVariations: kwVars,
      metaDescription: 'Free headline analyzer tool: check headline score, emotional value, power words, readability, structure, length, and keyword placement. Improve CTR and SEO.',
      internalLinksHint: 'Link from Homepage, Content SEO category, SEO writing tools, and related optimization tools.',
      tone: 'Clear, ESL‑friendly, practical'
    };

    faqs.unshift(
      { q: 'What does a headline analyzer do?', a: 'It evaluates headline clarity, length, keyword placement, and emotional/power modifiers to improve CTR and SEO.' },
      { q: 'Why does headline scoring matter for SEO?', a: 'Titles influence CTR and perceived relevance. Balanced phrasing and correct length improve engagement and discoverability.' },
      { q: 'How should I use power words?', a: 'Use genuine, relevant modifiers that match page value. Avoid hype or clickbait that hurts trust.' },
      { q: 'What is optimal headline length?', a: 'Many pages perform well around ≈50–60 characters; verify clarity and avoid truncation.' },
      { q: 'Where should the keyword go?', a: 'Place it early when natural. Avoid stuffing; prefer readable phrasing with variants.' },
      { q: 'Should I test variations?', a: 'Yes. Draft 2–3 titles and pick the clearest, most specific option that matches intent and content.' }
    );
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

  if (tool.slug === 'meta-tag-generator') {
    const kwPrimary = 'free meta tag generator';
    const kwVars = [
      'seo meta tags tool',
      'meta description generator',
      'meta title generator',
      'open graph meta tags',
      'twitter card meta',
      'canonical tag generator',
      'wordpress meta tags',
      'clean seo metadata'
    ];

    hero.h1 = `${tool.name} | Free SEO Meta Tag Generator`;
    introduction = `${tool.name} helps you create clean, crawl‑safe metadata fast. Enter a title, meta description, and canonical URL, then generate sanitized output including <title>, meta description, optional canonical, Open Graph, and Twitter tags. The output includes helpful guidance for recommended lengths and avoids unsafe HTML injection.`;
    whatItDoes = `The generator normalizes pasted content to plain text, strips HTML fragments, and escapes special characters in attributes. It then composes a minimal, standards‑aligned set of tags suitable for CMS themes and WordPress templates: title, description, canonical (absolute URLs only), OG/Twitter, and an optional minimal WebPage JSON‑LD block for indexing clarity.`;
    whyItMattersSEO = `Proper metadata improves relevance, click‑through rates, and sharing previews. Clean tags help search engines index pages consistently and reduce risks from malformed HTML or unsafe inputs. Pair metadata with clear headings, internal links, and structured data to strengthen E‑E‑A‑T signals.`;

    outputExplanation = 'Outputs sanitized head tags: <title>, <meta name="description">, optional <link rel="canonical">, Open Graph, Twitter, and a minimal JSON‑LD WebPage when enough context exists. Attributes are escaped and inputs are normalized to avoid HTML injection.';

    exampleResults = [
      'Examples',
      'Optimized title (≈55 chars):',
      'Free Meta Tag Generator | Create Clean SEO Metadata',
      '',
      'Poor title:',
      'Best Meta Tags!!! | Click Here | #1 Tool 2026',
      '',
      'Optimized meta description (≈150 chars):',
      'Generate clean title, description, canonical, OG, and Twitter meta tags. Free tool with smart length checks and sanitized output for fast, crawl‑safe metadata.',
      '',
      'Poor description:',
      'Amazing meta tags!!! Free!!! Best!!! (too vague, promotional, no clear value).',
      '',
      'Sample Output:',
      '<title>Free Meta Tag Generator | Create Clean SEO Metadata</title>',
      '<meta name="description" content="Generate clean title, description, canonical, OG, and Twitter meta tags. Free tool with smart length checks and sanitized output for fast, crawl‑safe metadata." />',
      '<link rel="canonical" href="https://www.example.com/page" />',
      '<meta property="og:title" content="Free Meta Tag Generator | Create Clean SEO Metadata" />',
      '<meta property="og:description" content="Generate clean title, description, canonical, OG, and Twitter meta tags." />',
      '<meta property="og:url" content="https://www.example.com/page" />',
      '<meta name="twitter:card" content="summary_large_image" />',
      '<meta name="twitter:title" content="Free Meta Tag Generator | Create Clean SEO Metadata" />',
      '<meta name="twitter:description" content="Generate clean title, description, canonical, OG, and Twitter meta tags." />'
    ].join('\n');

    bestPractices = [
      'Keep titles ≈50–60 chars; descriptions ≈120–160',
      'Use a single primary keyword naturally; avoid stuffing',
      'Write human‑friendly copy with a clear value proposition',
      'Use absolute canonical URLs (https://)',
      'Ensure page content reflects metadata claims'
    ];

    qualityAccessibility.push('Avoid emoji or special symbols in titles that harm readability');
    qualityAccessibility.push('Use descriptive alt text for any preview images referenced elsewhere');

    referenceCards.push({
      title: 'Meta Tags Quick Reference',
      items: [
        { code: 'Title', label: '≈50–60 chars', note: 'Primary keyword + value' },
        { code: 'Description', label: '≈120–160 chars', note: 'Benefit + context' },
        { code: 'Canonical', label: 'Absolute URL', note: 'Consistent preferred version' },
        { code: 'OG/Twitter', label: 'Title/Description', note: 'Improve sharing previews' }
      ]
    });

    relatedTools.unshift('heading-analyzer', 'meta-description-optimizer', 'structured-data-validator', 'schema-markup-generator', 'title-meta-length-counter', 'search-preview-simulator');

    schemaSections = [
      'WebPage (minimal)',
      'Article (when applicable)',
      'FAQPage (for visible FAQs)',
      'HowTo (for step‑by‑step guides)',
      'SoftwareApplication (tool page)',
      'BreadcrumbList'
    ];

    seoRequirements = {
      primaryKeyword: kwPrimary,
      keywordVariations: kwVars,
      metaDescription: 'Create clean title, description, canonical, OG, and Twitter tags. Free, fast, and crawl‑safe output improves CTR and sharing previews.',
      internalLinksHint: 'Link to Homepage, On‑Page Optimization category, Keyword tools, and related blog guides using consistent anchors like “Free Meta Tag Generator” and “Meta Description Generator”.',
      tone: 'Clear, practical, ESL‑friendly'
    };

    coreFunctionality = {
      inputs: [
        'Title',
        'Meta Description',
        'Canonical URL (https)',
        'Optional image URL for OG/Twitter'
      ],
      outputs: [
        'HTML <title>',
        'Meta description',
        'Canonical link (absolute URL)',
        'Open Graph title/description/url',
        'Twitter card title/description',
        'Minimal WebPage JSON‑LD when applicable'
      ],
      processing: 'Normalize pasted text, strip HTML fragments, escape attributes, validate canonical as absolute https, compute helpful length notes.',
      actions: ['Generate', 'Copy', 'Download']
    };

    advancedFeatures = {
      settings: [
        'Length guidance for titles/descriptions',
        'Optional canonical inclusion only for absolute URLs',
        'Plain‑text normalization for paste inputs'
      ],
      integrations: [
        'WordPress and CMS theme headers',
        'Static site generators and templating',
        'Social sharing previews (OG/Twitter)'
      ],
      performance: 'Client‑side only, minimal DOM work. Non‑critical logic defers until interaction.',
      accessibility: 'Keyboard‑friendly controls, descriptive labels, and consistent heading hierarchy.'
    };

    installationSetup = {
      access: 'Use directly in your browser; no login required.',
      devices: 'Desktop and mobile browsers with modern standards support.',
      requirements: 'Absolute canonical URLs (https) for best results; concise inputs.',
      optional: 'Provide an image URL for richer OG/Twitter previews.'
    };

    troubleshooting = [
      'Canonical not showing: ensure it starts with https://',
      'Title too long: aim for ≈50–60 characters',
      'Description too short: provide context and a clear benefit',
      'OG/Twitter missing: add an image URL and absolute canonical'
    ];

    faqs.unshift(
      { q: 'What meta tags are most important?', a: 'Title, meta description, canonical, Open Graph, and Twitter tags. Robots meta is situational; avoid meta keywords.' },
      { q: 'How do search engines use meta tags?', a: 'Titles and descriptions influence SERP display and CTR; canonical consolidates signals; Open Graph/Twitter improve social sharing.' },
      { q: 'Should I use relative canonical URLs?', a: 'No. Use absolute https URLs for canonical to avoid ambiguity.' },
      { q: 'Can I paste from Word or Google Docs?', a: 'Yes. Pasted content is normalized to plain text; HTML fragments are stripped to avoid injection.' },
      { q: 'Will this work with WordPress?', a: 'Yes. Copy the generated tags into theme templates or head sections. Outputs are clean and CMS‑friendly.' }
    );
  }

  if (tool.slug === 'seo-content-checker') {
    const kwPrimary = 'seo content checker';
    const kwVars = [
      'content optimization tool',
      'seo content score',
      'keyword density checker',
      'readability score',
      'keyword placement evaluation',
      'title heading optimization',
      'meta description quality',
      'content length recommendations'
    ];

    hero.h1 = `${tool.name} | Free Content Optimization Tool`;
    introduction = `${tool.name} analyzes your title, content, focus keyword, and optional meta description to compute a clear SEO content score. It evaluates keyword density, readability, keyword placement, title and meta quality, and depth recommendations, then lists prioritized fixes you can apply immediately – without changing your UI.`;
    whatItDoes = `The checker normalizes pasted content to plain text, strips HTML fragments, and runs lightweight heuristics to assess keyword presence, placement, clarity, and readability. It outputs an overall 0–100 content score with a breakdown (title, meta, density, placement, readability, length) and concrete fixes. Use the score to spot quick wins and standardize editing.`;
    whyItMattersSEO = `Pages that align with intent, use keywords naturally, and read clearly tend to earn higher CTR and better engagement. A consistent check on titles, openings, descriptions, and length helps avoid thin content and keyword stuffing while improving topical coverage and crawlability.`;

    outputExplanation = 'Outputs include: Content Score (0–100), breakdown by factor, problems, fixes, and examples of optimized vs poor metadata. Inputs are normalized to avoid HTML injection and StartFragment/EndFragment fragments.';

    exampleResults = [
      'Examples',
      'Optimized title:',
      'SEO Content Checker – Analyze Density, Readability, and Placement',
      '',
      'Poor title:',
      'Best Content | Click Here | #1 SEO Checker 2026',
      '',
      'Optimized meta:',
      'Check content score, keyword density, readability, and placement. Get clear fixes to optimize titles, headings, and meta for better SEO.',
      '',
      'Poor meta:',
      'Amazing SEO content!!! Free!!! Best!!!',
      '',
      'Sample Output:',
      'SEO Content Checker – Results',
      'Content Score: 86/100',
      'Breakdown:',
      '- Title: Good (keyword present)',
      '- Meta: Good',
      '- Keyword density: 1.8% (Good)',
      '- Early placement: Yes',
      '- Readability (Flesch): 64/100',
      '- Length: 1,050 words (Good depth)'
    ].join('\n');

    bestPractices = [
      'Keep titles ≈50–60 chars with clear value',
      'Write meta descriptions ≈120–160 chars with a benefit',
      'Place the primary keyword early and use variants naturally',
      'Prefer short paragraphs, bullets, and active voice',
      'Aim for 800–1200 words for educational guides'
    ];

    qualityAccessibility.push('Favor plain, ESL‑friendly wording and descriptive headings');
    qualityAccessibility.push('Keep anchor text descriptive and avoid over‑linking one phrase');

    referenceCards.push({
      title: 'Content Score Factors',
      items: [
        { code: 'Title', label: '≈50–60 chars', note: 'Include primary keyword naturally' },
        { code: 'Meta', label: '≈120–160 chars', note: 'Clear benefit and context' },
        { code: 'Density', label: '≈0.5–2.5%', note: 'Avoid stuffing; use variants' },
        { code: 'Readability', label: 'Flesch 55–75', note: 'Short sentences, bullets' },
        { code: 'Length', label: '800–1200 words', note: 'Match intent depth' }
      ]
    });

    relatedTools.unshift('keyword-density-checker', 'readability-score-calculator', 'heading-analyzer', 'meta-tag-generator', 'paragraph-keyword-optimizer', 'on-page-seo-audit-checker');

    schemaSections = [
      'SoftwareApplication (tool page)',
      'WebPage',
      'Article (this guide)',
      'FAQPage (visible FAQs)',
      'HowTo (steps)',
      'BreadcrumbList'
    ];

    seoRequirements = {
      primaryKeyword: kwPrimary,
      keywordVariations: kwVars,
      metaDescription: 'Analyze content score, keyword density, readability, and keyword placement. Get clear fixes to optimize titles, headings, and meta.',
      internalLinksHint: 'Link to Homepage, Content SEO category, Keyword tools, and related guides using anchors like “seo content checker”, “content optimization tool”, and “SEO content score”.',
      tone: 'Clear, practical, ESL‑friendly'
    };

    coreFunctionality = {
      inputs: ['Title', 'Content (plain text)', 'Primary Keyword', 'Meta Description (optional)'],
      outputs: ['Content Score (0–100)', 'Breakdown by factor', 'Problems and fixes', 'Examples (optimized vs poor)'],
      processing: 'Normalize text, compute readability, density, placement, and produce prioritized fixes.',
      actions: ['Analyze', 'Copy', 'Download']
    };

    advancedFeatures = {
      settings: ['Length guidance for educational pages', 'Density range recommendations', 'Early placement check'],
      integrations: ['CMS editors and WordPress themes', 'Publishing checklists', 'On‑page audit workflows'],
      performance: 'Client‑side only, lightweight heuristics.',
      accessibility: 'Keyboard‑friendly actions and descriptive labels.'
    };

    installationSetup = {
      access: 'Runs in your browser; no login required.',
      devices: 'Desktop and mobile browsers with modern standards support.',
      requirements: 'Provide clear title, content, and primary keyword.',
      optional: 'Add meta description for quality checks.'
    };

    troubleshooting = [
      'Score lower than expected: simplify wording and add examples',
      'Density too high: replace repetitions with variants and synonyms',
      'Thin content: expand to 800–1200 words with headings and FAQs',
      'Keyword missing early: add a mention in the opening paragraph'
    ];

    faqs.unshift(
      { q: 'What does the SEO Content Checker analyze?', a: 'Title length and keyword inclusion, meta description quality, keyword density and placement, readability, and content length guidance.' },
      { q: 'What is a good keyword density?', a: 'Aim for ≈0.5–2.5% with natural, varied phrasing. Avoid stuffing.' },
      { q: 'How much content should I write?', a: 'Write enough to satisfy intent; many educational pages land between 800–1200 words.' },
      { q: 'Will this change my layout?', a: 'No. It only optimizes the underlying logic and guidance; UI remains unchanged.' },
      { q: 'Can I use this with WordPress?', a: 'Yes. Use the guidance to edit titles, meta descriptions, and content directly in your editor.' }
    );
  }

  if (tool.slug === 'text-to-html-converter') {
    const kwPrimary = 'text to html converter';
    const kwVars = [
      'convert text to html',
      'plain text to html',
      'html formatter',
      'text to html online'
    ];

    hero.h1 = `${tool.name} | Clean, Valid HTML Formatter`;
    introduction = `${tool.name} converts plain text into clean, valid HTML. It auto‑wraps paragraphs, preserves line breaks, detects headings (#, ##), builds lists (‑, * and 1.), and safely auto‑links http/https URLs — keeping output readable and SEO‑safe.`;
    whatItDoes = `It normalizes pasted input, strips any hidden HTML fragments, escapes unsafe characters (&, <, >), linkifies URLs with rel attributes, and transforms simple markdown‑like markers into semantic tags: headings (H1–H6), unordered/ordered lists, paragraphs with <br /> for line breaks. No scripts or StartFragment/EndFragment artifacts are emitted.`;
    whyItMattersSEO = `Clean, semantic HTML improves readability, accessibility, and crawlability. Proper headings and lists help search engines understand structure, while safe escaping prevents injection risks. Consistent markup supports E‑E‑A‑T by keeping pages trustworthy and well‑formatted.`;

    outputExplanation = 'Outputs include sanitized HTML with paragraphs, line breaks, H1–H6 headings, UL/OL lists, and safely linked URLs. The converter removes hidden paste fragments and avoids inline scripts for security.';

    exampleResults = [
      'Input:',
      '# Welcome\n\nThis is a sample text with a URL: https://example.com\n\n- First item\n- Second item\n\n1. Step one\n2. Step two',
      '',
      'Output:',
      '<h1>Welcome</h1>',
      '<p>This is a sample text with a URL: <a href="https://example.com" rel="noopener">https://example.com</a></p>',
      '<ul><li>First item</li><li>Second item</li></ul>',
      '<ol><li>Step one</li><li>Step two</li></ol>'
    ].join('\n');

    bestPractices = [
      'Use # to ###### for headings with a space after hashes',
      'Start list lines with - or *; use 1. 2. for ordered lists',
      'Separate paragraphs with blank lines; short lines become <br />',
      'Include full http/https URLs to auto‑link safely',
      'Avoid pasting raw HTML with scripts; the tool escapes it'
    ];

    qualityAccessibility.push('Prefer descriptive headings and short paragraphs');
    qualityAccessibility.push('Keep lists concise and readable; avoid overly long items');

    relatedTools.unshift('heading-analyzer', 'meta-tag-generator', 'structured-data-validator', 'schema-markup-generator', 'url-slug-generator', 'og-tag-generator', 'search-preview-simulator');

    schemaSections = ['SoftwareApplication', 'FAQPage', 'HowTo', 'BreadcrumbList'];

    seoRequirements = {
      primaryKeyword: kwPrimary,
      keywordVariations: kwVars,
      metaDescription: 'Convert plain text to clean, valid HTML. Preserve paragraphs, line breaks, lists, headings, and URLs. Free text to HTML online formatter.',
      internalLinksHint: 'Link to Homepage, SEO Utility category, HTML validators, and code utilities using anchors like “text to html converter”, “html formatter”, and “plain text to html”.',
      tone: 'Clear, practical, ESL‑friendly'
    };

    coreFunctionality = {
      inputs: ['Plain text'],
      outputs: ['HTML paragraphs with <br />', 'H1–H6 headings', 'UL/OL lists', 'Auto‑linked URLs'],
      processing: 'Strip hidden HTML, escape unsafe characters, detect markers, convert to semantic tags, and linkify http/https URLs with rel attributes.',
      actions: ['Convert', 'Copy', 'Download']
    };

    advancedFeatures = {
      settings: ['Heading detection (# to ######)', 'Unordered/ordered list grouping', 'URL auto‑linking with rel'],
      integrations: ['CMS editors and static site workflows', 'Markdown‑like formatting for drafts'],
      performance: 'Client‑side only; minimal DOM work.',
      accessibility: 'Keyboard‑friendly controls and descriptive labels.'
    };

    installationSetup = {
      access: 'Runs in your browser; no login required.',
      devices: 'Desktop and mobile browsers with modern standards support.',
      requirements: 'Provide plain text; use simple markers (#, -, 1.) for structure.',
      optional: 'Include full URLs to auto‑link.'
    };

    troubleshooting = [
      'Headings not detected: add a space after # (e.g., # Title)',
      'Lists not grouped: start each item on a new line with - or 1.',
      'Links not clickable: include http:// or https:// schemes',
      'Unexpected HTML visible: pasted HTML is escaped by design'
    ];

    faqs.unshift(
      { q: 'What does a text‑to‑HTML converter do?', a: 'It transforms plain text into clean HTML with paragraphs, headings, lists, and safely linked URLs while escaping unsafe characters.' },
      { q: 'How are headings and lists detected?', a: 'Headings use # to ###### followed by a space; lists use - or * for unordered and 1. 2. for ordered items.' },
      { q: 'Does it auto‑link URLs?', a: 'Yes. http/https URLs are linkified with rel attributes for safety.' },
      { q: 'Will raw HTML be executed?', a: 'No. Pasted HTML is stripped to text and escaped; no scripts are emitted.' },
      { q: 'Is the output SEO‑friendly?', a: 'Yes. It uses semantic tags, preserves structure, and avoids unsafe markup to improve readability and crawlability.' },
      { q: 'Can I copy or download the output?', a: 'Yes. Use the copy and download actions to reuse the generated HTML.' }
    );
  }

  if (tool.slug === 'competitor-gap-analyzer') {
    const kwPrimary = 'content gap analysis tool';
    const kwVars = [
      'content gap tool',
      'seo gap analyzer',
      'competitor content analysis',
      'missing keyword discovery',
      'content overlap metrics'
    ];

    hero.h1 = `${tool.name} | Free Content Gap Analysis Tool`;
    introduction = `${tool.name} compares your page to a competitor to reveal missing keywords, overlapping coverage, and content gaps. Paste two texts to measure similarity, surface common terms, and generate actionable recommendations to expand depth and improve topical authority.`;
    whatItDoes = `The analyzer normalizes pasted inputs to plain text, strips HTML fragments, and compares token sets across two texts (yours vs competitor). It reports overlap words, similarity %, and a list of unique common terms (top 50) you can use to enhance coverage. Use findings to plan updates, add sections, and interlink related pages.`;
    whyItMattersSEO = `Competitor benchmarking identifies gaps you can fill for stronger relevance and E‑E‑A‑T signals. Adding missing subtopics, examples, and internal links improves crawlability, reduces duplication, and raises the chance of ranking against established pages.`;

    outputExplanation = 'Outputs include: overlap words count, similarity %, and top common terms. Use the list to add missing sections, expand examples, and improve headings and anchors across related pages.';

    exampleResults = [
      'Sample Output:',
      'Overlap words: 312',
      'Similarity: 42.35%',
      'Common (top 50): keyword research, topical authority, internal links, long‑tail, clustering, density, readability, canonical, schema, faq',
      '',
      'Recommendations:',
      '- Add a section on “topical authority” with examples and internal links',
      '- Include FAQs addressing common questions surfaced by competitors',
      '- Expand long‑tail modifiers and LSI variants in headings and body',
      '- Validate canonical and JSON‑LD; add BreadcrumbList'
    ].join('\n');

    bestPractices = [
      'Benchmark against 2–3 competitors for stable signals',
      'Map gaps to sections and FAQs with descriptive headings',
      'Use internal links (hub ↔ spokes) with varied anchors',
      'Prefer examples, data points, and references to raise trust',
      'Refresh content quarterly to keep coverage current'
    ];

    qualityAccessibility.push('Use ESL‑friendly, clear wording in new sections');
    qualityAccessibility.push('Avoid keyword stuffing; prefer natural variants');

    referenceCards.push({
      title: 'Gap Analysis Checklist',
      items: [
        { code: 'Compare', label: 'Your page vs competitor', note: 'Paste texts' },
        { code: 'Measure', label: 'Overlap & similarity', note: 'Top terms list' },
        { code: 'Plan', label: 'Sections & FAQs', note: 'Map gaps to headings' },
        { code: 'Link', label: 'Hub ↔ spokes', note: 'Descriptive anchors' }
      ]
    });

    relatedTools.unshift('keyword-gap-finder', 'competitor-keyword-overlap-checker', 'keyword-clustering-tool', 'internal-linking-planner', 'on-page-seo-audit-checker', 'meta-tag-generator');

    schemaSections = [
      'SoftwareApplication (tool page)',
      'WebPage',
      'FAQPage (visible FAQs)',
      'HowTo (steps)',
      'BreadcrumbList'
    ];

    seoRequirements = {
      primaryKeyword: kwPrimary,
      keywordVariations: kwVars,
      metaDescription: 'Compare your page vs competitors, find missing keywords, measure overlap, and plan fixes. Use common term lists and recommendations to expand coverage.',
      internalLinksHint: 'Link from Homepage, Competitor Analysis category, Keyword tools, and Content optimization tools using anchors like “content gap analysis tool” and “competitor content analysis”.',
      tone: 'Clear, practical, ESL‑friendly'
    };

    coreFunctionality = {
      inputs: ['Your text (A)', 'Competitor text (B)'],
      outputs: ['Overlap words count', 'Similarity %', 'Common terms list (top 50)', 'Recommendations'],
      processing: 'Normalize text, tokenize, compare sets, compute overlap %, and list common unique terms.',
      actions: ['Compare', 'Copy', 'Download']
    };

    advancedFeatures = {
      settings: ['Overlap % and top terms list', 'Plain‑text normalization for paste inputs'],
      integrations: ['Brief creation and content planning', 'Internal linking planners', 'Keyword clustering workflows'],
      performance: 'Client‑side only; minimal DOM work.',
      accessibility: 'Keyboard‑friendly actions and descriptive labels.'
    };

    installationSetup = {
      access: 'Runs in your browser; no login required.',
      devices: 'Desktop and mobile browsers with modern standards support.',
      requirements: 'Provide clear texts for A and B inputs.',
      optional: 'Use competitor snippets or outlines if full text unavailable.'
    };

    troubleshooting = [
      'Low overlap: your page may target a different intent; adjust sections',
      'High overlap but low performance: improve examples, references, and internal links',
      'No clear gaps: compare against a stronger competitor or expand subtopics',
      'Keyword stuffing risk: reduce repetition; use variants naturally'
    ];

    faqs.unshift(
      { q: 'What is content gap analysis?', a: 'Comparing your coverage against competitors to find missing topics, keywords, and examples you can add for stronger relevance and authority.' },
      { q: 'How do I choose competitors?', a: 'Pick top 2–3 ranking pages with similar intent. Avoid mismatched formats like product vs blog unless comparing like-for-like sections.' },
      { q: 'What should I add when gaps are found?', a: 'Add sections with examples, FAQs, and internal links. Improve headings and snippet clarity; validate schema and canonical.' },
      { q: 'Will this change my layout?', a: 'No. It adds guidance and content planning while preserving your existing UI.' }
    );
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
    schemaSections = ['SoftwareApplication', 'FAQPage', 'HowTo', 'BreadcrumbList'];
    seoRequirements = {
      primaryKeyword: 'on page seo checker free',
      keywordVariations: [
        'free on-page seo checker',
        'seo audit tool free',
        'on-page seo analysis',
        'website seo checker'
      ],
      metaDescription: 'Free on‑page SEO checker: audit titles, meta, headings, keywords, internal links, images, speed, canonical, and JSON‑LD. Get clear fixes and examples.',
      internalLinksHint: 'Link from Homepage, On‑Page Optimization category, and related tools (Meta Tag Generator, Heading Analyzer, Structured Data Validator, Internal Linking Planner, SEO Content Checker).',
      tone: 'Clear, practical, ESL‑friendly'
    };
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
  var installationSetup = installationSetup || {
    access: `Open ${tool.name} at /tools/${tool.slug} — no installation required`,
    devices: 'Desktop, tablet, mobile (responsive UI)',
    requirements: 'Modern browser; JavaScript enabled',
    optional: 'Optional: sign in or save preferences if supported'
  };

  // 14) Core Functionality
  var coreFunctionality = coreFunctionality || {
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
  var advancedFeatures = advancedFeatures || {
    settings: (def.fields || []).map(f => `Configure ${f.label} (${f.type || 'text'})`),
    integrations: ['Export JSON', 'Export CSV', 'Copy HTML'],
    performance: 'Use smaller batches or shorter inputs when processing large texts',
    accessibility: 'Keyboard navigation, focus states, and high‑contrast support in UI'
  };

  // 16) Troubleshooting
  var troubleshooting = troubleshooting || [
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
  var seoRequirements = seoRequirements || {
    primaryKeyword,
    keywordVariations,
    metaDescription: metaDescriptionShort,
    internalLinksHint: 'Add 8+ internal links to relevant tools or categories',
    tone: 'Friendly, clear; Flesch Reading Ease ≥70; short paragraphs'
  };

  // 19) Schema Markup (JSON‑LD) – enumerated types used
  var schemaSections = schemaSections || ['SoftwareApplication', 'FAQPage', 'BreadcrumbList'];

  // 20) Quality & Accessibility
  // qualityAccessibility already declared earlier; may be extended per tool

  return {
    purpose, howToUse, outputExplanation, benefits, useCases, referenceCards,
    hero, introduction, whatItDoes, whyItMattersSEO, howToSteps, features,
    exampleResults, bestPractices, relatedTools, faqs, cta,
    installationSetup, coreFunctionality, advancedFeatures, troubleshooting,
    contactSupport, seoRequirements, schemaSections, qualityAccessibility
  };
}
