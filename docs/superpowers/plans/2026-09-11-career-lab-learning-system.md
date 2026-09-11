# Career Lab Learning System Implementation Plan

> **Execution:** use the Superpowers task-by-task workflow. Prefer `subagent-driven-development` where the runtime supports it; otherwise preserve the same isolation/review discipline inline. Use TDD for every behavior change and `verification-before-completion` before claiming a slice ready.

**Goal:** evolve Career Lab into an evidence-led developer career development system that can diagnose capability gaps, recommend reviewed microlearning, track study separately from proficiency, and hand the user back to assessment/evidence to prove what was learned.

**Spec:** `docs/superpowers/specs/2026-09-11-career-lab-learning-system-design.md`

**Current base:** `main` at `899dd7641b6a56b1839e675599b9207c459e7867` when this plan was authored. Re-fetch `main` before every slice and use the latest approved/merged head as the branch base.

**Tech:** Next.js 16.3.1, React 19.2.8, TypeScript 5.9, Vitest 4, Testing Library, existing IndexedDB `CareerStorage`, plain Career Lab CSS. Add no runtime dependency.

## Non-negotiable contracts

- Preserve Agent Skills Studio public version `1.1.0`.
- Preserve all existing Career Lab public URLs; only add `/{locale}/career-lab/learning` and `/{locale}/career-lab/learning/[noteId]`.
- Keep Career Lab local-first. No auth, cloud sync, billing, server-side profile storage, runtime model API, or background personal-data processing.
- Runtime AI never generates lessons and never chooses recommendations.
- Study progress never creates `EvidenceRecord`, changes competency level/confidence, raises readiness directly, or completes a roadmap milestone by itself.
- Only `reviewStatus: "reviewed"` modules are available or recommendable.
- EN and PT-BR are required for all first-party learning content.
- Existing `roadmap.supportingActivityId` stops being learning state once Profile v2 is active; the new source of truth is `CareerProfile.learningProgress`.
- UI remains editorial/paper-like. No XP, streaks, badges, certificates, course-marketplace treatment, or proficiency-looking study percentages.
- Status is never color-only. Preserve keyboard operation, focus visibility, semantic headings, reduced motion, and accessible source/action names.
- Repository writes, branches, commits, PRs, and CI inspection should use the GitHub connector when supported; do not substitute local Git CLI for supported connector operations.
- Each implementation PR remains Draft until GREEN + spec review + quality review + manual visual QA where relevant.
- Never merge an implementation PR without a separate explicit user authorization.

## Canonical domain boundaries

Create these dedicated modules rather than expanding unrelated files:

- `apps/web/src/lib/career/learning-types.ts` — `LearningNote`, `LearningModule`, `LearningSource`, localized learning primitives.
- `apps/web/src/lib/career/learning-source-catalog.ts` — source records + centralized review windows.
- `apps/web/src/lib/career/learning-catalog.ts` — Core Note/module content.
- `apps/web/src/lib/career/learning-validation.ts` — catalog/source/domain validation.
- `apps/web/src/lib/career/learning-progress.ts` — pure Profile v2 study-state mutations/selectors.
- `apps/web/src/lib/career/learning-recommendations.ts` — deterministic learning/proof recommendations.
- `apps/web/src/lib/career/learning-copy.ts` — Learning-surface EN/PT-BR product copy.

The existing `assessment.ts`, `readiness.ts`, and `roadmap-engine.ts` remain the sources of truth for assessment, proficiency/readiness, and milestone status. Do not duplicate those calculations in Learning code.

## Slice strategy

Implement seven independent PRs. After each PR is verified and reviewed, stop for explicit merge authorization; the next slice starts from the latest merged `main`.

1. `feat/career-learning-foundation-v2`
2. `feat/career-learning-recommendations`
3. `feat/career-learning-surfaces`
4. `feat/career-assessment-result-v2`
5. `feat/career-learning-overview-roadmap`
6. `feat/career-learning-content-coverage`
7. `fix/career-learning-final-qa`

---

# Slice 1 — Learning contracts, Profile v2, progress semantics

## Task 1.1 — Define learning/source contracts and governance validation

**Create**
- `apps/web/src/lib/career/learning-types.ts`
- `apps/web/src/lib/career/learning-source-catalog.ts`
- `apps/web/src/lib/career/learning-validation.ts`
- `apps/web/src/lib/career/learning-validation.test.ts`

**Modify**
- `apps/web/src/lib/career/learning-catalog.ts`
- `apps/web/src/lib/career/learning.ts` only as a temporary compatibility façade for legacy consumers; do not remove its existing exports in Slice 1.

### Public types

Implement exactly:

```ts
export type LocalizedText = Readonly<Record<Locale, string>>;
export type LocalizedList = Readonly<Record<Locale, readonly string[]>>;

export interface LocalizedCodeExample {
  readonly language: string;
  readonly code: LocalizedText;
}

export interface LocalizedPractice {
  readonly id: string;
  readonly prompt: LocalizedText;
}

export interface LearningModule {
  readonly id: string;
  readonly criterionId: string;
  readonly level: ProficiencyLevel;
  readonly title: LocalizedText;
  readonly estimatedMinutes: number;
  readonly contentVersion: string;
  readonly reviewStatus: "draft" | "reviewed";
  readonly reviewedAt: string;
  readonly primarySourcePolicy: "required" | "not-available";
  readonly primarySourceReason?: LocalizedText;
  readonly understand: LocalizedText;
  readonly example?: LocalizedCodeExample;
  readonly commonMistake: LocalizedText;
  readonly practice: LocalizedPractice;
  readonly consolidationCriteria: LocalizedList;
  readonly sourceIds: readonly string[];
}

export interface LearningNote {
  readonly id: string;
  readonly competencyId: CompetencyId;
  readonly title: LocalizedText;
  readonly summary: LocalizedText;
  readonly objective: LocalizedText;
  readonly estimatedMinutes: number;
  readonly modules: readonly LearningModule[];
}

export interface LearningSource {
  readonly id: string;
  readonly title: string;
  readonly publisher: string;
  readonly url: string;
  readonly authority: "primary" | "recognized-institutional" | "recognized-pedagogical";
  readonly volatility: "high" | "medium" | "low";
  readonly reviewedAt: string;
  readonly supportsCriterionIds: readonly string[];
}
```

