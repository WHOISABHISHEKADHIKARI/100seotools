
import { runTemplate } from '../lib/templates.js';
import assert from 'assert';

console.log('Testing locationBasedContent...');

// Test 1: Both keyword and location provided
const inputs1 = { keyword: 'Plumbing', location: 'Chicago' };
const output1 = runTemplate('locationBasedContent', inputs1);

assert.ok(output1.includes('Location-Based Content Ideas for "Plumbing" in "Chicago"'), 'Title check failed');
assert.ok(output1.includes('Plumbing in Chicago: The Complete Guide'), 'Idea 1 check failed');
assert.ok(output1.includes('Emergency Plumbing Services in Chicago'), 'Emergency check failed');

console.log('Test 1 Passed: Plumbing in Chicago');

// Test 2: Missing inputs (should use defaults)
const inputs2 = {};
const output2 = runTemplate('locationBasedContent', inputs2);
// Wait, my implementation returns "Please enter..." if BOTH are missing? 
// No, the if condition is `if (!keyword && !location)` -> if BOTH are falsy, return error.
// If one is present, or defaults are used?
// Actually my code says: `if (!keyword && !location) return ...`
// So if I pass empty inputs, it returns error.
assert.strictEqual(output2, 'Please enter a service/product keyword and a location.', 'Error message check failed');

console.log('Test 2 Passed: Missing inputs');

// Test 3: Only Keyword
const inputs3 = { keyword: 'Roofing' };
const output3 = runTemplate('locationBasedContent', inputs3);
assert.ok(output3.includes('Roofing in City'), 'Default location check failed');

console.log('Test 3 Passed: Keyword only');

console.log('Location-Based Content test passed!');
