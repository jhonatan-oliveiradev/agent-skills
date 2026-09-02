# Upstream Mapping

Source: `MengTo/Skills` (snapshot reviewed 2026-08-20). Upstream README reports 123 skills across Codex, game development, media, UI, and web design.

## Import strategy

Legend:
- **Adapted** — core workflow retained conceptually and rewritten for this pack.
- **Merged** — several narrow upstream skills are covered by one broader local skill.
- **Referenced** — authoritative material informs the local method without being mirrored as a skill.
- **Deferred** — useful, but should stay upstream until a project needs the exact technique.
- **Skipped** — too voice-specific, vendor-specific, or unrelated to the current workflow.

## Catalog distribution mapping

This distribution layer does not change any attribution decision recorded
below. Active packs group existing local skills for installation; planned packs
publish roadmap categories without claiming members.

| Pack | Status | Distribution mapping |
|---|---|---|
| Frontend & Product (`frontend-product`) | Active | 8 frontend, product-design, and delivery skills |
| Motion (`motion`) | Active | 5 motion and procedural-3D skills |
| Game Development (`game-development`) | Active | 5 game-development and procedural-3D skills |
| Backend & Data (`backend-data`) | Active | 4 relational-modeling, Node API, PostgreSQL migration, and query-profiling skills |
| Architecture & Engineering (`architecture-engineering`) | Active | 4 architecture-selection, software-boundary, ADR, and safe-refactoring skills |
| Quality & Testing (`quality-testing`) | Active | 4 test-strategy, integration-boundary, web-E2E, and regression-testing skills |
| Application Security (`application-security`) | Active | 4 threat-modeling, web-security, API-security, and dependency-risk skills |
| Engineering Workflow (`engineering-workflow`) | Active | 4 engineering-planning, implementation-slicing, pull-request-review, and technical-handoff skills |

`reconstructing-images-as-threejs` intentionally appears in both Motion and
Game Development. This cross-pack placement clarifies distribution only; its
upstream attribution remains unchanged.

## Codex workflows

| Upstream | Decision | Local destination |
|---|---|---|
| article-prompts-to-skills | Merged | skills/turning-techniques-into-skills |
| audit-reference-originality | Merged | skills/implementing-reference-faithful-ui + skills/auditing-pixel-perfect-frontend |
| audit-verify-explain-grade-5 | Merged | skills/auditing-pixel-perfect-frontend |
| browser-video-recording | Deferred | Load upstream when browser demo video export is needed |
| build-daily-inspiration-sites | Deferred | Reference-research workflow, not needed on every project |
| daily-ui-inspiration-capture | Deferred | Best as a scheduled research workflow |
| elevenlabs-tts | Skipped | Vendor-specific media workflow |
| generate-reference-inspired-brand-worlds | Merged | skills/building-premium-nextjs-interfaces |
| html-to-interaction-prompts | Merged | skills/orchestrating-cinematic-web-motion |
| optimize-web-animations | Adapted | skills/optimizing-frontend-motion-performance |
| performance-profiling | Skipped | Apple-platform-specific |
| stitched-full-page-capture | Merged | skills/auditing-pixel-perfect-frontend |
| video-to-superprompt | Deferred | Useful when video references are supplied |
| web-technique-to-skill | Adapted | skills/turning-techniques-into-skills |
| write-like-meng-on-x | Skipped | Author-specific voice skill |
| x-bookmark-quote-posts | Skipped | X-specific content workflow |

## UI

| Upstream | Decision | Local destination |
|---|---|---|
| design-first-ui-prompting | Adapted | skills/building-premium-nextjs-interfaces + skills/designing-ui-systems |

## Web design families

