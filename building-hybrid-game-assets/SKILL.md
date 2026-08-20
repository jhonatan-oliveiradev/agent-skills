---
name: building-hybrid-game-assets
description: Use when a game needs a practical pipeline combining generated, hand-authored, 2D, 3D, procedural, or purchased assets while keeping visual consistency, runtime constraints, and iteration speed under control.
---

# Building Hybrid Game Assets

## Goal
Choose the cheapest reliable representation for each asset while keeping the world visually coherent.

## Workflow
1. Lock the game's visual language before producing volume: silhouette, proportions, palette, material response, outline/shading, camera, scale.
2. Classify asset types by gameplay role and camera distance.
3. Decide per class: sprite, billboard, low-poly mesh, procedural geometry, texture, VFX, or UI illustration.
4. Define naming, pivot/origin, scale, frame dimensions, atlas rules, LOD expectations, compression, and export format before batch generation.
5. Make one gold-standard asset per class and validate it in-engine before creating the set.
6. Keep source and runtime-ready assets separate.
7. Validate memory, batching/draw calls, texture dimensions, transparency, collision bounds, and readability in gameplay lighting.

## Rule
Asset fidelity is measured in the game camera and motion, not only in isolated renders.
