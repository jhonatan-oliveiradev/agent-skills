---
name: designing-test-strategies
description: Use when a feature, service, or release needs a deliberate verification plan and the team is unsure which risks belong in unit, integration, end-to-end, or non-functional tests.
---

# Designing Test Strategies

## Core principle
Design tests around the failures that matter, then choose the smallest test scope that can provide trustworthy evidence. Coverage percentage is a diagnostic signal, not a testing strategy.

## Strategy workflow
1. Define the product behaviors and contracts that must remain true. Include critical user journeys, data integrity, authorization, failure recovery, and externally visible interfaces.
2. Rank risks by impact and likelihood. Give the most expensive or dangerous failures the strongest independent evidence.
3. Choose the lowest useful layer for each risk:
   - small/unit tests for deterministic logic and edge cases;
   - integration tests for serialization, persistence, process boundaries, and external dependencies;
   - end-to-end tests for a small set of critical user journeys that require the assembled product.
4. Add non-functional verification only where the requirement exists: accessibility, performance, load, reliability, security, compatibility, or recovery.
5. Define the environment and test data needed for repeatability. Tests that depend on shared mutable state, execution order, or uncontrolled production services are weak evidence.
6. Decide which gates block a change or release. A gate should have an owner, a deterministic command, and a clear failure interpretation.
7. Review the portfolio for redundancy. Keep a higher-level test when it proves something a narrower test cannot.

## Evidence matrix
For each important risk, record:
- behavior or contract at risk;
- failure impact;
- test layer;
- environment/dependencies;
- expected evidence;
- execution cadence;
- owner when the gate fails.

## Quality checks
A strategy is weak when it:
- treats a coverage target as the primary objective;
- duplicates the same assertion across every layer;
- puts most confidence in broad UI tests;
- omits integration boundaries because unit tests are fast;
- has no explicit critical user journeys;
- cannot explain what a failed gate means.

## Verification
Before accepting the strategy, pick one critical behavior and one high-risk failure mode. Confirm that each has a test at the narrowest layer that can prove it, plus broader evidence only when assembly or user workflow adds unique confidence.

## References
- Google Testing Blog, How Much Testing is Enough?: https://testing.googleblog.com/2021/06/how-much-testing-is-enough.html
- Microsoft Azure Well-Architected Framework, testing strategies: https://learn.microsoft.com/en-us/azure/well-architected/operational-excellence/testing
- Martin Fowler, Test Pyramid: https://martinfowler.com/bliki/TestPyramid.html