Expose from `learning-validation.ts`:

```ts
validateLearningCatalog(
  notes: readonly LearningNote[],
  sources: readonly LearningSource[],
): readonly LearningNote[];

getLearningNote(noteId: string): LearningNote | undefined;
getLearningNoteByCompetency(competencyId: CompetencyId): LearningNote | undefined;
getReviewedLearningModules(note: LearningNote): readonly LearningModule[];
getLearningModuleByCriterion(criterionId: string):
  | Readonly<{ note: LearningNote; module: LearningModule }>
  | undefined;
```

`learning-source-catalog.ts` also exports:

```ts
export const LEARNING_REVIEW_WINDOWS_DAYS = {
  high: 90,
  medium: 180,
  low: 365,
} as const;
```

Freshness is maintenance metadata only. A stale reviewed module remains usable until a maintainer explicitly changes its review status.

### RED

Add tests for all of these failures, using small local fixtures rather than production catalog completeness:

```ts
it("rejects a criterion that does not belong to the note competency", ...);
it("rejects duplicate note ids", ...);
it("rejects duplicate module ids across the catalog", ...);
it("rejects duplicate practice ids across the catalog", ...);
it("rejects duplicate source ids", ...);
it("rejects missing EN or PT-BR required content", ...);
it("rejects invalid reviewedAt timestamps", ...);
it("rejects reviewed modules with unknown source ids", ...);
it("rejects a source that claims support for an unknown criterion", ...);
it("requires a primary source when primarySourcePolicy is required", ...);
it("requires primarySourceReason in both locales when primarySourcePolicy is not-available", ...);
it("filters draft modules out of getReviewedLearningModules", ...);
```

Run:

```bash
npm --prefix apps/web test -- src/lib/career/learning-validation.test.ts
```

Expected RED: missing modules/contracts.

### GREEN

Validation rules:
- note competency must be a canonical `CompetencyId`;
- module `criterionId` must exist on that exact competency and `module.level` must equal the criterion level;
- IDs are non-empty and globally unique within their respective namespace;
- `estimatedMinutes` is positive finite;
- reviewed modules require valid `reviewedAt`, non-empty sources, and complete EN/PT-BR pedagogical content;
- `primarySourcePolicy: "required"` requires at least one referenced `authority: "primary"` source that supports the module criterion;
- `primarySourcePolicy: "not-available"` requires localized `primarySourceReason` and still requires at least one reviewed source;
- draft modules may be structurally authored but are never returned by reviewed-content selectors.

Run:

```bash
npm --prefix apps/web test -- src/lib/career/learning-validation.test.ts src/lib/career/learning.test.ts src/lib/career/learning-integration-regression.test.ts
npm run web:typecheck
```

Commit atomically through the GitHub connector with semantic message:

`feat: define curated career learning contracts`

## Task 1.2 — Upgrade Career Profile to schema v2

**Modify**
- `apps/web/src/lib/career/types.ts`
- `apps/web/src/lib/career/profile.ts`
- `apps/web/src/lib/career/schema.ts`
- `apps/web/src/lib/career/migrations.ts`
- `apps/web/src/lib/career/storage.ts`
- `apps/web/src/lib/career/profile.test.ts`
- `apps/web/src/lib/career/schema.test.ts`
- `apps/web/src/lib/career/storage.test.ts`
- `apps/web/src/components/career/career-data-controls.test.tsx`

Add exactly:

```ts
export interface LearningProgressRecord {
  readonly noteId: string;
  readonly startedAt: string;
  readonly updatedAt: string;
  readonly currentModuleId: string | null;
  readonly completedModuleIds: readonly string[];
  readonly completedPracticeIds: readonly string[];
  readonly completedAt: string | null;
}
```

Change `CareerProfile.schemaVersion` to `"2"` and add required `learningProgress: readonly LearningProgressRecord[]`.

### RED

Add concrete tests:

```ts
it("creates schema v2 profiles with empty learning progress", () => {
  const profile = createEmptyCareerProfile({
    targetRole: "frontend-developer",
    targetMarket: "br",
    now: "2026-09-11T12:00:00.000Z",
  });
  expect(profile.schemaVersion).toBe("2");
  expect(profile.learningProgress).toEqual([]);
});

it("migrates v1 to v2 with empty learning progress", () => {
  const v1 = {
    schemaVersion: "1",
    targetRoles: ["frontend-developer"],
    targetMarkets: ["br"],
    weeklyStudyHours: 8,
    competencies: [],
    assessments: [],
    roadmap: { milestoneIds: [], currentFocusMilestoneId: null, supportingActivityId: null },
    evidence: [],
    marketSamples: [],
    decisionRecords: [],
    createdAt: "2026-09-01T12:00:00.000Z",
    updatedAt: "2026-09-01T12:00:00.000Z",
  };
  expect(migrateCareerProfile(v1)).toEqual({
    ...v1,
    schemaVersion: "2",
    learningProgress: [],
  });
});
```

Also add explicit rejection tests for:
- duplicate `noteId` progress records;
- duplicate completed module/practice IDs inside one record;
- invalid `startedAt`, `updatedAt`, or non-null `completedAt`;
- `updatedAt` before `startedAt`;
- v2 profile missing `learningProgress`.

Add one export/import test in `career-data-controls.test.tsx` proving a non-empty v2 `learningProgress` survives `serializeCareerProfile` → JSON parse → `migrateCareerProfile`.

Run RED:

```bash
npm --prefix apps/web test -- src/lib/career/profile.test.ts src/lib/career/schema.test.ts src/lib/career/storage.test.ts src/components/career/career-data-controls.test.tsx
```

### GREEN

