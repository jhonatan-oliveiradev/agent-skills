# Agent Skills Studio — Release Readiness / RC2 Design

**Status:** Approved direction from the post-Codebase-Intelligence roadmap

**Date:** 2026-09-02

**Repository:** `jhonatan-oliveiradev/agent-skills`

**Baseline:** `1.0.0-rc.1` on `main` after merge of PR #54

## 1. Purpose

Promote the Studio-level release candidate from `1.0.0-rc.1` to `1.0.0-rc.2` after Codebase Intelligence v1 has been merged and verified.

RC2 is a release tranche, not a product-expansion tranche. The canonical collection remains exactly **54 skills / 11 active packs**. Codebase Intelligence v1 and its official optional CodeGraph integration are already part of the merged product and must not be reimplemented here.

The release flow remains:

```text
1.0.0-rc.1
→ Codebase Intelligence v1 + optional CodeGraph integration
→ 1.0.0-rc.2
→ real-use / CI evidence for Codebase Intelligence
→ Stable 1.0.0
```

Stable promotion remains frozen during RC2 preparation.

## 2. Release ownership

The Studio-level candidate version is owned by exactly five synchronized source surfaces:

1. `VERSION`
2. root `package.json`
3. `.codex-plugin/plugin.json`
4. `catalog/catalog.json`
5. `apps/web/package.json`

The existing release-readiness test already establishes these as one synchronization boundary. RC2 changes all five together from `1.0.0-rc.1` to `1.0.0-rc.2`.

Per-skill and per-pack versions are independent contract versions. They must **not** be mass-bumped solely because the Studio release candidate changes.

Historical specs, plans, real-use records, RC1 readiness data, and the published `v1.0.0-rc.1` release remain historical evidence and must not be rewritten to say RC2.

## 3. Current release surfaces

The current release copy must represent the merged collection rather than the old RC1 inventory.

RC2 current-state copy must state:

- 54 canonical skills;
- 11 active packs;
- Codebase Intelligence v1 is included;
- CodeGraph is an official optional integration, never a required runtime;
- the five Codebase Intelligence methods work through a verified repository-inspection fallback when no code-intelligence runtime is callable;
- Stable remains pending real-use/CI evidence for the new pack.

Current public release history is owned by:

- `CHANGELOG.md`;
- `apps/web/src/lib/project-pages.ts` in both EN and PT-BR.

The existing RC1 entry remains below the new RC2 entry.

## 4. Stable-readiness reset after collection expansion

The existing `release/stable-readiness.json` correctly records that RC1 satisfied its previously defined real-use thresholds across three projects and four represented packs. That evidence remains valid historical evidence and must not be discarded.

However, PR #54 expanded the candidate from 49/10 to 54/11 by adding a new active pack. The roadmap explicitly requires real-use / CI evidence for Codebase Intelligence after RC2 before Stable promotion. Therefore a `ready-for-stable-review` status on the new candidate would be misleading even though the older aggregate thresholds remain satisfied.

RC2 advances the manifest to schema version 3 and preserves the existing evidence while adding the new explicit gate:

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

Existing `minimums`, `observed`, and public-surface evidence remain unchanged in this tranche. Surface-level evidence such as catalog/installers/microsite validation is not erased merely because a new domain-level real-use gate exists.

The next real-use tranche may add `codebase-intelligence` to `validatedRealUsePacks` only from inspectable real project evidence. Self-hosted internal Studio evidence does not satisfy this gate by itself.

## 5. Generated projections

`catalog/generated/catalog.json` and `apps/web/src/generated/catalog.json` are generated projections, not primary release owners.

They must be regenerated/synchronized from the updated source manifests through the repository's official generation/sync paths. They must not be treated as independent version authorities.

## 6. TDD contract

The release promotion follows RED → GREEN.

RED must be established before changing release metadata:

- root release-readiness tests require `1.0.0-rc.2` across all five owners;
- root release-readiness tests require Stable status `collecting-rc2-evidence`, candidate `1.0.0-rc.2`, `requiredRealUsePacks: ["codebase-intelligence"]`, and no validated Codebase Intelligence real-use evidence yet;
- web project-page tests require the current release record to be `1.0.0-rc.2`, expose 54/11, and mention Codebase Intelligence in both locales.

The RED commit must fail only because production/current-release metadata still represents RC1.

GREEN then performs the minimum source updates and regenerates projections.

## 7. CI and verification

The canonical `.github/workflows/validate.yml` already runs on pull requests and is the authority for final verification. No temporary workflow is required for the standard gates.

Final RC2 HEAD must pass on both Ubuntu and Windows:

- root tests;
- skill/catalog validation;
- generated-catalog drift check;
- plugin validation;
- web Vitest;
- web TypeScript typecheck;
- web ESLint with zero warnings;
- Next.js production build;
- Bash installer smoke;
- PowerShell installer smoke.

Final verification must also confirm:

- catalog remains 54 skills / 11 active packs;
- no canonical skill/pack/category is added or removed;
- no mass version bump of individual skills/packs;
- no historical evidence is rewritten;
- no Stable `1.0.0` promotion occurs;
- no GitHub `v1.0.0-rc.2` tag/release is published before the RC2 PR is explicitly approved and merged.

## 8. Delivery boundary

This tranche ends with a reviewable PR to `main` titled approximately:

```text
release: prepare 1.0.0-rc.2
```

The PR must remain unmerged until explicit user authorization.

Publishing the GitHub pre-release/tag is a post-merge action and is outside the pre-merge implementation branch.

The immediate tranche after RC2 is real-use / CI validation of the Codebase Intelligence pack in a real project, followed by a separate Stable-readiness decision.
