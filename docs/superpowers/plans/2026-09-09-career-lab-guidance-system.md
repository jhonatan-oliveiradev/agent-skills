# Career Lab Guidance System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Career Lab self-explanatory by repairing the Assessments surface, adding a persistent Guide/Q&A, introducing first-run product orientation and deterministic next-action guidance, then applying contextual guidance and human-readable presentation across the workspace.

**Architecture:** Keep `CareerProfile` and all readiness/roadmap/assessment/evidence/market engines unchanged. Add a separate versioned local guidance state, pure presentation selectors, focused guidance components, and one new Guide route. Reuse existing engine outputs for all recommendations; do not duplicate career decision logic inside UI components.

**Tech Stack:** Next.js 16.3.x App Router, React 19, TypeScript, existing Career Lab providers/engines, CSS modules-by-route via global stylesheet imports, Vitest + Testing Library, GitHub Actions `Validate skills` as authoritative RED/GREEN evidence.

**Spec:** `docs/superpowers/specs/2026-09-09-career-lab-guidance-system-design.md`

## Global Constraints

- Do not change `CareerProfile` schema semantics or `schemaVersion: "1"`.
- Do not change readiness, roadmap, assessment, evidence or market engine semantics.
- Do not add cloud persistence, accounts, network-backed help, AI chat, or generative Q&A.
- Preserve existing public Career Lab routes; only add `/{locale}/career-lab/guide`.
- Preserve EN and PT-BR from the first implementation of every new user-facing surface.
- Keep guidance state separate from Career Profile import/export/reset semantics.
- Keep the editorial workbench identity: ledger/index rows, restrained color, structured typography, explicit state; no generic card-heavy dashboard.
- Do not change catalog, packs, release/versioning, dependency tree, installer behavior or distribution semantics.
- Treat GitHub as source of truth; make small semantic commits and use CI as completion evidence.
- Every task follows RED → minimal implementation → GREEN → spec review → quality review.
- No PR merge without explicit user authorization.

---

## File structure locked by this plan

### New files

- `apps/web/src/styles/career-assessments.css` — Assessments index-only visual language.
- `apps/web/src/lib/career/guidance-copy.ts` — localized product-guidance, Guide/Q&A, orientation and next-action copy.
- `apps/web/src/components/career/career-guide.tsx` — Guide page and deterministic Q&A.
- `apps/web/src/app/[locale]/(career)/career-lab/guide/page.tsx` — localized Guide route.
- `apps/web/src/styles/career-guidance.css` — Guide, next-action, orientation and section-guidance styling.
- `apps/web/src/lib/career/guidance-storage.ts` — versioned local guidance state persistence.
- `apps/web/src/components/career/career-guidance-provider.tsx` — guidance UI state ownership and first-run open policy.
- `apps/web/src/components/career/career-product-orientation.tsx` — accessible first-run/reopenable product orientation.
- `apps/web/src/lib/career/guidance.ts` — pure deterministic `getCareerNextAction(profile)` selector.
- `apps/web/src/components/career/career-next-action.tsx` — Overview recommendation surface.
- `apps/web/src/components/career/career-section-guidance.tsx` — compact contextual help block for working surfaces.
- `apps/web/src/lib/career/presentation.ts` — localized human-facing competency labels without changing canonical IDs.
- Focused tests adjacent to each new unit, named in the tasks below.

### Existing files intentionally modified

- `apps/web/src/components/career/assessment-list.tsx`
- `apps/web/src/app/[locale]/(career)/career-lab/assessments/page.tsx`
- `apps/web/src/lib/career/copy.ts`
- `apps/web/src/components/career/career-lab-shell.tsx`
- `apps/web/src/components/career/career-data-controls.tsx`
- `apps/web/src/app/[locale]/(career)/career-lab/layout.tsx`
- `apps/web/src/components/career/career-overview.tsx`
- `apps/web/src/components/career/career-roadmap.tsx`
- `apps/web/src/components/career/evidence-ledger.tsx`
- `apps/web/src/components/career/evidence-form.tsx` only if contextual copy cannot be placed at the surface boundary without duplication.
- `apps/web/src/components/career/market-ingestion.tsx`
- Existing focused regression tests for shell, roadmap, evidence and market where their public output changes.

