# Release Readiness / RC1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove the frozen 49-skill / 10-pack Agent Skills Studio collection is coherent enough to publish as `1.0.0-rc.1`, with routing-quality evidence and synchronized release surfaces.

**Architecture:** Keep canonical skills and packs unchanged in count. Add a catalog-backed routing benchmark and release-readiness contracts, use those contracts to refine only demonstrated ownership ambiguities, then synchronize the five project-level version owners and regenerate projections. CI remains the authority for repository, web, installer, and security gates.

**Tech Stack:** Node.js 22 in CI, Node test runner, JSON catalog, Markdown Agent Skills, Next.js 16.3.1, React 19.2.8, Vitest, TypeScript, ESLint, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-09-02-release-readiness-rc1-design.md`

## Global Constraints
- Keep exactly 49 canonical skills and 10 active packs.
- Do not create a new pack or category.
- `selecting-working-methods` remains a reasoning method, not an application-code router.
- Route with the smallest sufficient method set and one primary owner.
- RC1 is `1.0.0-rc.1`; it is not the Stable `1.0.0` release.
- Do not merge without explicit user authorization.
- Final evidence must come from the canonical workflow on one clean HEAD.

---

### Task 1: Establish the routing-readiness RED contract

**Files:**
- Create: `scripts/release-readiness-routing.test.mjs`
- Create after RED: `catalog/routing-scenarios.json`

**Interfaces:**
- Consumes: `catalog/generated/catalog.json` as the canonical generated skill/pack inventory.
- Produces: a versioned routing benchmark with `{ schemaVersion, scenarios[] }` where each scenario has `id`, `prompt`, `primary`, `supporting`, `excluded`, and `rationale`.

- [ ] **Step 1: Write the failing benchmark contract**

Create `scripts/release-readiness-routing.test.mjs` with tests equivalent to:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalog = JSON.parse(await readFile(path.join(root, "catalog/generated/catalog.json"), "utf8"));
const benchmarkPath = path.join(root, "catalog/routing-scenarios.json");

async function benchmark() {
  return JSON.parse(await readFile(benchmarkPath, "utf8"));
}

test("routing benchmark covers every canonical skill as a primary owner", async () => {
  const data = await benchmark();
  const primaries = new Set(data.scenarios.map((scenario) => scenario.primary).filter(Boolean));
  assert.deepEqual([...primaries].sort(), catalog.skills.map((skill) => skill.slug).sort());
});

test("routing scenarios reference only canonical methods and never duplicate ownership", async () => {
  const data = await benchmark();
  const slugs = new Set(catalog.skills.map((skill) => skill.slug));
  for (const scenario of data.scenarios) {
    assert.ok(typeof scenario.id === "string" && scenario.id.length > 0);
    assert.ok(typeof scenario.prompt === "string" && scenario.prompt.length >= 20);
    assert.ok(typeof scenario.rationale === "string" && scenario.rationale.length >= 20);
    if (scenario.primary !== null) assert.ok(slugs.has(scenario.primary));
    assert.equal(new Set(scenario.supporting).size, scenario.supporting.length);
    assert.equal(new Set(scenario.excluded).size, scenario.excluded.length);
    assert.ok(!scenario.supporting.includes(scenario.primary));
    for (const slug of [...scenario.supporting, ...scenario.excluded]) assert.ok(slugs.has(slug));
  }
});

test("routing benchmark includes deliberate no-skill and overlap-boundary scenarios", async () => {
  const data = await benchmark();
  assert.ok(data.scenarios.some((scenario) => scenario.primary === null && scenario.supporting.length === 0));
  const ids = new Set(data.scenarios.map((scenario) => scenario.id));
  for (const id of [
    "brand-voice-vs-conversion",
    "conversion-vs-ux-copy",
    "editing-vs-humanizing",
    "architecture-vs-boundaries-vs-refactor",
    "security-review-boundaries",
    "testing-layer-boundaries",
    "frontend-fidelity-chain",
    "review-vs-shipping",
    "method-selection-vs-skill-authoring",
  ]) assert.ok(ids.has(id), `missing routing boundary scenario: ${id}`);
});
```

- [ ] **Step 2: Commit the RED contract and run CI**

Expected: existing repository tests pass; only the new routing tests fail because `catalog/routing-scenarios.json` does not yet exist.

- [ ] **Step 3: Create the benchmark with full 49-skill primary coverage**

Create `catalog/routing-scenarios.json` with `schemaVersion: 1`. Include at least one primary-owner scenario for each current canonical slug, the nine named overlap ids above, and at least two no-skill scenarios. Keep support methods ordered by dependency and use `excluded` only for plausible neighboring methods.

- [ ] **Step 4: Run repository tests**

Expected: the new benchmark suite passes without changing skill or pack counts.

- [ ] **Step 5: Commit the GREEN benchmark**

Commit message: `test: add RC1 routing benchmark`.

---

### Task 2: Refine demonstrated router boundaries without hardcoding the benchmark

