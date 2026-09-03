# STRATA — Contracts architecture boundaries

- Date: 2026-09-03
- Evidence class: `real-use`
- External project: STRATA
- Source repository: private; direct repository, pull-request, commit, and Actions links are intentionally omitted from this public record
- Active packs represented: `architecture-engineering`
- Methods used:
  - `choosing-application-architecture`
  - `designing-software-boundaries`
  - `documenting-architecture-decisions`
  - `planning-safe-refactors`

## Context

A real STRATA Contracts v1 implementation had reached an internal-UX slice inside an existing Next.js + Prisma modular monolith. The work already had tenant-scoped repositories, lifecycle policies, read models, and a later replacement flow planned. During review, the Architecture & Engineering pack was used to decide whether the current shape still matched the product forces, locate two concrete ownership problems, and define a bounded follow-up that repaired those boundaries without inventing a new service layer or prematurely generalizing transaction retry behavior.

The source repository is private, so this public record retains only sanitized architecture decisions and immutable owner-side identifiers.

## Method usage

### `choosing-application-architecture`

The review tested the existing architecture against the actual forces instead of treating distribution as progress. Contracts needed authenticated tenant isolation, clear lifecycle ownership, transactional aggregate operations, and one-actionable-contract invariants, but there was no independent scaling, ownership, deployment, or availability requirement that justified a separate network service.

The decision was therefore to keep Contracts inside the existing modular Next.js + Prisma monolith and improve internal boundaries rather than introduce a deployable service. A future split remains a review trigger only if operational or organizational forces materially change.

### `designing-software-boundaries`

The read-model feature was importing repository-owned Prisma-derived record types. That inverted the intended dependency direction: a pure feature projection knew about a server persistence implementation.

The follow-up moved the narrow source contracts into the feature/read-model boundary. The repository keeps its Prisma selects private and returns values satisfying those feature-owned contracts. This means persistence details can change without teaching the read model about repository implementation types.

The same method identified lifecycle-rule duplication: presentation locally encoded that only `FINALIZED` and `SENT` contracts were replaceable even though legal lifecycle semantics belong to the Contracts domain. Replacement eligibility was moved to the canonical domain status policy, and presentation now delegates to that rule.

### `documenting-architecture-decisions`

The review captured the decision in a compact architecture record before implementation:

- context: multiple Contracts operations share tenant and one-actionable invariants;
- drivers: clear ownership, lifecycle consistency, bounded Slice 2 scope, and conflict safety;
- rejected options: repository-owned feature contracts, duplicated lifecycle legality, a generic transaction framework, and a separate network service;
- decision: feature-owned read contracts, domain-owned replacement legality, retain the modular monolith, and share retry semantics only when a second concrete operation requires them;
- consequences: lower coupling and policy drift with a small local refactor;
- review trigger: revisit distribution or retry abstraction only when real operational duplication appears.

That record was published as a review on the live external change before the follow-up refactor was created.

### `planning-safe-refactors`

The corrective work was deliberately smaller than the surrounding Contracts slice. It did not add UI, migrations, a replacement service, package changes, or a generic retry abstraction.

The refactor started with two RED contracts: one proving the read model must not import the server repository and one requiring replacement eligibility to exist in the domain policy. The implementation then changed only the ownership direction and rule delegation needed to make those contracts pass.

A proposed shared retry policy was intentionally deferred. At review time only the existing generation service had concrete retry behavior; extracting a framework before the replacement operation existed would have been speculative abstraction rather than a safe refactor.

## Verification record

The architecture review and implementation were verified in the connected private STRATA repository. Immutable identifiers are retained here for owner-side traceability without publishing private links.

### Review and external implementation

- Reviewed external PR: `#53`
- Architecture review submission: `5104632965`
- Bounded follow-up PR: `#57`

### RED

- RED run: `33786061326`
- Result: `374/376` tests passed
- Exactly two tests failed:
  - the Contracts read model still depended on the server repository;
  - canonical domain replacement eligibility did not yet exist.

### Final candidate

- Candidate SHA: `ac19145bb3cbbac5f646528180dd4e33f59feb4a`
- Final PR run: `33787668878` — SUCCESS
- Prisma validate: passed
- Vitest: `93/93` files, `376/376` tests passed
- TypeScript: passed
- ESLint: passed under the existing baseline
- changed-file Prettier check: passed
- production high+ dependency audit: passed under the repository policy

### Merge and main verification

- Merge SHA: `a7e3dcc90f1e651e720e38ec27778a953771b24f`
- Post-merge main run: `33792936907` — SUCCESS
- Prisma validate, tests, typecheck, lint, format check, and dependency audit all passed on the merged main commit.

## Outcome

The case demonstrates full-pack real use of Architecture & Engineering on an external product:

- architecture selection preserved the least-distributed shape justified by real forces;
- boundary design reversed an implementation dependency and centralized lifecycle legality;
- architecture decisions were recorded with context, rejected options, consequences, and review triggers;
- the safe-refactor plan delivered the smallest verified correction and explicitly deferred speculative retry abstraction.

For current post-Stable evidence coverage it adds `architecture-engineering` as the seventh active pack represented by inspectable real-use evidence.

It does **not** rewrite the Stable `1.0.0` readiness snapshot, promote any individual skill maturity, or claim that Backend & Data, Design & Brand, Game Development, or Motion have been validated by this case.
