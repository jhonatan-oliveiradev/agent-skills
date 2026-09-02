# Release Readiness / RC2 Implementation Plan

> **Execution-adjusted plan:** this document records the implemented RC2 path, including release-coupled catalog invariants discovered by CI. The design ruling in `docs/superpowers/specs/2026-09-02-release-readiness-rc2-design.md` is authoritative where the initial plan assumptions changed.

**Goal:** Promote the merged 54-skill / 11-pack Studio from `1.0.0-rc.1` to `1.0.0-rc.2` while reopening the Stable evidence gate specifically for real-use validation of Codebase Intelligence.

**Architecture:** RC2 is a release tranche, not a product-expansion tranche. The five Studio-level version owners move together. The existing catalog validator also requires every `catalog/skills/*.json` and `catalog/packs/*.json` record version to equal the catalog manifest, so all 54 skill metadata records and 11 pack metadata records are mechanically synchronized to RC2. Canonical method behavior in `skills/*/SKILL.md` is not mass-rewritten. Historical RC1 evidence remains immutable.

**Tech Stack:** Node.js test runner, JSON catalog/release metadata, Next.js 16.3.1, TypeScript, Vitest, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-02-release-readiness-rc2-design.md`

## Global Constraints

- Baseline: merged PR #54 on `main` at `8c3ef20f62b457f6f52e215668a936dc003c3a91`.
- Final Studio version: exactly `1.0.0-rc.2`.
- Catalog: exactly 54 canonical skills / 11 active packs.
- Do not add, remove, or rename a canonical skill, pack, or category.
- Synchronize the 54 skill + 11 pack **catalog metadata** versions to RC2 because the validator requires it.
- Do not mass-rewrite canonical `skills/*/SKILL.md` content or behavior for the release bump.
- CodeGraph remains an optional integration; do not add an adapter, wrapper, embedded runtime, automatic install, or automatic indexing.
- Stable `1.0.0` remains frozen until real-use / CI evidence validates Codebase Intelligence after RC2.
- Preserve historical specs, RC1 readiness data, real-use records, and the published RC1 release.
- Generated catalogs are outputs and must be materialized from source through the official generator/sync path.
- Temporary branch-scoped workflows used only to materialize connector-limited mechanical changes must be removed before final verification.
- No merge or RC2 tag/release publication without explicit user authorization.

---

## Task 1 — Establish the RC2 RED contract

**Files:**
- `scripts/release-readiness.test.mjs`
- `apps/web/src/lib/project-pages.test.ts`

- [x] Root tests require all five Studio-level version owners at `1.0.0-rc.2`.
- [x] Root tests require Stable state `collecting-rc2-evidence` with `requiredRealUsePacks: ["codebase-intelligence"]` and `validatedRealUsePacks: []`.
- [x] Existing aggregate real-use thresholds and prior surface evidence remain preserved.
- [x] Web tests require the current release record to be RC2 dated `2026-09-02`, expose 54/11, and mention Codebase Intelligence in both locales.
- [x] Canonical Draft PR CI established RED on Ubuntu and Windows before production metadata changed.

Initial RED run: `33678205242`.

---

## Task 2 — Promote release metadata and preserve the Stable gate

**Primary source files:**
- `VERSION`
- `package.json`
- `.codex-plugin/plugin.json`
- `catalog/catalog.json`
- `apps/web/package.json`
- `release/stable-readiness.json`

- [x] Promote all five Studio-level version owners to `1.0.0-rc.2`.
- [x] Advance Stable-readiness schema to v3.
- [x] Set candidate to RC2 and status to `collecting-rc2-evidence`.
- [x] Require `codebase-intelligence` real-use evidence while keeping `validatedRealUsePacks` empty.
- [x] Preserve prior minimums, observed totals, and surface evidence.

### CI ruling: catalog record versions are release-coupled

The first metadata promotion exposed exactly 65 catalog validation failures: 54 skill records + 11 pack records still carried RC1 while `catalog/catalog.json` carried RC2. Inspection of `scripts/validate-catalog.mjs` confirmed this is an intentional repository invariant.

- [x] Preserve the validator rather than weakening release consistency.
- [x] Mechanically synchronize all 65 catalog metadata records to `1.0.0-rc.2`.
- [x] Keep canonical `skills/*/SKILL.md` method content untouched by the version synchronization.

After that sync, root tests reached 138/140; the two remaining failures were explicit RC1 expectations introduced with the Codebase Intelligence pack tests.

- [x] Synchronize only those two release-coupled expectations in `scripts/codebase-intelligence-pack.test.mjs` to RC2.
- [x] Confirm the root suite reaches 140/140 before generated-output materialization.

---

## Task 3 — Regenerate catalog projections through the official path

**Generated files:**
- `catalog/generated/catalog.json`
- `apps/web/src/generated/catalog.json`

Required repository commands:

```bash
npm run catalog:generate
node apps/web/scripts/sync-catalog.mjs
```

Because the GitHub connector cannot execute repository commands directly, a temporary workflow was permitted strictly as a mechanical materializer.

- [x] Synchronize the 65 release-coupled catalog metadata records.
- [x] Run root tests before generation.
- [x] Run the official catalog generator.
- [x] Run the official web catalog sync.
- [x] Materialize both generated projections.
- [x] Confirm 54 skills / 11 active packs and RC2 metadata.
- [x] Remove the temporary materializer before accepting canonical CI evidence.

Materializer evidence run: `33678919247`.

---

## Task 4 — Synchronize web release contracts and publish RC2 copy

**Files:**
- `apps/web/src/components/site-chrome.test.tsx`
- `apps/web/src/components/site-shell.test.tsx`
- `apps/web/src/lib/roadmap.test.ts`
- `apps/web/src/lib/project-pages.ts`
- `CHANGELOG.md`

Canonical CI after root/catalog GREEN exposed eight web failures. Six were stale RC1 assertions in three tests while production header/footer/roadmap already read RC2 dynamically; two were the intentionally RED project-page release contracts.

- [x] Synchronize only the stale release-coupled RC1 assertions in the three web tests.
- [x] Verify the working tree reduces to only the public changelog/release-copy failures.
- [x] Remove the temporary test synchronizer before production-copy work.
- [x] Add RC2 as the first EN/PT-BR release record while preserving RC1 as historical release data.
- [x] Publish 54/11, Codebase Intelligence v1, optional CodeGraph integration, progressive evidence-led context expansion, and the still-frozen Stable gate.
- [x] Preserve the existing searchable-catalog reader contract.
- [x] Add the RC2 entry above RC1 in the root `CHANGELOG.md` without rewriting RC1.

Web RED isolation evidence after stale assertion sync: 147/150, with all three failures owned by the still-RC1 public changelog content.

---

## Task 5 — Final same-tree verification and review readiness

**Final requirements:**

- [ ] Canonical PR workflow succeeds on both Ubuntu and Windows on one final HEAD.
- [ ] Root tests: 140/140.
- [ ] Catalog/plugin/skill validation succeeds with 54 skills / 11 active packs.
- [ ] Generated catalog drift check succeeds.
- [ ] Web Vitest: 150/150.
- [ ] Web TypeScript typecheck succeeds.
- [ ] Web ESLint succeeds with zero warnings.
- [ ] Next.js production build succeeds.
- [ ] Bash installer smoke succeeds on Linux.
- [ ] PowerShell installer smoke succeeds on Windows.
- [ ] No temporary materializer/synchronizer workflow remains in the final diff.
- [ ] `.github/workflows/validate.yml` remains unchanged from `main`.
- [ ] No canonical `skills/*/SKILL.md` method file is mass-rewritten for RC2.
- [ ] `release/stable-readiness.json` still requires Codebase Intelligence real-use evidence and has no validated pack entry yet.
- [ ] Historical RC1 readiness and real-use evidence remain unchanged.
- [ ] No Stable `1.0.0` metadata/tag/release exists.
- [ ] No `v1.0.0-rc.2` tag/release is published before explicit authorization.
- [ ] Final PR diff receives focused review against the RC2 spec.
- [ ] PR body is updated with exact final HEAD, workflow run, gates, 54/11 invariant, and execution rulings.
- [ ] PR is left unmerged until explicit user authorization.

After this tranche, the next planned slice is a real-project use / CI case for Codebase Intelligence. Only inspectable real-project evidence may satisfy `validatedRealUsePacks` and reopen the Stable promotion decision.
