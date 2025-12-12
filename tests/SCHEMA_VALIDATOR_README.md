# Schema Validation Test Suite

## Overview
Automated test suite for validating JSON-LD structured data across all page types on 100seotools.com.

## What It Tests

### Page Coverage
- ✅ Homepage
- ✅ Tool Pages (105 pages)
- ✅ Blog Posts (810+ pages)
- ✅ Category Pages
- ✅ About Page
- ✅ Author Page
- ✅ Contact Page
- ✅ Privacy Page
- ✅ Terms Page
- ✅ FAQ Page

### Validation Checks
1. **Schema Presence** - Verifies expected schema types exist
2. **Required Properties** - Checks all required properties are present
3. **Organization Consistency** - Ensures "100 SEO Tools" is used consistently
4. **URL Validation** - Confirms all URLs are absolute (not relative)
5. **JSON Validity** - Validates JSON-LD syntax

## Usage

### Run All Tests
```bash
node tests/schema-validator.test.mjs
```

### Prerequisites
- Development server must be running on `http://localhost:3000`
- All pages must be accessible

### Start Dev Server First
```bash
npm run dev
```

Then in another terminal:
```bash
node tests/schema-validator.test.mjs
```

## Expected Output

```
╔════════════════════════════════════════════════════════════╗
║         JSON-LD Schema Validation Test Suite              ║
║         Testing: http://localhost:3000                     ║
╚════════════════════════════════════════════════════════════╝

Testing: Homepage
URL: http://localhost:3000/
✓ Found 2 JSON-LD block(s)
Schema types: WebSite, WebPage
✓ Found: WebSite
  ✓ All required properties present
✓ Found: WebPage
  ✓ All required properties present
✓ Organization entity consistent
✓ All URLs are absolute

...

╔════════════════════════════════════════════════════════════╗
║                     TEST SUMMARY                           ║
╚════════════════════════════════════════════════════════════╝
Total Tests: 50
Passed: 50
Failed: 0
Success Rate: 100.0%

Validation Complete!
```

## Test Configuration

Edit `tests/schema-validator.test.mjs` to:
- Add/remove test pages
- Modify expected schemas
- Change required properties
- Adjust validation rules

## Common Issues

### Server Not Running
```
Error: Failed to fetch http://localhost:3000/: connect ECONNREFUSED
```
**Solution:** Start the dev server with `npm run dev`

### Schema Not Found
```
✗ Missing: WebPage
```
**Solution:** Check that the page has the required JSON-LD schema in `<head>`

### Relative URLs
```
⚠ Relative URL found at schema[0].url: /about
```
**Solution:** Use `getBaseUrl()` to generate absolute URLs

## Integration with CI/CD

Add to `package.json`:
```json
{
  "scripts": {
    "test:schema": "node tests/schema-validator.test.mjs"
  }
}
```

Then run:
```bash
npm run test:schema
```

## Extending Tests

### Add New Page Type
```javascript
{
  url: '/new-page',
  name: 'New Page',
  expectedSchemas: ['WebPage', 'BreadcrumbList'],
  requiredProperties: {
    WebPage: ['name', 'url', 'publisher']
  }
}
```

### Add Custom Validation
```javascript
function validateCustomRule(schemas) {
  const issues = [];
  // Your validation logic
  return issues;
}
```

## Troubleshooting

### Test Fails on Production
- Ensure schemas are deployed
- Check that pages are publicly accessible
- Verify no caching issues

### False Positives
- Review expected schemas match actual implementation
- Check required properties are correctly defined
- Validate test configuration

## Related Files
- `lib/schema.js` - Schema generators
- `components/StructuredData.js` - Schema component
- `SCHEMA_IMPLEMENTATION_COMPLETE.md` - Implementation docs

## Support
For issues or questions, check the implementation documentation or contact the development team.
