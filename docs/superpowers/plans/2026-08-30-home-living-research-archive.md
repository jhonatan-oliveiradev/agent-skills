# Home Living Research Archive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Agent Skills Studio Home from an evidence-first landing page into a three-act Living Research Archive with a sticky Case 001 story, a proprietary Evidence Thread, more varied editorial composition, and first-class mobile/reduced-motion behavior.

**Architecture:** Keep `app/[locale]/page.tsx` as a server orchestration layer and move each Home act into focused components. Use the already-installed `motion/react` APIs (`useScroll`, `useTransform`, `useSpring`, `useReducedMotion`) plus SVG/CSS for scroll-linked interaction; do not add GSAP or another animation dependency. Keep catalog/evidence resolution server-side and pass serializable view models into the small client components that own motion.

**Tech Stack:** Next.js 16.3.1, React 19.2.8, TypeScript 5.9, Tailwind CSS 4, Motion 13.1.1, Vitest 4, Testing Library, existing OGL Dark Veil.

**Spec:** `docs/superpowers/specs/2026-08-30-home-living-research-archive-design.md`

## Global Constraints

- Home experience only; interior skill/detail pages remain out of scope.
- Dark Veil remains the only WebGL surface on the Home.
- Do not add GSAP, Three.js, video backgrounds, custom cursor, audio, or another heavy motion dependency.
- Violet remains the canonical Home accent/material; green remains reserved for success/verification semantics.
- Evidence must come only from repository PRs/commits, existing Built with Skills cases, real QA facts, published methods, and published packs.
- Native scrolling only; no scroll hijacking.
- `prefers-reduced-motion` is a first-class composition, not an afterthought.
- Mobile must use a linear story instead of reproducing desktop sticky choreography at reduced scale.
- All hover information must be available on keyboard focus.
- Keep semantic heading order and accessibility reading order intact.
- Before merge, run root tests, catalog/plugin validation, web tests, TypeScript, ESLint, Next.js production build, and repository platform smoke tests.
- Rendered QA targets: 390, 768, 1440, and 1920 px; dark, light, and reduced-motion paths.

---

## File Structure

### Create

- `apps/web/src/components/home/home-manifesto-hero.tsx` — server/presentational wrapper for the existing approved hero.
- `apps/web/src/components/home/home-case-study-story.tsx` — client component for the four-state sticky Case 001 sequence and mobile linear fallback.
- `apps/web/src/components/home/home-evidence-thread.tsx` — client SVG/CSS Evidence Thread driven by normalized section progress.
- `apps/web/src/components/home/home-method-index.tsx` — server/presentational editorial method index.
- `apps/web/src/components/home/home-pack-dossiers.tsx` — server/presentational asymmetric pack dossiers.
- `apps/web/src/components/home/home-method-workflow.tsx` — client component for the connected four-movement process.
- `apps/web/src/components/home/home-evidence-ledger.tsx` — server/presentational audit-style ledger.
- `apps/web/src/components/home/home-closing.tsx` — server/presentational roadmap/contribution closing act.
- `apps/web/src/components/home/home-living-archive.test.tsx` — component contracts for sticky/reduced-motion/thread/workflow behavior.

### Modify

- `apps/web/src/app/[locale]/page.tsx` — reduce to data resolution + three-act orchestration.
- `apps/web/src/app/home-evidence.css` — replace current section-by-section visual rhythm with the Living Research Archive composition and responsive/reduced-motion rules.
- `apps/web/src/lib/home-evidence-content.ts` — evolve existing copy into explicit four-state Case 001 + act labels/readouts without inventing evidence.
- `apps/web/src/lib/home-evidence-content.test.ts` — lock bilingual content/evidence contract.
- `apps/web/src/lib/home-structure.test.ts` — lock three-act order and eliminate the old independent transformation section contract.
- `apps/web/src/components/site-shell.test.tsx` — update definitive Home assertions to new headings/landmarks while retaining hero, Method Engine, CTA and metadata contracts.
- `apps/web/src/components/motion/editorial-motion.test.tsx` — retain Dark Veil/reduced-motion guarantees and add no second canvas regression.

### No dependency changes

- `apps/web/package.json` remains unchanged. `motion/react` already provides the required scroll primitives.

