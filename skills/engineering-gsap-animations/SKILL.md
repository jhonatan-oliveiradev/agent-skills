---
name: engineering-gsap-animations
description: Use when GSAP has been selected for React or Next.js animation, especially timelines, ScrollTrigger, pinning, scrub, SplitText, Flip, SVG, responsive animation, plugin lifecycle, cleanup, or animation-related integration bugs.
---

# Engineering GSAP Animations

## Overview

Implement GSAP as a scoped, interruptible subsystem. Let product direction choose the effect; let this skill own API correctness, React lifecycle, plugin behavior, cleanup, and verification.

**REQUIRED ROUTING:** Use `craft-premium-motion` first when the technology or motion direction is still undecided. Use `optimizing-frontend-motion-performance` when runtime profiling or long-session degradation is the main problem.

## Workflow

1. Inspect the installed `gsap` and `@gsap/react` versions, existing animation engines, Client Component boundaries, DOM ownership, fonts, media, scroller, and reduced-motion policy.
2. Assign one animation owner per property and node. Put Motion state/layout effects on a child wrapper when GSAP owns a parent transform.
3. Select the smallest GSAP surface: tween, timeline, ScrollTrigger, or a specific plugin.
4. Implement inside a scoped `useGSAP()` context. Register only used plugins, make delayed callbacks context-safe, and rebuild measurement-dependent effects when their inputs change.
5. Provide a non-pinned, readable reduced-motion state. Treat mobile/coarse-pointer behavior as a deliberate variant.
6. Verify production behavior through resize, font/media load, route changes, Fast Refresh, repeated mount/unmount, rapid scrolling, and preference changes.

## Reference routing

| Need | Read |
|---|---|
| Tweens, eases, timelines, labels, positions | [core-and-timelines.md](references/core-and-timelines.md) |
| React 19, Next.js App Router, `useGSAP`, SSR | [react-nextjs.md](references/react-nextjs.md) |
| ScrollTrigger, pin, scrub, SplitText and plugins | [scrolltrigger-and-plugins.md](references/scrolltrigger-and-plugins.md) |
| FPS, `will-change`, reduced motion, cleanup | [performance-accessibility.md](references/performance-accessibility.md) |

## Implementation contract

- Prefer refs or selectors scoped to the component root.
- Use timelines for choreography; do not chain unrelated delays.
- Use function-based measurement plus `invalidateOnRefresh` when geometry can change.
- Choose one SplitText lifecycle: return the animation from `onSplit` when using `autoSplit`, or rebuild the entire dependent timeline after a manual re-split. Never let an external timeline keep stale character nodes.
- Revert SplitText and GSAP contexts; kill observers/listeners created outside the context.
- Preserve the project's package manager and compatible versions. Add or upgrade GSAP only when the requested API is missing or the project has an evidenced compatibility problem; never replace a working version with `latest` by default.
- Confirm current plugin imports and licensing from official GSAP documentation before changing dependencies.

## Common mistakes

- Animating the same transform with Motion and GSAP.
- Creating ScrollTrigger before fonts, images, or layout settle.
- Using permanent `will-change` across many elements.
- Calling `ScrollTrigger.refresh()` repeatedly without coalescing layout changes.
- Treating build success as proof that pinning, cleanup, and reduced motion work.

Technical basis: official [GreenSock GSAP skills](https://github.com/greensock/gsap-skills), adapted for this stack.
