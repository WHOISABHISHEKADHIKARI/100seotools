import { tokenize, countWords, stripHtmlToText } from './utils.js';
import { getBaseUrl } from './site.js';

// Template definitions provide fields and an action label
export function getTemplateDefinition(key) {
  const defs = {
    anchorTextAnalyzer: {
      actionLabel: 'Analyze Anchors',
      fields: [
        { name: 'url', label: 'Page URL', type: 'url', placeholder: 'https://example.com', required: true }
      ]
    },
    backlinkIdeaGenerator: {
      actionLabel: 'Generate Ideas',
      fields: [
        { name: 'keyword', label: 'Target Keyword / Niche', type: 'text', placeholder: 'e.g. vintage cars', required: true }
      ]
    },
    linkRelevanceEvaluator: {
      actionLabel: 'Check Relevance',
      fields: [
        { name: 'linkUrl', label: 'Link Source URL', type: 'url', placeholder: 'https://source-site.com/article', required: true },
        { name: 'targetKeyword', label: 'Target Keyword', type: 'text', placeholder: 'e.g. coffee beans', required: true }
      ]
    },
    linkToxicityChecker: {
      actionLabel: 'Check Toxicity',
      fields: [
        { name: 'url', label: 'Link URL to Check', type: 'url', placeholder: 'https://suspicious-site.com', required: true }
      ]
    },
    internalLinkSuggestionTool: {
      actionLabel: 'Suggest Internal Links',
      fields: [
        { name: 'content', label: 'Content (Paste Article Text)', type: 'textarea', placeholder: 'Paste your blog post content here...', required: true }
      ]
    },
    httpStatusCodeTester: {
      actionLabel: 'Check Status',
      fields: [
        { name: 'url', label: 'URL', type: 'url', placeholder: 'https://example.com', required: true }
      ]
    },
    redirectChecker: {
      actionLabel: 'Check Redirects',
      fields: [
        { name: 'url', label: 'URL', type: 'url', placeholder: 'https://example.com', required: true }
      ]
    },
    sitemapGenerator: {
      actionLabel: 'Generate Sitemap',
      fields: [
        { name: 'url', label: 'Website URL', type: 'url', placeholder: 'https://example.com', required: true }
      ]
    },
    brokenLinkFinder: {
      actionLabel: 'Find Broken Links',
      fields: [
        { name: 'url', label: 'Website URL', type: 'url', placeholder: 'https://example.com', required: true }
      ]
    },

    aiBlogIntroWriter: {
      actionLabel: 'Write Intro',
      fields: [
        { name: 'title', label: 'Blog Post Title', type: 'text', placeholder: 'e.g. 10 Best SEO Tools', required: true },
        { name: 'keyword', label: 'Focus Keyword', type: 'text', placeholder: 'e.g. seo tools', required: true }
      ]
    },
    aiContentDetector: {
      actionLabel: 'Analyze Content',
      fields: [
        { name: 'text', label: 'Content to Check', type: 'textarea', placeholder: 'Paste text here...', required: true }
      ]
    },
    aiMetaTagWriter: {
      actionLabel: 'Generate Tags',
      fields: [
        { name: 'keyword', label: 'Focus Keyword', type: 'text', placeholder: 'e.g. digital marketing', required: true },
        { name: 'desc', label: 'Short Description/Context (Optional)', type: 'textarea', placeholder: ' Brief summary...' }
      ]
    },
    aiSnippetGenerator: {
      actionLabel: 'Generate Snippet',
      fields: [
        { name: 'content', label: 'Content Source', type: 'textarea', placeholder: 'Paste content or url...', required: true },
        { name: 'query', label: 'Target Query', type: 'text', placeholder: 'e.g. what is seo', required: true }
      ]
    },
    metaDescriptionOptimizer: {
      actionLabel: 'Optimize',
      fields: [
        { name: 'desc', label: 'Meta Description', type: 'textarea', placeholder: 'Enter description...', required: true },
        { name: 'keyword', label: 'Target Keyword', type: 'text', placeholder: 'e.g. best coffee', required: true }
      ]
    },
    metaDescriptionWriter: {
      actionLabel: 'Write Description',
      fields: [
        { name: 'title', label: 'Page Title', type: 'text', placeholder: 'e.g. My Page', required: true },
        { name: 'keyword', label: 'Target Keyword', type: 'text', placeholder: 'e.g. coffee' }
      ]
    },
    pageSpeedScoreSimulator: {
      actionLabel: 'Simulate Score',
      fields: [
        { name: 'url', label: 'Website URL', type: 'url', placeholder: 'https://example.com', required: true }
      ]
    },
    seoChecklistGenerator: {
      actionLabel: 'Generate',
      fields: [
        { name: 'type', label: 'Checklist Type (Optional)', type: 'text', placeholder: 'e.g. on-page, technical' }
      ]
    },
    seoContentChecker: {
      actionLabel: 'Analyze Content',
      fields: [
        { name: 'content', label: 'Page Content', type: 'textarea', placeholder: 'Paste content here...' },
        { name: 'keyword', label: 'Target Keyword', type: 'text', placeholder: 'e.g. seo tips' }
      ]
    },
    seoHealthScore: {
      actionLabel: 'Calculate Score',
      fields: [
        { name: 'url', label: 'Website URL', type: 'url', placeholder: 'https://example.com', required: true }
      ]
    },
    structuredDataValidator: {
      actionLabel: 'Validate',
      fields: [
        { name: 'json', label: 'JSON-LD Snippet', type: 'textarea', placeholder: '<script type="application/ld+json">...</script>', required: true }
      ]
    },
    trafficPotentialCalculator: {
      actionLabel: 'Calculate',
      fields: [
        { name: 'volume', label: 'Monthly Search Volume', type: 'number', placeholder: '1000' },
        { name: 'position', label: 'Current/Target Position', type: 'number', placeholder: '1' }
      ]
    },
    redirect301Generator: {
      actionLabel: 'Generate Code',
      fields: [
        { name: 'old', label: 'Old URL', type: 'text', placeholder: '/old-page' },
        { name: 'new', label: 'New URL', type: 'text', placeholder: '/new-page' }
      ]
    },
    aiContentOutlineGenerator: {
      actionLabel: 'Generate Outline',
      fields: [
        { name: 'keyword', label: 'Main Topic/Keyword', type: 'text', placeholder: 'e.g. digital marketing strategy', required: true }
      ]
    },
    aiFaqCreator: {
      actionLabel: 'Generate FAQs',
      fields: [
        { name: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g. solar panels', required: true }
      ]
    },
    aiKeywordExplainer: {
      actionLabel: 'Explain',
      fields: [
        { name: 'keyword', label: 'Term to Explain', type: 'text', placeholder: 'e.g. canonical tag' }
      ]
    },
    internalLinkingPlanner: {
      actionLabel: 'Plan Links',
      fields: [
        { name: 'content', label: 'Content/Article', type: 'textarea', placeholder: 'Paste your article content...' },
        { name: 'keywords', label: 'Target Keywords (comma separated)', type: 'textarea', placeholder: 'seo tools, link building, keyword research' }
      ]
    },
    keywordIntentIdentifier: {
      actionLabel: 'Identify Intent',
      fields: [
        { name: 'keyword', label: 'Keyword', type: 'text', placeholder: 'e.g. buy shoes' }
      ]
    },
    keywordPlacementHighlighter: {
      actionLabel: 'Highlight',
      fields: [
        { name: 'content', label: 'Content', type: 'textarea', placeholder: 'Paste content...' },
        { name: 'keyword', label: 'Target Keyword', type: 'text', placeholder: 'e.g. seo' }
      ]
    },
    keywordRoiCalculator: {
      actionLabel: 'Calculate ROI',
      fields: [
        { name: 'cpc', label: 'Cost Per Click ($)', type: 'number', placeholder: '2.50', required: true },
        { name: 'conversion_rate', label: 'Conversion Rate (%)', type: 'number', placeholder: '2.0', required: true },
        { name: 'value', label: 'Customer Value ($)', type: 'number', placeholder: '100', required: true }
      ]
    },
    keywordComparisonTool: {
      actionLabel: 'Compare Lists',
      fields: [
        { name: 'listA', label: 'Keyword List A', type: 'textarea', placeholder: 'seo tool\nkeyword research\nmarketing' },
        { name: 'listB', label: 'Keyword List B', type: 'textarea', placeholder: 'seo tool\ncontent marketing\nanalysis' }
      ]
    },
    keywordShareEstimator: {
      actionLabel: 'Estimate Share',
      fields: [
        { name: 'volume', label: 'Search Volume', type: 'number', placeholder: '1000' },
        { name: 'difficulty', label: 'Keyword Difficulty', type: 'number', placeholder: '45' }
      ]
    },
    keywordSuggestions: {
      actionLabel: 'Generate Ideas',
      fields: [
        { name: 'seed', label: 'Seed Keyword', type: 'text', placeholder: 'e.g. digital marketing' }
      ]
    },
    linkSourceCategorizer: {
      actionLabel: 'Categorize',
      fields: [
        { name: 'url', label: 'URL', type: 'url', placeholder: 'https://example.com' }
      ]
    },
    localCitationFinder: {
      actionLabel: 'Find Citations',
      fields: [
        { name: 'category', label: 'Business Category', type: 'text', placeholder: 'e.g. Restaurant', required: true },
        { name: 'city', label: 'City', type: 'text', placeholder: 'e.g. London', required: true }
      ]
    },
    localKeywordGenerator: {
      actionLabel: 'Generate Keywords',
      fields: [
        { name: 'service', label: 'Service/Product', type: 'text', placeholder: 'e.g. Pizza Delivery', required: true },
        { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g. Brooklyn', required: true }
      ]
    },
    localSchemaBuilder: {
      actionLabel: 'Build Schema',
      fields: [
        { name: 'name', label: 'Business Name', type: 'text', placeholder: 'Business Name', required: true },
        { name: 'address', label: 'Street Address', type: 'text', placeholder: '123 Main St' },
        { name: 'city', label: 'City', type: 'text', placeholder: 'New York' },
        { name: 'zip', label: 'Zip Code', type: 'text', placeholder: '10001' }
      ]
    },
    localSeoAuditChecklist: {
      actionLabel: 'Generate Checklist',
      fields: [
        { name: 'business_name', label: 'Business Name', type: 'text', placeholder: 'Business Name', required: true }
      ]
    },
    mobileFriendlyTest: {
      actionLabel: 'Test Mobile',
      fields: [
        { name: 'url', label: 'Website URL', type: 'url', placeholder: 'https://example.com' }
      ]
    },
    napConsistencyChecker: {
      actionLabel: 'Check NAP',
      fields: [
        { name: 'name', label: 'Business Name', type: 'text', placeholder: 'My Business', required: true },
        { name: 'phone', label: 'Phone Number', type: 'text', placeholder: '555-0123', required: true },
        { name: 'address', label: 'Address', type: 'text', placeholder: '123 Main St, City', required: true }
      ]
    },
    aiSchemaGenerator: {
      actionLabel: 'Generate Schema',
      fields: [
        { name: 'type', label: 'Schema Type', type: 'text', placeholder: 'Article, Product, Organization' },
        { name: 'name', label: 'Name/Headline', type: 'text', placeholder: 'Entity Name' },
        { name: 'url', label: 'URL', type: 'text', placeholder: 'https://example.com' }
      ]
    },
    bounceRateEstimator: {
      actionLabel: 'Estimate Bounce Rate',
      fields: [
        { name: 'industry', label: 'Industry', type: 'text', placeholder: 'e.g. E-commerce' },
        { name: 'load_time', label: 'Load Time (seconds)', type: 'number', placeholder: '2.5' }
      ]
    },
    backlinkTrackingTemplate: {
      actionLabel: 'Generate Template',
      fields: [
        { name: 'project_name', label: 'Project Name (Optional)', type: 'text', placeholder: 'My Website Campaign' }
      ]
    },
    competitorSummaryReport: {
      actionLabel: 'Create Report',
      fields: [
        { name: 'competitor_url', label: 'Competitor URL', type: 'text', placeholder: 'https://competitor.com' }
      ]
    },
    onPageSeoAuditChecker: {
      actionLabel: 'Audit Page',
      fields: [
        { name: 'url', label: 'Page URL', type: 'url', placeholder: 'https://example.com', required: true }
      ]
    },
    locationBasedContent: {
      actionLabel: 'Generate Ideas',
      fields: [
        { name: 'keyword', label: 'Service/Keyword', type: 'text', placeholder: 'e.g. plumbing' },
        { name: 'location', label: 'City/Location', type: 'text', placeholder: 'e.g. New York' }
      ]
    },
    organicGrowthForecast: {
      actionLabel: 'Forecast Growth',
      fields: [
        { name: 'current_traffic', label: 'Current Monthly Traffic', type: 'number', placeholder: '5000' },
        { name: 'growth_rate', label: 'Monthly Growth Rate (%)', type: 'number', placeholder: '5' }
      ]
    },
    paragraphKeywordOptimizer: {
      actionLabel: 'Optimize Paragraph',
      fields: [
        { name: 'paragraph', label: 'Paragraph Text', type: 'textarea', placeholder: 'Paste your paragraph...' },
        { name: 'keywords', label: 'Target Keywords', type: 'text', placeholder: 'seo, content marketing' }
      ]
    },
    rankingOpportunityFinder: {
      actionLabel: 'Find Opportunities',
      fields: [
        { name: 'competitor_url', label: 'Competitor Page URL', type: 'url', placeholder: 'https://competitor.com/page', required: true }
      ]
    },
    rankingProgressTracker: {
      actionLabel: 'Track Progress',
      fields: [
        { name: 'current_rank', label: 'Current Rank', type: 'number', placeholder: '12', required: true },
        { name: 'previous_rank', label: 'Previous Rank', type: 'number', placeholder: '15' }
      ]
    },
    readabilityEnhancer: {
      actionLabel: 'Enhance Readability',
      fields: [
        { name: 'text', label: 'Content', type: 'textarea', placeholder: 'Paste content to simplify...', required: true }
      ]
    },
    reverseImageSearch: {
      actionLabel: 'Search Image',
      fields: [
        { name: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://example.com/image.jpg' }
      ]
    },
    siteComparisonReportGenerator: {
      actionLabel: 'Compare Sites',
      fields: [
        { name: 'site1', label: 'Your Site', type: 'text', placeholder: 'mysite.com' },
        { name: 'site2', label: 'Competitor Site', type: 'text', placeholder: 'competitor.com' }
      ]
    },
    textTranslator: {
      actionLabel: 'Translate',
      fields: [
        { name: 'text', label: 'Text to Translate', type: 'textarea', placeholder: 'Enter text...' },
        { name: 'target_lang', label: 'Target Language', type: 'text', placeholder: 'Spanish, French, German' }
      ]
    },
    toneOfVoiceAnalyzer: {
      actionLabel: 'Analyze Tone',
      fields: [
        { name: 'content', label: 'Content', type: 'textarea', placeholder: 'Paste content...' }
      ]
    },
    visibilityIndexCalculator: {
      actionLabel: 'Calculate Visibility',
      fields: [
        { name: 'rankings', label: 'Rankings (comma separated positions)', type: 'textarea', placeholder: '1, 5, 12, 3, 8', required: true }
      ]
    },
    productDescriptionGenerator: {
      actionLabel: 'Generate Description',
      fields: [
        { name: 'product_name', label: 'Product Name', type: 'text', placeholder: 'SuperWidget 3000', required: true },
        { name: 'features', label: 'Key Features', type: 'textarea', placeholder: '- Durable\n- Fast\n- Cheap', required: true }
      ]
    },
    reviewResponseGenerator: {
      actionLabel: 'Generate Response',
      fields: [
        { name: 'customer_name', label: 'Customer Name', type: 'text', placeholder: 'Alex' },
        { name: 'rating', label: 'Rating (1-5)', type: 'number', placeholder: '5', required: true },
        { name: 'comment', label: 'Customer Comment', type: 'textarea', placeholder: 'Great service!', required: true }
      ]
    },
    robotsTxtCreator: {
      actionLabel: 'Create Robots.txt',
      fields: [
        { name: 'allowed', label: 'Allowed Paths (one per line)', type: 'textarea', placeholder: '/' },
        { name: 'disallowed', label: 'Disallowed Paths (one per line)', type: 'textarea', placeholder: '/admin' }
      ]
    },
    urlSlugGenerator: {
      actionLabel: 'Generate Slug',
      fields: [
        { name: 'title', label: 'Page Title', type: 'text', placeholder: 'e.g. My Awesome Page', required: true }
      ]
    },
    titleMetaLengthCounter: {
      actionLabel: 'Analyze Length',
      fields: [
        { name: 'title', label: 'Title Tag', type: 'text', placeholder: 'Enter title...' },
        { name: 'description', label: 'Meta Description', type: 'textarea', placeholder: 'Enter description...' },
        { name: 'url', label: 'URL (Optional)', type: 'text', placeholder: 'https://...' }
      ]
    },
    canonicalUrlBuilder: {
      actionLabel: 'Build URL',
      fields: [
        { name: 'url', label: 'Raw URL', type: 'url', placeholder: 'https://example.com/page?ref=123' }
      ]
    },
    imageAltTagGenerator: {
      actionLabel: 'Generate Alt Text',
      fields: [
        { name: 'filename', label: 'Image Filename', type: 'text', placeholder: 'IMG_2024.jpg' },
        { name: 'context', label: 'Surrounding Text / Context (Optional)', type: 'textarea', placeholder: 'Describe the image content or paste surrounding text...' }
      ]
    },
    ogTagGenerator: {
      actionLabel: 'Generate OG Tags',
      fields: [
        { name: 'title', label: 'OG Title', type: 'text', placeholder: 'Title...' },
        { name: 'desc', label: 'OG Description', type: 'textarea', placeholder: 'Description...' },
        { name: 'image', label: 'Image URL', type: 'text', placeholder: 'https://...' },
        { name: 'url', label: 'Page URL', type: 'text', placeholder: 'https://...' }
      ]
    },
    searchPreviewSimulator: {
      actionLabel: 'Preview',
      fields: [
        { name: 'title', label: 'Page Title', type: 'text', placeholder: 'Title...' },
        { name: 'description', label: 'Meta Description', type: 'textarea', placeholder: 'Description...' },
        { name: 'url', label: 'URL', type: 'text', placeholder: 'https://example.com' }
      ]
    },
    faqGenerator: {
      actionLabel: 'Generate JSON-LD',
      fields: [
        { name: 'questions', label: 'Questions & Answers (Format: Q: ... | A: ...)', type: 'textarea', placeholder: 'Q: What is SEO? | A: SEO stands for...' }
      ]
    },
    blogTitleGenerator: {
      actionLabel: 'Generate Titles',
      fields: [
        { name: 'keyword', label: 'Main Keyword', type: 'text', placeholder: 'e.g. vegan recipes' }
      ]
    },
    keywordSuggestions: {
      actionLabel: 'Get Suggestions',
      fields: [
        { name: 'seed', label: 'Seed Keyword', type: 'text', placeholder: 'e.g. coffee beans' }
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
        { name: 'html', label: 'HTML', type: 'textarea', placeholder: '<h1>Title</h1>\n<h2>Subtitle</h2>', required: true }
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
        { name: 'robots', label: 'robots.txt', type: 'textarea', placeholder: 'Paste robots.txt content', required: true }
      ]
    },
    xmlSitemapVisualizer: {
      actionLabel: 'Visualize',
      fields: [
        { name: 'xml', label: 'Sitemap XML', type: 'textarea', placeholder: '<urlset>...</urlset>', required: true }
      ]
    },

    seoContentChecker: {
      actionLabel: 'Analyze',
      fields: [
        { name: 'title', label: 'Title', type: 'text', placeholder: 'e.g., SEO Content Checker Guide' },
        { name: 'content', label: 'Content', type: 'textarea', placeholder: 'Paste your content (plain text or HTML without scripts)...', required: true },
        { name: 'keyword', label: 'Primary Keyword', type: 'text', placeholder: 'e.g., seo content checker' },
        { name: 'meta', label: 'Meta Description (optional)', type: 'textarea', placeholder: 'Enter meta description for quality checks' }
      ]
    },
    contentFreshnessChecker: {
      actionLabel: 'Analyze',
      fields: [
        { name: 'title', label: 'Title', type: 'text', placeholder: 'Enter page title' },
        { name: 'description', label: 'Main Content', type: 'textarea', placeholder: 'Paste content to analyze for freshness and SEO', required: true }
      ]
    },
    aiArticleLengthOptimizer: {
      actionLabel: 'Optimize',
      fields: [
        { name: 'topic', label: 'Article Topic', type: 'text', placeholder: 'e.g., keyword research for beginners', required: true },
        {
          name: 'intent', label: 'Search Intent', type: 'select', options: [
            { value: 'informational', label: 'Informational' },
            { value: 'commercial', label: 'Commercial' },
            { value: 'transactional', label: 'Transactional' },
            { value: 'navigational', label: 'Navigational' }
          ]
        },
        { name: 'competitorAvgWords', label: 'Competitor Average Word Count', type: 'number', placeholder: 'e.g., 1500' },
        { name: 'sectionCount', label: 'Planned Sections', type: 'number', placeholder: 'e.g., 8' },
        {
          name: 'audienceLevel', label: 'Audience Level', type: 'select', options: [
            { value: 'beginner', label: 'Beginner' },
            { value: 'intermediate', label: 'Intermediate' },
            { value: 'advanced', label: 'Advanced' }
          ]
        }
      ]
    },
    schemaMarkupGenerator: {
      actionLabel: 'Generate',
      fields: [
        { name: 'type', label: 'Schema Type', type: 'text', placeholder: 'Article, FAQPage, HowTo, LocalBusiness, SoftwareApplication' },
        { name: 'name', label: 'Name', type: 'text', placeholder: 'Entity name' },
        { name: 'pageUrl', label: 'Page URL', type: 'text', placeholder: 'https://example.com/page' },
        { name: 'url', label: 'URL', type: 'text', placeholder: 'https://example.com' },
        { name: 'desc', label: 'Description', type: 'textarea', placeholder: 'Short description' },
        { name: 'image', label: 'Image URL', type: 'text', placeholder: 'https://example.com/og-image.jpg' },
        { name: 'datePublished', label: 'Date Published', type: 'text', placeholder: 'YYYY-MM-DD' },
        { name: 'dateModified', label: 'Date Modified', type: 'text', placeholder: 'YYYY-MM-DD' },
        { name: 'authorName', label: 'Author/Organization', type: 'text', placeholder: '100 SEO Tools' },
        { name: 'faqLines', label: 'FAQ Q|A lines', type: 'textarea', placeholder: 'Question 1 | Answer 1\nQuestion 2 | Answer 2' }
      ]
    },




    aiContentDetector: {
      actionLabel: 'Analyze',
      fields: [
        { name: 'text', label: 'Text Content', type: 'textarea', placeholder: 'Paste the text you want to analyze for AI detection...', required: true }
      ]
    },

    textToHtmlConverter: {
      actionLabel: 'Convert',
      fields: [
        { name: 'text', label: 'Plain Text', type: 'textarea', placeholder: 'Paste plain text. Headings: #, ##. Lists: -, *. Numbered: 1. 2. URLs auto-link.', required: true }
      ]
    },
    aiCompetitorTitleRewriter: {
      actionLabel: 'Rewrite Title',
      fields: [
        { name: 'title', label: 'Original Title', type: 'text', placeholder: 'e.g. 10 Best SEO Tools', required: true }
      ]
    },
    aiContentImprover: {
      actionLabel: 'Improve Content',
      fields: [
        { name: 'content', label: 'Content', type: 'textarea', placeholder: 'Paste content to improve...', required: true }
      ]
    },
    canonicalTagChecker: {
      actionLabel: 'Check Canonical',
      fields: [
        { name: 'url', label: 'Page URL', type: 'url', placeholder: 'https://example.com', required: true }
      ]
    },
    competitorBacklinkIdeaGenerator: {
      actionLabel: 'Generate Ideas',
      fields: [
        { name: 'competitor_url', label: 'Competitor URL', type: 'url', placeholder: 'https://competitor.com' }
      ]
    },
    competitorGapAnalyzer: {
      actionLabel: 'Analyze Gap',
      fields: [
        { name: 'my_content', label: 'My Content', type: 'textarea', placeholder: 'Paste your content...' },
        { name: 'competitor_content', label: 'Competitor Content', type: 'textarea', placeholder: 'Paste competitor content...' }
      ]
    },
    ctrPredictor: {
      actionLabel: 'Predict CTR',
      fields: [
        { name: 'keyword', label: 'Keyword', type: 'text', placeholder: 'e.g. seo tools' },
        { name: 'position', label: 'Ranking Position (1-10)', type: 'number', placeholder: '3' }
      ]
    },
    domainAuthoritySimulator: {
      actionLabel: 'Simulate DA',
      fields: [
        { name: 'domain', label: 'Domain Name', type: 'text', placeholder: 'example.com' },
        { name: 'age', label: 'Domain Age (Years)', type: 'number', placeholder: '5' },
        { name: 'backlinks', label: 'Estimated Backlinks', type: 'number', placeholder: '500' }
      ]
    },
    featuredSnippetOptimizer: {
      actionLabel: 'Optimize Snippet',
      fields: [
        { name: 'keyword', label: 'Target Keyword', type: 'text', placeholder: 'e.g. how to boil eggs' },
        { name: 'content', label: 'Snippet Answer Text', type: 'textarea', placeholder: 'Paste your draft answer...' }
      ]
    },
    domainComparisonReportTool: {
      actionLabel: 'Compare Domains',
      fields: [
        { name: 'domain1', label: 'Domain 1', type: 'text', placeholder: 'google.com' },
        { name: 'domain2', label: 'Domain 2', type: 'text', placeholder: 'bing.com' }
      ]
    },
    gmbOptimizationHelper: {
      actionLabel: 'Analyze Profile',
      fields: [
        { name: 'business_name', label: 'Business Name', type: 'text', placeholder: 'My Local Bakery' },
        { name: 'category', label: 'Primary Category', type: 'text', placeholder: 'Bakery' },
        { name: 'description', label: 'Business Description', type: 'textarea', placeholder: 'Paste description...' }
      ]
    },
    geoKeywordExpansionTool: {
      actionLabel: 'Generate Geo Keywords',
      fields: [
        { name: 'service', label: 'Service', type: 'text', placeholder: 'e.g. plumbing' },
        { name: 'cities', label: 'Cities (comma separated)', type: 'textarea', placeholder: 'New York, Brooklyn, Queens' }
      ]
    },
    guestPostingOpportunityFinder: {
      actionLabel: 'Find Opportunities',
      fields: [
        { name: 'niche', label: 'Niche/Industry', type: 'text', placeholder: 'e.g. tech, fitness' }
      ]
    },
    headlineAnalyzer: {
      actionLabel: 'Analyze Headline',
      fields: [
        { name: 'headline', label: 'Headline', type: 'text', placeholder: 'Enter headline to check...' }
      ]
    },
    hreflangTagGenerator: {
      actionLabel: 'Generate Tags',
      fields: [
        { name: 'url', label: 'Default URL', type: 'url', placeholder: 'https://example.com' },
        { name: 'languages', label: 'Languages (e.g., en-us, fr-fr)', type: 'textarea', placeholder: 'en-us | https://example.com\nfr-fr | https://example.com/fr' }
      ]
    },
    impressionToClickRatioCalculator: {
      actionLabel: 'Calculate CTR',
      fields: [
        { name: 'impressions', label: 'Impressions', type: 'number', placeholder: '1000' },
        { name: 'clicks', label: 'Clicks', type: 'number', placeholder: '50' }
      ]
    },
    featuredToolSchemaGenerator: {
      actionLabel: 'Generate Featured Tool Schema',
      fields: [
        { name: 'toolName', label: 'Tool Name', type: 'text', placeholder: 'e.g., Backlink Maker', required: true },
        { name: 'pageTitle', label: 'Page Title', type: 'text', placeholder: 'e.g., Free Backlink Maker - 100 SEO Tools', required: true },
        { name: 'metaDescription', label: 'Meta Description', type: 'textarea', placeholder: 'e.g., Use our free tool to generate quality backlinks...', required: true },
        { name: 'pageUrl', label: 'Page URL', type: 'url', placeholder: `${getBaseUrl()}/tool-name` },
        { name: 'brandLogo', label: 'Brand Logo URL', type: 'url', placeholder: `${getBaseUrl()}/logo.png` },
        { name: 'authorName', label: 'Author Name', type: 'text', placeholder: '100 SEO Tools' },
        { name: 'publishDate', label: 'Publish Date', type: 'text', placeholder: 'YYYY-MM-DD' },
        { name: 'modifyDate', label: 'Modify Date', type: 'text', placeholder: 'YYYY-MM-DD' },
        { name: 'offerPrice', label: 'Offer Price', type: 'text', placeholder: '0' },
        { name: 'offerCurrency', label: 'Currency', type: 'text', placeholder: 'USD' },
        { name: 'availability', label: 'Availability', type: 'text', placeholder: 'https://schema.org/InStock' },
        { name: 'ctaText', label: 'CTA Text', type: 'text', placeholder: 'Use Tool For Free' },
        { name: 'breadcrumbItems', label: 'Breadcrumb Items (JSON Array)', type: 'textarea', placeholder: '[{"@type": "ListItem", "position": 1, "name": "Home", "item": "..."}]' }
      ]
    },
  };
  return defs[key] || { actionLabel: 'Run', fields: [{ name: 'input', label: 'Input', type: 'textarea', placeholder: 'Enter input...' }] };
}