---

### Task 1: Lock the three-act content and structural contract

**Files:**
- Modify: `apps/web/src/lib/home-evidence-content.ts`
- Modify: `apps/web/src/lib/home-evidence-content.test.ts`
- Modify: `apps/web/src/lib/home-structure.test.ts`

**Interfaces:**
- Produces: `HomeEvidenceCopy.caseStudy.stages` as exactly four localized stages.
- Produces: `HomeEvidenceCopy.acts` labels for manifesto/case, methods/systems, proof/open-system.
- Keeps: `methods.featured`, `packs`, `workflow.movements`, and `ledger` data consumed by later components.

- [ ] **Step 1: Write the failing localized content test**

Add assertions equivalent to:

```ts
it.each(["en", "pt-BR"] as const)("defines the four-state Case 001 story for %s", (locale) => {
  const copy = homeEvidenceContent[locale];

  expect(copy.caseStudy.stages).toHaveLength(4);
  expect(copy.caseStudy.stages.map((stage) => stage.id)).toEqual([
    "problem",
    "method",
    "transformation",
    "evidence",
  ]);
  expect(copy.caseStudy.evidence).toContain("PR #22");
  expect(copy.acts).toHaveLength(3);
});
```

- [ ] **Step 2: Write the failing page-order source contract**

Update `home-structure.test.ts` so the page must render these data markers in order:

```ts
expect(source.indexOf('data-home-act="manifesto-case"')).toBeLessThan(
  source.indexOf('data-home-act="methods-systems"'),
);
expect(source.indexOf('data-home-act="methods-systems"')).toBeLessThan(
  source.indexOf('data-home-act="proof-open-system"'),
);
expect(source).not.toContain('data-home-section="transformation"');
```

- [ ] **Step 3: Run the focused tests and verify RED**

Run:

```bash
npm run web:test -- --run apps/web/src/lib/home-evidence-content.test.ts apps/web/src/lib/home-structure.test.ts
```

Expected: FAIL because `caseStudy`, `acts`, and the three-act markers do not exist yet.

- [ ] **Step 4: Implement the minimal bilingual content shape**

Refactor the copy type so the first act has an explicit Case 001 contract:

```ts
type HomeCaseStageId = "problem" | "method" | "transformation" | "evidence";

type HomeCaseStage = Readonly<{
  id: HomeCaseStageId;
  eyebrow: string;
  title: string;
  summary: string;
}>;
```

Use only existing verified claims. Keep `PR #22`, actual visual QA sizes, and published skill slugs; do not add adoption metrics or testimonials.

- [ ] **Step 5: Run the focused tests and verify GREEN**

Run the same command. Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/lib/home-evidence-content.ts apps/web/src/lib/home-evidence-content.test.ts apps/web/src/lib/home-structure.test.ts
git commit -m "test(web): define Living Archive Home contract"
```

---

### Task 2: Split the server Home into focused editorial components

**Files:**
- Create: `apps/web/src/components/home/home-manifesto-hero.tsx`
- Create: `apps/web/src/components/home/home-method-index.tsx`
- Create: `apps/web/src/components/home/home-pack-dossiers.tsx`
- Create: `apps/web/src/components/home/home-evidence-ledger.tsx`
- Create: `apps/web/src/components/home/home-closing.tsx`
- Modify: `apps/web/src/app/[locale]/page.tsx`
- Modify: `apps/web/src/components/site-shell.test.tsx`

**Interfaces:**
- `HomeManifestoHero` consumes the current manifesto copy, localized metrics, and `MethodEngine` copy.
- `HomeMethodIndex` consumes resolved featured methods: `{ slug, displayName, discipline, category, href }[]`.
- `HomePackDossiers` consumes localized active pack view models, not raw catalog mutation APIs.
- `HomeEvidenceLedger` consumes resolved rows `{ method, methodHref, usedIn, usedInHref?, evidence, evidenceHref, external }[]`.
- `HomeClosing` consumes localized roadmap copy and locale.

- [ ] **Step 1: Write failing definitive Home assertions**

Update the Home test to expect three top-level acts and the core content that must survive componentization:

```ts
expect(container.querySelectorAll("[data-home-act]")).toHaveLength(3);
expect(screen.getByRole("region", { name: locale === "en" ? "Method Engine" : "Motor de Método" })).toBeInTheDocument();
expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
expect(screen.getByRole("link", { name: locale === "en" ? "Explore the collection" : "Explorar a coleção" })).toHaveAttribute("href", `/${locale}/skills`);
```

Also assert the old standalone transformation heading is no longer independently rendered.

- [ ] **Step 2: Run the focused Home test and verify RED**

```bash
npm run web:test -- --run apps/web/src/components/site-shell.test.tsx
```

Expected: FAIL on three-act landmarks/markers.

- [ ] **Step 3: Extract presentational server components**

Move current JSX for hero, methods, packs, ledger, and closing into the files above. Keep Links server-rendered. Keep `page.tsx` responsible for:

```ts
const locale = await resolveLocale(params);
const catalog = getCatalog();
const localizedSkills = getLocalizedSkills(locale);
const activePacks = getLocalizedPacks(locale).filter((pack) => pack.status === "active");
const cases = getBuiltWithSkillsCases(locale);
```

Then build serializable view models and render:

```tsx
<section data-home-act="manifesto-case">...</section>
<section data-home-act="methods-systems">...</section>
<section data-home-act="proof-open-system">...</section>
```

Do not create one giant client Home component.

- [ ] **Step 4: Run the focused Home test and verify GREEN**

```bash
npm run web:test -- --run apps/web/src/components/site-shell.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Run typecheck for extraction mistakes**

