// Node script to generate 100 tool modules in /tools and an index
// Run: npm run generate:tools
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tools = [
  // Keyword Research Tools
  { slug: 'keyword-suggestion-tool', name: 'Keyword Suggestion Tool', category: 'Keyword Research', description: 'Generate keyword ideas from a seed.', template: 'keywordSuggestions' },
  { slug: 'long-tail-keyword-generator', name: 'Long-Tail Keyword Generator', category: 'Keyword Research', description: 'Create long-tail variations with modifiers.', template: 'longTailKeywords' },
  { slug: 'keyword-density-checker', name: 'Keyword Density Checker', category: 'Keyword Research', description: 'Calculate keyword density in text.', template: 'keywordDensity' },
  { slug: 'keyword-clustering-tool', name: 'Keyword Clustering Tool', category: 'Keyword Research', description: 'Group keywords by similarity (basic).', template: 'keywordSuggestions' },
  { slug: 'keyword-intent-identifier', name: 'Keyword Intent Identifier', category: 'Keyword Research', description: 'Classify intent with heuristics.', template: 'keywordIntentIdentifier' },
  { slug: 'keyword-difficulty-estimator', name: 'Keyword Difficulty Estimator', category: 'Keyword Research', description: 'Heuristic difficulty estimate.', template: 'keywordShareEstimator' },
  { slug: 'trending-keyword-visualizer', name: 'Trending Keyword Visualizer', category: 'Keyword Research', description: 'Simple list of related trends.', template: 'keywordSuggestions' },
  { slug: 'keyword-gap-finder', name: 'Keyword Gap Finder', category: 'Keyword Research', description: 'Find gaps between sets (basic).', template: 'duplicateContentChecker' },
  { slug: 'keyword-comparison-tool', name: 'Keyword Comparison Tool', category: 'Keyword Research', description: 'Compare two keyword sets.', template: 'duplicateContentChecker' },
  { slug: 'keyword-expansion-tool', name: 'Keyword Expansion Tool', category: 'Keyword Research', description: 'Expand seed with prefixes/suffixes.', template: 'longTailKeywords' },

  // On-Page Optimization Tools
  { slug: 'meta-tag-generator', name: 'Meta Tag Generator', category: 'On-Page Optimization', description: 'Generate basic meta tags.', template: 'metaTagGenerator' },
  { slug: 'meta-description-optimizer', name: 'Meta Description Optimizer', category: 'On-Page Optimization', description: 'Check length and quality.', template: 'metaDescriptionOptimizer' },
  { slug: 'heading-analyzer', name: 'H1-H6 Heading Analyzer', category: 'On-Page Optimization', description: 'Extract and list headings.', template: 'headingAnalyzer' },
  { slug: 'word-count-structure-checker', name: 'Word Count & Structure Checker', category: 'On-Page Optimization', description: 'Word count and structure hints.', template: 'readabilityScore' },
  { slug: 'readability-score-calculator', name: 'Readability Score Calculator', category: 'On-Page Optimization', description: 'Flesch reading ease score.', template: 'readabilityScore' },
  { slug: 'duplicate-content-checker', name: 'Duplicate Content Checker', category: 'On-Page Optimization', description: 'Compare two texts for overlap.', template: 'duplicateContentChecker' },
  { slug: 'internal-link-suggestion-tool', name: 'Internal Link Suggestion Tool', category: 'On-Page Optimization', description: 'Suggest internal link anchors.', template: 'internalLinkSuggestionTool' },
  { slug: 'image-alt-tag-generator', name: 'Image Alt Tag Generator', category: 'On-Page Optimization', description: 'Generate alt tag ideas.', template: 'imageAltTagGenerator' },
  { slug: 'on-page-seo-audit-checker', name: 'On-Page SEO Audit Checker', category: 'On-Page Optimization', description: 'Basic on-page checks.', template: 'onPageSeoAuditChecker' },
  { slug: 'schema-markup-generator', name: 'Schema Markup Generator', category: 'On-Page Optimization', description: 'Generate JSON-LD schema.', template: 'schemaMarkupGenerator' },
  { slug: 'featured-tool-schema-generator', name: 'Featured Tool Schema Generator', category: 'Schema & Structured Data', description: 'Generate dynamic JSON-LD schema for Ads/Promotion/Featured Tool sections.', template: 'featuredToolSchemaGenerator' },

  // Technical SEO Tools
  { slug: 'robots-txt-validator', name: 'Robots.txt Validator', category: 'Technical SEO', description: 'Validate robots.txt directives.', template: 'robotsTxtValidator' },
  { slug: 'xml-sitemap-visualizer', name: 'XML Sitemap Visualizer', category: 'Technical SEO', description: 'Extract URLs from sitemap XML.', template: 'xmlSitemapVisualizer' },
  { slug: 'canonical-tag-checker', name: 'Canonical Tag Checker', category: 'Technical SEO', description: 'Check canonical tag presence.', template: 'canonicalTagChecker' },
  { slug: 'page-speed-score-simulator', name: 'Page Speed Score Simulator', category: 'Technical SEO', description: 'Heuristic page speed hints.', template: 'pageSpeedScoreSimulator' },
  { slug: 'mobile-friendly-test', name: 'Mobile-Friendly Test', category: 'Technical SEO', description: 'Viewport tag detection.', template: 'mobileFriendlyTest' },
  { slug: 'broken-link-finder', name: 'Broken Link Finder', category: 'Technical SEO', description: 'Extract and list links from HTML.', template: 'brokenLinkFinder' },
  { slug: 'redirect-checker', name: 'Redirect Checker', category: 'Technical SEO', description: 'Map and list redirects.', template: 'redirectChecker' },
  { slug: 'http-status-code-tester', name: 'HTTP Status Code Tester', category: 'Technical SEO', description: 'Explain common HTTP statuses.', template: 'httpStatusCodeTester' },
  { slug: 'title-meta-length-counter', name: 'Title & Meta Length Counter', category: 'Technical SEO', description: 'Count title and meta length.', template: 'titleMetaLengthCounter' },
  { slug: 'structured-data-validator', name: 'Structured Data Validator', category: 'Technical SEO', description: 'Check JSON-LD validity.', template: 'structuredDataValidator' },

  // Backlink & Link-Building Tools
  { slug: 'backlink-idea-generator', name: 'Backlink Idea Generator', category: 'Backlink & Link-Building', description: 'Suggest backlink ideas.', template: 'backlinkIdeaGenerator' },
  { slug: 'anchor-text-analyzer', name: 'Anchor Text Analyzer', category: 'Backlink & Link-Building', description: 'Analyze anchor text distribution.', template: 'anchorTextAnalyzer' },
  { slug: 'link-relevance-evaluator', name: 'Link Relevance Evaluator', category: 'Backlink & Link-Building', description: 'Heuristic link relevance.', template: 'linkRelevanceEvaluator' },
  { slug: 'guest-posting-opportunity-finder', name: 'Guest Posting Opportunity Finder', category: 'Backlink & Link-Building', description: 'Suggest guest post targets.', template: 'guestPostingOpportunityFinder' },
  { slug: 'internal-linking-planner', name: 'Internal Linking Planner', category: 'Backlink & Link-Building', description: 'Plan internal links.', template: 'internalLinkingPlanner' },
  { slug: 'backlink-tracking-template-generator', name: 'Backlink Tracking Template Generator', category: 'Backlink & Link-Building', description: 'Generate tracking template.', template: 'backlinkTrackingTemplate' },
  { slug: 'outreach-email-template-generator', name: 'Outreach Email Template Generator', category: 'Backlink & Link-Building', description: 'Email template ideas.', template: 'longTailKeywords' },
  { slug: 'link-source-categorizer', name: 'Link Source Categorizer', category: 'Backlink & Link-Building', description: 'Categorize sources.', template: 'linkSourceCategorizer' },
  { slug: 'domain-authority-simulator', name: 'Domain Authority Simulator', category: 'Backlink & Link-Building', description: 'Heuristic DA score.', template: 'domainAuthoritySimulator' },
  { slug: 'link-toxicity-checker', name: 'Link Toxicity Checker', category: 'Backlink & Link-Building', description: 'Heuristic toxicity score.', template: 'linkToxicityChecker' },

  // Content SEO Tools
  { slug: 'blog-title-generator', name: 'Blog Title Generator', category: 'Content SEO', description: 'Generate blog title ideas.', template: 'blogTitleGenerator' },
  { slug: 'meta-description-writer', name: 'Meta Description Writer', category: 'Content SEO', description: 'Write meta descriptions.', template: 'metaDescriptionWriter' },
  { slug: 'paragraph-keyword-optimizer', name: 'Paragraph Keyword Optimizer', category: 'Content SEO', description: 'Suggest keyword placements.', template: 'paragraphKeywordOptimizer' },
  { slug: 'readability-enhancer', name: 'Readability Enhancer', category: 'Content SEO', description: 'Suggest readability improvements.', template: 'readabilityEnhancer' },
  { slug: 'headline-analyzer', name: 'Headline Analyzer', category: 'Content SEO', description: 'Analyze headline strength.', template: 'headlineAnalyzer' },
  { slug: 'faq-generator', name: 'FAQ Generator', category: 'Content SEO', description: 'Generate FAQs from topic.', template: 'faqGenerator' },
  { slug: 'product-description-generator', name: 'Product Description Generator', category: 'Content SEO', description: 'Generate product copy.', template: 'productDescriptionGenerator' },
  { slug: 'content-gap-finder', name: 'Content Gap Finder', category: 'Content SEO', description: 'Find content gaps.', template: 'contentGapFinder' },
  { slug: 'featured-snippet-optimizer', name: 'Featured Snippet Optimizer', category: 'Content SEO', description: 'Optimize for snippet.', template: 'featuredSnippetOptimizer' },
  { slug: 'keyword-placement-highlighter', name: 'Keyword Placement Highlighter', category: 'Content SEO', description: 'Highlight keywords in text.', template: 'keywordPlacementHighlighter' },

  // SEO Performance Tools
  { slug: 'ctr-predictor', name: 'CTR Predictor', category: 'SEO Performance', description: 'Heuristic CTR estimate.', template: 'ctrPredictor' },
  { slug: 'organic-growth-forecast-tool', name: 'Organic Growth Forecast Tool', category: 'SEO Performance', description: 'Simple growth forecast.', template: 'organicGrowthForecast' },
  { slug: 'traffic-potential-calculator', name: 'Traffic Potential Calculator', category: 'SEO Performance', description: 'Estimate traffic potential.', template: 'trafficPotentialCalculator' },
  { slug: 'keyword-roi-calculator', name: 'Keyword ROI Calculator', category: 'SEO Performance', description: 'Estimate ROI.', template: 'keywordRoiCalculator' },
  { slug: 'bounce-rate-estimator', name: 'Bounce Rate Estimator', category: 'SEO Performance', description: 'Heuristic bounce rate.', template: 'bounceRateEstimator' },
  { slug: 'visibility-index-calculator', name: 'Visibility Index Calculator', category: 'SEO Performance', description: 'Simple visibility index.', template: 'visibilityIndexCalculator' },
  { slug: 'ranking-progress-tracker', name: 'Ranking Progress Tracker', category: 'SEO Performance', description: 'Track ranking progress.', template: 'rankingProgressTracker' },
  { slug: 'impression-to-click-ratio-calculator', name: 'Impression-to-Click Ratio Calculator', category: 'SEO Performance', description: 'Calculate IC ratio.', template: 'impressionToClickRatioCalculator' },
  { slug: 'site-comparison-report-generator', name: 'Site Comparison Report Generator', category: 'SEO Performance', description: 'Generate comparison report.', template: 'siteComparisonReportGenerator' },
  { slug: 'seo-health-score-calculator', name: 'SEO Health Score Calculator', category: 'SEO Performance', description: 'Heuristic health score.', template: 'seoHealthScore' },

  // Local SEO Tools
  { slug: 'local-keyword-generator', name: 'Local Keyword Generator', category: 'Local SEO', description: 'Generate local keywords.', template: 'localKeywordGenerator' },
  { slug: 'nap-consistency-checker', name: 'NAP Consistency Checker', category: 'Local SEO', description: 'Check NAP consistency (basic).', template: 'napConsistencyChecker' },
  { slug: 'local-seo-audit-checklist', name: 'Local SEO Audit Checklist', category: 'Local SEO', description: 'Checklist generation.', template: 'localSeoAuditChecklist' },
  { slug: 'gmb-optimization-helper', name: 'Google My Business Optimization Helper', category: 'Local SEO', description: 'GMB optimization tips.', template: 'gmbOptimizationHelper' },
  { slug: 'local-citation-finder', name: 'Local Citation Finder', category: 'Local SEO', description: 'Find citation ideas.', template: 'localCitationFinder' },
  { slug: 'geo-keyword-expansion-tool', name: 'Geo Keyword Expansion Tool', category: 'Local SEO', description: 'Geo keyword expansions.', template: 'geoKeywordExpansionTool' },
  { slug: 'review-response-generator', name: 'Review Response Generator', category: 'Local SEO', description: 'Generate responses.', template: 'reviewResponseGenerator' },
  { slug: 'local-schema-builder', name: 'Local Schema Builder', category: 'Local SEO', description: 'LocalBusiness schema.', template: 'localSchemaBuilder' },
  { slug: 'location-based-content-idea-generator', name: 'Location-Based Content Idea Generator', category: 'Local SEO', description: 'Content ideas by location.', template: 'locationBasedContent' },
  { slug: 'hreflang-tag-generator', name: 'Hreflang Tag Generator', category: 'Local SEO', description: 'Generate hreflang tags.', template: 'hreflangTagGenerator' },

  // Competitor Analysis Tools
  { slug: 'competitor-keyword-overlap-checker', name: 'Competitor Keyword Overlap Checker', category: 'Competitor Analysis', description: 'Overlap between competitor keywords.', template: 'duplicateContentChecker' },
  { slug: 'meta-tag-comparison-tool', name: 'Meta Tag Comparison Tool', category: 'Competitor Analysis', description: 'Compare meta tags.', template: 'duplicateContentChecker' },
  { slug: 'content-length-comparator', name: 'Content Length Comparator', category: 'Competitor Analysis', description: 'Compare content length.', template: 'readabilityScore' },
  { slug: 'competitor-backlink-idea-generator', name: 'Competitor Backlink Idea Generator', category: 'Competitor Analysis', description: 'Backlink ideas from inputs.', template: 'competitorBacklinkIdeaGenerator' },
  { slug: 'tone-of-voice-analyzer', name: 'Tone of Voice Analyzer', category: 'Competitor Analysis', description: 'Basic tone analysis.', template: 'toneOfVoiceAnalyzer' },
  { slug: 'domain-comparison-report-tool', name: 'Domain Comparison Report Tool', category: 'Competitor Analysis', description: 'Compare domain attributes.', template: 'domainComparisonReportTool' },
  { slug: 'competitor-gap-analyzer', name: 'Competitor Gap Analyzer', category: 'Competitor Analysis', description: 'Identify gaps.', template: 'competitorGapAnalyzer' },
  { slug: 'ranking-opportunity-finder', name: 'Ranking Opportunity Finder', category: 'Competitor Analysis', description: 'Find ranking opportunities.', template: 'rankingOpportunityFinder' },
  { slug: 'keyword-share-estimator', name: 'Keyword Share Estimator', category: 'Competitor Analysis', description: 'Estimate share.', template: 'keywordShareEstimator' },
  { slug: 'competitor-summary-report-creator', name: 'Competitor Summary Report Creator', category: 'Competitor Analysis', description: 'Create summary report.', template: 'competitorSummaryReport' },

  // AI-Powered SEO Tools (template-based heuristics)
  { slug: 'ai-content-outline-generator', name: 'AI Content Outline Generator', category: 'AI-Powered SEO', description: 'Outline from topic (heuristic).', template: 'aiContentOutlineGenerator' },
  { slug: 'ai-meta-tag-writer', name: 'AI Meta Tag Writer', category: 'AI-Powered SEO', description: 'Meta tags from inputs.', template: 'aiMetaTagWriter' },
  { slug: 'ai-snippet-generator', name: 'AI Snippet Generator', category: 'AI-Powered SEO', description: 'Snippet-like summary.', template: 'aiSnippetGenerator' },
  { slug: 'ai-faq-creator', name: 'AI FAQ Creator', category: 'AI-Powered SEO', description: 'FAQ list from topic.', template: 'aiFaqCreator' },
  { slug: 'ai-keyword-explainer', name: 'AI Keyword Explainer', category: 'AI-Powered SEO', description: 'Explain keywords (heuristic).', template: 'aiKeywordExplainer' },
  { slug: 'ai-blog-intro-writer', name: 'AI Blog Intro Writer', category: 'AI-Powered SEO', description: 'Intro paragraph ideas.', template: 'aiBlogIntroWriter' },
  { slug: 'ai-schema-generator', name: 'AI Schema Generator', category: 'AI-Powered SEO', description: 'Generate schema.', template: 'aiSchemaGenerator' },
  { slug: 'ai-competitor-title-rewriter', name: 'AI Competitor Title Rewriter', category: 'AI-Powered SEO', description: 'Rewrite titles (heuristic).', template: 'aiCompetitorTitleRewriter' },
  { slug: 'ai-content-improver', name: 'AI Content Improver', category: 'AI-Powered SEO', description: 'Improve content (heuristic).', template: 'aiContentImprover' },
  { slug: 'ai-article-length-optimizer', name: 'AI Article Length Optimizer', category: 'AI-Powered SEO', description: 'Optimize length suggestions.', template: 'aiArticleLengthOptimizer' },

  // SEO Utility Tools
  { slug: 'url-slug-generator', name: 'URL Slug Generator', category: 'SEO Utility', description: 'Generate URL-friendly slugs.', template: 'urlSlugGenerator' },
  { slug: 'og-tag-generator', name: 'OG (Open Graph) Tag Generator', category: 'SEO Utility', description: 'Generate basic OG tags.', template: 'ogTagGenerator' },
  { slug: 'redirect-301-generator', name: '301 Redirect Generator', category: 'SEO Utility', description: 'Generate 301 redirect mapping.', template: 'redirect301Generator' },
  { slug: 'sitemap-generator', name: 'Sitemap Generator', category: 'SEO Utility', description: 'Create simple XML sitemap.', template: 'sitemapGenerator' },
  { slug: 'canonical-url-builder', name: 'Canonical URL Builder', category: 'SEO Utility', description: 'Build canonical URLs.', template: 'canonicalUrlBuilder' },
  { slug: 'robots-txt-creator', name: 'Robots.txt Creator', category: 'SEO Utility', description: 'Create robots.txt.', template: 'robotsTxtCreator' },
  { slug: 'search-preview-simulator', name: 'Search Preview Simulator', category: 'SEO Utility', description: 'Preview search snippet.', template: 'searchPreviewSimulator' },
  { slug: 'content-freshness-checker', name: 'Content Freshness Checker', category: 'SEO Utility', description: 'Estimate content freshness.', template: 'contentFreshnessChecker' },
  { slug: 'text-to-html-converter', name: 'Text-to-HTML Converter', category: 'SEO Utility', description: 'Wrap text into basic HTML.', template: 'textToHtmlConverter' },
  { slug: 'seo-checklist-generator', name: 'SEO Checklist Generator', category: 'SEO Utility', description: 'Generate checklist.', template: 'seoChecklistGenerator' },
  { slug: 'reverse-image-search', name: 'Reverse Image Search', category: 'SEO Utility', description: 'Find image sources.', template: 'reverseImageSearch' },
  { slug: 'ai-content-detector', name: 'AI Content Detector', category: 'AI-Powered SEO', description: 'Detect AI content.', template: 'aiContentDetector' },
  { slug: 'text-translator', name: 'Text Translator', category: 'SEO Utility', description: 'Translate text.', template: 'textTranslator' },
  { slug: 'seo-content-checker', name: 'SEO Content Checker', category: 'On-Page Optimization', description: 'Comprehensive content analysis.', template: 'seoContentChecker' }
];

