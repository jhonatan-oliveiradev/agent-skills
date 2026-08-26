# Motion quality audit

Use this checklist after implementation or during a review. Report evidence and concrete locations rather than awarding a decorative score.

## Direction

- [ ] Motion personality matches the brand and product context.
- [ ] One clear signature moment leads; supporting effects remain subordinate.
- [ ] Timing, easing, distance, depth, and stagger form a coherent vocabulary.
- [ ] Movement explains hierarchy, causality, state, or emotion.
- [ ] Repeated sections do not all use the same generic reveal without reason.

## Interaction

- [ ] Feedback begins promptly and can be interrupted/reversed cleanly.
- [ ] Hover has an equivalent usable focus/touch experience.
- [ ] Essential information and controls never require hover or animation.
- [ ] Rapid clicking, route changes, and repeated open/close do not strand states.
- [ ] Animation never delays task completion or creates fake waiting.

## Accessibility

- [ ] `prefers-reduced-motion` produces a complete alternate experience.
- [ ] Focus order, focus visibility, announcements, and semantic state remain correct.
- [ ] No flashing, uncontrolled autoplay, nausea-inducing travel, or scroll trap.
- [ ] Anchors, keyboard scrolling, back/forward, and browser zoom still work.

## Performance

- [ ] Target properties are primarily transform/opacity.
- [ ] Continuous loops pause or throttle when hidden/offscreen.
- [ ] Listeners, observers, RAF loops, timelines, triggers, and WebGL resources clean up.
- [ ] No layout shift, initial flash, hydration error, or duplicate animation initialization.
- [ ] Heavy libraries/scenes are justified, scoped, and loaded intentionally.
- [ ] Mobile/coarse-pointer/weak-GPU variants are simpler where needed.

## Engineering

- [ ] Each property has one clear animation owner.
- [ ] Shared tokens/primitives replace repeated magic values.
- [ ] Server/client boundaries remain narrow.
- [ ] Component APIs and existing behavior remain compatible.
- [ ] Production build, types, lint, and relevant tests pass.

## Review output

Summarize:

1. observed motion language;
2. highest-impact problems, ordered by severity;
3. recommended or implemented motion direction;
4. technology decisions and rejected alternatives;
5. verification evidence and remaining risks.

