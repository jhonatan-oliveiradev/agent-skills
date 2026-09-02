# Rocket UNESP — editorial error boundary end-to-end consumption

Date: 2026-09-02
Evidence class: real-use
Project: Rocket UNESP
External repository visibility: private

## Challenge

The public Rocket frontend already had an editorial loading experience and a styled global not-found state, but its `(frontend)` App Router segment had no recoverable `error.tsx` boundary. The real-use task was to add that boundary while consuming Agent Skills Studio through its public distribution surfaces rather than copying a method into the project by hand.

## Methods used

- `building-premium-nextjs-interfaces` — primary interface owner for the error-state composition, accessibility, existing visual language, recovery action, and production verification.
- `writing-product-and-ux-copy` — installed directly through the ChatGPT Skills UI and then used to review the real boundary copy and recovery semantics.

These methods represent two active packs in this case: Frontend & Product and Writing & Communication. Across all three recorded real-use cases, the observed union is four active packs: Frontend & Product, Writing & Communication, Quality & Testing, and Application Security.

## Decisions

### Consume the Studio before implementation

The Rocket CI temporarily exercised the release candidate as a consumer. It requested the public PT-BR microsite, requested the catalog detail route for `building-premium-nextjs-interfaces`, cloned tag `v1.0.0-rc.1`, and ran the real installer for a project-scoped Claude Code skill. The temporary consumption step was removed afterward so Rocket CI would not permanently depend on Studio availability.

### Treat direct ChatGPT Skill upload as real ChatGPT distribution

The current ChatGPT UI exposed direct Skill upload but not GitHub marketplace import in the available personal surface. The canonical `writing-product-and-ux-copy` skill from `v1.0.0-rc.1` was packaged with `SKILL.md` at the archive root and uploaded through **Habilidades → + → Enviar do computador**. User-provided UI verification showed `Habilidade carregada` and the newly added `writing product and ux copy` entry under **Instalados**.

This is recorded as `chatgpt-distribution` evidence. Marketplace plugin import remains a supported alternative distribution mode, but it is not falsely claimed as the mode validated by this case.

### Let the installed Skill change the product

The newly installed UX-copy method was applied to the actual Rocket error boundary. It identified that a decorative `500` invented a transport status that an App Router error boundary cannot guarantee, and that phrases such as `experiência interrompida` described implementation state more vaguely than necessary. A second RED→GREEN cycle changed the user-facing state to say that the page could not be loaded, kept an explicit retry action, preserved a home fallback, and removed the unsupported `500` assertion.

### Keep the final product diff isolated

The final Rocket PR contained only the error boundary, its contract test, and the package test command update required to run that contract. No migration, schema change, database mutation, environment change, or persistent CI dependency on Agent Skills Studio remained.

## Results

- A recoverable editorial `error.tsx` now exists for the public Rocket frontend.
- The boundary provides `reset()` retry and a home fallback without exposing error message, stack, or serialized technical details.
- The final copy no longer invents an HTTP `500` state.
- Microsite, catalog, installer, and ChatGPT direct Skill distribution were all exercised in real use.
- The ChatGPT-installed method materially changed the merged product implementation rather than serving as upload-only evidence.
- Rocket `main` passed tests, lint, typecheck, and production build after the merge.

## Verification record

The external Rocket repository is private, so this public record intentionally does not publish private repository, PR, commit, or Actions URLs. The identifiers below allow the project owner to audit the original evidence without exposing private links.

### External implementation identifiers

- Product PR: `#73` — `feat: add recoverable editorial frontend error boundary`
- Final feature HEAD: `bc4c00b762f3ef6d50810e264cd024a5f480e8c1`
- Main merge commit: `2ede01c69d1277353e17b15864008f5f38ddeef6`

### TDD and consumption workflows

- `33644544165` — initial RED: Studio consumption passed; error-boundary contract failed because `error.tsx` did not exist.
- `33644878032` — GREEN with real microsite, catalog, and installer consumption; tests, lint, typecheck, and build passed.
- `33645174689` — canonical product verification after restoring the original Rocket CI; tests, lint, typecheck, and build passed.
- `33650766426` — UX-copy RED after the direct ChatGPT Skill review; failed on the old wording/status assumptions.
- `33650946640` — UX-copy GREEN on final feature HEAD; tests, lint, typecheck, and build passed.
- `33651602279` — post-merge `main` verification on merge commit `2ede01c69d1277353e17b15864008f5f38ddeef6`; dependency install, Payload type generation/diff gate, tests, lint, typecheck, and build all passed.

### ChatGPT distribution verification

On 2026-09-02, the user supplied screenshots showing:

1. the canonical `writing-product-and-ux-copy-v1.0.0-rc.1.zip` accepted by the ChatGPT Skill upload UI with `Habilidade carregada`;
2. `writing product and ux copy` visible under **Instalados** after upload;
3. the skill was new to the account before this case and was subsequently used to review the Rocket error boundary.

### Stable-readiness surfaces demonstrated by this case

- `microsite` — real HTTP consumption in workflow `33644878032`.
- `catalog` — real skill discovery/detail consumption in workflow `33644878032`.
- `installers` — real project-scoped `install.sh` execution in workflow `33644878032`.
- `chatgpt-distribution` — real direct Skill upload, installed-state verification, and subsequent use against the Rocket product task.
