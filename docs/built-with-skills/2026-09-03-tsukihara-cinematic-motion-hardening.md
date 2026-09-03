# Tsukihara — cinematic motion hardening

- Date: 2026-09-03
- Evidence class: `real-use`
- External project: Tsukihara
- Source repository: public; immutable implementation and CI identifiers are retained below
- Active packs represented: `motion`
- Methods used:
  - `craft-premium-motion`
  - `engineering-gsap-animations`
  - `orchestrating-cinematic-web-motion`
  - `optimizing-frontend-motion-performance`
  - `reconstructing-images-as-threejs`

## Context

Tsukihara already shipped a cinematic web experience built with GSAP/ScrollTrigger, Lenis, React Three Fiber, and Three.js. The real maintenance problem was not to add another decorative animation: the persistent WebGL world continued doing frame work when `prefers-reduced-motion` was active, the reduced-motion hero path still scheduled a ScrollTrigger refresh despite having no active timeline, and the eclipse moon needed a reference-grounded procedural treatment instead of an unconstrained 3D interpretation.

The bounded change became the external real-use case for the complete Motion pack.

## Method usage

### `craft-premium-motion`

The motion direction was treated as a hierarchy and continuity problem rather than a collection of effects. The existing cinematic hero remained the visual source of truth; the change preserved its authored pacing for normal-motion users while defining an intentionally quieter reduced-motion state instead of leaving continuous ambient animation running behind a nominal accessibility mode.

### `engineering-gsap-animations`

The GSAP/ScrollTrigger lifecycle was tightened at the hero boundary. When reduced motion disables the active hero timeline, the implementation no longer schedules the otherwise unnecessary `ScrollTrigger.refresh()` path. The change was covered by a source-level regression contract before production code changed.

### `orchestrating-cinematic-web-motion`

The existing hero, eclipse state, camera movement, and persistent world were kept as one cinematic system. The slice explicitly avoided introducing an independent decorative timeline or redesigning downstream sections; reduced-motion behavior was integrated into the existing orchestration so the experience keeps one ownership model.

### `optimizing-frontend-motion-performance`

The persistent R3F world now observes `prefers-reduced-motion`, uses an on-demand render loop in that mode, lowers DPR, and removes continuous petals and pointer-ember effects. This reduces frame/render work where the user has explicitly requested less motion while preserving the full experience for normal-motion sessions.

### `reconstructing-images-as-threejs`

A supplied Tsukihara eclipse reference showed a dark frontal lunar disc with a luminous crimson rim against a black field. The implementation used that evidence to create a deterministic single-view procedural reconstruction contract: front disc/shadow plus a dedicated `RingGeometry` rim/halo. It deliberately does not claim backside geometry, crater topology, or 360-degree fidelity that a single reference cannot support.

## Verification record

### External RED — lifecycle and reduced motion

Tsukihara PR #77 first encoded the missing behavior as regression contracts.

Canonical RED run: `33797213679`

- 7 hero/motion tests total
- 5 passed
- exactly 2 failed as intended:
  - the persistent WebGL world did not honor reduced motion with an on-demand loop
  - the reduced-motion hero path still scheduled an unnecessary ScrollTrigger refresh

### External GREEN — lifecycle and runtime

Intermediate verified candidate:

- Quality `33797759837` — SUCCESS
- Hero runtime smoke `33797759899` — SUCCESS

### External RED — reference-grounded Three.js reconstruction

Run `33798317720` failed at the new eclipse reconstruction contract before the deterministic reconstruction factory existed.

The accepted implementation remained evidence-limited to the visible frontal disc, shadow, and crimson rim.

### External final candidate

Final PR head: `439c6f13500a33d5d3addc68d60496627771384e`

- Quality `33799064900` — SUCCESS
  - Motion/hero: 8/8
  - REMEMBER: 97/97
  - Prettier: PASS
  - ESLint: PASS
  - production build: PASS
- Hero runtime smoke `33799064869` — SUCCESS
  - production build
  - Chromium setup
  - production server
  - cinematic gateway and hero runtime exercised
- Memory bridge visual QA `33799064948` — SUCCESS

Broader visual-QA failures on that candidate were retained in the PR rather than hidden; inspection placed them in untouched World Map, gateway, and other downstream visual workflows, not in the six-file Motion diff.

### External merge and main verification

Tsukihara PR #77 was merged on 2026-09-03.

- Merge commit: `5c65551a395f9eff9519f606d46e143b6611beb3`
- Post-merge Quality: `33801190546` — SUCCESS
- Main-branch gate passed hero/motion regression, REMEMBER regression, formatting, lint, and production build.

This Studio record is based on the verified merged external state above; it does not promote pre-merge candidate checks into post-merge evidence.

## Outcome

The real Tsukihara codebase now has a reduced-motion-aware persistent WebGL world, a tighter GSAP lifecycle on the hero path, preserved cinematic ownership, lower rendering work for accessibility-constrained sessions, and a reference-grounded procedural eclipse moon that does not overclaim unseen geometry.

All five Motion methods materially influenced the external implementation, verification, or evidence boundary before this case was recorded in Agent Skills Studio.
