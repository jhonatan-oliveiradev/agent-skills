---
name: testing-integration-boundaries
description: Use when code crosses a database, filesystem, queue, network API, process, or module boundary and isolated tests cannot prove serialization, persistence, protocol, or failure behavior.
---

# Testing Integration Boundaries

## Core principle
Test the boundary that can actually break. Prefer a narrow integration test with the real controllable dependency over a broad system test or a mock that merely repeats your assumptions.

## Boundary workflow
1. Name the boundary and its contract: request/response shape, persisted state, message schema, file format, transaction semantics, or side effect.
2. Identify which behavior belongs to your code and which belongs to the dependency. The test should prove the interaction between them, not re-test either implementation exhaustively.
3. Use the real dependency when it is local and controllable: a real database engine, filesystem, queue, or service instance. Use a faithful fake or dedicated test environment only when the real dependency cannot reasonably run in the test environment.
4. Trigger the boundary through the smallest public entry point that exercises the integration.
5. Assert on observable outcomes: stored rows, emitted messages, parsed responses, returned errors, committed/rolled-back state, or externally visible side effects.
6. Exercise representative failure behavior where the contract requires it: malformed data, unavailable dependency, timeout, duplicate delivery, constraint violation, partial write, retry, or rollback.
7. Isolate test data and cleanup. A test must not depend on execution order or residue left by another test.

## Mocking rule
A mock is useful for an interaction you intentionally do not want to integrate in this test. It is not evidence that your production serializer, driver, schema, query, HTTP client, or database constraint works.

If a fake represents an external service, keep its contract narrow and periodically verify it against the real provider or an explicit contract test.

## High-value boundaries
Prioritize code that:
- serializes or deserializes data;
- writes or reads persistence;
- crosses process or network boundaries;
- publishes or consumes events;
- relies on transactions or consistency guarantees;
- translates external errors into product behavior.

## Verification
A passing integration test should let you answer: “What real boundary behavior did this prove that a unit test could not?” If the answer is only that a mock received a call, move the evidence closer to the real boundary.

## References
- Martin Fowler, Integration Test: https://martinfowler.com/bliki/IntegrationTest.html
- Martin Fowler / Ham Vocke, The Practical Test Pyramid: https://martinfowler.com/articles/practical-test-pyramid.html
- Google Testing Blog, Test Sizes: https://testing.googleblog.com/2010/12/test-sizes.html