---

## Slice 1 — Assessment visual foundation

### Task 1: Turn Assessments into a stateful editorial index

**Files:**
- Create: `apps/web/src/components/career/assessment-list.test.tsx`
- Modify: `apps/web/src/components/career/assessment-list.tsx`
- Modify: `apps/web/src/lib/career/copy.ts`
- Create: `apps/web/src/styles/career-assessments.css`
- Modify: `apps/web/src/app/[locale]/(career)/career-lab/assessments/page.tsx`

**Interfaces:**
- Consumes: `baselineAssessmentBlueprints`, `getAssessmentPresentation(blueprint, locale)`, `useCareerProfile()`.
- Produces: `AssessmentList({ locale, blueprints })` with progress summary and per-blueprint `not-started | completed` presentation; no engine mutations.

- [ ] **Step 1: Write the failing component tests**

Create tests that render `AssessmentList` inside `CareerProfileProvider` with an injected in-memory `CareerStorage`. Cover both locales and one completed assessment.

```tsx
it("renders baseline progress and actionable rows in pt-BR", async () => {
  render(
    <CareerProfileProvider storage={storageWith(profileWithCompletedAssessment("baseline-javascript"))}>
      <AssessmentList locale="pt-BR" blueprints={baselineAssessmentBlueprints} />
    </CareerProfileProvider>,
  );

  expect(await screen.findByRole("heading", { name: "Avaliações de baseline" })).toBeInTheDocument();
  expect(screen.getByText("1 de 6 concluídas")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /revisar javaScript/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /iniciar typeScript/i })).toBeInTheDocument();
  expect(screen.getAllByTestId("assessment-index-row")).toHaveLength(6);
});
```

Add an EN assertion for `1 of 6 completed`, `Review JavaScript`, and `Start TypeScript`.

- [ ] **Step 2: Commit the test-only RED and verify CI fails for the missing contracts**

Expected failing assertions: progress summary, status/action labels, and `assessment-index-row`. Root/catalog tests must remain green.

- [ ] **Step 3: Make `AssessmentList` profile-aware without changing assessment semantics**

Add `"use client"`, read `profile` from `useCareerProfile`, and derive completion by exact blueprint id + version:

```ts
const completedIds = new Set(
  (profile?.assessments ?? []).map(
    (assessment) => `${assessment.blueprintId}@${assessment.blueprintVersion}`,
  ),
);

const completedCount = blueprints.filter((blueprint) =>
  completedIds.has(`${blueprint.id}@${blueprint.version}`),
).length;
```

Render one ordered ledger row per blueprint with: index, localized title, localized dimension, status, and one link. A completed item links to the same canonical assessment route and uses `Review`; an incomplete item uses `Start`.

- [ ] **Step 4: Add concrete localized assessment-index copy**

Extend `careerLabCopy[locale].assessment` with these exact concepts:

```ts
indexEyebrow: "Baseline / evidence calibration",
indexBody: "Complete the required baselines to replace unknown capability states with evidence-backed levels.",
completedSummary: (done: number, total: number) => `${done} of ${total} completed`,
notStarted: "Not started",
completed: "Completed",
start: (title: string) => `Start ${title}`,
review: (title: string) => `Review ${title}`,
```

PT-BR:

```ts
indexEyebrow: "Baseline / calibração por evidências",
indexBody: "Conclua os baselines obrigatórios para substituir estados de capacidade desconhecidos por níveis sustentados por evidências.",
completedSummary: (done: number, total: number) => `${done} de ${total} concluídas`,
notStarted: "Não iniciada",
completed: "Concluída",
start: (title: string) => `Iniciar ${title}`,
review: (title: string) => `Revisar ${title}`,
```

- [ ] **Step 5: Add the dedicated Assessment visual system**

Create `career-assessments.css` with a constrained editorial hero, progress rule, and ledger rows. Required class contract:

```css
.career-assessment-list__hero {}
.career-assessment-list__progress {}
.career-assessment-index {}
.career-assessment-index__row {}
.career-assessment-index__meta {}
.career-assessment-index__action {}
```

