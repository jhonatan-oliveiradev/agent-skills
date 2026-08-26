---
name: creating-character-sprite-pipelines
description: Use when defining, generating, reviewing, or expanding a 2D character sprite set that must remain anatomically consistent across idle, movement, combat, directional, and transition animations.
---

# Creating Character Sprite Pipelines

## Start with a model sheet
Before animation, lock character proportions, costume construction, weapon dimensions, hair masses, palette, silhouette, and front/three-quarter/side/back views. Do not animate from loosely related reference generations.

## Animation workflow
1. Define gameplay states and required transitions before drawing frames.
2. For locomotion, identify key poses first: contact, recoil/down, passing, high point, opposite contact.
3. Add breakdown/in-between frames only after the key cycle reads correctly.
4. Track root motion, foot contact, center of mass, shoulder/hip counter-rotation, hand/weapon arcs, and head stabilization.
5. Treat hair, cloth, straps, and loose accessories as follow-through layers with delayed motion, not random per-frame deformation.
6. Keep weapon-equipped locomotion consistent with the combat system. If attacks require an equipped weapon, explicitly define armed idle/run variants or a draw transition.
7. Preview at target game scale and animation speed; a contact sheet alone is not enough.

## Acceptance checks
- no duplicated pseudo-frames pretending to be a full cycle;
- left/right stride alternates visibly;
- feet do not slide during planted phases unless intentionally stylized;
- silhouette remains recognizable every frame;
- weapon length and grip do not drift;
- hair/clothing motion follows body acceleration and settles coherently;
- cycle loops without a visible teleport.
