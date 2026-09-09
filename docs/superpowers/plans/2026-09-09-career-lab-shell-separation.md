# Career Lab Shell Separation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Separate Career Lab product chrome from Agent Skills Studio institutional chrome without changing any public URL or Career Profile behavior.

**Architecture:** Reduce `app/[locale]/layout.tsx` to shared providers/infrastructure. Move Studio pages into the URL-transparent `(studio)` route group with a dedicated institutional layout, and move Career Lab into the URL-transparent `(career)` group where its existing shell owns the main landmark and product closing utility.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Vitest, Testing Library, CSS.

**Spec:** `docs/superpowers/specs/2026-09-09-career-lab-shell-separation-design.md`

## Global Constraints

- No public URL changes.
- No Career Profile schema or storage changes.
- No competency/readiness/roadmap/assessment/evidence/learning/market engine changes.
- No dependency or version changes.
- Preserve EN/PT-BR behavior.
- Preserve global theme and NuqsAdapter behavior.
- Studio routes keep SiteHeader/SiteFooter; Career Lab must not inherit them.
- Exactly one primary `main` landmark per rendered Studio or Career Lab surface.

---

### Task 1: Capture shell ownership as a failing contract

**Files:**
- Create: `apps/web/src/lib/career-shell-separation.test.ts`
- Modify: `apps/web/src/components/career/career-lab-shell.test.tsx`

**Interfaces:**
- Consumes: current locale layout and CareerLabShell source.
- Produces: regression contract for route-group ownership and `main#main-content`.

- [ ] **Step 1: Write the failing structural test**

Assert that the locale layout contains shared providers but no `SiteHeader`, `SiteFooter`, or page `<main>`; that `(studio)/layout.tsx` owns those three; that Studio routes exist under `(studio)`; and Career Lab exists under `(career)` with no duplicated direct route.

- [ ] **Step 2: Extend the CareerLabShell component test**

Require the ready shell to expose `main#main-content`, link back to Agent Skills Studio, and retain the Developer Career Pack link.

- [ ] **Step 3: Verify RED through the next available executable gate**

Expected pre-implementation failures: missing route-group layouts/paths, locale layout still owning institutional chrome, CareerLabShell lacking `#main-content` and product closing utility.

- [ ] **Step 4: Commit**

`test: capture Career Lab shell separation contract`

### Task 2: Separate App Router ownership

**Files:**
- Modify: `apps/web/src/app/[locale]/layout.tsx`
- Create: `apps/web/src/app/[locale]/(studio)/layout.tsx`
- Move tree: `apps/web/src/app/[locale]/page.tsx` -> `apps/web/src/app/[locale]/(studio)/page.tsx`
- Move trees: `about`, `built-with-skills`, `changelog`, `contribute`, `getting-started`, `packs`, `roadmap`, `skills` -> `(studio)/...`
- Move tree: `apps/web/src/app/[locale]/career-lab` -> `apps/web/src/app/[locale]/(career)/career-lab`

**Interfaces:**
- Consumes: shared locale providers and existing Studio/Career Lab page implementations.
- Produces: URL-transparent route-group separation.

- [ ] **Step 1: Reduce locale layout to shared infrastructure**

Keep metadata, locale validation, `globals.css`, ThemeProvider, NuqsAdapter, body classes, and skip-link. Render `{children}` directly inside NuqsAdapter.

- [ ] **Step 2: Create the Studio layout**

Import all existing Studio/editorial/site-chrome CSS formerly owned by the locale layout, resolve the locale, and render `SiteHeader`, `<main id="main-content">`, and `SiteFooter`.

- [ ] **Step 3: Move all institutional route trees under `(studio)`**

Reuse existing tree SHAs so contents are byte-identical; route group names must not enter public URLs.

- [ ] **Step 4: Move Career Lab under `(career)`**

Reuse the existing Career Lab tree SHA so all nested routes and metadata remain behaviorally identical.

- [ ] **Step 5: Commit**

`refactor: separate Studio and Career Lab route shells`

### Task 3: Make Career Lab a complete product shell

**Files:**
- Modify: `apps/web/src/components/career/career-lab-shell.tsx`
- Modify: `apps/web/src/lib/career/copy.ts`
- Modify: `apps/web/src/styles/career-convergence.css`

**Interfaces:**
- Consumes: locale-specific Career Lab copy and existing product navigation.
- Produces: semantic `main#main-content` and restrained local-first product closing utility.

- [ ] **Step 1: Add main landmark ownership**

Apply `id="main-content"` to all CareerLabShell main states (hydrating, error, ready).

- [ ] **Step 2: Add the product closing utility**

Below route content, render a compact footer owned by Career Lab with local-first context plus links to Developer Career Pack and Agent Skills Studio root. Do not use `SiteFooter`.

- [ ] **Step 3: Add EN/PT-BR copy and responsive styles**

Use existing Career Lab typography/line system; no institutional dark footer, mascot block, or promotional slogan.

- [ ] **Step 4: Commit**

`feat: complete Career Lab product shell`

### Task 4: Repair source imports after URL-transparent moves

**Files:**
- Modify all tests/source modules that import files through `@/app/[locale]/...` paths.
- Modify `apps/web/src/lib/editorial-foundation.test.ts` to assert ownership in `(studio)/layout.tsx` and read moved Studio routes.
- Modify Career Lab tests to import through `@/app/[locale]/(career)/career-lab/...`.
- Modify Studio tests to import through `@/app/[locale]/(studio)/...`.

**Interfaces:**
- Consumes: moved source modules.
- Produces: compile-safe internal imports while public hrefs remain unchanged.

- [ ] **Step 1: Update only source-import paths**

Do not change expected browser URLs such as `/en/skills` or `/pt-BR/career-lab`.

- [ ] **Step 2: Re-run focused tests**

Expected: shell separation tests, Career Lab tests, Studio page tests all GREEN.

- [ ] **Step 3: Commit**

`test: align route-group source imports`

### Task 5: Full verification and promotion readiness

**Files:**
- No product changes unless a real gate failure identifies one.

**Interfaces:**
- Consumes: frozen feature head.
- Produces: merge-ready PR to `dev` with executable evidence.

- [ ] **Step 1: Review effective diff against the spec**

Confirm no URL/schema/storage/engine/dependency/version changes and no unrelated cleanup.

- [ ] **Step 2: Open draft PR to `dev`**

Do not open the PR until the branch head is frozen.

- [ ] **Step 3: Run the repository workflow**

Require root tests, catalog/plugin validation, web tests, TypeScript, lint, production build, static route generation, Bash smoke, and PowerShell smoke.

- [ ] **Step 4: Inspect build route output**

Verify canonical `/en/...` and `/pt-BR/...` routes remain unchanged, including Career Lab.

- [ ] **Step 5: Mark Ready only after GREEN**

Do not merge without explicit user authorization.
