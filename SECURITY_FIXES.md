# Security & CSP Fixes

## Summary of Changes
We have addressed the security errors and warnings reported in the browser console and audit tools.

### 1. Content Security Policy (CSP) Violations
*   **Issue**: The browser refused to load the Cloudflare Insights script (`beacon.min.js`) because it wasn't whitelisted in the `script-src` directive.
*   **Fix**: Updated the `Content-Security-Policy` header in `next.config.mjs`.
    *   **Added to `script-src`**: 
        *   `https://static.cloudflareinsights.com` (Fixes the reported error)
        *   `https://www.googletagmanager.com` (Ensures Google Analytics loads correctly)
    *   **Added to `connect-src`**:
        *   `https://www.google-analytics.com` (Required for GA data transmission)
        *   `https://static.cloudflareinsights.com` (Required for Cloudflare beacon data)

### 2. Cross-Origin Opener Policy (COOP)
*   **Issue**: The audit reported "No COOP header found", which is important for isolating the browsing context and preventing cross-origin attacks (like Spectre).
*   **Fix**: Added `{ key: 'Cross-Origin-Opener-Policy', value: 'same-origin' }` to the headers in `next.config.mjs`.

### 3. Note on 'unsafe-inline'
*   **Observation**: The audit flagged `'unsafe-inline'` as a high severity issue.
*   **Context**: Next.js relies on inline scripts for hydration and initial state. Removing this requires implementing a Nonce-based CSP, which is a more complex architectural change involving middleware. Given the immediate need to fix the blocking Cloudflare error, we have prioritized the whitelist updates. The current configuration is standard for many Next.js deployments without strict Nonce implementation.

## Verification
1.  Rebuild the application: `npm run build`
2.  Start the production server: `npm start`
3.  Open the browser console and verify that the "Refused to load..." error for Cloudflare is gone.
4.  Verify that Google Analytics is still tracking (network requests to `google-analytics.com` should succeed).
