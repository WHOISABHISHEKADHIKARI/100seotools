# Unused Files Report - December 2025

## Summary
This report identifies JavaScript files in the codebase that are **not referenced** in `package.json` scripts and **not imported** by other files.

**⚠️ IMPORTANT:** Review each file before deletion. Some files may be used manually or in CI/CD pipelines.

---

## Safe to Delete (High Confidence)

### Scripts Directory (`/scripts`)

#### 1. `analyzeMetadata.js`
- **Status:** ❌ Not used in package.json
- **Imports:** ❌ Not imported anywhere
- **Risk:** LOW
- **Recommendation:** **SAFE TO DELETE**

#### 2. `applyMetadata.js`
- **Status:** ❌ Not used in package.json
- **Imports:** ❌ Not imported anywhere
- **Risk:** LOW
- **Recommendation:** **SAFE TO DELETE**

#### 3. `check-duplicate-slugs.js`
- **Status:** ❌ Not used in package.json
- **Imports:** ❌ Not imported anywhere
- **Risk:** LOW
- **Recommendation:** **SAFE TO DELETE**

#### 4. `check-tool-page.js`
- **Status:** ❌ Not used in package.json
- **Imports:** ❌ Not imported anywhere
- **Risk:** LOW
- **Recommendation:** **SAFE TO DELETE**

#### 5. `cleanupCodebase.js`
- **Status:** ❌ Not used in package.json
- **Imports:** ❌ Not imported anywhere
- **Risk:** LOW
- **Recommendation:** **SAFE TO DELETE**

#### 6. `generateHighCTRMetadata.js`
- **Status:** ❌ Not used in package.json
- **Imports:** ❌ Not imported anywhere
- **Risk:** LOW
- **Recommendation:** **SAFE TO DELETE**

#### 7. `generateSEOContent.js`
- **Status:** ❌ Not used in package.json
- **Imports:** ❌ Not imported anywhere
- **Risk:** LOW
- **Recommendation:** **SAFE TO DELETE**

#### 8. `generateToolPreviewReports.js`
- **Status:** ❌ Not used in package.json
- **Imports:** ❌ Not imported anywhere
- **Risk:** LOW
- **Recommendation:** **SAFE TO DELETE**

#### 9. `parsePromptForm.js`
- **Status:** ❌ Not used in package.json
- **Imports:** ❌ Not imported anywhere
- **Risk:** LOW
- **Recommendation:** **SAFE TO DELETE**

#### 10. `qa-runner.js`
- **Status:** ❌ Not used in package.json
- **Imports:** ❌ Not imported anywhere
- **Risk:** LOW
- **Recommendation:** **SAFE TO DELETE**

#### 11. `quickDynamicityTest.js`
- **Status:** ❌ Not used in package.json
- **Imports:** ❌ Not imported anywhere
- **Risk:** LOW
- **Recommendation:** **SAFE TO DELETE**

#### 12. `scan-404s.js`
- **Status:** ❌ Not used in package.json
- **Imports:** ❌ Not imported anywhere
- **Risk:** LOW
- **Recommendation:** **SAFE TO DELETE**

#### 13. `testToolDynamicity.js`
- **Status:** ❌ Not used in package.json
- **Imports:** ❌ Not imported anywhere
- **Risk:** LOW
- **Recommendation:** **SAFE TO DELETE**

#### 14. `ui-tester.js`
- **Status:** ❌ Not used in package.json
- **Imports:** ❌ Not imported anywhere
- **Risk:** LOW
- **Recommendation:** **SAFE TO DELETE**

#### 15. `verify-tool-pages.js`
- **Status:** ❌ Not used in package.json
- **Imports:** ❌ Not imported anywhere
- **Risk:** LOW
- **Recommendation:** **SAFE TO DELETE**

#### 16. `verifyCanonical.js`
- **Status:** ❌ Not used in package.json
- **Imports:** ❌ Not imported anywhere
- **Risk:** LOW
- **Recommendation:** **SAFE TO DELETE**

---

## Keep (Currently Used)

### Scripts Directory (`/scripts`)

#### ✅ `generateTools.js`
- **Status:** ✅ Used in `npm run generate:tools`
- **Keep:** YES

#### ✅ `contrastAudit.js`
- **Status:** ✅ Used in `npm run audit:contrast`
- **Keep:** YES

#### ✅ `checkExternalLinks.js`
- **Status:** ✅ Used in `npm run lint:links`
- **Keep:** YES

