# Career Lab Learning System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Career Lab into an evidence-led developer career development system that can recommend curated study, track learning progress separately from proficiency, and hand users back to assessment/evidence to prove what they learned.

**Architecture:** Keep the current local-first Career Profile and deterministic Career Lab engines, but add a versioned curated learning domain: source catalog + Core Notes + criterion-level modules + pure progress mutations + deterministic recommendation engine. UI surfaces consume those contracts through a dedicated Learning area and contextual handoffs from Assessment Result, Overview, and Roadmap; study never mutates evidence, competency level/confidence, or readiness.

**Tech Stack:** Next.js 16.3.1, React 19.2.8, TypeScript 5.9, Vitest 4, Testing Library, browser IndexedDB via the existing `CareerStorage`, plain CSS using the existing Career Lab editorial tokens. No new runtime dependency.

**Spec:** `docs/superpowers/specs/2026-09-11-career-lab-learning-system-design.md`

## Global Constraints

- Preserve the public Agent Skills Studio version at `1.1.0`; Career Profile schema versioning is independent.
- Preserve all existing public Career Lab URLs; add only `/{locale}/career-lab/learning` and `/{locale}/career-lab/learning/[noteId]`.
- Career Lab remains local-first: no auth, cloud sync, billing, server-side profile persistence, model API, or background personal-data processing.
- Runtime AI must not generate technical lessons or choose learning recommendations.
- Learning progress must never create an `EvidenceRecord`, change competency level/confidence, increase readiness directly, or complete a roadmap milestone by itself.
- First-party learning content is bilingual: `en` and `pt-BR`.
- Only `reviewStatus: "reviewed"` modules are available/recommendable in production.
- A reviewed module with `primarySourcePolicy: "required"` must reference at least one `authority: "primary"` source. `primarySourcePolicy: "not-available"` requires an explicit localized reason.
- The final complete learning catalog contains exactly one Core Note for each of the 14 canonical competencies and, under the current competency model, one module per proficiency criterion.
- The UI remains editorial/paper-like and avoids course-marketplace cards, XP, streaks, badges, certification language, and colorful SaaS-dashboard patterns.
- Status must never rely on color alone; keyboard behavior, focus visibility, meaningful link names, reduced motion, and semantic heading order are required.
- Do not merge any implementation PR without explicit user authorization.
- Every implementation slice follows: `audit -> RED -> implementation -> GREEN -> spec review -> quality review -> semantic commit -> CI evidence`.
- Do not claim test, lint, typecheck, build, or CI success without fresh command/run evidence.

---

## File Responsibility Map

### Domain contracts and content

- `apps/web/src/lib/career/learning-types.ts` — localized learning/source contracts only; no catalog data and no profile mutations.
- `apps/web/src/lib/career/learning-source-catalog.ts` — curated source records and review-window configuration.
- `apps/web/src/lib/career/learning-catalog.ts` — the 14 Core Notes and their criterion-level modules; replaces the legacy `LearningUnit[]` data model.
- `apps/web/src/lib/career/learning-validation.ts` — structural/domain validation for note/module/source catalogs and profile learning references.
- `apps/web/src/lib/career/learning-progress.ts` — pure learning-progress selectors and mutations.
- `apps/web/src/lib/career/learning-recommendations.ts` — deterministic criterion-level recommendation engine; no React and no localization.

### Career Profile persistence

- `apps/web/src/lib/career/types.ts` — add `LearningProgressRecord`; make `CareerProfile.schemaVersion` equal `"2"`; add `learningProgress`.
- `apps/web/src/lib/career/schema.ts` — structural Profile v2 parser and learning-progress validation.
- `apps/web/src/lib/career/migrations.ts` — deterministic v1 -> v2 migration with `learningProgress: []`.
- `apps/web/src/lib/career/profile.ts` — new profiles start at schema v2 with empty learning progress.
- `apps/web/src/lib/career/storage.ts` — continue loading through `migrateCareerProfile`; validate v2 before writes.
- `apps/web/src/components/career/career-data-controls.tsx` — no new UI contract; export/import must round-trip v2 learning progress.

### Learning UI

- `apps/web/src/components/career/career-learning-index.tsx` — Recommended now, Current learning path, Explore competencies.
- `apps/web/src/components/career/career-learning-note.tsx` — Core Note reader, module anchors, progress controls, source provenance, proof handoff.
- `apps/web/src/lib/career/learning-copy.ts` — learning-specific EN/PT-BR product copy; do not enlarge generic `copy.ts` with note-reader prose.
- `apps/web/src/app/[locale]/(career)/career-lab/learning/page.tsx` — localized Learning index route.
- `apps/web/src/app/[locale]/(career)/career-lab/learning/[noteId]/page.tsx` — localized Core Note route.
- `apps/web/src/styles/career-learning.css` — new Learning index/note styling.

### Cross-flow integration

- `apps/web/src/components/career/assessment-result.tsx` — Result v2 hierarchy and actions.
- `apps/web/src/components/career/assessment-attempt-review.tsx` — read-only same-session challenge review.
- `apps/web/src/components/career/assessment-runner.tsx` — retain completed responses in `AssessmentDetailSurface`; support result/review/retry view state and remount on retry.
- `apps/web/src/components/career/career-overview.tsx` — display study/proof state in next action and capability rows.
- `apps/web/src/components/career/career-next-action.tsx` — render study/proof actions from guidance.
- `apps/web/src/lib/career/guidance.ts` — integrate deterministic learning actions into the existing next-action contract.
- `apps/web/src/lib/career/guidance-copy.ts` — localized presentation for the new action kinds and Guide methodology.
- `apps/web/src/components/career/career-roadmap.tsx` — read Core Note/module progress instead of owning legacy LearningUnit completion.
- `apps/web/src/components/career/career-guide.tsx` — add “How learning works / Como o aprendizado funciona”.
- `apps/web/src/components/career/career-lab-shell.tsx` and `apps/web/src/lib/career/copy.ts` — six-step workflow navigation and revised product statement.
- `apps/web/src/app/[locale]/(career)/career-lab/layout.tsx` — import `career-learning.css` and update Career Lab metadata description.

### Legacy learning cleanup

- `apps/web/src/components/career/learning-unit.tsx` — remove after Roadmap no longer renders legacy units.
- `apps/web/src/lib/career/learning.ts` — remove legacy `LearningUnit`, `milestoneUnitIds`, and `supportingActivityId` learning mutations after all consumers move to the new domain; if a temporary compatibility façade is required during Slices 1–4, delete it in Slice 5.
- `apps/web/src/styles/career-learning-evidence.css` — keep evidence styles; delete only selectors that exclusively target the removed `.career-learning-unit` component once no consumer remains.

## Slice / PR Boundaries

Use one reviewable PR per slice. Each PR starts from the latest approved/merged `main`, not from a long-lived stacked feature branch.

