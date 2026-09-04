# Final Copy + UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the public Agent Skills Studio experience for launch by rewriting copy and refining/redesigning UI as one coordinated sprint, while preserving the product's public information architecture, Stable `1.0.0` contracts, catalog semantics, evidence integrity, and installation behavior.

**Architecture:** Keep the existing Next.js App Router, localization, editorial-copy modules, catalog/evidence derivation, and public routes. Consolidate shared editorial foundations first, then work surface-by-surface with copy stabilized before final composition on that same surface. Each task is independently reviewable and follows `audit -> RED when testable -> copy -> UI -> GREEN -> review -> commit`. Visual changes may be deep and may redesign internal sections when incremental refinement cannot meet the approved quality bar, but no task may change public route architecture or introduce unrelated product features.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS, Vitest, Testing Library, existing motion components, existing catalog/evidence derivation, GitHub Actions validation.

**Spec:** `docs/superpowers/specs/2026-09-04-final-copy-ui-polish-design.md`

## Global Constraints

- Deliver through one closing PR from `sprint/final-copy-ui-polish`, using small semantic commits.
- Do not merge the final PR without separate explicit user authorization.
- Durable positioning thesis:
  - EN: `Skills are not prompts. They are working methods.`
  - PT-BR: `Skills não são prompts. São métodos de trabalho.`
- Preserve existing public pages, public URLs, locale routing, and primary navigation architecture.
- Preserve Stable `1.0.0`, 54 canonical skills, 11 active packs, pack membership/status semantics, and historical release evidence.
- Preserve canonical `skills/*/SKILL.md`, installer behavior, generated catalog semantics, evidence classifications, source URLs, SHAs, PR numbers, CI run IDs, dates, and verified counts.
- Do not modify `release/stable-readiness.json` or reinterpret its historical observed coverage.
- Do not revive removed orphaned Home copy paths such as `messages.home.paths`, `home.packs`, or `home.proof`.
- Do not add new features, new skills, new packs, new integrations, new distribution paths, or new evidence cases.
- English and PT-BR are equivalent editorial products; do not force literal translation when natural phrasing differs.
- Prefer specific actions (`Explore skills`, `Inspect evidence`, `Install this skill`) over generic CTAs (`Learn more`, `Continue`, `Get started`) when a concrete destination exists.
- Treat `skill` and `pack` as product terms of art. Explain them clearly at first meaningful use; do not replace them with invented synonyms.
- Reserve `Stable` for release status and keep it distinct from per-skill maturity.
- Pack copy must communicate that members are independently invokable methods, not one mandatory monolithic workflow.
- Cross-pack representation must not be described as full-pack validation unless evidence actually supports that claim.
- Do not use textual/DOM tests as a substitute for visual validation; tests should guard semantics, structure, accessibility contracts, responsive rules, and regressions that are mechanically verifiable.
- Every task must end with scope review before the next task starts.

## Task 1: Consolidate editorial foundations and shared product language

**Files:**
- Modify: `apps/web/src/app/globals.css`
- Modify as needed: `apps/web/src/app/editorial-pages.css`
- Modify as needed: `apps/web/src/app/site-chrome.css`
- Modify: `apps/web/src/lib/messages.ts`
- Modify as needed: `apps/web/src/lib/site-chrome-copy.ts`
- Modify as needed: `apps/web/src/lib/distribution-copy.ts`
- Modify: `apps/web/src/lib/editorial-foundation.test.ts`
- Modify: `apps/web/src/components/site-shell.test.tsx`
- Modify as needed: `apps/web/src/lib/ui-hardening.test.ts`
- Reuse, do not fork without reason: `apps/web/src/components/editorial/*`

**Interfaces:**
- Consumes: existing design tokens, locale message contract, site chrome copy, shared editorial primitives.
- Produces: stable typographic/spacing/interaction primitives and shared terminology that later tasks can rely on.

- [ ] **Step 1: Audit the current foundation before editing**

Inventory the active type scale, reading widths, shell widths, section spacing, button/link treatments, card/divider conventions, focus rings, reduced-motion handling, and shared product terminology. Identify duplicate/conflicting CSS layers rather than adding another override blindly. Record which selectors actually win in the current cascade.

- [ ] **Step 2: Add failing semantic/foundation tests**

Tighten `editorial-foundation.test.ts`, `site-shell.test.tsx`, and `ui-hardening.test.ts` only around mechanically verifiable contracts. Require:

- brand label remains `Agent Skills Studio` in both locales;
- shared actions use specific destination/action language;
- no reintroduction of orphaned Home copy paths;
- keyboard focus remains visibly defined for shared actionable elements;
- reduced-motion paths remain present for motion-heavy/shared surfaces;
- core editorial width/type rules are represented by one effective rule set rather than conflicting duplicate overrides when that can be asserted safely.

Do not snapshot full CSS files or full paragraphs.

- [ ] **Step 3: Run focused tests and capture RED**

```bash
npm run web:test -- --run apps/web/src/lib/editorial-foundation.test.ts apps/web/src/components/site-shell.test.tsx apps/web/src/lib/ui-hardening.test.ts
```

Expected: FAIL only on the new foundation/copy contracts.

- [ ] **Step 4: Consolidate shared product language**

Update shared copy so:

- `skill` is described as a reusable working method for an agent;
- `pack` is described as a related group of independently invokable methods;
- inspect/source actions use `inspect` / `inspecionar`;
- catalog discovery uses `Explore skills` / `Explorar skills` where appropriate;
- installation actions use `install` / `instalar`;
- release `Stable` and skill maturity remain explicitly distinct.

Avoid a new content abstraction unless an existing ownership boundary cannot support the change.

- [ ] **Step 5: Consolidate shared editorial primitives**

Refine the existing token/rule system instead of introducing a parallel design system. Normalize:

- display/heading/body/mono hierarchy;
- readable line length;
- page and section rhythm;
- shell/gutter behavior;
- link/button affordances;
- border/divider hierarchy;
- hover/focus/active/disabled states;
- mobile type and spacing clamps;
- reduced-motion behavior.

Prefer removing or superseding conflicting legacy overrides over stacking a new generic `final-polish` layer.

- [ ] **Step 6: Re-run focused tests and verify GREEN**

Run the command from Step 3. Expected: PASS.

- [ ] **Step 7: Run broad safety checks**

```bash
npm run web:test
npm run web:typecheck
npm run web:lint
npm test
npm run validate
```

Expected: PASS; catalog/release facts remain unchanged.

- [ ] **Step 8: Review the slice**

Confirm no route, catalog, evidence, installer, version, or release file changed. Confirm the foundation reduces inconsistency rather than merely adding specificity.

- [ ] **Step 9: Commit**

```text
refactor: consolidate editorial interface foundations
```

---

## Task 2: Close Home positioning, narrative, and composition

**Files:**
- Modify: `apps/web/src/lib/home-content.ts`
- Modify: `apps/web/src/lib/home-evidence-content.ts`
- Modify: `apps/web/src/lib/home-evidence-content.test.ts`
- Modify: `apps/web/src/lib/home-structure.test.ts`
- Modify: `apps/web/src/components/home/home-living-archive.test.tsx`
- Modify as needed: `apps/web/src/app/[locale]/page.tsx`
- Modify as needed:
  - `apps/web/src/components/home/home-manifesto-hero.tsx`
  - `apps/web/src/components/home/home-method-index.tsx`
  - `apps/web/src/components/home/home-method-workflow.tsx`
  - `apps/web/src/components/home/home-pack-dossiers.tsx`
  - `apps/web/src/components/home/home-case-study-story.tsx`
  - `apps/web/src/components/home/home-evidence-ledger.tsx`
  - `apps/web/src/components/home/home-evidence-thread.tsx`
  - `apps/web/src/components/home/home-closing.tsx`
- Modify existing Home CSS layers only where ownership requires it:
  - `apps/web/src/app/home-evidence.css`
  - `apps/web/src/app/home-living-archive.css`
  - `apps/web/src/app/home-living-systems.css`
  - `apps/web/src/app/home-scroll-choreography.css`
  - `apps/web/src/app/home-scroll-systems.css`
  - `apps/web/src/app/home-scroll-workflow.css`
  - `apps/web/src/app/home-final-polish.css`

**Interfaces:**
- Consumes: Task 1 shared foundation, catalog-derived scale, real-use evidence, current Home scroll/motion system.
- Produces: a Home that communicates thesis -> definition -> demonstration -> scale -> evidence -> representative methods/packs -> action.

- [ ] **Step 1: Audit current Home hierarchy and CSS ownership**

Map each rendered section to its copy owner, component owner, motion owner, and final CSS selector. Identify repeated ideas, weak CTAs, cramped areas, competing visual blocks, and any current animation that appears static because selectors/runtime do not align.

- [ ] **Step 2: Add failing Home communication/structure tests**

Require the durable thesis exactly:

```ts
expect(homeManifesto.en.titleLead).toBe("Skills are not prompts.");
expect(homeManifesto.en.titleClose).toBe("They are working methods.");
expect(homeManifesto["pt-BR"].titleLead).toBe("Skills não são prompts.");
expect(homeManifesto["pt-BR"].titleClose).toBe("São métodos de trabalho.");
```

Also assert semantically that:

- the supporting copy defines the product as an installable/inspectable collection of working methods;
- primary CTA routes to localized Skills;
- secondary CTA is a distinct action, preferably evidence or installation;
- evidence claims stay derived/inspectable rather than authority-based;
- the approved section order is preserved after any internal redesign.

- [ ] **Step 3: Run focused Home tests and capture RED**

```bash
npm run web:test -- --run apps/web/src/lib/home-evidence-content.test.ts apps/web/src/lib/home-structure.test.ts apps/web/src/components/home/home-living-archive.test.tsx
```

Expected: FAIL on newly tightened communication/structure contracts.

- [ ] **Step 4: Rewrite Home copy in the approved message order**

Use this sequence:

1. method-versus-prompt thesis;
2. plain-language definition;
3. request -> method -> evidence demonstration;
4. catalog-derived scale;
5. inspectable evidence/trust mechanism;
6. representative methods/packs;
7. specific primary/secondary actions.

Replace vague outcome labels with observable outcomes already supported by implementation/evidence. Keep EN and PT-BR natural rather than sentence-for-sentence literal.

- [ ] **Step 5: Refine or redesign Home composition**

Apply the approved editorial direction. Specifically evaluate:

- hero breathing room and title measure;
- visual priority between thesis, product definition, and CTAs;
- whether method/packs areas read as archive/index rather than a grid of generic SaaS cards;
- whether evidence has a clear proof hierarchy;
- whether dense sections need alternating editorial rhythm rather than equal boxed treatment;
- whether mobile receives a deliberate reading sequence, not just collapsed desktop grids.

A full internal section redesign is allowed if incremental CSS cannot satisfy these goals.

- [ ] **Step 6: Verify motion and reduced motion**

Confirm scroll-triggered/staged behaviors still target live elements, do not hide content on failure, and reduce safely under `prefers-reduced-motion`.

- [ ] **Step 7: Re-run focused and broad web checks**

```bash
npm run web:test -- --run apps/web/src/lib/home-evidence-content.test.ts apps/web/src/lib/home-structure.test.ts apps/web/src/components/home/home-living-archive.test.tsx
npm run web:test
npm run web:typecheck
npm run web:lint
```

Expected: PASS.

- [ ] **Step 8: Review the slice visually and semantically**

Validate desktop and mobile, light and dark, CTA hierarchy, no duplicated promise, and no catalog/evidence overclaim.

- [ ] **Step 9: Commit**

```text
feat: sharpen home positioning and composition
```

---

## Task 3: Refine Skills discovery and skill dossier reading experience

**Files:**
- Modify: `apps/web/src/lib/editorial-methods-copy.ts`
- Modify: `apps/web/src/lib/editorial-methods-structure.test.ts`
- Modify as needed: `apps/web/src/lib/skill-filters.test.ts`
- Modify as needed: `apps/web/src/lib/skill-filters.ts`
- Modify: `apps/web/src/components/skills/method-dossier.test.tsx`
- Modify as needed:
  - `apps/web/src/app/[locale]/skills/page.tsx`
  - `apps/web/src/app/[locale]/skills/[slug]/page.tsx`
  - `apps/web/src/app/[locale]/skills/[slug]/not-found.tsx`
  - `apps/web/src/components/skills/method-archive.tsx`
  - `apps/web/src/components/skills/method-row.tsx`
  - `apps/web/src/components/skills/method-reader.tsx`
  - `apps/web/src/components/skills/method-dossier.tsx`
  - `apps/web/src/components/skills/prompt-specimen.tsx`
- Modify as needed:
  - `apps/web/src/app/editorial-methods.css`
  - `apps/web/src/app/editorial-method-dossier.css`

**Interfaces:**
- Consumes: canonical skill metadata, filters, Task 1 foundation, current effective Claude Code compatibility presentation.
- Produces: task-oriented catalog scanning and a dossier that helps readers judge trigger, purpose, boundaries, maturity, relations, compatibility, installation, and source.

- [ ] **Step 1: Audit Skills index and dossier**

Identify search/filter microcopy, empty states, row/card density, metadata repetition, dossier reading order, prompt/source specimen hierarchy, compatibility treatment, install CTA placement, and mobile overflow/wrapping risks.

- [ ] **Step 2: Add failing Skills contracts**