Rows must use borders/rules and typography, not rounded cards. Add responsive rules that stack title/meta/action below 760px and preserve keyboard focus visibility through the existing convergence focus contract.

- [ ] **Step 6: Import the stylesheet only on the assessments route**

```tsx
import "@/styles/career-assessments.css";
```

- [ ] **Step 7: Verify GREEN**

Expected targeted result: all new assessment tests pass. Then require full `Validate skills` success on Ubuntu and Windows before review.

- [ ] **Step 8: Review and commit**

Spec review checks: no assessment engine changes, no route changes, EN/PT-BR present. Quality review checks semantic ordered list, visible status not color-only, responsive ledger, no raw-document appearance.

Commit message: `feat: redesign Career Lab assessments index`

---

## Slice 2 — Guide + Q&A + shell entry

### Task 2: Add the persistent Guide and deterministic Q&A

**Files:**
- Create: `apps/web/src/lib/career/guidance-copy.ts`
- Create: `apps/web/src/components/career/career-guide.tsx`
- Create: `apps/web/src/components/career/career-guide.test.tsx`
- Create: `apps/web/src/app/[locale]/(career)/career-lab/guide/page.tsx`
- Create: `apps/web/src/styles/career-guidance.css`

**Interfaces:**
- Produces: `careerGuidanceCopy[locale]` and `CareerGuide({ locale })`.
- Q&A uses static arrays and native `<details><summary>`; no provider or persistence dependency yet.

- [ ] **Step 1: Write the RED Guide tests**

Assert PT-BR renders `Comece aqui`, all five working areas, and the core Q&A headings. Assert EN renders `Start here` and `Why is my readiness 0%?`.

```tsx
expect(screen.getByRole("heading", { name: "Comece aqui" })).toBeInTheDocument();
expect(screen.getAllByTestId("career-guide-area")).toHaveLength(5);
expect(screen.getByText("Por que meu readiness está em 0%?")).toBeInTheDocument();
expect(screen.getAllByTestId("career-guide-question").length).toBeGreaterThanOrEqual(12);
```

- [ ] **Step 2: Commit the test-only RED and verify failure**

Expected: missing component/module/route contracts only.

- [ ] **Step 3: Create `careerGuidanceCopy` with complete deterministic content**

The exported shape must include:

```ts
{
  guide: {
    eyebrow: string;
    title: string;
    intro: string;
    startHereTitle: string;
    stages: readonly { id: "overview" | "roadmap" | "assessments" | "evidence" | "market"; title: string; purpose: string; when: string; done: string; after: string }[];
    qaTitle: string;
    questions: readonly { id: string; question: string; answer: string }[];
    restartTitle: string;
    restartBody: string;
    restartAction: string;
  };
}
```

Include all twelve questions from the spec in EN/PT-BR. Answers must be operational and describe actual local-first behavior; no marketing language.

- [ ] **Step 4: Build `CareerGuide`**

Use an editorial header, a five-row operating-model section, native disclosure Q&A, and a restart-orientation section that initially renders explanatory copy only. Add `data-testid="career-guide-area"` and `data-testid="career-guide-question"` to stable semantic wrappers used by tests.

- [ ] **Step 5: Add the localized Guide route**

```tsx
export default async function GuidePage({ params }: PageProps) {
  const locale = await resolveLocale(params);
  return <CareerGuide locale={locale} />;
}
```

Import `career-guidance.css` from the Guide page for this slice.

- [ ] **Step 6: Style Guide as an editorial manual, not a documentation dump**

Required classes:

```css
.career-guide__hero {}
.career-guide__loop {}
.career-guide__area {}
.career-guide__qa details {}
.career-guide__restart {}
```

Use narrow readable line lengths for explanatory copy and full-width ruled rows for the five areas.

- [ ] **Step 7: Verify GREEN and commit**

Require targeted Guide tests + full CI. Commit: `feat: add Career Lab guide and Q&A`

### Task 3: Add Guide to shell and demote local-data utilities

