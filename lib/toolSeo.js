const COMPETITOR_SERP_PATTERNS = [
  {
    competitor: 'Ahrefs',
    pattern: 'Free [Tool Name]',
    emphasis: 'Find ideas or check results in seconds',
  },
  {
    competitor: 'Semrush',
    pattern: 'Free [Tool Name]',
    emphasis: 'Top 10 results, reports, and no sign-up language',
  },
  {
    competitor: 'SEOptimer',
    pattern: 'Free SEO Tools',
    emphasis: 'Specific generators, validators, and simple utility wording',
  },
];

const CATEGORY_ACTIONS = {
  'Keyword Research': 'find keyword ideas, intent, gaps, and ranking opportunities',
  'On-Page SEO': 'audit page titles, descriptions, content, links, and schema',
  'Technical SEO': 'check crawl, indexation, redirects, sitemaps, and page health',
  'Link Building': 'plan links, outreach, backlink ideas, and relevance checks',
  'Content Optimization': 'improve content quality, structure, snippets, and CTR',
  'Analytics & Tracking': 'estimate SEO traffic, clicks, visibility, ROI, and growth',
  'Local SEO': 'optimize local search, citations, reviews, locations, and schema',
  'Competitor Analysis': 'compare competitors, keywords, backlinks, pages, and gaps',
  'AI SEO Tools': 'generate SEO content, outlines, FAQs, tags, and AI-ready snippets',
  'Utilities': 'create SEO files, tags, redirects, previews, and clean HTML outputs',
};

const TOOL_ACTIONS = [
  [/keyword.*suggest|keyword.*generator|keyword.*expansion|long-tail/i, 'generate keyword ideas'],
  [/keyword.*density/i, 'check keyword density'],
  [/keyword.*cluster/i, 'group keywords by intent'],
  [/keyword.*difficulty/i, 'estimate keyword difficulty'],
  [/keyword.*gap/i, 'find missing keyword opportunities'],
  [/rank|ranking|serp/i, 'track ranking opportunities'],
  [/meta.*description/i, 'write and optimize meta descriptions'],
  [/meta.*tag/i, 'create SEO meta tags'],
  [/title|headline/i, 'write stronger SEO titles'],
  [/schema|structured/i, 'build and validate schema markup'],
  [/robots/i, 'create and validate robots.txt rules'],
  [/sitemap/i, 'build and inspect XML sitemaps'],
  [/canonical/i, 'check canonical URLs'],
  [/redirect|status/i, 'test redirects and HTTP status codes'],
  [/broken.*link/i, 'find broken links'],
  [/page.*speed|mobile/i, 'check page experience issues'],
  [/backlink|link/i, 'analyze links and backlink opportunities'],
  [/readability|word.*count|content/i, 'improve SEO content'],
  [/local|gmb|citation|nap|review/i, 'improve local SEO signals'],
  [/competitor/i, 'analyze competitor SEO gaps'],
  [/ai/i, 'generate AI-assisted SEO outputs'],
  [/slug/i, 'create clean SEO slugs'],
  [/og|open.*graph|preview/i, 'preview search and social snippets'],
];

const ACRONYMS = new Set(['seo', 'ai', 'url', 'xml', 'html', 'faq', 'ctr', 'roi', 'gmb', 'og', 'nap']);

export function getCompetitorSerpPatterns() {
  return COMPETITOR_SERP_PATTERNS;
}

