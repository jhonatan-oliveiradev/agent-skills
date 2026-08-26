# GSAP Core and Timelines

## Choose the primitive

| Requirement | Primitive |
|---|---|
| One state change | `gsap.to`, `from`, or `fromTo` |
| Ordered choreography | `gsap.timeline` |
| Repeated pointer updates | `quickTo` or `quickSetter` |
| Responsive variants | `gsap.matchMedia` |
| Scroll-linked progress | ScrollTrigger |

## Core rules

- Prefer transform aliases (`x`, `y`, `scale`, `rotation`) and `autoAlpha` over layout-heavy properties.
- Put shared `duration` and `ease` in timeline defaults.
- Use timeline position parameters and labels instead of accumulating delays.
- Use function-based values for measurements that may change and pair them with invalidation.
- Keep random behavior deterministic when screenshots or tests depend on it.

```ts
const timeline = gsap.timeline({
  defaults: { duration: 0.6, ease: "power3.out" },
});

timeline
  .addLabel("enter")
  .from(title, { yPercent: 110, autoAlpha: 0 }, "enter")
  .from(items, { y: 24, autoAlpha: 0, stagger: 0.07 }, "enter+=0.12")
  .to(accent, { scaleX: 1 }, "enter+=0.2");
```

Store a timeline only when external playback control is required. Otherwise keep it local to its lifecycle scope.

## Responsive motion

Use `gsap.matchMedia()` for query-specific construction and automatic reversion. Reduced motion should render the meaningful final state, not merely run the same pinned scene faster.
