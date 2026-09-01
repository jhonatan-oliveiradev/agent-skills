---
name: testing-web-applications-end-to-end
description: Use when a web application's assembled browser experience, critical user journeys, routing, forms, authentication, client state, or network behavior must be verified beyond component and integration tests.
---

# Testing Web Applications End to End

## Core principle
Use end-to-end tests to prove a small set of critical user journeys through the assembled product. Interact with the application as a user would and inspect browser evidence when the journey fails.

## Journey workflow
1. Define the user goal, starting state, and completion condition before writing selectors or actions.
2. Keep the journey focused. Cover the minimum sequence of features that must work together to achieve the goal.
3. Start from controlled state: deterministic data, explicit authentication state, known feature flags, and an isolated browser context.
4. Navigate and interact through user-facing contracts such as roles, labels, text, URLs, and visible state. Avoid selectors coupled to styling or implementation internals.
5. Assert meaningful outcomes rather than every intermediate DOM mutation.
6. When a failure occurs, inspect the browser before patching code: visible UI, URL, console errors, failed requests, response status/body, storage/state, and screenshots when visual evidence matters.
7. Test negative or recovery paths only when they are critical to the journey: rejected auth, validation, failed request, retry, expired state, or interrupted navigation.
8. Keep tests independent. No journey should require another test to have run first.

## Browser evidence
Capture the evidence needed to distinguish product defects from test defects:
- the final visible state and URL;
- console exceptions;
- relevant request/response failures;
- screenshot or trace for visual/timing failures;
- exact reproduction steps and test data.

A screenshot alone is not root-cause evidence when console, network, or state explains the failure.

## Scope discipline
Do not move every edge case into the browser. If a failure can be proven at a narrower layer with equal confidence, test it there and keep only enough end-to-end coverage to prove the assembled journey.

Do not make Playwright, Cypress, or another runner part of the method itself. Use the browser tooling available in the environment; when Playwright is available, prefer its user-facing locators, isolation model, traces, console/network inspection, and auto-waiting rather than arbitrary sleeps.

## Verification
A good E2E suite answers two questions quickly: “Can users complete the critical journey?” and, when not, “What observable browser evidence narrows the failure?” If it cannot do both, reduce scope or improve observability.

## References
- Playwright, Best Practices: https://playwright.dev/docs/best-practices
- Google Testing Blog, How Much Testing is Enough?: https://testing.googleblog.com/2021/06/how-much-testing-is-enough.html
- Google Testing Blog, Just Say No to More End-to-End Tests: https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html
