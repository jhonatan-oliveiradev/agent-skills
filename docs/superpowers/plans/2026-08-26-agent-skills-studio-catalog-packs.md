# Agent Skills Studio Catalog and Packs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a validated bilingual catalog, three installable thematic packs, three planned packs, deterministic generated data, and safe pack-aware installation for all 18 canonical skills.

**Architecture:** Canonical agent instructions remain under `skills/`; reader-facing discovery data lives in one JSON record per skill and one manifest per pack. Focused Node.js modules discover, validate, and deterministically generate a committed catalog projection. The existing hardened installer resolves individual skills and active packs through those same catalog sources before performing any filesystem mutation.

**Tech Stack:** Node.js 22 built-ins, JSON Schema documents, Bash, PowerShell, GitHub Actions

**Spec:** `docs/superpowers/specs/2026-08-26-agent-skills-studio-catalog-packs-design.md`

## Global Constraints

- `skills/` remains the only canonical skill tree.
- Use only Node.js built-ins; add no runtime or development dependency.
- Keep the Node.js engine floor at `>=20` and CI at Node.js 22.
- Preserve every existing public installer entry point and existing `installSkills({ repoRoot, destination, names? })` caller.
- Extend the installer signature compatibly to `installSkills({ repoRoot, destination, names?, packs? })`.
- Keep `1.0.0-beta.1` synchronized across package, plugin, `VERSION`, and catalog.
- English and `pt-BR` metadata are both required; English is editorially canonical.
- No client data, credentials, private URLs, proprietary copy, or confidential project context may enter catalog files or generated output.
- Catalog and installer traversal must reject symbolic links and source/destination overlap before mutation.
- Generated JSON must be deterministic, committed, and verified byte-for-byte in CI.
- Implement on `feat/agent-skills-studio-catalog-packs`, target `dev`, and do not merge during this phase.
- Every task follows RED → GREEN → refactor and ends with a focused commit.

---

## File map

- Create `scripts/lib/privacy.mjs` and `scripts/lib/privacy.test.mjs` for the shared private-data policy.
- Modify `scripts/validate-skills.mjs` to consume the shared policy.
- Create `scripts/lib/catalog.mjs` and `scripts/lib/catalog.test.mjs` for catalog paths, stable discovery, safe JSON loading, and top-level symlink inspection.
- Create `catalog/catalog.json` and three JSON Schema documents under `catalog/schemas/`.
- Create `scripts/validate-catalog.mjs` and `scripts/validate-catalog.test.mjs`.
- Create 18 skill records under `catalog/skills/` and six pack manifests under `catalog/packs/`.
- Create `scripts/generate-catalog.mjs`, `scripts/generate-catalog.test.mjs`, and `catalog/generated/catalog.json`.
- Modify `scripts/install-skills.mjs` and `scripts/install-skills.test.mjs` for pack selection.
- Modify `package.json`, `.github/workflows/validate.yml`, `README.md`, `CHANGELOG.md`, and `MAPPING.md`.

---

### Task 1: Shared privacy policy and catalog discovery

**Files:**
- Create: `scripts/lib/privacy.mjs`
- Create: `scripts/lib/privacy.test.mjs`
- Create: `scripts/lib/catalog.mjs`
- Create: `scripts/lib/catalog.test.mjs`
- Modify: `scripts/validate-skills.mjs`
- Modify: `scripts/validate-skills.test.mjs`

**Interfaces:**
- Produces: `forbiddenPrivatePatterns: RegExp[]`.
- Produces: `containsForbiddenPrivateData(text: string): boolean`.
- Produces: `getCatalogPaths(repoRoot: string): { root, manifestFile, schemasDirectory, skillsDirectory, packsDirectory, generatedFile }`.
- Produces: `inspectJsonDirectory(directory: string): Promise<{ files: Array<{ slug, file }>, symbolicLinks: string[] }>`.
- Produces: `readJson(file: string): Promise<{ value: unknown, error: null } | { value: null, error: string }>`.

- [ ] **Step 1: Write the failing shared-privacy test**

Create `scripts/lib/privacy.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";

import { containsForbiddenPrivateData, forbiddenPrivatePatterns } from "./privacy.mjs";

test("exposes one shared private-data policy", () => {
  assert.equal(forbiddenPrivatePatterns.length, 5);
  assert.equal(containsForbiddenPrivateData("ghp_abcdefghijklmnopqrstuvwxyz"), true);
  assert.equal(containsForbiddenPrivateData("https://docs.example.com/public"), false);
});
```

- [ ] **Step 2: Run the privacy test and verify RED**

Run `node --test scripts/lib/privacy.test.mjs`.

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `privacy.mjs`.

- [ ] **Step 3: Move the exact existing patterns into the shared module**

Create `scripts/lib/privacy.mjs`:

```js
export const forbiddenPrivatePatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\b(?:sk|sk-proj)-[A-Za-z0-9_-]{20,}\b/,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
  /https?:\/\/(?:[^\s/]+\.)?internal(?:[./:]|\b)/i,
];

export function containsForbiddenPrivateData(text) {
  return forbiddenPrivatePatterns.some((pattern) => pattern.test(text));
}
```

Import `containsForbiddenPrivateData` in `scripts/validate-skills.mjs`, delete its private pattern declaration, and emit the existing error whenever the helper returns `true`.

- [ ] **Step 4: Prove skill validation still uses the shared policy**

Append to `scripts/validate-skills.test.mjs`:

```js
test("uses the shared privacy policy for supporting files", async () => {
  const root = await fixture({ alpha: "---\nname: alpha\ndescription: Use when alpha applies.\n---\n" });
  const references = path.join(root, "skills", "alpha", "references");
  await mkdir(references, { recursive: true });
  await writeFile(path.join(references, "secret.md"), "sk-proj-abcdefghijklmnopqrstuvwxyz");

  assert.equal((await validateSkills(root)).errors.some((error) => error.includes("forbidden private-data pattern")), true);
});
```

Run `node --test scripts/lib/privacy.test.mjs scripts/validate-skills.test.mjs`.

Expected: PASS.

- [ ] **Step 5: Write the failing catalog-discovery tests**

Create `scripts/lib/catalog.test.mjs`:

```js
import assert from "node:assert/strict";
import { mkdir, mkdtemp, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { getCatalogPaths, inspectJsonDirectory, readJson } from "./catalog.mjs";

test("resolves catalog paths and discovers JSON records in stable order", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "catalog-discovery-"));
  const paths = getCatalogPaths(root);
  await mkdir(paths.skillsDirectory, { recursive: true });
  await writeFile(path.join(paths.skillsDirectory, "zeta.json"), "{}");
  await writeFile(path.join(paths.skillsDirectory, "alpha.json"), "{}");
  await writeFile(path.join(paths.skillsDirectory, "notes.md"), "ignored");

  assert.equal(paths.manifestFile, path.join(root, "catalog", "catalog.json"));
  assert.deepEqual((await inspectJsonDirectory(paths.skillsDirectory)).files.map(({ slug }) => slug), ["alpha", "zeta"]);
});

test("reports top-level symlinks without following them", async (context) => {
  const root = await mkdtemp(path.join(tmpdir(), "catalog-symlink-"));
  const outside = await mkdtemp(path.join(tmpdir(), "catalog-outside-"));
  const directory = path.join(root, "catalog", "skills");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(outside, "linked.json"), "{}");
  try {
    await symlink(path.join(outside, "linked.json"), path.join(directory, "linked.json"));
  } catch (error) {
    if (["EACCES", "ENOSYS", "EPERM"].includes(error?.code)) return context.skip("symlinks unavailable");
    throw error;
  }
  assert.deepEqual((await inspectJsonDirectory(directory)).symbolicLinks, ["linked.json"]);
});

test("returns a structured JSON parsing error", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "catalog-json-"));
  const file = path.join(root, "broken.json");
  await writeFile(file, "{");
  assert.deepEqual(await readJson(file), { value: null, error: `${file}: invalid JSON` });
});
```

- [ ] **Step 6: Run discovery tests and verify RED**

Run `node --test scripts/lib/catalog.test.mjs`.

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `catalog.mjs`.

- [ ] **Step 7: Implement stable and symlink-aware catalog discovery**

Create `scripts/lib/catalog.mjs` with:

```js
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export function getCatalogPaths(repoRoot) {
  const root = path.join(path.resolve(repoRoot), "catalog");
  return {
    root,
    manifestFile: path.join(root, "catalog.json"),
    schemasDirectory: path.join(root, "schemas"),
    skillsDirectory: path.join(root, "skills"),
    packsDirectory: path.join(root, "packs"),
    generatedFile: path.join(root, "generated", "catalog.json"),
  };
}

export async function inspectJsonDirectory(directory) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") return { files: [], symbolicLinks: [] };
    throw error;
  }
  const files = [];
  const symbolicLinks = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (entry.isSymbolicLink()) symbolicLinks.push(entry.name);
    else if (entry.isFile() && entry.name.endsWith(".json")) {
      files.push({ slug: entry.name.slice(0, -5), file: path.join(directory, entry.name) });
    }
  }
  return { files, symbolicLinks };
}

export async function readJson(file) {
  try {
    return { value: JSON.parse(await readFile(file, "utf8")), error: null };
  } catch (error) {
    if (error instanceof SyntaxError) return { value: null, error: `${file}: invalid JSON` };
    if (error?.code === "ENOENT") return { value: null, error: `${file}: file does not exist` };
    throw error;
  }
}
```

- [ ] **Step 8: Verify GREEN and commit**

Run:

