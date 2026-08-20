---
name: bootstrapping-modern-web-apps
description: Use when the user explicitly opts into this opinionated web-app baseline, asks to use the personal starter, or wants this repository's preferred Next.js project conventions.
---

# Bootstrapping Modern Web Apps

## Core principle
This is an **opt-in opinionated profile**, not a universal web-development policy. Use it only when the user explicitly chooses this repository's preferred project baseline. Otherwise preserve the user's requested stack, the target repository's conventions, or a neutral project setup.

When opted in, start with the smallest production-grade stack that supports the product. Establish conventions once at project creation so later feature work does not repeatedly solve formatting, structure, UI primitives, or motion foundations.

## Stack defaults
Existing repository decisions always win. For a genuinely new application, default to:

- Next.js App Router, current stable release.
- React and TypeScript with strict type checking.
- Tailwind CSS v4 for styling and design tokens.
- shadcn/ui for accessible composable primitives when it reduces implementation cost; do not turn it into the visual identity.
- ESLint using the Next.js-supported configuration.
- Prettier 3.7+ with `prettier-plugin-tailwindcss`.
- Lucide for general interface icons unless the design system defines another icon set.
- Server Components by default; add Client Components only at interaction boundaries.
- Native server data fetching and framework primitives first. Add TanStack Query only when client-side server-state caching, synchronization, optimistic updates, or polling justify it.
- React Hook Form + Zod for form-heavy experiences or complex validation; avoid them for trivial forms.
- Motion for component-level transitions and interaction choreography.
- GSAP + ScrollTrigger for complex timelines, pinned sequences, and scroll storytelling.
- Lenis only when smooth scrolling materially improves the experience; use one smooth-scroll engine only.
- Three.js/WebGL only when spatial or shader-based behavior is part of the product concept.

Do not install optional libraries speculatively. Add them when a concrete feature needs them.

## Automated project preparation
When this skills repository is available locally, prefer its project bootstrap for consistent Codex setup instead of recreating repository instructions and formatter configuration manually:

```bash
./setup-project.sh /path/to/project
```

On Windows PowerShell:

```powershell
./setup-project.ps1 C:\Dev\project
```

The bootstrap is intentionally non-destructive: existing `AGENTS.md` and `prettier.config.mjs` files are preserved unless `--force` is explicitly supplied. Existing project conventions still win over personal defaults.

## Initialization
Prefer the repository or environment package manager. When there is no prior convention, npm is an acceptable portable default.

Create the application with TypeScript, ESLint, Tailwind CSS, and App Router enabled. Keep import aliases predictable (`@/*`) and use either root-level `app/` or `src/app/` consistently.

After the framework scaffold succeeds, initialize shadcn/ui only if the project benefits from reusable UI primitives.

## Required Prettier + Tailwind setup
Install Prettier and the official Tailwind class-sorting plugin as development dependencies:

```bash
npm install -D prettier prettier-plugin-tailwindcss
```

Use an ESM Prettier configuration because current `prettier-plugin-tailwindcss` releases are ESM-only.

For a Tailwind CSS v4 project using root-level `app/`, create `prettier.config.mjs`:

```js
/** @type {import("prettier").Config & import("prettier-plugin-tailwindcss").PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./app/globals.css",
  tailwindFunctions: ["cn", "clsx", "cva"],
  printWidth: 100,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
};

export default config;
```

If the application uses `src/app/`, set:

```js
tailwindStylesheet: "./src/app/globals.css";
```

The stylesheet path must point to the actual Tailwind v4 CSS entry file. Do not copy the path blindly.

Add formatting scripts to `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

Run formatting once after setup and include `format:check` in CI or the repository's validation sequence when practical.

## Project structure
Prefer feature or domain boundaries once the application grows. Keep the initial structure shallow and avoid creating empty architecture layers.

Typical baseline:

```text
app/ or src/app/
components/
  ui/
lib/
public/
```

Add `modules/`, `features/`, `services/`, `hooks/`, or `types/` when real code requires those boundaries, not preemptively.

## Design-system baseline
At project start:

1. Define semantic color and surface tokens instead of scattering raw colors.
2. Establish typography roles, spacing rhythm, radii, container widths, and breakpoint behavior.
3. Configure fonts through framework-supported font loading.
4. Keep shadcn components structurally reusable and restyle them through variants/tokens.
5. Avoid generic visual defaults becoming the final product design.

## Quality gates before feature work
Confirm the clean scaffold passes the repository's available checks:

```bash
npm run lint
npm run format:check
npm run build
```

If a typecheck or test script exists, run it too.

The starting project should have:

- no console or build errors;
- no hydration warnings;
- no unused speculative dependencies;
- responsive base layout;
- visible keyboard focus;
- working dark/light theming only if the product requires it;
- a formatter that reliably sorts Tailwind classes.

## Avoid
- Pages Router for new projects without a compatibility reason.
- Adding Redux, Zustand, TanStack Query, Prisma, Supabase, Clerk, Stripe, GSAP, Three.js, or similar infrastructure before a product requirement exists.
- Mixing multiple UI kits without a deliberate integration strategy.
- Using shadcn/ui defaults as final art direction.
- Creating many client components simply because the application is interactive.
- Omitting formatter configuration and relying on editor-specific class sorting.
