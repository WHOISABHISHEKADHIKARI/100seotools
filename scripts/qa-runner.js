import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'http://localhost:3000/api';
const TOOLS_DIR = path.resolve(__dirname, '../tools');

// Utility to parse tool files (simple regex to avoid full module loading issues if any)
async function loadTools() {
    try {
        const files = await fs.readdir(TOOLS_DIR);
        const tools = [];
        for (const file of files) {
            if (file === 'index.js' || !file.endsWith('.js')) continue;
            try {
                const content = await fs.readFile(path.join(TOOLS_DIR, file), 'utf8');
                // Basic extraction of metadata
                const slugMatch = content.match(/['"]?slug['"]?\s*:\s*['"]([^'"]+)['"]/);
                const nameMatch = content.match(/['"]?name['"]?\s*:\s*['"]([^'"]+)['"]/);
                const templateMatch = content.match(/['"]?template['"]?\s*:\s*['"]([^'"]+)['"]/);

                if (slugMatch && templateMatch) {
                    tools.push({
                        slug: slugMatch[1],
                        name: nameMatch ? nameMatch[1] : slugMatch[1],
                        template: templateMatch[1]
                    });
                }
            } catch (e) {
                console.error(`Failed to load ${file}:`, e);
            }
        }
        return tools;
    } catch (e) {
        console.error('Failed to read tools directory:', e);
        return [];
    }
}

// Minimal reproduction of getTemplateDefinition to access fields logic
// This effectively hardcodes the schema logic for the QA script so it matches the app
function getTemplateFields(key) {
    const definitions = {
        anchorTextAnalyzer: [{ name: 'url', type: 'url' }],
        backlinkIdeaGenerator: [{ name: 'keyword', type: 'text' }],
        linkRelevanceEvaluator: [{ name: 'linkUrl', type: 'url' }, { name: 'targetKeyword', type: 'text' }],
        linkToxicityChecker: [{ name: 'url', type: 'url' }],
        internalLinkSuggestionTool: [{ name: 'content', type: 'textarea' }],
        httpStatusCodeTester: [{ name: 'url', type: 'url' }],
        redirectChecker: [{ name: 'url', type: 'url' }],
        sitemapGenerator: [{ name: 'url', type: 'url' }],
        brokenLinkFinder: [{ name: 'url', type: 'url' }],
        aiArticleLengthOptimizer: [{ name: 'topic', type: 'text' }, { name: 'intent', type: 'select', options: ['informational'] }, { name: 'competitorAvgWords', type: 'number' }, { name: 'sectionCount', type: 'number' }, { name: 'audienceLevel', type: 'select', options: ['beginner'] }],
        aiBlogIntroWriter: [{ name: 'title', type: 'text' }, { name: 'keyword', type: 'text' }],
        aiContentDetector: [{ name: 'text', type: 'textarea' }],
        aiMetaTagWriter: [{ name: 'keyword', type: 'text' }, { name: 'desc', type: 'textarea' }],
        aiSnippetGenerator: [{ name: 'content', type: 'textarea' }, { name: 'query', type: 'text' }],
        metaDescriptionOptimizer: [{ name: 'description', type: 'textarea' }],
        metaDescriptionWriter: [{ name: 'title', type: 'text' }, { name: 'keyword', type: 'text' }],
        pageSpeedScoreSimulator: [{ name: 'url', type: 'url' }],
        seoChecklistGenerator: [{ name: 'type', type: 'text' }],
        seoContentChecker: [{ name: 'content', type: 'textarea' }, { name: 'keyword', type: 'text' }, { name: 'title', type: 'text' }, { name: 'meta', type: 'textarea' }],
        seoHealthScore: [{ name: 'url', type: 'url' }],
        structuredDataValidator: [{ name: 'json', type: 'textarea' }],
        trafficPotentialCalculator: [{ name: 'volume', type: 'number' }, { name: 'position', type: 'number' }],
        redirect301Generator: [{ name: 'old', type: 'text' }, { name: 'new', type: 'text' }],
        aiContentOutlineGenerator: [{ name: 'keyword', type: 'text' }],
        aiFaqCreator: [{ name: 'topic', type: 'text' }],
        aiKeywordExplainer: [{ name: 'keyword', type: 'text' }],
        internalLinkingPlanner: [{ name: 'content', type: 'textarea' }, { name: 'keywords', type: 'textarea' }],
        keywordIntentIdentifier: [{ name: 'keyword', type: 'text' }],
        keywordPlacementHighlighter: [{ name: 'content', type: 'textarea' }, { name: 'keyword', type: 'text' }],
        keywordRoiCalculator: [{ name: 'cpc', type: 'number' }, { name: 'conversion_rate', type: 'number' }, { name: 'value', type: 'number' }],
        keywordShareEstimator: [{ name: 'volume', type: 'number' }, { name: 'difficulty', type: 'number' }],
        linkSourceCategorizer: [{ name: 'url', type: 'url' }],
        localCitationFinder: [{ name: 'category', type: 'text' }, { name: 'city', type: 'text' }],
        localKeywordGenerator: [{ name: 'service', type: 'text' }, { name: 'location', type: 'text' }],
        localSchemaBuilder: [{ name: 'name', type: 'text' }, { name: 'address', type: 'text' }, { name: 'city', type: 'text' }, { name: 'zip', type: 'text' }],
        localSeoAuditChecklist: [{ name: 'business_name', type: 'text' }],
        mobileFriendlyTest: [{ name: 'url', type: 'url' }],
        napConsistencyChecker: [{ name: 'name', type: 'text' }, { name: 'phone', type: 'text' }, { name: 'address', type: 'text' }],
        aiSchemaGenerator: [{ name: 'type', type: 'text' }, { name: 'name', type: 'text' }, { name: 'url', type: 'text' }],
        bounceRateEstimator: [{ name: 'industry', type: 'text' }, { name: 'load_time', type: 'number' }],
        backlinkTrackingTemplate: [{ name: 'project_name', type: 'text' }],
        competitorSummaryReport: [{ name: 'competitor_url', type: 'text' }],
        onPageSeoAuditChecker: [{ name: 'url', type: 'url' }],
        locationBasedContent: [{ name: 'keyword', type: 'text' }, { name: 'location', type: 'text' }],
        organicGrowthForecast: [{ name: 'current_traffic', type: 'number' }, { name: 'growth_rate', type: 'number' }],
        paragraphKeywordOptimizer: [{ name: 'paragraph', type: 'textarea' }, { name: 'keywords', type: 'text' }],
        rankingOpportunityFinder: [{ name: 'competitor_url', type: 'url' }],
        rankingProgressTracker: [{ name: 'current_rank', type: 'number' }, { name: 'previous_rank', type: 'number' }],
        readabilityEnhancer: [{ name: 'text', type: 'textarea' }],
        reverseImageSearch: [{ name: 'image_url', type: 'url' }],
        siteComparisonReportGenerator: [{ name: 'site1', type: 'text' }, { name: 'site2', type: 'text' }],
        textTranslator: [{ name: 'text', type: 'textarea' }, { name: 'target_lang', type: 'text' }],
        toneOfVoiceAnalyzer: [{ name: 'content', type: 'textarea' }],
        visibilityIndexCalculator: [{ name: 'rankings', type: 'textarea' }],
        productDescriptionGenerator: [{ name: 'product_name', type: 'text' }, { name: 'features', type: 'textarea' }],
        reviewResponseGenerator: [{ name: 'customer_name', type: 'text' }, { name: 'rating', type: 'number' }, { name: 'comment', type: 'textarea' }],
        robotsTxtCreator: [{ name: 'allowed', type: 'textarea' }, { name: 'disallowed', type: 'textarea' }],
        urlSlugGenerator: [{ name: 'title', type: 'text' }],
        titleMetaLengthCounter: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }, { name: 'url', type: 'text' }],
        canonicalUrlBuilder: [{ name: 'url', type: 'url' }],
        imageAltTagGenerator: [{ name: 'filename', type: 'text' }, { name: 'context', type: 'text' }],
        ogTagGenerator: [{ name: 'title', type: 'text' }, { name: 'desc', type: 'textarea' }, { name: 'image', type: 'text' }, { name: 'url', type: 'text' }],
        searchPreviewSimulator: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }, { name: 'url', type: 'text' }],
        faqGenerator: [{ name: 'questions', type: 'textarea' }],
        blogTitleGenerator: [{ name: 'keyword', type: 'text' }],
        longTailKeywords: [{ name: 'seed', type: 'text' }, { name: 'modifiers', type: 'text' }],
        keywordDensity: [{ name: 'text', type: 'textarea' }, { name: 'focus', type: 'text' }],
        metaTagGenerator: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }, { name: 'url', type: 'text' }],
        headingAnalyzer: [{ name: 'html', type: 'textarea' }],
        readabilityScore: [{ name: 'text', type: 'textarea' }],
        duplicateContentChecker: [{ name: 'a', type: 'textarea' }, { name: 'b', type: 'textarea' }],
        robotsTxtValidator: [{ name: 'robots', type: 'textarea' }],
        xmlSitemapVisualizer: [{ name: 'xml', type: 'textarea' }],
        contentFreshnessChecker: [{ name: 'title', type: 'text' }, { name: 'description', type: 'textarea' }],
        aiCompetitorTitleRewriter: [{ name: 'title', type: 'text' }],
        aiContentImprover: [{ name: 'content', type: 'textarea' }],
        canonicalTagChecker: [{ name: 'url', type: 'url' }],
        competitorBacklinkIdeaGenerator: [{ name: 'competitor_url', type: 'url' }],
        competitorGapAnalyzer: [{ name: 'my_content', type: 'textarea' }, { name: 'competitor_content', type: 'textarea' }],

        // Fallbacks for tools not explicitly listed above
        keyword_suggestion_tool: [{ name: 'seed', type: 'text' }],
        keywordSuggestions: [{ name: 'seed', type: 'text' }]
    };

    // Normalize key
    return definitions[key] || definitions[key.replace(/-/g, '')] || [];
}

// Data Generators
function generateValidValue(field) {
    const seed = Date.now();
    const name = field.name.toLowerCase();

    if (field.type === 'url' || name.includes('url')) return 'https://example.com/valid-page';
    if (field.type === 'number') return 1500;
    if (field.type === 'select') return field.options ? field.options[0] : 'value';
    if (name === 'json' || name.includes('json')) return '<script type="application/ld+json">{"@context": "https://schema.org", "@type": "WebPage"}</script>';
    if (name === 'xml') return '<urlset><url><loc>https://example.com</loc></url></urlset>';
    if (name === 'robots') return 'User-agent: *\nDisallow: /admin';
    if (name.includes('question') || name.includes('faq')) return 'Q: What is SEO? | A: SEO is Search Engine Optimization.';
    if (name === 'email') return 'test@example.com';

    if (field.type === 'textarea') return `This is a valid sample content for testing purposes. It contains enough words to be meaningful. Seed: ${seed}`;

    if (name === 'keyword' || name === 'seed' || name === 'topic') return 'digital marketing';
    if (name === 'title') return '10 Best SEO Tips for 2025';

    return 'Valid Test Input';
}

function generateInvalidValue(field) {
    // Missing required fields is the most common invalid case
    // But specific types:
    if (field.type === 'url') return 'not-a-valid-url';
    if (field.type === 'number') return 'not-a-number';
    // For text, empty string is often invalid if required
    return '';
}

function generateEdgeValue(field) {
    if (field.type === 'url') return 'https://example.com/' + 'a'.repeat(2000); // Super long URL
    if (field.type === 'number') return -1; // Negative number
    if (field.type === 'textarea') return 'a'.repeat(50000); // 50KB string
    if (field.type === 'text') return '<script>alert("xss")</script>'; // Special chars
    return '0';
}

async function runTest(tool) {
    const fields = getTemplateFields(tool.template);
    if (!fields || fields.length === 0) {
        return {
            tool_name: tool.name,
            slug: tool.slug,
            test_cases: [{
                input: "N/A",
                expected_output: "Defined fields",
                actual_output_issue: "No field definition found in QA script",
                is_output_correct: "No",
                fix_suggestion: "Update QA script with field definition for " + tool.template
            }]
        };
    }

    const report = {
        tool_name: tool.name,
        slug: tool.slug,
        test_cases: []
    };

    // 1. Valid Case
    const validPayload = {};
    fields.forEach(f => validPayload[f.name] = generateValidValue(f));

    // 2. Invalid Case (Pick first field and make it invalid)
    const invalidPayload = { ...validPayload };
    if (fields.length > 0) {
        invalidPayload[fields[0].name] = generateInvalidValue(fields[0]);
    }

    // 3. Edge Case (Pick first field and make it edge)
    const edgePayload = { ...validPayload };
    if (fields.length > 0) {
        edgePayload[fields[0].name] = generateEdgeValue(fields[0]);
    }

    const scenarios = [
        { type: 'Valid', payload: validPayload, expectSuccess: true },
        { type: 'Invalid', payload: invalidPayload, expectSuccess: false }, // Should fail or return error
        { type: 'Edge', payload: edgePayload, expectSuccess: 'handled' } // handled means 200 or 400 ok, but NO 500
    ];

    for (const scenario of scenarios) {
        try {
            const start = Date.now();
            const res = await fetch(`${BASE_URL}/${tool.slug}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scenario.payload)
            });
            const duration = Date.now() - start;

            let data = {};
            try {
                data = await res.json();
            } catch (e) {
                // If JSON fails, it might be 500 html page or 404
                if (res.status === 200) {
                    data = { success: false, error: "Invalid JSON response" };
                }
            }

            let isCorrect = "Yes";
            let issue = "";
            let fix = "";

            if (scenario.type === 'Valid') {
                if (!res.ok || !data.success) {
                    isCorrect = "No";
                    issue = `Failed valid input. Status: ${res.status}. Error: ${data.error || 'Unknown'}`;
                    fix = "Check API logic or input validation to ensure valid inputs are accepted.";
                }
            } else if (scenario.type === 'Invalid') {
                if (res.ok && data.success) {
                    // It accepted invalid input? Maybe it's robust, or maybe loose validation.
                    // For empty string, it SHOULD fail usually.
                    if (JSON.stringify(scenario.payload).includes('""')) {
                        isCorrect = "No";
                        issue = "Accepted empty/invalid input without error.";
                        fix = "Add validation to reject empty/invalid required fields.";
                    }
                }
            } else if (scenario.type === 'Edge') {
                if (res.status === 500) {
                    isCorrect = "No";
                    issue = "Server Error (500) on edge case.";
                    fix = "Wrap code in try/catch and handle large/malformed inputs gracefully.";
                }
            }

            report.test_cases.push({
                type: scenario.type,
                input: JSON.stringify(scenario.payload).substring(0, 100) + '...',
                status: res.status,
                duration: `${duration}ms`,
                expected_output: scenario.expectSuccess === true ? "Success" : (scenario.expectSuccess === false ? "Error" : "Handled"),
                actual_output_issue: issue || "None",
                is_output_correct: isCorrect,
                fix_suggestion: fix || "None"
            });

        } catch (err) {
            report.test_cases.push({
                type: scenario.type,
                input: JSON.stringify(scenario.payload).substring(0, 50),
                expected_output: "Response",
                actual_output_issue: `Network Error: ${err.message}`,
                is_output_correct: "No",
                fix_suggestion: "Check server status or route configuration."
            });
        }
    }

    return report;
}

async function run() {
    console.log('Starting Full Site QA...');
    const tools = await loadTools();
    const allReports = [];

    // Process sequentially to be safe
    for (const tool of tools) {
        console.log(`Testing ${tool.slug}...`);
        const toolReport = await runTest(tool);
        allReports.push(toolReport);
    }

    await fs.writeFile('QA_FULL_REPORT.json', JSON.stringify(allReports, null, 2));
    console.log('QA Complete. Saved to QA_FULL_REPORT.json');
}

run();
