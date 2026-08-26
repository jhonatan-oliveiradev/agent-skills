# Technology routing

## Contents

1. Decision order
2. Routing matrix
3. Coexistence rules
4. Dependency rules

## 1. Decision order

For each effect, ask:

1. Can CSS express it cleanly and accessibly?
2. Is it driven by component state, layout, presence, or gesture?
3. Does it require an authored multi-element timeline or advanced scroll/SVG control?
4. Is smooth scrolling part of the concept or merely decoration?
5. Is real spatial rendering necessary?

Use the first adequate layer. Complexity must purchase a visible, valuable capability.

## 2. Routing matrix

| Need | Preferred tool | Notes |
|---|---|---|
| Color, shadow, underline, small transform | CSS | Use media queries for hover/reduced motion |
| Native imperative sequence | Web Animations API | Keep cancellation and cleanup explicit |
| Same-document/navigation continuity | View Transitions API | Add feature detection and fallback |
| React presence, layout, shared elements | Motion | Prefer `motion/react`; use `LazyMotion` when useful |
| React drag, tap, gesture, spring | Motion | Favor state-driven declarative ownership |
| Complex timeline and choreography | GSAP | Scope with context/useGSAP and revert on cleanup |
| Scroll pin/scrub/sequence | GSAP ScrollTrigger | Avoid excessive pinned regions; refresh after layout/font changes |
| SVG morph/path/draw/FLIP | GSAP or Motion | Select based on orchestration and licensed plugin availability |
| Eased scrolling | Lenis | Preserve anchor navigation and integrate a single RAF source |
| WebGL scene/shader/particles | Three.js | Dispose resources and provide fallback |
| React-declared 3D | React Three Fiber | Manage frameloop/DPR adaptively |
| Authored vector animation | Lottie | Optimize JSON/assets; pause offscreen |
| Interactive vector state machine | Rive | Prefer when the asset was designed for states/inputs |

## 3. Coexistence rules

- Assign one engine as owner of each animated property.
- A common safe split is Motion for component state and GSAP for a scoped signature timeline on separate wrappers/elements.
- If Lenis and ScrollTrigger coexist, synchronize their update loop according to current official docs; do not create competing RAF loops.
- Place independent transform layers in nested wrappers when effects need separate ownership.
- Centralize reduced-motion policy even when multiple engines are present.
- Avoid mixing native smooth scrolling, a smooth-scroll library, and a scroll-smoothing plugin.

## 4. Dependency rules

- Inspect installed packages and lockfile before adding anything.
- Confirm current APIs in official documentation; package names and React imports evolve.
- Reuse the project's package manager.
- Check license/availability before relying on premium components, templates, plugins, examples, or proprietary effects.
- Prefer copied source only when its license permits it and the project benefits from owning the code; then adapt styling, semantics, performance, and accessibility.
- Dynamically import heavy scenes or rare interactions, but avoid delayed readiness for primary controls.
- Do not replace a working engine across the project unless requested or measurably beneficial.
