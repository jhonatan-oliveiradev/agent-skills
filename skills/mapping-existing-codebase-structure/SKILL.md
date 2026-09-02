---
name: mapping-existing-codebase-structure
description: Use when you need traceable evidence of the current codebase structure, boundaries, and entrypoints.
---

## Ownership

Observe the structure that exists; do not design the structure that should replace it.

Use the shared [evidence contract](references/evidence-contract.md).

Read the optional [CodeGraph guide](references/codegraph.md) only when CodeGraph tools are callable or the user explicitly asks to install, initialize, or configure CodeGraph.

## Workflow

1. Ask one narrow structural question, define its scope, and state the decision it supports.
2. Detect whether an optional code-intelligence runtime is available through callable tools only. Do not install a runtime, do not run `codegraph init`, and do not create `.codegraph/` without explicit authorization.
3. Use the narrowest symbol, relation, or targeted search that can answer the question; expand only to close a named evidence gap.
4. Use an explicit fallback when runtime evidence is unavailable or inconclusive: inspect targeted symbols, search, imports, references, tests, configuration, and direct reads. A textual match is not proof of a caller, callee, or owner.
5. Keep an evidence ledger for every material claim: claim, status (`observed`, `inferred`, or `unresolved`), source, location, confidence, and relevance.
6. Stop at sufficiency when traceable evidence answers the question, critical dependencies are checked, gaps are classified, and further reading is unlikely to change the immediate decision. Hand off to the next owner.

## Output contract

- scope;
- entrypoints;
- modules and responsibilities;
- observed boundaries;
- dependency direction;
- ownership signals;
- hotspots;
- evidence gaps;
- source references;

## Does not own

Future architecture, pattern selection, or new boundary design; hand those decisions to Architecture & Engineering.
