# Agent Skills Studio — Real-Use Evidence v1 Design

## Status
Approved for implementation on 2026-09-02.

## Goal
Establish a verifiable evidence contract between `1.0.0-rc.1` and Stable `1.0.0` without adding new skills, packs, or release features.

## Scope freeze
- Keep project version at `1.0.0-rc.1` throughout this tranche.
- Keep exactly 49 canonical skills and 10 active packs.
- Do not promote the four public Beta surfaces to Stable in this tranche.
- Do not invent external usage. Evidence must point to inspectable records.
- Existing Built with Skills cases remain published historical records, but they must be explicitly classified as internal/self-hosted evidence and must not count toward Stable real-use thresholds.

## 1. Evidence classes
Every Built with Skills case must declare one of two classes:
- `internal`: work performed on Agent Skills Studio itself. Useful as implementation proof, but excluded from Stable real-use counts.
- `real-use`: work performed in a distinct project using one or more canonical skills. Eligible for Stable real-use counts only when the case includes inspectable project evidence.

Every case must expose a project identity with:
- stable project id;
- human-readable project name;
- optional public repository URL.

A `real-use` case must include at least one evidence item whose type is `pull-request`, `commit`, or `qa`; a source record alone is not sufficient.

## 2. Stable promotion policy
Create `release/stable-readiness.json` as the machine-readable policy for Stable promotion.

The policy must target `1.0.0` from candidate `1.0.0-rc.1` and require at minimum:
- 3 real-use cases;
- 2 distinct projects;
- 3 active packs represented by the skills used in real-use cases;
- real-use evidence for each of the four public Beta surfaces: plugin, catalog, installers, microsite.

The file records the policy and current evidence links; it does not claim Stable eligibility while evidence is incomplete.

## 3. Public evidence semantics
The Built with Skills archive and detail view must make the evidence class visible in EN and PT-BR.

Required labels:
- internal: `Internal evidence` / `Evidência interna`;
- real-use: `Real-use evidence` / `Evidência de uso real`.

Existing cases must identify Agent Skills Studio as their project and render as internal evidence.

## 4. Verification contract
Add tests that prove:
- existing cases are explicitly internal;
- every case has project identity;
- a real-use case cannot be represented by source-only evidence;
- Stable readiness policy has the exact thresholds above;
- Stable readiness covers plugin, catalog, installers, and microsite;
- current status is `collecting-evidence`, not Stable-ready;
- public archive/detail rendering exposes the evidence-class label in both locales.

The final branch must pass the canonical root and web gates on one clean HEAD.

## Merge policy
Do not merge this PR without explicit user authorization.
