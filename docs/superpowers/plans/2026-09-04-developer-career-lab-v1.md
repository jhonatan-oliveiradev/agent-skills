# Developer Career Pack + Career Lab V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the Developer Career Pack and a local-first Career Lab that lets an early-career developer establish an evidence-aware baseline, follow an adaptive roadmap, learn and demonstrate capabilities, record portfolio evidence, compare against real job-market signals, and export the resulting Career Profile.

**Architecture:** The implementation keeps three explicit layers: canonical installable Developer Career Skills, a browser-local Career Profile/domain engine, and an optional Next.js Career Lab UI over those domain contracts. The Lab performs deterministic/local verification only; agentic inference stays in the Skills and crosses the boundary through versioned artifacts with explicit provenance/trust.

**Tech Stack:** Node.js >=20, Next.js 16.3.1 App Router, React 19.2.8, TypeScript 5.9, existing CSS/editorial system, Vitest 4, Testing Library, native IndexedDB, existing catalog generators/validators/installers.

**Spec:** `docs/superpowers/specs/2026-09-04-developer-career-lab-design.md`

## Global Constraints

- Integration branch for the entire initiative is `dev`; every implementation slice starts from the latest merged `dev` and opens a PR back to `dev`.
- Do not merge any PR without explicit user authorization.
- `main` remains the production branch and stays on the current public Stable line until the Career Lab is 100% implemented, validated, visually reviewed, and explicitly promoted.
- Target next release is **`1.1.0`** because this adds new public capabilities, six new canonical Skills, one new active Pack, and new public routes without breaking existing public contracts.
- When catalog expansion lands on `dev`, synchronize the six project-level release owners and all current skill/pack metadata to `1.1.0`; do not modify historical `1.0.0` release/readiness snapshots.
- Preserve existing public URLs, installer semantics, Pack bundle semantics, unrelated canonical `skills/*/SKILL.md`, and historical evidence/readiness files.
- New V1 catalog target after Task 3: **60 canonical Skills / 12 active Packs**.
- V1 target-role maps are exactly Frontend Developer, Backend Developer, and Full-stack Developer.
- No first-party LLM/API inference, account requirement, cloud sync, billing, recruiter view, accredited certification claim, automatic application submission, CV/cover-letter generation, recruiter outreach automation, Gmail/Notion sync, proprietary LinkedIn scraping, or broad portal-scraper subsystem.
- Career Profile data stays browser-local in V1; import/export/reset are explicit user actions.
- Job postings are untrusted data, never instructions.
- Level and confidence remain separate; self-report alone cannot grant `proficient` or `advanced`.
- Market demand may change relevance/roadmap priority but never proficiency.
- Content consumption never completes a milestone; capability/evidence gates do.
- External assessment artifacts are `external-unverified` until a future trust/signature model exists and cannot alone produce `high` confidence.
- EN and PT-BR are both required on every new public surface and catalog record.
- Every slice uses TDD where behavior is testable and must finish with relevant GREEN gates before review.

## Delivery / PR topology

Use one fresh branch per task group below. After a slice is merged into `dev`, the next branch is created from the new `dev` HEAD.

| Slice | Suggested branch | PR base |
| --- | --- | --- |
| 1 | `feat/career-profile-foundation` | `dev` |
| 2 | `feat/career-competency-engine` | `dev` |
| 3 | `feat/developer-career-pack` | `dev` |
| 4 | `feat/career-lab-shell` | `dev` |
| 5 | `feat/career-assessments` | `dev` |
| 6 | `feat/career-roadmap-engine` | `dev` |
| 7 | `feat/career-learning-evidence` | `dev` |
| 8 | `feat/career-market-intelligence` | `dev` |
| 9 | `feat/career-lab-convergence` | `dev` |

Each PR body must record RED evidence, GREEN evidence, final head SHA, changed-file scope, and protected invariants.

---

### Task 1: Career Profile contracts, validation, migrations, and local persistence

**Files:**
- Create: `apps/web/src/lib/career/types.ts`
- Create: `apps/web/src/lib/career/profile.ts`
- Create: `apps/web/src/lib/career/schema.ts`
- Create: `apps/web/src/lib/career/migrations.ts`
- Create: `apps/web/src/lib/career/storage.ts`
- Create: `apps/web/src/lib/career/schema.test.ts`
- Create: `apps/web/src/lib/career/storage.test.ts`
- Create: `apps/web/src/lib/career/profile.test.ts`

**Interfaces:**
- Produces `CAREER_PROFILE_SCHEMA_VERSION = "1"`.
- Produces `CareerProfile`, `CompetencyState`, `AssessmentRecord`, `EvidenceRecord`, `RoadmapState`, `MarketSample`, and `DecisionRecord` types.
- Produces `createEmptyCareerProfile(input): CareerProfile`.
- Produces `parseCareerProfile(value: unknown): CareerProfile` and `parseCareerArtifact(value: unknown): CareerArtifact`.
- Produces `migrateCareerProfile(value: unknown): CareerProfile`.
- Produces `CareerStorage` plus `createIndexedDbCareerStorage()`.
- Later UI tasks consume these interfaces without reaching directly into IndexedDB.

- [ ] **Step 1: Define the failing schema/profile tests**

Create `schema.test.ts` with exact invariants:

```ts
import { describe, expect, it } from "vitest";
import { createEmptyCareerProfile } from "./profile";
import { parseCareerProfile } from "./schema";

it("round-trips the V1 Career Profile contract", () => {
  const profile = createEmptyCareerProfile({
    targetRole: "frontend-developer",
    targetMarket: "br",
    weeklyStudyHours: 8,
  });

  expect(parseCareerProfile(profile)).toEqual(profile);
});

it("rejects an unknown schema version instead of mutating local state", () => {
  expect(() => parseCareerProfile({ schemaVersion: "99" })).toThrow(/unsupported career profile schema/i);
});

it("keeps imported external assessment evidence explicitly unverified", () => {
  const profile = parseCareerProfile({
    ...createEmptyCareerProfile({ targetRole: "frontend-developer", targetMarket: "br" }),
    evidence: [{
      id: "ev-1",
      competencyId: "programming-javascript",
      class: "E3",
      sourceType: "assessment",
      trust: "external-unverified",
      observedAt: "2026-09-04",
      summary: "Imported implementation assessment",
    }],
  });

  expect(profile.evidence[0]?.trust).toBe("external-unverified");
});
```

