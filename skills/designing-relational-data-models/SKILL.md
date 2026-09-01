---
name: designing-relational-data-models
description: Use when defining or reviewing a relational data model where entities, ownership, cardinality, lifecycle, constraints, or access patterns need explicit decisions before implementation.
---

# Designing Relational Data Models

## Core principle
Model business invariants before tables. A durable relational model makes invalid states difficult to store, keeps relationships explicit, and leaves performance decisions tied to real access patterns rather than guesses.

## Workflow
1. Write down the important entities, stable identities, ownership rules, and lifecycle transitions in domain language.
2. Define relationship cardinality and deletion behavior explicitly. Distinguish ownership from simple association.
3. Choose columns from facts the system must preserve. Prefer normalized relational structure for stable, queryable facts; use JSON only when the shape is genuinely variable or opaque to the database.
4. Encode invariants close to the data with `NOT NULL`, `UNIQUE`, foreign keys, and `CHECK` constraints when PostgreSQL can enforce them safely.
5. List the concrete reads and writes the product must support before choosing indexes. Include filters, joins, ordering, pagination, and expected selectivity.
6. Add the smallest useful indexes for those access patterns. Remember that every index adds write, storage, and maintenance cost.
7. Walk realistic create, update, delete, and concurrency scenarios through the model before implementation.

## Decision rules
- Prefer stable surrogate identifiers when business identifiers can change independently of identity.
- Do not duplicate a fact into several tables without an explicit consistency strategy.
- Do not add nullable columns by default. Null should have a defined domain meaning.
- Do not use denormalization as a substitute for measuring a query problem.
- Composite index order must follow actual predicate and ordering needs; do not treat multicolumn indexes as generic coverage.

## Acceptance checks
- Invalid domain states are rejected by application logic and, where appropriate, database constraints.
- Ownership, cardinality, nullability, and deletion semantics are documented.
- Every proposed index maps to at least one concrete access pattern.
- Common reads can be expressed without ambiguous ownership or hidden synchronization rules.

## References
- PostgreSQL constraints: https://www.postgresql.org/docs/current/ddl-constraints.html
- PostgreSQL indexes: https://www.postgresql.org/docs/current/indexes.html
- PostgreSQL multicolumn indexes: https://www.postgresql.org/docs/current/indexes-multicolumn.html
