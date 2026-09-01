---
name: evolving-postgres-schemas-safely
description: Use when changing a PostgreSQL schema that already contains production data or serves live traffic, especially for columns, constraints, indexes, types, backfills, renames, or destructive cleanup.
---

# Evolving PostgreSQL Schemas Safely

## Core principle
Separate compatibility from cleanup. Production schema evolution is safer when additive changes land first, existing data is migrated deliberately, constraints are proven, application traffic switches, and destructive work happens only after the compatibility window closes.

## Expand → migrate → contract
1. Inspect the affected table size, write rate, query traffic, dependencies, and current schema before choosing DDL.
2. Classify each operation by lock, table-rewrite, and compatibility risk. Do not assume a syntactically small `ALTER TABLE` is operationally small.
3. **Expand:** add compatible columns, tables, indexes, or read paths without removing what the running application still needs.
4. **Migrate:** backfill existing rows in bounded, resumable batches when a large update could create long transactions or contention.
5. **Constrain:** add or validate invariants after existing data satisfies them. Prefer staged validation when the chosen PostgreSQL feature supports it.
6. **Switch:** deploy application code that uses the new representation and verify real reads/writes before cleanup.
7. **Contract:** remove legacy columns, constraints, indexes, or compatibility code only when no supported application version depends on them.

## Operational rules
- Use `CREATE INDEX CONCURRENTLY` when production locking risk justifies it and its operational limitations are acceptable; it cannot run inside a transaction block.
- Treat volatile defaults and type changes as potential rewrite work until verified for the PostgreSQL version and data shape in use.
- Make backfills restartable and observable. Record progress outside a single giant transaction.
- If dual-write is required temporarily, define the source of truth and exit condition before enabling it.
- Prefer forward repair over assuming a destructive down migration can safely restore old data.

## Verification
Before declaring the migration complete, verify:
- old and new application versions remain compatible for the intended rollout window;
- constraints hold for existing and new rows;
- backfills are complete and repeatable;
- lock duration and query latency stay within the system's operational budget;
- destructive cleanup has an explicit dependency check.

## References
- PostgreSQL ALTER TABLE: https://www.postgresql.org/docs/current/ddl-alter.html
- PostgreSQL concurrency control: https://www.postgresql.org/docs/current/mvcc.html
- PostgreSQL CREATE INDEX: https://www.postgresql.org/docs/current/sql-createindex.html
