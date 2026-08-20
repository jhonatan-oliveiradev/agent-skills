---
name: designing-action-combat
description: Use when creating or tuning real-time game combat involving attacks, hit reactions, dodge or guard behavior, enemy telegraphs, combos, animation timing, or moment-to-moment combat readability.
---

# Designing Action Combat

## Principle
Combat quality comes from readable intent, responsive control, meaningful commitment, and clear feedback.

## Define the contract
For each player action specify startup, active frames, recovery, movement allowance, cancel windows, stamina/resource cost, hitbox, damage/stagger, and audiovisual feedback.

For each enemy attack specify tell, wind-up, tracking rule, active window, recovery, safe response, and punish window.

## Workflow
1. Build a minimal duel before adding combo breadth.
2. Tune input responsiveness and locomotion around combat distances.
3. Ensure telegraphs are distinguishable by silhouette and timing, not only color.
4. Align hitboxes to animation intent rather than sprite/mesh bounds.
5. Use hit-stop, camera impulse, sound, VFX, and animation reaction proportionally to impact.
6. Add cancel rules deliberately; never let accidental animation interruption define the system.
7. Test edge cases: repeated input, direction change, simultaneous hits, wall proximity, low frame rate, off-camera enemies.

## Avoid
- attacks that visually connect before hit registration;
- identical timing for every enemy;
- excessive particle effects hiding danger;
- long uninterruptible animations without corresponding payoff;
- camera shake strong enough to damage targeting readability.
