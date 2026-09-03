# Sitewide Copy System Audit & Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the public-facing Agent Skills Studio copy so an unfamiliar reader can understand, trust, and use the product quickly, while preserving technical depth, verified facts, Stable `1.0.0` semantics, canonical skill instructions, and evidence integrity.

**Architecture:** Keep the existing localization and editorial-copy architecture. Rewrite copy at its current ownership boundaries instead of introducing a new CMS or broad content abstraction. Work in eight independently reviewable TDD slices: shared terminology, Home/chrome, Skills/Packs, Getting Started, Built with Skills, Roadmap/institutional pages, metadata/state copy, then a final sitewide audit. Each slice updates semantic tests before production copy and preserves protected facts separately from editable editorial prose.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest/Testing Library, existing localized copy modules, existing catalog/evidence derivation, GitHub Actions validation.

**Spec:** `docs/superpowers/specs/2026-09-03-sitewide-copy-system-audit-design.md`

## Global Constraints

- Audience strategy: serve both advanced agent users and builders/teams, with advanced users as the entry audience and technical depth progressively revealed.
- Verbal identity: strong editorial headlines; concrete, technically precise body copy; functional UX copy.
- Durable positioning thesis: `Skills are not prompts. They are working methods.` / `Skills não são prompts. São métodos de trabalho.`
- English and PT-BR are equivalent editorial products, not source and literal translation.
- Use `planning-written-communication`, `writing-conversion-copy`, `writing-product-and-ux-copy`, `editing-for-clarity-and-tone`, and `humanizing-generated-prose` according to their responsibility boundaries.
- Do not fabricate testimonials, adoption claims, performance metrics, logos, scarcity, urgency, guarantees, comparisons, or user research.
- Preserve canonical `skills/*/SKILL.md`, canonical slugs, installer commands, URLs, version strings, dates, SHAs, CI run IDs, evidence classifications, verified counts, and historical release evidence.
- Stable release remains `1.0.0`; do not change release/tag semantics or `release/stable-readiness.json` history.
- No visual redesign, component-system redesign, animation redesign, route changes, or dependency changes in this tranche.
- Prefer semantic tests over broad snapshots. Do not freeze every paragraph verbatim.
- Every changed copy contract follows RED → GREEN and receives a reviewer gate before the next slice.

---

### Task 1: Establish shared terminology and product-definition contracts

**Files:**
- Modify: `apps/web/src/lib/messages.ts`
- Modify: `apps/web/src/lib/editorial-foundation.test.ts`
- Modify: `apps/web/src/components/site-shell.test.tsx`
- Modify only if currently owned there: `apps/web/src/lib/distribution-copy.ts`
- Modify only if currently owned there: site-chrome/editorial navigation copy modules under `apps/web/src/lib/`

**Interfaces:**
- Consumes: existing `Messages` locale contract and shared navigation/site-shell copy.
- Produces: consistent product terminology and high-value semantic assertions used by all later copy slices.

- [ ] **Step 1: Inventory shared terms before editing**

Record the current reader-facing names and action labels for `skill`, `pack`, `method`, `runtime`, `evidence`, `Stable`, skill maturity, install, inspect, browse/explore, source, and real-use evidence. Do not change production yet. The inventory must identify inconsistent synonyms and any hard-coded counts that should be derived.

- [ ] **Step 2: Write failing shared-copy assertions**

In `editorial-foundation.test.ts` and/or `site-shell.test.tsx`, add focused assertions that require:

```ts
expect(messages.en.brandLabel).toBe("Agent Skills Studio");
expect(messages["pt-BR"].brandLabel).toBe("Agent Skills Studio");
```

Add semantic checks for shared actions so generic labels such as `Learn more`, `Get started`, `Continue`, `Saiba mais`, `Começar`, or `Continuar` are not used where a specific destination/action exists. Assert the approved terminology remains consistent across locales without requiring sentence-level literal translation.

- [ ] **Step 3: Run the focused tests and capture RED**

Run:

```bash
npm run web:test -- --run apps/web/src/lib/editorial-foundation.test.ts apps/web/src/components/site-shell.test.tsx
```

Expected: FAIL only on the newly tightened terminology/action contracts.

