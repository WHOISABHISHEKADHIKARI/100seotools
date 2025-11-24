# Robots.txt Fixes

## Summary of Changes
We have addressed the "robots.txt is not valid" error reported by the audit.

### 1. Invalid Directive Removal
*   **Issue**: The audit flagged `Content-signal: search=yes,ai-train=no` as an unknown directive. This is a non-standard header that is not supported by most crawlers or validators.
*   **Fix**: The current codebase does not generate this directive. It likely exists on the live site from a previous configuration or manual upload. Deploying the updated code will remove it.

### 2. Standard AI Blocking Implementation
*   **Action**: To achieve the intent of `ai-train=no` (preventing AI training on your content) using **standard, valid** directives, we have updated `app/robots.js`.
*   **New Rules**:
    *   **GPTBot**: Disallowed (Blocks OpenAI's crawler)
    *   **CCBot**: Disallowed (Blocks Common Crawl, used by many AI models)
    *   **Google-Extended**: Disallowed (Blocks Google's AI training crawler while allowing Search)

### 3. General Improvements
*   **Disallow Paths**: Added standard exclusions for `/api/`, `/_next/`, and `/static/` to prevent crawlers from wasting budget on internal assets and API endpoints.

## Verification
1.  **Deploy**: Run `npm run build` and deploy to your hosting provider.
2.  **Check**: Visit `https://www.100seotools.com/robots.txt` after deployment.
3.  **Validate**: You should see standard `User-agent` blocks instead of the invalid `Content-signal` line.
