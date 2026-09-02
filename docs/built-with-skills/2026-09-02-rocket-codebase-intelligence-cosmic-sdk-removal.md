# Rocket UNESP — Codebase Intelligence / Cosmic SDK removal

Date: 2026-09-02
Evidence class: real-use
Project: Rocket UNESP
External repository visibility: private

## Challenge

After the Rocket content platform moved to Payload, the repository still contained several references to Cosmic. A broad cleanup such as “remove Cosmic” would have been unsafe because historical migration tooling still intentionally reads legacy Cosmic content. The real task was to determine which Cosmic surfaces were still operationally required, which were only compatibility paths, and whether the deprecated `cosmicjs` SDK could be removed without changing the public runtime, local fallbacks, migration semantics, database state, or UI.

## Methods used

- `mapping-existing-codebase-structure` — mapped the public Home and Publications loaders, Payload ownership, fallback paths, migration tooling, package entrypoints, and the isolated legacy Cosmic writer.
- `investigating-codebase-semantically` — tested the hypothesis that repository-wide Cosmic references implied a live SDK dependency and rejected migration/configuration false positives.
- `tracing-code-execution-paths` — traced public reads through Payload and local fallbacks, then separated that runtime path from the historical migration path and obsolete write path.
- `analyzing-change-blast-radius` — bounded direct impact to the SDK dependency, `populate` npm entrypoint, lockfile records, and `src/cosmic/populate-blog-section.ts`.
- `planning-codebase-changes-with-evidence` — converted the observed graph into a RED→GREEN cleanup plan with explicit protected surfaces and verification gates.

Together these methods cover the complete active Codebase Intelligence pack.

## Capability detection

No CodeGraph or other code-intelligence runtime was exposed as a callable tool in the execution environment. Per the shipped Codebase Intelligence contract, no runtime was installed, initialized, or indexed automatically. The investigation used the verified repository-inspection fallback: targeted search, import/reference inspection, direct owner reads, configuration checks, tests, and CI evidence with progressive context expansion.

## Decisions

### Map runtime ownership before deleting legacy references

The public Home path resolves through `getPayloadRuntime()` and `payload.findGlobal("home")`, with a local JSON fallback when Payload is unavailable. Publications similarly resolve through Payload and a local fallback. Neither public loader imports the Cosmic SDK or depends on Cosmic environment variables.

That evidence ruled out a runtime dependency on `cosmicjs` before any removal was attempted.

### Separate historical compatibility from the deprecated SDK

The Payload content migration still intentionally supports Cosmic as a historical source. It uses native `fetch()` against the Cosmic API and legacy parsers; it does not import `cosmicjs`.

Repository hits in migration code and `cdn.cosmicjs.com` image configuration were therefore rejected as evidence that the SDK itself was still required. Migration compatibility and the CDN allowlist were explicitly kept outside the cleanup blast radius.

### Bound the cleanup to one obsolete write path

The only observed direct `cosmicjs` import was the legacy `src/cosmic/populate-blog-section.ts` writer, reached through the `populate` npm script and using a Cosmic write key. The resulting implementation removed only:

- dependency `cosmicjs`;
- npm script `populate`;
- `src/cosmic/populate-blog-section.ts`;
- now-unreachable lockfile records.

A regression contract was added to prove that the writer/SDK are absent while the native-fetch migration and Payload/fallback runtime boundaries remain intact.

### Prove RED before cleanup and regenerate derived state mechanically

The new regression contract was run before implementation and failed exactly because `cosmicjs` still existed at `^5.0.5`. The dependency install also reported that version as deprecated.

After the minimum source removal, `package-lock.json` was regenerated through npm instead of hand-editing generated dependency state. A temporary materializer existed only long enough to produce and verify the lockfile and was removed before canonical final CI.

## Results

- The deprecated `cosmicjs` SDK and obsolete Cosmic write-only population path were removed.
- Historical Cosmic-to-Payload migration compatibility remains available through native `fetch()`.
- Public Home and Publications remain Payload-first and retain their local fallbacks.
- No Payload schema, migration semantics, database state, public runtime loader, CDN allowlist, or visual/UI implementation changed.
- The package lock no longer contains `node_modules/cosmicjs`.
- The final Rocket branch passed dependency install, generated Payload type drift verification, the full test suite, lint, typecheck, and production build.
- During CI, the configured Postgres endpoint was unavailable and the production build still completed through the existing local fallback behavior, independently confirming that the cleanup preserved the resilience path identified during investigation.

## Verification record

The external Rocket repository is private, so this public record intentionally does not publish private repository, PR, commit, or Actions URLs. The identifiers below allow the project owner to audit the original evidence without exposing private links.

### External implementation identifiers

- Product PR: `#74` — `chore: remove obsolete Cosmic SDK write path`
- Baseline main commit: `2ede01c69d1277353e17b15864008f5f38ddeef6`
- Verified code candidate: `9eb488e167f47cc6c1d03baded29a0625be69d2c`
- Final evidence HEAD: `5a03dd06e4591b2dd385df0793b699fb400b127b`

### TDD and verification workflows

- `33682881491` — canonical RED; reached `npm test` and failed exactly because `cosmicjs` still existed as `^5.0.5` after Payload type generation/drift verification.
- `33683223268` — lockfile materialization; npm regenerated dependency state and an explicit guard verified that `node_modules/cosmicjs` was absent.
- `33683313097` — GREEN on the verified code candidate; dependency install, Payload type drift, full tests, lint, typecheck, and production build passed.
- `33683632870` — same-tree GREEN on the final evidence HEAD after documentation was finalized; all canonical Rocket CI gates passed.

### Codebase Intelligence evidence demonstrated by this case

- `mapping-existing-codebase-structure` — identified the actual public/runtime, migration, and legacy-writer ownership boundaries.
- `investigating-codebase-semantically` — disproved the misleading hypothesis that all Cosmic references represented one live dependency.
- `tracing-code-execution-paths` — verified Payload-first public reads and retained fallback/migration paths.
- `analyzing-change-blast-radius` — reduced a broad platform cleanup to a small dependency/tooling slice.
- `planning-codebase-changes-with-evidence` — produced the protected-surface plan, regression contract, and verification sequence used by the implementation.

This case validates the complete `codebase-intelligence` pack in real project work. It satisfies the RC2 pack-level real-use gate; promotion from RC2 to Stable remains a separate release decision.