1. `feat/career-learning-foundation-v2` — content/source contracts + Profile v2 + progress semantics.
2. `feat/career-learning-recommendations` — migrate existing learning units + recommendation engine.
3. `feat/career-learning-surfaces` — navigation + Learning index + Core Note reader/progress UI.
4. `feat/career-assessment-result-v2` — result hierarchy + contextual study + review/retry/back actions.
5. `feat/career-learning-overview-roadmap` — Overview/next-action/Roadmap integration + legacy learning cleanup.
6. `feat/career-learning-content-coverage` — remaining Core Notes + Guide methodology + final catalog coverage.
7. `fix/career-learning-final-qa` — cross-flow accessibility/visual regressions and final verification only.

---

## Slice 1 — Foundation, Profile v2, and learning semantics

### Task 1: Add learning/source contracts and catalog validation primitives

**Files:**
- Create: `apps/web/src/lib/career/learning-types.ts`
- Create: `apps/web/src/lib/career/learning-source-catalog.ts`
- Create: `apps/web/src/lib/career/learning-validation.ts`
- Create: `apps/web/src/lib/career/learning-validation.test.ts`
- Modify: `apps/web/src/lib/career/learning-catalog.ts`

**Interfaces:**
- Produces: `LearningNote`, `LearningModule`, `LearningSource`, `LocalizedText`, `LocalizedCodeExample`, `LocalizedPractice`.
- Produces: `validateLearningCatalog(notes, sources, options?)` returning the validated note list or throwing an actionable error.
- Produces: `getLearningNote(noteId)`, `getLearningNoteByCompetency(competencyId)`, `getReviewedLearningModules(note)`, `getLearningModuleByCriterion(criterionId)`.
- `learning-catalog.ts` may contain a partial migrated catalog during Slices 1–5; full 14-note coverage is enforced only in Slice 6.

- [ ] **Step 1: Write the failing contract/validation tests**

Create tests that encode the approved governance instead of testing implementation details:

```ts
import { describe, expect, it } from "vitest";
import { competencyDefinitions } from "./competencies";
import { validateLearningCatalog } from "./learning-validation";
import type { LearningNote, LearningSource } from "./learning-types";

const source: LearningSource = {
  id: "ts-handbook-narrowing",
  title: "Narrowing",
  publisher: "TypeScript",
  url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
  authority: "primary",
  volatility: "medium",
  reviewedAt: "2026-09-11T00:00:00.000Z",
  supportsCriterionIds: ["programming-typescript.developing"],
};

const note: LearningNote = {
  id: "typescript-application-modeling",
  competencyId: "programming-typescript",
  title: { en: "TypeScript application modeling", "pt-BR": "Modelagem de aplicações com TypeScript" },
  summary: { en: "Model valid application states.", "pt-BR": "Modele estados válidos da aplicação." },
  objective: { en: "Make invalid states hard to represent.", "pt-BR": "Torne estados inválidos difíceis de representar." },
  estimatedMinutes: 20,
  modules: [{
    id: "typescript-developing",
    criterionId: "programming-typescript.developing",
    level: "developing",
    title: { en: "Impossible states", "pt-BR": "Estados impossíveis" },
    estimatedMinutes: 8,
    contentVersion: "1",
    reviewStatus: "reviewed",
    reviewedAt: "2026-09-11T00:00:00.000Z",
    primarySourcePolicy: "required",
    understand: { en: "Use explicit variants.", "pt-BR": "Use variantes explícitas." },
    commonMistake: { en: "Optional-everything state.", "pt-BR": "Estado com tudo opcional." },
    practice: {
      id: "typescript-developing-practice",
      prompt: { en: "Refactor a loose state shape.", "pt-BR": "Refatore um estado frouxo." },
    },
    consolidationCriteria: {
      en: ["Explains why impossible states disappear."],
      "pt-BR": ["Explica por que estados impossíveis desaparecem."],
    },
    sourceIds: ["ts-handbook-narrowing"],
  }],
};

describe("learning catalog governance", () => {
  it("accepts reviewed bilingual criterion-mapped content backed by a primary source", () => {
    expect(validateLearningCatalog([note], [source])).toEqual([note]);
  });

  it("rejects a reviewed module whose criterion belongs to another competency", () => {
    const invalid = {
      ...note,
      modules: [{ ...note.modules[0], criterionId: "programming-javascript.developing" }],
    };
    expect(() => validateLearningCatalog([invalid], [source])).toThrow(/criterion.*competency/i);
  });

  it("rejects required-primary modules without a primary source", () => {
    const pedagogical = { ...source, authority: "recognized-pedagogical" as const };
    expect(() => validateLearningCatalog([note], [pedagogical])).toThrow(/primary/i);
  });

  it("requires a reason when primarySourcePolicy is not-available", () => {
    const invalid = {
      ...note,
      modules: [{
        ...note.modules[0],
        primarySourcePolicy: "not-available" as const,
        sourceIds: ["testing-library-guiding-principles"],
      }],
    };
    expect(() => validateLearningCatalog([invalid], [source])).toThrow(/reason/i);
  });

  it("rejects duplicate note, module, practice, and source ids", () => {
    expect(() => validateLearningCatalog([note, note], [source])).toThrow(/duplicate note/i);
    expect(() => validateLearningCatalog([note], [source, source])).toThrow(/duplicate source/i);
  });

  it("keeps all canonical competency criteria addressable", () => {
    for (const definition of competencyDefinitions) {
      expect(definition.criteria).toHaveLength(4);
    }
  });
});
```

- [ ] **Step 2: Run RED**

Run:

```bash
npm --prefix apps/web test -- src/lib/career/learning-validation.test.ts
```

Expected: FAIL because `learning-types.ts` / `learning-validation.ts` and the new contracts do not exist.

- [ ] **Step 3: Implement the minimal contracts**

Use these exact public shapes:

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

`validateLearningCatalog` must validate IDs, bilingual strings/lists, positive minutes, ISO review dates, canonical criterion ownership, source existence, source criterion coverage, primary-source policy, and duplicate IDs. Keep stale-review detection separate from validity so content does not disappear merely because a maintenance date elapsed.

Add centralized maintenance defaults in `learning-source-catalog.ts`:

```ts
export const LEARNING_REVIEW_WINDOWS_DAYS = {
  high: 90,
  medium: 180,
  low: 365,
} as const;
```

- [ ] **Step 4: Run GREEN plus existing learning tests**

```bash
npm --prefix apps/web test -- src/lib/career/learning-validation.test.ts src/lib/career/learning.test.ts src/lib/career/learning-integration-regression.test.ts
npm run web:typecheck
```