**Files:**
- Modify: `apps/web/src/components/career/career-lab-shell.tsx`
- Modify: `apps/web/src/components/career/career-data-controls.tsx`
- Modify: `apps/web/src/components/career/career-lab-shell.test.tsx`
- Modify: `apps/web/src/lib/career/copy.ts`
- Modify: `apps/web/src/styles/career-convergence.css`
- Modify: `apps/web/src/styles/career-shell-separation.css` only if shell-level spacing cannot remain scoped in convergence CSS.

**Interfaces:**
- Consumes: `usePathname()` and existing five canonical workflow routes.
- Produces: active-route semantics for numbered nav, an unnumbered Guide utility link, compact local-first indicator, secondary data-controls surface.

- [ ] **Step 1: Add RED shell assertions**

For a mocked pathname `/pt-BR/career-lab/guide`, assert:

```tsx
expect(screen.getByRole("link", { name: "Guia" })).toHaveAttribute("aria-current", "page");
expect(screen.getByRole("navigation", { name: "Career Lab" }).querySelectorAll("ol > li")).toHaveLength(5);
expect(screen.getByText("Local-first")).toBeInTheDocument();
```

For `/pt-BR/career-lab/roadmap`, assert Roadmap has `aria-current="page"` and Guide does not.

- [ ] **Step 2: Commit RED and verify expected failures**

- [ ] **Step 3: Add route-aware shell navigation**

Use `usePathname`. Exact-match Overview; prefix-match subroutes for Roadmap/Assessments/Evidence/Market; Guide is outside the numbered `<ol>`.

```ts
function routeIsCurrent(pathname: string, href: string, index: number): boolean {
  if (index === 0) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}
```

- [ ] **Step 4: Add compact shell copy**

Add EN/PT-BR keys:

```ts
guide: "Guide" / "Guia"
localFirstIndicator: "Local-first" / "Local-first"
utilities: "Profile utilities" / "Utilitários do perfil"
```

Keep the existing long summary available as explanatory text via visually secondary copy or `aria-describedby`; do not remove the local-storage explanation from the product entirely.

- [ ] **Step 5: Demote data controls**

Refactor `CareerDataControls` to a `<details>` utility disclosure while preserving export/import/reset behavior and existing accessible status messages:

```tsx
<details className="career-data-controls">
  <summary>{copy.localData}</summary>
  <div className="career-data-controls__actions">...</div>
</details>
```

Apply a distinct destructive class to the reset trigger/confirmation. Do not change serialization or migration logic.

- [ ] **Step 6: Style the shell hierarchy**

Guide should be visible but secondary to the numbered workflow. Local data controls should no longer visually compete with primary navigation. Maintain current desktop single-rail behavior and existing responsive collapse.

- [ ] **Step 7: GREEN, regression review, commit**

Verify shell tests, data-control tests, and full CI. Commit: `feat: add Career Lab guide navigation`

---

## Slice 3 — Product onboarding first run

### Task 4: Add versioned guidance state and accessible product orientation

**Files:**
- Create: `apps/web/src/lib/career/guidance-storage.ts`
- Create: `apps/web/src/lib/career/guidance-storage.test.ts`
- Create: `apps/web/src/components/career/career-guidance-provider.tsx`
- Create: `apps/web/src/components/career/career-guidance-provider.test.tsx`
- Create: `apps/web/src/components/career/career-product-orientation.tsx`
- Create: `apps/web/src/components/career/career-product-orientation.test.tsx`
- Modify: `apps/web/src/app/[locale]/(career)/career-lab/layout.tsx`
- Modify: `apps/web/src/components/career/career-lab-shell.tsx`
- Modify: `apps/web/src/components/career/career-guide.tsx`
- Modify: `apps/web/src/lib/career/guidance-copy.ts`
- Modify: `apps/web/src/styles/career-guidance.css`

**Interfaces:**
- Produces:

```ts
export type OrientationStatus = "unseen" | "completed" | "skipped";
export type CareerGuidanceState = Readonly<{ orientationStatus: OrientationStatus }>;
export interface CareerGuidanceStorage {
  load(): Promise<CareerGuidanceState>;
  save(state: CareerGuidanceState): Promise<void>;
}
```

- `CareerGuidanceProvider` exposes:

```ts
{
  status: "hydrating" | "ready" | "error";
  orientationStatus: OrientationStatus;
  isOrientationOpen: boolean;
  openOrientation(): void;
  completeOrientation(): Promise<void>;
  skipOrientation(): Promise<void>;
  closeOrientation(): void;
}
```

- [ ] **Step 1: Write storage RED tests**

Cover missing key → `unseen`, valid stored state, invalid JSON → `unseen`, and save to exact key `career-lab:guidance:v1`.

- [ ] **Step 2: Write provider/orientation RED tests**

Cover:

```tsx
it("auto-opens once when a profile exists and guidance is unseen", ...)
it("does not auto-open when status is completed", ...)
it("skip persists skipped", ...)
it("Guide can reopen orientation after completion", ...)
it("reopened orientation can close without changing a terminal status", ...)
```

Orientation test must assert `role="dialog"`, `aria-modal="true"`, five stages, Skip and Complete actions, initial focus inside the dialog, and Escape closes without profile mutation.

- [ ] **Step 3: Commit RED and verify expected failures**

- [ ] **Step 4: Implement browser guidance storage**

Use `window.localStorage` behind a factory invoked only client-side. Parsing accepts only the three exact statuses; every other value returns `{ orientationStatus: "unseen" }`.

- [ ] **Step 5: Implement `CareerGuidanceProvider`**

Inject optional storage for tests. Consume `useCareerProfile()` so that after both profile hydration and guidance hydration are ready:

```ts
if (profile && orientationStatus === "unseen") {
  setOrientationOpen(true);
}
```

Guard auto-open with a ref so rerenders do not reopen after transient close in the same session. `completeOrientation` persists `completed`; `skipOrientation` persists `skipped`. `openOrientation` is always transient.

- [ ] **Step 6: Wire provider into the Career Lab layout**

Nesting must remain:

```tsx
<CareerProfileProvider>
  <CareerGuidanceProvider>
    <CareerLabShell locale={locale}>{children}</CareerLabShell>
  </CareerGuidanceProvider>
</CareerProfileProvider>
```

Import `career-guidance.css` from the shared Career Lab layout now that orientation can render on every route; remove any duplicate route-only import if necessary.

- [ ] **Step 7: Implement `CareerProductOrientation`**

Render a modal dialog-style surface with five concise stages from `careerGuidanceCopy`. Use a focusable heading or first action ref and `useEffect` to move focus when opened. Add a keydown listener for Escape. No spotlight overlays and no page-element targeting.

- [ ] **Step 8: Render orientation from the shell and wire Guide restart**

`CareerLabShell` renders one `CareerProductOrientation locale={locale}` after its content root. `CareerGuide` obtains `openOrientation` and turns the restart section action into a button.

- [ ] **Step 9: GREEN and regression verification**

Verify guidance tests, profile import/export/reset tests, shell tests and full CI. Explicitly assert exported Career Profile JSON contains no guidance state.

- [ ] **Step 10: Review and commit**

Accessibility review: keyboard access, focus management, Escape, text not color-dependent, reduced-motion compatible. Commit: `feat: add Career Lab product orientation`

---

## Slice 4 — Deterministic next action

### Task 5: Derive and render one current recommendation on Overview

**Files:**
- Create: `apps/web/src/lib/career/guidance.ts`
- Create: `apps/web/src/lib/career/guidance.test.ts`
- Create: `apps/web/src/components/career/career-next-action.tsx`
- Create: `apps/web/src/components/career/career-next-action.test.tsx`
- Modify: `apps/web/src/components/career/career-overview.tsx`
- Modify: `apps/web/src/lib/career/guidance-copy.ts`
- Modify: `apps/web/src/styles/career-guidance.css`

**Interfaces:**

```ts
export type CareerNextAction =
  | { kind: "complete-baseline"; blueprintId: string; href: string }
  | { kind: "review-roadmap"; href: string }
  | { kind: "produce-evidence"; milestoneId: string; competencyIds: readonly string[]; href: string }
  | { kind: "add-market-sample"; href: string }
  | { kind: "continue-roadmap"; milestoneId: string; href: string };

export function getCareerNextAction(profile: CareerProfile, locale: Locale): CareerNextAction;
```

