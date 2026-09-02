# Stable Roadmap Message Contract Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the obsolete internal `betaItems` name from the Stable roadmap surface contract without changing rendered behavior.

**Architecture:** Keep the current seven-stage roadmap model and localized surface data intact. Rename only the message-schema property and its consumer, with a regression test that proves both locales use the Stable-specific contract while existing roadmap behavior remains unchanged.

**Tech Stack:** TypeScript, Next.js 16, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-02-stable-roadmap-message-contract-design.md`

## Global Constraints

- Preserve all current user-visible roadmap copy.
- Preserve Beta as empty and Stable with the same five records and ordering.
- Do not change version, release readiness, catalog, skills, packs, styles, or layout.
- Require RED→GREEN evidence and canonical Ubuntu + Windows CI.

---

### Task 1: Lock the internal Stable message contract

**Files:**
- Modify: `apps/web/src/lib/roadmap.test.ts`

**Interfaces:**
- Consumes: `messages[locale].roadmap`.
- Produces: regression coverage for the maturity-correct localized message key.

- [ ] **Step 1: Write the failing contract test**

Add:

```ts
import { messages } from "./messages";

it.each(["en", "pt-BR"] as const)("uses the Stable surface message contract for %s", (locale) => {
  const copy = messages[locale].roadmap as Record<string, unknown>;

  expect(copy).toHaveProperty("stableSurfaceItems");
  expect(copy).not.toHaveProperty("betaItems");
});
```

- [ ] **Step 2: Run canonical CI and capture RED**

Expected: both locale assertions fail because the current objects expose `betaItems` only. Existing roadmap behavior tests should remain green.

---

### Task 2: Rename the localized contract and consumer

**Files:**
- Modify: `apps/web/src/lib/messages.ts`
- Modify: `apps/web/src/lib/roadmap.ts`

**Interfaces:**
- Consumes: localized `stableSurfaceItems` records.
- Produces: the unchanged `getRoadmapStages(locale)` public result.

- [ ] **Step 1: Rename the `Messages` interface property**

Replace:

```ts
readonly betaItems: readonly { readonly id: string; readonly title: string; readonly summary: string }[];
```

with:

```ts
readonly stableSurfaceItems: readonly { readonly id: string; readonly title: string; readonly summary: string }[];
```

- [ ] **Step 2: Rename both localized object keys**

Change only the EN and PT-BR property names from `betaItems` to `stableSurfaceItems`; preserve every record byte-for-byte otherwise.

- [ ] **Step 3: Update the roadmap consumer**

Replace:

```ts
const stableSurfaces = copy.betaItems.map((item) => ({
```

with:

```ts
const stableSurfaces = copy.stableSurfaceItems.map((item) => ({
```

- [ ] **Step 4: Verify GREEN**

Expected: contract test and existing roadmap behavior tests pass for both locales; typecheck confirms the schema and consumer match.

---

### Task 3: Verify the complete repository gate

**Files:**
- No additional production changes expected.

**Interfaces:**
- Consumes: final branch tree.
- Produces: merge-readiness evidence.

- [ ] **Step 1: Audit the final diff**

Expected changed files:
- `apps/web/src/lib/messages.ts`
- `apps/web/src/lib/roadmap.ts`
- `apps/web/src/lib/roadmap.test.ts`
- this plan
- the matching design spec

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

- [ ] **Step 3: Record RED/GREEN evidence in the PR**

Include the RED run, final HEAD, final successful run, diff boundary, and an explicit no-merge-without-authorization note.
