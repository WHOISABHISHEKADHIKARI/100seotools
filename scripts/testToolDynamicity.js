// Automated Dynamicity & Interactivity Testing for All Tools
// Run: node scripts/testToolDynamicity.js

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { tools } from '../tools/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

class DynamicityTester {
    constructor() {
        this.results = {};
        this.browser = null;
        this.page = null;
    }

    async init() {
        this.browser = await chromium.launch({ headless: true });
        this.page = await this.browser.newPage();

        // Listen for console errors
        this.page.on('console', msg => {
            if (msg.type() === 'error') {
                console.error(`Console Error: ${msg.text()}`);
            }
        });
    }

    async testTool(tool) {
        console.log(`\n🧪 Testing: ${tool.name} (${tool.slug})`);

        const toolUrl = `${BASE_URL}/tools/${tool.slug}`;
        const testResult = {
            slug: tool.slug,
            name: tool.name,
            category: tool.category,
            url: toolUrl,
            timestamp: new Date().toISOString(),
            tests: {
                realTimeUpdates: {},
                interactiveElements: {},
                ajaxFunctionality: {},
                stateManagement: {}
            },
            issues: [],
            score: 0,
            status: 'pending'
        };

        try {
            await this.page.goto(toolUrl, { waitUntil: 'networkidle' });

            // Test 2.1: Real-Time Updates
            testResult.tests.realTimeUpdates = await this.testRealTimeUpdates();

            // Test 2.2: Interactive Elements
            testResult.tests.interactiveElements = await this.testInteractiveElements();

            // Test 2.3: AJAX/Async Functionality
            testResult.tests.ajaxFunctionality = await this.testAjaxFunctionality();

            // Test 2.4: State Management
            testResult.tests.stateManagement = await this.testStateManagement();

            // Calculate overall score
            testResult.score = this.calculateScore(testResult.tests);
            testResult.status = testResult.score >= 80 ? 'pass' : testResult.score >= 60 ? 'warning' : 'fail';

        } catch (error) {
            testResult.status = 'error';
            testResult.issues.push({
                severity: 'critical',
                type: 'page_load',
                message: `Failed to load page: ${error.message}`
            });
        }

        this.results[tool.slug] = testResult;
        return testResult;
    }

    async testRealTimeUpdates() {
        const results = {
            livePreview: false,
            characterCounter: false,
            realTimeValidation: false,
            dynamicLoading: false,
            smoothTransitions: false,
            score: 0
        };

        try {
            // Test for input fields
            const inputs = await this.page.$$('input[type="text"], textarea');

            if (inputs.length > 0) {
                const firstInput = inputs[0];

                // Test character counter
                const counterBefore = await this.page.textContent('.character-count, .word-count, [class*="count"]').catch(() => null);
                await firstInput.fill('Test input for character counting');
                await this.page.waitForTimeout(500);
                const counterAfter = await this.page.textContent('.character-count, .word-count, [class*="count"]').catch(() => null);

                if (counterBefore !== counterAfter) {
                    results.characterCounter = true;
                    results.score += 20;
                    console.log(`✅ Character counter working: ${counterBefore} -> ${counterAfter}`);
                }

                // Test live preview
                const previewBefore = await this.page.textContent('.preview, .output, [class*="preview"]').catch(() => null);
                await firstInput.fill('Updated test input for preview');
                await this.page.waitForTimeout(1500); // Wait longer for API calls/debounce
                const previewAfter = await this.page.textContent('.preview, .output, [class*="preview"]').catch(() => null);

                if (previewAfter && previewBefore !== previewAfter) {
                    results.livePreview = true;
                    results.score += 20;
                    console.log(`✅ Live preview working: ${previewAfter?.substring(0, 30)}...`);
                } else if (previewAfter && !previewBefore) {
                    results.livePreview = true;
                    results.score += 20;
                    console.log(`✅ Live preview appeared: ${previewAfter?.substring(0, 30)}...`);
                }

                // Test real-time validation
                const validationMessage = await this.page.$('.error, .warning, .validation, [class*="error"]');
                if (validationMessage) {
                    results.realTimeValidation = true;
                    results.score += 20;
                }
            }

            // Test for loading states
            const loadingIndicators = await this.page.$$('.loading, .spinner, [class*="loading"]');
            if (loadingIndicators.length > 0) {
                results.dynamicLoading = true;
                results.score += 20;
            }

            // Test for transitions/animations
            const animatedElements = await this.page.$$('[class*="transition"], [class*="animate"]');
            if (animatedElements.length > 0) {
                results.smoothTransitions = true;
                results.score += 20;
            }

        } catch (error) {
            console.error(`Real-time updates test error: ${error.message}`);
        }

        return results;
    }

