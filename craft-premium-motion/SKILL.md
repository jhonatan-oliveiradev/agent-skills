---
name: craft-premium-motion
description: Use when designing, implementing, refining, or auditing premium web motion systems, including microinteractions, transitions, scroll choreography, reveals, kinetic typography, smooth scrolling, SVG, canvas, WebGL, 3D, loaders, ambient effects, and animation performance. Applies to React, Next.js, Vue, Svelte, and vanilla projects needing coherent motion, reference-inspired movement, motion tokens, or fixes for janky, excessive, or inaccessible animation.
---

# Craft Premium Motion

Act as both motion director and motion engineer. Create movement that communicates hierarchy, causality, personality, and state. Prefer a coherent motion language over a collection of unrelated effects.

## Operating contract

- Preserve the project's visual language, component APIs, framework conventions, and existing user changes.
- Match the authorization scope. For reviews, inspect and recommend; for build/change requests, implement and verify.
- Never install a library solely because it is fashionable. Choose the lightest adequate mechanism.
- Treat references as inspiration and implementation research, not as permission to copy proprietary code or branded compositions.
- Keep content, navigation, focus, pointer, touch, and keyboard behavior usable without animation.
- Make reduced motion a first-class alternate experience, not merely a shorter duration.
- Avoid scroll hijacking, fake latency, gratuitous loaders, cursor replacement that obscures affordances, and motion that blocks task completion.

## Workflow

### 1. Inspect before designing

Read the relevant components, styles, dependencies, routing/layout architecture, and existing animation utilities. Determine:

- product type, audience, brand mood, density, and primary user tasks;
- current motion vocabulary and inconsistencies;
- rendering boundaries, especially React Server/Client Components;
- input modes, responsive breakpoints, and low-power constraints;
- existing animation libraries, duplicated engines, and cleanup risks.

Run `python3 scripts/motion_audit.py <project-root>` for a fast static inventory when a repository is available. Treat its findings as leads and confirm them in context.

If the user supplies a video, live URL, Figma prototype, or visual reference, inspect it closely. Describe the observed timing, spatial model, choreography, and interaction trigger rather than saying only "make it like this."

### 2. Define the motion direction

Create a compact motion brief before substantial implementation:

- **personality:** 2–4 adjectives consistent with the brand;
- **principles:** 3 rules governing how elements enter, respond, and exit;
- **hierarchy:** hero/signature, section, component, and feedback layers;
- **tokens:** duration bands, eases/springs, distance, stagger, blur, and depth limits;
- **motion budget:** one signature moment per viewport or route, with supporting motion subordinate to it;
- **fallbacks:** touch, reduced motion, narrow screens, weak GPUs, and no-JS behavior.

Read [motion-direction.md](references/motion-direction.md) for timing, easing, choreography, and anti-patterns. When evolving an existing product, derive this brief from its current identity instead of imposing a generic "Awwwards" aesthetic.

### 3. Route each effect to the right technology

Read [technology-routing.md](references/technology-routing.md) before adding or replacing a dependency. Default routing:

- CSS transitions/keyframes for isolated state changes and simple hover/focus feedback.
- Web Animations API or View Transitions for native imperative sequences or navigation continuity when browser/project support is suitable.
- Motion for React state, layout, presence, gestures, shared elements, and component-local scroll effects.
- GSAP for orchestrated timelines, complex scroll choreography, SVG, FLIP, text sequencing, or imperative multi-element control.
- Lenis only when eased scrolling materially supports the concept; integrate it with the chosen scroll engine and preserve anchors/accessibility.
- Three.js/React Three Fiber for genuinely spatial, shader, particle, lighting, or camera-driven experiences—not decorative 3D that could be CSS.
- Lottie/Rive for authored vector/state-machine animation when matching source assets exist.

Do not run multiple animation engines over the same property on the same element. Establish ownership boundaries when more than one engine is justified.

### 4. Implement as a system

Build shared primitives or tokens before repeating ad hoc values. Typical primitives include `MotionProvider`, reduced-motion policy, reveal/stagger variants, magnetic/tilt helpers, route transition shell, scroll progress, and a consistent interactive-state recipe.

Read [implementation-patterns.md](references/implementation-patterns.md) for React/Next lifecycle, scroll, WebGL, responsive, and cleanup guidance.

Implementation rules:

- Animate `transform` and `opacity` by default; justify layout/paint-heavy properties.
- Use transform composition carefully so hover, layout, and scroll effects do not overwrite each other.
- Prefer physics for direct manipulation and concise easing curves for authored sequences.
- Make interruptions and rapid repeated input graceful.
- Keep focus feedback at least as clear as hover feedback; avoid hover-only information.
- Disable pointer-parallax/tilt on coarse pointers; simplify 3D and continuous effects on constrained devices.
- Scope and clean up timelines, observers, RAF loops, listeners, contexts, canvases, and WebGL resources.
- Prevent initial flashes and hydration mismatches. Avoid turning large server-rendered trees into client components for one animation.
- Load heavy engines/scenes dynamically where appropriate and reserve layout space to avoid CLS.

### 5. Verify the experience

Test the behavior, not only compilation:

- keyboard, pointer, touch, resize, route change, back/forward, and repeated interaction;
- reduced motion and animation-disabled fallbacks;
- mobile viewport, coarse pointer, low-power strategy, and content overflow;
- no console errors, stale inline styles, orphaned triggers, duplicate RAF loops, or memory leaks;
- stable layout, readable text, usable controls, and no scroll traps;
- production build plus the project's relevant tests/lint/typecheck.

Read [quality-audit.md](references/quality-audit.md) for the final review. Report what changed, the motion rationale, the technology chosen, verification performed, and any remaining device/browser risk.

## Reference research

When current examples would materially improve the result and internet access is available, inspect only the relevant sources in [inspiration-sources.md](references/inspiration-sources.md). Extract principles and interaction anatomy; do not paste a component blindly. Confirm dependency versions and APIs from official documentation because animation ecosystems change quickly.

## Deliverable quality bar

A premium result must satisfy all of the following:

1. **Intentional:** every noticeable motion has a communicative or emotional purpose.
2. **Coherent:** timing, easing, distance, and depth feel related across the product.
3. **Responsive:** feedback starts promptly and remains interruptible.
4. **Performant:** motion stays smooth on target devices without sacrificing stability.
5. **Inclusive:** reduced-motion, touch, keyboard, and focus experiences remain complete.
6. **Maintainable:** tokens, primitives, ownership, and cleanup are clear.
7. **Distinctive:** signature motion grows from the brand rather than a stock effect library.
