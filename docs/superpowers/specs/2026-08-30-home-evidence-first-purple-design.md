# Agent Skills Studio Home — Evidence-first editorial redesign

## Goal

Make the Home communicate trust through observable outcomes: the visitor should understand that Agent Skills are reusable working methods, see what those methods produced, and be able to inspect the evidence before being asked to browse the catalog.

## Approved direction

The existing Dark Veil hero remains the opening manifesto and visual anchor. The rest of the page adopts the same editorial confidence, replacing the generic blue accent with a violet system derived from the Dark Veil and replacing repeated card grids with evidence-led layouts, lists, rails, tables, and open compositions.

## Narrative order

1. **Manifesto hero** — keep the approved hero composition and Method Engine.
2. **Built with Skills / Case 001** — immediately prove the thesis using the Agent Skills Studio Home itself as the first featured case.
3. **Before → Method → Result** — explain the transformation with three concrete stages rather than generic benefit cards.
4. **Open methods index** — present featured skills as a restrained editorial index/list with discipline metadata and direct links.
5. **Featured packs** — present packs as outcome-oriented collections, visually quieter than conventional SaaS cards.
6. **How it works** — explain a real four-movement flow: request → invocation → method guidance → verifiable result.
7. **Evidence ledger** — a compact audit-style table connecting methods to cases/evidence.
8. **Roadmap / contribute** — keep future-facing material at the bottom, after trust is established.

## Evidence rules

- Do not invent customer logos, testimonials, adoption metrics, or fake usage counts.
- Use repository-verifiable facts already available in the project: skill slugs, case data, PR references, tests, responsive QA, generated/static page counts, and installable pack metadata.
- The Home redesign itself is presented as a case study, with PR #22 as evidence for the hero revision.
- Existing `BuiltWithSkillsCase` data remains the canonical source for published case facts.

## Color system

Replace the current generic blue product accent with a violet family that harmonizes with the Dark Veil:

- Light primary accent: `#6d28d9`
- Light focus accent: `#7c3aed`
- Dark primary accent: `#a78bfa`
- Dark focus accent: `#c4b5fd`
- Purple is used for primary actions, editorial labels, active states, key rules, hover/focus treatment, and selected evidence.
- Green remains semantic success/verified state only.
- Avoid broad purple washes outside the hero; the page should stay predominantly neutral and dark/light according to theme.
- Avoid gratuitous glow. Purple should read as a precise product signal, not synthwave decoration.

## Layout language

- Preserve the 72rem core shell for normal sections, allowing selected evidence modules to use stronger full-width bands within that shell.
- Vary section rhythm. Do not repeat `heading → 3 cards` patterns.
- Prefer border rules, large typography, editorial indices, rows, tables, and single framed evidence modules.
- Use generous vertical spacing and asymmetric desktop grids.
- Mobile collapses into readable single-column sequences without horizontal scroll.
- Keep existing typography families and semantic tokens.

## Featured case anatomy

The first post-hero section must contain:

- label: `Built with Skills / Case 001`
- proposition that this Home was produced with Skills
- challenge
- skills used
- outcome
- verifiable evidence including PR #22 and responsive QA sizes
- a visual Before / After pair using code-native miniature browser compositions rather than raster screenshots, so the section remains crisp and maintainable
- links to `Built with Skills` and the relevant methods

## Method transformation anatomy

Three stages:

1. **Before / Problem identified** — cramped hierarchy and weak visual differentiation.
2. **Method / Skills applied** — research, design gate, implementation and visual QA.
3. **Result / Verifiable evidence** — responsive editorial hero, reduced-motion support and QA.

The stages should read as one connected editorial sequence, not three independent floating cards.

## Skill index

Feature the three methods already represented by the Method Engine:

- `designing-ui-systems`
- `building-premium-nextjs-interfaces`
- `craft-premium-motion`

Each row contains index, title/slug, a concise discipline line, and a direct link. No feature-card chrome.

## Packs

Use active catalog packs only. Present name, skill count/version, summary and link, with a restrained pack-specific accent rule if catalog color exists. The global violet remains the navigation/action accent.

## How it works

Four movements:

1. You ask / Você pede.
2. The agent invokes / O agente invoca.
3. The method guides / O método guia.
4. You receive / Você recebe.

Use a horizontal connected rail on desktop and a vertical sequence on mobile.

## Evidence ledger

Show a compact table-like structure with real method/case mappings. It should reinforce the principle: `Open the method. Inspect the evidence. Judge the result.`

## Accessibility and motion

- Keep focus visibility at least as strong as the current site.
- Semantic headings and links remain keyboard accessible.
- Decorative motion must respect `prefers-reduced-motion`.
- New post-hero sections do not require WebGL or essential motion.

## Success criteria

- The first section after the hero is evidence, not navigation or catalog explanation.
- Blue no longer appears as the global brand/focus accent; violet is the shared accent in light and dark themes.
- The old Home-specific 3-card path grid is removed from the page.
- The process section is no longer a generic three-card layout.
- Featured methods render as an editorial list/index.
- A repository-verifiable evidence ledger appears before roadmap content.
- Existing locale routing, catalog links, pack links, `Built with Skills`, accessibility and production build remain functional.
