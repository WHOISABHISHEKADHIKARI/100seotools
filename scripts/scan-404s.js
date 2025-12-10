/**
 * 404 Scanner & Redirect Generator
 * Scans website for broken links, changed slugs, and generates redirect list
 */

import { getAllToolsMeta } from '../tools/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Known URL patterns that should exist
const EXPECTED_URLS = {
    // Blog patterns
    blogGuides: [
        // Tool guides (should redirect to /blog/[tool-name]-guide)
        'on-page-seo-audit-checker-guide',
        'robots-txt-validator-guide',
        'keyword-density-checker-guide',
        'meta-tag-generator-guide',
        'heading-analyzer-guide',
        'seo-content-checker-guide',
        'keyword-suggestion-tool-guide',
        'keyword-clustering-tool-guide',
        'structured-data-validator-guide',
        'schema-markup-generator-guide',
        'xml-sitemap-visualizer-guide',
        'readability-score-calculator-guide',
        'ai-meta-tag-writer-guide',
        'ai-content-outline-generator-guide',
        'ai-blog-intro-writer-guide',
        'backlink-idea-generator-guide',
        'outreach-email-template-generator-guide',
        'anchor-text-analyzer-guide',
        'local-schema-builder-guide',
        'nap-consistency-checker-guide',
        'local-content-idea-generator-guide',
        'ranking-progress-tracker-guide',
        'traffic-potential-calculator-guide',
        'seo-roi-calculator-guide',
        'keyword-intent-identifier-guide',
        'long-tail-keyword-generator-guide',
        'competitor-analysis-tool-guide',
        'seo-strategy-planner-guide',
        'page-speed-scan-guide',
        'content-freshness-checker',
        'redirect-301-generator-how-to-use',
        'redirect-301-generator-best-practices-integrations-costs',
        'seo-content-checker-how-to-use',
        'free-seo-tools-list-2024',
        '100-free-seo-tools-ultimate-list',
    ],

    // Static blog posts
    staticBlogs: [
        'ai-content-detection-guide-2024',
        'latest-ai-based-tips-and-tricks-for-fast-web-crawling',
        'latest-seo-guides',
        'reverse-image-search-guide',
        'seo-basics',
    ],

    // Tool pages
    tools: [
        'on-page-seo-audit-checker',
        'robots-txt-validator',
        'keyword-density-checker',
        'meta-tag-generator',
        'heading-analyzer',
        'seo-content-checker',
        'keyword-suggestion-tool',
        'keyword-clustering-tool',
        'structured-data-validator',
        'schema-markup-generator',
        'xml-sitemap-visualizer',
        'readability-score-calculator',
        'ai-meta-tag-writer',
        'ai-content-outline-generator',
        'ai-blog-intro-writer',
        'ai-article-length-optimizer',
        'redirect-301-generator',
        'canonical-url-builder',
        'redirect-checker',
        'robots-txt-creator',
        'blog-title-generator',
        'ai-content-improver',
        'meta-description-optimizer',
        'keyword-gap-finder',
        'competitor-keyword-overlap-checker',
        'internal-linking-planner',
        'local-citation-finder',
        'nap-consistency-checker',
        'local-schema-builder',
        'url-slug-generator',
        'keyword-roi-calculator',
        'ctr-predictor',
        'visibility-index-calculator',
        'ranking-progress-tracker',
        'traffic-potential-calculator',
    ],

    // Category pages
    categories: [
        'keyword-research',
        'on-page-optimization',
        'technical-seo',
        'content-seo',
        'backlink-link-building',
        'local-seo',
        'ai-powered-seo',
        'seo-performance',
        'competitor-analysis',
        'seo-utility',
    ],
};

// Common 404 patterns found in internal links
const BROKEN_LINK_PATTERNS = [
    // Blog post patterns that might be broken
    { pattern: '/blog/[tool-name]', shouldBe: '/blog/[tool-name]-guide' },
    { pattern: '/blog/[tool-name]-how-to-use', shouldBe: '/blog/[tool-name]-guide' },
    { pattern: '/tools/[tool]', shouldBe: '/tools/[tool-slug]' },

    // Old pagination patterns
    { pattern: '/blog/p/:page', shouldBe: '/blog' },
    { pattern: '/blog/tp/:page', shouldBe: '/blog' },
    { pattern: '/category/:slug/p/:page', shouldBe: '/category/:slug' },
    { pattern: '/tools/:slug/p/:page', shouldBe: '/tools/:slug' },

    // Variant redirects
    { pattern: '/on-page-checker', shouldBe: '/tools/on-page-seo-audit-checker' },
    { pattern: '/onpage-checker', shouldBe: '/tools/on-page-seo-audit-checker' },
    { pattern: '/on-page-seo-checker', shouldBe: '/tools/on-page-seo-audit-checker' },
    { pattern: '/robot-txt-validator', shouldBe: '/tools/robots-txt-validator' },
    { pattern: '/robotstxt-validator', shouldBe: '/tools/robots-txt-validator' },
];