- [ ] **Step 2: Run the targeted tests and capture RED**

Run:

```bash
npm --prefix apps/web test -- src/lib/career/schema.test.ts src/lib/career/profile.test.ts
```

Expected: FAIL because the career modules do not exist.

- [ ] **Step 3: Define the V1 domain types**

Create `types.ts` with these public unions and shapes:

```ts
export type TargetRoleId =
  | "frontend-developer"
  | "backend-developer"
  | "fullstack-developer";

export type ProficiencyLevel = "foundation" | "developing" | "proficient" | "advanced";
export type ConfidenceLevel = "low" | "medium" | "high";
export type EvidenceClass = "E0" | "E1" | "E2" | "E3" | "E4";
export type EvidenceTrust = "local-deterministic" | "external-unverified" | "user-claimed";
export type MilestoneStatus =
  | "locked"
  | "available"
  | "in-progress"
  | "ready-for-assessment"
  | "completed";

export interface CompetencyState {
  readonly competencyId: string;
  readonly level: ProficiencyLevel | null;
  readonly confidence: ConfidenceLevel;
  readonly evidenceIds: readonly string[];
  readonly lastAssessedAt: string | null;
}

export interface EvidenceRecord {
  readonly id: string;
  readonly competencyId: string;
  readonly class: EvidenceClass;
  readonly sourceType: "self-report" | "assessment" | "portfolio" | "practice";
  readonly trust: EvidenceTrust;
  readonly observedAt: string;
  readonly summary: string;
  readonly sourceUrl?: string;
}

export interface CareerProfile {
  readonly schemaVersion: "1";
  readonly targetRoles: readonly TargetRoleId[];
  readonly targetMarkets: readonly string[];
  readonly weeklyStudyHours: number | null;
  readonly competencies: readonly CompetencyState[];
  readonly assessments: readonly AssessmentRecord[];
  readonly roadmap: RoadmapState;
  readonly evidence: readonly EvidenceRecord[];
  readonly marketSamples: readonly MarketSample[];
  readonly decisionRecords: readonly DecisionRecord[];
  readonly createdAt: string;
  readonly updatedAt: string;
}
```

Define the referenced `AssessmentRecord`, `RoadmapState`, `MarketSample`, and `DecisionRecord` in the same file so later tasks never create parallel definitions.

- [ ] **Step 4: Implement profile creation and strict V1 parsing**

`profile.ts` exports `createEmptyCareerProfile()` and always initializes arrays empty, `roadmap` with no current focus, and ISO-date timestamps.

`schema.ts` must fail closed on missing required keys, malformed arrays, invalid enum values, or unsupported versions. It must not silently coerce `"8"` to `8` or invent missing target roles.

Use small explicit assertion helpers rather than introducing a validation dependency:

```ts
function assertRecord(value: unknown, label: string): asserts value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label}: expected object`);
  }
}

function assertString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label}: expected non-empty string`);
  }
}
```

- [ ] **Step 5: Implement migrations as an explicit boundary**

`migrations.ts` exports:

```ts
export function migrateCareerProfile(value: unknown): CareerProfile {
  const record = asRecord(value);
  if (record.schemaVersion === "1") return parseCareerProfile(record);
  throw new Error(`Unsupported career profile schema: ${String(record.schemaVersion)}`);
}
```

Do not add speculative V2 migrations. The file exists so future migrations have one owner.

- [ ] **Step 6: Write the failing storage tests**

Test the storage through the `CareerStorage` contract, not React:

```ts
export interface CareerStorage {
  load(): Promise<CareerProfile | null>;
  save(profile: CareerProfile): Promise<void>;
  clear(): Promise<void>;
}
```

Add tests proving save/load, clear, and parse-before-save behavior. Expose `createMemoryCareerStorage()` from `storage.ts` strictly for deterministic tests and non-browser callers; `createIndexedDbCareerStorage()` remains the production default.

- [ ] **Step 7: Implement the IndexedDB adapter**

Use one database and one object store:

```ts
const DB_NAME = "agent-skills-career-lab";
const DB_VERSION = 1;
const STORE_NAME = "career-profile";
const ACTIVE_PROFILE_KEY = "active";
```

`save()` must validate with `parseCareerProfile` before opening a write transaction. `load()` must migrate/parse before returning. `clear()` removes only the active Career Lab profile, not unrelated browser data.

- [ ] **Step 8: Run Task 1 GREEN gates**

```bash
npm --prefix apps/web test -- src/lib/career
npm run web:typecheck
npm run web:lint
```

Expected: PASS.

- [ ] **Step 9: Commit the slice**

```bash
git add apps/web/src/lib/career
git commit -m "feat: add Career Profile domain foundation"
```

Open PR `feat/career-profile-foundation -> dev`; do not merge without explicit authorization.

---

### Task 2: Competency, evidence, confidence, role maps, and readiness engine

**Files:**
- Create: `apps/web/src/lib/career/competencies.ts`
- Create: `apps/web/src/lib/career/evidence.ts`
- Create: `apps/web/src/lib/career/role-maps.ts`
- Create: `apps/web/src/lib/career/readiness.ts`
- Create: `apps/web/src/lib/career/competencies.test.ts`
- Create: `apps/web/src/lib/career/readiness.test.ts`

**Interfaces:**
- Produces `CompetencyDefinition`, `CapabilityCriterion`, `RoleCapabilityMap`.
- Produces `deriveCompetencyState(definition, evidence): CompetencyState`.
- Produces `deriveEvidenceConfidence(evidence): ConfidenceLevel`.
- Produces `getRoleMap(roleId): RoleCapabilityMap`.
- Produces `calculateRoleReadiness(profile, roleMap): RoleReadiness`.

- [ ] **Step 1: Write RED tests for evidence gates**

Required cases:

```ts
it("never promotes self-report alone to proficient", () => {
  const state = deriveCompetencyState(programmingJavaScript, [selfReport("programming-javascript")]);
  expect(state.level).not.toBe("proficient");
  expect(state.level).not.toBe("advanced");
});

it("does not average away a failed blocking performance dimension", () => {
  const state = deriveCompetencyState(testingBehavior, [
    knowledgeEvidence("advanced"),
    reasoningEvidence("advanced"),
    performanceEvidence("foundation"),
  ]);
  expect(state.level).toBe("developing");
});

it("reduces confidence for old evidence without erasing the demonstrated level", () => {
  const state = deriveCompetencyState(programmingJavaScript, [oldPerformanceEvidence("proficient")]);
  expect(state.level).toBe("proficient");
  expect(state.confidence).not.toBe("high");
});
```

Run the test file and capture RED.

- [ ] **Step 2: Author the initial capability-oriented competency catalog**

`competencies.ts` must define stable capabilities rather than framework trends. V1 IDs:

```ts
export const competencyIds = [
  "programming-javascript",
  "programming-typescript",
  "web-platform-foundations",
  "ui-component-modeling",
  "state-data-flow",
  "web-accessibility",
  "http-api-engineering",
  "node-runtime-foundations",
  "relational-data-modeling",
  "testing-behavior",
  "git-collaboration",
  "application-security-foundations",
  "architecture-boundaries",
  "professional-evidence",
] as const;
```

Each definition carries criteria for `foundation`, `developing`, `proficient`, and `advanced`, plus `blockingEvidenceClasses` for levels that require performance/authentic evidence.

- [ ] **Step 3: Implement evidence-strength and confidence derivation**

`evidence.ts` must explicitly order classes `E0 < E1 < E2 < E3 < E4` and cap trust:

```ts
export function maxLevelAllowedByEvidence(records: readonly EvidenceRecord[]): ProficiencyLevel | null {
  if (records.every((record) => record.class === "E0")) return "developing";
  if (!records.some((record) => record.class === "E3" || record.class === "E4")) return "developing";
  return "advanced";
}
```

The actual level remains criterion/gate driven; this helper only prevents invalid promotion.

`external-unverified` evidence may contribute to level with explicit provenance but must cap derived confidence below `high` when it is the only performance evidence.

- [ ] **Step 4: Write RED role-map tests**

Tests must prove:
- exactly three V1 role maps exist;
- every role requirement references a canonical competency ID;
- no prerequisite cycle exists;
- Frontend includes accessibility/UI/state; Backend includes HTTP/runtime/data; Full-stack includes both families;
- stable role baselines do not require React, Next.js, Playwright, or a cloud vendor by name.

- [ ] **Step 5: Implement the three role maps**

Use `requiredLevel` and `weight` only as internal ordering aids; hard blockers remain explicit:

```ts
export interface RoleRequirement {
  readonly competencyId: string;
  readonly requiredLevel: ProficiencyLevel;
  readonly required: boolean;
}
```

- [ ] **Step 6: Implement explainable readiness**

`calculateRoleReadiness()` returns:

```ts
export interface RoleReadiness {
  readonly roleId: TargetRoleId;
  readonly percentage: number;
  readonly demonstrated: readonly string[];
  readonly capabilityGaps: readonly string[];
  readonly evidenceGaps: readonly string[];
  readonly blockingGaps: readonly string[];
}
```

The percentage is secondary. Tests must assert the named gap arrays, not only the number.

- [ ] **Step 7: Run Task 2 GREEN gates and commit**

```bash
npm --prefix apps/web test -- src/lib/career/competencies.test.ts src/lib/career/readiness.test.ts
npm run web:typecheck
npm run web:lint
git add apps/web/src/lib/career
git commit -m "feat: add competency and readiness engine"
```

Open PR `feat/career-competency-engine -> dev`; do not merge without explicit authorization.

---

### Task 3: Developer Career Pack, canonical Skills, catalog expansion, and `1.1.0` development line

**Files:**
- Create: `skills/assessing-developer-proficiency/SKILL.md`
- Create: `skills/building-developer-career-roadmaps/SKILL.md`
- Create: `skills/teaching-developer-concepts/SKILL.md`
- Create: `skills/evaluating-developer-proficiency/SKILL.md`
- Create: `skills/designing-developer-portfolio-evidence/SKILL.md`
- Create: `skills/analyzing-developer-career-opportunities/SKILL.md`
- Create matching metadata under `catalog/skills/*.json`
- Create: `catalog/packs/developer-career.json`
- Modify: `catalog/schemas/skill.schema.json`
- Modify: `VERSION`
- Modify: `package.json`
- Modify: `.codex-plugin/plugin.json`
- Modify: `catalog/catalog.json`
- Modify: `apps/web/package.json`
- Modify: `apps/web/package-lock.json`
- Modify: all existing `catalog/skills/*.json` and `catalog/packs/*.json` **version field only** to `1.1.0`
- Modify: `scripts/release-readiness.test.mjs`
- Create: `scripts/developer-career-pack.test.mjs`
- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Regenerate: `catalog/generated/catalog.json`
- Sync: `apps/web/src/generated/catalog.json`

**Interfaces:**
- Adds category `developer-career`.
- Adds active Pack slug `developer-career` in this order:
  1. `assessing-developer-proficiency`
  2. `building-developer-career-roadmaps`
  3. `teaching-developer-concepts`
  4. `evaluating-developer-proficiency`
  5. `designing-developer-portfolio-evidence`
  6. `analyzing-developer-career-opportunities`
- Moves current development catalog to 60 Skills / 12 active Packs / version `1.1.0` on `dev` while historical Stable evidence remains `1.0.0`.

- [ ] **Step 1: Establish RED catalog/Pack contracts**

Create `scripts/developer-career-pack.test.mjs` that asserts:

```js
assert.equal(pack.slug, "developer-career");
assert.equal(pack.status, "active");
assert.deepEqual(pack.skills, [
  "assessing-developer-proficiency",
  "building-developer-career-roadmaps",
  "teaching-developer-concepts",
  "evaluating-developer-proficiency",
  "designing-developer-portfolio-evidence",
  "analyzing-developer-career-opportunities",
]);
```

