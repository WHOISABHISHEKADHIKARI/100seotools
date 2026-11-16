# Design Brief: J and B Barista Academy Redesign

## Domain
education/food-and-beverage | coffee school | career training

## Audience & tone
prospective students (career-changers, hobbyists), coffee enthusiasts, parents
- tone: warm, trustworthy, inspiring, accessible, not elitist
- expert enough to convey credibility, approachable enough for beginners

## Mood
inviting, artisanal, community-focused, grounded

## Motion depth
subtle feedback on interactions (hover states, button presses, card reveals)
- no expressive choreography; motion serves focus, not decoration

## Layout family
mobile-first vertical sequence with varied horizontal layouts per section:
- hero: full-width with central content
- courses: 3-column grid on desktop, 1-column on mobile
- academy: text left / image right on desktop, stacked on mobile
- testimonials: 3-column grid on desktop, 1-column on mobile with quote highlight

## Reference anchor
Named aesthetic system: "editorial-minimal" - clean, generous whitespace, strong
typography hierarchy, limited accent color, image-led with intentional cropping.
Reference: linear-app, stripe-style clean commerce aesthetics adapted for
education.

---

## Design Principles (House Rules)

### Token by Intent
- All values resolve through the CSS variable token system (--color-brand, --color-earth, --color-sky)
- No hex colors, px lengths, ms timings, or font sizes written directly
- Measured by `scripts/lint_hardcodes.py`

### One Theme, One Source of Truth
- Every page and component renders from the same `tokens/*.json` -> one CSS-variable layer imported once at the app root
- No per-page palette, no hardcoded hex, px, or timing
- Measured by token consistency checks

### Zero Emoji
- Absolute: zero emoji in any output
- Emoji are the number-one tell of machine-generated slop
- Measured by `python3 scripts/check_no_emoji.py`

### No Hardcoded Values
- No hex colors, px lengths, ms timings, or font sizes written directly
- All values must resolve through the token system

### Eight States on Every Interactive Element
- Default, hover, active, focus, focus-pressed, disabled, loading, error
- Consistent across buttons, links, cards, form elements

### One Thing Leads
- Each section has one primary focal action or visual hierarchy element
- No competing primary actions; secondary/neutral actions are transparent/outline

### Accessibility
- Semantic HTML, ARIA labels, focus-visible styles, contrast ratios
- All interactive elements keyboard navigable

### Content First
- Real copy (quotes, names, descriptions) before layout finalization
- Placeholder images only until real photography is available

---

## Deliverables

1. Full Next.js 16 app directory redesign at `/Users/abhi/Documents/GitHub/100seotools/barista-academy/`
2. All sections: hero, courses (3 programs), academy vibe, testimonials
3. Navigation with mobile menu toggle
4. Footer with links and contact information
5. Tailwind CSS v4 token-based theming (brand/earth/sky palettes)
6. SVG illustrations (coffee cup, stars, placeholders) with currentColor
7. Working development server at localhost:3000
8. Gate output and critic verdict

---

## Gate Commands to Run

```bash
# Verify states on key components
node scripts/gate.mjs verify_states.mjs src/app/page.tsx --dark

# Verify responsive scaling
node scripts/gate.mjs verify_responsive.mjs src/app/page.tsx --scale=1.25

# Slop tells check (strict)
DS_REQUIRE_BROWSER=1 node scripts/slop_tells.mjs --strict src/app/page.tsx

# Taste audit (strict)
DS_REQUIRE_BROWSER=1 node scripts/taste_audit.mjs --strict src/app/page.tsx
```