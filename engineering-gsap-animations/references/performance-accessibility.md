# Performance and Accessibility

## Performance budget

- Animate transforms and opacity by default.
- Batch DOM reads before writes; do not measure repeatedly inside a tween callback.
- Use `quickTo` or `quickSetter` for high-frequency pointer input.
- Pause continuous work offscreen or while the document is hidden.
- Apply `will-change` shortly before expensive motion and remove it after completion.
- Avoid simultaneous large blur, filter, shadow, video, canvas, and WebGL workloads.
- Profile the intended device class; a desktop recording is not mobile evidence.

## Reduced motion

A reduced-motion variant must preserve content order, state feedback, navigation, and final visual meaning. Prefer:

- no pin or scrub;
- immediate final states;
- simple opacity only when helpful;
- static alternatives for parallax, looping backgrounds, and spatial camera motion.

Use `gsap.matchMedia()` so preference changes revert the old branch before constructing the new one.

## Cleanup inventory

Confirm that teardown covers:

- timelines, tweens, ScrollTriggers and matchMedia contexts;
- SplitText wrappers;
- observers, listeners, RAF handles and timers outside GSAP context;
- smooth-scroll bridges;
- inline styles that should not survive the component.

Verification must include repeated route cycles and a long enough session to reveal duplicated triggers or listeners.