The selector may call existing `getRoleMap`, `buildRoadmap`, `getRoadmapMilestoneViews`, `getRoadmapMilestone` and inspect `baselineAssessmentBlueprints`. It must not write profile state.

- [ ] **Step 1: Write next-action precedence RED tests**

Use table-driven fixtures for exactly these states:

```ts
[
  ["baseline missing", "complete-baseline"],
  ["all baseline complete and no current focus", "review-roadmap"],
  ["current focus has evidence gaps", "produce-evidence"],
  ["focus evidence satisfied but no market sample", "add-market-sample"],
  ["market exists and focus remains", "continue-roadmap"],
]
```

Also deep-freeze/serialize the input before and after to prove no mutation.

- [ ] **Step 2: Write Overview component RED tests**

Assert the first recommendation for a fresh profile is a link to the next missing baseline and includes a reason explaining that unknown competency state will be replaced by evidence-backed state.

- [ ] **Step 3: Commit RED and verify failure**

- [ ] **Step 4: Implement the pure selector using engine outputs**

Baseline completion is exact blueprint id + version. Current focus comes from `buildRoadmap`. Evidence need comes from the current `RoadmapMilestoneView.evidenceGaps`; do not manually reimplement evidence-class ranking.

- [ ] **Step 5: Add localized next-action presentation copy**

`careerGuidanceCopy[locale].nextAction` must expose a label (`Now` / `Agora`), title/reason builders per `kind`, and CTA labels. Resolve milestone title using `getRoadmapMilestone(milestoneId).title[locale]`; resolve assessment title with `getAssessmentPresentation`.

- [ ] **Step 6: Implement `CareerNextAction` and place it in Overview**

Render directly below the existing overview hero/grid state summary and before competency ledgers. Use an `<aside aria-labelledby="career-next-action-title">` with one dominant destination link.

- [ ] **Step 7: Replace raw current milestone ID in the Overview focus card**

Where `effectiveRoadmap.currentFocusMilestoneId` currently renders directly, resolve the localized roadmap catalog title. Keep the raw ID only as optional metadata if required for debugging, never as the main `strong` text.

- [ ] **Step 8: GREEN, quality review, commit**

Verify selector/component tests and full CI. Commit: `feat: guide Career Lab next action`

---

## Slice 5 — Contextual guidance on working surfaces

### Task 6: Explain Roadmap, Evidence and Market in place without changing engines

**Files:**
- Create: `apps/web/src/components/career/career-section-guidance.tsx`
- Create: `apps/web/src/components/career/career-section-guidance.test.tsx`
- Modify: `apps/web/src/components/career/career-roadmap.tsx`
- Modify: `apps/web/src/components/career/career-roadmap.test.tsx`
- Modify: `apps/web/src/components/career/evidence-ledger.tsx`
- Modify: `apps/web/src/components/career/evidence-ledger.test.tsx`
- Modify: `apps/web/src/components/career/market-ingestion.tsx`
- Modify: `apps/web/src/components/career/market-ingestion.test.tsx`
- Modify: `apps/web/src/lib/career/guidance-copy.ts`
- Modify: `apps/web/src/styles/career-guidance.css`
- Modify: `apps/web/src/styles/career-learning-evidence.css`
- Modify: `apps/web/src/styles/career-market.css`
- Modify: `apps/web/src/styles/career-roadmap.css` only for local integration spacing.

**Interfaces:**

```ts
export function CareerSectionGuidance(props: Readonly<{
  eyebrow: string;
  title: string;
  body: string;
  action?: Readonly<{ href: Route; label: string }>;
}>): ReactNode;
```

- [ ] **Step 1: Write RED guidance tests for all three surfaces**

Roadmap: current milestone page includes text explaining why the milestone is current and where evidence is registered.

Evidence empty state: includes a plain-language definition of evidence and one concrete accepted-artifact example.

Market: renders exactly three ingestion method headings and marks pasted-description as the primary method.

- [ ] **Step 2: Commit RED and verify expected failures**

- [ ] **Step 3: Implement `CareerSectionGuidance`**