Also assert each canonical Skill exists, has concise discovery-first frontmatter, has bilingual metadata, lists `developer-career`, and installs independently through the real installer.

Update only the **current-state** assertions in `release-readiness.test.mjs` to expect 60/12 and current release owners at `1.1.0`; leave the tests for `release/stable-readiness.json` at Stable `1.0.0` unchanged.

Run:

```bash
npm test
```

Expected: RED on missing new Skills/Pack and unsynchronized next-version owners.

- [ ] **Step 2: Add `developer-career` to the catalog category schema**

Append `"developer-career"` to the existing `category.enum` in `catalog/schemas/skill.schema.json`. Do not change compatibility surface enums.

- [ ] **Step 3: Author six canonical Skills with explicit ownership boundaries**

Each `SKILL.md` follows the existing concise canonical shape: YAML `name`/`description`, Core principle, workflow, verification, avoid/boundary section, and references where external techniques materially inform the method.

Required ownership wording:
- `assessing-developer-proficiency`: current-state diagnosis and uncertainty; never roadmap sequencing or job-market priority.
- `building-developer-career-roadmaps`: milestone/dependency/current-focus decisions; never redefine proficiency criteria.
- `teaching-developer-concepts`: gap-targeted microlearning/practice; never long-form course catalog.
- `evaluating-developer-proficiency`: blueprint/rubric/evidence observation; never unconstrained model scoring.
- `designing-developer-portfolio-evidence`: project/evidence contracts; never claim competency merely because a project exists.
- `analyzing-developer-career-opportunities`: job normalization/fit/gap/market signals; never submit applications.

For `analyzing-developer-career-opportunities`, attribute/adapt the useful technique-level ideas from `MadsLorentzen/ai-job-search` rather than copying the whole product. Preserve MIT attribution if substantial implementation/text is reused.

- [ ] **Step 4: Add bilingual metadata and the active Pack manifest**

Use category `developer-career`, Pack membership `["developer-career"]`, maturity `beta`, and appropriate beginner/intermediate difficulty. Every metadata record must have EN/PT-BR use cases and example prompts.

- [ ] **Step 5: Move `dev` to the `1.1.0` release line mechanically**

Set exactly these project-level owners to `1.1.0`:
- `VERSION`
- root `package.json`
- `.codex-plugin/plugin.json`
- `catalog/catalog.json`
- `apps/web/package.json`
- `apps/web/package-lock.json` top-level and `packages[""]`

Then synchronize only the `version` field of all 60 skill metadata records and all 12 Pack manifests to `1.1.0`.

Do **not** change `release/stable-readiness.json`, `release/rc1-readiness.json`, historical changelog entries, or the existing `v1.0.0` tag/release.

- [ ] **Step 6: Update current public documentation without claiming `1.1.0` is already production Stable**

`README.md` on `dev` must state 60 Skills / 12 active Packs and add a Developer Career section. Keep the branch policy explicit: `dev` is pre-production integration; `main` is production.

Under `CHANGELOG.md > [Unreleased]`, add a `### Developer Career` group. Do not add a dated `[1.1.0]` release heading yet.

- [ ] **Step 7: Regenerate official projections and verify Pack bundles**

```bash
npm run catalog:generate
node apps/web/scripts/sync-catalog.mjs
npm run validate
npm test
npm run web:test
npm run web:typecheck
npm run web:lint
NEXT_PUBLIC_SITE_URL=https://skills.jhonatanoliveira.com npm run web:build
```

Expected build output includes 60 Skill ZIPs and 12 Pack ZIPs for `1.1.0`.

- [ ] **Step 8: Commit and open the Pack PR**

Use semantically separate commits inside the same branch if needed:

```bash
git commit -m "test: define Developer Career Pack contracts"
git commit -m "feat: add Developer Career working methods"
git commit -m "chore: advance dev catalog to 1.1.0"
```

Open PR `feat/developer-career-pack -> dev`; final review must confirm unrelated canonical `SKILL.md` files did not change.

---

### Task 4: Career Lab route shell, provider, onboarding, import/export/reset, and overview

**Files:**
- Create: `apps/web/src/lib/career/copy.ts`
- Create: `apps/web/src/components/career/career-profile-provider.tsx`
- Create: `apps/web/src/components/career/career-lab-shell.tsx`
- Create: `apps/web/src/components/career/career-data-controls.tsx`
- Create: `apps/web/src/components/career/career-onboarding.tsx`
- Create: `apps/web/src/components/career/career-overview.tsx`
- Create: `apps/web/src/components/career/career-lab-shell.test.tsx`
- Create: `apps/web/src/components/career/career-onboarding.test.tsx`
- Create: `apps/web/src/components/career/career-data-controls.test.tsx`
- Create: `apps/web/src/app/[locale]/career-lab/layout.tsx`
- Create: `apps/web/src/app/[locale]/career-lab/page.tsx`
- Create: `apps/web/src/app/[locale]/career-lab/onboarding/page.tsx`
- Create: `apps/web/src/app/career-lab.css`

**Interfaces:**
- `CareerProfileProvider` exposes `{ profile, status, replaceProfile, updateProfile, resetProfile }` through `useCareerProfile()`.
- `status` is `"hydrating" | "ready" | "error"`.
- UI never imports IndexedDB directly.

- [ ] **Step 1: Write RED provider/shell/onboarding tests**

Required assertions:
- `/career-lab` can render without a profile and offers onboarding rather than requiring login;
- hydrated profile renders role/readiness/current-focus placeholders from real domain functions;
- onboarding captures current context, target role, target market, weekly hours, then creates a profile;
- import rejects invalid JSON/schema without replacing existing state;
- export uses the exact current profile JSON;
- reset requires a confirmation interaction;
- EN and PT-BR copy both exist.

- [ ] **Step 2: Implement localized copy as one typed owner**

`copy.ts` exports `careerLabCopy: Record<Locale, CareerLabCopy>` with navigation labels exactly:

```ts
["Overview", "Roadmap", "Assessments", "Evidence", "Market"]
```

and natural PT-BR equivalents. Keep Career Lab copy out of the global `messages.ts` until Task 9 cross-linking.

- [ ] **Step 3: Implement `CareerProfileProvider` hydration and persistence**

