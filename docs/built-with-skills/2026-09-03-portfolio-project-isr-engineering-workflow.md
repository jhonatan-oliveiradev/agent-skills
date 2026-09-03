# Portfolio 2025 — project-detail ISR engineering workflow

- Date: 2026-09-03
- Evidence class: `real-use`
- External project: Portfolio 2025
- Source repository: private; direct repository, pull-request, commit, and Actions links are intentionally omitted from this public record
- Active packs represented: `engineering-workflow`
- Methods used:
  - `planning-engineering-work`
  - `managing-implementation-slices`
  - `reviewing-pull-requests`
  - `writing-effective-technical-handoffs`

## Context

A real Portfolio 2025 performance initiative was already split into gates. After the preceding locale-root gate removed a global prerender blocker, Gate C focused only on project-detail data ownership: move PT and EN project details from client-owned request-time loading to server-owned runtime ISR without changing public URLs, redesigning the approved editorial UI, forcing static rendering, introducing a migration, or caching routes whose publication state legitimately depends on live data.

The work was intentionally handled as an engineering workflow rather than one large performance rewrite. The source repository is private, so this record preserves only public-safe decisions and immutable owner-side identifiers.

## Method usage

### `planning-engineering-work`

The implementation plan established the outcome, current rendering boundary, explicit constraints, risks, acceptance criteria, and verification before production code changed. Work was ordered by behavior:

1. add RED contracts and route-table assertions;
2. move project detail ownership to a shared server loader while preserving the visual renderer;
3. enable runtime ISR only after server ownership was established;
4. invalidate localized project caches after successful admin mutations;
5. run final CI, runtime-route assertions, localhost QA, review, and handoff.

The plan also named routes that must remain dynamic instead of treating a static route-table badge as the objective.

### `managing-implementation-slices`

The broader performance initiative was kept in independently reviewable gates. Gate C depended on the earlier locale-root gate and did not absorb unrelated font delivery, dependency upgrades, migrations, SEO redesign, or legitimately dynamic routes.

Inside Gate C, commits followed the dependency chain rather than mixing all concerns at once: test contracts first, server-owned data boundary, runtime ISR, cache invalidation, then verification. The repository stayed in a coherent state at each accepted boundary, and later work did not need to repair a knowingly broken merged slice.

### `reviewing-pull-requests`

Before handoff, the final candidate was reviewed against purpose, scope, behavior, ownership, cache safety, localization, metadata/JSON-LD reuse, mutation invalidation, route assertions, and current CI evidence. The review explicitly checked the highest-risk paths and found no Critical or Important blocker after the verified fixes.

The review also protected scope: Insight details, library routes, digital-product routes, and links remained dynamic for documented reasons instead of being changed merely to improve rendering classification.

### `writing-effective-technical-handoffs`

The final pull-request description served as the continuation artifact for the merge decision. It preserved the exact candidate SHA and CI run identifiers, the route-state change, design rulings, intentionally dynamic follow-ups, QA result, constraints, and the explicit next action: keep the PR unmerged until user authorization.

That handoff let the next step proceed from a verified state without rediscovering why runtime ISR was safe for project details but intentionally not generalized to every public route.

## Verification record

The implementation was verified in the connected private source repository. Immutable identifiers are retained here for owner-side traceability without publishing private links.

### RED

- External PR: `#46`
- RED run: `33762615524`
- Result: `16/19` static-rendering contracts passed
- The only three failures were the new Gate C contracts for server ownership, PT/EN runtime ISR, and mutation invalidation

### Final candidate

- Candidate SHA: `1c01a17a4c23451de3d2c1f27d977a233da61144`
- Static Rendering run: `33763223309` — SUCCESS
- Performance run: `33763223316` — SUCCESS
- SEO run: `33763223267` — SUCCESS
- Validate run: `33763223285` — SUCCESS
- Integrations run: `33763223397` — SUCCESS
- Static-rendering contracts: `19/19`
- Performance contracts: `5/5`
- SEO semantic contracts: `18/18`
- Scoped lint: passed
- TypeScript: passed
- Production build: passed
- Route assertion: passed for PT/EN profile and project-detail routes

### Merge and main verification

- Development merge SHA: `a85721c0bf841be0604a4ba3c960536bd80895c3`
- Main merge PR: `#47`
- Main merge SHA: `3f5f663edac3907e1ac4f855d882acad2875c118`
- Post-merge main Validate run: `33767660536` — SUCCESS

### Runtime/QA result

The verified route table changed both project-detail patterns from request-time dynamic rendering to runtime ISR. Localhost QA on one real project in PT and EN confirmed that the editorial UI remained intact, localized content was present from the server-owned path, and the previous initial client loading state was removed.

This record does not generalize that caching decision to scheduled Insights, library/download flows, digital-product storefront data, or explicitly no-store links. Those routes remained dynamic by documented design.

## Outcome

The case demonstrates full-pack real use of Engineering Workflow on an external project:

- planning converted a risky rendering objective into ordered, verifiable work;
- slice management kept the performance initiative bounded across dependent gates;
- evidence-led review checked the final candidate and protected intentional dynamic behavior;
- the technical handoff preserved enough verified state for an explicit merge decision without rediscovery.

For current post-Stable evidence coverage it adds `engineering-workflow` as the sixth active pack represented by inspectable real-use evidence.

It does **not** rewrite the Stable `1.0.0` readiness snapshot, promote any individual skill maturity, or claim that other uncovered packs have been validated.
