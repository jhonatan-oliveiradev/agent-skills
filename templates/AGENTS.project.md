# Project Agent Instructions

## Repository first

- Preserve the repository's existing architecture, package manager, naming, and conventions when they already exist.
- Read relevant reusable skills from `~/.agents/skills/` before implementing specialized work.
- For a genuinely new web application, use `bootstrapping-modern-web-apps` as the baseline.
- Keep project-specific business rules here; never copy confidential project context into reusable global skills.

## Web stack baseline

For a new application unless requirements justify a different choice:

- Next.js App Router + React + TypeScript with strict typing.
- Tailwind CSS v4 for styling and design tokens.
- shadcn/ui only when reusable accessible primitives reduce implementation cost; restyle primitives to match the product.
- ESLint and Prettier with `prettier-plugin-tailwindcss`.
- Server Components by default; Client Components only at interaction boundaries.
- Install optional libraries only when a concrete feature requires them.

## UI and motion

- Treat supplied Figma frames and screenshots as source evidence for structure, spacing, type, crop, and responsive behavior.
- Avoid generic AI-looking UI, arbitrary bento layouts, excessive glass, decorative gradients, and motion without purpose.
- Use CSS for simple states, Motion for component interaction, and GSAP + ScrollTrigger for complex choreography.
- Use one smooth-scroll engine only, and only when justified.
- Use Three.js/WebGL only when spatial or shader behavior materially supports the product.
- Respect `prefers-reduced-motion` and clean up timelines, RAF loops, listeners, observers, and WebGL resources.

## Git workflow

- Inspect `git status` before editing.
- Do not commit feature work directly to the default branch unless explicitly requested.
- Use a narrow feature/fix branch and avoid staging unrelated changes.
- Prefer PR-based delivery.
- When a repository uses development and production branches, promote through development before production unless explicitly instructed otherwise.

## Quality gates

Before claiming completion, run the checks that exist in the repository. For the default Next.js baseline, prefer:

```bash
npm run format:check
npm run lint
npm run build
```

Also run typecheck and tests when those scripts exist.

For visual or interactive changes, verification must include rendering the application, checking representative desktop and mobile sizes, inspecting console errors, and comparing against the supplied source or acceptance criteria.
