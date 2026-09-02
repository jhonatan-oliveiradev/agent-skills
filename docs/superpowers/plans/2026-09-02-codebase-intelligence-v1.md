# Codebase Intelligence v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual five-skill Codebase Intelligence pack that uses optional CodeGraph evidence when available, falls back safely when it is not, and reduces unnecessary context expansion.

**Architecture:** Five narrow, engine-agnostic skills share an evidence-ledger and progressive-context contract. CodeGraph is documented as the official optional runtime, while the catalog, installers, routing benchmark, plugin, and microsite continue to consume the canonical `skills/` and generated catalog through existing generic mechanisms.

**Tech Stack:** Markdown Agent Skills, JSON Schema and catalog manifests, Node.js 22 built-in test runner, deterministic catalog generator, Bash/PowerShell installers, Next.js 16.3.1, React 19.2.8, TypeScript 5.9, Vitest 4.

**Spec:** `docs/superpowers/specs/2026-09-02-codebase-intelligence-v1-design.md`

## Global Constraints

- Keep every canonical version owner and every new skill/pack record at exactly `1.0.0-rc.1`.
- Do not modify `VERSION`, root `package.json.version`, `.codex-plugin/plugin.json.version`, `catalog/catalog.json.version`, or `apps/web/package.json.version`.
- Do not create `.codegraph/`, install CodeGraph, run `codegraph init`, or make CodeGraph required.
- Treat CodeGraph as an optional callable capability; use a targeted repository-evidence fallback when unavailable or inconclusive.
- Mark material structural claims as `observed`, `inferred`, or `unresolved` with source and location.
- Enforce progressive context expansion and explicit sufficiency/stop conditions; do not claim a fixed token-saving percentage.
- Preserve distinct ownership for Codebase Intelligence, Architecture & Engineering, Engineering Workflow, Quality & Testing, and Systematic Debugging.
- Use the GitHub connector for repository reads, branches, commits, pull requests, and reviews; do not use local Git for operations the connector supports.
- Branches must descend from `main`; continue on `docs/codebase-intelligence-v1-design`, which was created from `main`, unless the user approves a replacement branch.
- CI is the source of truth. Do not claim GREEN without a completed successful run on the cited HEAD.
- Do not merge a pull request without explicit user authorization.
- If a test fails unexpectedly, stop feature patching and use `superpowers:systematic-debugging`.
- Temporary workflow materializers must be restored byte-identically before final CI and never count as final evidence.

---

## File map

### New canonical methods

- `skills/mapping-existing-codebase-structure/SKILL.md` — map current modules, boundaries, ownership signals, entrypoints, and dependency direction.
- `skills/tracing-code-execution-paths/SKILL.md` — trace ordered execution with observed, inferred, and unresolved transitions.
- `skills/analyzing-change-blast-radius/SKILL.md` — identify direct, transitive, inferred, and unresolved change impact.
- `skills/investigating-codebase-semantically/SKILL.md` — locate behavioral implementation and validate candidates.
- `skills/planning-codebase-changes-with-evidence/SKILL.md` — produce a change evidence brief and hand off without executing another pack's work.
- `skills/mapping-existing-codebase-structure/references/evidence-contract.md` — canonical evidence-ledger, runtime-detection, fallback, progressive-expansion, and stop-condition reference shared by links from all five skills.
- `skills/mapping-existing-codebase-structure/references/codegraph.md` — attributed CodeGraph setup and optional-runtime guide.

### New catalog records

- `catalog/skills/mapping-existing-codebase-structure.json`
- `catalog/skills/tracing-code-execution-paths.json`
- `catalog/skills/analyzing-change-blast-radius.json`
- `catalog/skills/investigating-codebase-semantically.json`
- `catalog/skills/planning-codebase-changes-with-evidence.json`
- `catalog/packs/codebase-intelligence.json`

### Existing contracts to modify