```bash
npm run web:typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/app/'[locale]'/page.tsx apps/web/src/components/home apps/web/src/components/site-shell.test.tsx
git commit -m "refactor(web): split Home into editorial acts"
```

---

### Task 3: Build the sticky Case 001 story with intentional mobile/reduced-motion fallbacks

**Files:**
- Create: `apps/web/src/components/home/home-case-study-story.tsx`
- Create: `apps/web/src/components/home/home-living-archive.test.tsx`
- Modify: `apps/web/src/app/[locale]/page.tsx`
- Modify: `apps/web/src/app/home-evidence.css`

**Interfaces:**

```ts
export type HomeCaseStudyStoryProps = Readonly<{
  eyebrow: string;
  title: string;
  summary: string;
  stages: readonly HomeCaseStageViewModel[];
  evidenceLinks: readonly HomeCaseEvidenceLink[];
}>;
```

The client component owns only presentation state. Content arrives as serializable props.

- [ ] **Step 1: Write failing component tests**

Mock Motion reduced-motion state and assert both modes:

```tsx
expect(container.querySelector('[data-case-mode="sticky"]')).toBeInTheDocument();
expect(container.querySelectorAll("[data-case-stage]")).toHaveLength(4);
```

For reduced motion:

```tsx
expect(container.querySelector('[data-case-mode="linear"]')).toBeInTheDocument();
expect(container.querySelector('[data-case-sticky="true"]')).not.toBeInTheDocument();
```

- [ ] **Step 2: Run the new component test and verify RED**

```bash
npm run web:test -- --run apps/web/src/components/home/home-living-archive.test.tsx
```

Expected: FAIL because `HomeCaseStudyStory` does not exist.

- [ ] **Step 3: Implement the client scroll state with Motion**

Use:

```ts
const rootRef = useRef<HTMLElement>(null);
const reducedMotion = useReducedMotion();
const { scrollYProgress } = useScroll({
  target: rootRef,
  offset: ["start start", "end end"],
});
const activeStage = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], [0, 1, 2, 3, 3]);
```

Do not subscribe and call React `setState` on every pixel. Prefer MotionValues for transforms/opacity; only derive a discrete active stage where metadata needs it, using a bounded `useMotionValueEvent` update.

- [ ] **Step 4: Implement desktop sticky and mobile/reduced-motion structure**

Desktop CSS contract:

```css
.home-case-story {
  min-height: clamp(220vh, 250vh, 280vh);
}

.home-case-story__stage {
  position: sticky;
  top: var(--header-height, 4.5rem);
  min-height: calc(100svh - var(--header-height, 4.5rem));
}
```

At the mobile breakpoint and under reduced motion, restore normal flow and `min-height: auto`.

- [ ] **Step 5: Run component + Home tests**