Hydrate once on mount using `createIndexedDbCareerStorage()`. Save only after status becomes `ready`; never overwrite stored data with the temporary empty hydration state.

Expose `replaceProfile()` for validated imports and `updateProfile(updater)` for domain mutations.

- [ ] **Step 4: Implement import/export/reset controls**

Export filename:

```ts
`agent-skills-career-profile-${new Date().toISOString().slice(0, 10)}.json`
```

Import path: read file text -> `JSON.parse` -> `migrateCareerProfile` -> replace profile. Any error is shown as an inline status message and leaves current profile unchanged.

- [ ] **Step 5: Implement the four-stage onboarding**

Stages:
1. current context;
2. target (`frontend-developer`, `backend-developer`, `fullstack-developer`, or undecided UI state that requires choosing before final creation);
3. market + weekly study capacity;
4. baseline diagnostic handoff.

The onboarding may create the profile before the baseline is completed, but must mark all competencies unknown/low-confidence until evidence arrives.

- [ ] **Step 6: Implement Overview with domain-derived state**

Overview displays:
- target role/market;
- role readiness summary plus named gaps;
- current focus or `No current focus yet`;
- competency states with level + confidence;
- roadmap completed/total;
- latest market sample health when present.

Never infer seniority from a raw average.

- [ ] **Step 7: Build editorial responsive styling**

`career-lab.css` must use the existing tokens/typographic system and avoid a generic sidebar-dashboard composition. Navigation is a compact horizontal/scrollable index; status is never represented by color alone.

- [ ] **Step 8: Run GREEN gates and commit**

```bash
npm --prefix apps/web test -- src/components/career
npm run web:typecheck
npm run web:lint
NEXT_PUBLIC_SITE_URL=https://skills.jhonatanoliveira.com npm run web:build
```

Commit: `feat: add local-first Career Lab shell`.

---

### Task 5: Assessment blueprints, baseline diagnostic, deterministic scoring, and assessment surfaces

**Files:**
- Create: `apps/web/src/lib/career/assessment.ts`
- Create: `apps/web/src/lib/career/assessment-blueprints.ts`
- Create: `apps/web/src/lib/career/assessment.test.ts`
- Create: `apps/web/src/components/career/assessment-list.tsx`
- Create: `apps/web/src/components/career/assessment-runner.tsx`
- Create: `apps/web/src/components/career/assessment-result.tsx`
- Create: `apps/web/src/components/career/assessment-runner.test.tsx`
- Create: `apps/web/src/app/[locale]/career-lab/assessments/page.tsx`
- Create: `apps/web/src/app/[locale]/career-lab/assessments/[id]/page.tsx`

**Interfaces:**
- Produces `AssessmentBlueprint`, `AssessmentChallenge`, `ObservedDimension`, `AssessmentResultArtifact`.
- Produces `evaluateAssessment(blueprint, responses): AssessmentResultArtifact`.
- Produces `applyAssessmentResult(profile, result): CareerProfile`.

- [ ] **Step 1: Write RED engine tests for gate-based assessment**

Required cases:

```ts
it("cannot reach proficient by averaging high theory over failed required performance", () => {
  const result = evaluateAssessment(blueprint, responsesWithFailedBlockingDimension);
  expect(result.level).toBe("developing");
});

it("keeps level and confidence separate", () => {
  const result = evaluateAssessment(blueprint, sparsePassingResponses);
  expect(result.level).toBe("proficient");
  expect(result.confidence).toBe("low");
});
```

Also test invalid/missing challenge responses and blueprint version mismatch.

- [ ] **Step 2: Implement the blueprint contract**

```ts
export interface AssessmentBlueprint {
  readonly id: string;
  readonly version: "1";
  readonly competencyId: string;
  readonly targetLevel: ProficiencyLevel;
  readonly dimensions: readonly AssessmentDimension[];
  readonly challenges: readonly AssessmentChallenge[];
  readonly gates: readonly AssessmentGate[];
}
```

Browser-native challenge kinds in V1 are deterministic only:
- `single-choice`;
- `multi-select`;
- `code-reading-choice`;
- `debugging-choice`;
- `structured-ordering`.

Do not run arbitrary user JavaScript with `eval`, `Function`, or unsandboxed execution.

- [ ] **Step 3: Author baseline blueprints**

Provide enough coverage to triage the three role maps, with focused probes for:
- JavaScript;
- TypeScript;
- web/platform foundations;
- testing behavior;
- HTTP/API engineering;
- Git/collaboration.

Baseline probes are deliberately short and may yield uncertain/low-confidence states. They are not certification.

- [ ] **Step 4: Implement result artifact and profile application**

Result shape includes:

```ts
{
  schemaVersion: "1",
  artifactType: "assessment-result",
  blueprintId,
  blueprintVersion: "1",
  competencyId,
  level,
  confidence,
  dimensions,
  evidence,
  gaps,
  provenance: { trust: "local-deterministic" }
}
```

Applying a local result appends assessment/evidence records and re-derives the competency state. Never mutate historical evidence records in place.

- [ ] **Step 5: Implement list/runner/result UI**

The runner announces progress semantically, supports keyboard interaction, preserves answers while moving between challenges, and does not expose hidden scoring keys in rendered text.

Result UI emphasizes level, confidence, strong signals, weak signals, and recommended next evidence—not a celebratory percentage.

- [ ] **Step 6: Connect onboarding baseline to assessment routes**

The final onboarding step links to the baseline assessment and Overview can surface incomplete baseline work.

- [ ] **Step 7: Run GREEN gates and commit**

```bash
npm --prefix apps/web test -- src/lib/career/assessment.test.ts src/components/career/assessment-runner.test.tsx
npm run web:typecheck
npm run web:lint
NEXT_PUBLIC_SITE_URL=https://skills.jhonatanoliveira.com npm run web:build
```

Commit: `feat: add evidence-gated career assessments`.

---

### Task 6: Adaptive roadmap engine, dependency graph, decision records, and Roadmap UI

