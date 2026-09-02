# Codebase Intelligence Real-Use Evidence Implementation Plan

**Goal:** Record the verified ROCKET Codebase Intelligence case as public-safe real-use evidence, satisfy the explicit RC2 pack gate, and return the candidate to `ready-for-stable-review` without promoting Stable.

**Spec:** `docs/superpowers/specs/2026-09-02-codebase-intelligence-real-use-design.md`

## Constraints

- Keep Studio version exactly `1.0.0-rc.2`.
- Keep catalog exactly 54 skills / 11 active packs.
- Do not alter canonical Codebase Intelligence methods.
- Do not expose private ROCKET URLs.
- Do not add the new case to distribution-surface evidence it did not exercise.
- TDD RED → GREEN.
- No Stable tag/release/version promotion in this tranche.
- No merge without explicit user authorization.

## Task 1 — RED contracts

- [ ] Update root release-readiness test to require:
  - `status: ready-for-stable-review`;
  - `validatedRealUsePacks: ["codebase-intelligence"]`;
  - observed totals `4 / 3 / 5`.
- [ ] Update Built with Skills tests to require six cases and the new Rocket Codebase Intelligence record with all five methods.
- [ ] Add a cross-domain relation contract proving the new case covers the entire `codebase-intelligence` pack.
- [ ] Open Draft PR and verify CI fails only because production evidence state still represents the pre-case RC2 gate.

## Task 2 — Public-safe case record

- [ ] Add `docs/built-with-skills/2026-09-02-rocket-codebase-intelligence-cosmic-sdk-removal.md`.
- [ ] Record the challenge, five methods, capability fallback, decisions, result, and verification identifiers without private URLs.
- [ ] Add the localized case to `apps/web/src/lib/built-with-skills.ts` using the existing `rocket-unesp` public-safe project identity.
- [ ] Use only public Agent Skills Studio source/QA links for the web evidence entries.

## Task 3 — Satisfy the RC2 pack gate

- [ ] Update `release/stable-readiness.json`:
  - keep schemaVersion 3 and candidate `1.0.0-rc.2`;
  - set status `ready-for-stable-review`;
  - set `validatedRealUsePacks` to `["codebase-intelligence"]`;
  - update observed totals to 4 real-use cases, 3 distinct projects, 5 active packs represented.
- [ ] Preserve existing surface evidence unchanged.
- [ ] Do not change any version owner to Stable.

## Task 4 — Verification

- [ ] Run canonical Ubuntu + Windows PR workflow on one final HEAD.
- [ ] Confirm root tests and catalog/plugin validation GREEN.
- [ ] Confirm web tests, typecheck, lint, and production build GREEN.
- [ ] Confirm installers GREEN on their supported runners.
- [ ] Confirm 54/11 and `1.0.0-rc.2` invariants unchanged.
- [ ] Confirm final diff has no temporary workflow and no canonical method changes.
- [ ] Review final diff against the spec.
- [ ] Leave PR unmerged pending explicit authorization.

## Next tranche

After this PR is merged, perform a separate Stable-readiness review. Only that later tranche may decide whether to promote the five Studio-level version owners and release artifacts to `1.0.0`.
