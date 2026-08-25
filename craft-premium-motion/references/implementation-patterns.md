# Implementation patterns

## Contents

1. Tokens and architecture
2. React and Next.js
3. GSAP lifecycle
4. Scroll systems
5. WebGL and 3D
6. Responsive and accessible variants
7. Performance engineering

## 1. Tokens and architecture

Define semantic tokens rather than scattering milliseconds and eases:

```css
:root {
  --motion-instant: 120ms;
  --motion-fast: 180ms;
  --motion-base: 280ms;
  --motion-slow: 480ms;
  --ease-out: cubic-bezier(.16, 1, .3, 1);
  --ease-standard: cubic-bezier(.65, 0, .35, 1);
  --distance-xs: 4px;
  --distance-sm: 12px;
  --distance-md: 24px;
}
```

Tune values to the product. Expose semantic variants such as `feedback`, `enter`, `exit`, `layout`, and `signature` in framework code.

## 2. React and Next.js

- Keep animation in the smallest practical Client Component.
- Avoid adding `"use client"` to a route layout solely for one animated child.
- Render meaningful final-state markup on the server; initialize hidden states only where JavaScript can reliably reveal them.
- Use `AnimatePresence` with stable keys and route architecture that permits exit state to remain mounted.
- Use `layout`/`layoutId` only on stable semantic relationships and test scroll/transform ancestors.
- Keep variants outside render or memoize complex objects where it improves stability.
- Use the library's reduced-motion API plus CSS `prefers-reduced-motion` for non-JS styles.
- Prevent hydration differences from viewport-dependent initial render; measure after mount or use CSS/media queries.

## 3. GSAP lifecycle

- Register plugins once in an appropriate client-only module.
- Scope selectors to a component root.
- In React, use the current official `useGSAP` integration or `gsap.context()` and revert on teardown.
- Kill observers/triggers/timelines that outlive their context.
- Recalculate after responsive layout, fonts, or media changes; use `matchMedia` for breakpoint/reduced-motion variants.
- Do not create a ScrollTrigger for every trivial element when a batch or IntersectionObserver suffices.

## 4. Scroll systems

- Distinguish scroll-triggered (event at threshold) from scroll-linked (progress follows position).
- Use IntersectionObserver for simple reveals.
- Reserve pinning/scrubbing for a narrative relationship that requires it.
- Preserve native anchors, focus scrolling, restoration, deep links, keyboard scrolling, and back/forward behavior.
- Use only one RAF coordinator. Pause offscreen or when the document is hidden where practical.
- Refresh measurements after images/fonts/layout settle without creating loops.
- Avoid transform-based smooth-scroll containers that break sticky/fixed positioning unless intentionally supported.

## 5. WebGL and 3D

- Start with a static or CSS fallback.
- Cap device pixel ratio; reduce DPR, particles, postprocessing, shadows, and shader complexity adaptively.
- Stop or throttle the render loop when idle/offscreen. In React Three Fiber, consider demand-based rendering.
- Dispose geometries, materials, textures, render targets, controls, observers, and event listeners.
- Avoid shipping large models/textures before needed; compress and preload intentionally.
- Keep DOM text for essential content and accessibility instead of placing it only in canvas.
- Test context loss and resize behavior.

## 6. Responsive and accessible variants

Reduced motion may mean:

- replace parallax/scrub with a static final state;
- replace spatial travel/zoom with a short crossfade;
- stop ambient loops and autoplay;
- preserve state confirmation without movement;
- expose playback controls for non-essential animation/video.

Use `(hover: hover) and (pointer: fine)` for pointer-specific hover, magnetic, and tilt effects. Do not infer capability from viewport width alone.

## 7. Performance engineering

- Animate transforms and opacity whenever possible.
- Apply `will-change` shortly before expensive motion and remove it afterward; never blanket the page.
- Separate reads and writes; avoid layout reads inside a high-frequency write loop.
- Use passive listeners where appropriate and throttle work to animation frames.
- Avoid animating large blurred layers, filters, box shadows, masks, and blend modes continuously.
- Watch composited layer count and memory, not just FPS.
- Lazy-load optional engines/scenes and prefetch only when likely to be used.
- Profile real target devices. Desktop smoothness does not prove mobile quality.

