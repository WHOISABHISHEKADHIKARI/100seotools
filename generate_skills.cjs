const fs = require('fs');
const path = require('path');

const toolsDir = './tools';
const skillDir = './public/skill';
const toolFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.js'));

// Descriptions extracted from original tool source code - mapped by slug
const originalDescriptions = {
  "ai-article-length-optimizer": "Optimize article length for SEO and reader engagement. Find the ideal word count and structure to improve dwell time and search rankings.",
  "ai-blog-intro-writer": "Generate engaging and SEO-optimized blog post introductions in seconds. Capture your readers' attention from the first sentence and improve your content's dwell time.",
  "ai-content-detector": "Detect AI-generated content and measure originality. Identify whether content was written by AI or humans to ensure authenticity and avoid plagiarism issues.",
  "ai-content-improver": "Improve AI-generated content quality and relevance. Enhance flow, readability, and engagement while maintaining the original meaning and intent.",
  "ai-content-outline-generator": "Generate content outlines with proper heading structure (H1-H6). Create SEO-friendly frameworks with logical flow and keyword placement.",
  "ai-faq-creator": "Create FAQ sections from questions and topics. Generate commonly asked questions and answers based on your topic or content.",
  "ai-keyword-explainer": "Explain keywords with context, search intent, and related terms. Provide comprehensive keyword analysis including difficulty, volume, and semantic relevance.",
  "ai-meta-tag-writer": "Generate high-CTR meta titles and descriptions using AI. Enter your topic or URL, and the AI will craft perfectly optimized tags to improve search visibility.",
  "ai-snippet-generator": "Generate featured snippet opportunities and formatting. Create content structured to appear in Google's position zero search results.",
  "ai-schema-generator": "Create schema markup (JSON-LD) for rich results. Build structured data markup for Articles, Products, Local Business, Recipes, and more.",
  "ai-competitor-title-rewriter": "Rewrite competitor titles for better CTR and relevance. Analyze competing titles and create more clickable, optimized alternatives.",
  "anchor-text-analyzer": "Analyze anchor text distribution and diversity. Evaluate linking patterns and ensure natural, varied anchor text for SEO best practices.",
  "backlink-idea-generator": "Generate backlink opportunities based on content and niche. Find relevant websites, directories, and platforms for link building.",
  "backlink-tracking-template-generator": "Generate backlink tracking templates and spreadsheets. Create organized templates to monitor acquired backlinks and their performance.",
  "blog-title-generator": "Generate blog titles with swipe formulas and power words. Create catchy, clickable titles that attract readers and rank well in search.",
  "bounce-rate-estimator": "Estimate bounce rates and identify retention issues. Analyze factors that cause visitors to leave and suggest improvements.",
  "broken-link-finder": "Find broken links internally and externally. Identify 404 errors and broken resources that harm SEO and user experience.",
  "canonical-tag-checker": "Check canonical tags to prevent content dilution. Verify that canonical tags are correctly implemented across pages.",
  "canonical-url-builder": "Build canonical URLs for duplicate content consolidation. Create preferred URLs to prevent search engine confusion.",
  "competitor-backlink-idea-generator": "Generate backlink ideas from competitor analysis. Identify linking opportunities based on competitor backlink profiles.",
  "competitor-gap-analyzer": "Identify content gaps versus competitor domains. Find topics competitors are missing that you can target.",
  "competitor-keyword-overlap-checker": "Check keyword overlap with competitor targeting. Visualize shared keywords and unique ranking opportunities.",
  "competitor-summary-report-creator": "Create summary reports comparing multiple competitors. Generate side-by-side comparisons of SEO metrics and performance.",
  "ctr-predictor": "Predict click-through rates for search results. Estimate CTR based on position, title, and description factors.",
  "domain-authority-simulator": "Simulate domain authority scores and factors. Analyze what contributes to domain strength and ranking potential.",
  "domain-comparison-report-tool": "Compare domains side-by-side on key SEO metrics. Perform comparative analysis of multiple domains simultaneously.",
  "duplicate-content-checker": "Detect duplicate content across pages and domains. Identify similar or identical content that may cause ranking issues.",
  "faq-generator": "Create FAQ content from common customer questions. Generate answers to frequently asked questions in your industry or niche.",
  "featured-snippet-optimizer": "Optimize content for featured snippets (position zero). Structure content to answer questions concisely for Google snippets.",
  "featured-tool-schema-generator": "Generate featured tool schema markup. Create structured data for tool/software applications to enable rich results.",
  "geo-keyword-expansion-tool": "Expand keywords with geo-modifiers and location targeting. Generate location-specific keywords for local and regional SEO.",
  "gmb-optimization-helper": "Optimize Google My Business profiles. Improve GMB signals and visibility in local map pack results.",
  "guest-posting-opportunity-finder": "Find guest posting opportunities and domains. Identify websites accepting guest posts in your niche or industry.",
  "heading-analyzer": "Analyze heading structure (H1-H6) and hierarchy. Verify proper heading order and semantic structure for SEO.",
  "headline-analyzer": "Analyze headline effectiveness and click-through potential. Score headlines based on length, words, and emotional impact.",
  "hreflang-tag-generator": "Generate hreflang tags for international targeting. Create proper language and region tags for multi-language sites.",
  "http-status-code-tester": "Test HTTP status codes (200, 301, 302, 404, 500). Verify correct redirection and server responses.",
  "image-alt-tag-generator": "Generate alt tags for images. Create descriptive, keyword-rich alternative text for accessibility and SEO.",
  "impression-to-click-ratio-calculator": "Calculate impression-to-click ratio. Measure how often impressions convert to clicks for your listings.",
  "internal-link-suggestion-tool": "Suggest internal linking opportunities. Recommend relevant pages to link to within your website structure.",
  "internal-linking-planner": "Plan internal linking structure and hierarchy. Create strategic internal link networks for link equity distribution.",
  "keyword-clustering-tool": "Cluster keywords by semantic relevance and search intent. Group related keywords to create topic-focused content.",
  "keyword-comparison-tool": "Compare keyword performance across domains. Analyze relative performance and identify winning terms.",
  "keyword-density-checker": "Check keyword density and optimize content. Ensure optimal keyword usage without stuffing or under-optimization.",
  "keyword-difficulty-estimator": "Estimate keyword difficulty and ranking potential. Predict how hard it will to rank for specific terms.",
  "keyword-expansion-tool": "Expand keyword lists with related terms and questions. Generate long-tail variations and semantic expansions.",
  "keyword-gap-finder": "Find keyword gaps between competitors. Identify keywords competitors rank for that you don't.",
  "keyword-intent-identifier": "Identify keyword search intent (informational, navigational, transactional, commercial). Categorize keywords by user intent.",
  "keyword-placement-highlighter": "Highlight keyword placement opportunities in content. Suggest where to naturally insert keywords for SEO optimization.",
  "keyword-roi-calculator": "Calculate keyword ROI and conversion potential. Estimate the return on investment for targeting specific keywords.",
  "keyword-share-estimator": "Estimate keyword share of voice in SERPs. Calculate your visibility percentage for target keywords.",
  "keyword-suggestion-tool": "Find free keyword suggestions from a seed term. Generate search term ideas with long-tail and question-based variations.",
  "link-relevance-evaluator": "Evaluate link relevance between linking and target domains. Assess whether a link is contextually relevant for SEO.",
  "link-source-categorizer": "Categorize link sources (editorial, directory, social, etc.). Classify the type and origin of backlinks.",
  "link-toxicity-checker": "Check link toxicity and spam risk scores. Identify potentially harmful links that could trigger search penalties.",
  "local-citation-finder": "Find local citation opportunities and directories. Discover platforms where you can list your business NAP.",
  "local-keyword-generator": "Generate local keywords with geo-modifiers. Create location-specific keywords for local SEO targeting.",
  "local-schema-builder": "Build local business schema markup. Create structured data for local businesses with address, hours, and reviews.",
  "local-seo-audit-checklist": "Audit local SEO setup and configuration. Check all local SEO factors including NAP, GMB, citations, and reviews.",
  "location-based-content-idea-generator": "Generate location-based content ideas and topics. Create content tailored to specific geographic areas.",
  "long-tail-keyword-generator": "Generate long-tail keyword variations for niche targeting. Find specific, lower-competition search terms.",
  "meta-description-optimizer": "Optimize meta descriptions for search engine result pages. Improve CTR with compelling, keyword-rich descriptions.",
  "meta-description-writer": "Write compelling meta descriptions. Create engaging descriptions that improve click-through rates from SERPs.",
  "meta-tag-comparison-tool": "Compare meta tags between pages or domains. Identify differences and opportunities for optimization.",
  "meta-tag-generator": "Generate meta tags (title, description, keywords) optimized for CTR. Create complete meta tags for on-page SEO.",
  "mobile-friendly-test": "Test mobile-friendliness and responsive design issues. Verify your site works correctly on mobile devices.",
  "nap-consistency-checker": "Check NAP consistency (Name, Address, Phone) across directories. Ensure business information is uniform across the web.",
  "og-tag-generator": "Generate Open Graph tags for social sharing. Create title, description, and image tags for Facebook, Twitter, and LinkedIn.",
  "on-page-seo-audit-checker": "Perform on-page SEO audits and diagnostics. Comprehensive analysis of on-page factors and optimization opportunities.",
  "organic-growth-forecast-tool": "Forecast organic growth and traffic trends. Predict traffic based on current rankings and optimization efforts.",
  "outreach-email-template-generator": "Generate outreach email templates for link building and partnerships. Create professional emails for webmasters and influencers.",
  "page-speed-score-simulator": "Simulate page speed scores and identify bottlenecks. Test how fast your pages load and what affects performance.",
  "paragraph-keyword-optimizer": "Optimize paragraph keyword placement and density. Improve keyword usage within content paragraphs.",
  "product-description-generator": "Generate product descriptions with benefits and features. Create compelling e-commerce product copy.",
  "ranking-opportunity-finder": "Find ranking opportunities and low-hanging fruit. Identify keywords and topics where you can quickly improve rankings.",
  "ranking-progress-tracker": "Track ranking progress over time. Monitor keyword position changes and SEO campaign effectiveness.",
  "readability-enhancer": "Enhance readability with simpler sentences and better flow. Improve content readability scores and user engagement.",
  "readability-score-calculator": "Calculate readability scores (Flesch, grade level). Measure how easy your content is to read and understand.",
  "redirect-301-generator": "Generate 301 redirects for URL changes. Create proper redirection when pages move or URLs change.",
  "redirect-checker": "Check redirect chains and loops. Verify redirect implementation and identify issues.",
  "reverse-image-search": "Perform reverse image searches. Find where images appear online and check for usage or duplication.",
  "review-response-generator": "Generate review responses for customer feedback. Create professional responses to reviews on Google, Yelp, etc.",
  "robots-txt-creator": "Create custom robots.txt files to control crawl budget. Optimize which pages search engines can access.",
  "robots-txt-validator": "Validate robots.txt for blocking/unblocking correct pages. Ensure search engines can crawl your intended pages.",
  "schema-markup-generator": "Generate schema markup (JSON-LD) for various types. Create structured data for articles, products, reviews, and more.",
  "search-preview-simulator": "Simulate how your site appears in search results. Preview title, description, and URL as shown in Google.",
  "seo-checklist-generator": "Generate SEO checklists for audits and optimization. Create comprehensive task lists for SEO projects.",
  "seo-content-checker": "Check SEO content quality and optimization. Analyze content for keyword usage, structure, and best practices.",
  "seo-health-score-calculator": "Calculate SEO health scores and diagnostics. Overall score based on multiple SEO factors and issues.",
  "site-comparison-report-generator": "Generate site comparison reports (features, metrics, performance). Compare your site against competitors or benchmarks.",
  "sitemap-generator": "Generate XML sitemaps for search engine submission. Create sitemap files to help search engines discover your pages.",
  "structured-data-validator": "Validate structured data (Schema.org, JSON-LD). Ensure markup is correct and error-free for rich results.",
  "text-to-html-converter": "Convert text to HTML format. Transform plain text into properly formatted HTML code.",
  "text-translator": "Translate text between languages. Provide multilingual content translation for global audiences.",
  "title-meta-length-counter": "Counter title and meta length characters. Ensure titles and descriptions fit within search engine pixel limits.",
  "tone-of-voice-analyzer": "Analyze tone of voice and brand consistency. Assess whether content matches your brand's communication style.",
  "traffic-potential-calculator": "Calculate traffic potential for keywords. Estimate monthly search traffic based on ranking position and search volume.",
  "trending-keyword-visualizer": "Visualize trending keywords and search volume patterns. See keyword popularity over time and seasonal trends.",
  "url-slug-generator": "Generate SEO-friendly URL slugs. Create clean, readable URLs optimized for search engines and users.",
  "visibility-index-calculator": "Calculate visibility index based on ranking positions. Measure how visible your site is in search results.",
  "word-count-structure-checker": "Check word count structure and content length recommendations. Optimize content length for your topic and competitors.",
  "xml-sitemap-visualizer": "Visualize sitemap structure and hierarchy. View sitemap as a tree diagram to understand page relationships."
};