export function cleanToolName(tool = {}) {
  const source = tool.name || tool.slug || 'SEO Tool';
  return String(source)
    .split('|')[0]
    .replace(/\bfree\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleCaseFromSlug(value = '') {
  return String(value)
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .split(/\s+/)
    .map((word) => {
      const lower = word.toLowerCase();
      if (ACRONYMS.has(lower)) return lower.toUpperCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

function baseToolName(tool = {}) {
  const cleanName = cleanToolName(tool);
  return cleanName || titleCaseFromSlug(tool.slug || 'seo-tool');
}

function shortenToolName(name = '') {
  return name
    .replace(/\bGenerator\b/g, 'Gen')
    .replace(/\bOptimizer\b/g, 'Opt')
    .replace(/\bCalculator\b/g, 'Calc')
    .replace(/\bAnalyzer\b/g, 'Analyzer')
    .replace(/\bComparison\b/g, 'Compare')
    .replace(/\bCompetitor\b/g, 'Comp')
    .replace(/\bDescription\b/g, 'Desc')
    .replace(/\bOpportunity\b/g, 'Opp')
    .replace(/\bChecker\b/g, 'Check')
    .replace(/\bValidator\b/g, 'Validator')
    .replace(/\bSimulator\b/g, 'Sim')
    .replace(/\bTemplate\b/g, 'Template')
    .replace(/\bStructure\b/g, 'Struct')
    .replace(/\s+/g, ' ')
    .trim();
}

function squeezeTitle(title) {
  let value = title.replace(/\s+/g, ' ').trim();
  if (value.length <= 60) return value;

  value = value
    .replace(/\s+-\s+Free Online SEO Tool$/i, '')
    .replace(/\s+-\s+Free Online Tool$/i, '')
    .replace(/\s+Online$/i, '')
    .trim();
  if (value.length <= 60) return value;

  value = value.replace(/^Free\s+/i, '');
  if (value.length <= 60) return value;

  return `${value.slice(0, 57).replace(/\s+\S*$/, '')}...`;
}

function squeezeDescription(value, fallbackTopic) {
  let text = String(value || '').replace(/\s+/g, ' ').trim();
  if (!text) {
    text = `Use our free ${fallbackTopic} to run fast SEO checks, generate practical outputs, and improve search performance. No sign-up required.`;
  }

  if (text.length > 160) {
    text = `${text.slice(0, 157).replace(/\s+\S*$/, '')}...`;
  }

  const additions = [
    ' Get instant results online.',
    ' Built for quick SEO workflows.',
    ' No sign-up required.',
  ];
  let index = 0;
  while (text.length < 150 && index < additions.length) {
    const addition = additions[index];
    if (text.length + addition.length <= 160) text += addition;
    index += 1;
  }

  if (text.length < 150) {
    text = `${text} Free, fast, and simple for everyday SEO work.`;
  }
  if (text.length > 160) {
    text = `${text.slice(0, 157).replace(/\s+\S*$/, '')}...`;
  }
  return text;
}

function actionForTool(tool = {}) {
  const haystack = `${tool.slug || ''} ${tool.name || ''} ${tool.description || ''}`;
  const match = TOOL_ACTIONS.find(([pattern]) => pattern.test(haystack));
  if (match) return match[1];
  return CATEGORY_ACTIONS[tool.category] || 'run faster SEO checks';
}

export function makeToolSeoTitle(tool = {}) {
  const name = shortenToolName(baseToolName(tool));
  const title = /^free\b/i.test(name)
    ? `${name} - Online SEO Tool`
    : `Free ${name} - Online SEO Tool`;
  return squeezeTitle(title);
}

export function makeToolSeoDescription(tool = {}) {
  const name = baseToolName(tool);
  const action = actionForTool(tool);
  const categoryAction = CATEGORY_ACTIONS[tool.category] || 'improve search performance';
  const description = `Use our free ${name} to ${action}. Get instant ${tool.category || 'SEO'} insights, practical recommendations, and export-ready results online.`;
  return squeezeDescription(description, name || categoryAction);
}

export function makeToolSeoKeywords(tool = {}) {
  const name = baseToolName(tool).toLowerCase();
  const slugPhrase = String(tool.slug || '').replace(/-/g, ' ');
  const category = String(tool.category || 'seo tools').toLowerCase();
  return Array.from(new Set([
    name,
    `free ${name}`,
    slugPhrase,
    `free ${slugPhrase}`,
    category,
    'free seo tools',
  ].filter(Boolean)));
}

export function standardizeToolSeo(tool = {}) {
  return {
    title: makeToolSeoTitle(tool),
    description: makeToolSeoDescription(tool),
    keywords: makeToolSeoKeywords(tool),
  };
}
