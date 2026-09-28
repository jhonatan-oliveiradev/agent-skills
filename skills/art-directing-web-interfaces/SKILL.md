---
name: art-directing-web-interfaces
description: Use when a web page or product interface feels generic, templated, or visually interchangeable and needs a distinctive, evidence-based art direction before or during a redesign. Owns visual concept selection and critique across frameworks, not application scaffolding or exact reference reproduction.
---

# Art Directing Web Interfaces

## Outcome
Choose a visual direction that makes the actual product recognizable, apply it to a representative screen, and judge the result in the browser. Distinction should come from the product's content and constraints, not novelty for its own sake.

## 1. Read the product before designing
- Inspect the brief, audience, desired action, brand assets, real content, existing screens, and available design references. For a redesign, inspect the current desktop and mobile experience first.
- Write a short diagnosis: what the interface communicates now, where it becomes interchangeable with competitors, and which behaviors or brand cues must remain.
- Identify any constraints that limit visual experimentation, including content density, accessibility, performance, platform conventions, and existing component contracts.
- If references are supplied, describe the decisions behind them (composition, scale, rhythm, material, interaction); do not reproduce a reference's layout, assets, or identity by default.

## 2. Choose a direction with a reason
- Sketch two meaningfully different directions in words or quick visual compositions. For each, specify the visual idea, the content that supports it, and one tradeoff. Avoid presenting palette swaps as distinct concepts.
- Select one direction using audience fit, product clarity, feasibility, and continuity with existing identity. Explain the choice briefly; ask for a preference only if the brief leaves a material fork unresolved.
- Define a compact art-direction contract: hierarchy, layout rhythm, type roles, color roles, image or illustration approach, one signature moment, and motion behavior. Name what stays quiet so the signature has room to work.
- Treat typography and composition as structural choices. Do not substitute gradients, shadows, oversized headings, or animated decoration for a weak story or unclear action.

## 3. Apply and critique
- If implementation is in scope, carry the chosen direction into a representative viewport and its adjacent section or state before repeating the pattern across the site. Use the project's existing framework and tokens unless a change has a clear reason.
- Preserve real information, semantics, keyboard operation, focus visibility, contrast, and reduced-motion behavior. Choose motion by purpose: orient, respond, or reveal; provide an equivalent readable static state.
- Review actual renders at narrow and wide viewports. Compare intended hierarchy with what first draws attention; inspect reading order, line breaks, density, spacing, crop, interaction states, and consistency across sections.
- Correct the largest mismatch first. If the result still feels generic, revisit the product story, composition, or media choice before adding more effects. Capture screenshots or describe observed limitations when visual inspection is unavailable.

## Handoff
Report the chosen direction and its product rationale, what was applied, the visual evidence inspected, concrete remaining gaps, and the next most useful adjustment. Do not claim an interface is distinctive, accessible, or performant solely because it follows a checklist.

## Boundaries
- `building-premium-nextjs-interfaces` owns full React/Next.js implementation and production behavior; use it when building the interface is the primary task.
- `designing-ui-systems` owns reusable tokens and component contracts across screens.
- `implementing-reference-faithful-ui` owns faithful reproduction of an approved reference; `auditing-pixel-perfect-frontend` owns comparison against that reference after implementation.
