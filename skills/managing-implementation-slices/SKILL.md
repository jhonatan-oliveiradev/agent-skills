---
name: managing-implementation-slices
description: Use when an implementation is growing across multiple concerns, branches, or pull requests and needs to be decomposed into small changes that can be verified and integrated safely.
---

# Managing Implementation Slices

Keep engineering work in small batches that can be understood, reviewed, verified, and integrated without waiting for the entire initiative to finish.

## Define a slice
A good implementation slice:
- serves one coherent purpose;
- leaves the repository in a working state after it lands;
- includes the tests or verification needed for its behavior;
- has a reviewable diff with minimal unrelated churn;
- makes dependencies on earlier or later slices explicit;
- has a clear rollback or containment story when the change is risky.

Small means **conceptually focused**, not an arbitrary line count.

## Prefer vertical progress
When possible, cut through the smallest set of layers needed to demonstrate a useful behavior. A vertical slice is usually easier to validate than separate “frontend”, “backend”, and “tests” branches that are individually incomplete.

Horizontal enabling slices are appropriate when they create a stable seam, compatibility layer, schema expansion, test harness, or shared contract that later work can safely build on.

## Keep changes independently safe
Each merged slice should preserve system correctness. Do not rely on a later pull request to repair a deliberately broken intermediate state.

Use compatibility techniques when needed:
- additive schema or contract changes before removals;
- feature flags or dormant code paths for incomplete rollout;
- adapters/seams before replacing implementations;
- tests before high-risk refactors when behavior is not already protected.

## Separate concerns that review differently
Split work when combining concerns makes evidence harder to interpret. Common candidates:
- mechanical refactor vs. behavior change;
- dependency upgrade vs. feature adoption;
- schema expansion vs. data migration vs. contract cleanup;
- generated output vs. hand-authored logic;
- infrastructure enablement vs. product behavior.

Do not split so aggressively that reviewers cannot understand the purpose or validate the slice in isolation.

## Handle dependencies explicitly
If slice B depends on slice A, say so. Prefer merging A first. When continued work must proceed before A merges, use stacked pull requests or another explicit dependency mechanism rather than hiding both changes inside one oversized branch.

## Control scope creep
When new work appears, classify it:
- **required for this slice** — without it the accepted behavior is incorrect or unverifiable;
- **follow-up** — useful, but the current slice can safely land without it;
- **unrelated** — move it out immediately.

Do not expand a slice because the nearby code “could also be cleaned up.”

## Completion check
Before requesting review, confirm:
- the slice has one explainable purpose;
- the diff contains no accidental neighboring work;
- relevant tests/checks pass;
- the system remains usable after this slice alone;
- dependencies and follow-ups are documented;
- the next slice can start from a known state.

## References
- DORA, Working in small batches: https://dora.dev/capabilities/working-in-small-batches/
- Google Engineering Practices, Small CLs: https://google.github.io/eng-practices/review/developer/small-cls.html
- GitHub Docs, About stacked pull requests: https://docs.github.com/en/pull-requests/get-started/about-stacked-prs