```bash
node --test scripts/lib/privacy.test.mjs scripts/lib/catalog.test.mjs scripts/validate-skills.test.mjs
node --test scripts/*.test.mjs scripts/lib/*.test.mjs
node scripts/validate-skills.mjs
git diff --check
git add scripts/lib/privacy.mjs scripts/lib/privacy.test.mjs scripts/lib/catalog.mjs scripts/lib/catalog.test.mjs scripts/validate-skills.mjs scripts/validate-skills.test.mjs
git commit -m "refactor: share catalog discovery and privacy policy"
```

Expected: all existing and new tests PASS; 18 skills validate.

---

### Task 2: Catalog schemas and validation engine

**Files:**
- Create: `catalog/catalog.json`
- Create: `catalog/schemas/catalog.schema.json`
- Create: `catalog/schemas/skill.schema.json`
- Create: `catalog/schemas/pack.schema.json`
- Create: `scripts/validate-catalog.mjs`
- Create: `scripts/validate-catalog.test.mjs`

**Interfaces:**
- Consumes: `getCatalogPaths`, `inspectJsonDirectory`, and `readJson` from Task 1.
- Consumes: `inspectSkillsRoot(repoRoot)` from `scripts/lib/skills.mjs`.
- Consumes: `containsForbiddenPrivateData(text)` from Task 1.
- Produces: `loadCatalog(repoRoot: string): Promise<{ manifest, skills, packs, files, errors }>`.
- Produces: `validateCatalog(repoRoot: string, options?: { checkGenerated?: boolean }): Promise<{ errors: string[], skillCount: number, packCount: number, activePackCount: number }>`.

- [ ] **Step 1: Add the collection manifest and exact public schemas**

Create `catalog/catalog.json` exactly as specified by the design:

```json
{
  "$schema": "./schemas/catalog.schema.json",
  "schemaVersion": 1,
  "version": "1.0.0-beta.1",
  "defaultLocale": "en",
  "locales": ["en", "pt-BR"]
}
```

Create the three Draft 2020-12 schema documents. Every schema must set `additionalProperties: false`, declare every required field from the design, encode all enum values exactly, and use these stable `$id` values:

```text
https://skills.jhonatanoliveira.com/schemas/catalog.schema.json
https://skills.jhonatanoliveira.com/schemas/skill.schema.json
https://skills.jhonatanoliveira.com/schemas/pack.schema.json
```

The schemas are public contracts; runtime validation remains dependency-free and is implemented explicitly below.

- [ ] **Step 2: Write fixture helpers and failing validation tests**

Create `scripts/validate-catalog.test.mjs` with a `catalogFixture()` helper that writes:

- a synchronized manifest and version files;
- canonical `skills/alpha/SKILL.md` and `skills/beta/SKILL.md`;
- complete bilingual skill records for `alpha` and `beta`;
- one active pack containing `alpha` and one empty planned pack;
- plugin/package/VERSION values of `1.0.0-beta.1`.

Add these tests:

```js
test("accepts complete bilingual catalog fixtures", async () => {
  const root = await catalogFixture();
  assert.deepEqual(await validateCatalog(root), {
    errors: [],
    skillCount: 2,
    packCount: 2,
    activePackCount: 1,
  });
});

test("reports missing metadata, incomplete locales, and orphan relations", async () => {
  const root = await catalogFixture({
    omitSkillRecord: "beta",
    mutateAlpha(record) {
      delete record.locales["pt-BR"].primaryBenefit;
      record.relatedSkills = ["missing"];
    },
  });
  const { errors } = await validateCatalog(root);
  assert.equal(errors.some((error) => error.includes("beta: missing catalog metadata")), true);
  assert.equal(errors.some((error) => error.includes("alpha: pt-BR.primaryBenefit is required")), true);
  assert.equal(errors.some((error) => error.includes("alpha: related skill does not exist: missing")), true);
});

test("enforces pack status and bidirectional membership", async () => {
  const root = await catalogFixture({
    mutateActivePack(pack) { pack.skills = []; },
    mutatePlannedPack(pack) { pack.skills = ["beta"]; },
  });
  const { errors } = await validateCatalog(root);
  assert.equal(errors.some((error) => error.includes("active packs must contain at least one skill")), true);
  assert.equal(errors.some((error) => error.includes("planned packs must not contain skills")), true);
});

test("rejects version drift, private data, and catalog symlinks", async (context) => {
  const root = await catalogFixture({ manifestVersion: "9.9.9" });
  await writeFile(path.join(root, "catalog", "skills", "alpha.json"), "ghp_abcdefghijklmnopqrstuvwxyz");
  const outside = await mkdtemp(path.join(tmpdir(), "catalog-link-"));
  try {
    await symlink(outside, path.join(root, "catalog", "packs", "linked.json"));
  } catch (error) {
    if (["EACCES", "ENOSYS", "EPERM"].includes(error?.code)) context.diagnostic("symlink assertion skipped");
    else throw error;
  }
  const { errors } = await validateCatalog(root);
  assert.equal(errors.some((error) => error.includes("catalog, plugin, package, and VERSION values must match")), true);
  assert.equal(errors.some((error) => error.includes("forbidden private-data pattern")), true);
});
```