```bash
npm run web:test -- --run apps/web/src/components/home/home-living-archive.test.tsx apps/web/src/components/site-shell.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/home/home-case-study-story.tsx apps/web/src/components/home/home-living-archive.test.tsx apps/web/src/app/'[locale]'/page.tsx apps/web/src/app/home-evidence.css
git commit -m "feat(web): turn Case 001 into a sticky story"
```

---

### Task 4: Add the proprietary Evidence Thread without another canvas

**Files:**
- Create: `apps/web/src/components/home/home-evidence-thread.tsx`
- Modify: `apps/web/src/components/home/home-case-study-story.tsx`
- Modify: `apps/web/src/components/home/home-living-archive.test.tsx`
- Modify: `apps/web/src/components/motion/editorial-motion.test.tsx`
- Modify: `apps/web/src/app/home-evidence.css`

**Interfaces:**

```ts
export type EvidenceThreadMode = "case" | "workflow" | "ledger";

export type HomeEvidenceThreadProps = Readonly<{
  progress: MotionValue<number>;
  mode: EvidenceThreadMode;
  className?: string;
}>;
```

- [ ] **Step 1: Write failing thread tests**

```tsx
expect(screen.getByTestId("evidence-thread")).toHaveAttribute("aria-hidden", "true");
expect(screen.getByTestId("evidence-thread").querySelector("svg")).toBeInTheDocument();
expect(screen.getByTestId("evidence-thread").querySelector("canvas")).not.toBeInTheDocument();
```

Extend the motion regression to assert the Home still exposes only the Dark Veil canvas when rendered in animated mode.

- [ ] **Step 2: Run focused tests and verify RED**

```bash
npm run web:test -- --run apps/web/src/components/home/home-living-archive.test.tsx apps/web/src/components/motion/editorial-motion.test.tsx
```

Expected: FAIL because the thread does not exist.

- [ ] **Step 3: Implement SVG path progress**

Render a small set of mode-specific paths and drive `pathLength`/opacity from the supplied MotionValue:

```tsx
<motion.path
  d={pathForMode[mode]}
  pathLength={progress}
  vectorEffect="non-scaling-stroke"
/>
```

Keep the SVG `aria-hidden`, `focusable="false"`, and `pointer-events: none`.

- [ ] **Step 4: Add static reduced-motion geometry**

