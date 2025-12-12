/**
 * Schema Validation Test Suite - Production Version
 * Tests JSON-LD structured data on live site
 * Run with: node tests/schema-validator-production.test.mjs
 */

import { JSDOM } from 'jsdom';

// Test against production site
const BASE_URL = 'https://www.100seotools.com';

// Test configuration
const TEST_PAGES = [
    {
        url: '/',
        name: 'Homepage',
        expectedSchemas: ['WebSite', 'WebPage'],
        requiredProperties: {
            WebSite: ['name', 'url', 'publisher'],
            WebPage: ['name', 'description', 'url']
        }
    },
    {
        url: '/tools/keyword-suggestion-tool',
        name: 'Tool Page',
        expectedSchemas: ['SoftwareApplication', 'BreadcrumbList'],
        requiredProperties: {
            SoftwareApplication: ['name', 'description', 'url', 'applicationCategory'],
            BreadcrumbList: ['itemListElement']
        }
    },
    {
        url: '/blog/seo-basics',
        name: 'Blog Post',
        expectedSchemas: ['Article'],
        requiredProperties: {
            Article: ['headline', 'author', 'publisher', 'datePublished']
        }
    },
    {
        url: '/category/keyword-research',
        name: 'Category Page',
        expectedSchemas: ['CollectionPage', 'BreadcrumbList'],
        requiredProperties: {
            CollectionPage: ['name', 'url']
        }
    },
    {
        url: '/about',
        name: 'About Page',
        expectedSchemas: ['AboutPage', 'FAQPage'],
        requiredProperties: {
            AboutPage: ['mainEntityOfPage', 'headline']
        }
    },
    {
        url: '/author',
        name: 'Author Page',
        expectedSchemas: ['Person', 'BreadcrumbList'],
        requiredProperties: {
            Person: ['name', 'jobTitle', 'url']
        }
    },
    {
        url: '/contact',
        name: 'Contact Page (NEW)',
        expectedSchemas: ['ContactPage', 'BreadcrumbList', 'FAQPage'],
        requiredProperties: {
            ContactPage: ['name']
        }
    },
    {
        url: '/privacy',
        name: 'Privacy Page (NEW)',
        expectedSchemas: ['WebPage', 'BreadcrumbList'],
        requiredProperties: {
            WebPage: ['name', 'url', 'publisher']
        }
    },
    {
        url: '/terms',
        name: 'Terms Page (NEW)',
        expectedSchemas: ['WebPage', 'BreadcrumbList'],
        requiredProperties: {
            WebPage: ['name', 'url', 'publisher']
        }
    },
    {
        url: '/faq',
        name: 'FAQ Page',
        expectedSchemas: ['FAQPage', 'WebPage', 'BreadcrumbList'],
        requiredProperties: {
            FAQPage: ['mainEntity']
        }
    }
];

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    bold: '\x1b[1m'
};

// Test results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const errors = [];
const warnings = [];

/**
 * Fetch and parse HTML from URL
 */
async function fetchPage(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const html = await response.text();
        return new JSDOM(html);
    } catch (error) {
        throw new Error(`Failed to fetch ${url}: ${error.message}`);
    }
}

/**
 * Extract JSON-LD schemas from page
 */
function extractSchemas(dom) {
    const scripts = dom.window.document.querySelectorAll('script[type="application/ld+json"]');
    const schemas = [];

    scripts.forEach(script => {
        try {
            const data = JSON.parse(script.textContent);
            schemas.push(data);
        } catch (error) {
            errors.push(`Invalid JSON-LD: ${error.message}`);
        }
    });

    return schemas;
}

/**
 * Get all schema types from extracted schemas
 */
function getSchemaTypes(schemas) {
    const types = new Set();

    schemas.forEach(schema => {
        if (schema['@type']) {
            types.add(schema['@type']);
        }
        if (schema['@graph']) {
            schema['@graph'].forEach(item => {
                if (item['@type']) {
                    types.add(item['@type']);
                }
            });
        }
    });

    return Array.from(types);
}

/**
 * Find schema by type
 */
function findSchemaByType(schemas, type) {
    for (const schema of schemas) {
        if (schema['@type'] === type) {
            return schema;
        }
        if (schema['@graph']) {
            const found = schema['@graph'].find(item => item['@type'] === type);
            if (found) return found;
        }
    }
    return null;
}

/**
 * Validate required properties
 */
function validateProperties(schema, requiredProps) {
    const missing = [];

    requiredProps.forEach(prop => {
        if (!schema[prop]) {
            missing.push(prop);
        }
    });

    return missing;
}

/**
 * Validate Organization entity consistency
 */
function validateOrganization(schemas) {
    const issues = [];
    const orgName = '100 SEO Tools';

    schemas.forEach(schema => {
        const checkOrg = (obj) => {
            if (obj && obj['@type'] === 'Organization') {
                if (obj.name !== orgName) {
                    issues.push(`Organization name mismatch: "${obj.name}" (expected "${orgName}")`);
                }
            }
            // Check nested objects
            Object.values(obj || {}).forEach(value => {
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    checkOrg(value);
                }
            });
        };

        checkOrg(schema);
        if (schema['@graph']) {
            schema['@graph'].forEach(checkOrg);
        }
    });

    return issues;
}