**Files:**
- Create: `apps/web/src/lib/career/roadmap-engine.ts`
- Create: `apps/web/src/lib/career/roadmap-catalog.ts`
- Create: `apps/web/src/lib/career/roadmap-engine.test.ts`
- Create: `apps/web/src/components/career/career-roadmap.tsx`
- Create: `apps/web/src/components/career/career-roadmap.test.tsx`
- Create: `apps/web/src/app/[locale]/career-lab/roadmap/page.tsx`

**Interfaces:**
- Produces `RoadmapMilestoneDefinition`.
- Produces `buildRoadmap(profile, roleMap): RoadmapState`.
- Produces `recalculateRoadmap(profile, reason): { roadmap, decisionRecord }`.
- Produces `completeMilestoneIfEligible(profile, milestoneId): RoadmapState`.

- [ ] **Step 1: Write RED graph/gate tests**

Test:
- prerequisites unlock in order;
- market relevance cannot move a child before a real prerequisite;
- at most one primary Current Focus is selected;
- a milestone with completed learning but failed capability gate remains incomplete;
- changing target role retains already demonstrated competencies/evidence;
- meaningful reorder emits a Decision Record with before/after/reason.

- [ ] **Step 2: Author the stable milestone catalog**

Create capability-focused milestones shared across role maps. Example IDs:

```ts
[
  "programming-foundations",
  "async-application-control-flow",
  "typed-application-modeling",
  "web-interface-foundations",
  "ui-state-and-data-flow",
  "testing-real-behavior",
  "accessible-web-interfaces",
  "http-api-boundaries",
  "node-runtime-services",
  "relational-data-foundations",
  "application-security-basics",
  "architecture-boundaries",
  "portfolio-proof",
]
```

Each milestone names prerequisites, target competency levels, estimated effort range, evidence requirements, and applicable roles.

- [ ] **Step 3: Implement deterministic priority ordering**

Priority comparison order is:
1. dependency availability;
2. required target-role baseline;
3. personal capability/evidence gap;
4. market signal relevance;
5. effort/quick-win value.

Do not persist a magic score as user-facing truth. Persist the ordered milestone IDs and the explanation factors used.

- [ ] **Step 4: Implement completion and recalibration**

Completion is allowed only when every required competency reaches the milestone target and every mandatory evidence class is present.

Recalculation accepts reasons:

```ts
type RoadmapRecalculationReason =
  | "assessment"
  | "portfolio-evidence"
  | "market-update"
  | "target-change";
```

- [ ] **Step 5: Implement Roadmap UI in NOW / NEXT / MAP scales**

`career-roadmap.tsx` renders:
- NOW: one current action/milestone;
- NEXT: next 2–3 available milestones;
- MAP: complete sequence with locked/available/in-progress/assessment-ready/completed labels.

Each milestone exposes `Why now`, capability gaps, evidence gate, and effort range.

- [ ] **Step 6: Run GREEN gates and commit**

```bash
npm --prefix apps/web test -- src/lib/career/roadmap-engine.test.ts src/components/career/career-roadmap.test.tsx
npm run web:typecheck
npm run web:lint
```

Commit: `feat: add adaptive developer roadmap engine`.

---

### Task 7: Targeted learning units and professional evidence ledger

**Files:**
- Create: `apps/web/src/lib/career/learning.ts`
- Create: `apps/web/src/lib/career/learning-catalog.ts`
- Create: `apps/web/src/lib/career/portfolio-evidence.ts`
- Create: `apps/web/src/lib/career/learning.test.ts`
- Create: `apps/web/src/components/career/learning-unit.tsx`
- Create: `apps/web/src/components/career/evidence-ledger.tsx`
- Create: `apps/web/src/components/career/evidence-form.tsx`
- Create: `apps/web/src/components/career/evidence-ledger.test.tsx`
- Create: `apps/web/src/app/[locale]/career-lab/evidence/page.tsx`

**Interfaces:**
- Produces `LearningUnit` and `getLearningUnitsForMilestone()`.
- Produces `PortfolioEvidenceContract` and `buildPortfolioEvidenceContract(profile, milestoneId)`.
- Produces `addEvidence(profile, evidence): CareerProfile` followed by roadmap recalculation.

- [ ] **Step 1: Write RED learning/evidence tests**

Test that learning completion does not change competency level, while valid evidence addition may change confidence/readiness only through the competency engine.

Test an evidence contract can map one project to multiple competencies without claiming those competencies are demonstrated until evidence is recorded.

- [ ] **Step 2: Author the initial local learning catalog**

Provide concise, source-controlled units for these recurring V1 gaps:
- async JavaScript/control flow;
- TypeScript application modeling;
- testing behavior vs implementation details;
- HTTP/API boundaries;
- Git/collaboration workflow;
- accessibility fundamentals.

Each unit follows:

```ts
export interface LearningUnit {
  readonly id: string;
  readonly competencyId: string;
  readonly title: Readonly<Record<Locale, string>>;
  readonly objective: Readonly<Record<Locale, string>>;
  readonly explanation: Readonly<Record<Locale, string>>;
  readonly practice: readonly PracticePrompt[];
  readonly estimatedMinutes: number;
}
```

These are microlearning units, not long-form courses.

- [ ] **Step 3: Implement learning completion as progress-only state**

Learning completion updates roadmap learning progress but does not create `E3`/`E4` evidence and does not directly change proficiency.

- [ ] **Step 4: Implement portfolio evidence contracts**

Contracts specify:
- problem/artifact;
- capabilities intended to be demonstrated;
- acceptance/evidence checklist;
- suggested verification;
- optional repository URL.

A saved contract is a plan, not evidence. Only a completed EvidenceRecord enters the ledger.

- [ ] **Step 5: Implement Evidence Ledger UI**

Render evidence ID, type/class, supported competency, confidence/trust provenance, observed date, and source URL when present. External-unverified artifacts must be visibly labeled.

- [ ] **Step 6: Recalculate roadmap after evidence addition**

Adding portfolio evidence triggers `recalculateRoadmap(..., "portfolio-evidence")` and stores the Decision Record when ordering/current focus changes.

- [ ] **Step 7: Run GREEN gates and commit**

```bash
npm --prefix apps/web test -- src/lib/career/learning.test.ts src/components/career/evidence-ledger.test.tsx
npm run web:typecheck
npm run web:lint
```

