# 100 SEO Tools — UI Style Guide (301 Redirect Generator)

This style guide documents the design tokens, component styles, and usage rules derived from the calculator/form UI patterns in `instruction/301prompt`. These principles ensure consistent, accessible, and high-performance UI across tools.

## Design Tokens

- Theme Colors (CSS variables)
  - `--color-brand-50` → `#f0f9ff`
  - `--color-brand-100` → `#e0f2fe`
  - `--color-brand-200` → `#bae6fd`
  - `--color-brand-300` → `#7dd3fc`
  - `--color-brand-400` → `#38bdf8`
  - `--color-brand-500` → `#0ea5e9`
  - `--color-brand-600` → `#0284c7`
  - `--color-brand-700` → `#0369a1`
  - `--color-brand-800` → `#075985`
  - `--color-brand-900` → `#0c4a6e`
  - `--color-brand-950` → `#082f49`
  - Accessible neutrals: `--color-gray-400` `#52525b`, `--color-gray-500` `#3f3f46`, `--color-gray-600` `#27272a`, `--color-gray-700` `#18181b`, `--color-gray-800` `#020617`
  - Semantic: `--color-bg`, `--color-fg`, `--color-bg-muted`, `--color-border`, `--color-success-bg`, `--color-success-border`, `--color-success-text`

- Typography
  - Font family: `--font-sans` (system UI stack)
  - Scale: `--text-xs` 12px, `--text-sm` 14px, `--text-base` 16px,
    `--text-lg` 18px, `--text-xl` 20px, `--text-2xl` 24px, `--text-3xl` 30px,
    `--text-4xl` 36px, `--text-5xl` 48px
  - Line-height: default (Tailwind), use `leading-5/6/7` for readability

- Layout & Spacing
  - Spacing ratios: `--space-1` 4px, `--space-2` 8px, `--space-3` 12px,
    `--space-4` 16px, `--space-6` 24px, `--space-8` 32px, `--space-12` 48px
  - Radii: `--radius-sm` 6px, `--radius-md` 8px, `--radius-lg` 12px
  - Shadow presets: `--shadow-sm` (subtle), `--shadow-md` (raised), `--shadow-lg` (hover)

- Responsive Breakpoints
  - Tailwind defaults: `sm` ≥640px, `md` ≥768px, `lg` ≥1024px, `xl` ≥1280px, `2xl` ≥1536px
  - Grid/layout components should adapt at `md` and `lg` per examples in 301prompt

## Component Rules

- Hero `gradient-bg`
  - Gradient from `--color-brand-700` → `--color-brand-500`
  - Text color `text-white`
  - Spacing `py-16` and container `mx-auto px-4`

- Badges `.badge`
  - Inline-flex, `--text-sm`, `--radius-sm`, background `--color-bg-muted`
  - Text `--color-brand-700`

- Tabbed Interface `.tab-navigation`, `.tab-btn`
  - Navigation: `display:flex`, gap `--space-4`, divider bottom `--color-border`
  - Button: `tap-target`, `text-lg font-semibold`, white background, 4px top border
  - States: `hover` muted bg, `focus-visible` outline brand 500, `active` brand top border and text color

- Config Panel `.config-panel`
  - Surface bg `--color-bg-muted`, 1px border `--color-border`, radius `--radius-lg`

- Form Group `.form-group`
  - Grid gap `--space-2`, margin bottom `--space-4`
  - Label: `--text-sm`, `--color-gray-500`
  - Inputs: 1px border, `--radius-md`, `--text-base`, white bg, focus outline brand 500

- Format Tabs `.format-tabs`, `.format-tab`
  - Group flex gap `--space-2`
  - Button: `tap-target`, 1px border `--color-border`, radius `--radius-md`
  - States: `hover` border brand 300, `focus-visible` outline brand 500, `active` bg brand 50, border brand 500, text brand 700

- Code Container `.code-container pre`
  - 1px border `--color-border`, radius `--radius-md`, shadow `--shadow-sm`

- Output Actions `.output-actions .btn`
  - Use `tap-target`, `--radius-md`

- Success Alert `.alert.alert-success`
  - Padding `--space-4`, border `--color-success-border`, bg `--color-success-bg`, text `--color-success-text`, radius `--radius-md`

- Preview Table `.preview-section table`
  - 100% width, 1px border, collapsed borders
  - Header cells: `--text-sm`, `--color-gray-500`, padding `--space-3`, bottom border
  - Body cells: padding `--space-3`, top border; row hover bg brand 50

## Usage Guidelines

- Color & Contrast
  - Prefer brand 600–700 for text accents on light backgrounds to meet AA
  - Neutral text: `accessibleGray` 500+ for small text
  - Always provide `:focus-visible` outlines using brand 500

- Spacing & Layout
  - Maintain 1:2 padding-to-gap ratio where possible
  - Grid transitions at `md` for two-column forms; single column below `md`

- Interactive States
  - Use `transition-gpu` and `will-change-transform-opacity` for hover/press
  - Avoid color-only indicators; combine underline/weight with color

- Responsiveness
  - Keep tap targets ≥48px height on touch devices
  - Use `sm`, `md` breakpoints for layout changes; keep content readable at 320px

## Accessibility Checklist

- Ensure brand accent text meets 4.5:1 contrast on light/dark modes
- Provide visible focus states (`outline` or `ring`) on all interactive elements
- Verify headings follow semantic hierarchy within tool cards/pages
- Use `aria-label` for ambiguous links (e.g., “Read Guide” → `aria-label` with tool name)

## Implementation Notes

- CSS variables and component classes are defined in `app/globals.css`
- Tailwind custom colors live in `tailwind.config.js` under `theme.extend.colors.brand` and `accessibleGray`
- Prefer Tailwind utilities for layout; use component classes for consistent visuals