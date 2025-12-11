
import { runTemplate } from '../lib/templates.js';
import assert from 'assert';

console.log('Testing robotsTxtValidator...');

// Test 1: Valid Content
const valid = `
User-agent: *
Disallow: /admin
Sitemap: https://example.com/sitemap.xml
`.trim();
const output1 = runTemplate('robotsTxtValidator', { robots: valid });
assert.ok(output1.includes('🟢 Valid'), 'Valid status check failed');
assert.ok(output1.includes('Sitemaps Detected: 1'), 'Sitemap count failed');

console.log('Test 1 Passed: Valid Content');

// Test 2: Syntax Error (Missing colon)
const errorInput = `
User-agent *
Disallow /admin
`.trim();
const output2 = runTemplate('robotsTxtValidator', { robots: errorInput });
assert.ok(output2.includes('🔴 Invalid'), 'Invalid status check failed');
assert.ok(output2.includes('Missing colon'), 'Missing colon error check failed');

console.log('Test 2 Passed: Syntax Errors');

// Test 3: Warnings (Relative Path in Disallow without /, No Sitemap)
// Note: Disallowing "admin" without slash is technically valid relative URL if interpreted loosely but usually means /admin.
// But mostly checks if Sitemap is absolute.
const warningInput = `
User-agent: *
Disallow: admin
`.trim();
const output3 = runTemplate('robotsTxtValidator', { robots: warningInput });
console.log('Output 3:', output3); // Debug log
assert.ok(output3.includes('🟡 Valid with Warnings'), 'Warning status check failed');
assert.ok(output3.includes('No "Sitemap" directive found'), 'Missing sitemap warning check failed');
assert.ok(output3.includes('usually starts with "/"'), 'Relative path warning check failed');

console.log('Test 3 Passed: Warnings');

console.log('Robots.txt Validator test passed!');
