# Agent Skills Studio Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move all skills into one canonical directory, preserve local installation and project bootstrap behavior, and make the repository a validated skills-only plugin.

**Architecture:** This is phase 1 of the Agent Skills Studio program. A shared Node module discovers canonical skills under `skills/`; validators, installers, project bootstrap, and the plugin manifest all consume that module or directory. Implementation occurs on `feat/agent-skills-studio-v1` and does not merge to `main` until the catalog, microsite, and launch phases are complete.

**Tech Stack:** Node.js 22 built-ins, Bash, PowerShell, GitHub Actions, Agent Skills, Codex plugin manifests

**Spec:** `docs/superpowers/specs/2026-08-25-agent-skills-studio-design.md`

## Global Constraints

- Keep `skills/` as the only canonical skill tree; do not leave compatibility copies at repository root.
- Preserve every existing skill file byte-for-byte during the directory migration.
- Preserve `install.sh`, `install.ps1`, `setup-project.sh`, and `setup-project.ps1` as supported entry points.
- Keep the Node.js engine floor at `>=20` and run CI with Node.js 22.
- Use only Node.js built-ins in this phase; add no runtime dependency.
- Reject client data, credentials, private URLs, proprietary copy, and project-specific secrets.
- Use `1.0.0-beta.1` for the unreleased v1 branch and keep `package.json`, `VERSION`, and `.codex-plugin/plugin.json` synchronized.
- Perform implementation on `feat/agent-skills-studio-v1`; open a draft pull request against `main`.
- Every task follows RED → GREEN → refactor and ends with a focused commit.
- Never force-push or overwrite an existing project `AGENTS.md` or Prettier configuration without `--force`.

---

## File map

- Create `scripts/lib/skills.mjs` and `scripts/lib/skills.test.mjs` for canonical discovery.
- Modify `scripts/validate-skills.mjs`; create `scripts/validate-skills.test.mjs`.
- Create `scripts/install-skills.mjs` and `scripts/install-skills.test.mjs`.
- Modify `install.sh`, `install.ps1`, `scripts/bootstrap-project.mjs`, and its tests.
- Move 18 root skill directories to `skills/<skill-name>/`.
- Create `.codex-plugin/plugin.json` and `.agents/plugins/marketplace.json`.
- Create `scripts/validate-plugin.mjs` and `scripts/validate-plugin.test.mjs`.
- Modify `package.json`, `VERSION`, CI, README, changelog, and mapping documentation.

---

### Task 1: Canonical skill discovery

**Files:**
- Create: `scripts/lib/skills.mjs`
- Create: `scripts/lib/skills.test.mjs`

**Interfaces:**
- Produces: `getSkillsRoot(repoRoot: string): string`
- Produces: `listSkills(repoRoot: string): Promise<Array<{ name: string, directory: string, skillFile: string }>>`

- [ ] **Step 1: Write the failing discovery test**

Create `scripts/lib/skills.test.mjs`:

```js
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { getSkillsRoot, listSkills } from "./skills.mjs";

test("discovers only canonical skill directories in stable order", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "agent-skills-discovery-"));
  await mkdir(path.join(root, "skills", "zeta"), { recursive: true });
  await mkdir(path.join(root, "skills", "alpha"), { recursive: true });
  await mkdir(path.join(root, "unrelated"), { recursive: true });
  await writeFile(path.join(root, "skills", "zeta", "SKILL.md"), "---\nname: zeta\ndescription: Use when zeta applies.\n---\n");
  await writeFile(path.join(root, "skills", "alpha", "SKILL.md"), "---\nname: alpha\ndescription: Use when alpha applies.\n---\n");
  await writeFile(path.join(root, "unrelated", "SKILL.md"), "---\nname: unrelated\ndescription: Use when ignored.\n---\n");

  assert.equal(getSkillsRoot(root), path.join(root, "skills"));
  assert.deepEqual((await listSkills(root)).map(({ name }) => name), ["alpha", "zeta"]);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run `node --test scripts/lib/skills.test.mjs`.

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `scripts/lib/skills.mjs`.

- [ ] **Step 3: Implement canonical discovery**

Create `scripts/lib/skills.mjs`:

```js
import { access, readdir } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export function getSkillsRoot(repoRoot) {
  return path.join(path.resolve(repoRoot), "skills");
}

