/**
 * SEO Metadata Analyzer
 * Analyzes titles and meta descriptions across all pages
 * Generates a comprehensive report with improvement recommendations
 */

import { getAllToolsMeta } from '../tools/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SEO Best Practices
const TITLE_MIN = 30;
const TITLE_MAX = 60;
const TITLE_IDEAL = 55;
const DESC_MIN = 120;
const DESC_MAX = 160;
const DESC_IDEAL = 155;

// Analyze a single title
function analyzeTitle(title, page) {
    const issues = [];
    const suggestions = [];
    let score = 100;

    if (!title) {
        issues.push('❌ Missing title tag');
        score = 0;
        return { title, length: 0, score, issues, suggestions };
    }

    const length = title.length;

    // Length checks
    if (length < TITLE_MIN) {
        issues.push(`⚠️ Too short (${length} chars, minimum ${TITLE_MIN})`);
        suggestions.push(`Add more descriptive keywords (target ${TITLE_IDEAL} chars)`);
        score -= 30;
    } else if (length > TITLE_MAX) {
        issues.push(`⚠️ Too long (${length} chars, maximum ${TITLE_MAX})`);
        suggestions.push(`Shorten to ${TITLE_IDEAL} chars to avoid truncation in SERPs`);
        score -= 20;
    } else if (length < TITLE_IDEAL - 5 || length > TITLE_IDEAL + 5) {
        suggestions.push(`✓ Good length, but could optimize to ~${TITLE_IDEAL} chars`);
        score -= 5;
    }

    // Keyword placement
    if (!/^(free|best|top|\d+)/i.test(title)) {
        suggestions.push('Consider starting with power words: "Free", "Best", "Top"');
        score -= 5;
    }

    // Brand presence
    if (!title.includes('100 SEO Tools') && !title.includes('100seotools')) {
        suggestions.push('Consider adding brand name for recognition');
        score -= 5;
    }

    // Duplicate words
    const words = title.toLowerCase().split(/\s+/);
    const duplicates = words.filter((word, idx) => words.indexOf(word) !== idx && word.length > 3);
    if (duplicates.length > 0) {
        issues.push(`⚠️ Duplicate words: ${[...new Set(duplicates)].join(', ')}`);
        suggestions.push('Remove duplicate words to maximize keyword diversity');
        score -= 10;
    }

    return { title, length, score: Math.max(0, score), issues, suggestions };
}

// Analyze a single meta description
function analyzeDescription(description, page) {
    const issues = [];
    const suggestions = [];
    let score = 100;

    if (!description) {
        issues.push('❌ Missing meta description');
        score = 0;
        return { description, length: 0, score, issues, suggestions };
    }

    const length = description.length;

    // Length checks
    if (length < DESC_MIN) {
        issues.push(`⚠️ Too short (${length} chars, minimum ${DESC_MIN})`);
        suggestions.push(`Expand to ${DESC_IDEAL} chars with benefits and CTAs`);
        score -= 30;
    } else if (length > DESC_MAX) {
        issues.push(`⚠️ Too long (${length} chars, maximum ${DESC_MAX})`);
        suggestions.push(`Shorten to ${DESC_IDEAL} chars to avoid truncation`);
        score -= 20;
    } else if (length < DESC_IDEAL - 10 || length > DESC_IDEAL + 5) {
        suggestions.push(`✓ Good length, but could optimize to ~${DESC_IDEAL} chars`);
        score -= 5;
    }

    // CTA presence
    if (!/\b(try|use|get|check|analyze|generate|create|discover|learn|explore|find)\b/i.test(description)) {
        suggestions.push('Add action words: "Try", "Use", "Get", "Discover"');
        score -= 10;
    }

    // Benefit/value proposition
    if (!/\b(free|instant|fast|easy|simple|powerful|best|top)\b/i.test(description)) {
        suggestions.push('Include value words: "Free", "Instant", "Easy", "Powerful"');
        score -= 10;
    }

    return { description, length, score: Math.max(0, score), issues, suggestions };
}

