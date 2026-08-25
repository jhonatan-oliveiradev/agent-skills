---
name: reconstructing-images-as-threejs
description: Use when a supplied image should become a code-only procedural Three.js object or stylized character, especially when fidelity, hidden geometry, animation readiness, runtime hierarchy, review gates, or single-view limitations must be evaluated.
---

# Reconstructing Images as Three.js

## Overview

Treat image-to-3D as evidence-limited reconstruction, not extraction. Produce only the fidelity the references can support, label every inferred region, and prove runtime claims with geometry and motion tests.

**REQUIRED ROUTING:** Use `building-hybrid-game-assets` first when procedural Three.js has not yet been chosen over GLB, Blender, sprites, billboards, or generated meshes. Use this skill only after code-only procedural reconstruction is justified.

## Operating modes

| Mode | Output |
|---|---|
| Suitability | Verdict, evidence gaps, representation options, risks |
| Blockout | Camera-matched silhouette and macro volumes |
| Reconstruction | Staged factory with materials and named parts |
| Action-ready | Proven pivots, sockets, collisions, destruction groups |
| Animation-ready | Valid rig payload plus deformation and pose evidence |

A `THREE.Group`, `Skeleton`, or `AnimationClip` alone does not prove action or animation readiness.

## Workflow

1. Admit the references and define what is visible, occluded, distorted, or unknown. Read [intake-and-confidence.md](references/intake-and-confidence.md).
2. Fix the target camera, runtime, performance budget, output API, acceptable stylization, and whether inferred surfaces are allowed.
3. Write a reconstruction contract: component hierarchy, proportions, materials, moving parts, confidence by region, and explicit acceptance gates.
4. Build in gated passes: camera → silhouette → structure → form → material → lighting → interaction → optimization. Change one diagnostic group per correction.
5. Keep reconstruction data separate from renderer objects and emit a deterministic TypeScript factory. Read [factory-contract.md](references/factory-contract.md).
6. Capture front, rear, sides, and meaningful three-quarter views. Compare only views supported by evidence; review inferred views for plausibility, not likeness.
7. Run deterministic checks before visual judgment, record failures and confidence, then choose exactly one: `continue | refine-spec | refine-code | request-input | stop`. Read [review-gates.md](references/review-gates.md).

## Hard rules

- Never promise exact 360° geometry or likeness from one view.
- Never invent thresholds, triangle budgets, landmarks, or camera parameters. Derive them from the target or label them as proposed values requiring approval.
- Never call a model animation-ready before pose stress, joint deformation, weight normalization, clipping, and runtime binding pass.
- Never use texture or lighting to conceal missing identity-defining structure.
- Stop and request input when hidden geometry, a specific likeness, or an unsupported runtime requirement materially determines success.
- Inspect dependency versions and scripts before execution. Do not install or run the upstream toolkit automatically.

## Common mistakes

- Spending detail on the face before camera and silhouette agree.
- Treating the reference pixels as topology evidence.
- Comparing inferred backs against a nonexistent source.
- Combining camera, geometry, material, and lighting changes in one correction.
- Calling a better-looking render “validated” without repeatable captures and recorded gates.

Technical basis: [img2threejs](https://github.com/img2threejs/img2threejs), Apache-2.0. This adaptation does not bundle or claim execution of its Forge scripts.
