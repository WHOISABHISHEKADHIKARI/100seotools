
import { runTemplate } from '../lib/templates.js';
import assert from 'assert';

console.log('Testing localCitationFinder...');

// Test 1: Category and City provided
const inputs1 = { category: 'Restaurant', city: 'Paris' };
const output1 = runTemplate('localCitationFinder', inputs1);

assert.ok(output1.includes('# Local Citation Finder Strategy for Restaurant in Paris'), 'Title check failed');
assert.ok(output1.includes('Google Business Profile (Essential)'), 'General citation check failed');
assert.ok(output1.includes('TripAdvisor'), 'Niche check failed for Restaurant');
assert.ok(output1.includes('Paris Chamber of Commerce'), 'Local check failed for Paris');

console.log('Test 1 Passed: Restaurant in Paris');

// Test 2: Only Category provided
const inputs2 = { category: 'Plumber' };
const output2 = runTemplate('localCitationFinder', inputs2);

assert.ok(output2.includes('Strategy for Plumber'), 'Title check failed for Plumber');
assert.ok(output2.includes('HomeAdvisor'), 'Niche check failed for Plumber');
assert.ok(output2.includes('Enter a city to see local suggestions'), 'Missing city prompt check failed');

console.log('Test 2 Passed: Plumber only');

// Test 3: Only City provided
const inputs3 = { city: 'New York' };
const output3 = runTemplate('localCitationFinder', inputs3);

assert.ok(output3.includes('Strategy for Business in New York'), 'Title check failed for NY');
assert.ok(output3.includes('New York Chamber of Commerce'), 'Local check failed for NY');
assert.ok(output3.includes('Enter a category to see niche suggestions'), 'Missing category prompt check failed');

console.log('Test 3 Passed: City only');

// Test 4: Missing Inputs
const inputs4 = {};
const output4 = runTemplate('localCitationFinder', inputs4);

assert.strictEqual(output4, 'Please enter a business category and city.', 'Error message check failed');

console.log('Test 4 Passed: Missing inputs');

console.log('All tests passed!');
