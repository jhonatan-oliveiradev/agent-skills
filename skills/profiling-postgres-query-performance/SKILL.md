---
name: profiling-postgres-query-performance
description: Use when a PostgreSQL query is slow, resource-heavy, regressed, or has uncertain index behavior and the cause needs to be measured before changing SQL, schema, or indexes.
---

# Profiling PostgreSQL Query Performance

## Core principle
Measure the plan before prescribing an index. Query tuning should start from representative parameters and execution evidence, then change one access-pattern decision at a time and measure again.

## Diagnostic loop
1. Capture the exact query shape, representative bind values, expected result size, and relevant table cardinalities.
2. Reproduce against data that resembles the problematic distribution. A fast empty fixture does not explain production behavior.
3. Start with `EXPLAIN`. Use `EXPLAIN ANALYZE` only when executing the statement is safe; add `BUFFERS` when I/O evidence is useful.
4. Compare estimated and actual rows. Large mismatches can indicate stale statistics, skewed data, or predicates the planner estimates poorly.
5. Find the dominant work: sequential scans, repeated nested-loop work, large sorts, spills, excessive rows removed by filters, or expensive joins.
6. Form one hypothesis. Change the query, access pattern, statistics, or one index design that directly addresses the measured cause.
7. Run the same evidence capture again and compare latency, rows, buffers, and plan shape.

## Index rules
- Add an index for a demonstrated predicate, join, or ordering need, not because a column looks important.
- For B-tree multicolumn indexes, leading columns strongly influence usefulness; choose order from actual filters and sort requirements.
- Consider partial indexes when a stable predicate isolates the subset queries repeatedly need.
- Account for write amplification, storage, vacuum/maintenance cost, and duplicate index coverage.

## Application boundary
A database plan can be healthy while the request is slow. Also check excessive round trips, N+1 access, repeated identical queries, oversized result sets, and pagination strategy before concluding the database needs another index.

## Acceptance checks
- The before/after comparison uses equivalent representative inputs.
- The claimed bottleneck appears in plan or application evidence.
- The improvement is measurable and does not rely on a single lucky cache state.
- New indexes have a named access pattern and no obvious redundant equivalent.

## References
- PostgreSQL EXPLAIN: https://www.postgresql.org/docs/current/sql-explain.html
- PostgreSQL indexes: https://www.postgresql.org/docs/current/indexes.html
- PostgreSQL partial indexes: https://www.postgresql.org/docs/current/indexes-partial.html
