---
name: reviewing-api-security
description: Use when an authorized API or backend boundary needs security review for authentication, object/function/property authorization, resource abuse, business-flow abuse, SSRF, configuration, inventory, and third-party consumption.
---

# Reviewing API Security

## Core principle
API security is primarily about enforcing identity, authorization, resource, and business invariants on every reachable operation. Never assume a client, gateway, hidden field, or route naming convention provides authorization.

## Scope rule
Assess only APIs and environments the user is authorized to review. Prefer source, schemas, policies, logs, controlled test identities, and local/staging requests. Avoid destructive load, data modification, or probing unrelated systems.

## Workflow
1. Inventory the API surface: routes, methods, versions, schemas, webhooks, background consumers, admin APIs, internal endpoints, outbound API calls, and deprecated routes still deployed.
2. Classify identities and privilege levels. Include anonymous, user, tenant, service, admin, machine credentials, and delegated identities.
3. Review authentication and token handling: issuer/audience, expiry, revocation where required, signature verification, credential transport/storage, and failure behavior.
4. Review authorization at three distinct levels:
   - object: may this identity access this specific record/resource?
   - property: may it read or change each exposed sensitive field?
   - function: may it invoke this operation at all?
5. Review data binding and serialization. Use explicit schemas/allowlists for mutable fields and avoid returning internal or privileged properties by default.
6. Review resource and workflow abuse: pagination/bulk sizes, expensive operations, retries, uploads, account creation, reservations, coupon/payment-like flows, enumeration, and automation-sensitive actions. Apply limits where the business invariant requires them.
7. Review server-initiated requests and third-party API consumption. Constrain destinations/protocols, validate redirects, bound time/size, treat upstream data as untrusted, and avoid propagating excessive privileges.
8. Review configuration and inventory: CORS, error detail, debug routes, API versions, documentation exposure, unused endpoints, secrets, and environment drift.
9. Validate findings with controlled identities and minimal requests. Prove the violated invariant without collecting unrelated data or increasing impact.

## Authorization matrix
For sensitive operations, record:
- route/operation;
- resource owner/tenant;
- allowed identities/roles;
- object and property rules;
- server-side enforcement point;
- expected denial behavior;
- automated or manual verification evidence.

## Quality checks
A review is weak when it:
- tests only authentication but not per-object/per-function authorization;
- trusts client-supplied ownership, role, price, status, or tenant identifiers;
- ignores sensitive business flows because requests are individually valid;
- treats rate limiting as a universal substitute for authorization;
- reports API Top 10 labels without evidence tied to the actual contract.

## Verification
For each high-risk finding, repeat the controlled request using the least-privileged relevant identity and confirm the server enforces the intended invariant after remediation. Add a regression test when the boundary can be exercised deterministically.

## References
- OWASP API Security Top 10:2023: https://owasp.org/API-Security/editions/2023/en/0x11-t10/
- OWASP Application Security Verification Standard 5.0.0: https://owasp.org/www-project-application-security-verification-standard/
- OWASP Top 10:2025: https://owasp.org/Top10/2025/
