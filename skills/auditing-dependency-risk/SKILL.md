---
name: auditing-dependency-risk
description: Use when a project needs software-supply-chain or third-party dependency risk assessed from manifests, lockfiles, advisories, provenance, maintenance signals, and realistic runtime exposure before upgrades or release.
---

# Auditing Dependency Risk

## Core principle
A dependency alert is evidence to investigate, not a complete risk decision. Prioritize by what is actually installed, reachable, privileged, exposed, and fixable in this application.

## Scope rule
Audit only the project's authorized dependency graph, build chain, repositories, registries, and CI configuration. Prefer lockfile/SBOM evidence and the package ecosystem's established audit tooling. Do not execute untrusted package scripts merely to inspect a dependency.

## Workflow
1. Identify the dependency sources of truth: manifests, lockfiles, workspace configuration, containers/base images where relevant, generated SBOMs, package registries, and CI install commands.
2. Separate direct, transitive, development, build-time, and runtime dependencies. Record where each high-risk component is used rather than treating the entire graph as equally exposed.
3. Run the ecosystem's existing audit/advisory tooling when available and capture exact package, installed version, advisory/CVE, affected range, fixed range, and dependency path.
4. Triage each material advisory by:
   - exploit preconditions and vulnerable feature/path;
   - runtime versus development/build exposure;
   - data/privilege/network access available to the component;
   - whether untrusted input can reach the vulnerable behavior;
   - known fix or mitigation availability.
5. Review provenance and integrity controls: lockfile enforcement, immutable/pinned CI installs, registry configuration, package name/source ambiguity, checksum/signature/provenance support, and unexpected install scripts.
6. Review dependency hygiene without equating age with vulnerability. Flag abandoned or opaque components when lack of maintenance materially increases future response risk.
7. Choose the smallest safe remediation: patch/minor upgrade, dependency override, vulnerable feature removal, configuration mitigation, replacement, or temporary documented acceptance. Avoid blind major-version upgrades.
8. Verify after remediation by regenerating the dependency graph/audit output and running the affected application's tests/build/security checks.
9. Record residual risk and a re-check trigger for accepted findings, especially when no fixed version exists.

## Finding format
For each material dependency risk, capture:
- package and resolved version;
- direct/transitive path and usage context;
- advisory/source;
- vulnerable behavior and reachability evidence;
- application impact and privileges;
- fix/mitigation options and compatibility risk;
- verification evidence;
- residual risk and owner.

## Quality checks
Do not:
- equate CVSS alone with application risk;
- mark a dependency safe only because it is transitive or dev-only;
- upgrade broad portions of the graph without proving necessity;
- suppress advisories without documenting reachability and residual risk;
- treat a clean vulnerability scan as proof that the supply chain is trustworthy.

## Verification
After the chosen remediation, confirm the vulnerable resolved version/path is gone or mitigated, the lockfile is deterministic, and the application's relevant tests/build still pass. Keep evidence of any intentionally accepted risk.

## References
- OWASP Top 10:2025, A03 Software Supply Chain Failures: https://owasp.org/Top10/2025/
- OWASP Software Supply Chain Security Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Software_Supply_Chain_Security_Cheat_Sheet.html
- OWASP Application Security Verification Standard 5.0.0: https://owasp.org/www-project-application-security-verification-standard/
