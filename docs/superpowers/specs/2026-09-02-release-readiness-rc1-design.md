# Agent Skills Studio — Release Readiness / RC1 Design

## Status
Approved for implementation on 2026-09-02.

## Goal
Prepare Agent Skills Studio for `1.0.0-rc.1` by proving that the existing 49-skill / 10-pack collection behaves coherently as a system, that the four public Beta surfaces remain internally consistent, and that release metadata can be promoted without hiding unresolved readiness gaps.

## Scope freeze
- Keep exactly 49 canonical skills and 10 active packs during this tranche.
- Do not create a new pack or domain in RC1 readiness work.
- Do not promote individual skill maturity merely to make release metrics look better.
- A missing responsibility discovered by the audit is documented as follow-up unless it makes the current collection misleading or unusable.
- `selecting-working-methods` remains a reasoning method, not a deterministic router implemented in application code.

## 1. Skill quality and routing benchmark
Create a versioned routing benchmark that expresses expected ownership for representative requests without hardcoding runtime behavior.

Each scenario records:
- a stable scenario id;
- a realistic user request;
- one primary method, or `null` for a deliberate no-skill case;
- zero or more supporting methods in dependency order;
- methods that are tempting but explicitly excluded when that boundary is important;
- a concise ownership rationale.

The benchmark must:
- reference only canonical catalog slugs;
- cover every one of the 49 skills as a primary method at least once;
- cover every active pack;
- include deliberate no-skill cases;
- include ambiguity cases across important neighboring responsibilities;
- never select the same method as both primary and supporting;
- never use a whole pack as a routing shortcut.

Important overlap families to exercise explicitly:
- brand voice vs conversion copy vs product/UX copy;
- editing vs generated-prose humanization;
- product design vs UI system design vs implementation/fidelity audit;
- application architecture vs software boundaries vs safe refactors;
- engineering planning vs implementation slicing vs handoff vs PR review vs shipping;
- threat modeling vs web review vs API review vs dependency risk;
- test strategy vs integration vs browser E2E vs regression testing vs game-specific testing;
- motion craft vs motion performance vs animation pipeline responsibilities;
- general frontend/browser work vs game-development methods;
- meta method selection vs turning techniques into skills.

CI validates the benchmark as a catalog contract. It does not pretend to execute an LLM or score semantic routing automatically.

## 2. Router contract refinement
Use benchmark findings to refine `selecting-working-methods` only where the current text leaves a demonstrated ambiguity.

The router must continue to:
- select the smallest sufficient method set;
- choose one primary owner;
- add supporting methods only for separate responsibilities;
- order methods by dependency;
- permit `no skill`;
- re-route when evidence changes the task;
- delegate instead of duplicating specialized workflows.

Do not turn the benchmark into a static decision tree inside the skill.

## 3. Beta-surface readiness matrix
The public Roadmap currently names four Beta surfaces: plugin, catalog/packs, cross-platform installers, and bilingual microsite. Add a release-readiness matrix that ties each surface to concrete repository evidence and known limitations.

Minimum evidence:
- **Plugin:** plugin manifest and marketplace manifest validate; version is synchronized; skills-only/web-compatible constraints remain enforced.
- **Catalog & packs:** 49 skills / 10 active packs validate; generated catalog is current; EN/PT-BR metadata remains complete.
- **Installers:** complete collection, individual skill, and pack installation contracts remain covered; Bash and PowerShell CI smoke tests pass; supported runtime-target documentation remains consistent.
- **Microsite:** catalog sync, Vitest, typecheck, lint, production build, localized static routes, and public release/version copy pass on the same candidate tree.

The matrix may record non-blocking warnings, but blockers must remain explicit and prevent an RC-ready claim.

## 4. Release metadata and public state
Only after the benchmark and readiness matrix are GREEN:
- change project version from `1.0.0-beta.1` to `1.0.0-rc.1` in every canonical version owner;
- regenerate deterministic catalog projections rather than hand-editing generated files;
- add an RC1 changelog entry describing the frozen 49-skill / 10-pack system and release gates;
- update public roadmap/release copy so it does not claim a stable `1.0.0` release;
- keep the four product surfaces in Beta unless their public maturity semantics are intentionally changed by a separately proven contract.

RC1 means release candidate, not Stable. `1.0.0` promotion is a later tranche after real-use evidence.

## 5. Verification gate
The final candidate must be verified on one clean HEAD with the canonical workflow restored and no temporary materializer in the diff.

Required evidence:
- root Node test suite GREEN;
- catalog/skill/plugin validation GREEN;
- routing benchmark contracts GREEN;
- deterministic generated catalog current;
- web Vitest GREEN;
- web typecheck GREEN;
- web lint GREEN with zero-warning policy;
- production build GREEN;
- Bash installer smoke GREEN on Ubuntu;
- PowerShell installer smoke GREEN on Windows;
- dependency audit evidence from install step;
- GitGuardian GREEN;
- final diff reviewed for accidental scope expansion.

## Merge policy
Do not merge the RC1 PR without explicit user authorization.
