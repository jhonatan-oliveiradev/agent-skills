# Orphaned Home Copy Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove confirmed orphaned Home and Getting Started message records without changing rendered product behavior.

**Architecture:** Keep the current editorial Home and catalog-derived Getting Started output untouched. Tighten only the localized `messages` schema and data to match active consumers, with a contract regression test protecting against stale fixed-count copy returning.

**Tech Stack:** TypeScript, Next.js 16, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-02-orphaned-home-copy-cleanup-design.md`

## Global Constraints

- Preserve `messages.home.roadmap` unchanged.
- Preserve all remaining localized strings byte-for-byte.
- Do not change Home manifesto/evidence modules.
- Do not change catalog-derived counts.
- Do not remove top-level `hero` or `process` in this slice.
- Do not change version, release, catalog, skill, pack, installer, or workflow files.
- Require RED→GREEN evidence and canonical Ubuntu + Windows CI.

---

### Task 1: Lock the active localized message contract

**Files:**
- Create: `apps/web/src/lib/messages.test.ts`

**Interfaces:**
- Consumes: exported `messages` locale objects.
- Produces: regression coverage for the active Home and Getting Started message shape.

- [ ] **Step 1: Write the failing localized contract test**

```ts
import { describe, expect, it } from "vitest";
import { messages } from "./messages";

describe("active localized message contract", () => {
  it.each(["en", "pt-BR"] as const)("keeps only active Home and install copy for %s", (locale) => {
    expect(Object.keys(messages[locale].home).sort()).toEqual(["roadmap"]);
    expect(messages[locale].gettingStarted.install).not.toHaveProperty("demoSuccess");
  });
});
```

- [ ] **Step 2: Run canonical CI and capture RED**

Expected: root tests and repository validation remain green; `web:test` fails only in the two new locale assertions because the orphaned keys are still present.

---

### Task 2: Remove only confirmed orphaned records

**Files:**
- Modify: `apps/web/src/lib/messages.ts`

**Interfaces:**
- Consumes: the current typed localized message contract.
- Produces: Home copy containing only `roadmap`, and install copy without `demoSuccess`.

- [ ] **Step 1: Narrow the `Messages` interface**

Remove `home.paths`, `home.packs`, `home.proof`, and `gettingStarted.install.demoSuccess`. Keep every other field unchanged.

- [ ] **Step 2: Remove the same records from EN and PT-BR objects**

Delete only the matching locale records. Do not rewrite surviving strings.

- [ ] **Step 3: Verify focused behavior stays unchanged**

The existing Home and Getting Started tests must remain green alongside the new contract test.

---

### Task 3: Verify merge readiness

**Files:**
- No additional production files expected.

**Interfaces:**
- Consumes: final branch tree.
- Produces: review-ready evidence.

- [ ] **Step 1: Audit the final diff**

Expected files:
- `apps/web/src/lib/messages.ts`
- `apps/web/src/lib/messages.test.ts`
- this plan
- the associated design spec

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

Record the RED run, final HEAD, final successful run, and frozen scope. Do not merge without explicit user authorization.