- [ ] **Step 3: Run the validator tests and verify RED**

Run `node --test scripts/validate-catalog.test.mjs`.

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `validate-catalog.mjs`.

- [ ] **Step 4: Implement loading and field validation**

Create `scripts/validate-catalog.mjs` using these constant contracts:

```js
const allowedCategories = new Set(["frontend", "product-design", "motion", "game-development", "delivery", "meta"]);
const allowedMaturity = new Set(["proposed", "research", "experimental", "beta", "stable", "deprecated"]);
const allowedDifficulty = new Set(["beginner", "intermediate", "advanced"]);
const allowedSurfaces = new Set(["chatgpt", "codex"]);
const allowedOperatingSystems = new Set(["linux", "macos", "windows"]);
const allowedInstallModes = new Set(["plugin", "filesystem"]);
const allowedDependencyTypes = new Set(["library", "tool", "service", "skill"]);
const requiredLocales = ["en", "pt-BR"];
const localizedSkillFields = ["displayName", "summary", "primaryBenefit", "whenToUse", "whenNotToUse"];
```

Implement `loadCatalog(repoRoot)` to load the manifest and sorted record directories without throwing for malformed/missing JSON. Retain repository-relative filenames in every error.

Implement small validation helpers for:

- nonempty strings, booleans, unique arrays, enum arrays, ISO `YYYY-MM-DD` dates, and `x.y.z`/prerelease versions;
- localized skill content, requiring two nonempty use cases and one prompt;
- localized pack content, requiring nonempty name, summary, description, and outcomes;
- dependency objects and public HTTPS URLs;
- slug/filename equality and `^[a-z0-9-]+$`;
- duplicate/self/missing relations;
- canonical skill/metadata one-to-one coverage;
- exact pack/skill bidirectional membership;
- active/planned pack invariants;
- shared privacy scanning of every regular catalog JSON source;
- synchronized catalog/plugin/package/VERSION versions.

Return errors in deterministic file/field order. Do not stop on the first validation error.

- [ ] **Step 5: Implement the validator CLI**

The direct wrapper must print:

```text
Validated <skillCount> catalog skills and <packCount> packs successfully.
```

On failure it prints `Catalog validation failed with <N> issue(s):`, one `- <error>` line per issue, and sets exit code `1`.

`options.checkGenerated` defaults to `false` in this task; Task 4 connects generated-drift validation.

- [ ] **Step 6: Verify GREEN and commit**

Run:

```bash
node --test scripts/validate-catalog.test.mjs
node --test scripts/*.test.mjs scripts/lib/*.test.mjs
node scripts/validate-skills.mjs
node scripts/validate-plugin.mjs
git diff --check
git add catalog/catalog.json catalog/schemas scripts/validate-catalog.mjs scripts/validate-catalog.test.mjs
git commit -m "feat: define bilingual catalog contracts"
```

Expected: fixture tests and all pre-existing gates PASS. Do not run the catalog CLI against the real repository until Task 3 supplies all records.

---

### Task 3: Bilingual metadata and thematic pack manifests

**Files:**
- Create: `catalog/skills/*.json` for all 18 canonical skills
- Create: `catalog/packs/frontend-product.json`
- Create: `catalog/packs/motion.json`
- Create: `catalog/packs/game-development.json`
- Create: `catalog/packs/architecture-engineering.json`
- Create: `catalog/packs/backend-data.json`
- Create: `catalog/packs/quality-testing.json`
- Modify: `scripts/validate-catalog.test.mjs`

**Interfaces:**
- Consumes: validation contracts from Task 2.
- Produces: one complete bilingual record per canonical skill and six valid pack manifests.
- Produces: real-repository catalog counts `{ skillCount: 18, packCount: 6, activePackCount: 3 }`.

- [ ] **Step 1: Add the failing real-repository coverage test**

Append:

```js
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("validates all real catalog records and packs", async () => {
  assert.deepEqual(await validateCatalog(repositoryRoot), {
    errors: [],
    skillCount: 18,
    packCount: 6,
    activePackCount: 3,
  });
});
```

- [ ] **Step 2: Run the real-repository test and verify RED**

Run `node --test --test-name-pattern "validates all real catalog" scripts/validate-catalog.test.mjs`.

Expected: FAIL with 18 missing-metadata errors and missing pack records.

- [ ] **Step 3: Create the 18 skill records**

Use the exact technical matrix below. Every record has version `1.0.0-beta.1`, update date `2026-08-26`, both surfaces, all three operating systems, both install modes, and complete `en`/`pt-BR` content.