**Files:**
- Modify: `skills/selecting-working-methods/SKILL.md`
- Modify: `scripts/selecting-working-methods.test.mjs`

**Interfaces:**
- Consumes: ambiguity families proven by `catalog/routing-scenarios.json`.
- Produces: a concise router that names ownership tests rather than enumerating every benchmark scenario.

- [ ] **Step 1: Add failing router boundary assertions**

Extend `scripts/selecting-working-methods.test.mjs` with a contract that requires the router to distinguish **artifact ownership**, **stage ownership**, and **verification ownership** and to preserve the existing length ceiling.

```js
test("routes neighboring methods by ownership instead of keyword overlap", async () => {
  const source = await readFile(skillPath, "utf8");
  assert.match(source, /artifact owner/i);
  assert.match(source, /stage owner/i);
  assert.match(source, /verification owner/i);
  assert.match(source, /do not use a supporting method to redo the primary method/i);
  assert.ok(source.length < 6500);
});
```

- [ ] **Step 2: Run the focused router test and confirm RED**

Expected: only the new ownership-language assertions fail.

- [ ] **Step 3: Add a compact ownership test to the router**

Add a short section to `selecting-working-methods/SKILL.md`:

```markdown
## Ownership test
Before adding a method, identify what it owns:
- **Artifact owner:** the method responsible for the main thing being produced or changed.
- **Stage owner:** the method responsible for the current lifecycle stage; do not preload a later-stage method before its input exists.
- **Verification owner:** a review/testing method may verify the artifact without becoming a second implementation owner.

Do not use a supporting method to redo the primary method. If two candidates claim the same artifact and stage, choose the more specific owner and exclude the other unless the task contains a genuinely separate responsibility.
```

- [ ] **Step 4: Run focused and root tests**

Expected: router tests and routing benchmark remain GREEN.

- [ ] **Step 5: Commit**

Commit message: `refactor: sharpen method ownership routing`.

---

### Task 3: Add the RC1 Beta-surface readiness matrix and stale-public-state guards

**Files:**
- Create: `release/rc1-readiness.json`
- Create: `scripts/release-readiness.test.mjs`
- Modify as failures prove necessary: `README.md`
- Modify as failures prove necessary: `package.json`
- Modify as failures prove necessary: `apps/web/src/lib/messages.ts`
- Modify as failures prove necessary: `apps/web/src/lib/project-pages.ts`

**Interfaces:**
- Consumes: current Roadmap Beta surface ids `plugin`, `catalog`, `installers`, `microsite`.
- Produces: a machine-readable readiness matrix that points to repository gates instead of storing ephemeral workflow run ids.

- [ ] **Step 1: Write the readiness RED contract**

`release/rc1-readiness.json` must eventually contain exactly four surfaces with ids matching the public Roadmap. Write tests first:

```js
const expectedSurfaceIds = ["plugin", "catalog", "installers", "microsite"];

test("RC1 readiness matrix covers the four public Beta surfaces", async () => {
  const matrix = JSON.parse(await readFile(path.join(root, "release/rc1-readiness.json"), "utf8"));
  assert.deepEqual(matrix.surfaces.map((surface) => surface.id), expectedSurfaceIds);
  for (const surface of matrix.surfaces) {
    assert.ok(surface.blockingGates.length > 0);
    assert.ok(surface.evidence.length > 0);
    assert.ok(Array.isArray(surface.knownLimitations));
  }
});
```

Also require live-state invariants:
- catalog counts are 49 skills / 10 total / 10 active / 0 planned;
- `VERSION`, root `package.json`, `.codex-plugin/plugin.json`, `catalog/catalog.json`, and `apps/web/package.json` are identical;
- `README.md` does not advertise the obsolete `feat/agent-skills-studio-v1` branch as current release state;
- current public copy does not claim `18 skills ready` or `Three installable collections`.

- [ ] **Step 2: Run root tests to establish RED**

Expected failures: missing readiness matrix and stale public copy/version-owner gaps exposed by the new contract only.

- [ ] **Step 3: Create `release/rc1-readiness.json`**

Use this shape:

```json
{
  "schemaVersion": 1,
  "targetVersion": "1.0.0-rc.1",
  "frozenCounts": { "skills": 49, "packs": 10 },
  "surfaces": [
    {
      "id": "plugin",
      "blockingGates": ["validate-plugin", "version-sync", "gitguardian"],
      "evidence": [".codex-plugin/plugin.json", ".agents/plugins/marketplace.json", "scripts/validate-plugin.mjs"],
      "knownLimitations": []
    },
    {
      "id": "catalog",
      "blockingGates": ["validate-skills", "validate-catalog", "generated-catalog-current", "routing-benchmark"],
      "evidence": ["catalog/generated/catalog.json", "catalog/routing-scenarios.json"],
      "knownLimitations": []
    },
    {
      "id": "installers",
      "blockingGates": ["root-tests", "bash-smoke", "powershell-smoke"],
      "evidence": ["install.sh", "install.ps1", "scripts/install-skills.mjs", "docs/chatgpt.md", "docs/claude-code.md"],
      "knownLimitations": []
    },
    {
      "id": "microsite",
      "blockingGates": ["web-test", "web-typecheck", "web-lint", "web-build"],
      "evidence": ["apps/web", "catalog/generated/catalog.json"],
      "knownLimitations": []
    }
  ]
}
```