Keep it visually compact and rule-based. It may optionally render one link but must not own product state.

- [ ] **Step 4: Add Roadmap guidance at the current-focus boundary**

Use the existing current milestone/view data already available in `CareerRoadmap`. Copy must state:

- current because it is the highest-priority available milestone under current gaps;
- completion requires its capability + evidence requirements;
- resulting proof should be registered in Evidence.

Do not add new logic to choose the milestone.

- [ ] **Step 5: Strengthen Evidence empty-state guidance**

Before the detailed evidence contract, explain in plain language that evidence is an inspectable artifact tied to the current roadmap focus. When ledger is empty, replace the bare absence message with a structured empty state that includes an example such as a repository/PR/test report and explains provenance.

- [ ] **Step 6: Reframe Market ingestion into three explicit methods**

Keep all existing ingestion behavior. Reorder presentation so pasted description is primary because URL fetch can fail under CORS/auth/anti-bot constraints already acknowledged by the product. Render:

```text
01 / Paste job description — primary
02 / Fetch by URL — secondary convenience
03 / Import compatible analysis JSON — secondary expert path
```

Each method gets its own heading and short explanation. Existing inputs/buttons keep their handlers and validation.

- [ ] **Step 7: Apply responsive styling**

Evidence empty state must use the existing two-column surface effectively rather than leaving an unbounded blank ledger column. Market method hierarchy must collapse to one column on narrow widths.

- [ ] **Step 8: GREEN, regression review, commit**

Run all roadmap/evidence/market focused suites plus full CI. Commit: `feat: add contextual Career Lab guidance`

---

## Slice 6 — Overview humanization and final visual polish

### Task 7: Humanize competency presentation and consolidate Overview capability reading

**Files:**
- Create: `apps/web/src/lib/career/presentation.ts`
- Create: `apps/web/src/lib/career/presentation.test.ts`
- Create: `apps/web/src/components/career/career-overview-guidance.test.tsx`
- Modify: `apps/web/src/components/career/career-overview.tsx`
- Modify: `apps/web/src/lib/career/guidance-copy.ts`
- Modify: `apps/web/src/styles/career-convergence.css`

**Interfaces:**

```ts
export function getCompetencyLabel(competencyId: string, locale: Locale): string;
```

For canonical known IDs, EN labels come from `competencyDefinitions.title`; PT-BR uses an explicit localized map. Unknown IDs fall back to the original string, preserving forward compatibility.

- [ ] **Step 1: Write RED presentation tests**

Assert at minimum:

```ts
expect(getCompetencyLabel("programming-javascript", "pt-BR")).toBe("JavaScript");
expect(getCompetencyLabel("ui-component-modeling", "pt-BR")).toBe("Modelagem de componentes de UI");
expect(getCompetencyLabel("unknown-future-id", "pt-BR")).toBe("unknown-future-id");
```

- [ ] **Step 2: Write Overview RED tests for human-facing labels**

Assert the rendered Overview contains `JavaScript` as the primary row label while `programming-javascript` remains secondary metadata. Assert capability state and blocking-gap type are represented in one capability ledger rather than two visually duplicated primary lists.

- [ ] **Step 3: Commit RED and verify failures**

- [ ] **Step 4: Implement localized presentation helper**

Use `competencyDefinitions.find(...)` for EN canonical titles and a complete PT-BR record keyed by `CompetencyId`. Do not modify canonical competency definitions or engine IDs.

- [ ] **Step 5: Consolidate Overview competency + gap display**

Replace the separate primary `competencyStates` and `blockingGaps` ledgers with one `career-overview__capability-ledger`. For each profile competency row render:

- human label;
- technical `<code>` ID as secondary metadata;
- level/confidence;
- blocking gap indicator only when the ID is in `readiness.blockingGaps`;
- gap kind `capability` or `evidence` using the existing readiness arrays.

Do not change readiness calculation.

- [ ] **Step 6: Tighten empty metrics and spacing**

When evidence/market counts are empty, make their cards use existing next-action language and Guide links where appropriate rather than expanding into multiple new CTAs. Preserve the overview hero and score proportions validated earlier.

- [ ] **Step 7: Responsive and accessibility pass**