| Upstream family / examples | Decision | Local destination |
|---|---|---|
| build-awwwards-quality-sites | Adapted | skills/building-premium-nextjs-interfaces |
| landing-page, pricing-page, product-proof-saas | Merged | skills/building-conversion-product-pages |
| tailwindcss, layout systems | Merged | skills/designing-ui-systems + skills/building-premium-nextjs-interfaces |
| gsap, animation-systems, animation-on-scroll | Merged | skills/orchestrating-cinematic-web-motion |
| cinematic-gsap-lenis-motion-system | Adapted | skills/orchestrating-cinematic-web-motion |
| gsap-scrolltrigger-storytelling, cinematic-scroll-storytelling | Merged | skills/orchestrating-cinematic-web-motion |
| marquee-loop, masked-reveal, staggered-word-reveal | Deferred | Narrow techniques; load only when the effect is required |
| scroll-scrubbed-* / scroll-world-storytelling | Deferred | Narrow storytelling patterns |
| threejs, WebGL, shaders, cobejs, globe-gl, Vanta, Unicorn | Deferred | Load upstream per effect; avoid making WebGL a default |
| add-shader-cursor-trail, pointer-trail-emitter, cursor ripples | Deferred | Specialized interaction effects |
| CSS treatments: border gradients, blur, masking, shadows | Deferred | Small techniques should not all be global triggers |
| visual-style skills (dark glass, paper, tech green, etc.) | Deferred | Treat as optional art-direction references, not default taste |
| agency/editorial/framed/image-first layout styles | Merged | skills/building-premium-nextjs-interfaces |

## Game development

Upstream keeps game skills deliberately separate from web design; this pack follows the same boundary.

| Upstream | Decision | Local destination |
|---|---|---|
| build-isometric-arpg | Deferred | Use upstream when assembling a full ARPG vertical slice |
| author-game-levels | Deferred | Use when level-authoring starts |
| build-game-camera-controls | Deferred | Use when camera implementation starts |
| build-threejs-enemy-systems | Deferred | Use for 3D enemy architecture |
| build-game-monster-system | Deferred | Use for rig/socket/collider conformance |
| tune-enemy-ai | Deferred | Use when AI behavior is implemented |
| design-action-combat | Adapted | skills/designing-action-combat |
| design-game-encounters | Deferred | Use when encounter composition starts |
| build-game-inventory | Deferred | Use when inventory/persistence starts |
| build-hybrid-game-assets | Adapted | skills/building-hybrid-game-assets |
| build-vesperfall-review-assets | Skipped | Upstream-specific review workflow |
| create-game-vfx | Deferred | Use when VFX implementation starts |
| build-game-audio-feedback | Deferred | Use when audio feedback starts |
| build-mobile-threejs-games | Deferred | Use if mobile browser target becomes primary |
| optimize-threejs-games | Merged conceptually | skills/testing-playable-games + project-specific profiling |
| test-playable-web-games | Adapted | skills/testing-playable-games |
| ship-web-games | Merged | skills/shipping-github-vercel-changes |

## New skills added for this workflow

### `bootstrapping-modern-web-apps`
Added as the single source of truth for baseline technology choices, project scaffolding, and required formatter/tooling configuration for new web applications.

### `creating-character-sprite-pipelines`
Added for projects that use 2D character model sheets and sprite animation. It explicitly guards against duplicated pseudo-frames, inconsistent stride cycles, weapon drift, foot sliding, and incoherent hair/clothing follow-through.

### `translating-figma-to-nextjs`
Added as a first-class bridge between Figma and the dominant production stack instead of treating design references and implementation as unrelated tasks.

### `shipping-github-vercel-changes`
Consolidates branch, PR, verification, environment, Preview/Production, and deployment-readback practices into a reusable delivery workflow.

### `designing-relational-data-models`
Added as the domain-first relational modeling layer for entity identity, ownership, cardinality, constraints, and access-pattern-led indexing.

### `building-reliable-node-api-boundaries`
Added for Node.js trust boundaries that need explicit parsing, authentication, object/property authorization, mutation scope, retry semantics, and request observability.

### `evolving-postgres-schemas-safely`
Added for compatibility-first PostgreSQL production changes using expand, migrate, constrain, switch, and contract phases rather than destructive one-step migrations.

### `profiling-postgres-query-performance`
Added for evidence-led PostgreSQL query diagnosis using representative inputs and execution plans before changing SQL or indexes.

### `choosing-application-architecture`
Added for architecture selection driven by quality attributes, change boundaries, deployment constraints, and operational capability rather than pattern preference.

### `designing-software-boundaries`
Added for shaping cohesive ownership, state, contracts, and dependency direction without conflating internal structural boundaries with external API trust boundaries.

### `documenting-architecture-decisions`
Added for concise ADRs that preserve context, decision drivers, alternatives, consequences, and explicit review triggers.

### `planning-safe-refactors`
Added for converting broad structural changes into releasable migration slices with seams, regression evidence, rollback paths, and cleanup conditions.

### `designing-test-strategies`
Added for risk-based verification planning that maps important behaviors to the smallest useful test layer instead of treating coverage percentage as the strategy.

