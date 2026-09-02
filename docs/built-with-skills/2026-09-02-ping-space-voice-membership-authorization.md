# PING — Space Voice Membership Authorization

Date: 2026-09-02  
Evidence class: Real-use evidence for Agent Skills Studio Stable readiness  
Repository status: Private source repository; this verification record is public-safe by design

## Problem

PING issues short-lived media credentials for voice calls. A real review of the Space voice flow found that the media credential boundary was relying too heavily on an upstream Space join claim: the credential issuer needed to resolve the voice channel back to its Space and independently prove that the requester still had an active Space membership before issuing credentials.

The goal was to close that authorization gap without changing the established Server or DM credential semantics, and to prove the fix through a regression-first workflow rather than a speculative patch.

## Methods used

- `selecting-working-methods` — kept the security review, executable regression, integration-boundary verification, and delivery stages under distinct ownership.
- `reviewing-api-security` — owned the authorization and trust-boundary analysis at the media credential issuer.
- `building-regression-tests` — encoded an unauthorized Space voice credential claim as a deliberate failing test before implementation.
- `testing-integration-boundaries` — verified the new Space membership check alongside the existing Server, DM, Prisma transaction, and advisory-lock boundaries.
- `shipping-github-vercel-changes` — carried the change through isolated PRs, canonical CI, post-merge diagnosis, and final main-branch verification.

## TDD loop

### RED

- private regression-test commit: `7f295e31781f580955cfa0640cf2b22085be5b23`
- private workflow run: `33632133255`
- failing test check: `100254035073`
- expected failure: an unauthorized or stale Space membership claim could reach the media credential boundary without the boundary itself proving active membership.

The failing regression established the security contract before production code changed.

### GREEN

- private implementation commit: `40cc75c906518fed6a6c896ff698a221c49de1be`
- private fixture-alignment commit: `dd12c4bf3719f1726290550ccf2999c02f437021`
- behavior after the fix: the credential issuer resolves the voice channel to the target Space and requires an active `SpaceMember` record for the requester before issuing Space voice credentials.
- existing Server and DM credential behavior remained covered by the same suite.

### Follow-up diagnosis

The first merge exposed one stale transaction fake in the advisory-lock test. The security regression itself was already passing; the remaining failure came from a legacy double that did not implement the newly required `spaceChannel.findUnique` and `spaceMember.findFirst` collaborators.

The follow-up stayed test-only:

- private follow-up PR: `#63`
- private test-only commit: `b669c8e544b9d2a1137e965f63da55360aaab4ed`
- production files changed in the follow-up: none
- repair: align the advisory-lock fake with a valid Space channel ownership and active membership shape already exercised by the security regression.

No second production patch was stacked on top of the original authorization fix.

## Verification record

- primary private PR: `#62`
- follow-up private PR: `#63`
- final private merge commit: `c94b953b34047c6e766a95c534201dcb84beaa8c`
- final private workflow run: `33638844570`
- `Run tests`: `success`
- `Run formatting checks`: `success`
- `Run lint`: `success`
- `Run typecheck`: `success`
- `Run build`: `success`

This case records a real authorization defect, an executable RED→GREEN security fix, and a post-merge test-double repair verified on the final `main` merge commit. It contributes real-use evidence for method selection, application-security review, regression testing, integration-boundary testing, and GitHub delivery workflows.

Because the source repository is private, this public record intentionally retains PR, commit, check, and workflow identifiers for auditability while exposing no private repository URLs.