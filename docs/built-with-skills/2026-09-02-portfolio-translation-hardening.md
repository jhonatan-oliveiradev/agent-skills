# Portfolio 2025 — translation provider hardening

- Date: 2026-09-02
- Evidence class: `real-use`
- External project: Portfolio 2025
- Source repository: private; direct repository, pull-request, commit, and Actions links are intentionally omitted from this public record
- Active packs represented: `quality-testing`, `frontend-product`
- Methods used:
  - `selecting-working-methods`
  - `building-regression-tests`
  - `testing-integration-boundaries`
  - `shipping-github-vercel-changes`

## Context

A real production incident on 2026-08-30 showed the portfolio translation flow attempting to use the retired Groq model `llama-3.1-8b-instant`, which the provider rejected with `model_not_found`.

The current provider already defaulted to `openai/gpt-oss-20b`. The remaining path to the retired model was a stale `TRANSLATION_MODEL` environment override. The task was to harden that boundary without disabling legitimate explicit model configuration and without promoting unverified changes to the live site.

## Method routing

`selecting-working-methods` was used to keep ownership narrow:

1. `building-regression-tests` owned reproduction of the known defect.
2. `testing-integration-boundaries` owned verification of the actual model sent across the Groq HTTP boundary.
3. `shipping-github-vercel-changes` owned branch, pull-request, CI, merge, and deployment-state verification after implementation.

No additional method was added without a separate responsibility.

## RED

A regression-only change added two contracts:

- the retired `llama-3.1-8b-instant` override must resolve to the supported default `openai/gpt-oss-20b`;
- another explicit model override must remain configurable.

The canonical RED execution produced:

- 161 tests total;
- 160 passed;
- 1 failed;
- the only failure was the retired-model contract;
- actual model: `llama-3.1-8b-instant`;
- expected model: `openai/gpt-oss-20b`;
- the custom explicit override contract already passed.

## Fix

The provider now normalizes `TRANSLATION_MODEL` and maps only the proven retired value to the supported default. All other non-empty explicit model overrides remain unchanged.

This keeps the correction proportional to the incident instead of turning one retired model into a broad configuration denylist.

## Verification record

The implementation was verified in the connected private source repository. Immutable identifiers are retained here for owner-side traceability without publishing private links.

### Pull-request candidate

- External PR: `#35`
- Final candidate SHA: `c3d5cd5a233821a645fa079189e05667609f881d`
- Canonical pre-merge CI run: `33626667911`
- Result: 161/161 tests passed
- Changed-source ESLint: passed
- CI typecheck: passed
- GitGuardian: passed with no secrets detected

### Development merge

- Development merge SHA: `9b86d846c21ce7df98b1a217619ba3ec9f78de69`
- Canonical post-merge CI run: `33628934099`
- Result: 161/161 tests passed
- Changed-source ESLint: passed
- CI typecheck: passed
- Production branch was not modified by this merge

### Vercel state

The Vercel project was checked after the development merge. No new deployment was emitted for the development SHA. Production remained associated with `main`.

Therefore this case proves a real external implementation and post-merge CI outcome, but it **does not claim production runtime verification** and does not claim that the live portfolio has already received the fix.

## Outcome

The case demonstrates real use of the Studio on an external project with a concrete incident, a reproducible RED, a bounded implementation, and post-merge verification.

For Stable-readiness accounting it contributes:

- 1 real-use case;
- 1 distinct external project;
- 2 active packs represented: `quality-testing` and `frontend-product`.

It does **not** by itself mark the Studio's plugin, catalog, installers, or microsite surfaces as Stable-ready. Those gates remain unchanged until they have their own honest real-use evidence.
