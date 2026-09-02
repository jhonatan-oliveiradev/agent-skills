# Real-Use Evidence v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Built with Skills and release metadata into a verifiable evidence layer that distinguishes self-hosted proof from real project usage before Stable `1.0.0`.

**Architecture:** Extend the existing `built-with-skills` domain model instead of creating a parallel case-study system. Keep Stable promotion policy in `release/stable-readiness.json`, validate it from the root Node suite, and expose evidence class/project identity through the existing bilingual archive/detail UI.

**Tech Stack:** TypeScript, Next.js 16, Vitest, Node test runner, JSON release metadata.

**Spec:** `docs/superpowers/specs/2026-09-02-real-use-evidence-v1-design.md`

## Global Constraints
- Project version remains exactly `1.0.0-rc.1`.
- Catalog remains exactly 49 skills and 10 active packs.
- Existing Built with Skills cases remain historical and are classified `internal`.
- No external usage may be fabricated.
- Stable `1.0.0` is not promoted by this tranche.
- No merge without explicit user authorization.

---

### Task 1: Stable promotion policy contract

**Files:**
- Create: `release/stable-readiness.json`
- Modify: `scripts/release-readiness.test.mjs`

**Interfaces:**
- Consumes: current RC1 version and four public surface ids.
- Produces: machine-readable Stable thresholds and current `collecting-evidence` state.

- [ ] **Step 1: Write the failing root tests**

Add tests asserting that `release/stable-readiness.json` exists with:

```js
assert.equal(matrix.schemaVersion, 1);
assert.equal(matrix.candidateVersion, "1.0.0-rc.1");
assert.equal(matrix.targetVersion, "1.0.0");
assert.equal(matrix.status, "collecting-evidence");
assert.deepEqual(matrix.minimums, {
  realUseCases: 3,
  distinctProjects: 2,
  activePacksRepresented: 3,
});
assert.deepEqual(matrix.surfaces.map((surface) => surface.id), [
  "plugin",
  "catalog",
  "installers",
  "microsite",
]);
assert.ok(matrix.surfaces.every((surface) => Array.isArray(surface.realUseEvidence)));
```

Also assert that no surface is currently marked Stable-ready.

- [ ] **Step 2: Run the root suite and verify RED**

Run: `npm test`
Expected: only the new Stable-readiness tests fail because the policy file does not exist.

- [ ] **Step 3: Add the minimal policy file**

Create:

```json
{
  "schemaVersion": 1,
  "candidateVersion": "1.0.0-rc.1",
  "targetVersion": "1.0.0",
  "status": "collecting-evidence",
  "minimums": {
    "realUseCases": 3,
    "distinctProjects": 2,
    "activePacksRepresented": 3
  },
  "surfaces": [
    { "id": "plugin", "realUseEvidence": [] },
    { "id": "catalog", "realUseEvidence": [] },
    { "id": "installers", "realUseEvidence": [] },
    { "id": "microsite", "realUseEvidence": [] }
  ]
}
```

- [ ] **Step 4: Run root tests and validation**

Run: `npm test && npm run validate`
Expected: GREEN.

- [ ] **Step 5: Commit**

Commit message: `test: define stable evidence policy`

---

### Task 2: Evidence class and project identity

**Files:**
- Modify: `apps/web/src/lib/built-with-skills.ts`
- Modify: `apps/web/src/lib/built-with-skills.test.ts`

**Interfaces:**
- Produces: `BuiltWithSkillsCase.evidenceClass` and `BuiltWithSkillsCase.project`.

The public type becomes:

```ts
export interface CaseProject {
  readonly id: string;
  readonly name: string;
  readonly repository?: string;
}

export interface BuiltWithSkillsCase {
  readonly evidenceClass: "internal" | "real-use";
  readonly project: CaseProject;
  // existing fields remain unchanged
}
```

- [ ] **Step 1: Write failing Vitest contracts**

