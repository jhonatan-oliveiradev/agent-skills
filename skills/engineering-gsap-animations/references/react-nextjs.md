# GSAP with React and Next.js

## Lifecycle pattern

Keep animated DOM in the smallest practical Client Component. Register plugins in a client-safe module, scope selectors, and create animations with `useGSAP`.

Inspect the lockfile and installed versions first. Use the project's existing package manager and version policy; do not prescribe `@latest` when the required APIs are already available.

```tsx
"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function Reveal() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-reveal]", {
        y: 24,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "power3.out",
      });
    },
    { scope: root },
  );

  return <div ref={root}>{/* server-provided content */}</div>;
}
```

## Async and event callbacks

Animations created after the `useGSAP` callback—inside a promise, timer, listener, or event handler—must be wrapped with the hook's `contextSafe` helper so cleanup can track them.

When an effect depends on final font or media metrics:

1. keep static content visible and usable;
2. wait for the required readiness signal;
3. enter through a context-safe callback;
4. guard against a disposed component;
5. coalesce resize work into one animation frame;
6. revert the complete measurement-dependent system before rebuilding.

## Ownership

If Motion controls hover or layout, nest wrappers:

- GSAP parent: scroll position, entrance, pinning;
- Motion child: hover, tap, presence, or layout state.

Do not let both write `transform`, `opacity`, or inline styles on the same node.

## Next.js checks

- Avoid moving a large Server Component tree behind `"use client"` for one animation.
- Prevent flashes with an intentional initial CSS state only when JavaScript failure still leaves content recoverable.
- Test route transitions, back/forward navigation, Fast Refresh, and repeated mount/unmount.