    async testInteractiveElements() {
        const results = {
            elements: [],
            totalElements: 0,
            workingElements: 0,
            issues: [],
            score: 0
        };

        try {
            // Test buttons
            const buttons = await this.page.$$('button, [role="button"]');
            results.totalElements += buttons.length;

            for (const button of buttons) {
                const buttonText = await button.textContent();
                const isVisible = await button.isVisible();
                const isEnabled = await button.isEnabled();

                const elementResult = {
                    type: 'button',
                    text: buttonText.trim(),
                    visible: isVisible,
                    enabled: isEnabled,
                    working: false
                };

                if (isVisible && isEnabled) {
                    try {
                        // Check hover state
                        await button.hover();
                        const hasHoverEffect = await this.page.evaluate((btn) => {
                            const styles = window.getComputedStyle(btn);
                            return styles.cursor === 'pointer';
                        }, button);

                        if (hasHoverEffect) {
                            elementResult.working = true;
                            results.workingElements++;
                        }
                    } catch (error) {
                        elementResult.error = error.message;
                        results.issues.push({
                            element: buttonText.trim(),
                            issue: 'Hover test failed',
                            severity: 'low'
                        });
                    }
                }

                results.elements.push(elementResult);
            }

            // Test copy buttons specifically
            const copyButtons = await this.page.$$('button:has-text("Copy"), [aria-label*="copy"]');
            for (const copyBtn of copyButtons) {
                try {
                    await copyBtn.click();
                    await this.page.waitForTimeout(100);

                    // Check for success feedback (sync with ToolRunner.js copy-feedback class)
                    const successMessage = await this.page.$('.success, .copied, .copy-feedback, [class*="success"]');
                    if (successMessage) {
                        results.workingElements++;
                    }
                } catch (error) {
                    results.issues.push({
                        element: 'Copy button',
                        issue: 'Click failed or no feedback',
                        severity: 'medium'
                    });
                }
            }

            // Test download buttons
            const downloadButtons = await this.page.$$('button:has-text("Download"), [aria-label*="download"]');
            results.totalElements += downloadButtons.length;

            // Test form inputs
            const inputs = await this.page.$$('input, textarea, select');
            results.totalElements += inputs.length;

            for (const input of inputs) {
                const isVisible = await input.isVisible();
                const isEnabled = await input.isEnabled();

                if (isVisible && isEnabled) {
                    results.workingElements++;
                }
            }

            // Calculate score
            if (results.totalElements > 0) {
                results.score = Math.round((results.workingElements / results.totalElements) * 100);
            }

        } catch (error) {
            console.error(`Interactive elements test error: ${error.message}`);
        }

        return results;
    }

