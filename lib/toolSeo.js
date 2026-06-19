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
  'On-Page Optimization': 'audit titles, descriptions, headings, content, links, and schema',
  'Schema & Structured Data': 'create, test, and improve JSON-LD schema for rich results',
  'Technical SEO': 'check crawl, indexation, redirects, sitemaps, and page health',
  'Backlink & Link-Building': 'plan links, outreach, backlink ideas, and relevance checks',
  'Content SEO': 'improve content quality, structure, snippets, and CTR',
  'SEO Performance': 'estimate SEO traffic, clicks, visibility, ROI, and growth',
  'Local SEO': 'optimize local search, citations, reviews, locations, and schema',
  'Competitor Analysis': 'compare competitors, keywords, backlinks, pages, and gaps',
  'AI-Powered SEO': 'generate SEO content, outlines, FAQs, tags, and AI-ready snippets',
  'SEO Utility': 'create SEO files, tags, redirects, previews, and clean HTML outputs',
};

const TOOL_ACTIONS = [
  [/keyword.*suggest|keyword.*generator|keyword.*expansion|long-tail/i, 'Find fresh keyword ideas, long-tail terms, and content angles from one seed keyword.'],
  [/keyword.*density/i, 'Check keyword density, spot stuffing risk, and tune content relevance before publishing.'],
  [/keyword.*cluster/i, 'Group keywords by topic and intent so you can build cleaner hubs and briefs.'],
  [/(keyword-intent|intent identifier)/i, 'Classify search intent fast and map each keyword to the right page or funnel stage.'],
  [/keyword.*difficulty/i, 'Estimate ranking difficulty and prioritize realistic keyword opportunities.'],
  [/keyword.*gap/i, 'Find missing keyword opportunities your competitors cover and your site does not.'],
  [/rank|ranking|serp/i, 'Spot ranking opportunities, SERP gaps, and pages worth optimizing next.'],
  [/meta.*description/i, 'Write stronger meta descriptions with better length, clarity, and click intent.'],
  [/meta.*tag/i, 'Create title, description, Open Graph, and Twitter tags with a clean SERP-ready preview.'],
  [/title|headline/i, 'Generate sharper SEO titles and headlines designed for rankings and clicks.'],
  [/schema|structured/i, 'Build and validate JSON-LD schema so search engines can understand your page.'],
  [/robots/i, 'Create or validate robots.txt rules and avoid accidental crawl blocks.'],
  [/sitemap/i, 'Generate, inspect, and clean XML sitemaps for easier crawling and indexing.'],
  [/canonical/i, 'Check canonical URLs and prevent duplicate-content indexing problems.'],
  [/redirect|status/i, 'Test redirects and HTTP status codes before they waste crawl budget.'],
  [/broken.*link/i, 'Find broken links and fix dead paths before users or crawlers hit them.'],
  [/page.*speed|mobile/i, 'Check mobile and page experience signals that can hold back organic traffic.'],
  [/backlink|outreach|link/i, 'Analyze link opportunities, anchors, relevance, and outreach ideas faster.'],
  [/readability|word.*count|content|paragraph/i, 'Improve content structure, readability, topical coverage, and SEO clarity.'],
  [/local|gmb|citation|\bnap\b|review/i, 'Improve local SEO signals, citations, reviews, NAP consistency, and location pages.'],
  [/competitor/i, 'Compare competitor SEO signals and uncover gaps you can act on.'],
  [/ai/i, 'Generate AI-assisted SEO copy, outlines, FAQs, snippets, and optimization ideas.'],
  [/slug/i, 'Create clean, readable SEO slugs that are easy to share and index.'],
  [/og|open.*graph|preview|snippet/i, 'Preview Google and social snippets so your page earns more clicks.'],
];

const TITLE_OUTCOMES = [
  [/keyword.*density/i, 'Analyze SEO Content Fast'],
  [/keyword.*cluster/i, 'Group Keywords by Intent'],
  [/(keyword-intent|intent identifier)/i, 'Map Search Intent Fast'],
  [/keyword.*difficulty/i, 'Find Easier Ranking Wins'],
  [/keyword.*gap/i, 'Find Missing SEO Keywords'],
  [/keyword/i, 'Find Better SEO Keywords'],
  [/meta.*description/i, 'Write Click-Worthy Snippets'],
  [/meta.*tag/i, 'Create Google & Social Tags'],
  [/heading|headline|title/i, 'Improve Titles & Headings'],
  [/schema|structured/i, 'Validate Rich Results Markup'],
  [/robots/i, 'Check Crawl Rules Fast'],
  [/sitemap/i, 'Create Clean XML Sitemaps'],
  [/canonical/i, 'Fix Duplicate URL Signals'],
  [/redirect|status/i, 'Check Redirects & HTTP Codes'],
  [/broken/i, 'Find Dead Links Fast'],
  [/mobile|speed/i, 'Check Page Experience'],
  [/backlink|link/i, 'Find Better Link Opportunities'],
  [/local|gmb|citation|\bnap\b|review/i, 'Improve Local SEO Signals'],
  [/competitor/i, 'Find Competitor SEO Gaps'],
  [/ai/i, 'Generate Better SEO Copy'],
  [/slug/i, 'Create Clean SEO URLs'],
  [/og|preview|snippet/i, 'Preview Search & Social Snippets'],
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

  // If already within limits, use as-is (don't truncate or append filler)
  if (text.length <= 160) return text;

  // Truncate intelligently: try sentence boundary first, then word boundary
  const lastPeriod = text.lastIndexOf('. ', 155);
  if (lastPeriod > 80) {
    return text.slice(0, lastPeriod + 1);
  }
  // Word boundary fallback
  return `${text.slice(0, 157).replace(/\s+\S*$/, '')}.`;
}

function actionForTool(tool = {}) {
  const haystack = `${tool.slug || ''} ${tool.name || ''}`;
  const match = TOOL_ACTIONS.find(([pattern]) => pattern.test(haystack));
  if (match) return match[1];
  return `Use this tool to ${CATEGORY_ACTIONS[tool.category] || 'run faster SEO checks'}.`;
}

function outcomeForTool(tool = {}) {
  const haystack = `${tool.slug || ''} ${tool.name || ''}`;
  const match = TITLE_OUTCOMES.find(([pattern]) => pattern.test(haystack));
  return match?.[1] || 'Get Instant SEO Insights';
}

export function makeToolSeoTitle(tool = {}) {
  if (tool.metaTitle) return squeezeTitle(tool.metaTitle);
  const name = baseToolName(tool);
  const outcome = outcomeForTool(tool);
  const title = `Free ${name} - ${outcome}`;
  return squeezeTitle(title);
}

export function makeToolSeoDescription(tool = {}) {
  if (tool.metaDescription) return squeezeDescription(tool.metaDescription, tool.name);
  const name = baseToolName(tool);
  const action = actionForTool(tool);
  const description = `${action} Use the free ${name} for instant, browser-based SEO checks with practical outputs. No signup, no fluff.`;
  return squeezeDescription(description, name || CATEGORY_ACTIONS[tool.category]);
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
