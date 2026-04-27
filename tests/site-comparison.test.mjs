
import { runTemplate } from '../lib/templates.js';
import assert from 'assert';

console.log('Testing siteComparisonReportGenerator...');

const inputs = { site1: 'https://example.com', site2: 'https://competitor.com' };
const output = runTemplate('siteComparisonReportGenerator', inputs);

assert.ok(output.includes('# Site Comparison Matrix: example.com vs competitor.com'), 'Title check failed');
assert.ok(output.includes('| Metric | example.com | competitor.com |'), 'Table header check failed');
assert.ok(output.includes('Domain Authority (DA)'), 'Metric check failed');
assert.ok(output.includes('🏆'), 'Winner icon check failed');

console.log('Site Comparison test passed!');
