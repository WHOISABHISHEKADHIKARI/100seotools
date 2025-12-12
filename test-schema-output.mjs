import { runTemplate } from './lib/templates.js';

// Test the Featured Tool Schema Generator
const testInputs = {
    toolName: 'Premium Backlink Analyzer',
    pageTitle: 'Premium Backlink Analyzer - Free SEO Tool',
    metaDescription: 'Analyze your backlinks for free. Discover link quality, authority scores, toxic links, and optimization opportunities with our comprehensive backlink analysis tool.',
    pageUrl: 'https://www.100seotools.com/backlink-analyzer',
    brandLogo: 'https://www.100seotools.com/logo.png',
    authorName: '100 SEO Tools Team',
    publishDate: '2025-01-15',
    modifyDate: '2025-01-20',
    offerPrice: '0',
    offerCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    ctaText: 'Start Analyzing Now - 100% Free'
};

console.log('='.repeat(80));
console.log('FEATURED TOOL SCHEMA GENERATOR - TEST OUTPUT');
console.log('='.repeat(80));
console.log('\nInput Data:');
console.log(JSON.stringify(testInputs, null, 2));
console.log('\n' + '='.repeat(80));
console.log('GENERATED SCHEMA:');
console.log('='.repeat(80));

const output = runTemplate('featuredToolSchemaGenerator', testInputs);
console.log(output);

console.log('\n' + '='.repeat(80));
console.log('✅ Schema generated successfully!');
console.log('📋 Copy the output above and paste it into your <head> section');
console.log('='.repeat(80));