const outDir = path.join(process.cwd(), 'tools');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function writeToolModule(tool) {
  // Be careful not to overwrite existing files if they have custom modifications!
  // BUT the user asked to generate 100 tools.
  // We should probably check if it exists and only write if missing OR if we want to enforce uniformity.
  // For now, let's overwrite to ensure `api: true` and templates are correct.
  // WAIT. Many tools have `api: true` manually added. I should preserve that.

  const filePath = path.join(outDir, `${tool.slug}.js`);
  let toolData = tool;

  if (fs.existsSync(filePath)) {
    // Read existing to check for 'api' flag
    const existing = fs.readFileSync(filePath, 'utf8');
    if (existing.includes('api": true') || existing.includes("api': true")) {
      toolData = { ...tool, api: true };
    }
  }

  const content = `export default ${JSON.stringify(toolData, null, 2)};\n`;
  fs.writeFileSync(filePath, content, 'utf8');
}

tools.forEach(writeToolModule);

// Create tools index that imports and exports all
const imports = tools.map((t, i) => `import t${i} from './${t.slug}.js';`).join('\n');
const array = `export const tools = [${tools.map((_, i) => `t${i}`).join(', ')}];\n`;
const helpers = `export function getAllToolsMeta() { return tools; }\nexport function getToolBySlug(slug) { return tools.find(t => t.slug === slug); }\n`;
fs.writeFileSync(path.join(outDir, 'index.js'), `${imports}\n\n${array}\n${helpers}`, 'utf8');

console.log(`Generated ${tools.length} tool modules in /tools`);