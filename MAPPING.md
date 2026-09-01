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
| Architecture & Engineering (`architecture-engineering`) | Planned | No members until the category is implemented |
| Quality & Testing (`quality-testing`) | Planned | No members until the category is implemented |

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
