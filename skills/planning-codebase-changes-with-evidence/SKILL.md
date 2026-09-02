---
name: planning-codebase-changes-with-evidence
description: Use when you need a change evidence brief to inform another method's executable plan for a real codebase change.
---

## Ownership

Produce a change evidence brief for another planning method; do not execute the implementation plan.

Use the shared [evidence contract](../mapping-existing-codebase-structure/references/evidence-contract.md).

## Workflow

1. Ask one narrow structural question, define its scope, and state the decision it supports.
2. Detect whether an optional code-intelligence runtime is available through callable tools only. Do not install a runtime, do not run `codegraph init`, and do not create `.codegraph/` without explicit authorization.
3. Use the narrowest symbol, relation, or targeted search that can answer the question; expand only to close a named evidence gap.
4. Use an explicit fallback when runtime evidence is unavailable or inconclusive: inspect targeted symbols, search, imports, references, tests, configuration, and direct reads. A textual match is not proof of a caller, callee, or owner.
5. Keep an evidence ledger for every material claim: claim, status (`observed`, `inferred`, or `unresolved`), source, location, confidence, and relevance.
6. Stop at sufficiency when traceable evidence answers the question, critical dependencies are checked, gaps are classified, and further reading is unlikely to change the immediate decision. Hand off to the next owner.

## Output contract

- objective;
- explicit in/out scope;
- current-state evidence;
- affected surfaces;
- relevant paths and contracts;
- risks;
- unresolved questions;
- suggested slices;
- testing surfaces;
- handoff to Architecture, Engineering Workflow, Quality & Testing, or Systematic Debugging;

## Does not own

Executable planning, implementation, TDD, or slice management; do not implement the plan. Hand executable planning to Engineering Workflow or `writing-plans`.
