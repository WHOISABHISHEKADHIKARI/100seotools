
import { runTemplate } from '../lib/templates.js';
import assert from 'assert';

console.log('Testing fixes for missing templates...');

// 1. Test hreflangTagGenerator
console.log('Testing hreflangTagGenerator...');
const hrefInputs = {
    url: 'https://example.com',
    languages: 'en-us | https://example.com/en\nfr-fr | https://example.com/fr'
};
const hrefOutput = runTemplate('hreflangTagGenerator', hrefInputs);
assert.ok(hrefOutput.includes('hreflang="en-us"'), 'Should include en-us tag');
assert.ok(hrefOutput.includes('hreflang="x-default"'), 'Should include x-default tag');
console.log('PASS: hreflangTagGenerator');

// 2. Test keywordComparisonTool
console.log('Testing keywordComparisonTool...');
const kwInputs = {
    keywords: 'seo tools\nkeyword research'
};
const kwOutput = runTemplate('keywordComparisonTool', kwInputs);
assert.ok(kwOutput.includes('| seo tools |'), 'Should include first keyword in table');
assert.ok(kwOutput.includes('| keyword research |'), 'Should include second keyword in table');
console.log('PASS: keywordComparisonTool');

console.log('All verification tests passed.');
