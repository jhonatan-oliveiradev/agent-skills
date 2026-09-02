# Release Readiness / RC2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Promote the merged 54-skill / 11-pack Studio from `1.0.0-rc.1` to `1.0.0-rc.2` while reopening the Stable evidence gate specifically for real-use validation of Codebase Intelligence.

**Architecture:** Treat RC2 as a Studio-level release metadata change. Keep the five existing project-level version owners synchronized, preserve independent skill/pack contract versions, add an explicit Codebase Intelligence real-use gate to the Stable-readiness manifest, and update only current release copy plus generated catalog projections. Historical RC1 evidence remains immutable.

**Tech Stack:** Node.js test runner, JSON catalog/release metadata, Next.js 16.3.1, TypeScript, Vitest, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-02-release-readiness-rc2-design.md`

## Global Constraints

- Baseline is `main` after merged PR #54 at `8c3ef20f62b457f6f52e215668a936dc003c3a91`.
- Final Studio version is exactly `1.0.0-rc.2`.
- Catalog remains exactly 54 canonical skills / 11 active packs.
- Do not add, remove, or rename a canonical skill, pack, or category.
- Do not mass-bump per-skill or per-pack versions.
- CodeGraph remains an optional integration; do not add an adapter, wrapper, embedded runtime, automatic install, or automatic indexing.
- Stable `1.0.0` remains frozen until real-use / CI evidence validates Codebase Intelligence after RC2.
- Preserve historical specs, plans, RC1 readiness data, real-use records, and the published RC1 release.
- Generated catalogs are outputs and must be materialized from source through the official generator/sync path.
- No merge without explicit user authorization.

---

### Task 1: Establish the RC2 RED contract

**Files:**
- Modify: `scripts/release-readiness.test.mjs`
- Modify: `apps/web/src/lib/project-pages.test.ts`

**Interfaces:**
- Consumes: current five version owners, `release/stable-readiness.json`, localized project-page release content.
- Produces: failing contracts that define the exact RC2 release state before metadata is changed.

- [ ] **Step 1: Change the root version-owner contract to RC2**

Replace the current fixed RC1 expectation with:

```js
test("project-level version owners are synchronized at the RC2 candidate", async () => {
  const version = (await readText("VERSION")).trim();
  const rootPackage = await readJson("package.json");
  const plugin = await readJson(".codex-plugin/plugin.json");
  const catalogManifest = await readJson("catalog/catalog.json");
  const webPackage = await readJson("apps/web/package.json");

  assert.equal(version, "1.0.0-rc.2");
  assert.equal(rootPackage.version, version);
  assert.equal(plugin.version, version);
  assert.equal(catalogManifest.version, version);
  assert.equal(webPackage.version, version);
});
```

- [ ] **Step 2: Change the Stable-readiness contract to the new RC2 gate**

Replace the current aggregate-ready assertion with a contract equivalent to:

```js
test("Stable promotion is frozen while RC2 collects Codebase Intelligence real-use evidence", async () => {
  const matrix = await readJson("release/stable-readiness.json");

  assert.equal(matrix.schemaVersion, 3);
  assert.equal(matrix.candidateVersion, "1.0.0-rc.2");
  assert.equal(matrix.targetVersion, "1.0.0");
  assert.equal(matrix.status, "collecting-rc2-evidence");
  assert.deepEqual(matrix.requiredRealUsePacks, ["codebase-intelligence"]);
  assert.deepEqual(matrix.validatedRealUsePacks, []);

  assert.deepEqual(matrix.minimums, {
    realUseCases: 3,
    distinctProjects: 2,
    activePacksRepresented: 3,
  });
  assert.deepEqual(matrix.observed, {
    realUseCases: 3,
    distinctProjects: 3,
    activePacksRepresented: 4,
  });
});
```

Keep the existing test proving that public surfaces retain their prior inspectable Rocket evidence and `stableReady: true`; the new pack-level gate is additive rather than erasing valid surface evidence.

- [ ] **Step 3: Make the current public release test require RC2 and Codebase Intelligence**

Update `apps/web/src/lib/project-pages.test.ts` so both locales must expose a current release with:

```ts
expect(content.changelog.releases[0]).toMatchObject({
  version: "1.0.0-rc.2",
  date: "2026-09-02",
});

const releaseText = content.changelog.releases[0].groups
  .flatMap((group) => group.items)
  .join(" ");