- `parseCareerProfile` parses only schema v2.
- `migrateCareerProfile` accepts v2 by parsing it and accepts v1 by copying only known v1 fields, adding `schemaVersion: "2"` + `learningProgress: []`, then parsing v2.
- Keep `CAREER_DB_VERSION = 1`; no IndexedDB structural upgrade is necessary.
- `createEmptyCareerProfile` emits v2.

Run:

```bash
npm --prefix apps/web test -- src/lib/career/profile.test.ts src/lib/career/schema.test.ts src/lib/career/storage.test.ts src/components/career/career-data-controls.test.tsx
npm run web:typecheck
```

Commit via GitHub connector:

`feat: add Career Profile v2 learning progress`

## Task 1.3 — Implement pure learning-progress semantics

**Create**
- `apps/web/src/lib/career/learning-progress.ts`
- `apps/web/src/lib/career/learning-progress.test.ts`

**Modify**
- `apps/web/src/lib/career/learning-integration-regression.test.ts`

Expose:

```ts
getLearningProgress(profile: CareerProfile, noteId: string): LearningProgressRecord | undefined;
getLearningState(profile: CareerProfile, note: LearningNote): "not-started" | "in-progress" | "studied";
startLearningModule(profile: CareerProfile, noteId: string, moduleId: string, now?: string): CareerProfile;
completeLearningPractice(profile: CareerProfile, noteId: string, moduleId: string, practiceId: string, now?: string): CareerProfile;
completeLearningModule(profile: CareerProfile, noteId: string, moduleId: string, now?: string): CareerProfile;
```

All helpers must validate note/module/practice references against the curated learning domain and update immutably.

### RED

Use a local two-module reviewed note fixture in the test. Write the full completion test, not a placeholder:

```ts
it("marks a note studied only after every reviewed fixture module is complete", () => {
  const note = fixtureNoteWithReviewedModules(["fixture-foundation", "fixture-developing"]);
  let profile = fixtureProfile();

  profile = completeFixtureModule(profile, note, "fixture-foundation", "2026-09-11T13:00:00.000Z");
  expect(getFixtureLearningState(profile, note)).toBe("in-progress");
  expect(profile.learningProgress[0]?.completedAt).toBeNull();

  profile = completeFixtureModule(profile, note, "fixture-developing", "2026-09-11T13:10:00.000Z");
  expect(getFixtureLearningState(profile, note)).toBe("studied");
  expect(profile.learningProgress[0]?.completedAt).toBe("2026-09-11T13:10:00.000Z");
});
```

The actual committed test may expose the note fixture through a test-only helper in `learning-progress.test.ts`; do not add a production export just to support the test.

Also write:

```ts
it("changes only learningProgress and updatedAt when study is completed", ...);
it("is idempotent when the same practice/module is completed twice", ...);
it("does not write roadmap.supportingActivityId", ...);
it("does not change readiness", ...);
```

The readiness assertion must compare `calculateRoleReadiness` before and after against `getRoleMap("frontend-developer")`.

Run RED:

```bash
npm --prefix apps/web test -- src/lib/career/learning-progress.test.ts src/lib/career/learning-integration-regression.test.ts
```

### GREEN

- starting sets current module and timestamps;
- practice completion appends one practice ID idempotently;
- module completion appends one module ID idempotently;
- `completedAt` is set only when every reviewed module in the note is completed;
- draft modules do not block `studied` state;
- no helper writes evidence, competencies, assessments, roadmap, market samples, or decisions.

Run:

```bash
npm --prefix apps/web test -- src/lib/career/learning-progress.test.ts src/lib/career/learning-integration-regression.test.ts src/lib/career/readiness.test.ts src/lib/career/roadmap-engine.test.ts
npm run web:typecheck
```

Commit via GitHub connector:

`feat: add deterministic Career learning progress`

### Slice 1 gate

Run from repository root:

```bash
npm test
npm run validate
npm run web:test
npm run web:typecheck
npm run web:lint
npm run web:build
```

Open Draft PR `feat: add Career learning foundation and Profile v2`. Record exact root/web test counts and build page count. Inspect fresh GitHub Actions evidence; do not merge.

---

# Slice 2 — Migrate existing learning content and deterministic recommendations

## Task 2.1 — Migrate the six existing LearningUnits into Core Notes

**Modify**
- `apps/web/src/lib/career/learning-catalog.ts`
- `apps/web/src/lib/career/learning-source-catalog.ts`
- `apps/web/src/lib/career/learning-validation.test.ts`
- `apps/web/src/lib/career/learning.test.ts`
- `apps/web/src/lib/career/learning-integration-regression.test.ts`

Migrate these existing topics:

- `programming-javascript`
- `programming-typescript`
- `testing-behavior`
- `http-api-engineering`
- `git-collaboration`
- `web-accessibility`

Each gets one Core Note and four reviewed modules matching its canonical `foundation`, `developing`, `proficient`, `advanced` criteria. Module IDs are exactly `<competency-id>-<level>` and practice IDs exactly `<module-id>-practice`.

### Source anchors to verify before `reviewStatus: "reviewed"`

- `mdn-async-function` → `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function`
- `mdn-promise` → `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise`
- `ts-handbook-narrowing` → `https://www.typescriptlang.org/docs/handbook/2/narrowing.html`
- `ts-handbook-type-manipulation` → `https://www.typescriptlang.org/docs/handbook/2/types-from-types.html`
- `testing-library-guiding-principles` → `https://testing-library.com/docs/guiding-principles/`
- `rfc-9110-http-semantics` → `https://www.rfc-editor.org/rfc/rfc9110.html`
- `git-commit-docs` → `https://git-scm.com/docs/git-commit`
- `pro-git-distributed-workflows` → `https://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows`
- `wcag-22` → `https://www.w3.org/TR/WCAG22/`
- `wai-aria-apg` → `https://www.w3.org/WAI/ARIA/apg/`

Before authoring reviewed content, verify each current URL and only claim what it actually supports. `testing-behavior` uses `primarySourcePolicy: "not-available"` with localized reason because behavior-oriented testing methodology has no single normative platform specification; Testing Library is `recognized-institutional`, not a standard.