export async function listSkills(repoRoot) {
  const root = getSkillsRoot(repoRoot);
  const entries = await readdir(root, { withFileTypes: true });
  const skills = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const directory = path.join(root, entry.name);
    const skillFile = path.join(directory, "SKILL.md");
    if (!(await exists(skillFile))) continue;
    skills.push({ name: entry.name, directory, skillFile });
  }
  return skills.sort((left, right) => left.name.localeCompare(right.name));
}
```

- [ ] **Step 4: Verify GREEN and commit**

Run:

```bash
node --test scripts/lib/skills.test.mjs
npm test
git add scripts/lib/skills.mjs scripts/lib/skills.test.mjs
git commit -m "test: define canonical skill discovery"
```

Expected: both test commands PASS.

---

### Task 2: Migrate skills and refactor validation

**Files:**
- Move: all 18 root skill directories to `skills/`
- Modify: `scripts/validate-skills.mjs`
- Create: `scripts/validate-skills.test.mjs`

**Interfaces:**
- Consumes: `listSkills(repoRoot)` from Task 1.
- Produces: `validateSkills(repoRoot: string): Promise<{ errors: string[], skillCount: number }>`.
- Preserves: CLI exit `1` on failure and `0` on success.

- [ ] **Step 1: Write failing validator tests**

Create `scripts/validate-skills.test.mjs` with this fixture and assertions:

```js
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { validateSkills } from "./validate-skills.mjs";

async function fixture(skills) {
  const root = await mkdtemp(path.join(tmpdir(), "agent-skills-validation-"));
  for (const [directory, source] of Object.entries(skills)) {
    const target = path.join(root, "skills", directory);
    await mkdir(target, { recursive: true });
    await writeFile(path.join(target, "SKILL.md"), source);
  }
  return root;
}

test("validates skills from the canonical nested directory", async () => {
  const root = await fixture({ alpha: "---\nname: alpha\ndescription: Use when alpha applies.\n---\n" });
  assert.deepEqual(await validateSkills(root), { errors: [], skillCount: 1 });
});

