# Final Crawl Verification Report

- Base URL: http://localhost:3000
- Timestamp: 2025-11-19T09:06:57.223Z

**HTTP Status Checks**
- Route /: page.goto=200, HEAD=200 (expected 200)
- Route /blog: page.goto=200, HEAD=200 (expected 200)
- Route /tools/meta-tag-generator: page.goto=200, HEAD=200 (expected 200)
- Route /category/keyword-research: page.goto=200, HEAD=200 (expected 200)
- Route /blog/non-existent-post-12345: page.goto=200, HEAD=200 (expected 404)
- Route /tools/non-existent-tool-12345: page.goto=404, HEAD=404 (expected 404)
- Route /category/non-existent-category-12345: page.goto=404, HEAD=404 (expected 404)

**Console Logs**
- Errors: 2
- Warnings: 0
- Sample:
  - [error] Failed to load resource: the server responded with a status of 404 ()
  - [error] Failed to load resource: the server responded with a status of 404 ()

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
- /: DCL=69 | Load=268 | FP=1024
- /blog: DCL=868 | Load=1237 | FP=1588
- /tools/meta-tag-generator: DCL=74 | Load=731 | FP=796
- /category/keyword-research: DCL=111 | Load=642 | FP=688
- /blog/non-existent-post-12345: DCL=262 | Load=834 | FP=936
- /tools/non-existent-tool-12345: DCL=1558 | Load=2229 | FP=2332
- /category/non-existent-category-12345: DCL=298 | Load=719 | FP=772

**Accessibility (color-contrast)**
- /: violations=0
- /blog: violations=0
- /tools/meta-tag-generator: violations=0
- /category/keyword-research: violations=0

Summary: All checks completed. Use these results to update the audit report and error log.