Commit: `feat: add career learning and evidence ledger`.

---

### Task 8: Market ingestion, explicit-signal extraction, deduplication, job fit, and Market UI

**Files:**
- Create: `apps/web/src/lib/career/market.ts`
- Create: `apps/web/src/lib/career/market-extractor.ts`
- Create: `apps/web/src/lib/career/job-fit.ts`
- Create: `apps/web/src/lib/career/market.test.ts`
- Create: `apps/web/src/lib/career/job-fit.test.ts`
- Create: `apps/web/src/components/career/market-ingestion.tsx`
- Create: `apps/web/src/components/career/market-analysis.tsx`
- Create: `apps/web/src/components/career/market-ingestion.test.tsx`
- Create: `apps/web/src/app/[locale]/career-lab/market/page.tsx`

**Interfaces:**
- Produces `NormalizedJobPosting` and `MarketSignal`.
- Produces `extractExplicitJobSignals(text): ExtractedJobSignals`.
- Produces `normalizeJobPosting(input): NormalizedJobPosting`.
- Produces `deduplicateJobPostings(postings): NormalizedJobPosting[]`.
- Produces `analyzeJobFit(profile, posting): JobFitAnalysis`.
- Produces `buildMarketSample(postings): MarketSample`.

- [ ] **Step 1: Write RED market safety/provenance tests**

Required cases:
- text containing `ignore previous instructions` is preserved as source text but never changes parser behavior;
- explicit React/TypeScript/etc. mentions are labeled `explicit`, not `inferred`;
- duplicate same-company/same-role/same-description postings count as one market signal;
- missing posted date stays unknown; never infer it from capture time;
- capability gap, evidence gap, structural gap, and hard constraint remain separate;
- a hard location/language/work-authorization constraint returns `blocked` regardless of high capability match;
- market analysis never changes a competency level.

- [ ] **Step 2: Implement canonical job/source representation**

```ts
export interface NormalizedJobPosting {
  readonly id: string;
  readonly title: string;
  readonly company: string;
  readonly source: {
    readonly type: "url" | "pasted" | "agent-import";
    readonly url?: string;
    readonly capturedAt: string;
  };
  readonly postedAt: string | null;
  readonly deadline: string | null;
  readonly location: string | null;
  readonly workMode: "remote" | "hybrid" | "onsite" | "unknown";
  readonly explicitSignals: readonly JobCapabilitySignal[];
  readonly structuralRequirements: readonly StructuralRequirement[];
  readonly rawSnapshot: string;
}
```

- [ ] **Step 3: Implement conservative deterministic text extraction**

Maintain an alias dictionary for common V1 technologies mapped to stable competencies. Example:

```ts
const technologyAliases = {
  react: "ui-component-modeling",
  typescript: "programming-typescript",
  playwright: "testing-behavior",
  vitest: "testing-behavior",
  node: "node-runtime-foundations",
  postgres: "relational-data-modeling",
  postgresql: "relational-data-modeling",
} as const;
```

Text extraction may create **explicit** signals only when the token/phrase actually occurs. It must not synthesize missing requirements. Rich inferred analysis belongs to the Skill/imported artifact path.

- [ ] **Step 4: Implement job fit gap classes and hard constraints**

`JobFitAnalysis` returns:

```ts
{
  verdict: "strong-target" | "stretch-target" | "low-relevance" | "blocked",
  readinessPercentage,
  matches,
  capabilityGaps,
  evidenceGaps,
  structuralGaps,
  hardConstraints,
}
```

Hard constraints are location, work authorization, required language, work mode, mandatory credential, and availability when explicitly represented.

- [ ] **Step 5: Implement market sample health and freshness**

Report raw frequency and sample health:
- posting count;
- distinct company count;
- distinct source count;
- fresh/recent/historical/unknown date counts.

Do not freeze the illustrative freshness coefficients from brainstorming as public semantics unless tests/evidence justify them. V1 may display raw frequency plus freshness buckets.

- [ ] **Step 6: Implement URL/paste/import ingestion UI with CORS fallback**

For URL input, attempt client fetch only when possible. On network/CORS/anti-bot failure, keep the URL as provenance and show a direct fallback:

`Paste the job description or import a market-analysis artifact.`

Never claim arbitrary URLs are fetchable in-browser.

Imported `market-analysis.json` is parsed through the Career artifact validator and marked with agent-import provenance.

- [ ] **Step 7: Integrate market updates with roadmap priority only**

Saving a new market sample calls `recalculateRoadmap(..., "market-update")`. Add a regression test asserting every competency `level` is byte-for-byte unchanged by this operation.

- [ ] **Step 8: Run GREEN gates and commit**

```bash
npm --prefix apps/web test -- src/lib/career/market.test.ts src/lib/career/job-fit.test.ts src/components/career/market-ingestion.test.tsx
npm run web:typecheck
npm run web:lint
NEXT_PUBLIC_SITE_URL=https://skills.jhonatanoliveira.com npm run web:build
```

Commit: `feat: add career market intelligence`.

---

### Task 9: Pack/Lab cross-linking, global navigation, accessibility, regression convergence, and 100% `dev` readiness

**Files:**
- Modify: `apps/web/src/components/site-header.tsx`
- Modify: `apps/web/src/lib/site-chrome-copy.ts`
- Modify: `apps/web/src/lib/messages.ts`
- Modify: `apps/web/src/components/site-chrome.test.tsx`
- Modify: `apps/web/src/components/packs/pack-blueprint.tsx`
- Modify: `apps/web/src/components/packs/pack-blueprint.test.tsx`
- Modify: `apps/web/src/app/[locale]/packs/[slug]/page.tsx` only if needed for the cross-link contract
- Modify: `apps/web/src/app/sitemap.ts`
- Modify: `apps/web/src/lib/launch-metadata.test.ts`
- Modify: `apps/web/src/lib/project-pages.ts`
- Modify: `apps/web/src/lib/project-pages.test.ts`
- Modify: `CHANGELOG.md`
- Modify: `README.md`
- Add/modify focused Career Lab accessibility/structure tests under `apps/web/src/components/career/`