| Slug | Category | Packs | Difficulty | Featured | Primary related skill |
| --- | --- | --- | --- | --- | --- |
| `auditing-pixel-perfect-frontend` | frontend | frontend-product | advanced | false | implementing-reference-faithful-ui |
| `bootstrapping-modern-web-apps` | frontend | frontend-product | intermediate | true | designing-ui-systems |
| `building-conversion-product-pages` | product-design | frontend-product | intermediate | true | building-premium-nextjs-interfaces |
| `building-hybrid-game-assets` | game-development | game-development | advanced | false | reconstructing-images-as-threejs |
| `building-premium-nextjs-interfaces` | frontend | frontend-product | advanced | true | designing-ui-systems |
| `craft-premium-motion` | motion | motion | advanced | true | engineering-gsap-animations |
| `creating-character-sprite-pipelines` | game-development | game-development | advanced | false | building-hybrid-game-assets |
| `designing-action-combat` | game-development | game-development | advanced | true | testing-playable-games |
| `designing-ui-systems` | product-design | frontend-product | intermediate | true | building-premium-nextjs-interfaces |
| `engineering-gsap-animations` | motion | motion | advanced | false | craft-premium-motion |
| `implementing-reference-faithful-ui` | frontend | frontend-product | intermediate | false | auditing-pixel-perfect-frontend |
| `optimizing-frontend-motion-performance` | motion | motion | advanced | false | craft-premium-motion |
| `orchestrating-cinematic-web-motion` | motion | motion | advanced | true | craft-premium-motion |
| `reconstructing-images-as-threejs` | game-development | motion, game-development | advanced | true | building-hybrid-game-assets |
| `shipping-github-vercel-changes` | delivery | frontend-product | intermediate | false | bootstrapping-modern-web-apps |
| `testing-playable-games` | game-development | game-development | advanced | false | designing-action-combat |
| `translating-figma-to-nextjs` | frontend | frontend-product | advanced | false | implementing-reference-faithful-ui |
| `turning-techniques-into-skills` | meta | none | intermediate | false | none |

Set every current skill to maturity `stable`. Technical tags use two to five lowercase kebab-case identifiers derived from the actual workflow. Do not add a dependency merely because a skill can optionally route to a technology.

Declare only these concrete dependencies:

- `engineering-gsap-animations`: GSAP library, required, `https://gsap.com`;
- `reconstructing-images-as-threejs`: Three.js library, required, `https://threejs.org`;
- `translating-figma-to-nextjs`: Figma service, required, `https://www.figma.com`;
- `shipping-github-vercel-changes`: GitHub service and Vercel service, both optional, using their public HTTPS homepages.

For localized content:

- `displayName.en` is the existing `SKILL.md` H1 without title casing changes;
- `displayName.pt-BR` is a natural Portuguese product label, not a literal slug;
- `whenToUse.en` preserves the frontmatter trigger sentence;
- `whenToUse.pt-BR` is a complete human translation of that trigger;
- `summary` explains the workflow in one sentence without repeating `whenToUse`;
- `primaryBenefit` states the outcome rather than the implementation technique;
- `whenNotToUse` records the nearest meaningful boundary found in the skill body or routing guidance;
- use cases contain exactly two concrete outcomes;
- each locale contains one directly invocable prompt that names the slug unchanged.

No localized field may contain customer/project names or claims not supported by its `SKILL.md`.

- [ ] **Step 4: Create the six pack manifests**

Use the exact slugs, colors, statuses, and ordered membership from the design specification.

Active packs:

- `frontend-product`, color `electric-blue`, eight ordered skills;
- `motion`, color `violet`, five ordered skills;
- `game-development`, color `amber`, five ordered skills.

Planned packs:

- `architecture-engineering`, color `cyan`;
- `backend-data`, color `green`;
- `quality-testing`, color `coral`.

All pack versions are `1.0.0-beta.1`. Active packs are featured; planned packs are not featured and have empty skill arrays. Each locale has a name, one-sentence summary, explanatory description, and exactly two outcomes. Planned descriptions explicitly state that skills will enter through public proposals and independent validation.

- [ ] **Step 5: Verify content, relations, and privacy**

Run:

```bash
test "$(find catalog/skills -maxdepth 1 -name '*.json' | wc -l | tr -d ' ')" = "18"
test "$(find catalog/packs -maxdepth 1 -name '*.json' | wc -l | tr -d ' ')" = "6"
node --test scripts/validate-catalog.test.mjs
node scripts/validate-catalog.mjs
node scripts/validate-skills.mjs
git diff --check
```

Expected: 18 skill records, six packs, three active packs, complete translations, and no validation errors.

- [ ] **Step 6: Commit**