### `testing-integration-boundaries`
Added for proving serialization, persistence, protocol, transaction, and failure behavior at real controllable dependency boundaries.

### `testing-web-applications-end-to-end`
Added for critical browser journeys using user-facing interactions plus UI, URL, console, network, state, and visual evidence without making a browser runner a hard dependency.

### `building-regression-tests`
Added for turning reproduced defects into deterministic guards that demonstrate RED before the fix, GREEN after it, and remain at the narrowest layer that proves the broken contract.

### `threat-modeling-applications`
Added for design-time security analysis that maps assets, actors, trust boundaries, abuse cases, controls, verification evidence, and residual risk before implementation or release.

### `reviewing-web-security`
Added for authorized web-application review across access control, sessions, browser-facing controls, input/output boundaries, deployment configuration, cryptography, errors, and security telemetry.

### `reviewing-api-security`
Added for API-specific review of identity, object/property/function authorization, business-flow and resource abuse, SSRF, inventory, configuration, and third-party consumption.

### `auditing-dependency-risk`
Added for contextual software-supply-chain triage using manifests, lockfiles, advisories, runtime reachability, provenance, integrity controls, and the smallest safe remediation.

### `planning-engineering-work`
Added for turning broad engineering objectives into ordered behavioral outcomes with explicit constraints, assumptions, dependencies, risks, and verification evidence before implementation begins.

### `managing-implementation-slices`
Added for keeping implementation in conceptually focused batches that remain independently safe, reviewable, verifiable, and explicit about dependencies and follow-up scope.

### `reviewing-pull-requests`
Added for technical review that evaluates intent, behavior, design, safety, maintainability, and current verification evidence without conflating review with branch or release delivery.

### `writing-effective-technical-handoffs`
Added for preserving verified engineering state, decisions, constraints, hypotheses, evidence, and the exact restart point when work moves between people, agents, or sessions.

## Why the 81 web-design skills were not installed individually

The upstream collection contains many excellent micro-techniques and art-direction presets. Keeping all of them globally installed would create poor skill discovery: several skills could trigger on the same frontend request and push the agent toward visual effects before understanding product intent. The curated pack keeps broad operating procedures global and leaves effect-specific skills as on-demand upstream references.

## External skill research — 2026-08-25

| Source | Decision | Local destination |
|---|---|---|
| `greensock/gsap-skills` | Adapted | `skills/engineering-gsap-animations` |
| `lottiefiles/motion-design-skill` | Referenced, not installed separately | `skills/craft-premium-motion` already covers the tested direction, personality, timing, choreography, layered motion, and reduced-motion behavior |
| `img2threejs/img2threejs` | Adapted as an optional, narrower workflow | `skills/reconstructing-images-as-threejs` |

### `craft-premium-motion`

Added to the versioned library as the direction and technology-routing layer for premium motion systems. It remains library-agnostic and delegates GSAP-specific implementation to `engineering-gsap-animations`.

### `engineering-gsap-animations`

Uses the official GreenSock skills as the technical source for GSAP core, timelines, ScrollTrigger, plugins, React lifecycle, cleanup, performance, and accessibility. The local trigger is intentionally narrower: GSAP must already be selected or clearly required.

### `reconstructing-images-as-threejs`

Adapts the evidence, staged reconstruction, confidence, procedural factory, and review-gate concepts from `img2threejs` without bundling or claiming execution of its Forge toolkit. It is optional and does not replace authored 3D pipelines.

## Backend & Data research — 2026-09-01

| Source | Decision | Local destination |
|---|---|---|
| PostgreSQL official documentation: constraints and indexes | Referenced | `skills/designing-relational-data-models` |
| PostgreSQL official documentation: `ALTER TABLE`, MVCC, and `CREATE INDEX` | Referenced | `skills/evolving-postgres-schemas-safely` |
| PostgreSQL official documentation: `EXPLAIN`, multicolumn indexes, and partial indexes | Referenced | `skills/profiling-postgres-query-performance` |
| Node.js official `AsyncLocalStorage` documentation | Referenced | `skills/building-reliable-node-api-boundaries` |
| OWASP API Security Top 10 — 2023 | Referenced | `skills/building-reliable-node-api-boundaries` |

Backend & Data v1 does not mirror vendor documentation. The local methods combine stable operating procedures around those references and intentionally avoid requiring an ORM, hosted PostgreSQL provider, or framework-specific API layer.

