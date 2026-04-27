
import { runTemplate } from '../lib/templates.js';
import assert from 'assert';

console.log('Testing reviewResponseGenerator...');

// Test 1: Positive Review (5 stars)
const inputs1 = { customer_name: 'Sarah', rating: '5', comment: 'The food was delicious and the service was great!' };
const output1 = runTemplate('reviewResponseGenerator', inputs1);

assert.ok(output1.includes('Dear Sarah'), 'Name check failed');
assert.ok(output1.includes('Professional & Grateful'), 'Style check failed');
assert.ok(output1.includes('our food'), 'Dynamic topic (food) check failed');
assert.ok(output1.includes('our service'), 'Dynamic topic (service) check failed');

console.log('Test 1 Passed: Positive Review');

// Test 2: Negative Review (1 star)
const inputs2 = { customer_name: 'John', rating: '1', comment: 'Very expensive and dirty tables.' };
const output2 = runTemplate('reviewResponseGenerator', inputs2);

assert.ok(output2.includes('Apologetic & Professional'), 'Negative style check failed');
assert.ok(output2.includes('our pricing'), 'Dynamic topic (pricing) check failed');
assert.ok(output2.includes('the atmosphere'), 'Dynamic topic (atmosphere) check failed');

console.log('Test 2 Passed: Negative Review');

console.log('Review Response Generator test passed!');
