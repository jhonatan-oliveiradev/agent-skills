# Post-Stable Evidence Coverage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Derive active-pack real-use coverage from Built with Skills plus catalog membership and expose the current coverage alongside Stable-skill maturity on the public roadmap.

**Architecture:** Add one narrow server-only domain helper that joins existing case evidence with catalog skill→pack membership. Keep Built with Skills and the catalog as the only sources of truth, then consume the derived counts in the existing roadmap item. A focused parity test also reconciles the derived count with the historical Stable readiness record.

**Tech Stack:** TypeScript, Next.js 16, Vitest, Node fs/promises, existing catalog and Built with Skills domain APIs.

**Spec:** `docs/superpowers/specs/2026-09-03-post-stable-evidence-coverage-design.md`

## Global Constraints

- `VERSION` remains exactly `1.0.0`.
- Catalog remains exactly 54 canonical skills and 11 active packs.
- No skill maturity promotion in this tranche.
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

**Interfaces:**
- Consumes: `getCatalog()`, `getBuiltWithSkillsCases("en")`, `hasInspectableRealUseEvidence()`.
- Produces: `getRealUsePackCoverage(): RealUsePackCoverage`.

- [ ] **Step 1: Write the failing coverage test**

Create `apps/web/src/lib/real-use-pack-coverage.test.ts` with a mocked `server-only` module and assertions for the wished-for API:

```ts
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { getRealUsePackCoverage } from "./real-use-pack-coverage";

const repositoryRoot = resolve(process.cwd(), "../..");

describe("real-use pack coverage", () => {
  it("derives current active-pack coverage from inspectable real-use cases", () => {
    expect(getRealUsePackCoverage()).toEqual({
      coveredPackSlugs: [
        "application-security",
        "codebase-intelligence",
        "frontend-product",
        "quality-testing",
        "writing-communication",
      ],
      uncoveredPackSlugs: [
        "architecture-engineering",
        "backend-data",
        "design-brand",
        "engineering-workflow",
        "game-development",
        "motion",
      ],
      coveredCount: 5,
      totalActivePacks: 11,
    });
  });

  it("keeps the Stable readiness observed pack count aligned with derived evidence", async () => {
    const readiness = JSON.parse(
      await readFile(resolve(repositoryRoot, "release/stable-readiness.json"), "utf8"),
    );

    expect(readiness.observed.activePacksRepresented).toBe(
      getRealUsePackCoverage().coveredCount,
    );
  });
});
```

- [ ] **Step 2: Verify RED**

Run the canonical PR CI with the test-only commit. Expected: root tests/validation remain green; `web:test` fails because `./real-use-pack-coverage` does not exist.

- [ ] **Step 3: Implement the minimal helper**

Create `apps/web/src/lib/real-use-pack-coverage.ts`:

```ts
import "server-only";

import { getBuiltWithSkillsCases, hasInspectableRealUseEvidence } from "./built-with-skills";
import { getCatalog } from "./catalog";

export interface RealUsePackCoverage {
  readonly coveredPackSlugs: readonly string[];
  readonly uncoveredPackSlugs: readonly string[];
  readonly coveredCount: number;
  readonly totalActivePacks: number;
}

export function getRealUsePackCoverage(): RealUsePackCoverage {
  const catalog = getCatalog();
  const activePacks = catalog.packs
    .filter((pack) => pack.status === "active")
    .map((pack) => pack.slug);
  const activePackSet = new Set(activePacks);
  const skillPacks = new Map(
    catalog.skills.map((skill) => [
      skill.slug,
      skill.packs.filter((packSlug) => activePackSet.has(packSlug)),
    ]),
  );
  const covered = new Set<string>();

  for (const item of getBuiltWithSkillsCases("en")) {
    if (item.evidenceClass !== "real-use" || !hasInspectableRealUseEvidence(item)) continue;

    for (const skillSlug of item.skills) {
      for (const packSlug of skillPacks.get(skillSlug) ?? []) covered.add(packSlug);
    }
  }

  const coveredPackSlugs = activePacks.filter((packSlug) => covered.has(packSlug));
  const uncoveredPackSlugs = activePacks.filter((packSlug) => !covered.has(packSlug));

  return {
    coveredPackSlugs,
    uncoveredPackSlugs,
    coveredCount: coveredPackSlugs.length,
    totalActivePacks: activePacks.length,
  };
}
```

- [ ] **Step 4: Verify focused GREEN through CI**

Expected: the new coverage tests pass and no existing web test regresses.

- [ ] **Step 5: Commit**

Commit message: `feat: derive real-use pack coverage`.

---

### Task 2: Surface derived evidence on the roadmap

**Files:**
- Modify: `apps/web/src/lib/messages.ts`
- Modify: `apps/web/src/lib/roadmap.ts`
- Modify: `apps/web/src/lib/roadmap.test.ts`