async function scanInternalLinks() {
    console.log('🔍 Scanning for internal links in codebase...\n');

    const links = new Set();
    const files = [
        'app/page.js',
        'app/blog/[slug]/page.js',
        'app/tools/[slug]/page.js',
        'components/ToolLayout.js',
        'components/Header.js',
        'components/Footer.js',
    ];

    for (const file of files) {
        try {
            const filePath = path.join(__dirname, '..', file);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf-8');

                // Extract href patterns
                const hrefMatches = content.matchAll(/href=["'](\/(blog|tools|category)\/[^"']+)["']/g);
                for (const match of hrefMatches) {
                    links.add(match[1]);
                }
            }
        } catch (error) {
            console.log(`⚠️  Could not read ${file}`);
        }
    }

    return Array.from(links);
}

async function analyzeLinks() {
    console.log('📊 100 SEO Tools - 404 Error Analysis & Redirect Generator\n');
    console.log('='.repeat(80) + '\n');

    const internalLinks = await scanInternalLinks();

    // Get all tools
    const tools = getAllToolsMeta();
    const toolSlugs = tools.map(t => t.slug);

    // Analyze potential 404s
    const potential404s = [];
    const validLinks = [];
    const needsRedirect = [];

    for (const link of internalLinks) {
        const cleanLink = link.replace(/^\//, '');
        const parts = cleanLink.split('/');

        if (parts[0] === 'blog') {
            const slug = parts[1];

            // Check if it's a guide link
            if (slug && !slug.endsWith('-guide') && !EXPECTED_URLS.staticBlogs.includes(slug)) {
                // Might need redirect to -guide version
                const guideSlug = `${slug}-guide`;
                if (EXPECTED_URLS.blogGuides.includes(guideSlug)) {
                    needsRedirect.push({
                        old: link,
                        new: `/blog/${guideSlug}`,
                        reason: 'Blog post should redirect to guide version'
                    });
                } else {
                    potential404s.push({
                        url: link,
                        reason: 'Blog post not found in expected URLs',
                        fix: 'Create blog post or add redirect'
                    });
                }
            } else {
                validLinks.push(link);
            }
        } else if (parts[0] === 'tools') {
            const slug = parts[1];

            if (!toolSlugs.includes(slug)) {
                potential404s.push({
                    url: link,
                    reason: 'Tool slug not found in tools list',
                    fix: 'Check tool slug or add redirect'
                });
            } else {
                validLinks.push(link);
            }
        } else if (parts[0] === 'category') {
            const slug = parts[1];

            if (!EXPECTED_URLS.categories.includes(slug)) {
                potential404s.push({
                    url: link,
                    reason: 'Category slug not found',
                    fix: 'Check category slug or add redirect'
                });
            } else {
                validLinks.push(link);
            }
        }
    }

    return {
        internalLinks,
        potential404s,
        validLinks,
        needsRedirect,
        toolSlugs,
    };
}

async function generateReport() {
    const analysis = await analyzeLinks();

    console.log('📋 ANALYSIS RESULTS\n');
    console.log(`Total internal links found: ${analysis.internalLinks.length}`);
    console.log(`Valid links: ${analysis.validLinks.length}`);
    console.log(`Potential 404s: ${analysis.potential404s.length}`);
    console.log(`Links needing redirects: ${analysis.needsRedirect.length}\n`);

    console.log('='.repeat(80) + '\n');

    // Report potential 404s
    if (analysis.potential404s.length > 0) {
        console.log('🚨 POTENTIAL 404 ERRORS\n');
        analysis.potential404s.forEach((item, index) => {
            console.log(`${index + 1}. ${item.url}`);
            console.log(`   Reason: ${item.reason}`);
            console.log(`   Fix: ${item.fix}\n`);
        });
        console.log('='.repeat(80) + '\n');
    }

    // Report redirects needed
    if (analysis.needsRedirect.length > 0) {
        console.log('🔄 REDIRECTS NEEDED\n');
        analysis.needsRedirect.forEach((item, index) => {
            console.log(`${index + 1}. ${item.old} → ${item.new}`);
            console.log(`   Reason: ${item.reason}\n`);
        });
        console.log('='.repeat(80) + '\n');
    }

    // Generate redirect configuration
    console.log('⚙️  NEXT.CONFIG.MJS REDIRECT RULES\n');
    console.log('Add these to your redirects array:\n');
    console.log('```javascript');

    // Generate redirects for blog guides
    const blogRedirects = [];
    EXPECTED_URLS.blogGuides.forEach(guide => {
        const baseName = guide.replace('-guide', '');
        if (baseName !== guide) {
            blogRedirects.push(
                `  { source: '/blog/${baseName}', destination: '/blog/${guide}', permanent: true },`
            );
        }
    });

    if (blogRedirects.length > 0) {
        console.log('  // Blog guide redirects');
        blogRedirects.forEach(r => console.log(r));
        console.log('');
    }

    // Add custom redirects from analysis
    if (analysis.needsRedirect.length > 0) {
        console.log('  // Custom redirects from analysis');
        analysis.needsRedirect.forEach(item => {
            console.log(`  { source: '${item.old}', destination: '${item.new}', permanent: true },`);
        });
    }

    console.log('```\n');
    console.log('='.repeat(80) + '\n');

    // Generate markdown report
    const reportContent = generateMarkdownReport(analysis);
    const reportPath = path.join(__dirname, '..', '404_ANALYSIS_REPORT.md');
    fs.writeFileSync(reportPath, reportContent);

    console.log(`✅ Full report saved to: 404_ANALYSIS_REPORT.md\n`);

    return analysis;
}

function generateMarkdownReport(analysis) {
    const timestamp = new Date().toISOString();

    return `# 404 Error Analysis & Redirect Report
Generated: ${timestamp}

## Summary

- **Total Internal Links**: ${analysis.internalLinks.length}
- **Valid Links**: ${analysis.validLinks.length}
- **Potential 404s**: ${analysis.potential404s.length}
- **Redirects Needed**: ${analysis.needsRedirect.length}

---

## 🚨 Potential 404 Errors

${analysis.potential404s.length === 0 ? 'No potential 404 errors found! ✅' : ''}

${analysis.potential404s.map((item, i) => `
### ${i + 1}. \`${item.url}\`

- **Reason**: ${item.reason}
- **Fix**: ${item.fix}
`).join('\n')}

---

## 🔄 Recommended Redirects

${analysis.needsRedirect.length === 0 ? 'No redirects needed! ✅' : ''}

${analysis.needsRedirect.map((item, i) => `
### ${i + 1}. ${item.old} → ${item.new}

**Reason**: ${item.reason}

\`\`\`javascript
{ source: '${item.old}', destination: '${item.new}', permanent: true }
\`\`\`
`).join('\n')}