// Main analysis function
async function analyzeMetadata() {
    console.log('🔍 Starting SEO Metadata Analysis...\n');

    const tools = getAllToolsMeta();
    const results = [];
    const summary = {
        total: 0,
        titleIssues: 0,
        descIssues: 0,
        perfectTitles: 0,
        perfectDescs: 0,
        avgTitleScore: 0,
        avgDescScore: 0,
    };

    // Analyze each tool
    for (const tool of tools) {
        const titleAnalysis = analyzeTitle(tool.name, tool.slug);
        const descAnalysis = analyzeDescription(tool.description, tool.slug);

        summary.total++;
        if (titleAnalysis.issues.length > 0) summary.titleIssues++;
        if (descAnalysis.issues.length > 0) summary.descIssues++;
        if (titleAnalysis.score === 100) summary.perfectTitles++;
        if (descAnalysis.score === 100) summary.perfectDescs++;
        summary.avgTitleScore += titleAnalysis.score;
        summary.avgDescScore += descAnalysis.score;

        results.push({
            page: tool.slug,
            name: tool.name,
            category: tool.category,
            titleAnalysis,
            descAnalysis,
            overallScore: Math.round((titleAnalysis.score + descAnalysis.score) / 2),
        });
    }

    summary.avgTitleScore = Math.round(summary.avgTitleScore / summary.total);
    summary.avgDescScore = Math.round(summary.avgDescScore / summary.total);

    // Sort by overall score (worst first)
    results.sort((a, b) => a.overallScore - b.overallScore);

    // Generate report
    generateReport(results, summary);
}

