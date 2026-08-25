# Motion direction

## Contents

1. Intent and hierarchy
2. Motion personalities
3. Timing and easing
4. Choreography
5. Interaction patterns
6. Anti-patterns

## 1. Intent and hierarchy

Assign every animation one primary purpose: orient, connect, respond, prioritize, or express.

| Layer | Role | Typical examples |
|---|---|---|
| Signature | Memorable brand moment | hero sequence, spatial product reveal |
| Structural | Explain page/layout change | section reveal, shared layout transition |
| Component | Make controls feel tactile | card hover, tab indicator, menu open |
| Feedback | Confirm status immediately | press, success, error, loading |

Keep signature motion rare. Feedback motion may be frequent but subtle.

## 2. Motion personalities

Choose a blend rather than a preset:

- **Precise:** short distances, crisp ease-out, restrained overshoot.
- **Calm:** gentle opacity/position change, longer deceleration, low contrast.
- **Cinematic:** staged depth, masks, camera-like movement, deliberate pacing.
- **Playful:** elastic response, squash/stretch, controlled asymmetry.
- **Technical:** grids, scanning, parameterized movement, linear accents.
- **Organic:** curved paths, varied phase, soft spring response.
- **Editorial:** typographic masks, cuts, measured stagger, strong rhythm.
- **Luxurious:** minimal elements, slow confidence, fine detail, no visual noise.

Translate personality into constraints. Example: "precise + calm" means 1–4 px press travel, little bounce, short interaction durations, and longer but low-amplitude page reveals.

## 3. Timing and easing

Treat these as starting bands, then tune in the actual interface:

| Context | Typical duration | Guidance |
|---|---:|---|
| Press/acknowledgment | 70–140 ms | Immediate; avoid delay |
| Hover/focus | 120–220 ms | Fast enough to track exploration |
| Small enter/exit | 160–280 ms | Exit usually no slower than enter |
| Modal/menu/layout | 220–420 ms | Preserve continuity and focus |
| Section reveal | 350–700 ms | Keep travel restrained |
| Signature sequence | 700–1600 ms | Allow interruption; never block tasks |

- Use ease-out for entrances and direct responses.
- Use ease-in for exits only when the element can depart without feeling delayed.
- Use ease-in-out for continuous relocation or camera moves.
- Use springs for gesture-following, reordering, and interruptible physical response.
- Avoid strong elastic/bounce curves in serious, dense, or repetitive workflows.
- Stagger by reading order or semantic grouping, usually 20–90 ms. Cap the total cascade.

## 4. Choreography

- Establish a clear lead element and let secondary elements follow.
- Preserve spatial causality: origins, destinations, and direction should make sense.
- Overlap related actions; do not serialize every element.
- Use anticipation sparingly for expressive moments, not routine controls.
- Use masks, clipping, blur, depth, and scale as supporting dimensions, not all at once.
- Keep text readable; prefer line/word grouping over chaotic character animation.
- Make scroll-linked motion proportional and reversible; content must not become hostage to a narrow scroll range.

## 5. Interaction patterns

### Buttons and links

Combine no more than two or three cues: color/contrast, 1–2 px translation, icon travel, underline/reveal, or subtle scale. Keep focus-visible equivalent in clarity.

### Cards

Use elevation, media crop, border light, or small tilt to communicate clickability. Disable tilt on coarse pointers. Do not hide essential content until hover.

### Menus, dialogs, and sheets

Connect the trigger and surface spatially. Coordinate backdrop, container, and children; manage focus independently of animation. Exits must remain reliable when state changes quickly.

### Loading

Prefer progress or skeletons tied to real work. Continuous decorative motion must pause when offscreen. Never add a loader solely to showcase animation.

### Success and error

Use motion to reinforce, never replace, semantic text, color, iconography, or assistive announcements.

## 6. Anti-patterns

- Every section using the same fade-up regardless of meaning.
- Large blur plus large travel plus scale on all entrances.
- `transition: all` across complex components.
- Perpetual ambient motion competing with content.
- Parallax that reverses reading order or creates nausea.
- Magnetic controls that evade the pointer.
- Custom cursors that hide the native pointer or lag behind interaction.
- Long route transitions that mask slow navigation.
- Scroll smoothing imposed on forms or dense dashboards without clear benefit.
- 3D scenes with no fallback, disposal strategy, or mobile budget.
