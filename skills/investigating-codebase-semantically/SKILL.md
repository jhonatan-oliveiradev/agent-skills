---
name: investigating-codebase-semantically
description: Use when you need to locate the implementation of a behavior by intent and validate its ownership in code.
---

## Ownership

Find behavior by intent, then validate candidates in code instead of treating a textual match as ownership.

Use the shared [evidence contract](../mapping-existing-codebase-structure/references/evidence-contract.md).

## Workflow

1. Ask one narrow structural question, define its scope, and state the decision it supports.
2. Detect whether an optional code-intelligence runtime is available through callable tools only. Do not install a runtime, do not run `codegraph init`, and do not create `.codegraph/` without explicit authorization.
3. Use the narrowest symbol, relation, or targeted search that can answer the question; expand only to close a named evidence gap.
4. Use an explicit fallback when runtime evidence is unavailable or inconclusive: inspect targeted symbols, search, imports, references, tests, configuration, and direct reads. A textual match is not proof of a caller, callee, or owner.
5. Keep an evidence ledger for every material claim: claim, status (`observed`, `inferred`, or `unresolved`), source, location, confidence, and relevance.
6. Stop at sufficiency when traceable evidence answers the question, critical dependencies are checked, gaps are classified, and further reading is unlikely to change the immediate decision. Hand off to the next owner.

## Output contract

- behavioral question;
- search concepts;
- candidate implementations;
- validation evidence;
- rejected false positives;
- selected owner or unresolved ambiguity;
- source references;

## Does not own

Generic file lookup or unvalidated search results; a textual match can be a false positive and does not establish ownership.