### RED

Update `learning.test.ts` so the old “six V1 microlearning units” assertion becomes:

```ts
const migratedCompetencies = [
  "programming-javascript",
  "programming-typescript",
  "testing-behavior",
  "http-api-engineering",
  "git-collaboration",
  "web-accessibility",
] as const;

it("publishes six migrated reviewed Core Notes with one module per canonical criterion", () => {
  for (const competencyId of migratedCompetencies) {
    const note = getLearningNoteByCompetency(competencyId);
    const definition = competencyDefinitions.find((item) => item.id === competencyId)!;
    expect(note).toBeDefined();
    expect(note?.modules.map((module) => module.criterionId)).toEqual(
      definition.criteria.map((criterion) => criterion.id),
    );
    expect(note?.modules.every((module) => module.reviewStatus === "reviewed")).toBe(true);
  }
});
```

Remove only the legacy `supportingActivityId` learning assertions from this file; keep its portfolio evidence tests unchanged.

Run RED:

```bash
npm --prefix apps/web test -- src/lib/career/learning.test.ts src/lib/career/learning-validation.test.ts
```

### GREEN

Each of the 24 modules must include distinct level-appropriate EN/PT-BR `understand`, `commonMistake`, one practice, at least two consolidation criteria, source IDs, `contentVersion: "1"`, and current review date. Reuse old learning copy only where it matches the canonical criterion; do not paste one generic explanation across all levels.

Run:

```bash
npm --prefix apps/web test -- src/lib/career/learning.test.ts src/lib/career/learning-validation.test.ts src/lib/career/learning-integration-regression.test.ts
npm run web:typecheck
```

Commit via GitHub connector:

`feat: migrate curated Career learning notes`

## Task 2.2 — Add deterministic recommendation engine

**Create**
- `apps/web/src/lib/career/learning-recommendations.ts`
- `apps/web/src/lib/career/learning-recommendations.test.ts`

Expose exactly:

```ts
export type LearningRecommendation =
  | {
      readonly kind: "study";
      readonly competencyId: CompetencyId;
      readonly criterionId: string;
      readonly noteId: string;
      readonly moduleId: string;
      readonly reason: "blocking-gap" | "current-milestone" | "prerequisite" | "next-role-competency";
      readonly priority: number;
    }
  | {
      readonly kind: "prove";
      readonly competencyId: CompetencyId;
      readonly criterionId: string;
      readonly reason: "studied-not-proved";
      readonly priority: number;
      readonly destination: "assessment" | "evidence";
    };

getPrimaryLearningRecommendation(profile: CareerProfile): LearningRecommendation | null;
getAssessmentLearningRecommendation(result: AssessmentResultArtifact): LearningRecommendation | null;
getMilestoneLearningModules(
  profile: CareerProfile,
  milestoneId: string,
): readonly Readonly<{
  note: LearningNote;
  module: LearningModule;
  state: "not-started" | "in-progress" | "studied";
}>[];
```

Priority constants are fixed:

```ts
const priority = {
  blockingGap: 500,
  studiedNotProved: 400,
  currentMilestone: 300,
  prerequisite: 200,
  nextRoleCompetency: 100,
} as const;
```

### RED

Test all five ranking reasons plus these critical behaviors:

```ts
it("prioritizes an unstudied blocking criterion", ...);
it("returns prove for a studied but still unproved criterion", ...);
it("never recommends a draft module", ...);
it("returns null when a relevant criterion has no reviewed mapping", ...);
it("is deterministic for identical profile/catalog input", ...);
it("derives assessment gaps from failed challenge ids and blueprint criterionIds", ...);
```

For role gaps, the chosen criterion is the next canonical level needed to move from current observed state toward `RoleRequirement.requiredLevel`; do not jump straight to the highest module. For immediate assessment results, preserve failed challenge order from the blueprint when choosing the first mapped criterion.

Run RED:

```bash
npm --prefix apps/web test -- src/lib/career/learning-recommendations.test.ts
```

### GREEN

Do not use timestamps, locale, random values, or UI state in ranking. `kind: "prove"` must never carry `noteId/moduleId`, preventing the UI from restudying the same module by accident.

Run:

```bash
npm --prefix apps/web test -- src/lib/career/learning-recommendations.test.ts src/lib/career/readiness.test.ts src/lib/career/guidance.test.ts
npm run web:typecheck
```

Commit via GitHub connector:

`feat: add deterministic Career learning recommendations`

### Slice 2 gate

Run the full root/web gate from Slice 1. Open Draft PR `feat: add deterministic Career learning recommendations`; inspect fresh CI and stop for merge authorization.

---

# Slice 3 — Navigation, Learning index, Core Note reader

## Task 3.1 — Make Learning the third Career Lab step and add the index

**Modify**
- `apps/web/src/lib/career/copy.ts`
- `apps/web/src/components/career/career-lab-shell.tsx`
- `apps/web/src/components/career/career-lab-shell.test.tsx`
- `apps/web/src/app/[locale]/(career)/career-lab/layout.tsx`

**Create**
- `apps/web/src/lib/career/learning-copy.ts`
- `apps/web/src/components/career/career-learning-index.tsx`
- `apps/web/src/components/career/career-learning-index.test.tsx`
- `apps/web/src/app/[locale]/(career)/career-lab/learning/page.tsx`
- `apps/web/src/styles/career-learning.css`

Change nav arrays exactly to:

```ts
// EN
["Overview", "Assessments", "Learning", "Roadmap", "Evidence", "Market"]
// PT-BR
["Visão geral", "Avaliações", "Aprendizado", "Roadmap", "Evidências", "Mercado"]
```

Change shell route segments exactly to:

```ts
["", "assessments", "learning", "roadmap", "evidence", "market"]
```

Guide stays outside the numbered `<ol>`.

### RED

