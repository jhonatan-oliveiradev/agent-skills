# Post-Stable Evidence Coverage Design

## Goal

Make real-use pack coverage a derived, inspectable property of Agent Skills Studio instead of a manually maintained claim, then expose that coverage alongside the existing Stable-skill count in the public roadmap.

## Current verified state

At Stable `1.0.0` the generated catalog contains:

- 54 canonical skills;
- 18 skills with maturity `stable`;
- 36 skills with maturity `beta`;
- 11 active packs;
- 0 planned packs.

Built with Skills currently contains four `real-use` cases. Their catalog-backed union represents exactly five active packs:

1. `application-security`
2. `codebase-intelligence`
3. `frontend-product`
4. `quality-testing`
5. `writing-communication`

The six active packs not yet represented by real-use evidence are:

1. `architecture-engineering`
2. `backend-data`
3. `design-brand`
4. `engineering-workflow`
5. `game-development`
6. `motion`

`release/stable-readiness.json` currently records `observed.activePacksRepresented: 5`. That number is historically correct, but no current application contract derives it from Built with Skills plus catalog membership.

## Scope

### 1. Derived evidence coverage domain

Add one server-side library that derives active-pack coverage from existing sources of truth:

- canonical pack and skill membership from `getCatalog()`;
- localized case records from `getBuiltWithSkillsCases("en")`;
- `evidenceClass === "real-use"`;
- `hasInspectableRealUseEvidence(case) === true`.

The library returns deterministic catalog-order arrays and counts:

```ts
export interface RealUsePackCoverage {
  readonly coveredPackSlugs: readonly string[];
  readonly uncoveredPackSlugs: readonly string[];
  readonly coveredCount: number;
  readonly totalActivePacks: number;
}

export function getRealUsePackCoverage(): RealUsePackCoverage;
```

A case contributes a pack only when at least one of its listed skills belongs to that active pack in the current catalog. Internal cases never contribute coverage.

### 2. Release-evidence parity guard

The focused coverage test must read `release/stable-readiness.json` and require its historical `observed.activePacksRepresented` value to equal the currently derived coverage count. This prevents future real-use case additions from silently drifting away from the release evidence record.

This tranche does not change `release/stable-readiness.json` because the current value already matches the derived truth.

### 3. Public roadmap evidence

Keep the existing `stable-skills` roadmap item and its current meaning. Extend only its localized summary/meta so readers can see both dimensions:

- individual skill maturity: 18 Stable skills;
- real-use pack coverage: 5 of 11 active packs.

English copy contract:

- summary preserves the current Stable-skill statement and adds: `Real-use evidence currently represents {covered} of {total} active packs.`
- meta: `{count} stable skills · {covered}/{total} packs with real-use evidence`

PT-BR copy contract:

- summary preserves the current Stable-skill statement and adds: `Evidências de uso real representam atualmente {covered} de {total} pacotes ativos.`
- meta: `{count} skills Stable · {covered}/{total} pacotes com evidência de uso real`

All numeric placeholders are derived at runtime from catalog/evidence state; no literal `18`, `5`, or `11` is added to localized messages.

## Non-goals

- Do not promote any skill from Beta to Stable.
- Do not mark `engineering-workflow` or any other uncovered pack as validated without a new external real-use case.
- Do not change `VERSION`, tags, GitHub Releases, release status, or Stable qualification history.
- Do not add or remove skills or packs.
- Do not alter installers, plugin metadata, catalog manifests, generated catalog sources, workflows, or deployment configuration.
- Do not create a new release-readiness system or duplicate Built with Skills case data.
- Do not redesign the roadmap or change its seven-stage structure.

## Verification contract

### RED

Before implementation, focused tests must fail because `getRealUsePackCoverage()` does not exist and the roadmap does not expose pack-coverage values.

### GREEN

The final candidate must prove:

- exact covered pack slugs are the five verified current packs;
- exact uncovered pack slugs are the remaining six active packs;
- counts are `5 / 11` from derived data;
- `release/stable-readiness.json` observed coverage equals the derived count;
- EN and PT-BR roadmap summaries/meta include derived `18`, `5`, and `11` values while preserving the distinction between Stable release status and individual skill maturity;
- all canonical root/web gates pass on Ubuntu and Windows.

## Merge policy

Do not merge without explicit user authorization.