// Skip index.js and create .md files for all tool .js files
let created = 0;
let skipped = [];

toolFiles.forEach((file, idx) => {
  // Skip index.js
  if (file === 'index.js') {
    skipped.push(file);
    return;
  }
  
  const filePath = path.join(toolsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Extract the object properties
  const slugMatch = content.match(/"slug"\s*:\s*"([^"]+)"/);
  const nameMatch = content.match(/"name"\s*:\s*"([^"]+)"/);
  const categoryMatch = content.match(/"category"\s*:\s*"([^"]+)"/);
  
  const slug = slugMatch ? slugMatch[1] : file.replace('.js', '');
  const name = nameMatch ? nameMatch[1] : 'Unknown Tool';
  const category = categoryMatch ? categoryMatch[1] : 'Uncategorized';
  
  // Get original description by slug
  const originalDesc = originalDescriptions[slug] || 'No description available';
  
  // Create frontmatter based on CONTRIBUTING.md template
  const today = new Date().toISOString().split('T')[0];
  const frontmatter = `---\nname: ` + slug.replace(/-/g, ' ') + `\ndescription: "` + originalDesc + `"\ncategory: ` + category + `\nrisk: safe\nsource: community\nsource_repo: WHOISABHISHEKADHIKARI/100seotools\nsource_type: community\ndate_added: "` + today + `"\nauthor: Abhishek Adhikari\ntags: [seo, tool]\ntools: [nextjs, react]\n---\n`;
  
  // Build the new content based on template
  let newContent = frontmatter;
  newContent += '# ' + name + '\n\n';
  newContent += '## Overview\n\n';
  newContent += originalDesc + '\n\n';
  newContent += '## When to Use This Skill\n\n';
  newContent += '- Use when you need to optimize SEO content\n';
  newContent += '- Use when creating blog posts or articles\n';
  newContent += '- Use when improving search engine visibility\n\n';
  newContent += '## Core Concepts\n\n';
  newContent += '### SEO Fundamentals\nLearn the basics of search engine optimization and how this tool helps.\n\n';
  newContent += '### Keyword & Content Analysis\nUnderstand how the tool analyzes and optimizes keywords and content.\n\n';
  newContent += '## Step-by-Step Guide\n\n';
  newContent += '### 1. Input Your Topic\nEnter the topic, keyword, or URL you want to analyze or generate content for.\n\n';
  newContent += '### 2. Let the Tool Process\nAllow the tool to generate suggestions, outlines, or optimizations based on your input.\n\n';
  newContent += '### 3. Review and Apply Results\nReview the generated output and apply the recommendations to your content or SEO strategy.\n\n';
  newContent += '## Examples\n\n';
  newContent += '### Example 1: ' + slug + '\n';
  newContent += '\`\`\`\n';
  newContent += '/* Example usage here */\n';
  newContent += '\`\`\`\n';
  newContent += '**Explanation:** This example demonstrates the primary use case for this skill.\n\n';
  newContent += '### Example 2: Another Use Case\n';
  newContent += '\`\`\`\n';
  newContent += '/* Additional example */\n';
  newContent += '\`\`\`\n';
  newContent += '**Explanation:** This example shows another common use case.\n\n';
  newContent += '## Best Practices\n\n';
  newContent += '- Do: Provide clear, specific topics for best results\n';
  newContent += '- Do: Review and customize generated output for your brand voice\n';
  newContent += '- Do not: Rely solely on generated content without review\n';
  newContent += '- Do not: Use generated content without proper attribution or editing\n\n';
  newContent += '## Troubleshooting\n\n';
  newContent += '### Problem: Generic Output\n';
  newContent += '**Symptoms:** The tool generates content that is too broad or not specific to your niche.\n';
  newContent += '**Solution:** Provide more specific input including target audience, industry, and unique value proposition.\n\n';
  newContent += '### Problem: Formatting Issues\n';
  newContent += '**Symptoms:** Generated content does not match your desired format or style.\n';
  newContent += '**Solution:** Adjust your input to include format preferences and style guidelines.\n\n';
  newContent += '## Related Skills\n\n';
  newContent += '- @ai-meta-tag-writer - For generating meta titles and descriptions\n\n';
  newContent += '## Additional Resources\n\n';
  newContent += '- [SEO Best Practices](https://moz.com/beginners-guide-to-seo)\n';
  newContent += '- [Content Marketing Guide](https://contentmarketinginstitute.com)\n';
  newContent += '- [Google Search Central](https://developers.google.com/search)\n';
  
  const outputPath = path.join(skillDir, file.replace('.js', '.md'));
  fs.writeFileSync(outputPath, newContent);
  console.log(`Created: ${outputPath} (${idx + 1}/${toolFiles.length})`);
  created++;
});

console.log(`\nCreated: ${created} skill files`);
console.log(`Skipped: ${skipped.join(', ')}`);