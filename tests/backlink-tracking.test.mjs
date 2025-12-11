
import { runTemplate } from '../lib/templates.js';
import assert from 'assert';

console.log('Testing backlinkTrackingTemplate...');

const inputs = { project_name: 'Alpha Campaign' };
const output = runTemplate('backlinkTrackingTemplate', inputs);

assert.ok(output.includes('# Backlink Tracking Template for: Alpha Campaign'), 'Title check failed');
assert.ok(output.includes('Target URL,Source URL,Anchor Text'), 'CSV header check failed');
assert.ok(output.includes('"Guest post exchange"'), 'CSV content check failed');
assert.ok(output.includes('| Target URL | Source URL |'), 'Markdown table check failed');

console.log('Backlink Tracking Template test passed!');
