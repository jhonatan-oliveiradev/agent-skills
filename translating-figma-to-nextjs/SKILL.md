---
name: translating-figma-to-nextjs
description: Use when converting Figma designs or design-system components into production Next.js and React code while preserving fidelity, reuse, responsiveness, and maintainable component boundaries.
---

# Translating Figma to Next.js

## Workflow
1. Read the Figma hierarchy before coding: frames, auto-layout behavior, constraints, variants, variables, typography, grids, and component instances.
2. Map design primitives to existing code primitives before inventing new ones.
3. Infer responsive intent from constraints and neighboring frames; do not encode one screenshot as absolute pixels everywhere.
4. Use Next.js image/font facilities when they fit the repository.
5. Keep decorative layers separate from semantic content so responsiveness does not depend on fragile DOM ordering.
6. Implement reusable variants only where Figma shows a real component family or the product reuses the pattern.
7. Render and compare against Figma at the target frame dimensions.

## Fidelity priorities
1. geometry;
2. typography;
3. image crop;
4. color and surface treatment;
5. interaction and motion.

## Guardrails
- Existing app architecture wins over generated Figma structure.
- Avoid exporting raw Figma CSS as production architecture.
- Avoid unnecessary absolute positioning.
- Preserve accessible names when splitting or animating text.
- If an icon or asset is missing, source a legitimate equivalent rather than redrawing a brand mark inaccurately.