Require:

- search/filter labels are task-oriented and concrete;
- no-result state explains what happened and gives a recovery action;
- skill detail has a specific install action such as `Install this skill` / `Instalar esta skill`;
- `ChatGPT · Codex · Claude Code` remains the effective product-facing environment list for current filesystem-compatible skills;
- raw compatibility slugs are not shown;
- release status and skill maturity stay distinct;
- source/inspection actions are specific rather than generic continuation links.

- [ ] **Step 3: Run focused tests and capture RED**

```bash
npm run web:test -- --run apps/web/src/lib/editorial-methods-structure.test.ts apps/web/src/lib/skill-filters.test.ts apps/web/src/components/skills/method-dossier.test.tsx
```

Expected: FAIL only on new selection/UX contracts.

- [ ] **Step 4: Rewrite Skills discovery/detail copy**

Make the index answer `Which method fits my task?` before catalog taxonomy. Make the dossier answer `When should I invoke this, what does it govern, what are its limits, and how do I install/inspect it?`.

Do not rewrite canonical skill instructions or metadata facts.

- [ ] **Step 5: Refine catalog hierarchy**

Improve scanning using existing archive/row patterns. Prefer editorial rows/index logic over multiplying cards. Ensure filters remain usable and visually subordinate to the actual methods.

- [ ] **Step 6: Refine dossier hierarchy**

Prioritize, in order where appropriate: title/purpose, trigger/use, core method, boundaries, compatibility/install, relations, source. Reduce decorative metadata repetition. Keep prompt/source content readable and copyable.

- [ ] **Step 7: Verify responsive and interaction states**

Check long titles, compatibility labels, filter chips/controls, code/prompt blocks, source links, keyboard focus, and no horizontal overflow on mobile.

- [ ] **Step 8: Re-run checks**

```bash
npm run web:test -- --run apps/web/src/lib/editorial-methods-structure.test.ts apps/web/src/lib/skill-filters.test.ts apps/web/src/components/skills/method-dossier.test.tsx
npm run web:test
npm run web:typecheck
npm run web:lint
```

Expected: PASS.

- [ ] **Step 9: Review scope**

Confirm no canonical skill JSON, skill source, schema, generated catalog, or install semantics changed.

- [ ] **Step 10: Commit**

```text
refactor: improve skills editorial hierarchy
```

---

## Task 4: Refine Packs discovery and pack dossier composition

**Files:**
- Modify: `apps/web/src/lib/editorial-packs-copy.ts`
- Modify: `apps/web/src/lib/editorial-packs-structure.test.ts`
- Modify: `apps/web/src/components/packs/pack-blueprint.test.tsx`
- Modify as needed:
  - `apps/web/src/app/[locale]/packs/page.tsx`
  - `apps/web/src/app/[locale]/packs/[slug]/page.tsx`
  - `apps/web/src/app/[locale]/packs/[slug]/not-found.tsx`
  - `apps/web/src/components/packs/pack-archive.tsx`
  - `apps/web/src/components/packs/pack-blueprint.tsx`
  - `apps/web/src/components/packs/pack-composition-map.tsx`
  - `apps/web/src/components/packs/pack-dossier.tsx`
- Modify as needed:
  - `apps/web/src/app/editorial-packs.css`
  - `apps/web/src/app/editorial-pack-blueprint.css`
  - `apps/web/src/app/editorial-relations.css`

**Interfaces:**
- Consumes: 11 canonical pack records and their member relationships.
- Produces: a pack experience that explains problem-space grouping and responsibility split among independently invokable methods.

- [ ] **Step 1: Audit Packs index/dossier**

Identify where the current UI implies a generic product-card grid, where member relationships are hard to scan, and where pack/method distinction is unclear.

- [ ] **Step 2: Add failing pack semantics tests**

Require:

- pack intro explains that members remain independently invokable;
- pack detail communicates broader problem space and responsibility split;
- member counts/status remain catalog-derived;
- cross-pack membership is represented accurately without full-validation overclaim;
- not-found/recovery copy points back to the pack archive with a concrete action.

- [ ] **Step 3: Run focused tests and capture RED**

```bash
npm run web:test -- --run apps/web/src/lib/editorial-packs-structure.test.ts apps/web/src/components/packs/pack-blueprint.test.tsx
```

Expected: FAIL on new semantic/hierarchy contracts.

- [ ] **Step 4: Rewrite pack copy**

Clarify the difference between one skill and a pack. Avoid describing packs as mandatory end-to-end workflows.