- `catalog/schemas/skill.schema.json` — add `codebase-intelligence` to the category enum.
- `catalog/routing-scenarios.json` — add five primary cases plus overlap, runtime, fallback, and context-efficiency boundaries.
- `skills/selecting-working-methods/SKILL.md` — add concise intent-first ownership guidance without becoming a static decision table.
- `scripts/release-readiness-routing.test.mjs` — require the new routing boundary scenario ids.
- `scripts/selecting-working-methods.test.mjs` — verify Codebase Intelligence handoff boundaries.
- `scripts/generate-catalog.test.mjs` and catalog validation fixtures only where hard-coded counts or enum expectations require updates.
- `catalog/generated/catalog.json` — regenerate; never edit manually.
- `apps/web/src/generated/catalog.json` — synchronize through the existing web sync script; never edit manually.
- `apps/web/src/lib/catalog.test.ts` — update totals to 54/11 and assert localized pack resolution/install commands.
- `apps/web/src/components/packs/pack-blueprint.test.tsx` — prove the five-skill pack renders through the existing generic pack page.
- `README.md` — add the pack, five methods, optional CodeGraph positioning, and 54/11 totals.

### New focused tests

- `scripts/codebase-intelligence-methods.test.mjs` — method content, evidence, fallback, context-efficiency, and ownership contracts.
- `scripts/codebase-intelligence-pack.test.mjs` — category, bilingual metadata, pack order, installer isolation, and version freeze.
- `apps/web/src/components/skills/codebase-intelligence-methods.test.tsx` — localized skill-route rendering and semantic ownership copy.

---

### Task 1: Canonical method and evidence contracts

**Files:**
- Create: `scripts/codebase-intelligence-methods.test.mjs`
- Create: `skills/mapping-existing-codebase-structure/SKILL.md`
- Create: `skills/tracing-code-execution-paths/SKILL.md`
- Create: `skills/analyzing-change-blast-radius/SKILL.md`
- Create: `skills/investigating-codebase-semantically/SKILL.md`
- Create: `skills/planning-codebase-changes-with-evidence/SKILL.md`
- Create: `skills/mapping-existing-codebase-structure/references/evidence-contract.md`

**Interfaces:**
- Consumes: the ownership and evidence contracts in the approved spec.
- Produces: five canonical skill slugs and one shared reference path, `../mapping-existing-codebase-structure/references/evidence-contract.md`, for catalog and routing tasks.

- [ ] **Step 1: Create a failing method-contract test**

Create `scripts/codebase-intelligence-methods.test.mjs` with the following contract:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const slugs = [
  "mapping-existing-codebase-structure",
  "tracing-code-execution-paths",
  "analyzing-change-blast-radius",
  "investigating-codebase-semantically",
  "planning-codebase-changes-with-evidence",
];

async function skill(slug) {
  return readFile(path.join(root, "skills", slug, "SKILL.md"), "utf8");
}

test("publishes five concise discovery-first Codebase Intelligence methods", async () => {
  for (const slug of slugs) {
    const source = await skill(slug);
    assert.match(source, new RegExp(`^---\\nname: ${slug}\\n`, "m"));
    assert.match(source, /^description: Use when /m);
    assert.match(source, /observed/i);
    assert.match(source, /inferred/i);
    assert.match(source, /unresolved/i);
    assert.match(source, /fallback/i);
    assert.match(source, /stop|sufficien/i);
    assert.ok(source.length < 6500, `${slug} should remain focused and load on demand`);
  }
});

test("requires non-invasive runtime detection and progressive context expansion", async () => {
  const sources = await Promise.all(slugs.map(skill));
  const combined = sources.join("\n");
  assert.match(combined, /runtime.*available|available.*runtime/i);
  assert.match(combined, /do not install|never install/i);
  assert.match(combined, /do not.*codegraph init|never.*codegraph init/i);
  assert.match(combined, /narrow/i);
  assert.match(combined, /expand/i);
  assert.match(combined, /source/i);
  assert.match(combined, /location/i);
});

