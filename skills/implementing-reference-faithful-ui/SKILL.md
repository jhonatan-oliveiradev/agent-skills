---
name: implementing-reference-faithful-ui
description: Use when implementing a UI from Figma, screenshots, mockups, or an existing visual reference and fidelity to layout, spacing, typography, crops, and states is a primary acceptance criterion.
---

# Implementing Reference-Faithful UI

## Rule
Treat the supplied visual as evidence. Do not improvise away visible differences that can be measured.

## Workflow
1. Inventory source evidence: viewport size, grid, container widths, anchors, spacing, type styles, image bounds, radius, borders, shadows, icons, and responsive clues.
2. Identify invariants versus responsive behavior. Do not force desktop geometry onto mobile.
3. Match structural geometry first: section heights, columns, alignment, content widths, media boxes.
4. Match typography next: family, size, line-height, tracking, weight, wrapping, overflow behavior.
5. Match surfaces last: color, border, shadow, blur, texture, micro-details.
6. Implement interactions only when they exist in the reference or are required by usability.
7. Render and compare. Fix the largest visual delta first, then iterate downward.

## Pixel-perfect checks
- Text does not wrap differently without reason.
- Images are not accidentally cropped or scaled on hover.
- Overflow does not clip intended typography or controls.
- Icons are visually equivalent and aligned to baseline.
- Absolute positioning is used only when the design truly requires it.
- Desktop and mobile are validated separately.

## Guardrails
- Do not replace unusual design decisions with generic component-library defaults.
- Do not add hover scaling, glass, gradients, cards, or animation just to make the result feel richer.
- Do not claim pixel-perfect fidelity without rendering the result.
- If an asset is unavailable, preserve the geometry and document the substitute.