```bash
git add catalog/skills catalog/packs scripts/validate-catalog.test.mjs
git commit -m "feat: publish bilingual skill and pack metadata"
```

---

### Task 4: Deterministic catalog generation

**Files:**
- Create: `scripts/generate-catalog.mjs`
- Create: `scripts/generate-catalog.test.mjs`
- Create: `catalog/generated/catalog.json`
- Modify: `scripts/validate-catalog.mjs`
- Modify: `scripts/validate-catalog.test.mjs`

**Interfaces:**
- Consumes: `loadCatalog(repoRoot)` and validated sources from Tasks 2–3.
- Produces: `generateCatalog(repoRoot: string): Promise<object>`.
- Produces: `serializeCatalog(catalog: object): string`.
- Produces: `checkGeneratedCatalog(repoRoot: string): Promise<string[]>`.

- [ ] **Step 1: Write failing deterministic-generation tests**

Create `scripts/generate-catalog.test.mjs`:

```js
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { checkGeneratedCatalog, generateCatalog, serializeCatalog } from "./generate-catalog.mjs";
import { catalogFixture } from "./test-support/catalog-fixture.mjs";

test("generates stable sorted data independent of file creation order", async () => {
  const first = await catalogFixture({ creationOrder: ["beta", "alpha"] });
  const second = await catalogFixture({ creationOrder: ["alpha", "beta"] });
  assert.equal(serializeCatalog(await generateCatalog(first)), serializeCatalog(await generateCatalog(second)));
});

test("includes filters, counts, resolved packs, and a stable source digest", async () => {
  const root = await catalogFixture();
  const generated = await generateCatalog(root);
  assert.equal(generated.skills.length, 2);
  assert.equal(generated.packs[0].skills[0].slug, "alpha");
  assert.equal(generated.counts.skills, 2);
  assert.match(generated.sourceDigest, /^[a-f0-9]{64}$/);
});

test("detects stale generated catalog bytes", async () => {
  const root = await catalogFixture();
  const target = path.join(root, "catalog", "generated", "catalog.json");
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, "{}\n");
  assert.deepEqual(await checkGeneratedCatalog(root), ["catalog/generated/catalog.json is stale; run npm run catalog:generate"]);
});
```

Move the reusable fixture from `scripts/validate-catalog.test.mjs` to `scripts/test-support/catalog-fixture.mjs` and import it from both suites.

- [ ] **Step 2: Run generation tests and verify RED**

Run `node --test scripts/generate-catalog.test.mjs`.

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `generate-catalog.mjs`.

- [ ] **Step 3: Implement deterministic generation**

Create `scripts/generate-catalog.mjs`.

Canonicalize source data with recursively sorted object keys before hashing:

```js
function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

export function serializeCatalog(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}
```

`generateCatalog` must:

1. load and validate sources without checking generated drift;
2. throw one aggregate error when sources are invalid;
3. sort skills by slug;
4. order packs as active source records followed by planned source records;
5. expand pack members into `{ slug, displayName, summary, difficulty, maturity }` for both locales while retaining the canonical slug list;
6. expose sorted filter values for categories, packs, tags, maturity, difficulty, surfaces, operating systems, install modes, and dependency names;
7. expose counts for total skills, total/active/planned packs, category, maturity, difficulty, and active-pack membership;
8. calculate `sourceDigest` with SHA-256 over the canonical manifest, source skill records, and pack records;
9. omit timestamps, absolute paths, and filesystem enumeration order.

- [ ] **Step 4: Implement write and check CLI modes**

Direct invocation without flags creates the generated directory and writes the serialized result.

`--check` compares the expected string with the committed file and prints `Generated catalog is current.` or the stale error, setting exit code `1`.

Unknown flags fail with `Unknown option: <flag>`.

- [ ] **Step 5: Connect generated drift to catalog validation**

Implement `checkGeneratedCatalog(repoRoot)`. When `validateCatalog(repoRoot, { checkGenerated: true })` is called, append its errors after source validation succeeds. Avoid importing `validateCatalog` back into `generate-catalog.mjs`; place shared pure assembly in `scripts/lib/catalog.mjs` if needed to prevent a circular dependency.

Add a validation test proving check mode catches a stale file and normal fixture validation does not require a generated artifact.

- [ ] **Step 6: Generate the real artifact and verify GREEN**

Run:

```bash
node --test scripts/generate-catalog.test.mjs scripts/validate-catalog.test.mjs
node scripts/generate-catalog.mjs
node scripts/generate-catalog.mjs --check
node scripts/validate-catalog.mjs
node --test scripts/*.test.mjs scripts/lib/*.test.mjs
git diff --check
```

Expected: deterministic tests PASS, real generated catalog contains 18 skills and six packs, and check mode reports current.

- [ ] **Step 7: Commit**