test("keeps neighboring ownership outside the five methods", async () => {
  assert.match(await skill("mapping-existing-codebase-structure"), /does not design|do not design/i);
  assert.match(await skill("tracing-code-execution-paths"), /root cause|systematic debugging/i);
  assert.match(await skill("analyzing-change-blast-radius"), /does not decide|do not decide/i);
  assert.match(await skill("investigating-codebase-semantically"), /textual match|false positive/i);
  const planning = await skill("planning-codebase-changes-with-evidence");
  assert.match(planning, /change evidence brief/i);
  assert.match(planning, /does not.*implement|do not.*implement/i);
  assert.match(planning, /Engineering Workflow|writing-plans/i);
});
```

- [ ] **Step 2: Run the focused test and capture RED evidence**

Run:

```bash
node --test scripts/codebase-intelligence-methods.test.mjs
```

Expected: FAIL with `ENOENT` for the first missing `skills/<slug>/SKILL.md`. Record the run and exact failure before creating method files.

- [ ] **Step 3: Write the shared evidence contract**

Create `skills/mapping-existing-codebase-structure/references/evidence-contract.md` with these exact sections and requirements:

```markdown
# Codebase Intelligence Evidence Contract

## Ask narrowly
State one structural question, its scope, and the decision the answer will support.

## Detect capability non-invasively
Use a code-intelligence runtime only when callable tools are already available. Never install a runtime, run codegraph init, or create .codegraph/ without explicit authorization.

## Query progressively
Start with the smallest symbol, relation, or targeted search that can answer the question. Expand only to close a named evidence gap.

## Record the ledger
For every material claim record claim, status (observed, inferred, unresolved), source, location, confidence, and relevance.

## Fall back explicitly
When graph evidence is unavailable or inconclusive, say so and use targeted symbols, search, imports, references, tests, configuration, and direct reads. Text matches do not prove callers, callees, ownership, or a complete blast radius.

## Stop at sufficiency
Stop when the question is answered with traceable evidence, critical relevant dependencies were checked, gaps are classified, and further reading is unlikely to change the immediate decision.

## Hand off
Return the evidence artifact owned by the current method, then name the next owner instead of executing architecture, planning, testing, debugging, or implementation work.
```

- [ ] **Step 4: Write the five minimal canonical skills**

Each `SKILL.md` must contain:

- YAML frontmatter with the exact slug and a `description: Use when ...` trigger;
- a one-sentence ownership principle;
- a link to the shared evidence contract;
- a numbered workflow implementing narrow question → optional runtime → fallback → ledger → sufficiency;
- its exact output contract from spec section 11;
- an explicit “Does not own” section matching spec section 4;
- no universal token-saving claim and no automatic setup.

Use these ownership sentences verbatim:

```markdown
mapping-existing-codebase-structure: Observe the structure that exists; do not design the structure that should replace it.
tracing-code-execution-paths: Reconstruct an execution path without turning correlation or reachability into a root-cause claim.
analyzing-change-blast-radius: Bound potential impact from evidence without deciding or implementing the change.
investigating-codebase-semantically: Find behavior by intent, then validate candidates in code instead of treating a textual match as ownership.
planning-codebase-changes-with-evidence: Produce a change evidence brief for another planning method; do not execute the implementation plan.
```

- [ ] **Step 5: Run the focused method test and capture GREEN evidence**

Run:

```bash
node --test scripts/codebase-intelligence-methods.test.mjs
```

Expected: PASS for all three tests.

- [ ] **Step 6: Commit the isolated method slice through the GitHub connector**

Commit only the seven files from this task with:

```text
feat: add Codebase Intelligence methods
```

---

### Task 2: Bilingual catalog pack and real installer contract

**Files:**
- Create: `scripts/codebase-intelligence-pack.test.mjs`
- Modify: `catalog/schemas/skill.schema.json`
- Create: five `catalog/skills/<slug>.json` files
- Create: `catalog/packs/codebase-intelligence.json`
- Modify: `catalog/generated/catalog.json` through generation only

**Interfaces:**
- Consumes: the five slugs from Task 1 and existing catalog schemas/generator/installer.
- Produces: category `codebase-intelligence`, ordered active pack membership, five bilingual records, and generated catalog totals of 54 skills / 11 packs.

- [ ] **Step 1: Create the failing pack contract**

Base `scripts/codebase-intelligence-pack.test.mjs` on `scripts/architecture-engineering-pack.test.mjs`. Define:

```js
const codebaseIntelligenceSkills = [
  "mapping-existing-codebase-structure",
  "tracing-code-execution-paths",
  "analyzing-change-blast-radius",
  "investigating-codebase-semantically",
  "planning-codebase-changes-with-evidence",
];
```

Add tests that assert:

```js
assert.equal(pack.slug, "codebase-intelligence");
assert.equal(pack.status, "active");
assert.equal(pack.version, "1.0.0-rc.1");
assert.deepEqual(pack.skills, codebaseIntelligenceSkills);
assert.ok(schema.properties.category.enum.includes("codebase-intelligence"));
```

For every metadata record assert category, pack membership, `maturity === "beta"`, `version === "1.0.0-rc.1"`, complete EN/PT-BR names, two use cases, and at least one example prompt. Copy the real CLI installation test pattern and assert the destination contains exactly the five ordered members after sorting.

- [ ] **Step 2: Run the focused pack test and capture RED evidence**

Run:

```bash
node --test scripts/codebase-intelligence-pack.test.mjs
```

Expected: FAIL because `catalog/packs/codebase-intelligence.json` does not exist.

- [ ] **Step 3: Add the category and pack manifest**

Append `"codebase-intelligence"` to `catalog/schemas/skill.schema.json#/properties/category/enum`.