test("reports trigger, duplicate-name, and private-data violations", async () => {
  const root = await fixture({
    alpha: "---\nname: shared\ndescription: Missing trigger prefix.\n---\n",
    beta: "---\nname: shared\ndescription: Use when beta applies.\n---\nghp_abcdefghijklmnopqrstuvwxyz",
  });
  const { errors, skillCount } = await validateSkills(root);
  assert.equal(skillCount, 2);
  assert.equal(errors.some((error) => error.includes("description should start")), true);
  assert.equal(errors.some((error) => error.includes("duplicate skill name")), true);
  assert.equal(errors.some((error) => error.includes("forbidden private-data pattern")), true);
});
```

- [ ] **Step 2: Run RED**

Run `node --test scripts/validate-skills.test.mjs`.

Expected: FAIL because `validateSkills` is not exported.

- [ ] **Step 3: Refactor validator around shared discovery**

Import `readFile`, `path`, `fileURLToPath`, and `listSkills`. Move the existing privacy patterns unchanged, then implement the complete validation loop:

```js
export async function validateSkills(root) {
  const skills = await listSkills(root);
  const errors = [];
  const names = new Set();

  for (const { name: directoryName, skillFile } of skills) {
    const text = await readFile(skillFile, "utf8");
    const frontmatter = text.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatter) {
      errors.push(`${directoryName}: missing YAML frontmatter`);
      continue;
    }

    const name = frontmatter[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
    const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
    if (!name) errors.push(`${directoryName}: missing name`);
    if (name && name !== directoryName) errors.push(`${directoryName}: name must match directory (${name})`);
    if (name && !/^[a-z0-9-]+$/.test(name)) errors.push(`${directoryName}: invalid skill name`);
    if (name && names.has(name)) errors.push(`${directoryName}: duplicate skill name ${name}`);
    if (name) names.add(name);
    if (!description) errors.push(`${directoryName}: missing description`);
    if (description && !description.startsWith("Use when")) errors.push(`${directoryName}: description should start with 'Use when'`);
    if (description && description.length > 500) errors.push(`${directoryName}: description exceeds 500 characters`);
    for (const pattern of forbiddenPrivatePatterns) {
      if (pattern.test(text)) errors.push(`${directoryName}: contains a forbidden private-data pattern`);
    }
  }

  if (skills.length === 0) errors.push("No skill directories found");
  return { errors, skillCount: skills.length };
}
```

The direct wrapper must use:

```js
const { errors, skillCount } = await validateSkills(repoRoot);
if (errors.length) {
  console.error(`Skill validation failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Validated ${skillCount} skills successfully.`);
}
```

- [ ] **Step 4: Move every skill with Git history**

```bash
mkdir -p skills
git mv auditing-pixel-perfect-frontend skills/
git mv bootstrapping-modern-web-apps skills/
git mv building-conversion-product-pages skills/
git mv building-hybrid-game-assets skills/
git mv building-premium-nextjs-interfaces skills/
git mv craft-premium-motion skills/
git mv creating-character-sprite-pipelines skills/
git mv designing-action-combat skills/
git mv designing-ui-systems skills/
git mv engineering-gsap-animations skills/
git mv implementing-reference-faithful-ui skills/
git mv optimizing-frontend-motion-performance skills/
git mv orchestrating-cinematic-web-motion skills/
git mv reconstructing-images-as-threejs skills/
git mv shipping-github-vercel-changes skills/
git mv testing-playable-games skills/
git mv translating-figma-to-nextjs skills/
git mv turning-techniques-into-skills skills/
```

- [ ] **Step 5: Verify GREEN and commit**

```bash
test "$(find skills -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l | tr -d ' ')" = "18"
test -z "$(find . -mindepth 2 -maxdepth 2 -name SKILL.md -not -path './skills/*')"
node --test scripts/validate-skills.test.mjs
npm run validate
git add skills scripts/validate-skills.mjs scripts/validate-skills.test.mjs
git commit -m "refactor: establish canonical skills directory"
```

Expected: 18 canonical skills, no root copies, tests PASS.

---

### Task 3: Shared cross-platform installer

**Files:**
- Create: `scripts/install-skills.mjs`
- Create: `scripts/install-skills.test.mjs`
- Modify: `install.sh`, `install.ps1`
- Modify: `scripts/bootstrap-project.mjs`, `scripts/bootstrap-project.test.mjs`

**Interfaces:**
- Produces: `installSkills({ repoRoot, destination, names? }): Promise<string[]>`.
- Consumes: `listSkills(repoRoot)`.
- Preserves: default destination `~/.agents/skills` and `skillsInstalled: number`.

- [ ] **Step 1: Write failing installer tests**

Create `scripts/install-skills.test.mjs`:

```js
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { installSkills } from "./install-skills.mjs";

async function repositoryFixture() {
  const root = await mkdtemp(path.join(tmpdir(), "agent-skills-install-source-"));
  for (const name of ["alpha", "beta"]) {
    const directory = path.join(root, "skills", name);
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, "SKILL.md"), `---\nname: ${name}\ndescription: Use when ${name} applies.\n---\n`);
  }
  return root;
}

test("installs all skills and removes stale contents", async () => {
  const repoRoot = await repositoryFixture();
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-install-target-"));
  await mkdir(path.join(destination, "alpha"), { recursive: true });
  await writeFile(path.join(destination, "alpha", "stale.txt"), "remove me");

  assert.deepEqual(await installSkills({ repoRoot, destination }), ["alpha", "beta"]);
  await assert.rejects(readFile(path.join(destination, "alpha", "stale.txt")), { code: "ENOENT" });
  assert.match(await readFile(path.join(destination, "alpha", "SKILL.md"), "utf8"), /name: alpha/);
});

