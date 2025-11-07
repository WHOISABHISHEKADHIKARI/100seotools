# Final Crawl Verification Report

- Base URL: http://127.0.0.1:3004
- Timestamp: 2025-11-07T16:49:19.425Z

**HTTP Status Checks**
- Route /: page.goto=200, HEAD=200 (expected 200)
- Route /blog: page.goto=200, HEAD=200 (expected 200)
- Route /tools/meta-tag-generator: page.goto=200, HEAD=200 (expected 200)
- Route /category/keyword-research: page.goto=200, HEAD=200 (expected 200)
- Route /blog/non-existent-post-12345: page.goto=200, HEAD=404 (expected 404)
- Route /tools/non-existent-tool-12345: page.goto=200, HEAD=404 (expected 404)
- Route /category/non-existent-category-12345: page.goto=200, HEAD=404 (expected 404)

**Console Logs**
- Errors: 0
- Warnings: 0

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
- /: DCL=286 | Load=806 | FP=1376
- /blog: DCL=591 | Load=3056 | FP=652
- /tools/meta-tag-generator: DCL=418 | Load=1364 | FP=536
- /category/keyword-research: DCL=289 | Load=292 | FP=372
- /blog/non-existent-post-12345: DCL=257 | Load=257 | FP=308
- /tools/non-existent-tool-12345: DCL=268 | Load=268 | FP=308
- /category/non-existent-category-12345: DCL=173 | Load=173 | FP=204

**Accessibility (color-contrast)**
- /: violations=0
- /blog: violations=0
- /tools/meta-tag-generator: violations=0
- /category/keyword-research: violations=0

Summary: All checks completed. Use these results to update the audit report and error log.