- [ ] **Step 4: Apply the minimum shared-copy rewrite**

Update only shared/global copy. Use these editorial rules:

- `skill` remains the product unit/term of art in PT-BR when referring to the canonical object; explain it as a reusable working method at first meaningful mention.
- `pack` remains the product bundle/term of art; explain it as a group of independently invokable methods, not a monolithic workflow.
- prefer `inspect` / `inspecionar` for source/evidence inspection;
- prefer `explore skills` / `explorar skills` for collection discovery;
- prefer `install` / `instalar` for installer actions;
- reserve `Stable` for release status and keep skill maturity distinct.

Do not introduce new abstractions solely to centralize strings unless an existing copy module already owns them.

- [ ] **Step 5: Re-run focused tests and verify GREEN**

Run the same command. Expected: PASS.

- [ ] **Step 6: Run repository-level copy safety checks**

Run:

```bash
npm test
npm run validate
```

Expected: PASS; 54 skills and 11 active packs remain unchanged.

- [ ] **Step 7: Commit the slice**

Commit message:

```text
copy: establish shared product language
```

---

### Task 2: Rewrite Home and shared site chrome around method > prompt

**Files:**
- Modify: `apps/web/src/lib/home-content.ts`
- Modify: `apps/web/src/lib/home-evidence-content.ts`
- Modify: `apps/web/src/lib/home-evidence-content.test.ts`
- Modify: `apps/web/src/app/[locale]/page.tsx` only if a page-local public string still exists there
- Modify: `apps/web/src/components/site-shell.test.tsx`
- Modify shared header/footer/editorial-navigation copy modules only where their strings are currently owned

**Interfaces:**
- Consumes: shared terminology from Task 1, catalog-derived counts, current Home composition.
- Produces: a Home that answers what the product is, why methods differ from prompts, how to inspect/use it, and why evidence matters.

- [ ] **Step 1: Write the Home communication brief in code-review notes**

Use `planning-written-communication` to lock:

- primary reader: advanced agent user who may not know Agent Skills architecture;
- primary decision: inspect the collection;
- primary proof: inspectable method source + real-use evidence + catalog-derived scale;
- primary CTA: `Explore skills` / `Explorar skills`;
- secondary CTA: use one distinct path, preferably evidence (`Inspect real-use evidence` / `Inspecionar evidências reais`) or installation, not another synonym for browsing.

Protected: catalog counts, version, routes, real-use/evidence facts.

- [ ] **Step 2: Write failing Home assertions**

Update `home-evidence-content.test.ts` and `site-shell.test.tsx` to require:

```ts
expect(homeManifesto.en.titleLead).toBe("Skills are not prompts.");
expect(homeManifesto.en.titleClose).toBe("They are working methods.");
expect(homeManifesto["pt-BR"].titleLead).toBe("Skills não são prompts.");
expect(homeManifesto["pt-BR"].titleClose).toBe("São métodos de trabalho.");
```

Assert that the Home supporting summary defines the product as a curated/installable collection of working methods for agents, that the primary CTA routes to localized Skills, and that evidence language is concrete rather than authority-based. Avoid asserting every paragraph.

- [ ] **Step 3: Run focused Home tests and capture RED**

Run:

```bash
npm run web:test -- --run apps/web/src/lib/home-evidence-content.test.ts apps/web/src/components/site-shell.test.tsx
```

Expected: FAIL on the newly required supporting-copy/CTA contracts while the durable thesis remains intact.

- [ ] **Step 4: Rewrite the Home with the five-stage message hierarchy**

Apply `writing-conversion-copy` to the top-level decision and `editing-for-clarity-and-tone`/`humanizing-generated-prose` to the remaining sections.

Required message order:

1. method-versus-prompt thesis;
2. plain-language product definition;
3. concrete demonstration of request → method → evidence;
4. catalog-derived collection scale;
5. inspectable evidence/trust mechanism;
6. representative methods/packs;
7. specific primary and secondary actions.

Keep the Method Engine factual. Replace vague result strings such as generic `premium` claims with observable outcomes already supported by the implementation/tests.

- [ ] **Step 5: Rewrite header/footer/navigation descriptors without changing destination labels**

