---
name: tracing-code-execution-paths
description: Use when you need to reconstruct how execution moves from a trigger through code and service boundaries.
---

## Ownership

Reconstruct an execution path without turning correlation or reachability into a root-cause claim.

The workflow below implements the shared Codebase Intelligence evidence contract.

## Workflow

1. Ask one narrow structural question, define its scope, and state the decision it supports.
2. Detect whether an optional code-intelligence runtime is available through callable tools only. Do not install a runtime, do not run `codegraph init`, and do not create `.codegraph/` without explicit authorization.
3. Use the narrowest symbol, relation, or targeted search that can answer the question; expand only to close a named evidence gap.
4. Use an explicit fallback when runtime evidence is unavailable or inconclusive: inspect targeted symbols, search, imports, references, tests, configuration, and direct reads. A textual match is not proof of a caller, callee, or owner.
5. Keep an evidence ledger for every material claim: claim, status (`observed`, `inferred`, or `unresolved`), source, location, confidence, and relevance.
6. Stop at sufficiency when traceable evidence answers the question, critical dependencies are checked, gaps are classified, and further reading is unlikely to change the immediate decision. Hand off to the next owner.

## Output contract

- trigger or entrypoint;
- ordered path steps;
- boundary crossings;
- observed and inferred transitions;
- terminal behavior;
- unresolved jumps;
- source references;

## Does not own

Root-cause investigation or failure diagnosis; use Systematic Debugging for root cause claims.
