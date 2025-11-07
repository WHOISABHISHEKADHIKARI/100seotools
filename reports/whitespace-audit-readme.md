# Whitespace Audit and Standardization

This report documents the whitespace audit and fixes applied across the repository.

## Scope
- Files scanned: `app/`, `components/`, `lib/`, `content/`, `public/`, `reports/`, `scripts/`
- File types: `.js`, `.jsx`, `.ts`, `.tsx`, `.json`, `.md`, `.txt`, `.css`, `.html`

## Standards
- Line endings: `LF`
- Final newline: enforced
- Indentation: 2 spaces
- Trailing spaces: removed
- Markdown: preserves hard line breaks (two trailing spaces)

## Validation
- Dry-run audit: `npm run lint:whitespace`
- Fix pass: `npm run fix:whitespace`
- Reports: `reports/whitespace-audit-*.json`

## Pre-commit Enforcement
A pre-commit hook (`.husky/pre-commit`) audits and fixes whitespace and stages changes.

## Notes
- Intentional whitespace in Markdown code blocks is preserved as much as possible.
- JSON-LD blocks were unaffected; only trailing spaces and line endings normalized.