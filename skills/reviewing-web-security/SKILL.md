---
name: reviewing-web-security
description: Use when an authorized web application needs a structured security review across access control, sessions, browser-facing controls, input handling, configuration, cryptography, errors, and observability.
---

# Reviewing Web Security

## Core principle
Review the application as a set of trust boundaries and security controls. A scanner can supply evidence, but findings must be tied back to reachable behavior, code/configuration, and a violated security property.

## Scope rule
Assess only applications and environments the user is authorized to test. Prefer source review, configuration inspection, existing security tooling, and controlled test accounts. Do not perform destructive testing or probe unrelated public systems.

## Workflow
1. Establish scope and deployment context: routes, server/client boundaries, middleware, identity provider, storage, uploads, third-party scripts, privileged areas, and security-relevant headers/configuration.
2. Map exposed entry points and sensitive operations. Include forms, query/path parameters, cookies, redirects, file inputs, server actions, API calls, admin surfaces, and externally supplied URLs.
3. Review authentication and session handling: secure cookie properties, session rotation/invalidation, credential recovery, CSRF exposure where applicable, and sensitive state stored in the browser.
4. Review authorization independently of authentication. Verify server-side object, function, tenant, and role checks on every sensitive operation rather than trusting hidden UI or client state.
5. Review input/output boundaries: validation, canonicalization, parameterized data access, contextual output encoding, safe HTML handling, file validation, redirect allowlists, and command/template boundaries.
6. Review browser and deployment controls: CSP where appropriate, clickjacking defenses, transport security, CORS, cache behavior for sensitive responses, source maps, debug endpoints, default credentials, and environment-specific configuration.
7. Review cryptographic and secret usage. Confirm approved primitives/libraries, key separation, secure randomness, transport protection, and that secrets are not shipped to untrusted clients or committed to source.
8. Review exceptional paths and telemetry. Security-relevant failures should not leak sensitive details; privileged events and repeated failures should be observable enough to investigate.
9. Validate suspected findings with the smallest safe reproduction. Record expected behavior, observed evidence, affected boundary, preconditions, impact, and remediation.

## Finding format
For each material finding, record:
- affected route/component/control;
- violated security property;
- evidence and safe reproduction;
- required attacker/user preconditions;
- realistic impact;
- severity rationale;
- recommended control at the enforcing boundary;
- verification step after remediation.

## Quality checks
Reject findings that are only scanner labels without reachable evidence. Do not report missing headers or theoretical weaknesses as high severity unless the application context makes them exploitable or materially increases risk.

## Verification
Re-run the exact safe reproduction after remediation and confirm the security property now holds. When a durable automated regression check is practical, add or recommend it at the narrowest layer that proves the control.

## References
- OWASP Top 10:2025: https://owasp.org/Top10/2025/
- OWASP Application Security Verification Standard 5.0.0: https://owasp.org/www-project-application-security-verification-standard/
- OWASP Web Security Testing Guide: https://owasp.org/www-project-web-security-testing-guide/stable/