    async testAjaxFunctionality() {
        const results = {
            ajaxDetected: false,
            responseTime: 0,
            consoleErrors: [],
            networkErrors: [],
            loadingIndicators: false,
            errorHandling: false,
            score: 0
        };

        try {
            // Monitor network requests
            const requests = [];
            this.page.on('request', request => {
                if (request.resourceType() === 'xhr' || request.resourceType() === 'fetch') {
                    requests.push({
                        url: request.url(),
                        method: request.method(),
                        timestamp: Date.now()
                    });
                }
            });

            // Monitor console errors
            this.page.on('console', msg => {
                if (msg.type() === 'error') {
                    results.consoleErrors.push(msg.text());
                }
            });

            // Try to trigger the tool's main action
            const actionButton = await this.page.$('button[type="submit"], button:has-text("Generate"), button:has-text("Check"), button:has-text("Analyze"), button:has-text("Optimize"), button:has-text("Calculate"), button:has-text("Get Suggestions"), button:has-text("Analyze Keyword Density")');

            if (actionButton) {
                // Disable Live Preview to ensure the click triggers a fresh AJAX request that we can monitor
                const livePreviewCheckbox = await this.page.$('input[type="checkbox"]');
                if (livePreviewCheckbox) {
                    const isChecked = await livePreviewCheckbox.isChecked();
                    if (isChecked) {
                        await livePreviewCheckbox.uncheck();
                        await this.page.waitForTimeout(500);
                    }
                }

                const startTime = Date.now();

                // Check for loading indicator before click
                const loadingBefore = await this.page.$('.loading, .spinner, [class*="loading"]');

                await actionButton.click();

                // Wait for either a network request or a timeout
                await this.page.waitForTimeout(1000);

                const endTime = Date.now();
                results.responseTime = endTime - startTime;

                if (requests.length > 0) {
                    results.ajaxDetected = true;
                    results.score += 25;
                    console.log(`✅ AJAX detected: ${requests[0].url}`);
                }

                // Check for error handling
                const errorMessage = await this.page.$('.error, .alert-error, [role="alert"]');
                if (errorMessage || results.consoleErrors.length === 0) {
                    results.errorHandling = true;
                    results.score += 25;
                }

                // Score based on response time
                if (results.responseTime < 1000) {
                    results.score += 25;
                } else if (results.responseTime < 3000) {
                    results.score += 15;
                }
            }

        } catch (error) {
            console.error(`AJAX functionality test error: ${error.message}`);
        }

        return results;
    }

    async testStateManagement() {
        const results = {
            inputsPersist: false,
            sessionStorage: false,
            multipleInstances: false,
            backForwardWorks: false,
            score: 0
        };

        try {
            // Fill in some inputs
            const inputs = await this.page.$$('input[type="text"], textarea');
            const testValue = 'State persistence test';

            if (inputs.length > 0) {
                await inputs[0].fill(testValue);

                // Check session and local storage
                const hasStorage = await this.page.evaluate(() => {
                    return sessionStorage.length > 0 || localStorage.length > 0;
                });

                if (hasStorage) {
                    results.sessionStorage = true;
                    results.score += 25;
                }

                // Test back/forward navigation
                await this.page.goBack();
                await this.page.waitForTimeout(1000);
                await this.page.goForward();
                await this.page.waitForTimeout(1000);

                // Refresh input handles after navigation!
                const inputsAfterNav = await this.page.$$('input[type="text"], textarea');
                if (inputsAfterNav.length > 0) {
                    const valueAfterNavigation = await inputsAfterNav[0].inputValue();
                    if (valueAfterNavigation === testValue) {
                        results.backForwardWorks = true;
                        results.inputsPersist = true;
                        results.score += 50;
                        console.log(`✅ State persistence working after navigation.`);
                    }
                }

                // Test multiple instances (open in new tab)
                const newPage = await this.browser.newPage();
                await newPage.goto(this.page.url());
                const newInputs = await newPage.$$('input[type="text"], textarea');

                if (newInputs.length > 0) {
                    const newValue = await newInputs[0].inputValue();
                    if (newValue !== testValue) {
                        results.multipleInstances = true;
                        results.score += 25;
                    }
                }

                await newPage.close();
            }

        } catch (error) {
            console.error(`State management test error: ${error.message}`);
        }

        return results;
    }

    calculateScore(tests) {
        const scores = [
            tests.realTimeUpdates.score || 0,
            tests.interactiveElements.score || 0,
            tests.ajaxFunctionality.score || 0,
            tests.stateManagement.score || 0
        ];

        return Math.round(scores.reduce((a, b) => a + b, 0) / 4);
    }

