# Robots.txt Validation Fix

## Summary of Changes
We have addressed the "Unknown directive" error for `Content-signal` in `robots.txt`.

### 1. Removed Non-Standard Directive
*   **Issue**: The audit reported `Content-signal: search=yes,ai-input=yes,ai-train=no` as an "Unknown directive". While this is a proposed standard for AI control, many traditional validators (like Google's) do not yet recognize it and flag it as an error.
*   **Fix**: Removed the `Content-signal` line from `app/robots.txt/route.js`.
*   **Alternative**: The AI control is still partially enforced by the specific `User-agent` rules we added (allowing `GPTBot` for search/input but disallowing `CCBot` for scraping). The `ai-train=no` signal is unfortunately not yet universally supported via `robots.txt` without causing validation warnings in legacy tools. If you strictly need this signal, it might be better placed in a `<meta>` tag or HTTP header, but for `robots.txt` compliance, removing it is the correct fix for now.

## Verification
1.  **Build**: Run `npm run build`.
2.  **Verify**: Check the generated `robots.txt`. It should no longer contain the `Content-signal` line.
3.  **Audit**: Run the Lighthouse/SEO audit again. The "robots.txt is malformed" error should be resolved.