## Architecture & Engineering research — 2026-09-01

| Source | Decision | Local destination |
|---|---|---|
| SEI guidance on software architecture quality attributes | Referenced | `skills/choosing-application-architecture` |
| Microsoft architectural principles | Referenced | `skills/choosing-application-architecture` + `skills/designing-software-boundaries` |
| AWS guidance on cohesion and coupling | Referenced | `skills/designing-software-boundaries` |
| AWS architectural decision record process | Referenced | `skills/documenting-architecture-decisions` + `skills/choosing-application-architecture` |
| Martin Fowler, Branch by Abstraction | Referenced | `skills/planning-safe-refactors` |
| Martin Fowler, Strangler Fig modernization | Referenced | `skills/planning-safe-refactors` |

Architecture & Engineering v1 does not mirror those sources or require a graph-analysis runtime. The local methods combine stable decision and migration procedures while remaining usable with the agent's native repository tools.

## Quality & Testing research — 2026-09-01

| Source | Decision | Local destination |
|---|---|---|
| Google Testing Blog, How Much Testing is Enough? | Referenced | `skills/designing-test-strategies` + `skills/testing-web-applications-end-to-end` |
| Google Testing Blog, Test Sizes | Referenced | `skills/testing-integration-boundaries` |
| Google Testing Blog, Just Say No to More End-to-End Tests | Referenced | `skills/testing-web-applications-end-to-end` |
| Microsoft Azure Well-Architected testing strategies | Referenced | `skills/designing-test-strategies` |
| Martin Fowler, Test Pyramid + Practical Test Pyramid | Referenced | `skills/designing-test-strategies` + `skills/testing-integration-boundaries` |
| Playwright Best Practices | Referenced | `skills/testing-web-applications-end-to-end` |
| Martin Fowler, Self Testing Code + testing culture | Referenced | `skills/building-regression-tests` |
| Google Testing Blog, flaky test guidance | Referenced | `skills/building-regression-tests` |

Quality & Testing v1 does not mirror a test framework or mandate a runner. The local methods define verification strategy and evidence boundaries while remaining usable with the testing tools already present in a project.

## Application Security research — 2026-09-01

| Source | Decision | Local destination |
|---|---|---|
| OWASP Threat Modeling guidance | Referenced | `skills/threat-modeling-applications` |
| OWASP Application Security Verification Standard 5.0.0 | Referenced | `skills/threat-modeling-applications` + `skills/reviewing-web-security` + `skills/reviewing-api-security` |
| OWASP Top 10:2025 | Referenced | `skills/threat-modeling-applications` + `skills/reviewing-web-security` + `skills/auditing-dependency-risk` |
| OWASP Web Security Testing Guide | Referenced | `skills/reviewing-web-security` |
| OWASP API Security Top 10:2023 | Referenced | `skills/reviewing-api-security` |
| OWASP Software Supply Chain Security Cheat Sheet | Referenced | `skills/auditing-dependency-risk` |

Application Security v1 does not mirror OWASP checklists or require a security scanner. The local methods turn those references into scoped operating procedures that require authorization, application context, reproducible evidence, realistic impact, remediation guidance, and verification.

## Engineering Workflow research — 2026-09-01

| Source | Decision | Local destination |
|---|---|---|
| DORA, Working in small batches | Referenced | `skills/planning-engineering-work` + `skills/managing-implementation-slices` |
| Google Engineering Practices, Small CLs | Referenced | `skills/planning-engineering-work` + `skills/managing-implementation-slices` + `skills/writing-effective-technical-handoffs` |
| Google Engineering Practices, What to look for in a code review | Referenced | `skills/reviewing-pull-requests` |
| Google Engineering Practices, The Standard of Code Review | Referenced | `skills/reviewing-pull-requests` |
| Google Engineering Practices, Writing good CL descriptions | Referenced | `skills/writing-effective-technical-handoffs` |
| GitHub pull-request review and reviewer-context documentation | Referenced | `skills/reviewing-pull-requests` + `skills/writing-effective-technical-handoffs` |
| GitHub stacked pull request guidance | Referenced | `skills/managing-implementation-slices` |

Engineering Workflow v1 does not require GitHub, a project-management system, or a specific agent runtime. The local methods turn stable small-batch, review, and continuity practices into tool-agnostic operating procedures while `shipping-github-vercel-changes` remains the separate delivery method for repository and deployment execution.
