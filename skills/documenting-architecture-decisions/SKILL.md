---
name: documenting-architecture-decisions
description: Use when a software decision materially affects structure, quality attributes, dependencies, interfaces, technology choices, or team direction and its rationale must remain reviewable over time.
---

# Documenting Architecture Decisions

## Core principle
Record why an architecturally significant choice was made while the context is still available. An ADR is a decision record, not a design essay and not retrospective justification.

## When a decision deserves an ADR
Capture a decision when changing it later would be costly or when it materially affects:
- system structure or deployment shape;
- reliability, security, performance, availability, or other quality attributes;
- dependency and ownership boundaries;
- published interfaces or data contracts;
- frameworks, persistence, messaging, infrastructure, or other construction techniques;
- a recurring technical debate that needs one shared source of rationale.

Do not create ADRs for routine implementation details that are cheap to reverse and already obvious from the code.

## Minimal record
Keep each ADR focused on one decision and include:
1. **Title and status** — proposed, accepted, rejected, or superseded.
2. **Context** — the problem, constraints, forces, and evidence that make a decision necessary.
3. **Decision drivers** — the quality attributes or business/engineering outcomes that matter most.
4. **Considered options** — realistic alternatives, including keeping the current state when relevant.
5. **Decision** — the selected option in direct language.
6. **Consequences** — benefits, costs, new risks, operational burden, and follow-up work.
7. **Validation/review trigger** — evidence that should confirm the decision and conditions that should cause it to be reconsidered.

## Lifecycle
Discuss the ADR while it is proposed. Once accepted, preserve it as historical context. If later evidence changes the decision, create a new ADR that supersedes the old one rather than rewriting history.

Link implementation changes to the relevant ADR when that connection helps reviewers evaluate architectural consistency.

## Quality checks
A useful ADR lets a future engineer answer:
- What problem were we solving?
- Which constraints and trade-offs mattered?
- What alternatives were actually considered?
- Why did this option win then?
- What complexity did we knowingly accept?
- What would make us revisit the choice?

If the record only names a technology and says it is “best”, the decision is not sufficiently documented.

## Reference
- AWS Prescriptive Guidance, architectural decision record process: https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html