- [ ] **Step 5: Refine or redesign pack archive/dossier composition**

Prefer index/blueprint/composition-map language over equal generic cards. Ensure member methods, responsibilities, relationships, and status can be scanned without visual clutter.

- [ ] **Step 6: Verify 11-pack responsive behavior explicitly**

Test the actual 11-item archive at wide, intermediate, and mobile widths. Ensure no 9-item positional assumptions reappear; item 10/11 must remain intentionally placed under all breakpoints.

- [ ] **Step 7: Re-run checks**

```bash
npm run web:test -- --run apps/web/src/lib/editorial-packs-structure.test.ts apps/web/src/components/packs/pack-blueprint.test.tsx apps/web/src/lib/ui-hardening.test.ts
npm run web:test
npm run web:typecheck
npm run web:lint
```

Expected: PASS.

- [ ] **Step 8: Review scope and commit**

Confirm pack JSON/status/membership remains unchanged.

```text
refactor: strengthen packs presentation
```

---

## Task 5: Strengthen Built with Skills as inspectable evidence

**Files:**
- Modify: `apps/web/src/lib/editorial-evidence-copy.ts`
- Modify as needed: `apps/web/src/lib/built-with-skills.ts`
- Modify: `apps/web/src/lib/built-with-skills.test.ts`
- Modify: `apps/web/src/components/evidence/evidence-archive.test.tsx`
- Modify: `apps/web/src/components/evidence/evidence-report.test.tsx`
- Modify as needed:
  - `apps/web/src/app/[locale]/built-with-skills/page.tsx`
  - `apps/web/src/app/[locale]/built-with-skills/[slug]/page.tsx`
  - `apps/web/src/components/evidence/evidence-archive.tsx`
  - `apps/web/src/components/evidence/evidence-feature.tsx`
  - `apps/web/src/components/evidence/evidence-report.tsx`
- Modify as needed:
  - `apps/web/src/app/editorial-evidence.css`
  - `apps/web/src/app/editorial-evidence-report.css`

**Interfaces:**
- Consumes: existing 9-case registry, evidence classifications, real-use pack coverage, immutable evidence documents.
- Produces: evidence browsing and reports organized around problem -> methods -> verification -> result.

- [ ] **Step 1: Mark protected evidence fields**

Before edits, treat project names, repository/source URLs, evidence class, skill slugs, SHAs, PR numbers, CI run IDs, dates, counts, Stable/maturity claims, and real-use/internal classification as immutable facts unless an independently verified factual defect exists.

- [ ] **Step 2: Add failing evidence-copy/structure tests**

Require:

- archive describes cases as inspectable evidence, not portfolio/showcase rhetoric;
- real-use and internal cases remain visibly distinguishable;
- case reports expose concrete problem, methods, verification, and result sections;
- source actions use specific inspection language;
- representation is not silently strengthened into complete validation;
- current derived pack coverage remains derived rather than copied into the historical Stable snapshot.

- [ ] **Step 3: Run focused tests and capture RED**

```bash
npm run web:test -- --run apps/web/src/lib/built-with-skills.test.ts apps/web/src/components/evidence/evidence-archive.test.tsx apps/web/src/components/evidence/evidence-report.test.tsx apps/web/src/lib/real-use-pack-coverage.test.ts
```

Expected: FAIL only on newly tightened presentation contracts.

- [ ] **Step 4: Rewrite evidence presentation copy**

Use factual language. Make it clear what was done, which methods were used, what was verified, and what the evidence does not establish.

- [ ] **Step 5: Refine archive/report hierarchy**

Favor report/index structures, metadata bands, source references, and clear evidence classification over card-heavy portfolio treatment. On mobile, keep the evidence narrative readable before metadata density.

- [ ] **Step 6: Re-run checks**

```bash
npm run web:test -- --run apps/web/src/lib/built-with-skills.test.ts apps/web/src/components/evidence/evidence-archive.test.tsx apps/web/src/components/evidence/evidence-report.test.tsx apps/web/src/lib/real-use-pack-coverage.test.ts
npm run web:test
npm run web:typecheck
npm run web:lint
```

Expected: PASS.

- [ ] **Step 7: Review protected evidence and commit**

Do not tone-edit `docs/built-with-skills/*` merely for style.

```text
refactor: improve evidence archive and report hierarchy
```

---

## Task 6: Simplify Getting Started into an operational field manual