Use `writing-product-and-ux-copy`. Keep destination names predictable. Editorial descriptors may be shortened or humanized but must not compete with the actual link label.

- [ ] **Step 6: Re-run focused Home tests**

Expected: PASS.

- [ ] **Step 7: Run full web test + typecheck**

```bash
npm run web:test
npm run web:typecheck
```

Expected: PASS.

- [ ] **Step 8: Commit the slice**

```text
copy: sharpen the Home product story
```

---

### Task 3: Rewrite Skills and Packs discovery/detail copy for selection clarity

**Files:**
- Modify: `apps/web/src/lib/editorial-methods-copy.ts`
- Modify: `apps/web/src/lib/editorial-methods-structure.test.ts`
- Modify: `apps/web/src/lib/editorial-packs-copy.ts`
- Modify: `apps/web/src/lib/catalog.test.ts` only for reader-facing semantic contracts, never taxonomy facts
- Modify page-local strings under:
  - `apps/web/src/app/[locale]/skills/`
  - `apps/web/src/app/[locale]/packs/`
- Modify focused components/tests that own search/filter/selection microcopy

**Interfaces:**
- Consumes: catalog metadata, canonical skill/pack facts, Task 1 terminology.
- Produces: discovery copy that helps readers recognize tasks, choose a skill or pack, and understand pack composition.

- [ ] **Step 1: Define the Skills/Packs selection brief**

Skills index objective: `find the right method for the task`.
Packs index objective: `decide whether a related bundle is more useful than selecting one skill at a time`.
Skill detail objective: `judge trigger, purpose, boundaries, maturity, relations, and installation path`.
Pack detail objective: `understand the broader problem space and how responsibilities split among members`.

- [ ] **Step 2: Add failing selection-copy tests**

In `editorial-methods-structure.test.ts` and relevant page/component tests, assert:

- search/filter controls use task-oriented concrete labels;
- empty/no-result states state what happened and a useful recovery action;
- pack copy explicitly communicates independently invokable methods;
- skill-detail CTA uses an action such as `Install this skill` / `Instalar esta skill` rather than generic continuation language;
- cross-pack membership does not imply complete validation of every represented pack.

- [ ] **Step 3: Run focused tests and capture RED**

```bash
npm run web:test -- --run apps/web/src/lib/editorial-methods-structure.test.ts apps/web/src/lib/catalog.test.ts
```

Add the exact component/page test files discovered during inventory to this command.

Expected: FAIL only on newly required copy semantics.

- [ ] **Step 4: Rewrite `editorial-methods-copy.ts`**

Use `writing-product-and-ux-copy` for filters/actions and `editing-for-clarity-and-tone` for explanatory prose. Make task recognition more important than abstract catalog rhetoric.

- [ ] **Step 5: Rewrite `editorial-packs-copy.ts`**

Explain packs as broader discipline/problem-space groupings whose members remain independently invokable. Preserve member counts, slugs, status, and cross-pack facts from the catalog.

- [ ] **Step 6: Rewrite page-local Skills/Packs strings**

Only touch strings still owned inside page/component files. Do not move copy merely for aesthetic refactoring.

- [ ] **Step 7: Re-run focused and full web tests**

```bash
npm run web:test
npm run web:typecheck
```

Expected: PASS.

- [ ] **Step 8: Commit the slice**

```text
copy: clarify skill and pack selection
```

---

### Task 4: Rewrite Getting Started and operational UX copy

**Files:**
- Modify: `apps/web/src/lib/messages.ts`
- Modify: copy modules used by Getting Started, including any existing field-manual/distribution copy modules
- Modify: `apps/web/src/app/[locale]/getting-started/page.tsx` only for page-local public strings
- Modify: `apps/web/src/components/site-shell.test.tsx`
- Modify focused installer/getting-started tests discovered in the current tree

**Interfaces:**
- Consumes: real installer commands and behavior, Task 1 terminology.
- Produces: an operational installation guide with clear prerequisites, platform paths, verification, and recovery-oriented labels.

- [ ] **Step 1: Audit Getting Started by product state**

Map every string to one state: choose platform, install collection, install one skill, install pack, verify installation, understand destination, recover from invalid selection. Flag decorative marketing copy that interrupts task completion.

