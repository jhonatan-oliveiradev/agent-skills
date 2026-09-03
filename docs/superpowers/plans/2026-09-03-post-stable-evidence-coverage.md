# Post-Stable Evidence Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Derive active-pack real-use coverage from Built with Skills plus catalog membership and expose the current coverage alongside Stable-skill maturity on the public roadmap.

**Architecture:** Add one narrow server-only helper that joins existing inspectable real-use cases with canonical skill→pack membership. Preserve the existing localized Stable-skill message contract; append only a roadmap-localized evidence fragment with derived covered/total values. Reconcile the derived count with the historical Stable readiness record.

**Tech Stack:** TypeScript, Next.js 16, Vitest, Node fs/promises, existing catalog and Built with Skills domain APIs.

**Spec:** `docs/superpowers/specs/2026-09-03-post-stable-evidence-coverage-design.md`

## Global Constraints

- `VERSION` remains exactly `1.0.0`.
- Catalog remains 54 canonical skills and 11 active packs.
- No skill maturity promotion.
- No new or removed skills/packs.
- No release/tag/status mutation.
- No installer, plugin, workflow, generated-catalog-source, deployment, or unrelated UI changes.
- No real-use evidence may be fabricated.
- Do not merge without explicit user authorization.

---

### Task 1: Derive real-use pack coverage

**Files:**
- Create: `apps/web/src/lib/real-use-pack-coverage.test.ts`
- Create: `apps/web/src/lib/real-use-pack-coverage.ts`

- [x] Write the test-first coverage contract.
- [x] Verify RED: run `33774185714` failed only because `./real-use-pack-coverage` did not exist; existing web tests remained green.
- [x] Implement `getRealUsePackCoverage()` from `getCatalog()`, `getBuiltWithSkillsCases("en")`, `evidenceClass === "real-use"`, and `hasInspectableRealUseEvidence()`.
- [x] Derive deterministic current coverage in catalog pack order:
  - covered: `application-security`, `codebase-intelligence`, `frontend-product`, `quality-testing`, `writing-communication`;
  - uncovered: `architecture-engineering`, `backend-data`, `design-brand`, `engineering-workflow`, `game-development`, `motion`;
  - counts: `5 / 11`.
- [x] Require `release/stable-readiness.json.observed.activePacksRepresented` to equal the derived covered count.
- [x] Verify helper GREEN in run `33774464004`; web tests passed on Ubuntu and Windows, with Ubuntu completing the full matrix successfully.

---

### Task 2: Surface derived evidence on the roadmap

**Files:**
- Modify: `apps/web/src/lib/roadmap.test.ts`
- Modify: `apps/web/src/lib/roadmap.ts`

- [x] Add bilingual assertions requiring the existing `18` Stable-skill count plus derived `5/11` pack evidence.
- [x] Verify RED: run `33774720972` produced exactly two roadmap failures, EN/PT-BR, because the existing meta contained only the Stable-skill count. Coverage-domain tests remained green.
- [x] Preserve the existing global `messages.ts` Stable-skill copy and add only localized evidence fragments inside the roadmap domain:
  - EN summary: `Real-use evidence currently represents {covered} of {total} active packs.`
  - EN meta: `{covered}/{total} packs with real-use evidence`
  - PT-BR summary: `Evidências de uso real representam atualmente {covered} de {total} pacotes ativos.`
  - PT-BR meta: `{covered}/{total} pacotes com evidência de uso real`
- [x] Derive coverage once in `getRoadmapStages()` and append it to the existing Stable item.
- [x] Keep stage IDs/order, links, and the first four Stable surface `1.0.0` metas unchanged.
- [ ] Verify GREEN on the final documented HEAD.

---

### Task 3: Full verification and review readiness

- [ ] Confirm final invariants:
  - `VERSION = 1.0.0`
  - `54` skills
  - `11` active / `0` planned packs
  - `18` Stable / `36` Beta skills
  - derived real-use coverage `5 / 11`
- [ ] Run canonical CI on the final HEAD. Ubuntu and Windows must both pass root tests, repository validation, web tests, typecheck, lint, production build, and their platform installer smoke.
- [ ] Audit the exact PR diff. Expected final scope:
  - `docs/superpowers/specs/2026-09-03-post-stable-evidence-coverage-design.md`
  - `docs/superpowers/plans/2026-09-03-post-stable-evidence-coverage.md`
  - `apps/web/src/lib/real-use-pack-coverage.ts`
  - `apps/web/src/lib/real-use-pack-coverage.test.ts`
  - `apps/web/src/lib/roadmap.ts`
  - `apps/web/src/lib/roadmap.test.ts`
- [ ] Review that internal cases cannot contribute, only inspectable `real-use` cases count, membership comes from catalog facts, ordering is deterministic, Stable readiness history is reconciled but not rewritten, and no uncovered pack is represented as validated.
- [ ] Update PR #70 with RED→GREEN evidence and exact diff audit.
- [ ] Mark Ready only if all checks are clean.
- [ ] Stop before merge.