Update `career-lab-shell.test.tsx`:
- Guide route has six numbered workflow items;
- `/pt-BR/career-lab/learning` marks `03 Aprendizado` current;
- `/pt-BR/career-lab/roadmap` now marks `04 Roadmap` current;
- exact EN/PT-BR navigation arrays above.

Create `career-learning-index.test.tsx` covering:

```ts
it("shows one explainable Recommended now study action for a mapped gap", ...);
it("shows a proof-oriented recommendation after the relevant module is studied", ...);
it("shows Explore competencies without fabricating personalization when no profile exists", ...);
it("uses only Not started, In progress, and Studied language for note progress", ...);
it("does not render proficiency/readiness percentages on learning cards", ...);
```

Run RED:

```bash
npm --prefix apps/web test -- src/components/career/career-lab-shell.test.tsx src/components/career/career-learning-index.test.tsx
```

### GREEN

`CareerLearningIndex` sections are always ordered:
1. Recommended now / Recomendado para você agora
2. Current learning path / Sua trilha atual
3. Explore competencies / Explorar competências

Use one dominant recommendation only. Group Explore by `CompetencyDefinition.domain`. Show title, reason where contextual, estimated time, and study state. Do not show readiness score.

Import `career-learning.css` in Career Lab layout and update its metadata description to mention learning and professional evidence.

Run:

```bash
npm --prefix apps/web test -- src/components/career/career-lab-shell.test.tsx src/components/career/career-learning-index.test.tsx
npm run web:typecheck
npm run web:lint
```

Commit via GitHub connector:

`feat: add Career Learning workspace navigation`

## Task 3.2 — Build Core Note reader and explicit progress controls

**Create**
- `apps/web/src/components/career/career-learning-note.tsx`
- `apps/web/src/components/career/career-learning-note.test.tsx`
- `apps/web/src/app/[locale]/(career)/career-lab/learning/[noteId]/page.tsx`

**Modify**
- `apps/web/src/lib/career/learning-copy.ts`
- `apps/web/src/styles/career-learning.css`

`CareerLearningNote({ locale, noteId })` reads/mutates the existing Career Profile provider. Module DOM IDs equal stable module IDs so contextual URLs can use `#<moduleId>`.

### RED

Test:

```ts
it("renders only reviewed modules", ...);
it("shows source title, publisher/authority label, and review date", ...);
it("renders code examples in pre > code", ...);
it("uses native links for the module index", ...);
it("records practice/module progress only after explicit button actions", ...);
it("shows Studied/Conteúdo estudado and says proof is still required", ...);
it("does not modify evidence, competencies, assessments, or readiness", ...);
it("shows incomplete coverage notice when the note still contains draft modules", ...);
```

Run RED:

```bash
npm --prefix apps/web test -- src/components/career/career-learning-note.test.tsx
```

### GREEN

Every reviewed module renders this exact semantic sequence:
- Understand / Entenda
- See / Veja, only if `example` exists
- Avoid this mistake / Evite este erro
- Practice / Pratique
- Consolidated when / Você consolidou quando…
- Sources / Fontes

Use normal `href="#module-id"` anchors and `scroll-margin-top`; do not programmatically steal focus on hash navigation. Draft module body is never rendered.

Run:

```bash
npm --prefix apps/web test -- src/components/career/career-learning-note.test.tsx src/components/career/career-learning-index.test.tsx
npm run web:typecheck
npm run web:lint
npm run web:build
```

Commit via GitHub connector:

`feat: add Career Learning note reader`

### Slice 3 gate

Run all root/web gates. Manually QA Learning index + TypeScript note in EN/PT-BR, desktop + narrow viewport, keyboard navigation, and light/dark inherited themes. Open Draft PR `feat: add Career learning surfaces`; stop for merge authorization.

---

# Slice 4 — Assessment Result v2, review, retry, back

## Task 4.1 — Turn assessment completion into a continuation surface

**Modify**
- `apps/web/src/components/career/assessment-result.tsx`
- `apps/web/src/components/career/assessment-runner.tsx`
- `apps/web/src/components/career/assessment-runner.test.tsx`
- `apps/web/src/components/career/assessment-review-regressions.test.tsx`
- `apps/web/src/lib/career/copy.ts`
- `apps/web/src/styles/career-assessments.css`
- `apps/web/src/styles/career-assessment-learning.css`

**Create**
- `apps/web/src/components/career/assessment-result-v2.test.tsx`
- `apps/web/src/components/career/assessment-attempt-review.tsx`
- `apps/web/src/components/career/assessment-attempt-review.test.tsx`

In `AssessmentDetailSurface`, replace the single `result` state with:

```ts
type CompletedAttempt = Readonly<{
  result: AssessmentResultArtifact;
  responses: AssessmentResponses;
}>;

type AssessmentSurfaceView = "run" | "result" | "review";
```

Keep `runnerKey: number` state; increment it on Try again and pass it as React `key` to `AssessmentRunner` so its option-order state is regenerated once for the new attempt.

### RED

Write tests that prove:

```ts
it("shows Diagnosis, Demonstrated, Strengthen next, and Your next step in that order", ...);
it("uses Study now as primary CTA when getAssessmentLearningRecommendation returns study", ...);
it("shows a proof CTA instead of restudy when recommendation kind is prove", ...);
it("Review challenges enters a read-only same-session review without saving profile again", ...);
it("Back to result leaves review without mutating profile", ...);
it("Try again returns to challenge 1 with a freshly mounted runner", ...);
it("Try again preserves the already persisted completed AssessmentRecord", ...);
it("Back to assessments links directly to /{locale}/career-lab/assessments", ...);
```

Run RED:

```bash
npm --prefix apps/web test -- src/components/career/assessment-result-v2.test.tsx src/components/career/assessment-attempt-review.test.tsx src/components/career/assessment-runner.test.tsx
```

### GREEN

`AssessmentResult` hierarchy:
1. Diagnosis — level + confidence + deterministic interpretation copy.
2. Demonstrated — current strong signals.
3. Strengthen next — criterion-level labels derived from failed challenge mapping; never expose raw criterion IDs as the primary UI label.
4. Your next step — mapped study/proof recommendation, or transparent “no curated study module available” state.
5. Actions — Review challenges, Try again, Back to assessments.

