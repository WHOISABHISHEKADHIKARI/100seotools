
import { runTemplate } from '../lib/templates.js';
import assert from 'assert';

console.log('Testing keywordSuggestions template...');

// Test 1: With valid seed
const inputs1 = { seed: 'coffee' };
const output1 = runTemplate('keywordSuggestions', inputs1);
// output should be a string of newline separated suggestions
assert.ok(output1.includes('best coffee'), 'Output should contain "best" prefix');
assert.ok(output1.includes('coffee tips'), 'Output should contain "tips" suffix');

console.log('Test 1 Passed: Valid seed');

// Test 2: Missing seed
const inputs2 = { seed: '' };
const output2 = runTemplate('keywordSuggestions', inputs2);
assert.strictEqual(output2, 'Enter a seed keyword.', 'Should return specific error message for missing seed');

console.log('Test 2 Passed: Missing seed logic in client-side runner matches expectations');

console.log('keywordSuggestions test passed!');
