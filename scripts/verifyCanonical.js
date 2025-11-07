/**
 * Canonical Implementation Verification Script
 * Tests alternative page canonical implementation for SEO compliance
 *
 * Usage: node scripts/verifyCanonical.js
 *
 * This script verifies:
 * - Canonical tag implementation
 * - Meta robots tags (noindex, follow)
 * - HTTP headers (X-Robots-Tag, Link)
 * - Overall SEO compliance
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const ALTERNATIVE_PATH = '/alternative';
const PRIMARY_PATH = '/tools/keyword-density-checker';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Test results storage
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  details: []
};

/**
 * Make HTTP request and return headers + body
 */
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const req = protocol.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.abort();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Extract meta tags from HTML body
 */
function extractMetaTags(html) {
  const tags = {};

  // Extract canonical link
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  if (canonicalMatch) {
    const hrefMatch = canonicalMatch[0].match(/href=["']([^"']+)["']/i);
    if (hrefMatch) {
      tags.canonical = hrefMatch[1];
    }
  }

  // Extract meta robots
  const robotsMatch = html.match(/<meta[^>]+name=["']robots["'][^>]*>/i);
  if (robotsMatch) {
    const contentMatch = robotsMatch[0].match(/content=["']([^"']+)["']/i);
    if (contentMatch) {
      tags.robots = contentMatch[1];
    }
  }

  return tags;
}

/**
 * Test canonical implementation
 */
async function testCanonicalImplementation() {
  console.log(`${colors.blue}🔍 Testing Canonical Implementation${colors.reset}`);
  console.log(`${colors.blue}====================================${colors.reset}\n`);

  try {
    // Test alternative page
    const alternativeUrl = `${BASE_URL}${ALTERNATIVE_PATH}`;
    console.log(`${colors.yellow}Testing Alternative Page: ${alternativeUrl}${colors.reset}`);

    const altResponse = await makeRequest(alternativeUrl);
    const altMetaTags = extractMetaTags(altResponse.body);
    const altHeaders = altResponse.headers;

    // Test 1: Alternative page should have canonical pointing to primary
    const expectedCanonical = `${BASE_URL}${PRIMARY_PATH}`;
    if (altMetaTags.canonical === expectedCanonical) {
      console.log(`${colors.green}✅ Alternative page canonical points to primary: ${altMetaTags.canonical}${colors.reset}`);
      results.passed++;
    } else {
      console.log(`${colors.red}❌ Alternative page canonical incorrect. Expected: ${expectedCanonical}, Got: ${altMetaTags.canonical}${colors.reset}`);
      results.failed++;
    }

    // Test 2: Alternative page should have noindex, follow
    if (altMetaTags.robots && altMetaTags.robots.includes('noindex') && altMetaTags.robots.includes('follow')) {
      console.log(`${colors.green}✅ Alternative page has correct robots meta: ${altMetaTags.robots}${colors.reset}`);
      results.passed++;
    } else {
      console.log(`${colors.red}❌ Alternative page robots meta incorrect. Expected: noindex, follow, Got: ${altMetaTags.robots}${colors.reset}`);
      results.failed++;
    }

    // Test 3: Alternative page should have X-Robots-Tag header
    const xRobotsTag = altHeaders['x-robots-tag'];
    if (xRobotsTag && xRobotsTag.includes('noindex') && xRobotsTag.includes('follow')) {
      console.log(`${colors.green}✅ Alternative page has X-Robots-Tag header: ${xRobotsTag}${colors.reset}`);
      results.passed++;
    } else {
      console.log(`${colors.red}❌ Alternative page missing correct X-Robots-Tag header. Got: ${xRobotsTag}${colors.reset}`);
      results.failed++;
    }

    // Test 4: Alternative page should have Link header with canonical
    const linkHeader = altHeaders['link'];
    if (linkHeader && linkHeader.includes('rel="canonical"') && linkHeader.includes(expectedCanonical)) {
      console.log(`${colors.green}✅ Alternative page has Link header with canonical: ${linkHeader}${colors.reset}`);
      results.passed++;
    } else {
      console.log(`${colors.red}❌ Alternative page missing Link header with canonical. Got: ${linkHeader}${colors.reset}`);
      results.failed++;
    }

    // Test primary page
    console.log(`\n${colors.yellow}Testing Primary Page: ${BASE_URL}${PRIMARY_PATH}${colors.reset}`);
    const primaryResponse = await makeRequest(`${BASE_URL}${PRIMARY_PATH}`);
    const primaryMetaTags = extractMetaTags(primaryResponse.body);

    // Test 5: Primary page should have self-referencing canonical
    const primaryCanonical = `${BASE_URL}${PRIMARY_PATH}`;
    if (primaryMetaTags.canonical === primaryCanonical) {
      console.log(`${colors.green}✅ Primary page has self-referencing canonical: ${primaryMetaTags.canonical}${colors.reset}`);
      results.passed++;
    } else {
      console.log(`${colors.red}❌ Primary page canonical incorrect. Expected: ${primaryCanonical}, Got: ${primaryMetaTags.canonical}${colors.reset}`);
      results.failed++;
    }

    // Test 6: Primary page should be indexable (no noindex)
    if (!primaryMetaTags.robots || !primaryMetaTags.robots.includes('noindex')) {
      console.log(`${colors.green}✅ Primary page is indexable (no noindex directive)${colors.reset}`);
      results.passed++;
    } else {
      console.log(`${colors.red}❌ Primary page incorrectly has noindex directive: ${primaryMetaTags.robots}${colors.reset}`);
      results.failed++;
    }

  } catch (error) {
    console.log(`${colors.red}❌ Error during canonical testing: ${error.message}${colors.reset}`);
    results.failed++;
  }
}

/**
 * Test structured data implementation
 */
async function testStructuredData() {
  console.log(`\n${colors.blue}🔍 Testing Structured Data${colors.reset}`);
  console.log(`${colors.blue}==========================${colors.reset}\n`);

  try {
    const alternativeUrl = `${BASE_URL}${ALTERNATIVE_PATH}`;
    const response = await makeRequest(alternativeUrl);

    // Extract JSON-LD structured data
    const jsonLdMatches = response.body.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);

    if (jsonLdMatches && jsonLdMatches.length > 0) {
      console.log(`${colors.green}✅ Found ${jsonLdMatches.length} JSON-LD structured data blocks${colors.reset}`);
      results.passed++;

      // Check if structured data contains canonical references
      let hasCanonicalRefs = false;
      jsonLdMatches.forEach(script => {
        try {
          const jsonData = JSON.parse(script.replace(/<[^>]*>/g, ''));
          const jsonStr = JSON.stringify(jsonData);
          if (jsonStr.includes('100seotools.com/tools/keyword-density-checker')) {
            hasCanonicalRefs = true;
          }
        } catch (e) {
          // Invalid JSON, skip
        }
      });

      if (hasCanonicalRefs) {
        console.log(`${colors.green}✅ Structured data contains canonical references to primary page${colors.reset}`);
        results.passed++;
      } else {
        console.log(`${colors.yellow}⚠️  Structured data may not contain canonical references (check manually)${colors.reset}`);
        results.warnings++;
      }

    } else {
      console.log(`${colors.yellow}⚠️  No JSON-LD structured data found${colors.reset}`);
      results.warnings++;
    }

  } catch (error) {
    console.log(`${colors.red}❌ Error during structured data testing: ${error.message}${colors.reset}`);
    results.failed++;
  }
}

/**
 * Test Open Graph and Twitter Card implementation
 */
async function testSocialMediaTags() {
  console.log(`\n${colors.blue}🔍 Testing Social Media Tags${colors.reset}`);
  console.log(`${colors.blue}============================${colors.reset}\n`);

  try {
    const alternativeUrl = `${BASE_URL}${ALTERNATIVE_PATH}`;
    const response = await makeRequest(alternativeUrl);

    // Extract Open Graph tags
    const ogTags = {};
    const ogMatches = response.body.match(/<meta[^>]+property=["']og:([^"']+)["'][^>]*>/gi);
    if (ogMatches) {
      ogMatches.forEach(tag => {
        const propertyMatch = tag.match(/property=["']og:([^"']+)["']/i);
        const contentMatch = tag.match(/content=["']([^"']+)["']/i);
        if (propertyMatch && contentMatch) {
          ogTags[propertyMatch[1]] = contentMatch[1];
        }
      });
    }

    // Extract Twitter Card tags
    const twitterTags = {};
    const twitterMatches = response.body.match(/<meta[^>]+name=["']twitter:([^"']+)["'][^>]*>/gi);
    if (twitterMatches) {
      twitterMatches.forEach(tag => {
        const nameMatch = tag.match(/name=["']twitter:([^"']+)["']/i);
        const contentMatch = tag.match(/content=["']([^"']+)["']/i);
        if (nameMatch && contentMatch) {
          twitterTags[nameMatch[1]] = contentMatch[1];
        }
      });
    }

    // Test Open Graph URL
    if (ogTags.url && ogTags.url.includes('keyword-density-checker')) {
      console.log(`${colors.green}✅ Open Graph URL points to primary page: ${ogTags.url}${colors.reset}`);
      results.passed++;
    } else {
      console.log(`${colors.red}❌ Open Graph URL incorrect or missing: ${ogTags.url}${colors.reset}`);
      results.failed++;
    }

    // Test Twitter Card
    if (twitterTags.card) {
      console.log(`${colors.green}✅ Twitter Card tag present: ${twitterTags.card}${colors.reset}`);
      results.passed++;
    } else {
      console.log(`${colors.red}❌ Twitter Card tag missing${colors.reset}`);
      results.failed++;
    }

  } catch (error) {
    console.log(`${colors.red}❌ Error during social media testing: ${error.message}${colors.reset}`);
    results.failed++;
  }
}

/**
 * Test cache headers for alternative pages
 */
async function testCacheHeaders() {
  console.log(`\n${colors.blue}🔍 Testing Cache Headers${colors.reset}`);
  console.log(`${colors.blue}===========================${colors.reset}\n`);

  try {
    const alternativeUrl = `${BASE_URL}${ALTERNATIVE_PATH}`;
    const response = await makeRequest(alternativeUrl);
    const headers = response.headers;

    // Test Cache-Control (accept either combined format or individual directives)
    const cacheControl = headers['cache-control'];
    if (cacheControl &&
        (cacheControl.includes('no-cache') || cacheControl.includes('no-store')) &&
        cacheControl.includes('must-revalidate')) {
      console.log(`${colors.green}✅ Alternative page has correct Cache-Control: ${cacheControl}${colors.reset}`);
      results.passed++;
    } else {
      console.log(`${colors.red}❌ Alternative page missing correct Cache-Control. Got: ${cacheControl}${colors.reset}`);
      results.failed++;
    }

    // Test Pragma
    const pragma = headers['pragma'];
    if (pragma === 'no-cache') {
      console.log(`${colors.green}✅ Alternative page has Pragma: no-cache${colors.reset}`);
      results.passed++;
    } else {
      console.log(`${colors.red}❌ Alternative page missing Pragma: no-cache. Got: ${pragma}${colors.reset}`);
      results.failed++;
    }

    // Test Expires
    const expires = headers['expires'];
    if (expires === '0') {
      console.log(`${colors.green}✅ Alternative page has Expires: 0${colors.reset}`);
      results.passed++;
    } else {
      console.log(`${colors.red}❌ Alternative page missing Expires: 0. Got: ${expires}${colors.reset}`);
      results.failed++;
    }

  } catch (error) {
    console.log(`${colors.red}❌ Error during cache header testing: ${error.message}${colors.reset}`);
    results.failed++;
  }
}

/**
 * Generate final report
 */
function generateReport() {
  console.log(`\n${colors.blue}📊 VERIFICATION REPORT${colors.reset}`);
  console.log(`${colors.blue}======================${colors.reset}\n`);

  console.log(`Total Tests: ${results.passed + results.failed + results.warnings}`);
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  console.log(`${colors.yellow}Warnings: ${results.warnings}${colors.reset}`);

  const successRate = ((results.passed / (results.passed + results.failed + results.warnings)) * 100).toFixed(1);
  console.log(`\nSuccess Rate: ${successRate}%`);

  if (results.failed === 0) {
    console.log(`\n${colors.green}🎉 ALL TESTS PASSED! The canonical implementation is working correctly.${colors.reset}`);
    console.log(`${colors.green}✅ Alternative page will not be indexed by search engines.${colors.reset}`);
    console.log(`${colors.green}✅ Link equity is properly passed to the primary page.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}❌ Some tests failed. Please review the implementation.${colors.reset}`);
    process.exit(1);
  }

  if (results.warnings > 0) {
    console.log(`\n${colors.yellow}⚠️  Some warnings were found. These may not be critical but should be reviewed.${colors.reset}`);
  }
}

/**
 * Main execution
 */
async function main() {
  console.log(`${colors.blue}🔧 100 SEO Tools - Canonical Implementation Verification${colors.reset}`);
  console.log(`${colors.blue}=====================================================${colors.reset}\n`);

  try {
    await testCanonicalImplementation();
    await testStructuredData();
    await testSocialMediaTags();
    await testCacheHeaders();
    generateReport();
  } catch (error) {
    console.log(`${colors.red}❌ Fatal error during verification: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Run the verification
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  makeRequest,
  extractMetaTags,
  testCanonicalImplementation,
  testStructuredData,
  testSocialMediaTags,
  testCacheHeaders
};