/**
 * Test a single page
 */
async function testPage(pageConfig) {
    const url = `${BASE_URL}${pageConfig.url}`;
    console.log(`\n${colors.cyan}${colors.bold}Testing: ${pageConfig.name}${colors.reset}`);
    console.log(`${colors.blue}URL: ${url}${colors.reset}`);

    try {
        // Fetch page
        const dom = await fetchPage(url);
        const schemas = extractSchemas(dom);

        if (schemas.length === 0) {
            totalTests++;
            failedTests++;
            console.log(`${colors.red}✗ FAIL: No JSON-LD schemas found${colors.reset}`);
            errors.push(`${pageConfig.name}: No schemas found`);
            return;
        }

        console.log(`${colors.green}✓ Found ${schemas.length} JSON-LD block(s)${colors.reset}`);

        // Check schema types
        const foundTypes = getSchemaTypes(schemas);
        console.log(`${colors.blue}Schema types: ${foundTypes.join(', ')}${colors.reset}`);

        // Validate expected schemas
        let pageErrors = [];
        pageConfig.expectedSchemas.forEach(expectedType => {
            totalTests++;
            const schema = findSchemaByType(schemas, expectedType);

            if (!schema) {
                failedTests++;
                pageErrors.push(`Missing schema: ${expectedType}`);
                console.log(`${colors.red}✗ Missing: ${expectedType}${colors.reset}`);
            } else {
                passedTests++;
                console.log(`${colors.green}✓ Found: ${expectedType}${colors.reset}`);

                // Validate required properties
                if (pageConfig.requiredProperties && pageConfig.requiredProperties[expectedType]) {
                    const missing = validateProperties(
                        schema,
                        pageConfig.requiredProperties[expectedType]
                    );

                    if (missing.length > 0) {
                        warnings.push(`${pageConfig.name} - ${expectedType} missing properties: ${missing.join(', ')}`);
                        console.log(`${colors.yellow}  ⚠ Missing properties: ${missing.join(', ')}${colors.reset}`);
                    } else {
                        console.log(`${colors.green}  ✓ All required properties present${colors.reset}`);
                    }
                }
            }
        });

        // Validate Organization consistency
        const orgIssues = validateOrganization(schemas);
        if (orgIssues.length > 0) {
            warnings.push(...orgIssues.map(issue => `${pageConfig.name}: ${issue}`));
            orgIssues.forEach(issue => {
                console.log(`${colors.yellow}⚠ ${issue}${colors.reset}`);
            });
        } else {
            console.log(`${colors.green}✓ Organization entity consistent${colors.reset}`);
        }

        if (pageErrors.length > 0) {
            errors.push(`${pageConfig.name}:\n  - ${pageErrors.join('\n  - ')}`);
        }

    } catch (error) {
        totalTests++;
        failedTests++;
        console.log(`${colors.red}✗ ERROR: ${error.message}${colors.reset}`);
        errors.push(`${pageConfig.name}: ${error.message}`);
    }
}

/**
 * Run all tests
 */
async function runTests() {
    console.log(`${colors.bold}${colors.cyan}
╔════════════════════════════════════════════════════════════╗
║      JSON-LD Schema Validation - Production Site          ║
║      Testing: ${BASE_URL}              ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);

    for (const pageConfig of TEST_PAGES) {
        await testPage(pageConfig);
    }

    // Print summary
    console.log(`\n${colors.bold}${colors.cyan}
╔════════════════════════════════════════════════════════════╗
║                     TEST SUMMARY                           ║
╚════════════════════════════════════════════════════════════╝
${colors.reset}`);

    console.log(`${colors.bold}Total Tests:${colors.reset} ${totalTests}`);
    console.log(`${colors.green}${colors.bold}Passed:${colors.reset} ${passedTests}`);
    console.log(`${colors.red}${colors.bold}Failed:${colors.reset} ${failedTests}`);

    const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;
    console.log(`${colors.bold}Success Rate:${colors.reset} ${successRate}%`);

    if (warnings.length > 0) {
        console.log(`\n${colors.yellow}${colors.bold}WARNINGS (${warnings.length}):${colors.reset}`);
        warnings.forEach(warning => {
            console.log(`${colors.yellow}⚠ ${warning}${colors.reset}`);
        });
    }

    if (errors.length > 0) {
        console.log(`\n${colors.red}${colors.bold}ERRORS (${errors.length}):${colors.reset}`);
        errors.forEach(error => {
            console.log(`${colors.red}${error}${colors.reset}`);
        });
    }

    if (failedTests === 0 && errors.length === 0) {
        console.log(`\n${colors.green}${colors.bold}✓ All schemas validated successfully!${colors.reset}`);
    }

    console.log(`\n${colors.cyan}${colors.bold}Validation Complete!${colors.reset}\n`);

    // Exit with appropriate code
    process.exit(failedTests > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
    console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
    process.exit(1);
});