Create `catalog/packs/codebase-intelligence.json` with:

```json
{
  "$schema": "../schemas/pack.schema.json",
  "slug": "codebase-intelligence",
  "status": "active",
  "featured": false,
  "color": "indigo",
  "version": "1.0.0-rc.1",
  "skills": [
    "mapping-existing-codebase-structure",
    "tracing-code-execution-paths",
    "analyzing-change-blast-radius",
    "investigating-codebase-semantically",
    "planning-codebase-changes-with-evidence"
  ],
  "locales": {
    "en": {
      "name": "Codebase Intelligence",
      "summary": "Evidence-led structure mapping, execution tracing, semantic investigation, and change-impact analysis for existing codebases.",
      "description": "An engine-agnostic workflow for understanding code with progressive context expansion, explicit uncertainty, and optional CodeGraph acceleration.",
      "outcomes": [
        "Reconstruct codebase structure and behavior from traceable evidence instead of assumptions",
        "Reduce unnecessary context expansion while preparing safer architecture, planning, testing, and debugging handoffs"
      ]
    },
    "pt-BR": {
      "name": "Inteligência de Codebase",
      "summary": "Mapeamento estrutural, rastreamento de execução, investigação semântica e análise de impacto orientados por evidências em codebases existentes.",
      "description": "Um fluxo agnóstico de engine para compreender código com expansão progressiva de contexto, incerteza explícita e aceleração opcional pelo CodeGraph.",
      "outcomes": [
        "Reconstruir estrutura e comportamento da codebase a partir de evidências rastreáveis, não de suposições",
        "Reduzir expansão desnecessária de contexto ao preparar handoffs mais seguros para arquitetura, planejamento, testes e debugging"
      ]
    }
  }
}
```

- [ ] **Step 4: Add five complete bilingual skill records**

For each record, copy the existing schema shape from `catalog/skills/planning-safe-refactors.json` and set:

```text
category: codebase-intelligence
packs: [codebase-intelligence]
maturity: beta
version: 1.0.0-rc.1
updatedAt: 2026-09-02
compatibility.surfaces: [chatgpt, codex]
compatibility.operatingSystems: [linux, macos, windows]
compatibility.installModes: [plugin, filesystem]
dependencies: []
```

Use reciprocal `relatedSkills` only where the relationship is real:

```text
mapping-existing-codebase-structure → designing-software-boundaries, choosing-application-architecture
tracing-code-execution-paths → investigating-codebase-semantically
analyzing-change-blast-radius → planning-safe-refactors, building-regression-tests
investigating-codebase-semantically → tracing-code-execution-paths
planning-codebase-changes-with-evidence → planning-engineering-work, designing-test-strategies
```

Every EN/PT-BR `whenNotToUse` must state the neighboring owner, and every prompt must request evidence status and sources. Do not list CodeGraph as a required dependency; if included in metadata, add it as an optional tool dependency with `required: false` and `url: "https://github.com/colbymchenry/codegraph"`.

- [ ] **Step 5: Generate and validate the canonical catalog**

Run:

```bash
npm run catalog:generate
node --test scripts/codebase-intelligence-pack.test.mjs
npm run validate:catalog
npm run catalog:check
```

Expected: all commands PASS; `catalog/generated/catalog.json` reports 54 skills and 11 active packs.

- [ ] **Step 6: Commit the catalog slice through the GitHub connector**

Commit the schema, five metadata records, pack manifest, focused test, and generated catalog with:

```text
feat: publish Codebase Intelligence pack
```

---

### Task 3: Intent-first routing and cross-pack boundaries

**Files:**
- Modify: `catalog/routing-scenarios.json`
- Modify: `scripts/release-readiness-routing.test.mjs`
- Modify: `skills/selecting-working-methods/SKILL.md`
- Modify: `scripts/selecting-working-methods.test.mjs`

**Interfaces:**
- Consumes: five canonical slugs and the existing benchmark schema `{ id, prompt, primary, supporting, excluded, rationale }`.
- Produces: one primary scenario per new skill, explicit overlap ids, and router guidance based on intent rather than runtime.

- [ ] **Step 1: Extend tests with failing required routing ids**

Add these ids to the required boundary list in `scripts/release-readiness-routing.test.mjs`:

```js
"codebase-current-vs-future-architecture",
"codebase-evidence-vs-engineering-plan",
"codebase-test-impact-vs-test-strategy",
"execution-trace-vs-root-cause",
"semantic-search-vs-text-match",
"codegraph-optional-runtime",
"codegraph-explicit-setup",
"codebase-context-sufficiency",
```

Extend `scripts/selecting-working-methods.test.mjs` with:

```js
test("routes codebase understanding by intent rather than runtime availability", async () => {
  const source = await readFile(skillPath, "utf8");
  assert.match(source, /existing codebase|current structure/i);
  assert.match(source, /Architecture & Engineering/i);
  assert.match(source, /Engineering Workflow/i);
  assert.match(source, /Quality & Testing/i);
  assert.match(source, /runtime.*does not|does not.*runtime/i);
});
```

- [ ] **Step 2: Run routing tests and capture RED evidence**

Run:

```bash
node --test scripts/release-readiness-routing.test.mjs scripts/selecting-working-methods.test.mjs
```

Expected: FAIL for missing new scenario ids and missing router copy.

- [ ] **Step 3: Add five primary and eight boundary scenarios**

Add at least these primary ids to `catalog/routing-scenarios.json`:

```text
map-existing-codebase-structure
trace-code-execution-path
analyze-change-blast-radius
investigate-codebase-semantically
prepare-codebase-change-evidence
```

Use exact primary owners matching the five slugs. Add the eight boundary ids from Step 1. Each scenario must:

- contain a realistic prompt of at least 20 characters;
- select one primary or deliberate `null`;
- put neighboring owners in `supporting` only for a separate current responsibility;
- put tempting overlapping owners in `excluded`;
- explain artifact/stage ownership in a rationale of at least 20 characters.

Required boundary outcomes:

```text
current map → mapping-existing-codebase-structure; exclude designing-software-boundaries
future redesign → designing-software-boundaries; mapping may support only if current evidence is separately requested
evidence brief → planning-codebase-changes-with-evidence; exclude planning-engineering-work
executable plan → planning-engineering-work; evidence brief may support only when not already supplied
affected tests → analyzing-change-blast-radius; exclude designing-test-strategies
test strategy → designing-test-strategies; blast-radius report may be an input
execution reachability → tracing-code-execution-paths; exclude causal diagnosis
behavioral owner → investigating-codebase-semantically; reject text-only certainty
runtime absent → keep the same Codebase Intelligence owner and use fallback
setup requested → setup is explicit; never imply automatic installation or initialization
sufficiency reached → stop instead of loading adjacent modules
```

- [ ] **Step 4: Add concise router guidance**

Add one short section to `skills/selecting-working-methods/SKILL.md`:

```markdown
## Codebase evidence routing
Route by intent, not by runtime. Use Codebase Intelligence to understand an existing implementation; Architecture & Engineering to decide future structure; Engineering Workflow to turn approved direction into executable work; Quality & Testing to define proof; and systematic debugging to establish root cause. An available graph runtime changes evidence acquisition, not method ownership.
```

Keep the router under 6500 characters.

- [ ] **Step 5: Run routing tests and full benchmark validation**

Run:

```bash
node --test scripts/release-readiness-routing.test.mjs scripts/selecting-working-methods.test.mjs
```

Expected: PASS, including primary coverage for all 54 canonical skills and all 11 active packs.

- [ ] **Step 6: Commit the routing slice through the GitHub connector**

Commit with:

```text
test: route Codebase Intelligence boundaries
```

---

### Task 4: Official optional CodeGraph guidance

**Files:**
- Create: `skills/mapping-existing-codebase-structure/references/codegraph.md`
- Modify: `scripts/codebase-intelligence-methods.test.mjs`
- Modify: `README.md`

**Interfaces:**
- Consumes: upstream `colbymchenry/codegraph` documentation verified at implementation time and the runtime contract from Task 1.
- Produces: attributed, non-required setup guidance and public Studio positioning.

- [ ] **Step 1: Add failing documentation assertions**

Extend `scripts/codebase-intelligence-methods.test.mjs`:

```js
test("documents CodeGraph as attributed optional setup", async () => {
  const source = await readFile(
    path.join(root, "skills", "mapping-existing-codebase-structure", "references", "codegraph.md"),
    "utf8",
  );
  assert.match(source, /https:\/\/github\.com\/colbymchenry\/codegraph/);
  assert.match(source, /codegraph install/);
  assert.match(source, /codegraph init/);
  assert.match(source, /codegraph ui/);
  assert.match(source, /optional/i);
  assert.match(source, /explicit|authorization/i);
  assert.match(source, /fallback/i);
  assert.doesNotMatch(source, /required dependency/i);
});
```

Add a README contract to the same test requiring `Codebase Intelligence v1`, `54 reusable skills`, `11 active packs`, and `CodeGraph`.

- [ ] **Step 2: Run the documentation test and capture RED evidence**

Run:

```bash
node --test scripts/codebase-intelligence-methods.test.mjs
```

Expected: FAIL because `references/codegraph.md` does not exist and README still reports 49/10.

- [ ] **Step 3: Verify upstream facts through the GitHub connector**

Read current upstream primary sources from `colbymchenry/codegraph`, including README/setup documentation and the release/tag intended for citation. Confirm commands before writing them. If upstream differs from the spec's researched state, document the current verified command and mark the discrepancy; do not preserve a stale claim merely to satisfy prose.

Do not install CodeGraph or initialize the Studio repository.

- [ ] **Step 4: Write the optional integration guide**

Create `references/codegraph.md` with these sections:

```markdown
# Optional CodeGraph Integration
## What CodeGraph adds
## Capability detection
## Explicit installation
## Explicit per-project initialization
## MCP use
## Graph UI
## Fallback without CodeGraph
## Evidence and uncertainty
## Upstream reference
```

State that `codegraph install`, `codegraph init`, and `codegraph ui` are user-authorized operations, that the skills remain functional without them, and that runtime output still needs provenance. Attribute the upstream repository; do not copy its prose.

- [ ] **Step 5: Update README public positioning**