```bash
git add scripts/generate-catalog.mjs scripts/generate-catalog.test.mjs scripts/test-support/catalog-fixture.mjs scripts/validate-catalog.mjs scripts/validate-catalog.test.mjs catalog/generated/catalog.json
git commit -m "feat: generate deterministic Agent Skills catalog"
```

---

### Task 5: Safe pack-aware installation

**Files:**
- Modify: `scripts/install-skills.mjs`
- Modify: `scripts/install-skills.test.mjs`
- Modify: `install.sh`
- Modify: `install.ps1`

**Interfaces:**
- Consumes: validated pack manifests from Tasks 2–3.
- Produces: `resolveInstallSelection({ availableSkills, packs, names?, packNames? }): string[]`.
- Extends: `installSkills({ repoRoot, destination, names?, packs? }): Promise<string[]>`.
- Preserves: existing CLI `--skill`, `--destination`, and full-collection behavior.
- Adds: repeated CLI `--pack <slug>`.

- [ ] **Step 1: Add failing resolver and installer tests**

Extend the repository fixture so its canonical skill tree contains `alpha`, `beta`, and `gamma`, and write active `frontend-product` and `motion` pack manifests plus a planned `backend-data` manifest. Define `frontend-product.skills` as `["beta", "alpha"]` and `motion.skills` as `["gamma", "beta"]` so pack order, overlap deduplication, and the mixed-selection result below are explicit.

Add:

```js
test("installs an active pack in manifest order", async () => {
  const repoRoot = await repositoryFixture();
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-pack-"));
  assert.deepEqual(await installSkills({ repoRoot, destination, packs: ["frontend-product"] }), ["beta", "alpha"]);
  assert.match(await readFile(path.join(destination, "alpha", "SKILL.md"), "utf8"), /name: alpha/);
});

test("installs the deterministic union of packs and explicit skills", async () => {
  const repoRoot = await repositoryFixture();
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-union-"));
  assert.deepEqual(
    await installSkills({ repoRoot, destination, packs: ["motion", "frontend-product"], names: ["gamma", "alpha"] }),
    ["gamma", "beta", "alpha"],
  );
});

test("rejects unknown and planned packs before destination mutation", async () => {
  const repoRoot = await repositoryFixture();
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-pack-reject-"));
  await writeFile(path.join(destination, "sentinel.txt"), "preserve");
  await assert.rejects(installSkills({ repoRoot, destination, packs: ["missing"] }), /Unknown pack: missing/);
  await assert.rejects(installSkills({ repoRoot, destination, packs: ["backend-data"] }), /Pack is not installable: backend-data/);
  assert.equal(await readFile(path.join(destination, "sentinel.txt"), "utf8"), "preserve");
});
```

- [ ] **Step 2: Run focused tests and verify RED**

Run `node --test scripts/install-skills.test.mjs`.

Expected: FAIL because pack selection is ignored or the signature does not accept it.

- [ ] **Step 3: Implement pure selection resolution**

Export `resolveInstallSelection` and apply these exact rules:

1. validate every explicit skill and every pack before returning;
2. reject planned packs before destination resolution or mutation;
3. deduplicate pack arguments while preserving first occurrence;
4. append each selected pack's members in manifest order;
5. append explicit skills in lexical order;
6. preserve the first occurrence of each skill across the combined list;
7. when neither names nor packs are supplied, return every available skill in canonical discovery order.

Load pack manifests through the catalog module, and refuse installation when the relevant catalog source has parse or integrity errors.

- [ ] **Step 4: Integrate selection without weakening filesystem safety**

Extend `installSkills` with `packs`. Resolve the complete selection before:

- resolving the destination;
- creating directories;
- staging files;
- renaming an installed skill.

Do not change source overlap, derived-target prevalidation, staging, backup, rollback, or symlink defenses.

- [ ] **Step 5: Add CLI pack parsing and wrapper smoke tests**

`parseArgs` returns `{ destination, names: [], packs: [] }`, accepts repeated `--pack`, and retains the same unknown-option failure.

Smoke commands:

```bash
target="$(mktemp -d)"
./install.sh --destination "$target" --pack motion
test -f "$target/craft-premium-motion/SKILL.md"
test -f "$target/reconstructing-images-as-threejs/SKILL.md"
test ! -e "$target/designing-action-combat/SKILL.md"
```

PowerShell uses the same arguments unchanged because `install.ps1` delegates to Node.

- [ ] **Step 6: Verify GREEN and commit**

Run:

```bash
node --test scripts/install-skills.test.mjs scripts/bootstrap-project.test.mjs
node --test scripts/*.test.mjs scripts/lib/*.test.mjs
node scripts/validate-skills.mjs
node scripts/validate-catalog.mjs
node scripts/generate-catalog.mjs --check
git diff --check
git add scripts/install-skills.mjs scripts/install-skills.test.mjs install.sh install.ps1
git commit -m "feat: install thematic skill packs safely"
```

