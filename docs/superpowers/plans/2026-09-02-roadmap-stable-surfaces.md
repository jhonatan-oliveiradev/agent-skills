# Stable Roadmap Surfaces Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the four already-qualified release surfaces from Beta to Stable in the public roadmap without changing release state or product behavior.

**Architecture:** Keep the existing seven-stage roadmap model and localized copy source unchanged. Reclassify the four existing localized surface records inside `roadmap.ts`, leave Beta empty, and compose Stable from those records plus the existing stable-skill collection record.

**Tech Stack:** TypeScript, Next.js 16, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-02-roadmap-stable-surfaces-design.md`

## Global Constraints

- Preserve the seven roadmap stages and their order.
- Do not bump `1.0.0` or modify release readiness metadata.
- Do not change canonical skill or pack records.
- Do not regenerate catalog artifacts.
- Keep localized surface titles, summaries, and message schema unchanged.
- Require RED→GREEN evidence and canonical Ubuntu + Windows CI.

---

### Task 1: Lock the post-Stable roadmap contract

**Files:**
- Modify: `apps/web/src/lib/roadmap.test.ts`
- Modify: `apps/web/src/components/roadmap-living-program.test.tsx`

**Interfaces:**
- Consumes: `getRoadmapStages(locale)` and the existing rendered roadmap page.
- Produces: regression coverage for Stable surface placement.

- [x] **Step 1: Write the failing library test**

Require stage counts:

```ts
expect(stages.map((stage) => stage.items.length)).toEqual([0, 0, 0, 0, 0, 5, 0]);
```

Require deterministic Stable IDs:

```ts
expect(stable?.items.map((item) => item.id)).toEqual([
  "plugin",
  "catalog",
  "installers",
  "microsite",
  "stable-skills",
]);
```

The four surface entries must report `1.0.0`; the skill collection keeps its stable-skill count metadata.

- [x] **Step 2: Update the rendered-program expectation**

Require six empty stages and assert Beta is empty while Stable is populated.

- [x] **Step 3: Run the web tests and capture RED**

Canonical run `33690446991` failed only in the four new EN/PT-BR roadmap assertions. The implementation still returned `[0, 0, 0, 0, 4, 1, 0]`.

---

### Task 2: Reclassify the existing release-surface records

**Files:**
- Modify: `apps/web/src/lib/roadmap.ts`

**Interfaces:**
- Consumes: existing localized `copy.betaItems` records and `catalog.version`.
- Produces: `getRoadmapStages(locale)` with an empty Beta stage and five Stable records.

- [ ] **Step 1: Build versioned surface records**

Create a maturity-neutral local alias without changing the messages schema:

```ts
const stableSurfaces = copy.betaItems.map((item) => ({
  ...item,
  meta: catalog.version,
}));
```

- [ ] **Step 2: Compose Stable records and empty Beta**

Build Stable as:

```ts
const stable = [
  ...stableSurfaces,
  {
    id: "stable-skills",
    title: copy.stableItem.title,
    summary: copy.stableItem.summary,
    meta: copy.itemMeta.stableSkills.replace("{count}", String(stableCount)),
    href: `/${locale}/skills`,
  },
];
```

Set `beta: []` in the stage-item record.

- [ ] **Step 3: Run the focused tests and capture GREEN**

Expected: roadmap library and rendered-program tests pass in both locales.

---

### Task 3: Verify the complete repository gate

**Files:**
- No additional production changes expected.

**Interfaces:**
- Consumes: final branch tree.
- Produces: merge-readiness evidence.

- [ ] **Step 1: Review the final diff**

Expected changed files are limited to the spec, plan, two roadmap tests, and `roadmap.ts`.

- [ ] **Step 2: Run canonical Ubuntu + Windows CI**

Required gates:

```text
npm test
npm run validate
npm ci --prefix apps/web
npm run web:test
npm run web:typecheck
npm run web:lint
npm run web:build
Bash installer smoke (Ubuntu)
PowerShell installer smoke (Windows)
```

- [ ] **Step 3: Update the PR with RED/GREEN evidence**

Record the failing run, final HEAD, final successful run, and frozen scope. Do not merge without explicit user authorization.