**Files:**
- Modify: `apps/web/src/app/[locale]/getting-started/page.tsx`
- Modify: `apps/web/src/components/getting-started-field-manual.test.tsx`
- Modify as needed: `apps/web/src/lib/messages.ts`
- Modify as needed: `apps/web/src/lib/distribution-copy.ts`
- Modify as needed:
  - `apps/web/src/components/installation-terminal.tsx`
  - `apps/web/src/components/copy-command.tsx`
- Modify as needed: `apps/web/src/app/editorial-secondary.css`

**Interfaces:**
- Consumes: real installer commands/targets, existing distribution behavior, Task 1 terminology.
- Produces: a clear choose -> install -> verify flow for collection, skill, and pack installation paths already supported.

- [ ] **Step 1: Audit by user state**

Map copy and UI into: choose environment/target, choose scope where applicable, install collection/skill/pack, understand destination, verify success, recover from an invalid/misunderstood path. Flag marketing prose that interrupts the operational sequence.

- [ ] **Step 2: Add failing Getting Started tests**

Require exact protected commands/semantics to remain intact while asserting the UI tells users:

- what each command installs;
- where it is installed;
- what target/environment it applies to;
- how to verify success;
- how to recover or choose another path.

Include ChatGPT, Codex, and Claude Code according to existing supported behavior; do not invent a new installer mode.

- [ ] **Step 3: Run focused tests and capture RED**

```bash
npm run web:test -- --run apps/web/src/components/getting-started-field-manual.test.tsx apps/web/src/components/copy-command.test.tsx
```

Expected: FAIL on newly tightened operational guidance contracts.

- [ ] **Step 4: Rewrite operational copy**

Frontload prerequisites/consequences. Keep helper, command, verification, and recovery copy distinct. Remove generic sales language around commands.

- [ ] **Step 5: Refine field-manual composition**

Use strong sequential hierarchy, code/command legibility, platform/target labels, and obvious copy actions. Avoid stacking every step into equally weighted cards.

- [ ] **Step 6: Verify installer semantics with repository tests**

```bash
npm run web:test -- --run apps/web/src/components/getting-started-field-manual.test.tsx apps/web/src/components/copy-command.test.tsx
npm run web:typecheck
npm test
```

Expected: PASS, including Claude Code installer tests.

- [ ] **Step 7: Review scope and commit**

Confirm no installer implementation or destination mapping changed.

```text
refactor: simplify getting started flow
```

---

## Task 7: Polish Roadmap and institutional surfaces

**Files:**
- Modify as needed: `apps/web/src/lib/editorial-secondary-copy.ts`
- Modify as needed: `apps/web/src/lib/project-pages.ts`
- Modify as needed: `apps/web/src/lib/roadmap.ts`
- Modify:
  - `apps/web/src/lib/project-pages.test.ts`
  - `apps/web/src/lib/roadmap.test.ts`
  - `apps/web/src/components/roadmap-living-program.test.tsx`
  - `apps/web/src/components/about-editorial-colophon.test.tsx`
- Modify as needed:
  - `apps/web/src/app/[locale]/roadmap/page.tsx`
  - `apps/web/src/app/[locale]/about/page.tsx`
  - `apps/web/src/app/[locale]/contribute/page.tsx`
  - `apps/web/src/app/[locale]/changelog/page.tsx`
- Modify as needed:
  - `apps/web/src/app/editorial-living-program.css`
  - `apps/web/src/app/editorial-colophon.css`
  - `apps/web/src/app/editorial-secondary.css`
  - `apps/web/src/app/editorial-pages.css`

**Interfaces:**
- Consumes: current Stable/post-Stable roadmap facts, changelog/release facts, project contribution/about copy.
- Produces: concise institutional pages that support trust without adding product claims or roadmap commitments.

- [ ] **Step 1: Audit institutional purpose page-by-page**

Roadmap must explain current program state and next work without implying an unstable release. About must explain project intent/maintainership. Contribute must make contribution paths concrete. Changelog must remain a factual change record.

- [ ] **Step 2: Add failing semantic tests**

Require:

- Roadmap clearly preserves `1.0.0` as Stable while distinguishing post-Stable work;
- About avoids inflated mission language unsupported by evidence;
- Contribute uses concrete contribution actions;
- Changelog retains factual release semantics and current post-Stable entries;
- CTAs identify destinations/actions instead of generic continuation language.

- [ ] **Step 3: Run focused tests and capture RED**

```bash
npm run web:test -- --run apps/web/src/lib/project-pages.test.ts apps/web/src/lib/roadmap.test.ts apps/web/src/components/roadmap-living-program.test.tsx apps/web/src/components/about-editorial-colophon.test.tsx apps/web/src/lib/post-stable-changelog.test.ts
```