- [ ] **Step 4: Repair only current public-state drift proven by the test**

Update current README/package/public copy to 49 skills / 10 packs and remove the obsolete current-branch beta statement. Do not rewrite historical specs, old PR evidence, or historical changelog entries.

- [ ] **Step 5: Run root and web tests**

Expected: readiness contracts are GREEN before the RC version bump.

- [ ] **Step 6: Commit**

Commit message: `test: codify RC1 readiness gates`.

---

### Task 4: Promote project-level release metadata to `1.0.0-rc.1`

**Files:**
- Modify: `VERSION`
- Modify: `package.json`
- Modify: `.codex-plugin/plugin.json`
- Modify: `catalog/catalog.json`
- Modify: `apps/web/package.json`
- Modify: `CHANGELOG.md`
- Modify: `apps/web/src/lib/project-pages.ts`
- Regenerate: `catalog/generated/catalog.json`
- Regenerate/sync: `apps/web/src/generated/catalog.json`
- Modify tests that intentionally encode the project version, if any.

**Interfaces:**
- Consumes: readiness matrix and GREEN routing benchmark.
- Produces: one synchronized project release candidate version `1.0.0-rc.1` while leaving per-skill/per-pack versions unchanged unless their own content changed.

- [ ] **Step 1: Change the readiness contract to require RC1**

The version-owner assertion from Task 3 must now expect:

```js
assert.equal(versionText.trim(), "1.0.0-rc.1");
for (const value of [packageJson.version, plugin.version, catalogManifest.version, webPackage.version]) {
  assert.equal(value, "1.0.0-rc.1");
}
```

- [ ] **Step 2: Run the focused test and confirm RED**

Expected: version-owner assertions fail while routing/readiness structure remains GREEN.

- [ ] **Step 3: Update the five project-level version owners**

Set `1.0.0-rc.1` in `VERSION`, root `package.json`, `.codex-plugin/plugin.json`, `catalog/catalog.json`, and `apps/web/package.json`.

Do not mass-bump all 49 skill records or 10 pack records: those fields version the individual method/pack contracts; the RC1 change is the Studio/catalog release version.

- [ ] **Step 4: Add the RC1 changelog/current release record**

Add a top entry dated `2026-09-02` describing:
- frozen 49-skill / 10-pack catalog;
- routing benchmark and ownership refinement;
- four-surface readiness matrix;
- ChatGPT/Codex/Claude-compatible distribution gates;
- RC status explicitly preceding Stable `1.0.0`.

Update `apps/web/src/lib/project-pages.ts` so the current release record is `1.0.0-rc.1` and dated `2026-09-02`.

- [ ] **Step 5: Regenerate canonical catalog and sync the web copy**

Run the repository's official generator (`npm run catalog:generate`) and the existing web sync path. Generated files must be outputs, never hand-edited.

- [ ] **Step 6: Run repository validation and web tests**

Expected: generated catalog version matches `VERSION`, all current counts remain 49/10, plugin validation passes, and web tests see RC1.

- [ ] **Step 7: Commit**

Commit message: `release: prepare 1.0.0-rc.1`.

---

### Task 5: Final same-tree verification and PR readiness

**Files:**
- Modify: PR description only; no new production file unless a gate exposes a real defect.

**Interfaces:**
- Consumes: final branch HEAD.
- Produces: evidence sufficient for user review and explicit merge authorization.

- [ ] **Step 1: Confirm no temporary workflow remains**

`.github/workflows/validate.yml` must be byte-identical to `main` unless a separately justified permanent CI improvement was made. No materializer job may appear in the final PR diff.

- [ ] **Step 2: Run the canonical GitHub Actions workflow on the final HEAD**

Require success for both Ubuntu and Windows jobs.

- [ ] **Step 3: Record concrete final evidence**

Verify from the same HEAD:
- root tests;
- 49 skills / 10 active packs validation;
- generated catalog current;
- plugin validation;
- routing benchmark;
- web Vitest;
- typecheck;
- lint;
- production build;
- Bash installer smoke;
- PowerShell installer smoke;
- dependency install audit result;
- GitGuardian.

- [ ] **Step 4: Review the final diff**

Confirm no new skill/pack/category, no historical evidence rewrite, no hidden workflow materializer, and no unrelated Home redesign.

- [ ] **Step 5: Update PR description and leave PR unmerged**

Document RED → GREEN evidence, final HEAD/run, counts, RC1 semantics, known non-blocking warnings, and merge policy. Wait for explicit user authorization before merge.