`AssessmentAttemptReview` renders each challenge, selected response/order, correct/incorrect semantic text, and the existing `assessment-learning-feedback.ts` explanation. It contains no editable radio/checkbox/order buttons and never creates/submits a new `AssessmentResponses` object.

Run:

```bash
npm --prefix apps/web test -- src/components/career/assessment-result-v2.test.tsx src/components/career/assessment-attempt-review.test.tsx src/components/career/assessment-runner.test.tsx src/components/career/assessment-learning-runner.test.tsx src/components/career/assessment-review-regressions.test.tsx src/lib/career/assessment-review-regressions.test.ts
npm run web:typecheck
npm run web:lint
```

Commit via GitHub connector:

`feat: add actionable Career assessment results`

### Slice 4 gate

Run all root/web gates. Visual QA must cover one correct and one incorrect path, study CTA, review→result, retry with fresh shuffle, Back to assessments, both locales, and mobile. Open Draft PR `feat: add Career assessment Result v2`; stop for merge authorization.

---

# Slice 5 — Overview, next action, Roadmap integration, legacy learning cleanup

## Task 5.1 — Make Overview guidance distinguish study from proof

**Modify**
- `apps/web/src/lib/career/guidance.ts`
- `apps/web/src/lib/career/guidance-copy.ts`
- `apps/web/src/lib/career/guidance.test.ts`
- `apps/web/src/components/career/career-next-action.tsx`
- `apps/web/src/components/career/career-overview.tsx`
- `apps/web/src/styles/career-overview.css`

**Create**
- `apps/web/src/components/career/career-overview.test.tsx`

Add these exact variants to the existing `CareerNextAction` union:

```ts
| {
    kind: "study-gap";
    competencyId: CompetencyId;
    criterionId: string;
    noteId: string;
    moduleId: string;
    href: string;
  }
| {
    kind: "prove-studied-capability";
    competencyId: CompetencyId;
    criterionId: string;
    destination: "assessment" | "evidence";
    href: string;
  }
```

Baseline completion stays the first `getCareerNextAction` gate. After baseline, call the deterministic recommendation engine before generic Roadmap/Market fallback actions.

### RED

In `guidance.test.ts`:

```ts
it("returns study-gap after baseline for an unstudied reviewed blocking gap", ...);
it("returns prove-studied-capability after the relevant module is studied", ...);
it("does not change the baseline-first behavior", ...);
```

In new `career-overview.test.tsx`, prove these user-facing row states:
- `Capability gap · Study / Lacuna de capacidade · Estudar`
- `Studied · Needs proof / Estudado · Falta comprovar`
- `Evidence gap · Add evidence / Lacuna de evidência · Adicionar evidência`
- `Aligned / Alinhada`

Also calculate and assert the readiness percentage is identical before and after a study-only progress mutation.

Run RED:

```bash
npm --prefix apps/web test -- src/lib/career/guidance.test.ts src/components/career/career-overview.test.tsx
```

### GREEN

Update `career-next-action.tsx` and `guidance-copy.ts` with explicit presentations for the two new variants. Avoid generic “continue” copy when the system knows whether the user should study or prove.

Run:

```bash
npm --prefix apps/web test -- src/lib/career/guidance.test.ts src/components/career/career-overview.test.tsx
npm run web:typecheck
npm run web:lint
```

Commit via GitHub connector:

`feat: connect Career learning to next actions`

## Task 5.2 — Make Roadmap read Profile v2 learning progress

**Modify**
- `apps/web/src/components/career/career-roadmap.tsx`
- `apps/web/src/components/career/career-roadmap.test.tsx`
- `apps/web/src/lib/career/learning-recommendations.ts`
- `apps/web/src/lib/career/learning-recommendations.test.ts`
- `apps/web/src/lib/career/learning.test.ts`
- `apps/web/src/lib/career/learning-integration-regression.test.ts`
- `apps/web/src/styles/career-roadmap.css`
- `apps/web/src/styles/career-learning-evidence.css`

**Delete**
- `apps/web/src/components/career/learning-unit.tsx`
- `apps/web/src/lib/career/learning.ts`

Before deletion, search the repository and require zero imports of the two legacy learning exports/components outside the files being removed.

`getMilestoneLearningModules(profile, milestoneId)` derives preparation modules from `RoadmapMilestoneDefinition.requirements`: find the Core Note for each requirement competency, then the module whose `level` equals `targetLevel`; include only reviewed modules.

### RED

In `career-roadmap.test.tsx`:

```ts
it("shows reviewed preparation modules for the current milestone", ...);
it("shows each preparation module as not started, in progress, or studied", ...);
it("links preparation to the Learning Core Note/module anchor", ...);
it("does not complete a milestone when every preparation module is only studied", ...);
```

In `learning-integration-regression.test.ts`, replace the old `supportingActivityId` regression with:

```ts
it("records learning progress without deriving or mutating roadmap state", () => {
  const profile = createEmptyCareerProfile({
    targetRole: "frontend-developer",
    targetMarket: "br",
    weeklyStudyHours: 8,
    now: "2026-09-08T18:00:00.000Z",
  });
  const next = completeLearningModule(
    profile,
    "javascript-programming",
    "programming-javascript-foundation",
    "2026-09-08T18:05:00.000Z",
  );
  expect(next.roadmap).toEqual(profile.roadmap);
  expect(next.evidence).toEqual(profile.evidence);
  expect(next.competencies).toEqual(profile.competencies);
});
```

Use the actual JavaScript Core Note ID authored in Slice 2. The implementation plan chooses `javascript-programming` as that Core Note ID; keep that ID stable from Slice 2 onward.

Run RED:

```bash
npm --prefix apps/web test -- src/components/career/career-roadmap.test.tsx src/lib/career/learning-recommendations.test.ts src/lib/career/learning-integration-regression.test.ts
```

### GREEN

