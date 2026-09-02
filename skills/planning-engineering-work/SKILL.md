---
name: planning-engineering-work
description: Use when an engineering objective is broad, ambiguous, risky, or spans multiple changes and needs a concrete implementation sequence before coding begins.
---

# Planning Engineering Work

Turn an objective into a sequence of independently verifiable engineering outcomes before implementation starts. The plan should reduce uncertainty and coordination cost, not create paperwork.

## Establish the work contract
Before decomposing anything, identify:
- the user or system outcome that must change;
- the current behavior and evidence for it;
- explicit acceptance criteria;
- constraints that cannot be violated;
- dependencies, migrations, rollout boundaries, and external owners;
- known risks and unknowns that could invalidate the plan.

Separate **facts**, **assumptions**, and **open questions**. Do not silently convert an assumption into a requirement.

## Plan by behavior, not by file list
Prefer slices that leave the system in a coherent state and produce observable progress. A useful slice has:
1. one primary behavioral outcome;
2. a clear boundary of code or configuration it may change;
3. verification that can prove the outcome;
4. explicit prerequisites;
5. a safe stopping point after completion.

Avoid plans such as “update component, then service, then tests” when those steps cannot be validated independently. File-level work belongs inside a slice, not as the organizing principle.

## Order the work
Sequence slices by dependency and risk:
- prove uncertain or architecture-sensitive assumptions early;
- establish compatibility seams before disruptive migrations;
- land enabling changes before dependent behavior;
- keep refactors separate from feature changes when separation improves reviewability;
- defer optional polish until the required behavior is verified.

When dependencies are unavoidable, state them explicitly. Do not pretend parallel work is independent when one slice cannot function or be reviewed without another.

## Define verification up front
For every slice, record the evidence required before it is considered complete: targeted tests, integration checks, build/typecheck/lint gates, runtime inspection, migration verification, or production evidence as appropriate.

A plan is not complete if its final step is merely “test everything.” Each important risk should already have an assigned verification point.

## Keep the plan live
When evidence invalidates an assumption, update the plan rather than stacking speculative patches on top of it. Preserve completed facts, explain the changed premise, and re-sequence only what the new evidence requires.

## Completion check
A usable engineering plan lets another engineer answer:
- What outcome are we trying to produce?
- What do we know versus assume?
- What is the smallest next slice?
- Why does it come next?
- How will we prove it is done?
- What can safely wait?

## References
- DORA, Working in small batches: https://dora.dev/capabilities/working-in-small-batches/
- Google Engineering Practices, Small CLs: https://google.github.io/eng-practices/review/developer/small-cls.html
- GitHub Docs, About pull requests: https://docs.github.com/en/pull-requests/get-started/about-pull-requests