Expected: PASS. Existing legacy-learning tests may require temporary adapters in `learning.ts`; do not remove legacy APIs in this slice.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/career/learning-types.ts apps/web/src/lib/career/learning-source-catalog.ts apps/web/src/lib/career/learning-validation.ts apps/web/src/lib/career/learning-validation.test.ts apps/web/src/lib/career/learning-catalog.ts apps/web/src/lib/career/learning.ts
git commit -m "feat: define curated career learning contracts"
```

### Task 2: Upgrade Career Profile to schema v2 and persist learning progress

**Files:**
- Modify: `apps/web/src/lib/career/types.ts`
- Modify: `apps/web/src/lib/career/profile.ts`
- Modify: `apps/web/src/lib/career/schema.ts`
- Modify: `apps/web/src/lib/career/migrations.ts`
- Modify: `apps/web/src/lib/career/storage.ts`
- Modify: `apps/web/src/lib/career/schema.test.ts`
- Modify: `apps/web/src/lib/career/profile.test.ts`
- Modify: `apps/web/src/lib/career/storage.test.ts`
- Modify: `apps/web/src/components/career/career-data-controls.test.tsx`

**Interfaces:**
- Produces in `types.ts`: `LearningProgressRecord`.
- `CareerProfile.schemaVersion` becomes exactly `"2"` and requires `learningProgress`.
- `migrateCareerProfile(value)` accepts valid v1 or v2 input and always returns valid v2.

- [ ] **Step 1: Write RED for Profile v2**

Add tests equivalent to:

```ts
it("creates a v2 profile with empty learning progress", () => {
  const profile = createEmptyCareerProfile({
    targetRole: "frontend-developer",
    targetMarket: "br",
    now: "2026-09-11T12:00:00.000Z",
  });
  expect(profile.schemaVersion).toBe("2");
  expect(profile.learningProgress).toEqual([]);
});

