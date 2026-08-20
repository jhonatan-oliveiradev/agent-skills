---
name: testing-playable-games
description: Use when verifying a browser or desktop game build for gameplay correctness, controls, combat feel, camera behavior, animation, performance, progression, and regression risk before calling a feature complete.
---

# Testing Playable Games

## Test in layers
1. Boot and recoverability: load, restart, pause, resume, route/scene transition.
2. Controls: keyboard/gamepad/touch as supported; repeated and conflicting inputs.
3. Movement and camera: boundaries, collision, slopes, follow lag, zoom, occlusion.
4. Combat: hit registration, invulnerability, cooldowns, enemy state transitions, death, reset.
5. Animation: transitions, looping, foot sliding, weapon continuity, effect timing.
6. Progression: inventory, pickups, checkpoints, save/load, rewards.
7. Performance: frame pacing, long-session stability, asset spikes, offscreen work.

## Evidence
Reproduce failures with exact steps. For visual defects capture the state or frame where the problem is visible. Separate design feedback from implementation bugs.

## Acceptance
A feature is not complete because its isolated code path works. It must survive normal gameplay sequences and transitions into and out of the state.
