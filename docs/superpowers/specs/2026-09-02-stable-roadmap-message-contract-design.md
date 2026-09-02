# Stable Roadmap Message Contract Cleanup Design

## Context

Agent Skills Studio `v1.0.0` now renders the four qualified release surfaces under the Stable roadmap stage. The public behavior is correct, but the localized message schema still names those records `betaItems`, and `roadmap.ts` consumes that obsolete maturity-specific key to build Stable records.

The name is internal and not user-visible, but it now encodes the wrong domain meaning and makes future roadmap maintenance easier to misread.

## Goal

Rename the internal localized roadmap surface collection from `betaItems` to `stableSurfaceItems` while preserving the current public roadmap output exactly.

## Design

1. Rename the `Messages["roadmap"]` contract key from `betaItems` to `stableSurfaceItems`.
2. Rename the matching EN and PT-BR object keys without changing IDs, titles, summaries, order, or translations.
3. Update `getRoadmapStages(locale)` to consume `copy.stableSurfaceItems`.
4. Add a regression assertion that both locale message objects expose `stableSurfaceItems` and no longer expose `betaItems`.
5. Preserve the existing behavioral roadmap assertions: Beta remains empty and Stable contains `plugin`, `catalog`, `installers`, `microsite`, and `stable-skills` in that order.

## Non-goals

- no user-visible copy changes
- no roadmap stage changes
- no version bump
- no release or readiness metadata changes
- no canonical skill or pack changes
- no catalog regeneration
- no layout, styling, or interaction changes

## Verification contract

- RED must fail because the current localized message objects still expose `betaItems` and do not expose `stableSurfaceItems`.
- GREEN must preserve the existing roadmap output in both locales.
- Typecheck must prove the renamed `Messages` contract and `roadmap.ts` consumer agree.
- Canonical Ubuntu and Windows CI must pass before the PR is ready for review.