Update the opening totals to 54/11, add the five skills under a `Codebase intelligence` list, add an active pack bullet with five skills, and add a `Codebase Intelligence v1` section explaining:

- existing-code understanding vs future architecture;
- evidence ledger;
- progressive context expansion;
- optional CodeGraph acceleration;
- verified fallback;
- no automatic installation, indexing, or vendor dependency.

Do not change version or Stable language.

- [ ] **Step 6: Run the focused tests and validators**

Run:

```bash
node --test scripts/codebase-intelligence-methods.test.mjs
npm run validate:skills
npm run validate:catalog
```

Expected: PASS.

- [ ] **Step 7: Commit the integration-doc slice through the GitHub connector**

Commit with:

```text
docs: add optional CodeGraph integration
```

---

### Task 5: Installer and microsite surface contracts

**Files:**
- Modify: `apps/web/src/lib/catalog.test.ts`
- Modify: `apps/web/src/components/packs/pack-blueprint.test.tsx`
- Create: `apps/web/src/components/skills/codebase-intelligence-methods.test.tsx`
- Modify: `apps/web/src/generated/catalog.json` through `apps/web/scripts/sync-catalog.mjs` only
- Modify: `.github/workflows/validate.yml` only if a permanent Codebase Intelligence smoke assertion is approved and justified

**Interfaces:**
- Consumes: generated 54/11 catalog and generic pack/skill routes.
- Produces: localized web evidence and Linux/Windows installer evidence without adding a special runtime UI.

- [ ] **Step 1: Add failing web catalog and pack assertions**

In `apps/web/src/lib/catalog.test.ts`, change expected totals from 49/10 to 54/11 and assert:

```ts
expect(packs.find((pack) => pack.slug === "codebase-intelligence")).toMatchObject({
  name: "Inteligência de Codebase",
  status: "active",
});
expect(packs.find((pack) => pack.slug === "codebase-intelligence")?.skills).toHaveLength(5);
expect(adapter.getPackInstallCommands?.("codebase-intelligence", "active")).toEqual({
  bash: "./install.sh --pack codebase-intelligence",
  powershell: "./install.ps1 --pack codebase-intelligence",
});
```

In `pack-blueprint.test.tsx`, add a test rendering `/en/packs/codebase-intelligence`, asserting active state, five method links, `Install this pack`, and `./install.sh --pack codebase-intelligence`.

Create `codebase-intelligence-methods.test.tsx` by following the route-render pattern in `architecture-engineering-methods.test.tsx`; assert EN and PT-BR rendering for at least `mapping-existing-codebase-structure` and `planning-codebase-changes-with-evidence`, including when-to-use, when-not-to-use, and install command.

- [ ] **Step 2: Run web tests and capture RED evidence**

Run:

```bash
npm run web:test -- --run apps/web/src/lib/catalog.test.ts apps/web/src/components/packs/pack-blueprint.test.tsx apps/web/src/components/skills/codebase-intelligence-methods.test.tsx
```

If the root wrapper does not forward Vitest paths correctly, run:

```bash
npm --prefix apps/web test -- src/lib/catalog.test.ts src/components/packs/pack-blueprint.test.tsx src/components/skills/codebase-intelligence-methods.test.tsx
```

Expected: FAIL until the web catalog projection is synchronized or until new assertions match the generated records.

- [ ] **Step 3: Synchronize the web catalog mechanically**

Run the existing synchronization path:

```bash
npm --prefix apps/web run pretest
```

Do not edit `apps/web/src/generated/catalog.json` by hand.

- [ ] **Step 4: Prove real pack installation without changing installer logic**

Run:

```bash
node --test scripts/codebase-intelligence-pack.test.mjs
```

The focused test must install exactly the five skills through `scripts/install-skills.mjs --pack codebase-intelligence`. Do not modify installer implementation unless this existing generic path fails; if it fails, use systematic debugging before changing it.