When reduced motion is active, render the same semantic geometry as static rules with `pathLength={1}` and no scrubbed transforms.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run the same focused command. Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/home/home-evidence-thread.tsx apps/web/src/components/home/home-case-study-story.tsx apps/web/src/components/home/home-living-archive.test.tsx apps/web/src/components/motion/editorial-motion.test.tsx apps/web/src/app/home-evidence.css
git commit -m "feat(web): add the Home Evidence Thread"
```

---

### Task 5: Recompose Method Index and Packs as editorial systems instead of repeated cards

**Files:**
- Modify: `apps/web/src/components/home/home-method-index.tsx`
- Modify: `apps/web/src/components/home/home-pack-dossiers.tsx`
- Modify: `apps/web/src/components/home/home-living-archive.test.tsx`
- Modify: `apps/web/src/app/home-evidence.css`

**Interfaces:**
- Method rows remain real links and expose the same metadata on `:focus-visible` as on hover.
- Pack dossiers render active packs only and show method count, version/status, concrete outcomes, representative skills, and inspect link.

- [ ] **Step 1: Add failing accessibility/structure tests**

Assert three method rows and three pack dossiers with link semantics:

```tsx
expect(container.querySelectorAll(".home-method-index li")).toHaveLength(3);
expect(container.querySelectorAll(".home-pack-dossier")).toHaveLength(3);
expect(screen.getAllByRole("link").some((link) => link.getAttribute("href")?.includes("/skills/"))).toBe(true);
```

- [ ] **Step 2: Run tests and verify RED on the new dossier class/contract**

```bash
npm run web:test -- --run apps/web/src/components/home/home-living-archive.test.tsx
```

- [ ] **Step 3: Implement Method Index composition**

Use large title rows with metadata revealed through CSS selectors shared by hover/focus:

```css
.home-method-index a:hover .home-method-index__evidence,
.home-method-index a:focus-visible .home-method-index__evidence {
  opacity: 1;
  transform: translateY(0);
}
```

No essential information may exist only inside the hidden evidence line.

- [ ] **Step 4: Implement asymmetric pack dossiers**

Use CSS grid placement rather than equal cards. Example wide layout:

```css
.home-pack-dossier:nth-child(1) { grid-column: 1 / span 7; }
.home-pack-dossier:nth-child(2) { grid-column: 6 / span 7; }
.home-pack-dossier:nth-child(3) { grid-column: 2 / span 9; }
```

Collapse to a single column on mobile/tablet. Do not use pack catalog colors as large visual accents.

- [ ] **Step 5: Run tests and typecheck**

```bash
npm run web:test -- --run apps/web/src/components/home/home-living-archive.test.tsx
npm run web:typecheck
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/home/home-method-index.tsx apps/web/src/components/home/home-pack-dossiers.tsx apps/web/src/components/home/home-living-archive.test.tsx apps/web/src/app/home-evidence.css
git commit -m "refactor(web): make methods and packs editorial"
```

---

### Task 6: Turn the four movements into one connected process field

**Files:**
- Create: `apps/web/src/components/home/home-method-workflow.tsx`
- Modify: `apps/web/src/components/home/home-evidence-thread.tsx`
- Modify: `apps/web/src/components/home/home-living-archive.test.tsx`
- Modify: `apps/web/src/app/[locale]/page.tsx`
- Modify: `apps/web/src/app/home-evidence.css`

**Interfaces:**

```ts
export type HomeMethodWorkflowProps = Readonly<{
  eyebrow: string;
  title: string;
  summary: string;
  movements: readonly [WorkflowMovement, WorkflowMovement, WorkflowMovement, WorkflowMovement];
}>;
```

- [ ] **Step 1: Write failing workflow tests**

```tsx
expect(container.querySelectorAll("[data-workflow-stage]")).toHaveLength(4);
expect(container.querySelector('[data-workflow-layout="horizontal"]')).toBeInTheDocument();
```

For reduced motion, assert the component still exposes all four stages in normal document flow.

- [ ] **Step 2: Run focused test and verify RED**

```bash
npm run web:test -- --run apps/web/src/components/home/home-living-archive.test.tsx
```

- [ ] **Step 3: Implement scroll-linked workflow progress using Motion**

Use a section ref + `useScroll({ target, offset: ["start 80%", "end 20%"] })`, pass the normalized MotionValue to `HomeEvidenceThread mode="workflow"`, and use transforms/opacity only for stage emphasis.

- [ ] **Step 4: Implement responsive compositions**

Desktop: connected horizontal/diagonal process field.

Mobile/reduced motion: vertical timeline with all copy visible and no required horizontal scroll.

- [ ] **Step 5: Run tests + lint**

```bash
npm run web:test -- --run apps/web/src/components/home/home-living-archive.test.tsx
npm run web:lint
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/home/home-method-workflow.tsx apps/web/src/components/home/home-evidence-thread.tsx apps/web/src/components/home/home-living-archive.test.tsx apps/web/src/app/'[locale]'/page.tsx apps/web/src/app/home-evidence.css
git commit -m "feat(web): connect the four method movements"
```

---

### Task 7: Finish Act III with an austere ledger and stronger closing rhythm

**Files:**
- Modify: `apps/web/src/components/home/home-evidence-ledger.tsx`
- Modify: `apps/web/src/components/home/home-closing.tsx`
- Modify: `apps/web/src/app/home-evidence.css`
- Modify: `apps/web/src/components/site-shell.test.tsx`

**Interfaces:**
- Ledger links method → skill detail, used-in → published case when available, and evidence → published case or GitHub PR.
- External links keep `target="_blank" rel="noreferrer noopener"`.
- Closing remains roadmap/contribution material and appears after ledger.

- [ ] **Step 1: Add failing ledger/closing assertions**

```tsx
expect(screen.getByRole("heading", { name: ledgerTitle })).toBeInTheDocument();
expect(screen.getByRole("link", { name: locale === "en" ? "Read the roadmap" : "Ver o roteiro" })).toHaveAttribute("href", `/${locale}/roadmap`);
expect(container.querySelector('[data-home-section="ledger"]')!.compareDocumentPosition(
  container.querySelector('[data-home-section="closing"]')!,
)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
```

- [ ] **Step 2: Run Home test and verify RED if the new closing marker is absent**

```bash
npm run web:test -- --run apps/web/src/components/site-shell.test.tsx
```

- [ ] **Step 3: Implement the restrained audit surface**

Use rules, monospace metadata, no atmospheric glow, and clear focus states. On small screens prefer labelled rows rather than forcing comprehension through a wide horizontal table.

- [ ] **Step 4: Implement the final closing composition**

Keep roadmap secondary. Use stronger display type/negative space rather than new cards or decorative effects.

- [ ] **Step 5: Run Home tests and verify GREEN**

```bash
npm run web:test -- --run apps/web/src/components/site-shell.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/home/home-evidence-ledger.tsx apps/web/src/components/home/home-closing.tsx apps/web/src/app/home-evidence.css apps/web/src/components/site-shell.test.tsx
git commit -m "refactor(web): finish the Home proof act"
```

---

### Task 8: Validate the full Living Research Archive and perform rendered QA

**Files:**
- Modify only if validation finds a specific defect.
- Tests potentially touched: `apps/web/src/components/home/home-living-archive.test.tsx`, `apps/web/src/components/motion/editorial-motion.test.tsx`, `apps/web/src/components/site-shell.test.tsx`.

**Interfaces:**
- No new feature interfaces. This task verifies the complete spec.

- [ ] **Step 1: Run the full repository verification matrix locally/CI**

```bash
npm test
npm run validate
npm ci --prefix apps/web
npm run web:test
npm run web:typecheck
npm run web:lint
npm run web:build
```

Expected: all PASS.

- [ ] **Step 2: Confirm no second WebGL/canvas regression**

Run the motion tests and verify the Home's animated path still has only the existing Dark Veil canvas. Evidence Thread must remain SVG/CSS.

- [ ] **Step 3: Perform rendered QA at required viewports**

Validate:

```text
390 x mobile
768 x tablet
1440 x desktop
1920 x wide desktop
```

For each relevant viewport check dark mode; additionally check light mode and reduced motion on at least mobile + desktop.

- [ ] **Step 4: Inspect the exact interaction failures the spec calls out**

Verify:

```text
- sticky Case 001 releases cleanly
- no clipped PT-BR headings
- Evidence Thread never overlaps readable text
- no horizontal scroll leaks
- Method Index hover and keyboard focus expose equivalent information
- pack dossiers remain legible when stacked
- workflow is horizontal on desktop and vertical on mobile
- ledger is readable without losing labels
- no console/page errors
- native scrolling remains intact
```

- [ ] **Step 5: Fix only evidence-backed defects and rerun affected tests**

For each visual/runtime defect, use the systematic-debugging workflow before patching. Do not add decorative features during QA.

- [ ] **Step 6: Run the full verification matrix again after the last fix**

All checks must be green on the final commit before PR merge.

- [ ] **Step 7: Commit final QA fixes, if any**

```bash
git add <only-files-changed-by-verified-fixes>
git commit -m "fix(web): polish Living Archive QA"
```

- [ ] **Step 8: Open PR to `main`, review diff, and merge only on green CI**

PR summary must call out:

```text
- three-act Living Research Archive
- sticky four-state Case 001
- SVG/CSS Evidence Thread
- no new motion dependency
- editorial Method Index + pack dossiers
- connected four-movement workflow
- audit-style Evidence Ledger
- mobile + reduced-motion-specific compositions
- CI and rendered QA evidence
```

After merge, use the production deployment for final visual QA as already approved for this pre-launch project.

---

## Plan Self-Review

- Spec coverage: all 20 spec sections map to Tasks 1–8; performance/accessibility/responsive requirements are explicit in component and QA tasks.
- Placeholder scan: no TBD/TODO/later placeholders remain.
- Type consistency: Case stages use four fixed IDs; workflow uses exactly four movements; Evidence Thread consumes a MotionValue and never owns catalog data.
- Dependency consistency: no GSAP installation; all motion uses the existing `motion/react` dependency already present in `apps/web/package.json`.
- Scope consistency: no interior-page redesign, catalog schema change, CMS work, analytics work, custom cursor, or additional WebGL surface.