- [ ] **Step 2: Write failing UX-copy tests**

Require exact protected installer commands to remain unchanged, while tightening surrounding labels. Examples of semantic contracts:

```ts
expect(screen.getByText("bash install.sh")).toBeInTheDocument();
expect(screen.getByText("./install.ps1")).toBeInTheDocument();
```

Assert the user can identify what each command installs, where it goes, and how to verify success without relying on surrounding styling alone.

- [ ] **Step 3: Run focused tests and capture RED**

```bash
npm run web:test -- --run apps/web/src/components/site-shell.test.tsx
```

Include any dedicated Getting Started tests found during inventory.

- [ ] **Step 4: Rewrite installation microcopy**

Use `writing-product-and-ux-copy`. Frontload prerequisites and consequences. Keep helper text separate from error/recovery text. Do not add sales copy around commands.

- [ ] **Step 5: Verify commands and derived counts remain protected**

Check that command literals, destination behavior, and catalog-derived skill counts are unchanged by editorial edits.

- [ ] **Step 6: Run web tests, typecheck, and installer-sensitive root tests**

```bash
npm run web:test
npm run web:typecheck
npm test
```

Expected: PASS.

- [ ] **Step 7: Commit the slice**

```text
copy: make installation guidance operational
```

---

### Task 5: Rewrite Built with Skills as evidence, not portfolio rhetoric

**Files:**
- Modify: `apps/web/src/lib/built-with-skills.ts`
- Modify: `apps/web/src/lib/built-with-skills.test.ts`
- Modify: `apps/web/src/lib/editorial-evidence-copy.ts`
- Modify: `apps/web/src/components/evidence/evidence-archive.test.tsx`
- Modify page-local strings under `apps/web/src/app/[locale]/built-with-skills/` only if needed
- Do not rewrite immutable evidence documents under `docs/built-with-skills/` merely for tone; edit only if a factual presentation defect is discovered and separately justified

**Interfaces:**
- Consumes: real-use case registry, immutable source/evidence identifiers, Task 1 terminology.
- Produces: an evidence archive whose hierarchy is project → problem → methods → verification → inspected result.

- [ ] **Step 1: Identify protected case fields before rewriting**

For every case, mark project name, repository/source URL, evidence class, skill slugs, SHAs, PR numbers, CI run IDs, dates, counts, and Stable/maturity claims as protected.

- [ ] **Step 2: Write failing evidence-copy assertions**

Update `built-with-skills.test.ts` and `evidence-archive.test.tsx` to require:

- archive heading/intro says the cases are inspectable evidence, not generic showcase work;
- each case has a concrete problem statement and method list;
- source/evidence links keep specific action labels such as `Inspect source record` / `Inspecionar registro-fonte`;
- no case silently strengthens `represented` into `fully validated` when that is not what the evidence supports.

- [ ] **Step 3: Run focused tests and capture RED**

```bash
npm run web:test -- --run apps/web/src/lib/built-with-skills.test.ts apps/web/src/components/evidence/evidence-archive.test.tsx
```

Expected: FAIL only on new editorial contracts.

- [ ] **Step 4: Rewrite archive-level copy**

Use `writing-conversion-copy` only for the decision to trust/inspect; use `editing-for-clarity-and-tone` and `humanizing-generated-prose` for case narratives. Keep proof adjacent to claims.

- [ ] **Step 5: Rewrite localized case summaries without changing factual payload**

Prefer concrete problem/action/result language. Remove portfolio-style praise, repeated `premium`, generic significance claims, and mechanical conclusion phrasing.

- [ ] **Step 6: Re-run focused tests and evidence coverage tests**

```bash
npm run web:test
npm run validate
```

Expected: PASS; current evidence-derived coverage remains correct.

- [ ] **Step 7: Commit the slice**

```text
copy: turn real-use cases into inspectable proof
```

---

### Task 6: Rewrite Roadmap, About, Contribute, and Changelog by page responsibility

