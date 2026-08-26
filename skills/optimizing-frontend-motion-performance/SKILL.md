---
name: optimizing-frontend-motion-performance
description: Use when a frontend has janky scrolling, excessive CPU or GPU use, long-session slowdown, offscreen animation work, WebGL or RAF loops, animation-related memory leaks, or costly GSAP effects.
---

# Optimizing Frontend Motion Performance

## Rule
Measure before removing effects. Preserve the visual idea while stopping work that produces no visible value.

## Audit
Search for CSS keyframes, GSAP timelines, `requestAnimationFrame`, timers, observers, video, canvas/WebGL, physics, large blur/filter use, and event listeners.

Check runtime at top, middle, and lower page plus mobile when relevant. Distinguish CSS animation from JavaScript RAF work.

## Fix priorities
1. Stop or pause offscreen loops with `IntersectionObserver` or visibility state.
2. Cancel RAFs, timers, observers, and listeners on unmount.
3. Kill GSAP contexts/tweens/timelines during cleanup.
4. Dispose Three.js textures, geometries, materials, render targets, and renderer resources.
5. Cap device pixel ratio and pause WebGL when hidden/offscreen.
6. Avoid per-frame React state and per-frame allocation.
7. Reduce heavy blur/filter areas and continuously animated large surfaces.
8. Honor `prefers-reduced-motion`.

## Verification
Re-run the same runtime scenario after changes. Confirm visible animations still work, offscreen loops stop, route cycles do not accumulate canvases/listeners, console remains clean, and production checks pass.

## Never
Do not call performance fixed because the build passes, and do not remove all motion merely to make profiling quiet.