Expected: FAIL only on tightened editorial contracts.

- [ ] **Step 4: Rewrite institutional copy**

Prioritize concise factual prose, status clarity, and actionability. Do not invent dates, commitments, adoption claims, or governance structures.

- [ ] **Step 5: Refine composition**

Use colophon/program/changelog editorial patterns already present. Reduce repeated boxed sections and improve reading rhythm on long pages.

- [ ] **Step 6: Re-run checks**

```bash
npm run web:test -- --run apps/web/src/lib/project-pages.test.ts apps/web/src/lib/roadmap.test.ts apps/web/src/components/roadmap-living-program.test.tsx apps/web/src/components/about-editorial-colophon.test.tsx apps/web/src/lib/post-stable-changelog.test.ts
npm run web:test
npm run web:typecheck
npm run web:lint
```

Expected: PASS.

- [ ] **Step 7: Review release facts and commit**

```text
refactor: polish institutional pages
```

---

## Task 8: Align global chrome, not-found/error/loading/empty states, and interaction polish

**Files:**
- Modify as needed:
  - `apps/web/src/components/site-header.tsx`
  - `apps/web/src/components/site-footer.tsx`
  - `apps/web/src/components/editorial-navigation.tsx`
  - `apps/web/src/components/locale-switcher.tsx`
  - `apps/web/src/components/theme-switcher.tsx`
  - `apps/web/src/app/[locale]/layout.tsx`
  - route-level `not-found.tsx` files already present
- Create localized `loading.tsx`, `error.tsx`, or `not-found.tsx` only where the current route tree genuinely lacks a launch-critical state and the implementation can preserve current routing semantics; do not add decorative states merely to increase file count.
- Modify:
  - `apps/web/src/components/site-chrome.test.tsx`
  - `apps/web/src/components/site-shell.test.tsx`
  - `apps/web/src/components/theme-switcher.test.tsx`
  - `apps/web/src/lib/ui-hardening.test.ts`
- Modify as needed:
  - `apps/web/src/app/site-chrome.css`
  - `apps/web/src/app/site-chrome-refinement.css`
  - `apps/web/src/app/site-chrome-responsive.css`
  - `apps/web/src/app/ui-hardening.css`

**Interfaces:**
- Consumes: all finalized surface language and Task 1 foundation.
- Produces: coherent navigation/footer/global-state behavior across locales, themes, keyboard navigation, and viewport sizes.

- [ ] **Step 1: Audit all global states before adding files**

List existing loading/error/not-found/empty-state behavior by route. Distinguish missing UX from states Next.js already handles acceptably. Check header/footer/menu behavior at narrow widths and with long localized labels.

- [ ] **Step 2: Add failing global-state/accessibility tests**

Require where applicable:

- predictable navigation destination labels;
- locale/theme controls retain accessible names and keyboard focus;
- not-found/error states explain what happened and offer a concrete recovery destination;
- mobile header does not depend on hover;
- focus visibility and reduced motion stay intact;
- no undefined design tokens are introduced in shared interaction states.

- [ ] **Step 3: Run focused tests and capture RED**

```bash
npm run web:test -- --run apps/web/src/components/site-chrome.test.tsx apps/web/src/components/site-shell.test.tsx apps/web/src/components/theme-switcher.test.tsx apps/web/src/lib/ui-hardening.test.ts
```

Expected: FAIL only on newly tightened global-state/accessibility contracts.

- [ ] **Step 4: Refine chrome and state copy/UI**

Keep header navigation compact and predictable. Keep footer useful but subordinate. Design recovery states as part of the same editorial system, not generic error cards.

- [ ] **Step 5: Verify responsive/theme/keyboard behavior**

Explicitly inspect mobile/tablet/desktop, light/dark, keyboard-only operation, visible focus, and reduced motion.

- [ ] **Step 6: Re-run checks**

```bash
npm run web:test -- --run apps/web/src/components/site-chrome.test.tsx apps/web/src/components/site-shell.test.tsx apps/web/src/components/theme-switcher.test.tsx apps/web/src/lib/ui-hardening.test.ts
npm run web:test
npm run web:typecheck
npm run web:lint
```

Expected: PASS.

- [ ] **Step 7: Review scope and commit**

```text
fix: align global states and responsive behavior
```

---

## Task 9: Launch convergence, metadata review, invariant proof, and final PR

**Files:**
- Modify only if audit finds launch-critical defects in already-owned public metadata/copy/state files.
- Add or modify focused regression tests only when needed to encode a real contract discovered during convergence.
- Do not edit canonical catalog/release/installer files to make the final gate pass unless a genuine pre-existing blocker is proven and separately reviewed.

