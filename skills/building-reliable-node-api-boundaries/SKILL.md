---
name: building-reliable-node-api-boundaries
description: Use when implementing or reviewing Node.js API or service endpoints that cross trust or data boundaries and require explicit validation, authorization, failure semantics, observability, or retry behavior.
---

# Building Reliable Node API Boundaries

## Core principle
Treat every API boundary as a trust boundary. Make authentication, authorization, validation, mutation scope, and failure behavior explicit before optimizing handler structure or framework ergonomics.

## Request path
1. Parse the request into a bounded shape. Reject malformed or oversized input before business work begins.
2. Authenticate the caller, then authorize the requested object and properties. Never infer object-level authorization only from a valid session.
3. Validate domain input separately from transport parsing. Reject fields the caller is not allowed to set instead of mass-assigning request bodies.
4. Keep one clear business operation per boundary. Put atomic database mutations inside an intentional transaction boundary.
5. For externally retryable writes, define idempotency or conflict semantics before shipping the endpoint.
6. Map internal failures to stable public error responses without leaking implementation details.
7. Add request correlation and structured diagnostics. Use framework context when adequate; otherwise Node.js `AsyncLocalStorage` can carry request-scoped context across asynchronous work.
8. Put timeouts, cancellation, pagination, and resource ceilings around downstream or potentially expensive work.

## Authorization checks
Cover both:
- object-level access: may this caller act on this specific record?
- property/function-level access: may this caller read or mutate these fields or operations?

Do not rely on a client to hide forbidden identifiers or fields.

## Verification
Exercise at minimum:
- a valid request;
- malformed and oversized input;
- valid identity with unauthorized object access;
- partial/property-level permission failure;
- repeated write or replay behavior where relevant;
- downstream timeout/failure;
- transaction rollback after a mid-operation error.

Logs should carry correlation and outcome context without storing secrets or unnecessary personal data.

## References
- Node.js AsyncLocalStorage: https://nodejs.org/api/async_context.html
- OWASP API Security Top 10 2023: https://owasp.org/API-Security/editions/2023/en/0x11-t10/
