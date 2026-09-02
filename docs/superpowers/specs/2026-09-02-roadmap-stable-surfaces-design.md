# Post-Stable Roadmap Truthfulness Design

## Context

Agent Skills Studio `v1.0.0` is published as Stable. The canonical `release/stable-readiness.json` records the four public release surfaces — ChatGPT distribution, catalog, installers, and microsite — with `stableReady: true`. The public roadmap still renders equivalent entries under Beta, creating a user-visible contradiction after the Stable release.

## Goal

Make the public roadmap reflect the already-qualified Stable state without changing release criteria, product behavior, catalog contents, or version metadata.

## Evidence boundary

The promotion is descriptive, not a new readiness decision. It relies on the existing Stable readiness record:

- `chatgpt-distribution`: `stableReady: true`
- `catalog`: `stableReady: true`
- `installers`: `stableReady: true`
- `microsite`: `stableReady: true`
- release status: `stable`
- candidate/target version: `1.0.0`

## Design

1. Preserve all seven roadmap stages and their order.
2. Rename localized `betaItems` to `stableSurfaceItems` so the data model no longer encodes obsolete maturity.
3. Keep the Beta stage present but empty.
4. Render the four qualified release surfaces in Stable, followed by the existing Stable skill-collection record.
5. Give each release-surface record `1.0.0` metadata from `catalog.version`; keep the skill-collection metadata derived from the stable-skill count.
6. Preserve current localized titles and summaries; only maturity placement changes.

Expected stage counts after the change:

`[0, 0, 0, 0, 0, 5, 0]`

for Proposal, Research, Development, Experimental, Beta, Stable, Deprecated.

## Non-goals

- no version bump
- no changes to `release/stable-readiness.json`
- no changes to canonical skills or pack metadata
- no catalog regeneration
- no styling or layout changes
- no release/tag changes

## Verification contract

- `apps/web/src/lib/roadmap.test.ts` must prove Beta is empty and Stable contains the four surface IDs plus the stable skill collection in deterministic order.
- `apps/web/src/components/roadmap-living-program.test.tsx` must prove the rendered seven-stage program now has six empty stages and still exposes related links from the Stable skill record.
- Canonical root validation, web tests, typecheck, lint, build, Bash smoke, and PowerShell smoke must pass on Ubuntu and Windows before the PR is considered ready.