Assert that both existing cases:
- have `evidenceClass === "internal"`;
- have `project.id === "agent-skills-studio"`;
- have `project.name === "Agent Skills Studio"`;
- point to the public repository.

Add a small exported predicate/helper that enforces real-use eligibility:

```ts
export function hasInspectableRealUseEvidence(item: BuiltWithSkillsCase) {
  return item.evidenceClass !== "real-use" || item.evidence.some((entry) =>
    entry.type === "pull-request" || entry.type === "commit" || entry.type === "qa"
  );
}
```

Test that a synthetic real-use case with source-only evidence returns false.

- [ ] **Step 2: Run focused web test and verify RED**

Run: `npm --prefix apps/web test -- src/lib/built-with-skills.test.ts`
Expected: FAIL because evidence class, project identity, and helper do not exist.

- [ ] **Step 3: Implement minimal model extension**

Add the two fields to `CaseSource` and map them through `getBuiltWithSkillsCases()`. Mark both current cases internal with the Agent Skills Studio project identity.

- [ ] **Step 4: Run focused test**

Run: `npm --prefix apps/web test -- src/lib/built-with-skills.test.ts`
Expected: GREEN.

- [ ] **Step 5: Commit**

Commit message: `feat: classify built-with-skills evidence`

---

### Task 3: Public evidence labels

**Files:**
- Modify: `apps/web/src/lib/messages.ts`
- Modify: the existing Built with Skills archive/detail rendering components or route files that render case metadata.
- Modify: `apps/web/src/components/evidence/evidence-archive.test.tsx`
- Modify: `apps/web/src/components/evidence/evidence-report.test.tsx`

**Interfaces:**
- Consumes: `BuiltWithSkillsCase.evidenceClass` and localized messages.
- Produces: visible `Internal evidence` / `Evidência interna` and future-ready real-use labels.

- [ ] **Step 1: Add failing bilingual render assertions**

Archive and detail tests must find:

```text
Internal evidence
Evidência interna
```

for the existing cases.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm --prefix apps/web test -- src/components/evidence/evidence-archive.test.tsx src/components/evidence/evidence-report.test.tsx`
Expected: FAIL because the label is not rendered.

- [ ] **Step 3: Add localized copy and minimal rendering**

Extend `messages[locale].builtWithSkills` with:

```ts
evidenceClass: {
  internal: "Internal evidence",
  realUse: "Real-use evidence",
}
```

and PT-BR equivalents. Render the appropriate label near the case metadata without changing the existing editorial hierarchy.

- [ ] **Step 4: Run focused tests**

Run: `npm --prefix apps/web test -- src/components/evidence/evidence-archive.test.tsx src/components/evidence/evidence-report.test.tsx`
Expected: GREEN.

- [ ] **Step 5: Commit**

Commit message: `feat(web): expose evidence provenance`

---

### Task 4: Full verification and PR readiness

**Files:**
- No new production files unless a discovered regression requires a focused fix.
- Update PR description with evidence.

**Interfaces:**
- Consumes: Tasks 1-3.
- Produces: reviewable PR with no Stable version bump.

- [ ] **Step 1: Run canonical root gates**

Run: `npm test && npm run validate`
Expected: GREEN.

- [ ] **Step 2: Run canonical web gates**

Run:

```bash
npm ci --prefix apps/web
npm run web:test
npm run web:typecheck
npm run web:lint
npm run web:build
```

Expected: all GREEN.

- [ ] **Step 3: Verify release invariants**

Confirm:
- `VERSION` remains `1.0.0-rc.1`;
- generated catalog remains current;
- catalog counts remain 49/10;
- no new pack/skill metadata was added;
- Stable policy status remains `collecting-evidence`.

- [ ] **Step 4: Open/update PR**

PR title: `feat: establish real-use evidence gates`

PR body must explain:
- internal cases no longer count implicitly as real-use evidence;
- Stable thresholds are explicit but unmet by design;
- no real project evidence was fabricated;
- the next tranche is the first documented real-use case.

- [ ] **Step 5: Await explicit merge authorization**

Do not merge.