Expected: pack, mixed, planned, atomic rejection, and all prior hardening tests PASS.

---

### Task 6: Package scripts, cross-platform CI, and catalog documentation

**Files:**
- Modify: `package.json`
- Modify: `.github/workflows/validate.yml`
- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Modify: `MAPPING.md`

**Interfaces:**
- Consumes: every test, validator, generator, and installer from Tasks 1–5.
- Produces: one aggregate local/CI phase gate and user-facing pack guidance.

- [ ] **Step 1: Prove catalog package scripts are absent**

Run:

```bash
node -e 'const p=require("./package.json"); if(p.scripts["validate:catalog"] || p.scripts["catalog:generate"] || p.scripts["catalog:check"]) process.exit(1)'
```

Expected: exit `0`.

- [ ] **Step 2: Add package scripts and aggregate validation**

Preserve existing scripts and add:

```json
{
  "catalog:generate": "node scripts/generate-catalog.mjs",
  "catalog:check": "node scripts/generate-catalog.mjs --check",
  "validate:catalog": "node scripts/validate-catalog.mjs"
}
```

Set aggregate validation exactly to:

```text
node scripts/validate-skills.mjs && node scripts/validate-catalog.mjs && node scripts/generate-catalog.mjs --check && node scripts/validate-plugin.mjs
```

- [ ] **Step 3: Extend the Linux and Windows CI smoke contract**

Keep the existing OS matrix and package gates. Extend the Linux smoke with an isolated pack destination and exact included/excluded assertions.

Add a Windows pack smoke:

```powershell
$packTarget = Join-Path $env:RUNNER_TEMP "agent-skills-motion-pack"
./install.ps1 --destination $packTarget --pack motion
if (-not (Test-Path (Join-Path $packTarget "craft-premium-motion/SKILL.md"))) { exit 1 }
if (Test-Path (Join-Path $packTarget "designing-action-combat/SKILL.md")) { exit 1 }
```

Do not duplicate catalog commands outside `npm test` and `npm run validate`; the package scripts are the shared gate.

- [ ] **Step 4: Update documentation**

Update `README.md` in both English and Portuguese-facing guidance with:

- catalog directory and source-of-truth explanation;
- the three active and three planned packs;
- `./install.sh --pack motion` and `./install.ps1 --pack motion`;
- mixed `--pack` and `--skill` selection;
- planned-pack rejection behavior;
- catalog generation and validation commands;
- contribution rule requiring metadata and both locales for every new skill;
- link to the catalog/packs design and implementation plan.

Add an unreleased Catalog & Packs subsection under `1.0.0-beta.1` in `CHANGELOG.md`.

Update `MAPPING.md` only where the new pack/category mapping clarifies distribution. Do not alter recorded upstream attribution decisions.

- [ ] **Step 5: Run the complete phase gate**

Try the official package commands first. If the Work environment blocks npm before execution, record the environment limitation and run their direct Node equivalents.

```bash
npm test
npm run validate
```

Direct dependency-free equivalents:

```bash
node --test scripts/*.test.mjs scripts/lib/*.test.mjs
node scripts/validate-skills.mjs
node scripts/validate-catalog.mjs
node scripts/generate-catalog.mjs --check
node scripts/validate-plugin.mjs
```

Then run:

```bash
full_target="$(mktemp -d)"
pack_target="$(mktemp -d)"
./install.sh --destination "$full_target"
./install.sh --destination "$pack_target" --pack motion
test "$(find "$full_target" -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l | tr -d ' ')" = "18"
test "$(find "$pack_target" -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l | tr -d ' ')" = "5"
git diff --check
git status --short
```

Expected: all tests and validators PASS, generated data is current, the full collection installs 18 skills, Motion installs five, and only intended files changed.

- [ ] **Step 6: Commit and prepare the draft PR**

```bash
git add package.json .github/workflows/validate.yml README.md CHANGELOG.md MAPPING.md
git commit -m "ci: verify bilingual catalog and skill packs"
```

After task review and whole-branch review pass, push `feat/agent-skills-studio-catalog-packs` and open a draft PR against `dev` titled `feat: add bilingual catalog and thematic packs`. Do not merge.

- [ ] **Step 7: Verify the remote phase gate**

Confirm both Ubuntu and Windows matrix jobs pass. Inspect the PR for:

- exactly 18 skill records;
- three active and three planned packs;
- complete `en` and `pt-BR` content;
- current deterministic generated catalog;
- synchronized `1.0.0-beta.1` versions;
- working full, pack, and individual installation;
- no skill or catalog symlinks;
- no root-level compatibility copies.

Expected: the draft PR remains open and mergeable with green required checks.

---

## Follow-on phase

After this PR is approved into `dev`, write the dedicated microsite implementation plan. The site must consume `catalog/generated/catalog.json`; it must not invent parallel metadata or read GitHub at runtime.

