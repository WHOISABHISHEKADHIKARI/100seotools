# Final Crawl Verification Report

- Base URL: http://localhost:3006
- Timestamp: 2025-11-08T07:51:44.742Z

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
- /: DCL=76 | Load=213 | FP=1148
- /blog: DCL=700 | Load=1051 | FP=1540
- /tools/meta-tag-generator: DCL=57 | Load=564 | FP=620
- /category/keyword-research: DCL=84 | Load=514 | FP=556
- /blog/non-existent-post-12345: DCL=33 | Load=33 | FP=76
- /tools/non-existent-tool-12345: DCL=65 | Load=66 | FP=96
- /category/non-existent-category-12345: DCL=30 | Load=30 | FP=80

**Accessibility (color-contrast)**
- /: violations=0
- /blog: violations=0
- /tools/meta-tag-generator: violations=0
- /category/keyword-research: violations=1
  - color-contrast: Ensure the contrast between foreground and background colors meets WCAG 2 AA minimum contrast ratio thresholds

Summary: All checks completed. Use these results to update the audit report and error log.