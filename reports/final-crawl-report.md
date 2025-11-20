# Final Crawl Verification Report

- Base URL: http://localhost:3000
- Timestamp: 2025-11-20T07:33:25.184Z

**HTTP Status Checks**
- Route /: page.goto=200, HEAD=200 (expected 200)
- Route /blog: page.goto=200, HEAD=200 (expected 200)
- Route /tools/meta-tag-generator: page.goto=200, HEAD=200 (expected 200)
- Route /category/keyword-research: page.goto=200, HEAD=200 (expected 200)
- Route /blog/non-existent-post-12345: page.goto=200, HEAD=200 (expected 404)
- Route /tools/non-existent-tool-12345: page.goto=404, HEAD=404 (expected 404)
- Route /category/non-existent-category-12345: page.goto=200, HEAD=200 (expected 404)

**Console Logs**
- Errors: 1
- Warnings: 0
- Sample:
  - [error] Failed to load resource: the server responded with a status of 404 (Not Found)

**Responsiveness**
- / @ desktop-1920x1080: status 200, horizontal overflow: false
- / @ desktop-1440x900: status 200, horizontal overflow: false
- / @ desktop-1280x800: status 200, horizontal overflow: false
- / @ tablet-1024x768: status 200, horizontal overflow: false
- / @ tablet-768x1024: status 200, horizontal overflow: false
- / @ mobile-414x896: status 200, horizontal overflow: false
- / @ mobile-375x667: status 200, horizontal overflow: false
- / @ mobile-360x640: status 200, horizontal overflow: false
- /blog @ desktop-1920x1080: status 200, horizontal overflow: false
- /blog @ desktop-1440x900: status 200, horizontal overflow: false
- /blog @ desktop-1280x800: status 200, horizontal overflow: false
- /blog @ tablet-1024x768: status 200, horizontal overflow: false
- /blog @ tablet-768x1024: status 200, horizontal overflow: false
- /blog @ mobile-414x896: status 200, horizontal overflow: false
- /blog @ mobile-375x667: status 200, horizontal overflow: false
- /blog @ mobile-360x640: status 200, horizontal overflow: false
- /tools/meta-tag-generator @ desktop-1920x1080: status 200, horizontal overflow: false
- /tools/meta-tag-generator @ desktop-1440x900: status 200, horizontal overflow: false
- /tools/meta-tag-generator @ desktop-1280x800: status 200, horizontal overflow: false
- /tools/meta-tag-generator @ tablet-1024x768: status 200, horizontal overflow: false
- /tools/meta-tag-generator @ tablet-768x1024: status 200, horizontal overflow: false
- /tools/meta-tag-generator @ mobile-414x896: status 200, horizontal overflow: false
- /tools/meta-tag-generator @ mobile-375x667: status 200, horizontal overflow: false
- /tools/meta-tag-generator @ mobile-360x640: status 200, horizontal overflow: false
- /category/keyword-research @ desktop-1920x1080: status 200, horizontal overflow: false
- /category/keyword-research @ desktop-1440x900: status 200, horizontal overflow: false
- /category/keyword-research @ desktop-1280x800: status 200, horizontal overflow: false
- /category/keyword-research @ tablet-1024x768: status 200, horizontal overflow: false
- /category/keyword-research @ tablet-768x1024: status 200, horizontal overflow: false
- /category/keyword-research @ mobile-414x896: status 200, horizontal overflow: false
- /category/keyword-research @ mobile-375x667: status 200, horizontal overflow: false
- /category/keyword-research @ mobile-360x640: status 200, horizontal overflow: false

**Performance (ms from navigation start)**
- /: DCL=430 | Load=754 | FP=1796
- /blog: DCL=394 | Load=2781 | FP=616
- /tools/meta-tag-generator: DCL=372 | Load=372 | FP=376
- /category/keyword-research: DCL=1405 | Load=2194 | FP=1408
- /blog/non-existent-post-12345: DCL=1525 | Load=1527 | FP=1584
- /tools/non-existent-tool-12345: DCL=912 | Load=1008 | FP=932
- /category/non-existent-category-12345: DCL=1503 | Load=1504 | FP=1492

**Accessibility (color-contrast)**
- /: violations=0
- /blog: violations=0
- /tools/meta-tag-generator: violations=0
- /category/keyword-research: violations=0

Summary: All checks completed. Use these results to update the audit report and error log.