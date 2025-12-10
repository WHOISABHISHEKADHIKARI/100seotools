import { tokenize, countWords, stripHtmlToText } from './utils.js';

// Template definitions provide fields and an action label
export function getTemplateDefinition(key) {
  const defs = {
    anchorTextAnalyzer: {
      actionLabel: 'Analyze Anchors',
      fields: [
        { name: 'url', label: 'Page URL', type: 'url', placeholder: 'https://example.com' }
      ]
    },
    backlinkIdeaGenerator: {
      actionLabel: 'Generate Ideas',
      fields: [
        { name: 'keyword', label: 'Target Keyword / Niche', type: 'text', placeholder: 'e.g. vintage cars' }
      ]
    },
    linkRelevanceEvaluator: {
      actionLabel: 'Check Relevance',
      fields: [
        { name: 'linkUrl', label: 'Link Source URL', type: 'url', placeholder: 'https://source-site.com/article' },
        { name: 'targetKeyword', label: 'Target Keyword', type: 'text', placeholder: 'e.g. coffee beans' }
      ]
    },
    linkToxicityChecker: {
      actionLabel: 'Check Toxicity',
      fields: [
        { name: 'url', label: 'Link URL to Check', type: 'url', placeholder: 'https://suspicious-site.com' }
      ]
    },
    internalLinkSuggestionTool: {
      actionLabel: 'Suggest Internal Links',
      fields: [
        { name: 'content', label: 'Content (Paste Article Text)', type: 'textarea', placeholder: 'Paste your blog post content here...' }
      ]
    },
    httpStatusCodeTester: {
      actionLabel: 'Check Status',
      fields: [
        { name: 'url', label: 'URL', type: 'url', placeholder: 'https://example.com' }
      ]
    },
    redirectChecker: {
      actionLabel: 'Check Redirects',
      fields: [
        { name: 'url', label: 'URL', type: 'url', placeholder: 'https://example.com' }
      ]
    },
    sitemapGenerator: {
      actionLabel: 'Generate Sitemap',
      fields: [
        { name: 'url', label: 'Website URL', type: 'url', placeholder: 'https://example.com' }
      ]
    },
    brokenLinkFinder: {
      actionLabel: 'Find Broken Links',
      fields: [
        { name: 'url', label: 'Website URL', type: 'url', placeholder: 'https://example.com' }
      ]
    },
    aiArticleLengthOptimizer: {
      actionLabel: 'Calculate Ideal Length',
      fields: [
        { name: 'keyword', label: 'Main Keyword', type: 'text', placeholder: 'e.g. how to bake cake' },
        { name: 'type', label: 'Content Type', type: 'text', placeholder: 'e.g. blog post, product page' }
      ]
    },
    aiBlogIntroWriter: {
      actionLabel: 'Write Intro',
      fields: [
        { name: 'title', label: 'Blog Post Title', type: 'text', placeholder: 'e.g. 10 Best SEO Tools' },
        { name: 'keyword', label: 'Focus Keyword', type: 'text', placeholder: 'e.g. seo tools' }
      ]
    },
    aiContentDetector: {
      actionLabel: 'Analyze Content',
      fields: [
        { name: 'text', label: 'Content to Check', type: 'textarea', placeholder: 'Paste text here...' }
      ]
    },
    aiMetaTagWriter: {
      actionLabel: 'Generate Tags',
      fields: [
        { name: 'keyword', label: 'Focus Keyword', type: 'text', placeholder: 'e.g. digital marketing' },
        { name: 'desc', label: 'Short Description/Context (Optional)', type: 'textarea', placeholder: ' Brief summary...' }
      ]
    },
    aiSnippetGenerator: {
      actionLabel: 'Generate Snippet',
      fields: [
        { name: 'content', label: 'Content Source', type: 'textarea', placeholder: 'Paste content or url...' },
        { name: 'query', label: 'Target Query', type: 'text', placeholder: 'e.g. what is seo' }
      ]
    },
    metaDescriptionOptimizer: {
      actionLabel: 'Optimize',
      fields: [
        { name: 'desc', label: 'Meta Description', type: 'textarea', placeholder: 'Enter description...' },
        { name: 'keyword', label: 'Target Keyword', type: 'text', placeholder: 'e.g. best coffee' }
      ]
    },
    metaDescriptionWriter: {
      actionLabel: 'Write Description',
      fields: [
        { name: 'title', label: 'Page Title', type: 'text', placeholder: 'e.g. My Page' },
        { name: 'keyword', label: 'Target Keyword', type: 'text', placeholder: 'e.g. coffee' }
      ]
    },
    pageSpeedScoreSimulator: {
      actionLabel: 'Simulate Score',
      fields: [
        { name: 'url', label: 'Website URL', type: 'url', placeholder: 'https://example.com' }
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
        { name: 'url', label: 'Website URL', type: 'url', placeholder: 'https://example.com' }
      ]
    },
    structuredDataValidator: {
      actionLabel: 'Validate',
      fields: [
        { name: 'json', label: 'JSON-LD Snippet', type: 'textarea', placeholder: '<script type="application/ld+json">...</script>' }
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
        { name: 'keyword', label: 'Main Topic/Keyword', type: 'text', placeholder: 'e.g. digital marketing strategy' }
      ]
    },
    aiFaqCreator: {
      actionLabel: 'Generate FAQs',
      fields: [
        { name: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g. solar panels' }
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
    keywordShareEstimator: {
      actionLabel: 'Estimate Share',
      fields: [
        { name: 'volume', label: 'Search Volume', type: 'number', placeholder: '1000' },
        { name: 'difficulty', label: 'Keyword Difficulty', type: 'number', placeholder: '45' }
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
        { name: 'category', label: 'Business Category', type: 'text', placeholder: 'e.g. Restaurant' },
        { name: 'city', label: 'City', type: 'text', placeholder: 'e.g. London' }
      ]
    },
    localKeywordGenerator: {
      actionLabel: 'Generate Keywords',
      fields: [
        { name: 'service', label: 'Service/Product', type: 'text', placeholder: 'e.g. Pizza Delivery' },
        { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g. Brooklyn' }
      ]
    },
    localSchemaBuilder: {
      actionLabel: 'Build Schema',
      fields: [
        { name: 'name', label: 'Business Name', type: 'text', placeholder: 'Business Name' },
        { name: 'address', label: 'Street Address', type: 'text', placeholder: '123 Main St' },
        { name: 'city', label: 'City', type: 'text', placeholder: 'New York' },
        { name: 'zip', label: 'Zip Code', type: 'text', placeholder: '10001' }
      ]
    },
    localSeoAuditChecklist: {
      actionLabel: 'Generate Checklist',
      fields: [
        { name: 'business_name', label: 'Business Name', type: 'text', placeholder: 'Business Name' }
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
        { name: 'name', label: 'Business Name', type: 'text', placeholder: 'My Business' },
        { name: 'phone', label: 'Phone Number', type: 'text', placeholder: '555-0123' },
        { name: 'address', label: 'Address', type: 'text', placeholder: '123 Main St, City' }
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
        { name: 'url', label: 'Page URL', type: 'url', placeholder: 'https://example.com' }
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
        { name: 'competitor_url', label: 'Competitor Page URL', type: 'url', placeholder: 'https://competitor.com/page' }
      ]
    },
    rankingProgressTracker: {
      actionLabel: 'Track Progress',
      fields: [
        { name: 'current_rank', label: 'Current Rank', type: 'number', placeholder: '12' },
        { name: 'previous_rank', label: 'Previous Rank', type: 'number', placeholder: '15' }
      ]
    },
    readabilityEnhancer: {
      actionLabel: 'Enhance Readability',
      fields: [
        { name: 'text', label: 'Content', type: 'textarea', placeholder: 'Paste content to simplify...' }
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
        { name: 'rankings', label: 'Rankings (comma separated positions)', type: 'textarea', placeholder: '1, 5, 12, 3, 8' }
      ]
    },
    productDescriptionGenerator: {
      actionLabel: 'Generate Description',
      fields: [
        { name: 'product_name', label: 'Product Name', type: 'text', placeholder: 'SuperWidget 3000' },
        { name: 'features', label: 'Key Features', type: 'textarea', placeholder: '- Durable\n- Fast\n- Cheap' }
      ]
    },
    reviewResponseGenerator: {
      actionLabel: 'Generate Response',
      fields: [
        { name: 'customer_name', label: 'Customer Name', type: 'text', placeholder: 'Alex' },
        { name: 'rating', label: 'Rating (1-5)', type: 'number', placeholder: '5' },
        { name: 'comment', label: 'Customer Comment', type: 'textarea', placeholder: 'Great service!' }
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
        { name: 'title', label: 'Page Title', type: 'text', placeholder: 'e.g. My Awesome Page' }
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
        { name: 'context', label: 'Surrounding Text / Topic', type: 'text', placeholder: 'e.g. about page hero section' }
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

    seoContentChecker: {
      actionLabel: 'Analyze',
      fields: [
        { name: 'title', label: 'Title', type: 'text', placeholder: 'e.g., SEO Content Checker Guide' },
        { name: 'content', label: 'Content', type: 'textarea', placeholder: 'Paste your content (plain text or HTML without scripts)...' },
        { name: 'focus', label: 'Primary Keyword', type: 'text', placeholder: 'e.g., seo content checker' },
        { name: 'meta', label: 'Meta Description (optional)', type: 'textarea', placeholder: 'Enter meta description for quality checks' }
      ]
    },
    contentFreshnessChecker: {
      actionLabel: 'Analyze',
      fields: [
        { name: 'title', label: 'Title', type: 'text', placeholder: 'Enter page title' },
        { name: 'description', label: 'Main Content', type: 'textarea', placeholder: 'Paste content to analyze for freshness and SEO' }
      ]
    },
    aiArticleLengthOptimizer: {
      actionLabel: 'Optimize',
      fields: [
        { name: 'topic', label: 'Article Topic', type: 'text', placeholder: 'e.g., keyword research for beginners' },
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
        { name: 'text', label: 'Text Content', type: 'textarea', placeholder: 'Paste the text you want to analyze for AI detection...' }
      ]
    },

    textToHtmlConverter: {
      actionLabel: 'Convert',
      fields: [
        { name: 'text', label: 'Plain Text', type: 'textarea', placeholder: 'Paste plain text. Headings: #, ##. Lists: -, *. Numbered: 1. 2. URLs auto-link.' }
      ]
    },
    aiCompetitorTitleRewriter: {
      actionLabel: 'Rewrite Title',
      fields: [
        { name: 'title', label: 'Original Title', type: 'text', placeholder: 'e.g. 10 Best SEO Tools' }
      ]
    },
    aiContentImprover: {
      actionLabel: 'Improve Content',
      fields: [
        { name: 'content', label: 'Content', type: 'textarea', placeholder: 'Paste content to improve...' }
      ]
    },
    canonicalTagChecker: {
      actionLabel: 'Check Canonical',
      fields: [
        { name: 'url', label: 'Page URL', type: 'url', placeholder: 'https://example.com' }
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
      const suffixes = ['2026', 'tips', 'ideas', 'examples', 'tools', 'free', 'review', 'comparison'];
      const variants = [];
      prefixes.forEach((p) => variants.push(`${p} ${seed}`));
      suffixes.forEach((s) => variants.push(`${seed} ${s}`));
      return variants.join('\n');
    }
    case 'longTailKeywords': {
      const seed = (inputs.seed || '').trim();
      const mods = (inputs.modifiers || '').split(',').map((m) => m.trim()).filter(Boolean);
      if (!seed) return 'Enter a seed keyword.';
      const baseMods = mods.length ? mods : ['for beginners', 'step by step', 'without oven', 'at home', 'near me', 'in 2026'];
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
      const rawTitle = inputs.title || '';
      const rawDesc = inputs.description || '';
      const rawUrl = inputs.url || '';

      const safeText = (s) => stripHtmlToText(String(s || '')).trim();
      const escapeAttr = (s) => (s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\u0000/g, '');

      const title = safeText(rawTitle);
      const description = safeText(rawDesc);
      const url = safeText(rawUrl);

      const isAbsUrl = /^https?:\/\//i.test(url);
      const canonical = isAbsUrl ? url : '';

      const titleLen = title.length;
      const descLen = description.length;
      const titleStatus = titleLen ? (titleLen >= 50 && titleLen <= 60 ? 'Good' : 'Adjust to 50–60 chars') : 'Missing';
      const descStatus = descLen ? (descLen >= 120 && descLen <= 160 ? 'Good' : 'Adjust to 120–160 chars') : 'Missing';

      const lines = [];
      lines.push('<!-- Meta Tag Generator: sanitized output (no HTML fragments) -->');
      lines.push(`<!-- Title length: ${titleLen} (${titleStatus}) -->`);
      lines.push(`<!-- Meta description length: ${descLen} (${descStatus}) -->`);
      lines.push(`<title>${escapeAttr(title)}</title>`);
      lines.push(`<meta name="description" content="${escapeAttr(description)}" />`);
      if (canonical) lines.push(`<link rel="canonical" href="${escapeAttr(canonical)}" />`);

      // Open Graph & Twitter derived safely
      lines.push(`<meta property="og:title" content="${escapeAttr(title)}" />`);
      lines.push(`<meta property="og:description" content="${escapeAttr(description)}" />`);
      if (canonical) lines.push(`<meta property="og:url" content="${escapeAttr(canonical)}" />`);
      lines.push(`<meta property="og:type" content="website" />`);
      lines.push(`<meta name="twitter:card" content="summary_large_image" />`);
      lines.push(`<meta name="twitter:title" content="${escapeAttr(title)}" />`);
      lines.push(`<meta name="twitter:description" content="${escapeAttr(description)}" />`);

      // Minimal JSON-LD WebPage + potential Article
      if (title || description || canonical) {
        const jsonld = {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          ...(canonical ? { url: canonical } : {}),
          ...(title ? { name: title } : {}),
          ...(description ? { description } : {})
        };
        lines.push('<script type="application/ld+json">');
        lines.push(JSON.stringify(jsonld));
        lines.push('</script>');
      }

      return lines.join('\n');
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
    case 'textToHtmlConverter': {
      const raw = String(inputs.text || '');
      const src = stripHtmlToText(raw);
      if (!src.trim()) return '<p></p>';
      const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const linkify = (s) => s.replace(/https?:\/\/[^\s)]+/g, (m) => {
        const href = m.replace(/"/g, '');
        return `<a href="${href}" rel="noopener">${escape(m)}</a>`;
      });
      const lines = src.split(/\r?\n/);
      const out = [];
      let i = 0;
      while (i < lines.length) {
        const line = lines[i].trimEnd();
        if (!line.trim()) { i++; continue; }
        const h = line.match(/^(#{1,6})\s+(.*)$/);
        if (h) {
          const level = h[1].length;
          const text = linkify(escape(h[2].trim()));
          out.push(`<h${level}>${text}</h${level}>`);
          i++; continue;
        }
        if (/^[-*]\s+/.test(line)) {
          const items = [];
          while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
            const li = lines[i].replace(/^[-*]\s+/, '');
            items.push(`<li>${linkify(escape(li))}</li>`);
            i++;
          }
          out.push(`<ul>${items.join('')}</ul>`);
          continue;
        }
        if (/^\d+[.)]\s+/.test(line)) {
          const items = [];
          while (i < lines.length && /^\d+[.)]\s+/.test(lines[i])) {
            const li = lines[i].replace(/^\d+[.)]\s+/, '');
            items.push(`<li>${linkify(escape(li))}</li>`);
            i++;
          }
          out.push(`<ol>${items.join('')}</ol>`);
          continue;
        }
        const para = [];
        while (i < lines.length && lines[i].trim()) {
          para.push(lines[i]);
          i++;
        }
        const joined = para.map((s) => linkify(escape(s))).join('<br />');
        out.push(`<p>${joined}</p>`);
      }
      return out.join('\n');
    }
    case 'titleMetaLengthCounter': {
      const title = inputs.title || '';
      const desc = inputs.description || '';
      return `Title: ${title.length} chars (50–60 recommended)\nMeta Description: ${desc.length} chars (120–160 recommended)`;
    }
    case 'seoContentChecker': {
      const safe = (s) => stripHtmlToText(String(s || '')).trim();
      const title = safe(inputs.title || '');
      const content = safe(inputs.content || '');
      const focus = safe(inputs.focus || '').toLowerCase();
      const meta = safe(inputs.meta || '');
      if (!content && !title) return 'Provide title and/or content to analyze.';

      const words = tokenize(content);
      const totalWords = words.length;
      const sentences = (content.match(/[.!?]+/g) || []).length || Math.max(1, Math.ceil(totalWords / 15));
      const syllables = (content.toLowerCase().match(/[aeiouy]{1,2}/g) || []).length;
      const flesch = 206.835 - 1.015 * (totalWords / sentences) - 84.6 * (syllables / (totalWords || 1));
      const readability = Math.max(0, Math.min(100, Math.round(flesch)));

      const focusFreq = focus ? words.filter((w) => w === focus).length : 0;
      const density = totalWords ? ((focusFreq / totalWords) * 100).toFixed(2) : '0.00';
      const densityNum = Number(density);
      const densityStatus = densityNum === 0 ? 'Missing' : densityNum < 0.5 ? 'Very Low' : densityNum <= 2.5 ? 'Good' : densityNum <= 4.0 ? 'High' : 'Very High';

      const titleLen = title.length;
      const titleLenStatus = titleLen ? (titleLen >= 50 && titleLen <= 60 ? 'Good' : titleLen >= 35 && titleLen <= 70 ? 'Okay' : 'Adjust') : 'Missing';
      const titleHasFocus = focus && title.toLowerCase().includes(focus);

      const first100 = content.slice(0, 600).toLowerCase();
      const placedEarly = focus && first100.includes(focus);
      const metaLen = meta.length;
      const metaStatus = metaLen ? (metaLen >= 120 && metaLen <= 160 ? 'Good' : metaLen < 120 ? 'Too Short' : 'Too Long') : 'Missing';

      const lengthStatus = totalWords >= 1200 ? 'Strong depth' : totalWords >= 800 ? 'Good depth' : totalWords >= 600 ? 'Okay depth' : 'Thin';

      let score = 0;
      score += titleLenStatus === 'Good' ? 18 : titleLenStatus === 'Okay' ? 12 : titleLen ? 6 : 0;
      score += titleHasFocus ? 8 : 0;
      score += metaStatus === 'Good' ? 12 : metaLen ? 6 : 0;
      score += densityStatus === 'Good' ? 16 : densityStatus === 'Okay' ? 10 : densityStatus === 'Very Low' ? 4 : densityStatus === 'High' ? 6 : 2;
      score += placedEarly ? 10 : 4;
      score += lengthStatus === 'Strong depth' ? 16 : lengthStatus === 'Good depth' ? 12 : lengthStatus === 'Okay depth' ? 8 : 4;
      score += Math.round(Math.min(30, (readability / 100) * 30));
      score = Math.max(0, Math.min(100, score));

      const problems = [];
      const fixes = [];
      if (!title) { problems.push('Missing title.'); fixes.push('Add a clear, descriptive title with the primary keyword.'); }
      if (titleLenStatus === 'Adjust') { problems.push('Title length not ideal.'); fixes.push('Aim for ≈50–60 characters balancing keyword and value.'); }
      if (!titleHasFocus && focus) { problems.push('Keyword missing in title.'); fixes.push('Include the primary keyword naturally in the title.'); }
      if (!meta) { problems.push('Missing meta description.'); fixes.push('Add a compelling meta description ≈120–160 characters.'); }
      if (metaStatus === 'Too Short') { problems.push('Meta description too short.'); fixes.push('Expand meta description to include benefit and context.'); }
      if (metaStatus === 'Too Long') { problems.push('Meta description too long.'); fixes.push('Tighten meta description to avoid truncation.'); }
      if (densityStatus === 'Very Low') { problems.push('Keyword density very low.'); fixes.push('Use the keyword and variants naturally across sections.'); }
      if (densityStatus === 'High' || densityStatus === 'Very High') { problems.push('Keyword density high.'); fixes.push('Reduce repetition; prefer synonyms and natural phrasing.'); }
      if (!placedEarly && focus) { problems.push('Keyword not placed early.'); fixes.push('Mention the keyword in the opening paragraph or first 100–150 words.'); }
      if (readability < 55) { problems.push('Low readability.'); fixes.push('Shorten sentences, use active voice, and add bullets.'); }
      if (totalWords < 800) { problems.push('Content may be thin.'); fixes.push('Increase depth with examples, FAQs, and internal links (800–1200 words).'); }

      const examples = [
        'Optimized Title: SEO Content Checker – Analyze Density, Readability, and Placement',
        'Poor Title: Best Content | Click Here | #1 SEO Checker 2026',
        'Optimized Meta: Check content score, keyword density, readability, and placement. Get clear fixes to optimize titles, headings, and meta for better SEO.',
        'Poor Meta: Amazing SEO content!!! Free!!! Best!!! (vague; promotional; no value)'
      ];

      const lines = [];
      lines.push('SEO Content Checker – Results');
      lines.push(`Content Score: ${score}/100`);
      lines.push('Breakdown:');
      lines.push(`- Title: ${titleLenStatus}${titleHasFocus ? ' (keyword present)' : ''}`);
      lines.push(`- Meta: ${metaStatus}`);
      lines.push(`- Keyword density: ${density}% (${densityStatus})`);
      lines.push(`- Early placement: ${placedEarly ? 'Yes' : 'No'}`);
      lines.push(`- Readability (Flesch): ${readability}/100`);
      lines.push(`- Length: ${totalWords} words (${lengthStatus})`);
      if (problems.length) {
        lines.push('Problems:');
        problems.forEach((p) => lines.push(`- ${p}`));
      }
      if (fixes.length) {
        lines.push('Fixes:');
        fixes.forEach((f) => lines.push(`- ${f}`));
      }
      lines.push('Examples:');
      examples.forEach((e) => lines.push(`- ${e}`));

      return lines.join('\n');
    }
    case 'contentFreshnessChecker': {
      const nowYear = 2026;
      const titleRaw = inputs.title || '';
      const contentRaw = inputs.description || '';
      const title = stripHtmlToText(titleRaw);
      const content = stripHtmlToText(contentRaw);
      if (!content.trim() && !title.trim()) return 'Provide input and run.';

      const words = tokenize(content);
      const wordCount = words.length;
      const sentences = (content.match(/[.!?]+/g) || []).length || Math.max(1, Math.ceil(wordCount / 15));
      const syllables = (content.toLowerCase().match(/[aeiouy]{1,2}/g) || []).length;
      const flesch = 206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllables / (wordCount || 1));
      const readability = Math.max(0, Math.min(100, Math.round(flesch)));

      const yearMatches = [...content.matchAll(/\b(20\d{2})\b/g)].map(m => Number(m[1]));
      const hasOldYears = yearMatches.some(y => y >= 2010 && y <= 2022);
      const hasRecentYears = yearMatches.some(y => y >= 2024 && y <= nowYear);
      const recencyScore = hasRecentYears ? 20 : 0;
      const stalenessPenalty = hasOldYears ? 20 : 0;

      const outdatedSignals = [
        /\bmeta\s*keywords\b/i,
        /\bkeyword\s*stuffing\b/i,
        /\bAMP\b/i,
        /\bGoogle\s*Authorship\b/i,
        /\bPagerank\b/i,
        /\breciprocal\s*links\b/i,
        /\bguest\s*blogging\b.*(link|backlink)/i,
        /\bexact\s*match\s*domain\b/i,
        /\bdisavow\b.*(every|all)/i
      ];
      const outdatedHits = outdatedSignals.filter(rx => rx.test(content)).length;
      const outdatedPenalty = Math.min(30, outdatedHits * 8);

      const statsSignals = /\b(\d{4})\b.*(report|study|survey|dataset|benchmark)/i.test(content) || /\bdata\b/i.test(content);
      const statsBonus = statsSignals ? 15 : 0;

      const freshnessBase = 60 + recencyScore + statsBonus - stalenessPenalty - outdatedPenalty;
      const freshnessScore = Math.max(0, Math.min(100, Math.round(freshnessBase)));

      const titleLen = (title || '').length;
      const metaDescApprox = Math.min(160, Math.max(0, (content.match(/.{1,160}/) || [''])[0].length));
      const titleLenScore = titleLen ? (titleLen >= 50 && titleLen <= 60 ? 20 : titleLen >= 35 && titleLen <= 70 ? 15 : 8) : 5;
      const metaLenScore = metaDescApprox >= 120 && metaDescApprox <= 160 ? 20 : 12;
      const wcScore = wordCount >= 600 ? 20 : wordCount >= 300 ? 12 : 6;
      const readabilityScore = Math.round(Math.min(30, (readability / 100) * 30));
      const passiveHits = (content.match(/\b(was|were|be|been|being|is|are|am)\b/gi) || []).length;
      const passivePenalty = Math.min(10, Math.round(passiveHits / Math.max(1, sentences)));
      const seoScore = Math.max(0, Math.min(100, titleLenScore + metaLenScore + wcScore + readabilityScore - passivePenalty));

      const problems = [];
      if (hasOldYears) problems.push('Outdated year references detected (2010–2022).');
      if (outdatedHits) problems.push('Old techniques mentioned (e.g., AMP, meta keywords, PageRank).');
      if (wordCount < 600) problems.push('Content may be thin; increase depth to 800–1200 words.');
      if (readability < 55) problems.push('Low readability; shorten sentences and simplify wording.');
      if (passivePenalty >= 8) problems.push('Heavy passive voice; prefer active constructions.');
      if (!hasRecentYears) problems.push('Missing recent year references (2024–2026).');

      const fixes = [
        'Update statistics and examples to 2024–2026 sources.',
        'Remove mentions of meta keywords, AMP, Authorship, and PageRank.',
        'Add clear H2/H3 sections with scannable steps and bullets.',
        'Increase word count with actionable guidance and internal links.',
        'Rewrite sentences to use active voice and clarify intent.',
        'Add “Last updated” date and ensure canonical signals are present.'
      ];

      const improvedTitle = title || 'Content Freshness Checker: Keep Pages Up‑to‑Date in 2026';
      const improvedMeta = 'Evaluate and update on‑page content for 2026. Identify outdated references, improve readability, and optimize SEO signals for better rankings and engagement.';
      const improvedContent = [
        'Use this checklist to keep your content fresh and relevant in 2026.',
        'Focus on recent data, clear structure, and concise language.',
        'Replace outdated techniques with current best practices (E‑E‑A‑T, internal linking, performant pages).'
      ].join('\n');

      const urlMatch = (content.match(/https:\/\/[^\s)]+/i) || [])[0];
      let jsonld = '';
      if (urlMatch) {
        const payload = {
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'WebPage', '@id': urlMatch, url: urlMatch, name: improvedTitle },
            { '@type': 'Article', headline: improvedTitle, description: improvedMeta, isPartOf: { '@id': urlMatch } }
          ]
        };
        jsonld = JSON.stringify(payload, null, 2);
      }

      return [
        `Freshness Score (0–100): ${freshnessScore}`,
        `SEO Score (0–100): ${seoScore}`,
        'Problems Found:',
        problems.length ? problems.map(p => `- ${p}`).join('\n') : '- None detected',
        'Recommended Fixes:',
        fixes.map(f => `- ${f}`).join('\n'),
        'Improved Title:',
        improvedTitle,
        'Improved Meta Description:',
        improvedMeta,
        'Improved Main Content (ESL-friendly, updated, plagiarism-free):',
        improvedContent,
        'Updated Schema.org JSON-LD (if needed):',
        jsonld || 'N/A'
      ].join('\n');
    }
    case 'aiArticleLengthOptimizer': {
      const start = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const topicRaw = (inputs.topic || '').trim();
      const intent = inputs.intent || 'informational';
      const competitorAvg = Number(inputs.competitorAvgWords || 0) || 0;
      const sectionCount = Math.max(1, Number(inputs.sectionCount || 0) || 8);
      const audience = inputs.audienceLevel || 'beginner';

      if (!topicRaw) return 'Enter an article topic to optimize length.';

      // Content type detection (blog/news/social) from topic hints
      const contentType = /news|breaking|press\s?release/i.test(topicRaw)
        ? 'news-article'
        : /thread|tweet|social|instagram|facebook|linkedin/i.test(topicRaw)
          ? 'social-media-post'
          : 'blog-post';

      // Extract optional embedded content if user pasted full text after a delimiter
      const contentDelimiter = /\n-{3,}\n/; // user can separate topic and content with ---
      const [topic, contentMaybe] = topicRaw.split(contentDelimiter);
      const content = (contentMaybe || '').trim();

      // Baseline by intent & content type
      const intentBaseline = {
        informational: 1400,
        commercial: 1800,
        transactional: 900,
        navigational: 600,
      }[intent] || 1400;

      const typeAdj = {
        'blog-post': 1.0,
        'news-article': 0.85,
        'social-media-post': 0.5,
      }[contentType] || 1.0;

      // Audience adjustment
      const audienceAdj = {
        beginner: 1.15,
        intermediate: 1.0,
        advanced: 0.9,
      }[audience] || 1.0;

      // Competitor influence (weighted 40%)
      const compWeighted = competitorAvg ? Math.round(0.4 * competitorAvg + 0.6 * intentBaseline) : intentBaseline;

      // Section heuristic: ~150–250 words per section, tune by content type
      const perSectionBase = 180;
      const perSection = Math.round(perSectionBase * typeAdj);
      const sectionWords = sectionCount * perSection;

      // Aggregate and adjust
      let recommended = Math.round((compWeighted + sectionWords) * audienceAdj * typeAdj);
      // Clamp reasonable bounds
      recommended = Math.max(300, Math.min(5000, recommended));

      // Readability and density from provided content (if any)
      const text = content || topic;
      const words = countWords(text);
      const sentences = (text.match(/[.!?]+/g) || []).length || Math.ceil(words / 15);
      const syllables = (text.toLowerCase().match(/[aeiouy]{1,2}/g) || []).length;
      const flesch = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / (words || 1));
      const readability = Math.max(0, Math.min(100, Math.round(flesch)));
      const paragraphs = (text.split(/\n{2,}/).filter(Boolean).length) || 1;
      const density = paragraphs ? Math.round(words / paragraphs) : words;

      // Confidence interval for word target (assume variance from section variability)
      const sectionVar = Math.pow(perSection * 0.3, 2); // variability estimate
      const totalVar = sectionCount * sectionVar + Math.pow(competitorAvg * 0.15, 2);
      const sigma = Math.sqrt(Math.max(1, totalVar));
      const ci95 = [Math.max(200, Math.round(recommended - 1.96 * sigma)), Math.round(recommended + 1.96 * sigma)];

      // Information retention vs length (diminishing returns curve)
      const k = 1 / (contentType === 'social-media-post' ? 600 : 2000);
      const retention = (L) => 1 - Math.exp(-k * L);
      const retentionRec = Math.round(retention(recommended) * 100);
      const retentionShort = Math.round(retention(Math.max(300, recommended * 0.7)) * 100);

      // Text segmentation
      const sentencesArr = (text.match(/[^.!?]+[.!?]+/g) || (text ? [text] : [])).map((s) => s.trim());
      const segments = sentencesArr.map((s, i) => ({ i, s, len: countWords(s) }));

      // Semantic prioritization: simple TF with heading boost
      const tokens = tokenize(text);
      const freqMap = new Map();
      tokens.forEach((t) => {
        const prev = freqMap.get(t) || 0;
        freqMap.set(t, prev + 1);
      });
      const topTerms = [...freqMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15).map(([t, n]) => `${t}(${n})`);

      // Redundancy detection: repeated bigrams
      const bigrams = [];
      for (let i = 0; i < tokens.length - 1; i++) bigrams.push(tokens[i] + ' ' + tokens[i + 1]);
      const bigramCounts = new Map();
      bigrams.forEach((bg) => bigramCounts.set(bg, (bigramCounts.get(bg) || 0) + 1));
      const redundant = [...bigramCounts.entries()].filter(([, c]) => c >= 3).slice(0, 10).map(([bg, c]) => `${bg} ×${c}`);

      // Abbreviation expansion suggestions
      const abbrevMap = {
        'seo': 'Search Engine Optimization',
        'cta': 'Call to Action',
        'ctr': 'Click-Through Rate',
        'roi': 'Return on Investment',
        'kpi': 'Key Performance Indicator'
      };
      const foundAbbrevs = Object.keys(abbrevMap).filter((k) => new RegExp(`\\b${k}\\b`, 'i').test(text));
      const expansions = foundAbbrevs.map((k) => `${k.toUpperCase()} → ${abbrevMap[k]}`);

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
        'Use subheadings every 150–250 words and keep paragraphs short.',
        'Front-load key information for skimmers and add a TL;DR.',
        'Link internally to supporting guides and tools to improve depth.',
        'Favor concrete examples over generic statements to boost retention.',
      ];

      const end = (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const procMs = Math.max(0, Math.round(end - start));
      const compressionRatio = words ? (recommended / words).toFixed(2) : 'n/a';

      // Batch support: if multiple topics separated by newlines, produce targets list
      const batch = topic.split(/\n+/).map((t) => t.trim()).filter(Boolean);
      let batchSection = '';
      if (batch.length > 1) {
        const perTopicTargets = batch.map((t) => {
          const base = Math.round((compWeighted + sectionWords) * audienceAdj * typeAdj);
          const clamped = Math.max(300, Math.min(5000, base));
          return `- ${t}: ${clamped} words`;
        });
        batchSection = ['\nBatch Targets:', ...perTopicTargets, ''].join('\n');
      }

      return [
        `Topic: ${topic}`,
        `Content Type: ${contentType}`,
        `Intent: ${intent}`,
        `Audience: ${audience}`,
        competitorAvg ? `Competitor Avg: ${competitorAvg} words` : 'Competitor Avg: n/a',
        `Planned Sections: ${sectionCount}`,
        '',
        `Recommended Length: ${recommended} words (95% CI: ${ci95[0]}–${ci95[1]})`,
        `Readability (Flesch): ${readability}/100`,
        `Text Density: ~${density} words/paragraph`,
        `Retention @recommended: ${retentionRec}% | @short: ${retentionShort}%`,
        `Compression Ratio (target/original): ${compressionRatio}`,
        `Processing Time: ${procMs} ms`,
        '',
        (topTerms.length ? 'Top Terms: ' + topTerms.join(', ') : ''),
        (redundant.length ? 'Redundant bigrams: ' + redundant.join(', ') : ''),
        (expansions.length ? 'Abbreviation expansions: ' + expansions.join('; ') : ''),
        '',
        'Suggested Outline:',
        ...outline.map((o, i) => `${i + 1}. ${o}`),
        '',
        'Optimization Tips:',
        ...tips.map((t) => `- ${t}`),
        batchSection,
      ].filter(Boolean).join('\n');
    }
    case 'schemaMarkupGenerator': {
      const base = 'https://schema.org';
      const allowed = new Set(['Article', 'FAQPage', 'HowTo', 'LocalBusiness', 'SoftwareApplication']);
      const typeRaw = stripHtmlToText(inputs.type || '').trim();
      const typeCap = typeRaw.replace(/\s+/g, '');
      const type = allowed.has(typeCap) ? typeCap : null;
      if (!type) return 'Invalid Schema Type. Please choose a valid Schema.org type.';
      const name = stripHtmlToText(inputs.name || '').trim();
      const pageUrl = stripHtmlToText(inputs.pageUrl || '').trim();
      const url = stripHtmlToText(inputs.url || '').trim();
      const desc = stripHtmlToText(inputs.desc || '').trim();
      const image = stripHtmlToText(inputs.image || '').trim();
      const dp = stripHtmlToText(inputs.datePublished || '').trim();
      const dm = stripHtmlToText(inputs.dateModified || '').trim() || dp;
      const author = stripHtmlToText(inputs.authorName || '').trim() || '100 SEO Tools';
      const isHttps = (s) => /^https:\/\//i.test(s);
      const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s);
      const faqText = stripHtmlToText(inputs.faqLines || '');
      const faqLines = faqText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      const faqValid = faqLines.every((l) => /^\s*Q:\s.+\|\s*A:\s.+/.test(l));
      if (!name || !pageUrl || !url || !desc || !isHttps(pageUrl) || !isHttps(url)) return 'Input contains errors. Please fix the highlighted fields.';
      if (image && !isHttps(image)) return 'Input contains errors. Please fix the highlighted fields.';
      if (dp && !isDate(dp)) return 'Input contains errors. Please fix the highlighted fields.';
      if (dm && !isDate(dm)) return 'Input contains errors. Please fix the highlighted fields.';
      if (faqLines.length && !faqValid) return 'Input contains errors. Please fix the highlighted fields.';
      const faqEntities = faqLines.map((l) => {
        const parts = l.split('|');
        const q = parts[0].replace(/^\s*Q:\s*/, '').trim();
        const a = (parts[1] || '').replace(/^\s*A:\s*/, '').trim();
        return { '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } };
      });
      let node;
      if (type === 'Article') {
        node = { '@context': base, '@type': 'Article', headline: name, description: desc, url: pageUrl, image: image || undefined, datePublished: dp || undefined, dateModified: dm || undefined, author: { '@type': 'Organization', name: author }, isPartOf: { '@id': pageUrl } };
      } else if (type === 'FAQPage') {
        node = { '@context': base, '@type': 'FAQPage', mainEntity: faqEntities, isPartOf: { '@id': pageUrl } };
      } else if (type === 'HowTo') {
        node = { '@context': base, '@type': 'HowTo', name, description: desc, image: image || undefined, isPartOf: { '@id': pageUrl } };
      } else if (type === 'LocalBusiness') {
        node = { '@context': base, '@type': 'LocalBusiness', name, description: desc, url: pageUrl, image: image || undefined, isPartOf: { '@id': pageUrl } };
      } else if (type === 'SoftwareApplication') {
        node = { '@context': base, '@type': 'SoftwareApplication', name, description: desc, url: pageUrl, applicationCategory: 'SEO Tool', operatingSystem: 'Web Browser', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' }, isPartOf: { '@id': pageUrl } };
      }
      const graph = [node];
      graph.unshift({ '@type': 'WebPage', '@id': pageUrl, url: pageUrl, name });
      const payload = { '@context': base, '@graph': graph };
      return JSON.stringify(payload, null, 2);
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
