---
name: reviewing-pull-requests
description: Use when a pull request, patch, or proposed code change needs technical review before merge, especially when behavior, architecture, regressions, tests, or risk must be evaluated from evidence.
---

# Reviewing Pull Requests

Review the proposed change as a system behavior and risk decision, not as a search for stylistic nits. The goal is to determine whether the change should enter the codebase and what evidence supports that decision.

## Build context before judging the diff
Read the pull-request description, linked issue/spec, acceptance criteria, relevant comments, changed-file list, and available checks. Identify:
- intended behavior;
- explicit scope and non-goals;
- areas of elevated risk;
- repository conventions that matter;
- evidence already supplied by the author.

If the intent is unclear, do not infer a different requirement and review against it.

## Review from the outside in
Evaluate in this order:
1. **Purpose and scope** — does the change solve the stated problem without unrelated expansion?
2. **Behavior** — does it produce the intended result, including important edge/failure paths?
3. **Design** — are boundaries, ownership, dependencies, and abstractions appropriate for the codebase?
4. **Safety** — consider data loss, compatibility, auth/security, concurrency, migrations, rollout, and rollback where relevant.
5. **Verification** — do tests and checks prove the important behavior rather than merely execute code?
6. **Maintainability** — is the resulting code understandable, proportionate, and consistent with local conventions?
7. **Documentation/operations** — are changed contracts, configuration, migrations, or runbooks reflected where needed?

Read enough surrounding code to understand the changed paths. A diff alone may hide violated invariants.

## Treat CI as evidence, not decoration
Inspect actual check results when available. Do not claim tests, lint, typecheck, build, deployment, or security checks passed unless the corresponding evidence is current for the reviewed head.

When a failure is unrelated or flaky, distinguish that diagnosis from a passing result. A red check is still red until rerun or otherwise resolved with evidence.

## Write actionable findings
For each finding, state:
- what is wrong;
- where it occurs;
- the concrete failure mode or maintainability cost;
- why it matters;
- the smallest direction that would resolve it, when useful.

Prioritize findings. Separate blockers from non-blocking suggestions and cosmetic nits. Do not bury correctness or security issues beneath formatting preferences.

## Protect scope during review
If feedback is valuable but not required for the pull request to be correct, record it as a follow-up rather than expanding the current change indefinitely. Request changes only for issues that materially affect correctness, safety, maintainability, or the agreed acceptance criteria.

## Final review decision
Before approving or requesting changes, re-check:
- the final diff, not only earlier commits;
- unresolved review threads;
- current CI/check status;
- migrations/configuration implications;
- whether earlier findings were actually resolved.

State what you reviewed and any important areas you could not verify.

## References
- Google Engineering Practices, What to look for in a code review: https://google.github.io/eng-practices/review/reviewer/looking-for.html
- Google Engineering Practices, The Standard of Code Review: https://google.github.io/eng-practices/review/reviewer/standard.html
- GitHub Docs, Pull request reviews: https://docs.github.com/en/pull-requests/reference/pull-request-reviews
- GitHub Docs, Helping others review your changes: https://docs.github.com/en/pull-requests/concepts/helping-others-review-your-changes
