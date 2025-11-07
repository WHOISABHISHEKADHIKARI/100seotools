Title: Overlay Link Pattern – Runbook

Goal
- Make an entire card clickable without nested anchors.

Pattern
- Wrap card in a container with `position: relative`.
- Place an outer anchor with `absolute inset-0 z-10` covering the card.
- Keep all inner interactive elements non-anchors (buttons, spans) or anchors styled with `relative z-20` and event handlers that `stopPropagation` when needed.

Do
- Use `e.preventDefault()` + `e.stopPropagation()` with router navigation for inner controls.
- Prefer `span[role=link]` where inner CTA should not be anchor.

Don’t
- Don’t nest `<a>` inside another `<a>`.
- Don’t pass non-DOM props to native elements.

Checklist
- Outer link present and covers card.
- Inner content wrapped in `relative z-20`.
- Inner CTAs avoid anchors or stop propagation.