---
name: threat-modeling-applications
description: Use when a feature, service, or application needs security risks identified from its architecture, assets, trust boundaries, and abuse cases before implementation or release.
---

# Threat Modeling Applications

## Core principle
Threat modeling is a design exercise, not a vulnerability checklist. Start from what the system protects, who can interact with it, and where trust changes; then turn plausible abuse paths into concrete controls and verification work.

## Scope rule
Work only within the application, codebase, infrastructure, and test environments the user is authorized to assess. Prefer architecture, source, configuration, and controlled test evidence over speculative attack claims.

## Workflow
1. Define the security objective and review scope. Record the feature, deployables, data stores, external services, users, administrators, automation, and environments that matter.
2. Identify assets and security properties. Include sensitive data, credentials, money/value, privileged actions, availability, integrity, privacy, and business invariants.
3. Map entry points and trust boundaries. Trace browser/client → edge → application → service → datastore → third party flows, plus background jobs, webhooks, queues, file handling, and administrative paths.
4. Record assumptions separately from observed facts. An undocumented assumption is not a control.
5. Generate abuse cases. Ask how an untrusted or lower-privilege actor could cross each boundary, alter an identifier, bypass a workflow, inject data, exhaust a resource, misuse a privileged integration, or exploit a failure path. STRIDE can be used as a prompt, not as a completeness guarantee.
6. Rank threats by likely impact and realistic preconditions. Avoid severity inflation when exploitability or exposure is unproven.
7. Assign controls to the boundary where they are enforceable: authorization, validation, isolation, rate limits, cryptography, safe defaults, integrity checks, logging/alerting, or operational controls.
8. Define verification evidence for every high-priority control. Link each risk to code review, automated tests, configuration checks, security tests, or operational evidence.
9. Record residual risk, owner, and review trigger. Revisit the model when trust boundaries, sensitive data, privilege, or external dependencies change.

## Threat record
For each material threat, capture:
- asset or invariant at risk;
- actor and required access;
- entry point and trust boundary;
- abuse path;
- impact and preconditions;
- existing controls;
- required mitigation;
- verification evidence;
- residual risk and owner.

## Quality checks
A threat model is weak when it:
- starts from OWASP categories without mapping the actual system;
- treats every theoretical threat as equally urgent;
- omits business-logic abuse and privileged workflows;
- confuses authentication with authorization;
- lists controls without a way to verify them;
- claims the absence of threats because a scanner found nothing.

## Verification
Select the highest-risk threat and trace it from actor to asset through the actual architecture. Confirm that the proposed control exists at the correct trust boundary and that a specific test or review can demonstrate the control is effective.

## References
- OWASP Threat Modeling: https://owasp.org/www-community/Threat_Modeling
- OWASP Application Security Verification Standard 5.0.0: https://owasp.org/www-project-application-security-verification-standard/
- OWASP Top 10:2025: https://owasp.org/Top10/2025/
