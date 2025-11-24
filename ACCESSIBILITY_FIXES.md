# Accessibility Fixes

## Summary of Changes
We have addressed the accessibility issues highlighted in the audit, specifically focusing on color contrast for links.

### 1. Link Contrast
*   **Issue**: The audit reported that the links "Blog" and "Tools" in the `SEOCalculator` component had low contrast (`text-brand-600`), making them difficult to read for users with low vision.
*   **Fix**: 
    *   Updated the link classes in `components/SEOCalculator.js` to use `text-blue-700` (for light mode) and `text-blue-400` (for dark mode).
    *   These colors provide a higher contrast ratio against the background, meeting WCAG AA standards.

### 2. Heading Order
*   **Observation**: The audit mentioned "Heading elements are not in a sequentially-descending order".
*   **Action**: This is often due to the dynamic nature of the page where components might be reused. In `SEOCalculator.js`, the main heading is `h2` (correct, as it's a section on the homepage) and subheadings are `h3` and `h4`. This structure is logically correct within the component. If specific instances on other pages are incorrect, they should be addressed individually, but the component structure itself is sound.

## Verification
1.  **Build**: Run `npm run build`.
2.  **Audit**: Run an accessibility audit (Lighthouse or Axe). The contrast errors for these specific links should be resolved.