// Generate markdown report
function generateReport(results, summary) {
    const reportPath = path.join(__dirname, '..', 'SEO_METADATA_REPORT.md');

    let report = `# SEO Metadata Analysis Report\n\n`;
    report += `**Generated**: ${new Date().toISOString()}\n`;
    report += `**Total Pages Analyzed**: ${summary.total}\n\n`;

    // Executive Summary
    report += `## Executive Summary\n\n`;
    report += `| Metric | Value |\n`;
    report += `|--------|-------|\n`;
    report += `| Average Title Score | ${summary.avgTitleScore}/100 |\n`;
    report += `| Average Description Score | ${summary.avgDescScore}/100 |\n`;
    report += `| Pages with Title Issues | ${summary.titleIssues} (${Math.round(summary.titleIssues / summary.total * 100)}%) |\n`;
    report += `| Pages with Description Issues | ${summary.descIssues} (${Math.round(summary.descIssues / summary.total * 100)}%) |\n`;
    report += `| Perfect Titles | ${summary.perfectTitles} (${Math.round(summary.perfectTitles / summary.total * 100)}%) |\n`;
    report += `| Perfect Descriptions | ${summary.perfectDescs} (${Math.round(summary.perfectDescs / summary.total * 100)}%) |\n\n`;

    // Priority Fixes (worst 20)
    report += `## 🚨 Priority Fixes (Top 20 Pages Needing Attention)\n\n`;
    const priorityFixes = results.slice(0, 20);

    for (const result of priorityFixes) {
        report += `### ${result.name}\n`;
        report += `- **Page**: /tools/${result.page}\n`;
        report += `- **Category**: ${result.category}\n`;
        report += `- **Overall Score**: ${result.overallScore}/100\n\n`;

        // Title Analysis
        report += `#### Title Analysis (Score: ${result.titleAnalysis.score}/100)\n`;
        report += `- **Current**: "${result.titleAnalysis.title}"\n`;
        report += `- **Length**: ${result.titleAnalysis.length} characters\n`;
        if (result.titleAnalysis.issues.length > 0) {
            report += `- **Issues**:\n`;
            result.titleAnalysis.issues.forEach(issue => report += `  - ${issue}\n`);
        }
        if (result.titleAnalysis.suggestions.length > 0) {
            report += `- **Suggestions**:\n`;
            result.titleAnalysis.suggestions.forEach(sug => report += `  - ${sug}\n`);
        }
        report += `\n`;

        // Description Analysis
        report += `#### Description Analysis (Score: ${result.descAnalysis.score}/100)\n`;
        report += `- **Current**: "${result.descAnalysis.description}"\n`;
        report += `- **Length**: ${result.descAnalysis.length} characters\n`;
        if (result.descAnalysis.issues.length > 0) {
            report += `- **Issues**:\n`;
            result.descAnalysis.issues.forEach(issue => report += `  - ${issue}\n`);
        }
        if (result.descAnalysis.suggestions.length > 0) {
            report += `- **Suggestions**:\n`;
            result.descAnalysis.suggestions.forEach(sug => report += `  - ${sug}\n`);
        }
        report += `\n---\n\n`;
    }

    // Category Breakdown
    report += `## 📊 Category Breakdown\n\n`;
    const categoryStats = {};
    results.forEach(r => {
        if (!categoryStats[r.category]) {
            categoryStats[r.category] = { count: 0, totalScore: 0, issues: 0 };
        }
        categoryStats[r.category].count++;
        categoryStats[r.category].totalScore += r.overallScore;
        if (r.titleAnalysis.issues.length > 0 || r.descAnalysis.issues.length > 0) {
            categoryStats[r.category].issues++;
        }
    });

    report += `| Category | Tools | Avg Score | Pages with Issues |\n`;
    report += `|----------|-------|-----------|-------------------|\n`;
    Object.entries(categoryStats).forEach(([cat, stats]) => {
        const avgScore = Math.round(stats.totalScore / stats.count);
        report += `| ${cat} | ${stats.count} | ${avgScore}/100 | ${stats.issues} |\n`;
    });
    report += `\n`;

    // Best Practices
    report += `## ✅ SEO Best Practices\n\n`;
    report += `### Title Tags\n`;
    report += `- **Optimal Length**: ${TITLE_IDEAL} characters (${TITLE_MIN}-${TITLE_MAX} acceptable)\n`;
    report += `- **Structure**: [Power Word] [Primary Keyword] | [Benefit] | [Brand]\n`;
    report += `- **Examples**:\n`;
    report += `  - "Free Keyword Density Checker | Analyze SEO Content | 100 SEO Tools"\n`;
    report += `  - "Best Meta Tag Generator | Create Perfect SEO Tags | Free Tool"\n\n`;

    report += `### Meta Descriptions\n`;
    report += `- **Optimal Length**: ${DESC_IDEAL} characters (${DESC_MIN}-${DESC_MAX} acceptable)\n`;
    report += `- **Structure**: [Benefit] + [Features] + [CTA]\n`;
    report += `- **Must Include**: Action words, value proposition, primary keyword\n`;
    report += `- **Examples**:\n`;
    report += `  - "Analyze keyword density instantly with our free tool. Get detailed reports, optimize content, and improve SEO rankings. Try it now!"\n`;
    report += `  - "Generate perfect meta tags in seconds. Free, easy-to-use tool with real-time previews. Boost your click-through rates today!"\n\n`;

    // Common Issues
    report += `## 🔧 Common Issues Found\n\n`;
    const allIssues = {};
    results.forEach(r => {
        [...r.titleAnalysis.issues, ...r.descAnalysis.issues].forEach(issue => {
            const key = issue.replace(/\(.*?\)/g, '').trim();
            allIssues[key] = (allIssues[key] || 0) + 1;
        });
    });

    const sortedIssues = Object.entries(allIssues).sort((a, b) => b[1] - a[1]);
    sortedIssues.slice(0, 10).forEach(([issue, count]) => {
        report += `- ${issue}: **${count} pages**\n`;
    });
    report += `\n`;

    // Write report
    fs.writeFileSync(reportPath, report, 'utf-8');
    console.log(`✅ Report generated: ${reportPath}\n`);
    console.log(`📊 Summary:`);
    console.log(`   - Total pages: ${summary.total}`);
    console.log(`   - Avg title score: ${summary.avgTitleScore}/100`);
    console.log(`   - Avg description score: ${summary.avgDescScore}/100`);
    console.log(`   - Pages needing attention: ${results.filter(r => r.overallScore < 80).length}`);
}

// Run analysis
analyzeMetadata().catch(console.error);
