# Orphaned Home Copy Cleanup Design

## Context

Agent Skills Studio `v1.0.0` now renders the editorial Home from `homeManifesto` and `homeEvidenceContent`. The localized `messages` contract still contains three Home groups from the superseded layout — `home.paths`, `home.packs`, and `home.proof` — even though the current Home consumes only `home.roadmap` from that namespace.

The Getting Started page also keeps `gettingStarted.install.demoSuccess` with a frozen `49 skills` snapshot. The rendered terminal no longer uses that field: it derives the current success count from `catalog.skills.length` and localized field-manual copy.

These orphaned records are not a current user-visible bug, but they are stale internal state that can mislead future maintenance and reintroduce obsolete counts.

## Evidence boundary

Repository inspection on Stable `main` shows:

- `apps/web/src/app/[locale]/page.tsx` consumes `copy.home.roadmap` and no other `copy.home.*` group.
- code search finds no consumers for `home.paths`, `home.packs`, or `home.proof`.
- `apps/web/src/app/[locale]/getting-started/page.tsx` renders terminal success from `catalog.skills.length` and does not consume `copy.install.demoSuccess`.
- code search finds no consumer for `copy.install.demoSuccess`.

## Goal

Remove only the confirmed orphaned localized message records so the message contract reflects the active UI and cannot retain obsolete fixed-count snapshots.

## Design

1. Keep `messages.home.roadmap` unchanged because the current Home closing section consumes it.
2. Remove `home.paths`, `home.packs`, and `home.proof` from the `Messages` interface and both locale objects.
3. Remove `gettingStarted.install.demoSuccess` from the `Messages` interface and both locale objects.
4. Preserve all remaining localized strings byte-for-byte.
5. Add a localized contract regression test that proves Home exposes only `roadmap` and install copy no longer exposes `demoSuccess`.

## Non-goals

- no visual or layout changes
- no changes to Home manifesto/evidence modules
- no changes to catalog-derived counts
- no removal of other potentially orphaned groups such as top-level `hero` or `process`
- no version, release, catalog, skill, pack, installer, or workflow changes

## Verification contract

- RED must fail only because the legacy message keys still exist.
- GREEN must preserve all existing Home and Getting Started behavior tests.
- canonical root tests, repository validation, web tests, typecheck, lint, build, Bash smoke, and PowerShell smoke must pass on Ubuntu and Windows before review readiness.
