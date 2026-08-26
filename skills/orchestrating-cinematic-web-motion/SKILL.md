---
name: orchestrating-cinematic-web-motion
description: Use when a React or Next.js interface needs a coherent premium motion language involving scroll choreography, reveals, parallax, pinned scenes, hover motion, or cinematic transitions.
---

# Orchestrating Cinematic Web Motion

## Stack decision
- CSS: simple hover/focus/tap transitions.
- Motion: component state, layout transitions, presence, lightweight interaction.
- GSAP + ScrollTrigger: multi-step timelines, pinned scenes, scrubbed storytelling, complex sequencing.
- Lenis: optional smooth scroll. Use exactly one smooth-scroll engine.
- Three.js/WebGL: only when spatial or shader behavior materially supports the concept.

## Taste defaults
Motion should guide hierarchy, add depth, and preserve legibility. Prefer restrained easing and modest transforms over bounce, overshoot, or large scale jumps.

Useful defaults:
- reveal duration: 0.7–1.0s;
- hover: 0.25–0.5s;
- word stagger: 0.03–0.06s;
- grouped items: 0.05–0.10s;
- reveal trigger near 80–85% viewport;
- scrub around 0.8–1.3 when narrative lag helps.

## Workflow
1. Make static layout excellent first.
2. Define motion roles: entrance, reading-order reveal, scroll narrative, direct manipulation, ambient detail.
3. Ensure one property has one animation owner.
4. Scope GSAP with cleanup on unmount and refresh after font/media/layout changes.
5. Disable scrubbed and pointer-heavy behavior for reduced motion/coarse pointers where appropriate; render final states immediately.
6. Test rapid scrolling, resize, route navigation, tab visibility changes, and mobile touch.

## Avoid
- animating every section identically;
- stacking Motion and GSAP on the same transform;
- initializing multiple smooth-scroll engines;
- permanent `will-change` on many nodes;
- motion that hides navigation or CTA until a long intro completes.