#### ✅ `lintCanonical.js`
- **Status:** ✅ Used in `npm run lint:canon`
- **Keep:** YES

#### ✅ `lintAnchors.js`
- **Status:** ✅ Used in `npm run lint:anchors`
- **Keep:** YES

#### ✅ `whitespaceAudit.js`
- **Status:** ✅ Used in `npm run lint:whitespace` and `npm run fix:whitespace`
- **Keep:** YES

#### ✅ `headlessCrawler.js`
- **Status:** ✅ Used in `npm run crawl:final`
- **Keep:** YES

---

## Tests Directory (`/tests`)

### Review Needed

#### ⚠️ `blogListingPager.test.js`
- **Status:** ❓ Not in package.json, but may be used in CI/CD
- **Risk:** MEDIUM
- **Recommendation:** **REVIEW BEFORE DELETING**

#### ⚠️ `blogSubpages.test.js`
- **Status:** ❓ Not in package.json, but may be used in CI/CD
- **Risk:** MEDIUM
- **Recommendation:** **REVIEW BEFORE DELETING**

### Keep

#### ✅ `sitemap-diagnostic.js`
- **Status:** ✅ Utility script for sitemap validation
- **Keep:** YES

#### ✅ `sitemap-full-qa.js`
- **Status:** ✅ Utility script for sitemap QA
- **Keep:** YES

---

## Cleanup Commands

### Safe Deletion (16 files)

```bash
# Delete unused scripts (SAFE)
rm scripts/analyzeMetadata.js
rm scripts/applyMetadata.js
rm scripts/check-duplicate-slugs.js
rm scripts/check-tool-page.js
rm scripts/cleanupCodebase.js
rm scripts/generateHighCTRMetadata.js
rm scripts/generateSEOContent.js
rm scripts/generateToolPreviewReports.js
rm scripts/parsePromptForm.js
rm scripts/qa-runner.js
rm scripts/quickDynamicityTest.js
rm scripts/scan-404s.js
rm scripts/testToolDynamicity.js
rm scripts/ui-tester.js
rm scripts/verify-tool-pages.js
rm scripts/verifyCanonical.js
```

### Review Before Deletion (2 files)

```bash
# Review these test files before deleting
# rm tests/blogListingPager.test.js
# rm tests/blogSubpages.test.js
```

---

## Impact Analysis

### Before Cleanup
- Total scripts: 23 files
- Total tests: 4 files
- **Total: 27 files**

### After Cleanup
- Scripts to delete: 16 files
- Tests to review: 2 files
- **Potential reduction: 18 files (67%)**

### Benefits
1. ✅ **Cleaner codebase** - Easier to navigate
2. ✅ **Faster builds** - Less code to process
3. ✅ **Reduced maintenance** - Fewer files to update
4. ✅ **Better clarity** - Only active scripts remain

---

## Execution Plan

### Step 1: Backup (CRITICAL)
```bash
# Create a backup branch
git checkout -b backup/before-cleanup
git push origin backup/before-cleanup
```

### Step 2: Delete Safe Files
```bash
# Switch back to main
git checkout main

# Delete unused scripts
git rm scripts/analyzeMetadata.js
git rm scripts/applyMetadata.js
git rm scripts/check-duplicate-slugs.js
git rm scripts/check-tool-page.js
git rm scripts/cleanupCodebase.js
git rm scripts/generateHighCTRMetadata.js
git rm scripts/generateSEOContent.js
git rm scripts/generateToolPreviewReports.js
git rm scripts/parsePromptForm.js
git rm scripts/qa-runner.js
git rm scripts/quickDynamicityTest.js
git rm scripts/scan-404s.js
git rm scripts/testToolDynamicity.js
git rm scripts/ui-tester.js
git rm scripts/verify-tool-pages.js
git rm scripts/verifyCanonical.js

# Commit
git commit -m "chore: Remove 16 unused script files"
```

### Step 3: Test Build
```bash
# Verify build still works
npm run build

# Run all tests
npm run lint:whitespace
npm run lint:canon
npm run lint:anchors
npm run lint:links
```

### Step 4: Push Changes
```bash
# If everything works
git push origin main
```

---

## Rollback Plan

If something breaks after deletion:

```bash
# Restore from backup branch
git checkout backup/before-cleanup
git checkout -b main-restored
git push origin main-restored --force
```

---

## Notes

- All identified files are **utility scripts** that were likely used during development
- None of these files are imported by the application code
- Deleting them will **NOT affect** the production website
- The cleanup is **reversible** via Git history

**Last Updated:** December 22, 2025
