# Upstream Mapping

Source: `MengTo/Skills` (snapshot reviewed 2026-08-20). Upstream README reports 123 skills across Codex, game development, media, UI, and web design.

## Import strategy

Legend:
- **Adapted** — core workflow retained conceptually and rewritten for this pack.
- **Merged** — several narrow upstream skills are covered by one broader local skill.
- **Deferred** — useful, but should stay upstream until a project needs the exact technique.
- **Skipped** — too voice-specific, vendor-specific, or unrelated to the current workflow.

## Codex workflows

| Upstream | Decision | Local destination |
|---|---|---|
| article-prompts-to-skills | Merged | turning-techniques-into-skills |
| audit-reference-originality | Merged | implementing-reference-faithful-ui + auditing-pixel-perfect-frontend |
| audit-verify-explain-grade-5 | Merged | auditing-pixel-perfect-frontend |
| browser-video-recording | Deferred | Load upstream when browser demo video export is needed |
| build-daily-inspiration-sites | Deferred | Reference-research workflow, not needed on every project |
| daily-ui-inspiration-capture | Deferred | Best as a scheduled research workflow |
| elevenlabs-tts | Skipped | Vendor-specific media workflow |
| generate-reference-inspired-brand-worlds | Merged | building-premium-nextjs-interfaces |
| html-to-interaction-prompts | Merged | orchestrating-cinematic-web-motion |
| optimize-web-animations | Adapted | optimizing-frontend-motion-performance |
| performance-profiling | Skipped | Apple-platform-specific |
| stitched-full-page-capture | Merged | auditing-pixel-perfect-frontend |
| video-to-superprompt | Deferred | Useful when video references are supplied |
| web-technique-to-skill | Adapted | turning-techniques-into-skills |
| write-like-meng-on-x | Skipped | Author-specific voice skill |
| x-bookmark-quote-posts | Skipped | X-specific content workflow |

## UI

| Upstream | Decision | Local destination |
|---|---|---|
| design-first-ui-prompting | Adapted | building-premium-nextjs-interfaces + designing-ui-systems |

## Web design families

| Upstream family / examples | Decision | Local destination |
|---|---|---|
| build-awwwards-quality-sites | Adapted | building-premium-nextjs-interfaces |
| landing-page, pricing-page, product-proof-saas | Merged | building-conversion-product-pages |
| tailwindcss, layout systems | Merged | designing-ui-systems + building-premium-nextjs-interfaces |
| gsap, animation-systems, animation-on-scroll | Merged | orchestrating-cinematic-web-motion |
| cinematic-gsap-lenis-motion-system | Adapted | orchestrating-cinematic-web-motion |
| gsap-scrolltrigger-storytelling, cinematic-scroll-storytelling | Merged | orchestrating-cinematic-web-motion |
| marquee-loop, masked-reveal, staggered-word-reveal | Deferred | Narrow techniques; load only when the effect is required |
| scroll-scrubbed-* / scroll-world-storytelling | Deferred | Narrow storytelling patterns |
| threejs, WebGL, shaders, cobejs, globe-gl, Vanta, Unicorn | Deferred | Load upstream per effect; avoid making WebGL a default |
| add-shader-cursor-trail, pointer-trail-emitter, cursor ripples | Deferred | Specialized interaction effects |
| CSS treatments: border gradients, blur, masking, shadows | Deferred | Small techniques should not all be global triggers |
| visual-style skills (dark glass, paper, tech green, etc.) | Deferred | Treat as optional art-direction references, not default taste |
| agency/editorial/framed/image-first layout styles | Merged | building-premium-nextjs-interfaces |

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
| design-action-combat | Adapted | designing-action-combat |
| design-game-encounters | Deferred | Use when encounter composition starts |
| build-game-inventory | Deferred | Use when inventory/persistence starts |
| build-hybrid-game-assets | Adapted | building-hybrid-game-assets |
| build-vesperfall-review-assets | Skipped | Upstream-specific review workflow |
| create-game-vfx | Deferred | Use when VFX implementation starts |
| build-game-audio-feedback | Deferred | Use when audio feedback starts |
| build-mobile-threejs-games | Deferred | Use if mobile browser target becomes primary |
| optimize-threejs-games | Merged conceptually | testing-playable-games + project-specific profiling |
| test-playable-web-games | Adapted | testing-playable-games |
| ship-web-games | Merged | shipping-github-vercel-changes |

## New skills added for this workflow

### `bootstrapping-modern-web-apps`
Added as the single source of truth for baseline technology choices, project scaffolding, and required formatter/tooling configuration for new web applications.

### `creating-character-sprite-pipelines`
Added for projects that use 2D character model sheets and sprite animation. It explicitly guards against duplicated pseudo-frames, inconsistent stride cycles, weapon drift, foot sliding, and incoherent hair/clothing follow-through.

### `translating-figma-to-nextjs`
Added as a first-class bridge between Figma and the dominant production stack instead of treating design references and implementation as unrelated tasks.

### `shipping-github-vercel-changes`
Consolidates branch, PR, verification, environment, Preview/Production, and deployment-readback practices into a reusable delivery workflow.

## Why the 81 web-design skills were not installed individually

The upstream collection contains many excellent micro-techniques and art-direction presets. Keeping all of them globally installed would create poor skill discovery: several skills could trigger on the same frontend request and push the agent toward visual effects before understanding product intent. The curated pack keeps broad operating procedures global and leaves effect-specific skills as on-demand upstream references.

## External skill research — 2026-08-25

| Source | Decision | Local destination |
|---|---|---|
| `greensock/gsap-skills` | Adapted | `engineering-gsap-animations` |
| `lottiefiles/motion-design-skill` | Referenced, not installed separately | `craft-premium-motion` already covers the tested direction, personality, timing, choreography, layered motion, and reduced-motion behavior |
| `img2threejs/img2threejs` | Adapted as an optional, narrower workflow | `reconstructing-images-as-threejs` |

### `craft-premium-motion`

Added to the versioned library as the direction and technology-routing layer for premium motion systems. It remains library-agnostic and delegates GSAP-specific implementation to `engineering-gsap-animations`.

### `engineering-gsap-animations`

Uses the official GreenSock skills as the technical source for GSAP core, timelines, ScrollTrigger, plugins, React lifecycle, cleanup, performance, and accessibility. The local trigger is intentionally narrower: GSAP must already be selected or clearly required.

### `reconstructing-images-as-threejs`

Adapts the evidence, staged reconstruction, confidence, procedural factory, and review-gate concepts from `img2threejs` without bundling or claiming execution of its Forge toolkit. It is optional and does not replace authored 3D pipelines.