**Files:**
- Modify: `apps/web/src/lib/project-pages.ts`
- Modify: `apps/web/src/lib/project-pages.test.ts`
- Modify: `apps/web/src/lib/post-stable-changelog.test.ts`
- Modify: `apps/web/src/lib/roadmap.ts` only where reader-facing composition exists
- Modify: `apps/web/src/lib/roadmap.test.ts`
- Modify Roadmap copy in `apps/web/src/lib/messages.ts` or its current dedicated copy modules
- Modify page-local strings under:
  - `apps/web/src/app/[locale]/about/page.tsx`
  - `apps/web/src/app/[locale]/contribute/page.tsx`
  - `apps/web/src/app/[locale]/changelog/page.tsx`
  - `apps/web/src/app/[locale]/roadmap/page.tsx`
  only where genuinely owned there

**Interfaces:**
- Consumes: Stable/readiness facts, current real-use representation, product principles, contribution requirements.
- Produces: four institutional surfaces with distinct editorial jobs and no repeated Home pitch.

- [ ] **Step 1: Write the four briefs**

- About: why the collection exists + operating principles + distinction from prompt repositories.
- Contribute: what belongs, quality bar, evidence expectations, first action.
- Changelog: factual, scannable product change history.
- Roadmap: current state, maturity/evidence distinctions, future work.

- [ ] **Step 2: Add failing institutional-page assertions**

In `project-pages.test.ts`, `post-stable-changelog.test.ts`, and `roadmap.test.ts`, require page-specific purpose and protected status distinctions. Preserve exact `1.0.0` and historical readiness semantics.

- [ ] **Step 3: Run focused tests and capture RED**

```bash
npm run web:test -- --run apps/web/src/lib/project-pages.test.ts apps/web/src/lib/post-stable-changelog.test.ts apps/web/src/lib/roadmap.test.ts
```

Expected: FAIL only on new editorial contracts.

- [ ] **Step 4: Rewrite About**

Use `editing-for-clarity-and-tone` plus `humanizing-generated-prose`. Remove duplicated Home conversion language; make principles and product rationale concrete.

- [ ] **Step 5: Rewrite Contribute**

Use `writing-product-and-ux-copy` for contribution actions and `editing-for-clarity-and-tone` for quality/evidence requirements. Name the next step explicitly.

- [ ] **Step 6: Rewrite Changelog**

Keep factual release/change language. Do not add promotional adjectives. Preserve versions/dates/status.

- [ ] **Step 7: Rewrite Roadmap**

Keep Stable release, skill maturity, real-use pack representation, and dedicated full-pack evidence distinct. Derived `9/11` representation may be displayed where currently derived, but do not describe Game Development as having a complete dedicated case unless that becomes true through separate evidence work.

- [ ] **Step 8: Re-run focused and full web tests**

```bash
npm run web:test
npm run web:typecheck
```

Expected: PASS.

- [ ] **Step 9: Commit the slice**

```text
copy: separate institutional page responsibilities
```

---

### Task 7: Audit metadata, not-found/error/empty states, and remaining page-local strings

**Files:**
- Modify metadata copy generators/modules currently used by localized pages
- Modify: `apps/web/src/app/[locale]/layout.tsx` only if metadata or public accessibility strings are owned there
- Modify not-found files under:
  - `apps/web/src/app/[locale]/skills/[slug]/not-found.tsx`
  - `apps/web/src/app/[locale]/packs/[slug]/not-found.tsx`
  - equivalent built-with-skills or localized not-found/error files if present
- Modify focused metadata/not-found/state tests discovered in current tree
- Modify `apps/web/src/components/site-shell.test.tsx` where shared state copy is asserted

**Interfaces:**
- Consumes: final terminology from Tasks 1-6, actual routes/states.
- Produces: accurate off-page metadata and state/recovery copy across the remaining public UI.

- [ ] **Step 1: Inventory every remaining literal public string**

Search `apps/web/src/app` and `apps/web/src/components` for reader-facing literals not already owned by audited copy modules. Exclude code, test fixtures, ARIA strings that are already correct, URLs, command literals, IDs, and developer-only text.

- [ ] **Step 2: Classify each state before rewriting**

Distinguish invalid slug, missing resource, zero search results, loading, actual failure, and generic 404 only where the UI itself can distinguish them. Do not invent a recovery path that the product does not implement.

- [ ] **Step 3: Write failing metadata/state assertions**