it("migrates a valid v1 profile to v2 without changing professional state", () => {
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

it("round-trips learning progress through export/import", () => {
  const profile = {
    ...createEmptyCareerProfile({ targetRole: "frontend-developer", targetMarket: "br" }),
    learningProgress: [{
      noteId: "typescript-application-modeling",
      startedAt: "2026-09-11T12:00:00.000Z",
      updatedAt: "2026-09-11T12:10:00.000Z",
      currentModuleId: "typescript-developing",
      completedModuleIds: ["typescript-foundation"],
      completedPracticeIds: ["typescript-foundation-practice"],
      completedAt: null,
    }],
  };
  expect(migrateCareerProfile(JSON.parse(serializeCareerProfile(profile)))).toEqual(profile);
});
```

Also add rejection cases for invalid timestamps and duplicate `noteId` progress records.

- [ ] **Step 2: Run RED**

```bash
npm --prefix apps/web test -- src/lib/career/profile.test.ts src/lib/career/schema.test.ts src/lib/career/storage.test.ts src/components/career/career-data-controls.test.tsx
```

Expected: FAIL on schema version and missing `learningProgress` support.

- [ ] **Step 3: Implement v2 structurally**

Add to `types.ts`:

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

`parseCareerProfile` must parse only v2. `migrateCareerProfile` owns v1 acceptance: copy the known v1 fields, set `schemaVersion: "2"`, add `learningProgress: []`, then call the v2 parser. Keep IndexedDB database version `1`; the object-store schema is unchanged and does not require an IndexedDB upgrade.

- [ ] **Step 4: Run GREEN and serialization regression**

```bash
npm --prefix apps/web test -- src/lib/career/profile.test.ts src/lib/career/schema.test.ts src/lib/career/storage.test.ts src/components/career/career-data-controls.test.tsx
npm run web:typecheck
```

Expected: PASS; v1 imports migrate; v2 export/import preserves learning progress.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/career/types.ts apps/web/src/lib/career/profile.ts apps/web/src/lib/career/schema.ts apps/web/src/lib/career/migrations.ts apps/web/src/lib/career/storage.ts apps/web/src/lib/career/profile.test.ts apps/web/src/lib/career/schema.test.ts apps/web/src/lib/career/storage.test.ts apps/web/src/components/career/career-data-controls.test.tsx
git commit -m "feat: add Career Profile v2 learning progress"
```

### Task 3: Add pure learning-progress mutations and prove readiness invariance

**Files:**
- Create: `apps/web/src/lib/career/learning-progress.ts`
- Create: `apps/web/src/lib/career/learning-progress.test.ts`
- Modify: `apps/web/src/lib/career/learning-validation.ts`

**Interfaces:**
- Produces: `getLearningProgress(profile, noteId)`.
- Produces: `getLearningState(profile, note): "not-started" | "in-progress" | "studied"`.
- Produces: `startLearningModule(profile, noteId, moduleId, now?)`.
- Produces: `completeLearningPractice(profile, noteId, moduleId, practiceId, now?)`.
- Produces: `completeLearningModule(profile, noteId, moduleId, now?)`.
- Every mutation returns a new `CareerProfile`; only `learningProgress` and `updatedAt` may change.

- [ ] **Step 1: Write RED for semantics**

```ts
it("records study without changing evidence, competency state, readiness, or roadmap", () => {
  const before = seededFrontendProfile();
  const readinessBefore = calculateRoleReadiness(before, getRoleMap("frontend-developer"));
  const after = completeLearningModule(
    before,
    "typescript-application-modeling",
    "typescript-developing",
    "2026-09-11T13:00:00.000Z",
  );

  expect(after.learningProgress).not.toEqual(before.learningProgress);
  expect(after.competencies).toEqual(before.competencies);
  expect(after.evidence).toEqual(before.evidence);
  expect(after.assessments).toEqual(before.assessments);
  expect(after.roadmap).toEqual(before.roadmap);
  expect(calculateRoleReadiness(after, getRoleMap("frontend-developer"))).toEqual(readinessBefore);
});

it("marks a note studied only after every reviewed module is complete", () => {
  // complete reviewed modules in note order and assert state remains in-progress until final module
});
```

Replace the comment in the committed test with actual module IDs from the initial test fixture note; do not rely on production catalog completeness in this unit test.

- [ ] **Step 2: Run RED**

```bash
npm --prefix apps/web test -- src/lib/career/learning-progress.test.ts
```

Expected: FAIL because progress helpers do not exist.

- [ ] **Step 3: Implement pure mutations**

Rules:

```ts
// Pseudocode contract, implement with immutable copies:
startLearningModule -> create/update one note progress record; set currentModuleId; preserve completed arrays.
completeLearningPractice -> require note/module/practice existence; append practice ID idempotently.
completeLearningModule -> append module ID idempotently; set completedAt only when every reviewed module in the note is complete.
```

Do not infer completion from scroll position. Do not mutate `roadmap.supportingActivityId`.

- [ ] **Step 4: Run GREEN and readiness regressions**

```bash
npm --prefix apps/web test -- src/lib/career/learning-progress.test.ts src/lib/career/readiness.test.ts src/lib/career/roadmap-engine.test.ts
npm run web:typecheck
```

- [ ] **Step 5: Slice 1 full verification and PR**

```bash
npm test
npm run validate
npm run web:test
npm run web:typecheck
npm run web:lint
npm run web:build
```

Open Draft PR `feat: add Career learning foundation and Profile v2`. Record exact pass counts/build page count from the run; do not merge.

---

## Slice 2 — Migrate existing learning and add deterministic recommendations

### Task 4: Convert the six existing LearningUnits into reviewed Core Notes

**Files:**
- Modify: `apps/web/src/lib/career/learning-catalog.ts`
- Modify: `apps/web/src/lib/career/learning-source-catalog.ts`
- Modify: `apps/web/src/lib/career/learning-validation.test.ts`
- Modify: `apps/web/src/lib/career/learning.test.ts`
- Modify: `apps/web/src/lib/career/learning-integration-regression.test.ts`

**Interfaces:**
- The six existing topics become Core Notes for these competencies: `programming-javascript`, `programming-typescript`, `testing-behavior`, `http-api-engineering`, `git-collaboration`, `web-accessibility`.
- Each migrated Core Note exposes four criterion modules (`foundation`, `developing`, `proficient`, `advanced`). Existing objective/explanation/practice copy is reused only where technically valid; new module-specific copy must follow the spec sequence.

- [ ] **Step 1: Add RED that proves six notes, criterion ownership, and source governance**

```ts
const migratedCompetencies = [
  "programming-javascript",
  "programming-typescript",
  "testing-behavior",
  "http-api-engineering",
  "git-collaboration",
  "web-accessibility",
] as const;

it("migrates the six existing learning topics into reviewed Core Notes", () => {
  for (const competencyId of migratedCompetencies) {
    const note = getLearningNoteByCompetency(competencyId);
    expect(note).toBeDefined();
    expect(note?.modules).toHaveLength(4);
    expect(note?.modules.every((module) => module.reviewStatus === "reviewed")).toBe(true);
  }
});
```

- [ ] **Step 2: Verify source anchors before marking content reviewed**

Use these source records as the initial canonical set; confirm each URL resolves and supports the claim before committing the module as `reviewed`:

| Source ID | Authority | URL | Primary use |
| --- | --- | --- | --- |
| `mdn-async-function` | primary | `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function` | async JS sequencing/failure |
| `mdn-promise` | primary | `https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise` | promise behavior |
| `ts-handbook-narrowing` | primary | `https://www.typescriptlang.org/docs/handbook/2/narrowing.html` | unions, narrowing, discriminants |
| `ts-handbook-type-manipulation` | primary | `https://www.typescriptlang.org/docs/handbook/2/types-from-types.html` | reusable type boundaries |
| `testing-library-guiding-principles` | recognized-institutional | `https://testing-library.com/docs/guiding-principles/` | observable testing behavior |
| `rfc-9110-http-semantics` | primary | `https://www.rfc-editor.org/rfc/rfc9110.html` | HTTP semantics/failure contracts |
| `git-commit-docs` | primary | `https://git-scm.com/docs/git-commit` | commit semantics/history |
| `pro-git-distributed-workflows` | primary | `https://git-scm.com/book/en/v2/Distributed-Git-Distributed-Workflows` | reviewable collaboration workflows |
| `wcag-22` | primary | `https://www.w3.org/TR/WCAG22/` | accessibility requirements |
| `wai-aria-apg` | primary | `https://www.w3.org/WAI/ARIA/apg/` | interaction patterns/keyboard semantics |

For `testing-behavior`, use `primarySourcePolicy: "not-available"` with a localized reason explaining that behavior-oriented testing methodology has no single normative platform specification; cite Testing Library as recognized institutional guidance. Do not label it as a standards source.

- [ ] **Step 3: Author the four modules per migrated note**

For each competency, module IDs are stable and predictable:

```text
<competency-id>-foundation
<competency-id>-developing
<competency-id>-proficient
<competency-id>-advanced
```

Practice IDs are `<module-id>-practice`. Every module includes EN/PT-BR `understand`, optional code example when useful, `commonMistake`, one practice prompt, at least two consolidation criteria, source IDs, `contentVersion: "1"`, and `reviewedAt` set to the actual review date.

Do not copy the same generic explanation across levels. The module content must match the canonical criterion description in `competencies.ts`.

- [ ] **Step 4: Run GREEN**

```bash
npm --prefix apps/web test -- src/lib/career/learning-validation.test.ts src/lib/career/learning.test.ts src/lib/career/learning-integration-regression.test.ts
npm run web:typecheck
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/lib/career/learning-catalog.ts apps/web/src/lib/career/learning-source-catalog.ts apps/web/src/lib/career/learning-validation.test.ts apps/web/src/lib/career/learning.test.ts apps/web/src/lib/career/learning-integration-regression.test.ts
git commit -m "feat: migrate curated career learning notes"
```

### Task 5: Add deterministic learning recommendations

**Files:**
- Create: `apps/web/src/lib/career/learning-recommendations.ts`
- Create: `apps/web/src/lib/career/learning-recommendations.test.ts`
- Modify: `apps/web/src/lib/career/learning-validation.ts`

**Interfaces:**

Use a discriminated union so “studied but not proved” cannot accidentally send the user back to study:

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
```

Produces:
- `getPrimaryLearningRecommendation(profile): LearningRecommendation | null`.
- `getAssessmentLearningRecommendation(result): LearningRecommendation | null`.
- `getMilestoneLearningModules(profile, milestoneId): readonly { note; module; state }[]`.

- [ ] **Step 1: Write RED for priority and transparency**

```ts
it("prioritizes an unstudied blocking criterion over lower-priority roadmap material", () => {
  const recommendation = getPrimaryLearningRecommendation(profileWithTypeScriptGap());
  expect(recommendation).toMatchObject({
    kind: "study",
    competencyId: "programming-typescript",
    criterionId: "programming-typescript.developing",
    reason: "blocking-gap",
  });
});

it("turns a studied-but-unproved criterion into a proof action", () => {
  const recommendation = getPrimaryLearningRecommendation(profileWithStudiedTypeScriptGap());
  expect(recommendation).toMatchObject({
    kind: "prove",
    criterionId: "programming-typescript.developing",
    reason: "studied-not-proved",
  });
});

it("returns null instead of inventing content when no reviewed mapping exists", () => {
  expect(getPrimaryLearningRecommendation(profileWithOnlyUnmappedGap())).toBeNull();
});
```

- [ ] **Step 2: Run RED**

```bash
npm --prefix apps/web test -- src/lib/career/learning-recommendations.test.ts
```

- [ ] **Step 3: Implement criterion selection**

For role-level gaps, choose the next canonical criterion required to move from the observed level toward `RoleRequirement.requiredLevel`, not an arbitrary highest-level module. For an immediate assessment result, derive failed criteria from the assessment blueprint’s failed challenge IDs and their `criterionIds`, then return the first reviewed mapped module in blueprint challenge order.

Priority constants are explicit and tested:

```ts
const priority = {
  blockingGap: 500,
  studiedNotProved: 400,
  currentMilestone: 300,
  prerequisite: 200,
  nextRoleCompetency: 100,
} as const;
```

Do not use timestamps, randomness, or locale in ranking.

- [ ] **Step 4: Run GREEN plus guidance/readiness regressions**

```bash
npm --prefix apps/web test -- src/lib/career/learning-recommendations.test.ts src/lib/career/readiness.test.ts src/lib/career/guidance.test.ts
npm run web:typecheck
```

- [ ] **Step 5: Slice 2 full verification and Draft PR**

Run the full root/web verification commands from Slice 1. Open Draft PR `feat: add deterministic Career learning recommendations`. Do not merge.

---

## Slice 3 — Learning navigation, index, Core Note reader, and progress UI

### Task 6: Reorder the Career Lab shell and add the Learning index

**Files:**
- Modify: `apps/web/src/lib/career/copy.ts`
- Modify: `apps/web/src/components/career/career-lab-shell.tsx`
- Modify: `apps/web/src/components/career/career-lab-shell.test.tsx`
- Create: `apps/web/src/lib/career/learning-copy.ts`
- Create: `apps/web/src/components/career/career-learning-index.tsx`
- Create: `apps/web/src/components/career/career-learning-index.test.tsx`
- Create: `apps/web/src/app/[locale]/(career)/career-lab/learning/page.tsx`
- Create: `apps/web/src/styles/career-learning.css`
- Modify: `apps/web/src/app/[locale]/(career)/career-lab/layout.tsx`

**Interfaces:**
- Navigation order is exactly `Overview -> Assessments -> Learning -> Roadmap -> Evidence -> Market` / `Visão geral -> Avaliações -> Aprendizado -> Roadmap -> Evidências -> Mercado`.
- `CareerLearningIndex` accepts `locale` and reads the existing Profile provider.
- The page still renders Explore competencies when no profile exists; Recommended now becomes an orientation message instead of fabricating personalization.

- [ ] **Step 1: RED shell order and route state**

Update the existing shell test expectation to six numbered items and assert Learning is step 03:

```ts
expect(careerLabCopy.en.navigation).toEqual([
  "Overview", "Assessments", "Learning", "Roadmap", "Evidence", "Market",
]);
expect(careerLabCopy["pt-BR"].navigation).toEqual([
  "Visão geral", "Avaliações", "Aprendizado", "Roadmap", "Evidências", "Mercado",
]);

navigation.pathname = "/pt-BR/career-lab/learning";
expect(screen.getByRole("link", { name: /03\s*Aprendizado/i })).toHaveAttribute("aria-current", "page");
```

- [ ] **Step 2: RED Learning index behavior**

Test three states:

```ts
it("shows one explainable Recommended now action for a mapped gap", async () => {
  renderLearningIndex(profileWithTypeScriptGap(), "pt-BR");
  expect(await screen.findByRole("heading", { name: /recomendado para você agora/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /estudar agora|continuar estudo/i })).toHaveAttribute(
    "href",
    expect.stringContaining("/pt-BR/career-lab/learning/typescript-application-modeling#programming-typescript-developing"),
  );
});

it("labels progress as study progress, never proficiency", async () => {
  renderLearningIndex(profileWithLearningProgress(), "pt-BR");
  expect(await screen.findByText(/em andamento · 1\/4/i)).toBeInTheDocument();
  expect(screen.queryByText(/proficiente|mastered|dominado/i)).not.toBeInTheDocument();
});
```

- [ ] **Step 3: Run RED**

```bash
npm --prefix apps/web test -- src/components/career/career-lab-shell.test.tsx src/components/career/career-learning-index.test.tsx
```

- [ ] **Step 4: Implement shell/index with editorial hierarchy**

`CareerLearningIndex` sections are ordered:

1. `Recommended now / Recomendado para você agora` — at most one dominant action.
2. `Current learning path / Sua trilha atual` — mapped gaps/current focus that have reviewed modules.
3. `Explore competencies / Explorar competências` — notes grouped by `CompetencyDefinition.domain`.

Cards/rows expose title, reason where contextual, estimated time, and learning state only. No circular progress, XP, badge, certificate, or readiness percentage.

Add `career-learning.css` to Career Lab layout and update layout metadata copy to mention learning + professional evidence.

- [ ] **Step 5: Run GREEN**

```bash
npm --prefix apps/web test -- src/components/career/career-lab-shell.test.tsx src/components/career/career-learning-index.test.tsx
npm run web:typecheck
npm run web:lint
```

### Task 7: Build the Core Note reader and explicit progress controls

**Files:**
- Create: `apps/web/src/components/career/career-learning-note.tsx`
- Create: `apps/web/src/components/career/career-learning-note.test.tsx`
- Create: `apps/web/src/app/[locale]/(career)/career-lab/learning/[noteId]/page.tsx`
- Modify: `apps/web/src/styles/career-learning.css`
- Modify: `apps/web/src/lib/career/learning-copy.ts`

**Interfaces:**
- `CareerLearningNote({ locale, noteId })` reads/mutates Profile through `useCareerProfile`.
- Module DOM IDs equal stable module IDs so contextual URLs can use `#<moduleId>`.
- Completing a module is explicit and persists via `completeLearningPractice` / `completeLearningModule`.

- [ ] **Step 1: Write RED for reader semantics and accessibility**

```ts
it("renders only reviewed modules and visible source provenance", async () => {
  renderLearningNote("typescript-application-modeling", "pt-BR");
  expect(await screen.findByRole("heading", { name: /modelagem de aplicações com typescript/i })).toBeInTheDocument();
  expect(screen.getByText(/fonte.*typescript/i)).toBeInTheDocument();
  expect(screen.queryByText(/conteúdo draft/i)).not.toBeInTheDocument();
});

it("records study but explicitly says it is not proof", async () => {
  renderLearningNote("typescript-application-modeling", "pt-BR");
  fireEvent.click(await screen.findByRole("button", { name: /marcar módulo como estudado/i }));
  expect(await screen.findByText(/conteúdo estudado.*comprove/i)).toBeInTheDocument();
  expect(storage.save).toHaveBeenCalledWith(expect.objectContaining({
    evidence: originalProfile.evidence,
    competencies: originalProfile.competencies,
  }));
});
```

Also assert code examples remain inside `<pre><code>`, source links have meaningful accessible names, module buttons are keyboard-native buttons, and no module completion is triggered by scrolling.

- [ ] **Step 2: Run RED**

```bash
npm --prefix apps/web test -- src/components/career/career-learning-note.test.tsx
```

- [ ] **Step 3: Implement the reading layout**

For each reviewed module render the fixed sequence:

```text
Entenda / Understand
Veja / See (only when example exists)
Evite este erro / Avoid this mistake
Pratique / Practice
Você consolidou quando... / Consolidated when...
Fontes / Sources
```

At module completion show the explicit semantic status:

```text
Conteúdo estudado. Comprove esta capacidade por uma avaliação ou evidência.
Studied. Prove this capability through an assessment or evidence.
```

If some modules are draft, render a neutral Core Note coverage message; never render draft body copy. Anchor navigation should use ordinary links (`href="#module-id"`) and CSS `scroll-margin-top`; do not force focus on hash changes.

- [ ] **Step 4: Run GREEN and route build checks**

```bash
npm --prefix apps/web test -- src/components/career/career-learning-note.test.tsx src/components/career/career-learning-index.test.tsx
npm run web:typecheck
npm run web:lint
npm run web:build
```

- [ ] **Step 5: Slice 3 full verification and Draft PR**

Run root + web gates. Visual QA must include desktop and narrow viewport for Learning index and TypeScript Core Note before the PR leaves Draft.

---

## Slice 4 — Assessment Result v2 and contextual learning handoff

### Task 8: Add Result v2, review, retry, and direct navigation actions

**Files:**
- Modify: `apps/web/src/components/career/assessment-result.tsx`
- Create: `apps/web/src/components/career/assessment-result-v2.test.tsx`
- Create: `apps/web/src/components/career/assessment-attempt-review.tsx`
- Create: `apps/web/src/components/career/assessment-attempt-review.test.tsx`
- Modify: `apps/web/src/components/career/assessment-runner.tsx`
- Modify: `apps/web/src/components/career/assessment-runner.test.tsx`
- Modify: `apps/web/src/components/career/assessment-review-regressions.test.tsx`
- Modify: `apps/web/src/styles/career-assessments.css`
- Modify: `apps/web/src/styles/career-assessment-learning.css`
- Modify: `apps/web/src/lib/career/copy.ts`

**Interfaces:**
- `AssessmentDetailSurface` owns a same-session `CompletedAttempt = { result, responses }` and view state `"run" | "result" | "review"`.
- `Review challenges` renders `AssessmentAttemptReview` using the saved same-session responses; it never calls `applyCareerAssessmentResult`.
- `Try again` clears transient attempt/result state and increments a `runnerKey` so a new `AssessmentRunner` mounts with a fresh stable shuffle.
- `Back to assessments` links directly to `/{locale}/career-lab/assessments`.
- `AssessmentResult` receives the immediate `getAssessmentLearningRecommendation(result)` output.

- [ ] **Step 1: RED the three requested actions**

```ts
it("uses contextual study as the primary next step when the result has a reviewed gap mapping", async () => {
  completeTypeScriptAssessmentWithGap();
  expect(await screen.findByRole("link", { name: /estudar agora/i })).toHaveAttribute(
    "href",
    expect.stringContaining("/pt-BR/career-lab/learning/typescript-application-modeling#programming-typescript-developing"),
  );
  expect(screen.getByRole("button", { name: /tentar novamente/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /voltar às avaliações/i })).toHaveAttribute(
    "href",
    "/pt-BR/career-lab/assessments",
  );
});

it("reviews the completed attempt without appending assessment evidence", async () => {
  const beforeSaveCount = storage.save.mock.calls.length;
  fireEvent.click(screen.getByRole("button", { name: /revisar desafios/i }));
  expect(await screen.findByText(/revisão da tentativa/i)).toBeInTheDocument();
  expect(storage.save).toHaveBeenCalledTimes(beforeSaveCount);
});

it("retry remounts a clean runner and preserves the previous completed record", async () => {
  const completedCount = savedProfile.assessments.length;
  fireEvent.click(screen.getByRole("button", { name: /tentar novamente/i }));
  expect(await screen.findByText(/desafio 1 de 4/i)).toBeInTheDocument();
  expect(currentProfile.assessments).toHaveLength(completedCount);
});
```

- [ ] **Step 2: Run RED**

```bash
npm --prefix apps/web test -- src/components/career/assessment-result-v2.test.tsx src/components/career/assessment-attempt-review.test.tsx src/components/career/assessment-runner.test.tsx
```

- [ ] **Step 3: Implement Result v2 hierarchy**

Render in this order:

1. Diagnosis — observed level + confidence + deterministic one-paragraph interpretation.
2. Demonstrated — localized strong signals.
3. Strengthen next — criterion-level user-facing gap labels.
4. Your next step — study card when reviewed mapping exists; otherwise transparent “no curated study module available” copy.
5. Actions — Review challenges, Try again, Back to assessments.

The primary CTA is Study now when `kind === "study"`. When recommendation is `kind === "prove"`, primary CTA routes to the relevant assessment/evidence surface and does not tell the user to restudy the same module.

- [ ] **Step 4: Implement read-only attempt review**

`AssessmentAttemptReview` renders each challenge, the selected response/order, correct/incorrect state, and the explanation already available from `assessment-learning-feedback.ts`. It has one explicit `Back to result` control. It does not expose editable inputs and never creates an `AssessmentResponses` artifact.

- [ ] **Step 5: Run GREEN and assessment regression suite**

```bash
npm --prefix apps/web test -- src/components/career/assessment-result-v2.test.tsx src/components/career/assessment-attempt-review.test.tsx src/components/career/assessment-runner.test.tsx src/components/career/assessment-learning-runner.test.tsx src/components/career/assessment-review-regressions.test.tsx src/lib/career/assessment-review-regressions.test.ts
npm run web:typecheck
npm run web:lint
```

- [ ] **Step 6: Slice 4 full verification and Draft PR**

Visual QA must include: correct result, incorrect result, study CTA, Review challenges, return to result, retry with fresh option order, direct Back to assessments, PT-BR/EN, and mobile/narrow layout.

---

## Slice 5 — Overview, next action, Roadmap, and legacy-learning cleanup

### Task 9: Make Overview/Next Action distinguish study from proof

**Files:**
- Modify: `apps/web/src/lib/career/guidance.ts`
- Modify: `apps/web/src/lib/career/guidance-copy.ts`
- Modify: `apps/web/src/lib/career/guidance.test.ts`
- Modify: `apps/web/src/components/career/career-next-action.tsx`
- Modify: `apps/web/src/components/career/career-overview.tsx`
- Create or modify: `apps/web/src/components/career/career-overview.test.tsx`
- Modify: `apps/web/src/styles/career-overview.css`

**Interfaces:**
- Add `CareerNextAction` variants for `study-gap` and `prove-studied-capability` or equivalent discriminated variants; do not collapse them into a generic link.
- Baseline completion remains the first gate. After baseline, deterministic learning recommendation may outrank generic Roadmap/Market actions according to the approved priority model.

- [ ] **Step 1: RED guidance priority**

```ts
it("recommends study after baseline when a blocking gap has reviewed learning", () => {
  expect(getCareerNextAction(profileWithBaselineAndTypeScriptGap(), "pt-BR")).toMatchObject({
    kind: "study-gap",
  });
});

it("recommends proof instead of restudy when the mapped module is studied", () => {
  expect(getCareerNextAction(profileWithStudiedTypeScriptGap(), "pt-BR")).toMatchObject({
    kind: "prove-studied-capability",
  });
});
```

- [ ] **Step 2: RED capability-row language**

Assert row states can display:

```text
Lacuna de capacidade · Estudar
Estudado · Falta comprovar
Lacuna de evidência · Adicionar evidência
Alinhada
```

and that learning progress never changes the Overview readiness percentage.

- [ ] **Step 3: Implement and run GREEN**

```bash
npm --prefix apps/web test -- src/lib/career/guidance.test.ts src/components/career/career-overview.test.tsx
npm run web:typecheck
```

### Task 10: Move Roadmap to Profile v2 learning progress and remove legacy completion storage

**Files:**
- Modify: `apps/web/src/components/career/career-roadmap.tsx`
- Modify: `apps/web/src/components/career/career-roadmap.test.tsx`
- Modify: `apps/web/src/lib/career/learning-recommendations.ts`
- Modify: `apps/web/src/lib/career/learning-recommendations.test.ts`
- Modify: `apps/web/src/styles/career-roadmap.css`
- Modify: `apps/web/src/lib/career/learning.ts`
- Delete: `apps/web/src/components/career/learning-unit.tsx`
- Modify: `apps/web/src/styles/career-learning-evidence.css`
- Modify/delete obsolete tests that assert `supportingActivityId` as learning completion, while preserving tests that still protect Roadmap compatibility.

**Interfaces:**
- `getMilestoneLearningModules(profile, milestoneId)` derives modules from `RoadmapMilestoneDefinition.requirements`: for each requirement, find the note for its competency and the module whose criterion level equals the milestone `targetLevel`.
- Roadmap renders learning state from `profile.learningProgress` and links into Learning; it does not mutate learning progress itself.

- [ ] **Step 1: RED Roadmap integration**

```ts
it("shows reviewed learning preparation from profile learningProgress", () => {
  renderRoadmap(profileWithCurrentTypedModelingMilestone());
  expect(screen.getByText(/antes de comprovar este marco/i)).toBeInTheDocument();
  expect(screen.getByText(/modelagem de aplicações com typescript/i)).toBeInTheDocument();
});

it("does not complete the milestone when all recommended learning is studied", () => {
  const profile = profileWithStudiedMilestoneLearning();
  const view = currentMilestoneView(profile);
  expect(view.status).not.toBe("completed");
});
```

- [ ] **Step 2: Replace embedded LearningUnit UI**

Roadmap displays a compact preparation block with module state and `Continue learning` links. Remove `completeLearningUnit`, `isLearningUnitCompleted`, `milestoneUnitIds`, and `.career-learning-unit` UI once all usages are gone. `roadmap.supportingActivityId` may remain in `RoadmapState` for compatibility in this slice, but no learning code writes to it.

- [ ] **Step 3: Run GREEN and prove no regression in Roadmap engine**

```bash
npm --prefix apps/web test -- src/components/career/career-roadmap.test.tsx src/lib/career/learning-recommendations.test.ts src/lib/career/roadmap-engine.test.ts src/lib/career/assessment-roadmap-integration.test.ts
npm run web:typecheck
npm run web:lint
```

- [ ] **Step 4: Slice 5 full verification and Draft PR**

Run root/web gates and visually verify Overview + Roadmap in both locales.

---

## Slice 6 — Complete 14-competency content coverage and Guide methodology

### Task 11: Author the remaining eight Core Notes with reviewed source governance

**Files:**
- Modify: `apps/web/src/lib/career/learning-catalog.ts`
- Modify: `apps/web/src/lib/career/learning-source-catalog.ts`
- Modify: `apps/web/src/lib/career/learning-validation.test.ts`
- Create: `apps/web/src/lib/career/learning-full-coverage.test.ts`

**Interfaces:**
- Final catalog has exactly 14 notes, one per `competencyIds` value.
- Each note has exactly four criterion modules matching its competency definition’s four criteria.

- [ ] **Step 1: Write the final coverage RED**

```ts
it("covers every canonical competency exactly once", () => {
  expect(learningNoteCatalog).toHaveLength(competencyIds.length);
  expect(new Set(learningNoteCatalog.map((note) => note.competencyId))).toEqual(
    new Set(competencyIds),
  );
});

it("covers every canonical criterion with one reviewed module", () => {
  for (const definition of competencyDefinitions) {
    const note = getLearningNoteByCompetency(definition.id);
    expect(note).toBeDefined();
    expect(note?.modules.map((module) => module.criterionId)).toEqual(
      definition.criteria.map((criterion) => criterion.id),
    );
    expect(note?.modules.every((module) => module.reviewStatus === "reviewed")).toBe(true);
  }
});
```

- [ ] **Step 2: Author the remaining competency notes against these source families**

| Competency | Preferred source anchors | Primary-source policy |
| --- | --- | --- |
| `web-platform-foundations` | WHATWG HTML `https://html.spec.whatwg.org/`; Fetch `https://fetch.spec.whatwg.org/`; MDN Web Platform docs | required |
| `ui-component-modeling` | React “Thinking in React” `https://react.dev/learn/thinking-in-react`; React component/props docs | required for React-specific claims; keep generic claims framed as Career Lab synthesis |
| `state-data-flow` | React “Choosing the State Structure” `https://react.dev/learn/choosing-the-state-structure`; “Sharing State Between Components” `https://react.dev/learn/sharing-state-between-components`; “You Might Not Need an Effect” `https://react.dev/learn/you-might-not-need-an-effect` | required |
| `node-runtime-foundations` | Node.js Learn event loop `https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick`; Node API docs `https://nodejs.org/api/` | required |
| `relational-data-modeling` | PostgreSQL constraints `https://www.postgresql.org/docs/current/ddl-constraints.html`; transactions `https://www.postgresql.org/docs/current/tutorial-transactions.html`; indexes `https://www.postgresql.org/docs/current/indexes.html` | required |
| `application-security-foundations` | OWASP Cheat Sheet Series `https://cheatsheetseries.owasp.org/`; OWASP ASVS `https://owasp.org/www-project-application-security-verification-standard/` | not-available; explain that the cross-stack competency has no single normative implementation specification |
| `architecture-boundaries` | Microsoft Azure Architecture Center `https://learn.microsoft.com/en-us/azure/architecture/`; Martin Fowler architecture articles only as supplementary pedagogical material | not-available; explain that architecture-boundary trade-offs are design guidance rather than one normative standard |
| `professional-evidence` | GitHub profile/README documentation `https://docs.github.com/en/account-and-profile`; GitHub repository documentation guidance | not-available; label portfolio/evidence criteria as Career Lab methodology, not a universal technical standard |

Before marking a module reviewed, verify that the linked page is current and that the note’s claim is actually supported. If an anchor no longer supports the claim, replace it with another authoritative source in the same review before committing; do not downgrade authority silently.

- [ ] **Step 3: Author level-specific content**

For every one of the 32 new modules (8 competencies × 4 levels), derive the teaching target directly from `CompetencyDefinition.criteria[level].description`. Each module must contain distinct level-appropriate EN/PT-BR explanation, misconception, practice, at least two consolidation criteria, and sources. Examples should stay minimal and executable/readable without syntax highlighting.

- [ ] **Step 4: Run full catalog GREEN**

```bash
npm --prefix apps/web test -- src/lib/career/learning-validation.test.ts src/lib/career/learning-full-coverage.test.ts src/lib/career/learning-recommendations.test.ts
npm run web:typecheck
```

### Task 12: Add “How learning works” to Guide and finalize product language

**Files:**
- Modify: `apps/web/src/lib/career/guidance-copy.ts`
- Modify: `apps/web/src/components/career/career-guide.tsx`
- Modify: `apps/web/src/components/career/career-guide.test.tsx`
- Modify: `apps/web/src/components/career/career-lab-shell.tsx`
- Modify: `apps/web/src/lib/career/copy.ts`
- Modify: `apps/web/src/app/[locale]/(career)/career-lab/layout.tsx`
- Modify: `apps/web/src/styles/career-guidance.css`

- [ ] **Step 1: RED methodology communication**

Assert Guide communicates all six required points in both locales: study vs proficiency, deterministic recommendations, source selection, meaning of reviewed, study-to-evidence handoff, local-first storage.

- [ ] **Step 2: Implement the methodology section**

Use one editorial section, not repeated disclaimers. Shell/masthead copy becomes:

```text
EN: A local-first workspace to understand your capabilities, learn what is missing, and turn growth into professional evidence.
PT-BR: Um workspace local-first para entender suas capacidades, aprender o que falta e transformar evolução em evidência profissional.
```

The compact product promise may appear near Career Lab identity:

```text
Assess. Learn. Practice. Prove. Grow.
Avalie. Aprenda. Pratique. Comprove. Evolua.
```

Do not add a marketing hero inside the workspace.

- [ ] **Step 3: Run GREEN**

```bash
npm --prefix apps/web test -- src/components/career/career-guide.test.tsx src/components/career/career-lab-shell.test.tsx src/lib/career/learning-full-coverage.test.ts
npm run web:typecheck
npm run web:lint
```

- [ ] **Step 4: Slice 6 full verification and Draft PR**

Run all root/web gates. Manually spot-check at least one Core Note from each source-governance class: primary-required, primary-not-available with institutional source, and primary-not-available with Career Lab methodology.

---

## Slice 7 — Final QA, accessibility, and cross-flow verification

### Task 13: Add cross-flow regression tests and fix only discovered defects

**Files:**
- Create: `apps/web/src/components/career/career-learning-flow.test.tsx`
- Modify only files required by actual failures found during this QA slice.
- Add CSS regression tests only when a specific interaction/motion contract cannot be protected meaningfully through DOM tests.

- [ ] **Step 1: Add one end-to-end component-level happy-path regression**

The test should execute this product loop using in-memory CareerStorage:

```text
Create/import Profile v2
-> complete an assessment with a known criterion gap
-> see Result v2 study recommendation
-> open mapped Core Note
-> mark practice/module studied
-> assert readiness unchanged
-> return to Overview and see Studied · Needs proof
-> return to assessment/evidence path
-> export/import profile
-> assert learningProgress survives
```

Use real domain functions/catalog entries, not mocks for recommendation logic.

- [ ] **Step 2: Add keyboard/semantic regressions**

Protect:

- six numbered shell links and unnumbered Guide;
- module index uses links;
- module completion uses buttons;
- source links have descriptive names;
- Result actions are distinguishable by role/name;
- semantic status contains text, not color-only state;
- review mode has no editable assessment inputs;
- `prefers-reduced-motion` CSS keeps critical content visible.

- [ ] **Step 3: Run focused RED/GREEN and fix only proven defects**

```bash
npm --prefix apps/web test -- src/components/career/career-learning-flow.test.tsx src/components/career/career-lab-shell.test.tsx src/components/career/career-learning-index.test.tsx src/components/career/career-learning-note.test.tsx src/components/career/assessment-result-v2.test.tsx
```

Do not add unrelated refactors during this slice.

- [ ] **Step 4: Run final local verification**

From repository root:

```bash
npm test
npm run validate
npm run web:test
npm run web:typecheck
npm run web:lint
npm run web:build
```

Record the exact root test count, web Vitest count/file count, catalog validation (`60 skills / 12 packs` unless the repository intentionally changed elsewhere), and static page count from the build. Treat any unexpected change as a regression until explained.

- [ ] **Step 5: Obtain CI evidence on both supported runners**

Open/update the final Draft PR and wait for the actual GitHub Actions checks. Inspect Ubuntu and Windows jobs, including installer smoke checks when the repository workflow runs them. Do not infer CI success from local success.

- [ ] **Step 6: Manual visual QA checklist**

Verify at minimum:

```text
PT-BR + EN
Desktop + narrow/mobile
Overview with unstudied gap
Overview with studied/not-proved gap
Learning index with recommendation
Learning index without profile
TypeScript Core Note with code block and sources
A Core Note with incomplete/draft coverage if such state remains in branch history tests
Assessment Result with study recommendation
Assessment Review mode
Assessment Try again with new shuffle
Roadmap preparation block
Guide learning methodology
Dark + light theme if Career Lab inherits both
Reduced-motion preference
```

- [ ] **Step 7: Final spec/quality review**

Compare implementation against every section of `docs/superpowers/specs/2026-09-11-career-lab-learning-system-design.md`. Explicitly confirm these negative contracts before marking ready:

```text
No runtime AI lessons
No proficiency/readiness increase from study
No evidence from practice checkboxes
No persisted raw answer-by-answer assessment history
No cloud/auth/billing work
No renamed existing Career Lab URL
No course gamification/certification language
No unreviewed module recommendation
```

- [ ] **Step 8: Commit QA fixes and leave PR unmerged**

Use a semantic commit describing only defects actually fixed, for example:

```bash
git commit -m "fix: harden Career learning cross-flow UX"
```

Update the PR body with fresh verification evidence and the visual-QA status. The terminal state is **ready for user review**, not merged.

---

## Plan Self-Review

### Spec coverage

- Product identity and six-step navigation: Slices 3 and 6.
- Curated Core Note/module/source model: Slices 1, 2, and 6.
- Module-level source governance and review freshness: Slices 1, 2, and 6.
- Profile v2/exportable learning progress: Slice 1.
- Strict studied-vs-proved semantics: Slices 1, 4, 5, and final QA.
- Deterministic recommendations: Slice 2, consumed by Slices 3–5.
- Learning index and Core Note reader: Slice 3.
- Assessment Result v2/review/retry/back: Slice 4.
- Overview and Roadmap integration: Slice 5.
- Guide methodology and all 14 Core Notes: Slice 6.
- Accessibility, localization, visual constraints, and end-to-end verification: Slice 7.
- All out-of-scope exclusions are repeated as final negative contracts in Slice 7.

### Type consistency

The plan uses one `LearningProgressRecord`, one `LearningNote`/`LearningModule`/`LearningSource` model, one discriminated `LearningRecommendation`, and one source of learning completion (`CareerProfile.learningProgress`). `roadmap.supportingActivityId` is never written by the new learning system and is not treated as canonical after Slice 5.

### Execution rule

After each slice PR is GREEN and reviewed, stop and request explicit merge authorization. The next slice starts only from the latest merged `main`, preventing a seven-slice stacked branch from becoming the source of truth.