test("installs a selection and rejects unknown skills before copying", async () => {
  const repoRoot = await repositoryFixture();
  const destination = await mkdtemp(path.join(tmpdir(), "agent-skills-install-selection-"));
  assert.deepEqual(await installSkills({ repoRoot, destination, names: ["beta"] }), ["beta"]);
  await assert.rejects(installSkills({ repoRoot, destination, names: ["missing"] }), /Unknown skill: missing/);
});
```

- [ ] **Step 2: Run RED**

Run `node --test scripts/install-skills.test.mjs`.

Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement the installer**

Create `scripts/install-skills.mjs` using `listSkills`, `mkdir`, `rm`, and `cp`. Resolve the destination and reject a filesystem root. Validate every requested name before mutating the destination. Remove and replace only the explicit target skill directory.

Core implementation:

```js
export async function installSkills({ repoRoot, destination, names }) {
  const available = await listSkills(repoRoot);
  const byName = new Map(available.map((skill) => [skill.name, skill]));
  const selected = names?.length ? [...new Set(names)].sort() : available.map((skill) => skill.name);
  for (const name of selected) {
    if (!byName.has(name)) throw new Error(`Unknown skill: ${name}`);
  }
  const targetRoot = path.resolve(destination);
  if (targetRoot === path.parse(targetRoot).root) throw new Error("Refusing to install into a filesystem root.");
  await mkdir(targetRoot, { recursive: true });
  for (const name of selected) {
    const target = path.join(targetRoot, name);
    await rm(target, { recursive: true, force: true });
    await cp(byName.get(name).directory, target, { recursive: true });
  }
  return selected;
}
```

The CLI accepts `--destination <path>` and repeated `--skill <name>`. Default to `path.join(homedir(), ".agents", "skills")`.

- [ ] **Step 4: Replace Bash and PowerShell copy logic**

`install.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec node "$REPO_ROOT/scripts/install-skills.mjs" "$@"
```

`install.ps1`:

```powershell
$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
node (Join-Path $RepoRoot "scripts/install-skills.mjs") @args
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
```

- [ ] **Step 5: Reuse installer from project bootstrap**

Import `installSkills` into `scripts/bootstrap-project.mjs`, remove its private copy routine, and call:

```js
const installed = await installSkills({
  repoRoot,
  destination: options.skillsDestination ?? path.join(homedir(), ".agents", "skills"),
});
result.skillsInstalled = installed.length;
```

Append a bootstrap test that uses a temporary `skillsDestination`, expects `skillsInstalled === 18`, and reads `craft-premium-motion/SKILL.md` from the destination.

- [ ] **Step 6: Verify GREEN and commit**

```bash
node --test scripts/install-skills.test.mjs scripts/bootstrap-project.test.mjs
target="$(mktemp -d)"
./install.sh --destination "$target"
test -f "$target/engineering-gsap-animations/SKILL.md"
npm test
git add scripts/install-skills.mjs scripts/install-skills.test.mjs install.sh install.ps1 scripts/bootstrap-project.mjs scripts/bootstrap-project.test.mjs
git commit -m "feat: preserve cross-platform skill installation"
```

Expected: all tests PASS and 18 skills install.

---

### Task 4: Skills-only plugin and marketplace

**Files:**
- Create: `.codex-plugin/plugin.json`
- Create: `.agents/plugins/marketplace.json`
- Create: `scripts/validate-plugin.mjs`, `scripts/validate-plugin.test.mjs`
- Modify: `package.json`, `VERSION`

**Interfaces:**
- Produces: plugin identifier `agent-skills-studio`.
- Produces: `validatePlugin(repoRoot: string): Promise<string[]>`.
- Consumes: `skills/`, `package.json.version`, and `VERSION`.

- [ ] **Step 1: Write failing plugin tests**

Create `scripts/validate-plugin.test.mjs`:

```js
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { validatePlugin } from "./validate-plugin.mjs";

const repositoryRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

test("accepts the repository plugin and synchronized version", async () => {
  assert.deepEqual(await validatePlugin(repositoryRoot), []);
});

test("rejects a skills path outside the plugin root", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "agent-skills-plugin-"));
  await mkdir(path.join(root, ".codex-plugin"), { recursive: true });
  await mkdir(path.join(root, ".agents", "plugins"), { recursive: true });
  await writeFile(path.join(root, "VERSION"), "1.0.0-beta.1\n");
  await writeFile(path.join(root, "package.json"), JSON.stringify({ version: "1.0.0-beta.1" }));
  await writeFile(path.join(root, ".codex-plugin", "plugin.json"), JSON.stringify({
    name: "agent-skills-studio",
    version: "1.0.0-beta.1",
    description: "Skills",
    skills: "../outside",
  }));
  await writeFile(path.join(root, ".agents", "plugins", "marketplace.json"), JSON.stringify({
    name: "agent-skills-studio",
    plugins: [{
      name: "agent-skills-studio",
      source: { source: "local", path: "./" },
      policy: { installation: "AVAILABLE", authentication: "NOT_REQUIRED" },
    }],
  }));

  assert.equal(
    (await validatePlugin(root)).some((error) => error.includes("skills must resolve inside the plugin root")),
    true,
  );
});
```

Run `node --test scripts/validate-plugin.test.mjs`.

Expected: FAIL with `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 2: Add the plugin manifest**

