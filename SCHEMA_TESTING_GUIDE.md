# Schema Validation Test Suite - Complete Guide

## 📋 **Overview**

I've created a comprehensive automated test suite to validate JSON-LD structured data across your entire website.

---

## 🎯 **Two Testing Options**

### **Option 1: Local Testing** (Development)
**File:** `tests/schema-validator.test.mjs`  
**Tests against:** `http://localhost:3000`  
**Use when:** Testing changes before deployment

**Run:**
```bash
# Start dev server first
npm run dev

# Then in another terminal
node tests/schema-validator.test.mjs
```

### **Option 2: Production Testing** (Live Site)
**File:** `tests/schema-validator-production.test.mjs`  
**Tests against:** `https://www.100seotools.com`  
**Use when:** Validating live deployed schemas

**Run:**
```bash
node tests/schema-validator-production.test.mjs
```

---

## ✅ **What Gets Tested**

### **10 Page Types**
1. ✅ Homepage
2. ✅ Tool Page (keyword-suggestion-tool)
3. ✅ Blog Post (seo-basics)
4. ✅ Category Page (keyword-research)
5. ✅ About Page
6. ✅ Author Page
7. ✅ **Contact Page (NEW)**
8. ✅ **Privacy Page (NEW)**
9. ✅ **Terms Page (NEW)**
10. ✅ FAQ Page

### **Validation Checks**

#### 1. Schema Presence
- Verifies all expected schema types exist
- Checks for JSON-LD blocks in `<head>`

#### 2. Schema Types
- **Homepage:** WebSite + WebPage
- **Tool Pages:** SoftwareApplication + BreadcrumbList + HowTo
- **Blog Posts:** Article + FAQPage + HowTo
- **Categories:** CollectionPage + BreadcrumbList
- **About:** AboutPage + FAQPage
- **Author:** Person + BreadcrumbList
- **Contact:** ContactPage + BreadcrumbList + FAQPage
- **Privacy:** WebPage + BreadcrumbList
- **Terms:** WebPage + BreadcrumbList
- **FAQ:** FAQPage + WebPage + BreadcrumbList

#### 3. Required Properties
Validates each schema has required properties:
- `name`, `url`, `description`
- `author`, `publisher`, `datePublished`
- `itemListElement` (breadcrumbs)
- `mainEntity` (FAQs)

#### 4. Organization Consistency
- Ensures "100 SEO Tools" is used consistently
- Checks all Organization entities match

#### 5. URL Validation
- Confirms all URLs are absolute
- No relative URLs (e.g., `/about` → `https://www.100seotools.com/about`)

---

## 📊 **Sample Output**

```
╔════════════════════════════════════════════════════════════╗
║      JSON-LD Schema Validation - Production Site          ║
║      Testing: https://www.100seotools.com                 ║
╚════════════════════════════════════════════════════════════╝

Testing: Contact Page (NEW)
URL: https://www.100seotools.com/contact
✓ Found 1 JSON-LD block(s)
Schema types: ContactPage, BreadcrumbList, FAQPage
✓ Found: ContactPage
  ✓ All required properties present
✓ Found: BreadcrumbList
  ✓ All required properties present
✓ Found: FAQPage
  ✓ All required properties present
✓ Organization entity consistent

╔════════════════════════════════════════════════════════════╗
║                     TEST SUMMARY                           ║
╚════════════════════════════════════════════════════════════╝
Total Tests: 30
Passed: 30
Failed: 0
Success Rate: 100.0%

✓ All schemas validated successfully!

Validation Complete!
```

---

## 🚀 **Quick Start**

### **Test Production Site Now**
```bash
node tests/schema-validator-production.test.mjs
```

This will:
1. Fetch 10 pages from your live site
2. Extract JSON-LD schemas
3. Validate schema types and properties
4. Check Organization consistency
5. Generate detailed report

### **Add to package.json**
```json
{
  "scripts": {
    "test:schema": "node tests/schema-validator.test.mjs",
    "test:schema:prod": "node tests/schema-validator-production.test.mjs"
  }
}
```

Then run:
```bash
npm run test:schema:prod
```

---

## 🔧 **Customization**

### **Add More Test Pages**
Edit `tests/schema-validator-production.test.mjs`:

```javascript
{
  url: '/your-page',
  name: 'Your Page Name',
  expectedSchemas: ['WebPage', 'BreadcrumbList'],
  requiredProperties: {
    WebPage: ['name', 'url', 'publisher']
  }
}
```

### **Modify Expected Schemas**
Change `expectedSchemas` array for any page type

### **Add Custom Validation**
Add new validation functions:

```javascript
function validateCustomRule(schemas) {
  const issues = [];
  // Your validation logic
  return issues;
}
```

---

## 📁 **Files Created**

1. **`tests/schema-validator.test.mjs`**
   - Local development testing
   - Tests against localhost:3000

2. **`tests/schema-validator-production.test.mjs`**
   - Production site testing
   - Tests against www.100seotools.com

3. **`tests/SCHEMA_VALIDATOR_README.md`**
   - Complete documentation
   - Usage examples
   - Troubleshooting guide

---

## ⚠️ **Common Issues**

### **Dev Server Not Running**
```
Error: Failed to fetch http://localhost:3000/
```
**Solution:** Start dev server with `npm run dev`

### **Production Site Not Deployed**
```
Error: Failed to fetch https://www.100seotools.com/contact
```
**Solution:** Deploy your changes to production first

### **Schema Not Found**
```
✗ Missing: ContactPage
```
**Solution:** Check that page has JSON-LD in `<head>`

---

## 🎯 **Next Steps**

### **1. Run Production Test**
```bash
node tests/schema-validator-production.test.mjs
```

### **2. Deploy Changes**
If testing locally and schemas pass:
```bash
git add .
git commit -m "Add JSON-LD schemas to static pages"
git push
```

### **3. Validate with Google**
After deployment, test with:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

### **4. Monitor Search Console**
- Check for rich result impressions
- Monitor enhanced SERP features
- Track click-through rates

---

## 📈 **Expected Results**

After deployment, you should see:
- ✅ 100% schema coverage across all pages
- ✅ Rich results eligibility
- ✅ Enhanced SERP display
- ✅ Breadcrumb navigation in search
- ✅ FAQ rich snippets
- ✅ Knowledge graph appearances

---

## 🔍 **Validation Checklist**

- [ ] Run local tests (if testing locally)
- [ ] Run production tests
- [ ] All tests pass (100% success rate)
- [ ] No errors in output
- [ ] Deploy to production
- [ ] Test with Google Rich Results Test
- [ ] Monitor Search Console
- [ ] Check SERP appearances

---

## 📞 **Support**

For issues or questions:
- Check `SCHEMA_VALIDATOR_README.md`
- Review `SCHEMA_IMPLEMENTATION_COMPLETE.md`
- Check test output for specific errors

---

**Status:** ✅ Ready to use  
**Coverage:** 10 page types  
**Validation:** Comprehensive  
**Production Ready:** Yes