Require metadata descriptions to name the page topic and useful product value without keyword stuffing. Require recovery actions to name the destination/action, e.g. `Browse all skills` / `Ver todas as skills`, rather than `Go back` when the intended recovery is a known route.

- [ ] **Step 4: Run focused tests and capture RED**

Run the exact metadata/not-found/state test files identified in Step 1 plus:

```bash
npm run web:test -- --run apps/web/src/components/site-shell.test.tsx
```

Expected: FAIL only on newly tightened copy contracts.

- [ ] **Step 5: Rewrite metadata and state copy**

Use `writing-product-and-ux-copy`. Preserve route behavior, accessibility semantics, and locale switching.

- [ ] **Step 6: Re-run full web tests, typecheck, and lint**

```bash
npm run web:test
npm run web:typecheck
npm run web:lint
```

Expected: PASS.

- [ ] **Step 7: Commit the slice**

```text
copy: tighten metadata and recovery states
```

---

### Task 8: Final cross-locale editorial audit and canonical verification

**Files:**
- Modify only copy/test files with defects found by the final audit
- Do not add new product behavior
- Update the implementation PR description with the final inventory and verification evidence

**Interfaces:**
- Consumes: all seven completed slices.
- Produces: a release-ready sitewide copy candidate with no known stale, contradictory, generic, or unowned public copy.

- [ ] **Step 1: Read the public site in page-flow order, not file order**

Audit in this sequence for both `en` and `pt-BR`:

1. Home;
2. Skills index → skill detail;
3. Packs index → pack detail;
4. Getting Started;
5. Built with Skills index → case detail;
6. Roadmap;
7. About;
8. Contribute;
9. Changelog;
10. header/navigation/footer;
11. invalid skill/pack/case paths and other public recovery states.

Record defects under the rubric: clarity, differentiation, decision support, evidence integrity, UX consistency, human editorial quality, density.

- [ ] **Step 2: Search for banned/vague marketing residue**

Search public copy for contextually suspicious uses of:

```text
premium
powerful
seamless
next-level
revolutionize
unlock
best-in-class
production-ready
learn more
get started
continue
```

and PT-BR equivalents. Do not ban a word mechanically; each remaining occurrence must convey a concrete, defensible meaning in context.

- [ ] **Step 3: Check EN/PT-BR semantic parity**

For each page, confirm equal facts, confidence, actions, and consequences while allowing native syntax/cadence. Fix literal-translation artifacts without introducing different claims.

- [ ] **Step 4: Check protected facts against source-of-truth modules**

Verify:

- `VERSION` remains `1.0.0`;
- 54 canonical skills and 11 active packs remain derived correctly;
- historical `release/stable-readiness.json` is unchanged;
- commands, URLs, slugs, SHAs, CI identifiers, evidence classes, and verified counts have not drifted;
- current pack-representation copy reflects the code's real metric and does not overstate dedicated evidence.

- [ ] **Step 5: Run the canonical local gates**

```bash
npm test
npm run validate
npm run web:test
npm run web:typecheck
npm run web:lint
NEXT_PUBLIC_SITE_URL=https://skills.jhonatanoliveira.com npm run web:build
```

Expected: all PASS.

- [ ] **Step 6: Run canonical GitHub CI on the implementation PR**

Require both Ubuntu and Windows `Validate skills` jobs to pass root tests, repository/catalog validation, web tests, typecheck, lint, production build, and the platform-appropriate installer smoke.

- [ ] **Step 7: Final diff audit**

Confirm no changes to:

- `skills/*/SKILL.md`;
- pack membership/status/maturity unless separately approved;
- release/tag history;
- installer behavior;
- routes;
- dependencies;
- visual styles/components except incidental text-length-safe markup strictly necessary to render existing copy.

Any violation requires either reverting it or upgrading scope and obtaining new approval.

- [ ] **Step 8: Commit final editorial fixes**

```text
copy: complete the sitewide editorial audit
```

- [ ] **Step 9: Mark the PR Ready for Review only after final GREEN**

PR summary must include:

- pages/surfaces audited;
- Writing & Communication methods used;
- RED → GREEN evidence by slice;
- protected facts verified;
- final CI run IDs;
- explicit statement that visual redesign is deferred to the separate UI tranche;
- explicit `Do not merge without user authorization` note.