Only add a permanent Codebase Intelligence smoke to `.github/workflows/validate.yml` if the current pack test cannot provide equivalent Linux/Windows CI coverage. If added, use a separate temporary destination and assert one included and one excluded skill on both operating systems.

- [ ] **Step 5: Run focused and full web gates**

Run:

```bash
npm run web:test
npm run web:typecheck
npm run web:lint
NEXT_PUBLIC_SITE_URL=https://skills.jhonatanoliveira.com npm run web:build
```

Expected: all PASS locally before CI. Do not claim final GREEN until CI confirms the same branch HEAD.

- [ ] **Step 6: Commit the public-surface slice through the GitHub connector**

Commit with:

```text
test: expose Codebase Intelligence surfaces
```

---

### Task 6: Full repository verification, review, and PR handoff

**Files:**
- Verify: every file changed in Tasks 1–5
- Do not modify: version owners, release promotion files, Stable changelog
- Restore: any temporary `.github/workflows/*.yml` materializer byte-identically before final HEAD

**Interfaces:**
- Consumes: completed pack, catalog, routing, docs, installers, and web surfaces.
- Produces: one reviewable branch HEAD, CI evidence, code review findings, and an unmerged PR.

- [ ] **Step 1: Verify version freeze and forbidden artifacts**

Using GitHub connector reads/diff inspection, prove:

```text
VERSION = 1.0.0-rc.1
package.json.version = 1.0.0-rc.1
.codex-plugin/plugin.json.version = 1.0.0-rc.1
catalog/catalog.json.version = 1.0.0-rc.1
apps/web/package.json.version = 1.0.0-rc.1
no .codegraph/ path exists
release/stable-readiness.json was not repurposed as new-pack evidence
```

- [ ] **Step 2: Run the complete local verification sequence**

Run on one unchanged HEAD:

```bash
npm test
npm run validate
npm run catalog:check
npm run web:test
npm run web:typecheck
npm run web:lint
NEXT_PUBLIC_SITE_URL=https://skills.jhonatanoliveira.com npm run web:build
```

Expected: every command exits 0. Capture command, exit status, and HEAD. If any command fails, use systematic debugging and rerun the affected gate plus the complete sequence after the fix.

- [ ] **Step 3: Inspect the final diff for scope and generated-file integrity**

Confirm:

- exactly five new canonical skills;
- exactly five new skill records and one new pack record;
- 54 skills and 11 active packs in both generated catalog projections;
- no manually divergent generated JSON;
- no adapter, wrapper, graph viewer, database, API, or runtime dependency;
- no version/release promotion;
- no copied upstream prose;
- no placeholder markers;
- no unrelated formatting/refactor changes.

- [ ] **Step 4: Request code review**

Invoke `superpowers:requesting-code-review`. Review against the spec and this plan, paying special attention to semantic overlap, optional-runtime safety, unsupported claims, routing exclusions, and context-efficiency language.

Address findings through new RED → GREEN cycles. Do not silently dismiss a technically valid finding.

- [ ] **Step 5: Open an unmerged pull request to `main` through the GitHub connector**

Use a title such as:

```text
feat: add Codebase Intelligence v1
```

The PR body must include:

- five skills and one pack;
- CodeGraph optional-integration boundary;
- fallback and evidence-ledger contract;
- 54/11 catalog change;
- TDD RED/GREEN evidence;
- exact final verification commands;
- explicit statement that versions remain `1.0.0-rc.1`;
- explicit statement that RC2, real-use evidence, and Stable are separate tranches.

- [ ] **Step 6: Wait for canonical CI and inspect the exact run**

CI must be associated with the final PR HEAD. Confirm Linux and Windows matrix jobs, root tests, validation, web tests, typecheck, lint, build, installer smoke, and any configured security checks.

A temporary workflow run is not acceptable final evidence.

- [ ] **Step 7: Finish the branch without merging**

Invoke `superpowers:finishing-a-development-branch`. Report PR URL, final HEAD, CI run URL/id and conclusion, review status, and remaining real-use/RC2 work.

Stop and wait for explicit user authorization before merge.
