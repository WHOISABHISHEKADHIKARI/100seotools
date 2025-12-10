
# Test Plan for API Route Fixes

This test plan covers the changes for 5 API routes. All tests assume a POST request to the respective endpoint.

## 1. AI Article Length Optimizer (Fix: Alias 'topic' to 'keyword')

| Test ID | Scenario | Input Type | Test Data (JSON Payload) | Expected Status | Expected Behavior |
|---|---|---|---|---|---|
| AALO-01 | Valid Input (topic) | Positive | `{"topic": "seo tips"}` | 200 | Success. `keyword` internally set to "seo tips". |
| AALO-02 | Valid Input (keyword) | Positive | `{"keyword": "seo tips"}` | 200 | Success. Backwards compatibility maintained. |
| AALO-03 | Missing Input | Negative | `{"intents": "informational"}` | 400 | Error: "Keyword or Topic required". |
| AALO-04 | Empty Input | Negative | `{"topic": ""}` | 400 | Error: "Keyword or Topic required". |

## 2. Anchor Text Analyzer (Fix: Try/Catch for 500s)

| Test ID | Scenario | Input Type | Test Data (JSON Payload) | Expected Status | Expected Behavior |
|---|---|---|---|---|---|
| ATA-01 | Valid URL | Positive | `{"url": "https://example.com"}` | 200 | Success. Returns analysis. |
| ATA-02 | Invalid URL Format | Negative | `{"url": "not-a-url"}` | 200/400 | Handled gracefully or API returns error (not 500). |
| ATA-03 | Non-Existent Domain | Negative | `{"url": "https://this-domain-does-not-exist-12345.com"}` | 422 | Error: "Failed to fetch content" or similar (not 500). |
| ATA-04 | Server Time Out | Edge | `{"url": "https://httpstat.us/200?sleep=10000"}` | 408/422 | Abort handled gracefully. |

## 3. Broken Link Finder (Fix: Handle Target 404s)

| Test ID | Scenario | Input Type | Test Data (JSON Payload) | Expected Status | Expected Behavior |
|---|---|---|---|---|---|
| BLF-01 | Valid URL | Positive | `{"url": "https://example.com"}` | 200 | Success. Returns report. |
| BLF-02 | Target 404 URL | Negative | `{"url": "https://google.com/non-existent-page"}` | 200 | Success. Returns report stating "Unable to crawl page" or similar, NOT 500/400 API crash. |
| BLF-03 | Invalid Protocol | Edge | `{"url": "ftp://example.com"}` | 400 | Error: "Invalid URL" or handled. |

## 4. Backlink Tracking Template (Fix: Validate `project_name`)

| Test ID | Scenario | Input Type | Test Data (JSON Payload) | Expected Status | Expected Behavior |
|---|---|---|---|---|---|
| BTT-01 | Valid Name | Positive | `{"project_name": "My Campaign"}` | 200 | Success. |
| BTT-02 | Empty Name | Negative | `{"project_name": ""}` | 400 | Error: "Project Name is required". |
| BTT-03 | Missing Field | Negative | `{}` | 400 | Error: "Project Name is required". |

## 5. Competitor Backlink Idea Generator (Fix: URL Validation)

| Test ID | Scenario | Input Type | Test Data (JSON Payload) | Expected Status | Expected Behavior |
|---|---|---|---|---|---|
| CBIG-01 | Valid URL | Positive | `{"competitor_url": "https://competitor.com"}` | 200 | Success. |
| CBIG-02 | Invalid URL String | Negative | `{"competitor_url": "not-a-valid-url"}` | 400 | Error: "Invalid URL". |
| CBIG-03 | Empty URL | Negative | `{"competitor_url": ""}` | 400 | Error: "Competitor URL required". |