---

## 📝 Next.config.mjs Redirect Configuration

Add these redirects to your \`next.config.mjs\` file:

\`\`\`javascript
redirects: async () => {
  const common = [
    // Existing redirects...

    // Blog guide redirects
${EXPECTED_URLS.blogGuides.map(guide => {
        const baseName = guide.replace('-guide', '');
        if (baseName !== guide) {
            return `    { source: '/blog/${baseName}', destination: '/blog/${guide}', permanent: true },`;
        }
        return null;
    }).filter(Boolean).join('\n')}

    // Custom redirects
${analysis.needsRedirect.map(item =>
        `    { source: '${item.old}', destination: '${item.new}', permanent: true },`
    ).join('\n')}
  ];

  // ... rest of config
}
\`\`\`

---

## 🔧 Files to Fix Internally

These files contain links that should be updated to prevent 404s:

### High Priority

1. **components/ToolLayout.js**
   - Update blog post links to use \`-guide\` suffix
   - Verify all tool slugs match actual tool pages

2. **app/page.js**
   - Check all internal links in hero section
   - Verify category links

3. **app/tools/[slug]/page.js**
   - Update related tool links
   - Fix blog post references

### Recommended Actions

1. **Search & Replace**: Update all blog links to include \`-guide\` suffix
2. **Validate Tool Slugs**: Ensure all tool links match actual tool slugs
3. **Test Links**: Run link checker on production site
4. **Monitor 404s**: Set up Google Search Console monitoring

---

## 📊 All Internal Links Found

${analysis.internalLinks.map(link => `- ${link}`).join('\n')}

---

## ✅ Valid Links (No Action Needed)

${analysis.validLinks.map(link => `- ${link}`).join('\n')}

---

## 🎯 Next Steps

1. ✅ Review this report
2. ✅ Add recommended redirects to \`next.config.mjs\`
3. ✅ Update internal links in identified files
4. ✅ Test changes locally
5. ✅ Deploy and monitor for 404 errors
6. ✅ Set up Google Search Console alerts

---

*Report generated by 404 Scanner & Redirect Generator*
`;
}

// Run the analysis
generateReport().catch(console.error);