expect(releaseText).toMatch(/54/);
expect(releaseText).toMatch(/11/);
expect(releaseText).toMatch(/Codebase Intelligence/i);
```

The existing minimum-item count remains.

- [ ] **Step 4: Commit only the test changes**

Commit message:

```text
test: define RC2 release contract
```

- [ ] **Step 5: Verify RED through the canonical Draft PR workflow**

Expected failures on both OS jobs:

- root release-readiness test sees `1.0.0-rc.1`, schema v2, and `ready-for-stable-review`;
- project-page test sees `1.0.0-rc.1` and the old 49/10 copy.

No unrelated test should fail. If unrelated failures appear, stop and diagnose before implementation.

---

### Task 2: Promote source release metadata to RC2

**Files:**
- Modify: `VERSION`
- Modify: `package.json`
- Modify: `.codex-plugin/plugin.json`
- Modify: `catalog/catalog.json`
- Modify: `apps/web/package.json`
- Modify: `release/stable-readiness.json`
- Modify: `CHANGELOG.md`
- Modify: `apps/web/src/lib/project-pages.ts`

**Interfaces:**
- Consumes: Task 1 RC2 contracts and the merged 54/11 catalog.
- Produces: one synchronized Studio-level RC2 candidate and truthful bilingual current release state.

- [ ] **Step 1: Update exactly the five project-level version owners**

Set these source values to `1.0.0-rc.2`:

```text
VERSION
package.json.version
.codex-plugin/plugin.json.version
catalog/catalog.json.version
apps/web/package.json.version
```

Do not touch individual `catalog/skills/*.json`, `catalog/packs/*.json`, or canonical Skill frontmatter merely to synchronize the Studio release.

- [ ] **Step 2: Reopen the Stable gate without discarding prior evidence**

Update only the release-control fields in `release/stable-readiness.json`:

```json
{
  "schemaVersion": 3,
  "candidateVersion": "1.0.0-rc.2",
  "targetVersion": "1.0.0",
  "status": "collecting-rc2-evidence",
  "requiredRealUsePacks": ["codebase-intelligence"],
  "validatedRealUsePacks": []
}
```

Preserve the existing `minimums`, `observed`, and `surfaces` values byte-for-byte except for formatting required by insertion of the new fields.

- [ ] **Step 3: Add a new RC2 changelog entry above RC1**

Use date `2026-09-02` and describe only shipped facts:

- collection now 54 canonical skills / 11 active packs;
- Codebase Intelligence v1 adds five evidence-led methods;
- CodeGraph is an official optional runtime integration with verified repository-inspection fallback;
- context expansion is progressive and evidence-led;
- Stable remains blocked until real-use / CI evidence validates the new pack.

Do not rewrite the RC1 entry.

- [ ] **Step 4: Replace the current web release record with RC2 in both locales**

In `apps/web/src/lib/project-pages.ts`, make `releases[0]` the RC2 current record in both EN and PT-BR:

- version `1.0.0-rc.2`;
- date `2026-09-02` in both locales;
- 54 skills / 11 active packs;
- Codebase Intelligence + optional CodeGraph integration;
- Stable pending real-use validation.

Keep the content editorially concise and factual. Do not claim CodeGraph was executed in CI or bundled with the Studio.

- [ ] **Step 5: Commit source metadata before generated projections**

Commit message:

```text
release: promote Studio metadata to rc2
```

At this point root validation is expected to expose generated-catalog drift until Task 3 materializes projections.

---

### Task 3: Regenerate catalog projections through the official path

**Files:**
- Regenerate: `catalog/generated/catalog.json`
- Regenerate/sync: `apps/web/src/generated/catalog.json`
- Temporary only if connector execution requires it: `.github/workflows/materialize-rc2.yml`

**Interfaces:**
- Consumes: source `catalog/catalog.json` at `1.0.0-rc.2`.
- Produces: generated root/web catalogs that exactly match official generator output.

- [ ] **Step 1: Materialize with repository commands, never hand-edit generated JSON**

The required commands are:

```bash
npm run catalog:generate
node apps/web/scripts/sync-catalog.mjs
```

Because the GitHub connector cannot execute repository commands directly, a temporary workflow is permitted only as a mechanical materializer. It must be restricted to `release/1.0.0-rc.2`, run the two commands, commit only the two generated JSON files, and avoid triggering itself recursively.

- [ ] **Step 2: Confirm generated counts and version**

The materialized root and web catalogs must both expose:

```text
version: 1.0.0-rc.2
skills: 54
packs: 11 total / 11 active / 0 planned
```

- [ ] **Step 3: Remove the temporary workflow**

Delete `.github/workflows/materialize-rc2.yml` after the generated-output commit. Final `.github/workflows/validate.yml` must remain byte-identical to `main` and the temporary workflow must not exist in the final diff.

- [ ] **Step 4: Treat the materializer run only as generation evidence**

Its status is not final release evidence. Final evidence must come from the canonical pull-request workflow after the temporary workflow has been removed.

---

### Task 4: Final same-tree verification and review readiness

**Files:**
- No production changes unless a demonstrated gate failure requires a focused fix.
- Update Draft PR body with final evidence.

**Interfaces:**
- Consumes: final RC2 branch HEAD with generated projections and no temporary workflow.
- Produces: a reviewable, unmerged RC2 PR with reproducible CI evidence.

- [ ] **Step 1: Run the canonical pull-request workflow on final HEAD**

Require both `ubuntu-latest` and `windows-latest` jobs to complete successfully.

The workflow must prove:

```text
npm test
npm run validate
npm ci --prefix apps/web
npm run web:test
npm run web:typecheck
npm run web:lint
npm run web:build
Bash installer smoke (Linux)
PowerShell installer smoke (Windows)
```

- [ ] **Step 2: Verify release invariants from the final diff**

Confirm:

- five Studio-level owners are `1.0.0-rc.2`;
- generated catalogs are `1.0.0-rc.2` and 54/11;
- individual skill/pack versions were not mass-bumped;
- `release/stable-readiness.json` is collecting RC2 evidence and requires `codebase-intelligence`;
- `validatedRealUsePacks` remains empty until a later real-use tranche;
- RC1 readiness data and historical case records were not rewritten;
- no temporary workflow remains;
- no Stable `1.0.0` metadata/tag/release was created.

- [ ] **Step 3: Review the final PR diff**

Use a focused code review against the spec. Any requested fix must be resolved and reverified on a fresh final HEAD.

- [ ] **Step 4: Mark the PR ready only after GREEN final CI**

PR title:

```text
release: prepare 1.0.0-rc.2
```

PR body must report exact final HEAD, workflow run, root/web gate results, 54/11 invariant, Stable gate state, and absence of individual mass version bumps.

- [ ] **Step 5: Stop before merge**

Do not merge or publish `v1.0.0-rc.2` without explicit user authorization.

After merge, the next tranche is a real-project use / CI case for Codebase Intelligence; only that later evidence may satisfy `validatedRealUsePacks` and reopen the Stable promotion decision.