Create `.codex-plugin/plugin.json`:

```json
{
  "name": "agent-skills-studio",
  "version": "1.0.0-beta.1",
  "description": "Production-ready workflows for ChatGPT and Codex.",
  "author": { "name": "Jhonatan Oliveira", "url": "https://jhonatanoliveira.com" },
  "homepage": "https://skills.jhonatanoliveira.com",
  "repository": "https://github.com/jhonatan-oliveiradev/agent-skills",
  "license": "MIT",
  "keywords": ["agent-skills", "frontend", "motion", "engineering", "game-development"],
  "skills": "./skills/",
  "interface": {
    "displayName": "Agent Skills Studio",
    "shortDescription": "Production-ready workflows for ChatGPT and Codex",
    "developerName": "Jhonatan Oliveira",
    "category": "Developer Tools",
    "websiteURL": "https://skills.jhonatanoliveira.com",
    "brandColor": "#6D5EF5"
  }
}
```

- [ ] **Step 3: Add the repository marketplace**

Create `.agents/plugins/marketplace.json`:

```json
{
  "name": "agent-skills-studio",
  "interface": { "displayName": "Agent Skills Studio" },
  "plugins": [
    {
      "name": "agent-skills-studio",
      "source": { "source": "local", "path": "./" },
      "policy": { "installation": "AVAILABLE", "authentication": "NOT_REQUIRED" },
      "category": "Developer Tools"
    }
  ]
}
```

- [ ] **Step 4: Implement plugin validation**

Create `scripts/validate-plugin.mjs`. Use a `readJson` helper that catches parsing failures and appends `<path>: invalid JSON`. Export `validatePlugin(repoRoot)` and implement these exact comparisons after loading the three JSON/text files:

```js
const expectedName = "agent-skills-studio";
if (plugin.name !== expectedName) errors.push(`plugin name must be ${expectedName}`);
if (marketplace.name !== expectedName) errors.push(`marketplace name must be ${expectedName}`);
if (plugin.version !== packageJson.version || plugin.version !== versionText.trim()) {
  errors.push("plugin, package, and VERSION values must match");
}
if (typeof plugin.skills !== "string" || !plugin.skills.startsWith("./")) {
  errors.push("plugin skills path must start with ./");
}

const resolvedRoot = path.resolve(repoRoot);
const resolvedSkills = path.resolve(resolvedRoot, plugin.skills ?? "");
const insideRoot = resolvedSkills === resolvedRoot || resolvedSkills.startsWith(`${resolvedRoot}${path.sep}`);
if (!insideRoot) errors.push("skills must resolve inside the plugin root");
if (insideRoot && !(await exists(resolvedSkills))) errors.push("plugin skills directory does not exist");

const entries = Array.isArray(marketplace.plugins) ? marketplace.plugins : [];
const matching = entries.filter((entry) => entry.name === expectedName);
if (matching.length !== 1) errors.push("marketplace must contain exactly one matching plugin");
const entry = matching[0];
if (entry?.source?.source !== "local" || entry?.source?.path !== "./") {
  errors.push("marketplace plugin must resolve to the repository root");
}
if (entry?.policy?.authentication !== "NOT_REQUIRED") {
  errors.push("skills-only plugin must not require authentication");
}

return errors;
```

The CLI prints `Plugin validation passed.` or one error per line and exits `1` on failure.

- [ ] **Step 5: Synchronize versions and scripts**

Set `package.json.version`, `VERSION`, and the plugin version to `1.0.0-beta.1`. Preserve existing scripts and set:

```json
{
  "validate": "node scripts/validate-skills.mjs && node scripts/validate-plugin.mjs",
  "validate:skills": "node scripts/validate-skills.mjs",
  "validate:plugin": "node scripts/validate-plugin.mjs"
}
```

- [ ] **Step 6: Verify GREEN and commit**

```bash
node --test scripts/validate-plugin.test.mjs
npm test
npm run validate
git add .codex-plugin/plugin.json .agents/plugins/marketplace.json scripts/validate-plugin.mjs scripts/validate-plugin.test.mjs package.json VERSION
git commit -m "feat: package skills as Agent Skills Studio"
```

Expected: all tests and validators PASS.

---

### Task 5: Cross-platform CI and phase documentation

**Files:**
- Modify: `.github/workflows/validate.yml`
- Modify: `README.md`, `CHANGELOG.md`, `MAPPING.md`

**Interfaces:**
- Consumes: `npm test`, `npm run validate`, `install.sh`, and `install.ps1`.
- Produces: green Linux and Windows jobs and an open draft PR.

- [ ] **Step 1: Prove the CI matrix is absent**

```bash
node -e 'const s=require("fs").readFileSync(".github/workflows/validate.yml","utf8"); if(s.includes("matrix.os")) process.exit(1)'
```

Expected: exit `0`.

- [ ] **Step 2: Add Linux and Windows validation**

Use this job contract:

```yaml
jobs:
  validate:
    strategy:
      fail-fast: false
      matrix:
        os: [ubuntu-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm test
      - run: npm run validate
      - name: Smoke test Bash installer
        if: runner.os == 'Linux'
        shell: bash
        run: |
          target="$(mktemp -d)"
          ./install.sh --destination "$target"
          test -f "$target/craft-premium-motion/SKILL.md"
      - name: Smoke test PowerShell installer
        if: runner.os == 'Windows'
        shell: pwsh
        run: |
          $target = Join-Path $env:RUNNER_TEMP "agent-skills-install"
          ./install.ps1 --destination $target
          if (-not (Test-Path (Join-Path $target "craft-premium-motion/SKILL.md"))) { exit 1 }
```

Retain pull-request and `main`/`dev` push triggers.

- [ ] **Step 3: Update user-facing documentation**

Update `README.md` with canonical `skills/` paths, full installation, `--skill <name>`, plugin identifier, local marketplace testing, the v1 beta branch, and links to the approved spec and plan. Preserve bootstrap and privacy guidance.

Add an unreleased `1.0.0-beta.1` entry to `CHANGELOG.md` covering migration, shared installer, plugin, marketplace, and cross-platform CI. Update only explicit obsolete filesystem paths in `MAPPING.md`; preserve upstream decisions.

- [ ] **Step 4: Run the local phase gate**

```bash
npm test
npm run validate
target="$(mktemp -d)"
./install.sh --destination "$target"
test "$(find "$target" -mindepth 2 -maxdepth 2 -name SKILL.md | wc -l | tr -d ' ')" = "18"
git diff --check
git status --short
```

Expected: all tests and validators PASS, 18 skills install, no whitespace errors, and only intended files changed.

- [ ] **Step 5: Commit and open the draft PR**

```bash
git add .github/workflows/validate.yml README.md CHANGELOG.md MAPPING.md
git commit -m "ci: verify Agent Skills Studio foundation"
git push -u origin feat/agent-skills-studio-v1
```

Open a draft PR titled `feat: build Agent Skills Studio v1`. Link the design spec, this plan, and the Linux/Windows checks. Do not merge in this phase.

- [ ] **Step 6: Verify the remote phase gate**

Confirm both matrix jobs are green and inspect the PR for exactly 18 canonical skills, no root copies, synchronized beta versions, plugin path `./skills/`, and working installers.

Expected: the draft PR remains open with all required checks green.

---

## Follow-on implementation plans

The approved design is split into independently reviewable phases:

1. Foundation and plugin — this plan.
2. Catalog and thematic packs — schemas, bilingual metadata, pack manifests, generators, and validation.
3. Microsite — Next.js, bilingual routes, catalog UX, installation assistant, proof experiences, tests, and Vercel Preview.
4. Community launch — governance, branch protection, release automation, production domain, roadmap, launch content, and `v1.0.0`.

Each follow-on phase receives its own implementation plan before its code changes begin.