**Interfaces:**
- Consumes: `getRealUsePackCoverage()` from Task 1.
- Produces: localized `stable-skills` summary/meta with derived Stable-skill and pack-evidence counts.

- [ ] **Step 1: Write failing roadmap assertions**

Extend the existing bilingual roadmap test so the `stable-skills` item must contain the current derived pack coverage in addition to the existing stable-skill count:

```ts
expect(stableSkills?.meta).toContain("18");
expect(stableSkills?.meta).toContain("5/11");
expect(stableSkills?.summary).toContain("18");
expect(stableSkills?.summary).toContain("5");
expect(stableSkills?.summary).toContain("11");
```

The current code should fail only the new pack-coverage assertions.

- [ ] **Step 2: Verify RED**

Run PR CI on the test-only roadmap commit. Expected: focused roadmap assertions fail while Task 1 coverage tests remain green.

- [ ] **Step 3: Add placeholder-based localized copy**

In `messages.ts`, preserve the existing Stable-skill language and change only the two localized `stableItem.summary` / `itemMeta.stableSkills` values to the spec-defined placeholder contracts:

English:

```ts
stableItem: {
  title: "Skills marked Stable",
  summary: "{count} canonical skills are currently marked stable in the catalog. The complete 1.0.0 collection remains available through supported installation paths. Real-use evidence currently represents {covered} of {total} active packs.",
},
itemMeta: {
  plannedPack: "Planned pack",
  stableSkills: "{count} stable skills · {covered}/{total} packs with real-use evidence",
},
```

PT-BR:

```ts
stableItem: {
  title: "Skills marcadas como Stable",
  summary: "{count} skills canônicas estão atualmente marcadas como Stable no catálogo. A coleção 1.0.0 completa continua disponível pelos caminhos de instalação suportados. Evidências de uso real representam atualmente {covered} de {total} pacotes ativos.",
},
itemMeta: {
  plannedPack: "Pacote planejado",
  stableSkills: "{count} skills Stable · {covered}/{total} pacotes com evidência de uso real",
},
```

Do not hardcode the current counts in messages.

- [ ] **Step 4: Consume coverage in `getRoadmapStages()`**

Import `getRealUsePackCoverage`, derive it once, and replace `{count}`, `{covered}`, and `{total}` in the Stable item summary/meta. Keep all stage IDs, item ordering, links, and the first four Stable surface metas unchanged.

- [ ] **Step 5: Verify GREEN**

Run the focused web suite through canonical PR CI. Expected: coverage and roadmap tests pass in EN/PT-BR.

- [ ] **Step 6: Commit**

Commit message: `feat(web): expose real-use pack coverage`.

---

### Task 3: Full verification and review readiness

**Files:**
- No production changes unless a discovered regression has a proven, focused cause.
- Update the PR description with RED→GREEN evidence and diff audit.

**Interfaces:**
- Consumes: Tasks 1-2.
- Produces: a reviewable, unmerged PR.

- [ ] **Step 1: Verify release/catalog invariants**

Confirm from the final diff and repository state:

```text
VERSION = 1.0.0
skills = 54
active packs = 11
planned packs = 0
skill maturity = 18 stable / 36 beta
```

- [ ] **Step 2: Run canonical CI on the final HEAD**

Required on Ubuntu and Windows:

```text
root tests
repository validation
web tests
web typecheck
web lint
production build
platform installer smoke
```

All required steps must be SUCCESS.

- [ ] **Step 3: Audit the final diff**

Expected scope:

```text
docs/superpowers/specs/2026-09-03-post-stable-evidence-coverage-design.md
docs/superpowers/plans/2026-09-03-post-stable-evidence-coverage.md
apps/web/src/lib/real-use-pack-coverage.ts
apps/web/src/lib/real-use-pack-coverage.test.ts
apps/web/src/lib/messages.ts
apps/web/src/lib/roadmap.ts
apps/web/src/lib/roadmap.test.ts
```

No other file should remain changed unless a directly caused test compatibility fix is separately justified.

- [ ] **Step 4: Perform spec and quality review**

Verify:
- internal cases do not contribute coverage;
- only inspectable `real-use` cases contribute;
- membership comes from catalog facts, not duplicated pack lists;
- covered/uncovered arrays are deterministic in catalog pack order;
- historical Stable readiness is reconciled but not rewritten;
- public copy distinguishes release Stable from individual skill maturity;
- no future pack is claimed validated.

- [ ] **Step 5: Update PR and mark Ready only if clean**

PR title: `feat: expose post-Stable evidence coverage`

The PR body must contain the RED runs, final canonical GREEN run, exact 5/11 current coverage, 18/36 maturity split, diff audit, and the explicit merge prohibition.

Stop before merge.