    async generateReport() {
        const reportPath = path.join(process.cwd(), 'DYNAMICITY_QA_REPORT.md');

        let report = `# Dynamicity & Interactivity QA Report\n\n`;
        report += `**Generated**: ${new Date().toISOString()}\n`;
        report += `**Total Tools Tested**: ${Object.keys(this.results).length}\n\n`;

        // Summary statistics
        const totalTools = Object.keys(this.results).length;
        const passedTools = Object.values(this.results).filter(r => r.status === 'pass').length;
        const warningTools = Object.values(this.results).filter(r => r.status === 'warning').length;
        const failedTools = Object.values(this.results).filter(r => r.status === 'fail').length;
        const errorTools = Object.values(this.results).filter(r => r.status === 'error').length;

        report += `## Summary\n\n`;
        report += `| Status | Count | Percentage |\n`;
        report += `|--------|-------|------------|\n`;
        report += `| ✅ Pass (80-100%) | ${passedTools} | ${Math.round(passedTools / totalTools * 100)}% |\n`;
        report += `| ⚠️ Warning (60-79%) | ${warningTools} | ${Math.round(warningTools / totalTools * 100)}% |\n`;
        report += `| ❌ Fail (<60%) | ${failedTools} | ${Math.round(failedTools / totalTools * 100)}% |\n`;
        report += `| 🔴 Error | ${errorTools} | ${Math.round(errorTools / totalTools * 100)}% |\n\n`;

        // Detailed results by category
        const byCategory = {};
        Object.values(this.results).forEach(result => {
            if (!byCategory[result.category]) {
                byCategory[result.category] = [];
            }
            byCategory[result.category].push(result);
        });

        report += `## Results by Category\n\n`;

        for (const [category, results] of Object.entries(byCategory)) {
            report += `### ${category}\n\n`;
            report += `| Tool | Score | Status | Issues |\n`;
            report += `|------|-------|--------|--------|\n`;

            results.forEach(result => {
                const statusIcon = result.status === 'pass' ? '✅' :
                    result.status === 'warning' ? '⚠️' :
                        result.status === 'fail' ? '❌' : '🔴';
                report += `| ${result.name} | ${result.score}/100 | ${statusIcon} ${result.status} | ${result.issues.length} |\n`;
            });

            report += `\n`;
        }

        // Detailed test results
        report += `## Detailed Test Results\n\n`;

        for (const [slug, result] of Object.entries(this.results)) {
            report += `### ${result.name}\n\n`;
            report += `**URL**: ${result.url}\n`;
            report += `**Category**: ${result.category}\n`;
            report += `**Overall Score**: ${result.score}/100\n`;
            report += `**Status**: ${result.status}\n\n`;

            // Real-time updates
            report += `#### Test 2.1: Real-Time Updates (Score: ${result.tests.realTimeUpdates.score}/100)\n\n`;
            report += `| Feature | Status |\n`;
            report += `|---------|--------|\n`;
            report += `| Live Preview | ${result.tests.realTimeUpdates.livePreview ? '✅' : '❌'} |\n`;
            report += `| Character Counter | ${result.tests.realTimeUpdates.characterCounter ? '✅' : '❌'} |\n`;
            report += `| Real-time Validation | ${result.tests.realTimeUpdates.realTimeValidation ? '✅' : '❌'} |\n`;
            report += `| Dynamic Loading | ${result.tests.realTimeUpdates.dynamicLoading ? '✅' : '❌'} |\n`;
            report += `| Smooth Transitions | ${result.tests.realTimeUpdates.smoothTransitions ? '✅' : '❌'} |\n\n`;

            // Interactive elements
            report += `#### Test 2.2: Interactive Elements (Score: ${result.tests.interactiveElements.score}/100)\n\n`;
            report += `- Total Elements: ${result.tests.interactiveElements.totalElements}\n`;
            report += `- Working Elements: ${result.tests.interactiveElements.workingElements}\n`;
            report += `- Issues Found: ${result.tests.interactiveElements.issues.length}\n\n`;

            if (result.tests.interactiveElements.issues.length > 0) {
                report += `**Issues**:\n`;
                result.tests.interactiveElements.issues.forEach(issue => {
                    report += `- ${issue.element}: ${issue.issue} (${issue.severity})\n`;
                });
                report += `\n`;
            }

            // AJAX functionality
            report += `#### Test 2.3: AJAX/Async Functionality (Score: ${result.tests.ajaxFunctionality.score}/100)\n\n`;
            report += `| Feature | Status |\n`;
            report += `|---------|--------|\n`;
            report += `| AJAX Detected | ${result.tests.ajaxFunctionality.ajaxDetected ? '✅' : '❌'} |\n`;
            report += `| Loading Indicators | ${result.tests.ajaxFunctionality.loadingIndicators ? '✅' : '❌'} |\n`;
            report += `| Error Handling | ${result.tests.ajaxFunctionality.errorHandling ? '✅' : '❌'} |\n`;
            report += `| Response Time | ${result.tests.ajaxFunctionality.responseTime}ms |\n`;
            report += `| Console Errors | ${result.tests.ajaxFunctionality.consoleErrors.length} |\n\n`;

            // State management
            report += `#### Test 2.4: State Management (Score: ${result.tests.stateManagement.score}/100)\n\n`;
            report += `| Feature | Status |\n`;
            report += `|---------|--------|\n`;
            report += `| Inputs Persist | ${result.tests.stateManagement.inputsPersist ? '✅' : '❌'} |\n`;
            report += `| Session Storage | ${result.tests.stateManagement.sessionStorage ? '✅' : '❌'} |\n`;
            report += `| Multiple Instances | ${result.tests.stateManagement.multipleInstances ? '✅' : '❌'} |\n`;
            report += `| Back/Forward Works | ${result.tests.stateManagement.backForwardWorks ? '✅' : '❌'} |\n\n`;

            // Overall issues
            if (result.issues.length > 0) {
                report += `#### Critical Issues\n\n`;
                result.issues.forEach(issue => {
                    report += `- **${issue.type}** (${issue.severity}): ${issue.message}\n`;
                });
                report += `\n`;
            }

            report += `---\n\n`;
        }

        // Recommendations
        report += `## Recommendations\n\n`;
        report += `### High Priority Fixes\n\n`;

        const failedResults = Object.values(this.results).filter(r => r.status === 'fail' || r.status === 'error');
        if (failedResults.length > 0) {
            failedResults.forEach(result => {
                report += `#### ${result.name}\n`;
                report += `- Score: ${result.score}/100\n`;
                report += `- Issues: ${result.issues.length}\n`;
                report += `- Recommended Actions:\n`;

                if (result.tests.realTimeUpdates.score < 50) {
                    report += `  - Add real-time preview functionality\n`;
                    report += `  - Implement character/word counters\n`;
                    report += `  - Add live validation feedback\n`;
                }

                if (result.tests.interactiveElements.score < 50) {
                    report += `  - Fix non-responsive buttons\n`;
                    report += `  - Add hover states and visual feedback\n`;
                    report += `  - Ensure all interactive elements are accessible\n`;
                }

                if (result.tests.ajaxFunctionality.score < 50) {
                    report += `  - Add loading indicators\n`;
                    report += `  - Implement proper error handling\n`;
                    report += `  - Optimize response times\n`;
                }

                if (result.tests.stateManagement.score < 50) {
                    report += `  - Implement session storage for inputs\n`;
                    report += `  - Ensure state persists across navigation\n`;
                    report += `  - Fix multi-instance conflicts\n`;
                }

                report += `\n`;
            });
        }

        fs.writeFileSync(reportPath, report, 'utf8');
        console.log(`\n📄 Report saved to: ${reportPath}`);
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

// Main execution
async function main() {
    const tester = new DynamicityTester();
    await tester.init();

    const args = process.argv.slice(2);
    let toolsToTest = tools;

    if (args.length > 0) {
        const targetSlugs = [];
        for (let i = 0; i < args.length; i++) {
            if (args[i] === '--tool' && args[i + 1]) {
                targetSlugs.push(args[i + 1]);
                i++;
            }
        }
        if (targetSlugs.length > 0) {
            toolsToTest = tools.filter(t => targetSlugs.includes(t.slug));
        }
    } else {
        // Default to running ALL tools if no specific tool is requested
        console.log('Running functionality tests for ALL tools by default.');
        toolsToTest = tools;
    }

    console.log('🚀 Starting Dynamicity & Interactivity Tests...\n');
    console.log(`Testing ${toolsToTest.length} tools...\n`);

    for (const tool of toolsToTest) {
        await tester.testTool(tool);
    }

    await tester.generateReport();
    await tester.close();

    console.log('\n✅ Testing complete!');
}

main().catch(console.error);