**Interfaces:**
- Consumes: completed Tasks 1-8.
- Produces: one verified release-candidate branch and one closing PR ready for user visual review and explicit merge decision.

- [ ] **Step 1: Freeze feature ideation**

From this point, accept only launch-blocking fixes: factual copy defects, broken links/actions, accessibility failures, responsive regressions, visual hierarchy defects severe enough to block launch, metadata mismatches caused by changed public copy, or failing canonical gates.

- [ ] **Step 2: Run a sitewide copy convergence review**

Check EN and PT-BR across Home, Skills, Packs, Built with Skills, Getting Started, Roadmap, About, Contribute, Changelog, header/footer, and recovery states. Verify terminology, CTA specificity, claim support, and natural locale quality.

- [ ] **Step 3: Run a sitewide visual convergence review**

Review representative routes at mobile, tablet, and desktop widths in light and dark themes. Check hierarchy, breathing room, wrapping, overflow, dense metadata, code blocks, long titles, 11-pack layout, evidence reports, and footer/chrome.

- [ ] **Step 4: Review metadata/SEO/OG ownership**

Where page metadata derives from copy changed in this sprint, ensure title/description/canonical/locale behavior still matches the page. Do not introduce a new SEO subsystem. Keep public URLs unchanged.

- [ ] **Step 5: Verify protected invariants by diff**

Compare the sprint head against the sprint base and confirm there is no unintended change to:

- `VERSION` or Stable tag semantics;
- `release/stable-readiness.json`;
- `catalog/skills/*.json` canonical semantics;
- `catalog/packs/*.json` membership/status;
- `skills/*/SKILL.md` canonical technical instructions;
- generated catalog semantics;
- installer implementation/destination behavior;
- public route paths.

If any protected file appears in the diff, stop and justify it before proceeding.

- [ ] **Step 6: Run canonical final verification**

```bash
npm test
npm run validate
npm ci --prefix apps/web
npm run web:test
npm run web:typecheck
npm run web:lint
npm run web:build
```

Then run the platform-appropriate installer smokes defined by the repository/CI workflow. Expected: all applicable checks PASS.

- [ ] **Step 7: Review CI parity**

Compare local/connector-visible verification intent with `.github/workflows/validate.yml` and ensure the final PR will exercise the same required Ubuntu/Windows gates. Do not claim cross-platform success until GitHub Actions proves it.

- [ ] **Step 8: Final diff review**

Review changed filenames and patches for scope creep, duplicated CSS overrides, dead copy paths, hard-coded catalog counts, stale claims, accidental public URL changes, and copy that still reads like generic AI marketing.

- [ ] **Step 9: Commit convergence-only fixes if any**

If no changes are required, do not create an empty commit. If regressions were fixed, use:

```text
test: close launch readiness regressions
```

or a more precise fix message if the convergence change is not test-only.

- [ ] **Step 10: Open one closing PR**

Open a single PR from `sprint/final-copy-ui-polish` to `main`. The body must include:

- approved sprint goal;
- protected contracts;
- task/slice summary;
- RED/GREEN evidence by slice where available;
- final local verification evidence;
- GitHub Actions run IDs/results after CI completes;
- explicit note that the PR must not be merged without user authorization.

- [ ] **Step 11: Wait for CI and report exact status**

Do not describe the sprint as complete until the final PR CI is green on all required jobs and the user has had a chance to perform visual validation.

- [ ] **Step 12: Stop before merge**

Even with green CI and visual approval, do not merge until the user explicitly authorizes the merge in a separate instruction.

## Self-Review Checklist

Before execution begins, verify this plan itself:

- [ ] Every approved spec surface is represented by a task.
- [ ] Copy and UI are paired within each surface rather than split into separate PRs.
- [ ] Every task has an audit step, RED where testable, implementation guidance, GREEN verification, review, and commit boundary.
- [ ] No task requires changing public routes, Stable semantics, catalog facts, installer semantics, or canonical skill instructions.
- [ ] Home thesis, pack semantics, evidence semantics, and Claude Code presentation are explicitly protected.
- [ ] Global responsive/accessibility/reduced-motion requirements are represented.
- [ ] Launch convergence includes EN/PT-BR, light/dark, mobile/tablet/desktop, metadata, invariant diff review, canonical tests, build, and CI parity.
- [ ] There are no `TODO`, `TBD`, placeholder filenames, or unspecified implementation decisions that would block an implementer.
