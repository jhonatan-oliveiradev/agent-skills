# Stable Roadmap Surfaces Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the four already-qualified release surfaces from Beta to Stable in the public roadmap without changing release state or product behavior.

**Architecture:** Keep the existing seven-stage roadmap model and localized copy source. Replace the maturity-specific `betaItems` field with `stableSurfaceItems`, leave Beta empty, and compose Stable from those four surface records plus the existing stable-skill collection record.

**Tech Stack:** TypeScript, Next.js 16, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-02-roadmap-stable-surfaces-design.md`

## Global Constraints

- Preserve the seven roadmap stages and their order.
- Do not bump `1.0.0` or modify release readiness metadata.
- Do not change canonical skill or pack records.
- Do not regenerate catalog artifacts.
- Keep the existing localized surface titles and summaries.
- Require RED→GREEN evidence and canonical Ubuntu + Windows CI.

---

### Task 1: Lock the post-Stable roadmap contract

**Files:**
- Modify: `apps/web/src/lib/roadmap.test.ts`
- Modify: `apps/web/src/components/roadmap-living-program.test.tsx`

**Interfaces:**
- Consumes: `getRoadmapStages(locale)` and the existing rendered roadmap page.
- Produces: regression coverage for Stable surface placement.

- [ ] **Step 1: Write the failing library test**

Update the expected stage counts to:

```ts
expect(stages.map((stage) => stage.items.length)).toEqual([0, 0, 0, 0, 0, 5, 0]);
```

Assert Stable IDs are deterministic:

```ts
expect(stages.find((stage) => stage.id === "stable")?.items.map((item) => item.id)).toEqual([
  "plugin",
  "catalog",
  "installers",
  "microsite",
  "stable-skills",
]);
```

Assert the four surface entries report `1.0.0`, while the skill collection retains the stable-skill count metadata.

- [ ] **Step 2: Update the rendered-program expectation**

Change the expected empty-stage count from five to six and assert Beta is empty while Stable is populated.

- [ ] **Step 3: Run the web tests and capture RED**

Run through the canonical CI workflow. Expected failure: roadmap assertions show four Beta records and only one Stable record.

---

### Task 2: Promote the localized release surfaces to Stable

**Files:**
- Modify: `apps/web/src/lib/messages.ts`
- Modify: `apps/web/src/lib/roadmap.ts`

**Interfaces:**
- Consumes: localized roadmap copy and `catalog.version`.
- Produces: `getRoadmapStages(locale)` with an empty Beta stage and five Stable records.

- [ ] **Step 1: Rename the copy contract**

Replace:

```ts
readonly betaItems: readonly { readonly id: string; readonly title: string; readonly summary: string }[];
```

with:

```ts
readonly stableSurfaceItems: readonly { readonly id: string; readonly title: string; readonly summary: string }[];
```

Rename both EN and PT-BR data keys without altering titles or summaries.

- [ ] **Step 2: Compose Stable records**

Replace the Beta mapping with an empty array and build Stable as:

```ts
const stableSurfaces = copy.stableSurfaceItems.map((item) => ({
  ...item,
  meta: catalog.version,
}));

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

Expected changed files are limited to the spec, plan, two roadmap tests, `messages.ts`, and `roadmap.ts`.

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
