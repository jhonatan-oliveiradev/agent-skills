---
name: building-regression-tests
description: Use when a bug, outage, production defect, or failed higher-level test must become a durable automated guard before the implementation is changed.
---

# Building Regression Tests

## Core principle
A known defect is not safely fixed until an automated test can reproduce it and fail for the right reason before the fix. Keep that test at the narrowest layer that still proves the broken contract.

## Regression workflow
1. Reproduce the defect from a concrete report, failing test, log, trace, request, data shape, or user sequence. Do not encode a guessed failure mode.
2. State the violated contract in observable terms: expected output, persisted state, emitted event, UI behavior, error handling, authorization, or side effect.
3. Find the narrowest layer that can reproduce the real defect. A bug found by E2E may belong in an integration or unit regression test once the failing boundary is understood.
4. Write one test that fails on the current buggy implementation. Confirm the failure message and evidence correspond to the defect, not a setup error.
5. Apply the minimal production fix.
6. Run the new test and the relevant surrounding suite. The new test must turn GREEN without weakening its assertion.
7. If the bug suggests a family of nearby failures, add only the distinct cases justified by the same root cause.
8. Keep the regression test after the fix. Remove it only if the protected behavior disappears or another test demonstrably supersedes the same contract.

## Test quality
A regression test should:
- reproduce the smallest meaningful failing case;
- assert behavior, not the implementation detail you plan to change;
- be deterministic and isolated;
- have a name that describes the protected contract;
- fail if the bug is intentionally reintroduced;
- avoid broad fixtures and unrelated assertions.

## Higher-level discoveries
When a broad system or browser test exposes a defect, first preserve the evidence that proves the user-visible failure. Then trace the defect downward. If a smaller test can reproduce the same root cause, add the durable regression there and keep the broad test only when it proves additional integration or journey value.

## Flakiness
Do not call an intermittently failing test a regression guard. If the same code can produce pass and fail outcomes, isolate nondeterminism before relying on the test as a release signal.

## Verification
Before declaring the bug fixed, prove the full cycle:
1. the new test fails against the buggy behavior;
2. the production fix is applied;
3. the same test passes;
4. relevant neighboring tests still pass.

If RED was never observed, the test has not demonstrated that it guards this regression.

## References
- Martin Fowler, Self Testing Code: https://martinfowler.com/bliki/SelfTestingCode.html
- Martin Fowler, Goto Fail, Heartbleed, and Unit Testing Culture: https://martinfowler.com/articles/testing-culture.html
- Google Testing Blog, Where do our flaky tests come from?: https://testing.googleblog.com/2017/04/where-do-our-flaky-tests-come-from.html
