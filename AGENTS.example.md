# Project Agent Defaults

## Stack
Preserve an existing repository's established stack and conventions. For genuinely new web applications, load `bootstrapping-modern-web-apps` before scaffolding.

Default baseline for new frontend applications:
- Next.js App Router + React + TypeScript.
- Tailwind CSS v4.
- shadcn/ui when reusable accessible primitives are useful.
- ESLint.
- Prettier 3.7+ + `prettier-plugin-tailwindcss`, with the Tailwind v4 stylesheet path configured and class sorting enabled for `cn`, `clsx`, and `cva` where used.
- Server Components by default; Client Components only at interaction boundaries.

Do not install optional libraries without a concrete requirement. Use Motion for component interaction, GSAP/ScrollTrigger for complex choreography, Lenis only when smooth scrolling is justified, and Three.js/WebGL only when 3D materially supports the concept.

## Product quality
- Preserve existing functionality unless the task explicitly changes behavior.
- Treat Figma and supplied screenshots as visual evidence, not vague inspiration.
- Avoid generic AI-looking layouts, decorative bento grids, excessive glassmorphism, random gradients, and unmotivated animation.
- Keep UI responsive, accessible, and keyboard-operable.
- Never add private project names, client information, credentials, internal URLs, proprietary copy, or confidential implementation details to reusable skills or examples.

## Motion
- Use CSS for simple state transitions.
- Use Motion for component-level interaction and React-native choreography.
- Use GSAP + ScrollTrigger for complex timelines, pinned sections, and scroll storytelling.
- Use one smooth-scroll engine only; prefer Lenis when needed.
- Use Three.js/WebGL only when it materially supports the concept.
- Respect `prefers-reduced-motion` and clean up timelines, RAFs, listeners, observers, and WebGL resources.

## Git workflow
- Inspect `git status` before editing.
- Never commit directly to the default branch for feature work.
- Use a narrowly scoped feature/fix branch.
- Do not stage unrelated changes.
- Run the repository's lint, formatting check, typecheck, tests, and production build before handoff when available.
- Prefer PR-based delivery. If a repository has both development and production branches, promote changes through the development branch before production.

## Verification
Do not claim completion from code inspection alone when the task is visual or interactive. Render the result, inspect representative desktop and mobile sizes, check console errors, and compare against the source visual or acceptance criteria.