Replace the embedded legacy `LearningUnit` card with a compact Roadmap preparation block: module title, study state, and `Continue learning` link. Roadmap does not own completion buttons.

Delete legacy `completeLearningUnit`, `isLearningUnitCompleted`, `milestoneUnitIds`, `LearningUnit` type/component, and only the `.career-learning-unit*` CSS selectors from `career-learning-evidence.css`. Preserve evidence styles in the same stylesheet.

`RoadmapState.supportingActivityId` may remain in schema/types for compatibility in this slice, but no new learning code reads or writes it.

Run:

```bash
npm --prefix apps/web test -- src/components/career/career-roadmap.test.tsx src/lib/career/learning-recommendations.test.ts src/lib/career/learning-integration-regression.test.ts src/lib/career/roadmap-engine.test.ts src/lib/career/assessment-roadmap-integration.test.ts
npm run web:typecheck
npm run web:lint
```

Commit via GitHub connector:

`feat: connect Roadmap to Career learning progress`

### Slice 5 gate

Run full root/web gates and visually verify Overview + Roadmap in both locales. Open Draft PR `feat: connect Career learning to Overview and Roadmap`; stop for merge authorization.

---

# Slice 6 — Full 14-competency coverage and Guide methodology

## Task 6.1 — Author the remaining eight Core Notes

**Modify**
- `apps/web/src/lib/career/learning-catalog.ts`
- `apps/web/src/lib/career/learning-source-catalog.ts`
- `apps/web/src/lib/career/learning-validation.test.ts`

**Create**
- `apps/web/src/lib/career/learning-full-coverage.test.ts`

Remaining competencies:
- `web-platform-foundations`
- `ui-component-modeling`
- `state-data-flow`
- `node-runtime-foundations`
- `relational-data-modeling`
- `application-security-foundations`
- `architecture-boundaries`
- `professional-evidence`

### RED

```ts
it("has exactly one Core Note for each canonical competency", () => {
  expect(learningNoteCatalog).toHaveLength(competencyIds.length);
  expect(new Set(learningNoteCatalog.map((note) => note.competencyId))).toEqual(new Set(competencyIds));
});

it("has one reviewed module for each canonical criterion", () => {
  for (const definition of competencyDefinitions) {
    const note = getLearningNoteByCompetency(definition.id)!;
    expect(note.modules.map((module) => module.criterionId)).toEqual(
      definition.criteria.map((criterion) => criterion.id),
    );
    expect(note.modules.every((module) => module.reviewStatus === "reviewed")).toBe(true);
  }
});
```

Run RED:

```bash
npm --prefix apps/web test -- src/lib/career/learning-full-coverage.test.ts
```

### Source review matrix

Verify current authoritative pages before marking modules reviewed:

- `web-platform-foundations`: WHATWG HTML `https://html.spec.whatwg.org/`, Fetch `https://fetch.spec.whatwg.org/`, MDN only as supporting reference; policy `required`.
- `ui-component-modeling`: React Thinking in React `https://react.dev/learn/thinking-in-react` plus current React component/props documentation for React-specific claims; policy `required` for those claims. Generic component-boundary guidance must be framed as Career Lab synthesis rather than universal React law.
- `state-data-flow`: React `https://react.dev/learn/choosing-the-state-structure`, `https://react.dev/learn/sharing-state-between-components`, `https://react.dev/learn/you-might-not-need-an-effect`; policy `required`.
- `node-runtime-foundations`: Node event loop `https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick` and `https://nodejs.org/api/`; policy `required`.
- `relational-data-modeling`: PostgreSQL constraints `https://www.postgresql.org/docs/current/ddl-constraints.html`, transactions `https://www.postgresql.org/docs/current/tutorial-transactions.html`, indexes `https://www.postgresql.org/docs/current/indexes.html`; policy `required`.
- `application-security-foundations`: OWASP Cheat Sheet Series `https://cheatsheetseries.owasp.org/` and ASVS `https://owasp.org/www-project-application-security-verification-standard/`; policy `not-available`, with reason that the cross-stack competency has no single normative implementation specification.
- `architecture-boundaries`: Azure Architecture Center `https://learn.microsoft.com/en-us/azure/architecture/`; Fowler may be supplementary; policy `not-available`, with reason that architecture boundary trade-offs are design guidance rather than a normative standard.
- `professional-evidence`: GitHub account/profile documentation `https://docs.github.com/en/account-and-profile` plus current repository documentation guidance; policy `not-available`, and explicitly label the competency’s portfolio criteria as Career Lab methodology.

For all 32 new modules, derive the teaching target directly from `CompetencyDefinition.criteria[level].description`. Each requires distinct EN/PT-BR explanation, misconception, one practice, at least two consolidation criteria, source coverage, `contentVersion: "1"`, and real review date.

### GREEN

```bash
npm --prefix apps/web test -- src/lib/career/learning-validation.test.ts src/lib/career/learning-full-coverage.test.ts src/lib/career/learning-recommendations.test.ts
npm run web:typecheck
```

Commit via GitHub connector:

`feat: complete Career learning competency coverage`

## Task 6.2 — Add “How learning works” and finalize product identity

**Modify**
- `apps/web/src/lib/career/guidance-copy.ts`
- `apps/web/src/components/career/career-guide.tsx`
- `apps/web/src/components/career/career-guide.test.tsx`
- `apps/web/src/components/career/career-lab-shell.tsx`
- `apps/web/src/lib/career/copy.ts`
- `apps/web/src/app/[locale]/(career)/career-lab/layout.tsx`
- `apps/web/src/styles/career-guidance.css`

### RED

In `career-guide.test.tsx`, assert both locales explain all six concepts:
1. study is not proficiency;
2. recommendations are deterministic/explainable;
3. sources are curated and authority-aware;
4. `reviewed` means repository content has been checked against declared sources;
5. assessment/evidence is how study becomes proof;
6. progress remains local-first and exportable.

Also assert the shell/masthead contains the new product statement in each locale.

Run RED:

```bash
npm --prefix apps/web test -- src/components/career/career-guide.test.tsx src/components/career/career-lab-shell.test.tsx
```

### GREEN

Use these approved strings:

```text
EN: A local-first workspace to understand your capabilities, learn what is missing, and turn growth into professional evidence.
PT-BR: Um workspace local-first para entender suas capacidades, aprender o que falta e transformar evolução em evidência profissional.
```

Compact identity line:

```text
Assess. Learn. Practice. Prove. Grow.
Avalie. Aprenda. Pratique. Comprove. Evolua.
```

Do not add a marketing hero inside the workspace.

Run:

```bash
npm --prefix apps/web test -- src/components/career/career-guide.test.tsx src/components/career/career-lab-shell.test.tsx src/lib/career/learning-full-coverage.test.ts
npm run web:typecheck
npm run web:lint
```

Commit via GitHub connector:

`feat: document Career learning methodology`

### Slice 6 gate

Run all root/web gates. Manually spot-check at least one note from each governance class: `required` primary source, `not-available` + institutional guidance, `not-available` + Career Lab methodology. Open Draft PR `feat: complete Career learning content and methodology`; stop for merge authorization.

---

# Slice 7 — Final cross-flow, accessibility, and visual QA

## Task 7.1 — Add the full product-loop regression

**Create**
- `apps/web/src/components/career/career-learning-flow.test.tsx`

Use real domain functions/catalog entries with in-memory `CareerStorage`. The test must execute this exact loop:

1. create Profile v2;
2. complete a TypeScript assessment with known `programming-typescript.developing` gap;
3. assert Result v2 offers the mapped study recommendation;
4. apply practice/module completion through real learning-progress functions;
5. assert readiness is unchanged;
6. render Overview and assert `Studied · Needs proof` / PT-BR equivalent;
7. assert next action points to assessment/evidence rather than the same study module;
8. serialize/import the profile;
9. assert `learningProgress` survives unchanged.

Run RED before any QA fixes:

```bash
npm --prefix apps/web test -- src/components/career/career-learning-flow.test.tsx
```

## Task 7.2 — Add semantic/accessibility regressions

**Modify**
- `apps/web/src/components/career/career-learning-flow.test.tsx`
- `apps/web/src/styles/career-motion-entry-regression.test.ts` only if reduced-motion content visibility needs a CSS-level assertion.

Protect:
- six numbered workflow links + unnumbered Guide;
- module index uses links;
- progress actions use buttons;
- source links have descriptive accessible names;
- result actions have unique role/name pairs;
- review mode has zero editable assessment inputs;
- success/error/study/proof state includes text, not only color;
- reduced-motion mode keeps all content present/usable.

Run:

```bash
npm --prefix apps/web test -- src/components/career/career-learning-flow.test.tsx src/components/career/career-lab-shell.test.tsx src/components/career/career-learning-index.test.tsx src/components/career/career-learning-note.test.tsx src/components/career/assessment-result-v2.test.tsx src/styles/career-motion-entry-regression.test.ts
```

If this QA uncovers a defect outside the listed files, stop before editing and append the exact failing contract + exact file path to this plan/PR description. Do not use Slice 7 as a general refactor bucket.

## Task 7.3 — Final verification

Run from repository root:

```bash
npm test
npm run validate
npm run web:test
npm run web:typecheck
npm run web:lint
npm run web:build
```

Record exact:
- root test count;
- web Vitest file/test counts;
- catalog validation count (`60 skills / 12 packs` unless an independently approved change altered it);
- build static page count.

Then inspect fresh GitHub Actions checks on supported Ubuntu and Windows jobs, including installer smoke jobs when present. Local success is not CI evidence.

### Manual visual QA matrix

Verify all of these before the final PR can leave Draft:

- EN + PT-BR;
- desktop + narrow/mobile;
- light + dark inherited themes;
- reduced motion;
- Overview with unstudied gap;
- Overview with studied/not-proved gap;
- Learning index with recommendation;
- Learning index without profile;
- TypeScript Core Note with code + sources;
- Assessment Result with study recommendation;
- same-session Assessment Review;
- Try again with new shuffle;
- direct Back to assessments;
- Roadmap preparation block;
- Guide methodology.

### Final negative-contract review

Confirm against the spec:

```text
No runtime AI lessons.
No readiness/proficiency increase from study.
No evidence from practice/module buttons.
No persisted raw answer-by-answer assessment history.
No auth/cloud/billing scope.
No renamed existing Career Lab URL.
No course gamification or certification language.
No recommendation of draft/unreviewed modules.
```

Commit only proven QA fixes via GitHub connector with semantic message:

`fix: harden Career learning cross-flow UX`

Open/maintain Draft PR `fix: harden Career learning final QA`, add fresh verification evidence, and stop for user review. Terminal state is **ready for merge authorization**, never auto-merged.

---

# Plan self-review

This plan was checked after drafting for placeholders, ambiguous ownership, and spec drift.

- No TODO/TBD or “implement similarly” placeholders remain.
- `career-overview.test.tsx` is explicitly **Create** because it does not exist on the authored base.
- Legacy `learning.test.ts` and `learning-integration-regression.test.ts` have explicit replacement responsibilities; no “modify/delete obsolete tests” instruction remains.
- `CareerNextAction` study/proof variants are fully specified rather than left as “or equivalent”.
- `LearningRecommendation` is a single discriminated union shared by all consumers.
- `CareerProfile.learningProgress` is the only new canonical learning-progress store.
- Same-session assessment review is explicit; raw historical answers are not added to Profile v2.
- Source-governance exceptions are explicit and reviewable.
- Slice 7 cannot edit an unlisted production file without first recording the exact defect/file, preventing open-ended cleanup.
- GitHub connector operations are preferred for repository writes/commits/PRs, matching the project workflow.

## Execution gate

The spec and this plan are documentation only. Implementation begins only after the documentation PR is merged with explicit authorization. Thereafter, each slice uses a fresh branch from the latest merged `main`, and each slice pauses for explicit merge authorization before the next begins.