At desktop, ledger columns align and technical IDs remain subordinate. Below 760px, each capability row stacks label/state/gap metadata without horizontal overflow. Ensure headings remain hierarchical and gap semantics do not rely on accent color.

- [ ] **Step 8: GREEN and commit**

Require focused tests + full CI. Commit: `refactor: humanize Career Lab capability overview`

### Task 8: Final cross-surface verification and PR preparation

**Files:**
- Modify only tests/styles if verification finds a scoped defect; no feature expansion.
- Update implementation-plan checkboxes as execution evidence if project convention permits plan progress commits.

**Interfaces:**
- Produces no new runtime API.

- [ ] **Step 1: Run full repository validation**

Expected commands for an engineer with the checkout:

```bash
npm test
npm run validate
npm run web:test
npm run web:typecheck
npm run web:lint
npm run web:build
```

In connector-driven execution, GitHub Actions `Validate skills` is the authoritative evidence for the same gates on Ubuntu and Windows.

- [ ] **Step 2: Verify regression contracts**

Confirm:

- Career Profile export JSON contains only `CareerProfile` schema data;
- import of existing profile fixtures still succeeds;
- reset profile semantics remain unchanged;
- all existing `/career-lab`, `/roadmap`, `/assessments`, `/evidence`, `/market` routes build;
- `/career-lab/guide` builds in EN and PT-BR;
- no catalog/version/pack/installer files changed.

- [ ] **Step 3: Perform manual visual QA checkpoints**

Collect user-visible screenshots at desktop wide, narrow desktop/tablet and mobile for:

- Overview with incomplete baseline and next action;
- Assessments index with mixed completed/incomplete states;
- Guide/Q&A;
- first-run orientation;
- Roadmap current focus;
- Evidence empty state;
- Market empty state with three methods.

Do not call visual QA complete from CI alone.

- [ ] **Step 4: Spec review**

Compare the final diff against every acceptance criterion in the design spec. Reject any implementation that introduces AI/network help, writes guidance state into Career Profile, duplicates engine logic, or converts the product into a card-heavy dashboard.

- [ ] **Step 5: Quality review**

Review accessibility, responsive behavior, localization, state naming, storage failure behavior, technical-ID fallbacks, and destructive reset hierarchy.

- [ ] **Step 6: Prepare PR with evidence**

PR body must include RED run(s), final GREEN run, head SHA, base SHA, changed-file scope, test counts reported by CI, visual-QA status, spec review and quality review. Keep the PR unmerged until explicit authorization.

---

## Dependency order

The execution order is mandatory because later tasks consume earlier public contracts:

`Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6 → Task 7 → Task 8`

The six product slices map to tasks as follows:

- Slice 1: Task 1
- Slice 2: Tasks 2–3
- Slice 3: Task 4
- Slice 4: Task 5
- Slice 5: Task 6
- Slice 6: Tasks 7–8

## Self-review results

### Spec coverage

- Assessment repair: Task 1.
- Guide/Q&A and permanent help entry: Tasks 2–3.
- Separate first-run orientation + reopen: Task 4.
- Separate versioned guidance storage: Task 4.
- Deterministic next action using existing engines: Task 5.
- Roadmap/Evidence/Market contextual guidance: Task 6.
- Human-readable labels and Overview deduplication: Task 7.
- Local-first/data utility hierarchy: Task 3.
- Accessibility and EN/PT-BR: enforced per task and Task 8.
- Visual QA across key screens: Task 8.
- Non-goals and regression protection: Global Constraints + Task 8.

No design-spec requirement is left without an implementation task.

### Placeholder scan

The plan contains no unresolved implementation placeholders. All new public files, component/function names, guidance-state values, storage key, route and major test contracts are fixed above.

### Type consistency

- Orientation state is consistently `"unseen" | "completed" | "skipped"`.
- Storage key is consistently `career-lab:guidance:v1`.
- Guide route is consistently `/{locale}/career-lab/guide`.
- `getCareerNextAction(profile, locale)` returns the discriminated union defined in Task 5.
- `CareerGuidanceProvider` remains separate from `CareerProfileProvider` and never extends `CareerProfile`.
