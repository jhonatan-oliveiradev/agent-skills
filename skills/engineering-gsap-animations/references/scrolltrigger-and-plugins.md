# ScrollTrigger and GSAP Plugins

## ScrollTrigger contract

Register the plugin once, create triggers inside the component context, and use geometry functions when the page can resize.

```ts
const timeline = gsap.timeline({
  scrollTrigger: {
    trigger: section,
    start: "top top",
    end: () => `+=${Math.max(window.innerHeight, travel())}`,
    pin: true,
    scrub: 0.8,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  },
});

timeline.to(track, { x: () => -travel(), ease: "none" });
```

Rules:

- Pin only when the narrative requires temporal control; never trap navigation or hide the exit.
- Do not animate the pinned element itself when a child wrapper can move.
- Refresh after meaningful layout changes, not on every observer notification.
- Use markers during development and remove them from deliverables.
- Integrate one smooth-scrolling engine and confirm its official ScrollTrigger bridge.

## SplitText ownership

For autonomous responsive text, let `autoSplit` own its returned animation:

```ts
const split = SplitText.create(title, {
  type: "lines,words",
  autoSplit: true,
  onSplit(self) {
    return gsap.from(self.lines, {
      yPercent: 100,
      autoAlpha: 0,
      stagger: 0.06,
      duration: 0.7,
    });
  },
});
```

If the split nodes participate in a larger external timeline, disable autonomous ownership and rebuild the split plus every dependent timeline together after typography changes. Revert the previous split first.

## Plugin routing

| Need | Plugin |
|---|---|
| Preserve visual position across DOM/layout changes | Flip |
| Dragging with momentum | Draggable + Inertia |
| Text segmentation or scrambling | SplitText / ScrambleText |
| SVG draw, morph, or path travel | DrawSVG / MorphSVG / MotionPath |
| Authored easing | CustomEase / EasePack |

Import and register only what the effect uses. Confirm the installed GSAP version before relying on a recently added plugin or option.