**Interfaces:**
- Adds `careerLab` to `SiteChromeContextKey`.
- Adds a public localized navigation link to `/{locale}/career-lab`.
- Developer Career Pack dossier links to Career Lab; Career Lab links back to the Pack.

- [ ] **Step 1: Write RED cross-link/navigation/SEO tests**

Tests must require:
- global navigation contains Career Lab in EN/PT-BR;
- `siteChromeCopy` has `careerLab` context;
- Developer Career Pack dossier exposes `Open Career Lab` / localized equivalent;
- Career Lab shell exposes `Developer Career Pack` link;
- sitemap contains both locale roots for every Career Lab public route that should be indexable;
- page metadata describes Career Lab without claiming official certification or cloud sync.

- [ ] **Step 2: Add Career Lab to shared chrome**

Update `messages.ts` navigation type/data, `site-chrome-copy.ts`, and `site-header.tsx` with a seventh primary context. Keep existing navigation architecture; do not introduce a second header.

- [ ] **Step 3: Cross-link Pack dossier and Career Lab**

Only `developer-career` gets the interactive-workspace CTA. Do not imply every Pack has a Lab.

- [ ] **Step 4: Complete accessibility and reduced-motion audit**

Verify and test:
- keyboard navigation across Career Lab index/forms/assessment choices;
- visible `:focus-visible` states;
- `aria-live` only for meaningful async/status updates;
- no status encoded by color alone;
- reduced-motion behavior for any Career Lab transition/progress visualization;
- semantic heading order;
- file input/import error labels;
- responsive layouts at mobile/tablet/desktop.

- [ ] **Step 5: Close loading/error/empty/invalid-import states**

Career Lab must have intentional states for:
- storage hydration;
- storage failure;
- no profile;
- no roadmap yet;
- no assessments yet;
- no evidence yet;
- no market data yet;
- invalid profile/artifact import;
- URL fetch failure with paste/import fallback.

Reuse the existing global loading/error visual language where appropriate instead of adding a disconnected design system.

- [ ] **Step 6: Update Unreleased documentation/current counts**

`CHANGELOG.md` and localized web changelog describe the Developer Career Pack/Career Lab under **Unreleased**. Do not publish a dated `1.1.0` entry yet.

`README.md` documents:
- 60 Skills / 12 Packs on the `dev` development line;
- Developer Career Pack membership;
- local-first Career Lab privacy/import-export model;
- `dev` integration / `main` production policy.

- [ ] **Step 7: Run the complete canonical verification on the exact final branch HEAD**

Run:

```bash
npm test
npm run validate
npm run web:test
npm run web:typecheck
npm run web:lint
NEXT_PUBLIC_SITE_URL=https://skills.jhonatanoliveira.com npm run web:build
```

Require Ubuntu and Windows `Validate skills` workflow GREEN on the final PR HEAD, including applicable Bash/PowerShell installer smoke tests.

Record exact root/web test counts and static-page count from CI logs; do not reuse counts from earlier slices.

- [ ] **Step 8: Perform final diff/invariant review against the `dev` base before the Career initiative**

Confirm:
- only the six approved new canonical Skill directories were added; unrelated canonical Skills are unchanged;
- catalog has exactly 60 Skills / 12 active Packs;
- existing 11 Pack membership is unchanged;
- all current metadata/release owners are synchronized at `1.1.0` on `dev`;
- `release/stable-readiness.json` and historical RC snapshots are byte-for-byte unchanged;
- no existing public URL was removed/renamed;
- installers still support collection, individual Skill, and Pack installation;
- Pack ZIP bundles still contain independent Skill ZIPs;
- no first-party model key/API/server persistence/login/billing code was introduced;
- Career Profile remains browser-local by default;
- no official/accredited certification claim exists.

- [ ] **Step 9: Manual visual QA on a preview/development deployment**

Review EN/PT-BR, light/dark, desktop/tablet/mobile for:
- onboarding;
- Overview;
- Roadmap NOW/NEXT/MAP;
- assessment list/runner/result;
- evidence ledger/form;
- market ingestion/analysis;
- import/export/reset;
- Pack <-> Lab cross-links;
- empty/error states.

Document visual issues as focused follow-up commits on the same convergence branch; rerun relevant tests after every fix.

- [ ] **Step 10: Open the final convergence PR to `dev` and stop before production promotion**

PR body must state that `dev` is the complete `1.1.0` development candidate and `main` is still the released `1.0.0` production line.

Do **not** open or merge `dev -> main` until the user explicitly authorizes production promotion after 100% Career Lab acceptance.

Commit final convergence work with focused messages such as:

```bash
git commit -m "feat: integrate Career Lab with Studio navigation"
git commit -m "fix: close Career Lab accessibility regressions"
git commit -m "test: close Developer Career V1 convergence gates"
```

---

## Self-review result

### Spec coverage

Every approved spec area maps to a task:
- local Career Profile, import/export, migrations -> Task 1;
- competency/evidence/confidence/readiness + three role maps -> Task 2;
- six Skills + Pack + release/catalog semantics -> Task 3;
- guest-first shell/onboarding/Overview -> Task 4;
- criterion-based assessments -> Task 5;
- adaptive dependency roadmap + Decision Records -> Task 6;
- microlearning + professional evidence -> Task 7;
- market provenance/fit/dedupe/freshness/CORS fallback -> Task 8;
- Pack/Lab cross-linking, accessibility, bilingual/SEO/visual/full CI convergence -> Task 9.

### Type consistency

The plan intentionally establishes shared types in Task 1 and requires later tasks to consume them rather than redefine parallel shapes. Assessment, roadmap, learning/evidence, and market artifacts all flow back through `CareerProfile` and the validation boundary.

### Release decision

The post-Stable release decision required by the spec is resolved as **`1.1.0`**. `dev` becomes the integration line for that next minor release when Task 3 expands the catalog; `main` and historical Stable artifacts remain `1.0.0` until explicit final promotion.

### Scope check

The feature is large but the approved architecture is one connected product loop. It is therefore executed as nine independent, reviewable PR slices rather than one monolithic implementation PR. Each slice produces testable software on its own and the next slice starts from the latest approved `dev` HEAD.
