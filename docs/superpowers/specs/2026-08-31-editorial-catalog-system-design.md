# Editorial Catalog System — Design Specification

**Date:** 2026-08-31  
**Status:** Approved design, pending implementation plan  
**Scope:** `/skills`, `/skills/[slug]`, `/packs`, `/packs/[slug]`, `/built-with-skills`, `/built-with-skills/[slug]`

## 1. Purpose

Agent Skills Studio already has a strong editorial Home and global publication chrome. The catalog-facing routes still use an older pattern: page header followed by conventional grids/cards and documentation-style detail pages. This redesign brings the rest of the product into the same visual standard without turning every route into a copy of the Home.

The system must communicate three distinct product ideas:

- **Skills = Method Archive** — a precise, technical library for discovering, comparing, evaluating, and using working methods.
- **Packs = Curated Systems** — deliberate compositions that explain why methods work better together.
- **Built with Skills = Evidence Archive** — verifiable case studies showing real decisions, outputs, and provenance.

Detail pages use a hybrid model: a strong editorial entrance followed by highly scannable technical content.

## 2. Product principles

### 2.1 Methods, not prompt cards

The interface must reinforce the product thesis that skills are working methods, not isolated prompts. Skills therefore appear primarily as indexed methods and dossiers rather than generic product cards.

### 2.2 Evidence before claims

Built with Skills exists to prove outcomes. Where evidence is available, it must be explicit and inspectable. Green remains reserved for verification/success semantics; violet represents method, provenance, navigation, and product identity.

### 2.3 Shared system, distinct domain personalities

The redesign uses a shared editorial foundation but gives each domain a distinct presentation model. Reuse happens at the level of primitives and interaction language, not through one giant component with domain variants.

### 2.4 Server-first, progressively enhanced

Catalog data, localization, metadata, structured data, and relationships remain server-owned. Client boundaries are introduced only for interaction: filters, reader navigation, copy feedback, contextual inspection, and carefully selected motion.

All primary content must remain readable and navigable without JavaScript. Motion enhances comprehension but is never required to reveal information.

### 2.5 Interaction is part of the component contract

Interactive elements must not feel static. Hover, focus, and transitions are designed with the component rather than added at the end. Every hover interaction must have a keyboard-equivalent focus treatment.

## 3. Global chrome invariant

`SiteHeader` and `SiteFooter` remain global components rendered exactly once by `apps/web/src/app/[locale]/layout.tsx`.

Domain pages must not create, import, wrap, or fork their own header/footer components. Responsive behavior and navigation transitions remain the responsibility of the global chrome.

A structural test should guard this invariant by ensuring the six redesigned route files do not import `SiteHeader` or `SiteFooter`.

## 4. Architecture

The system has three layers.

```text
app/[locale]/...
  server route components
        ↓
components/{skills,packs,evidence}/
  domain components
        ↓
components/editorial/
  shared primitives
```

### 4.1 Route responsibilities

Route components continue to own:

- locale resolution;
- catalog/case lookup;
- metadata and alternates;
- structured data;
- server-side relationship resolution where practical;
- construction of localized labels and commands.

Routes should remain small orchestration layers and avoid presentation-specific data duplication.

### 4.2 Shared editorial primitives

Proposed shared components:

```text
components/editorial/
  editorial-page-hero.tsx
  editorial-section-heading.tsx
  editorial-index-row.tsx
  editorial-metadata.tsx
  editorial-reader-nav.tsx
  editorial-provenance-rail.tsx
  editorial-status.tsx
  editorial-action.tsx
```

These components know about composition, semantics, interaction, and accessibility. They do not know what a Skill, Pack, or Case is.

### 4.3 Domain components

```text
components/skills/
  method-archive.tsx
  method-row.tsx
  method-dossier.tsx
  method-reader.tsx
  prompt-specimen.tsx

components/packs/
  pack-archive.tsx
  pack-dossier.tsx
  pack-blueprint.tsx
  pack-composition-map.tsx

components/evidence/
  evidence-archive.tsx
  evidence-feature.tsx
  evidence-report.tsx
  evidence-provenance.tsx
```

Avoid a shared mega-component such as `EditorialCard variant="skill|pack|case"`. Domain presentation should remain explicit.

## 5. Data contracts

### 5.1 Skills

The existing catalog remains the canonical source.

- Index: `SkillCatalogItem`
- Detail: `LocalizedSkillDetail`

Do not introduce an `EditorialSkill` data model that repeats title, summary, difficulty, maturity, benefit, category, or tags.

The Method Archive receives localized catalog items plus filter options. A Method Row receives the canonical skill record plus presentation labels.

The existing `nuqs` URL-backed filter model is preserved. Search/filter behavior can be restyled and reorganized, but query parameters remain the source of truth.

### 5.2 Packs

`LocalizedPack` remains the canonical pack model. It already supplies:

- status;
- featured flag;
- color;
- version;
- localized name/summary/description;
- outcomes;
- ordered resolved skill membership.

The Pack Composition Map derives its nodes from `pack.skills`. Visual connections may express ordered composition and explicit relationships, but must not falsely imply dependency or causality when none exists in the source data.

`active` and `planned` are structural states:

- active packs may expose real installation commands;
- planned packs must never expose fake or disabled installation controls merely for visual symmetry.

### 5.3 Built with Skills

The current case model is extended with explicit evidence records.

```ts
interface CaseEvidence {
  readonly type: "source" | "pull-request" | "commit" | "qa";
  readonly label: string;
  readonly href: string;
}

interface BuiltWithSkillsCase {
  // existing fields
  readonly evidence: readonly CaseEvidence[];
}
```

Evidence is only registered when it is real and resolvable. The UI must not infer a `VERIFIED` state solely because a case exists.

A case with only a source document can present `SOURCE / AVAILABLE`. A case with source plus concrete validation artifacts can present stronger verification semantics.

The current `sourcePath` may remain for repository provenance, but evidence links should become explicit so presentation code does not construct ad hoc repository URLs.

### 5.4 Cross-domain selectors

Relationships are derived rather than maintained in duplicate arrays.

Expected pure selectors include:

```text
getCasesUsingSkill(locale, skillSlug)
getCasesUsingPack(locale, packSlug)
getPacksContainingSkill(locale, skillSlug)
```

Examples:

- Skill detail can show evidence cases that actually use the method.
- Pack detail can show evidence that uses methods from the system.
- Evidence detail links each applied skill back to its Method Dossier.

Selectors should be deterministic, side-effect free, and unit-testable.

## 6. Skills — Method Archive

### 6.1 Role

`/skills` is a high-density technical archive optimized for discovery and comparison.

### 6.2 Hero

The opening behaves like a publication index rather than a marketing hero.

It includes:

- archive eyebrow;
- large editorial title;
- concise product thesis/summary;
- real collection metadata such as method count, pack count, categories/domains where useful, and repository version.

Metadata is derived from the catalog, never hardcoded.

### 6.3 Control surface

The existing URL-backed search/filter logic remains.

Desktop presentation:

- prominent search;
- primary category/domain index;
- secondary filters for pack, difficulty, and maturity;
- sticky behavior where it improves browsing;
- compact live result count.

Mobile presentation:

- search remains immediately available;
- secondary filters move into a compact surface rather than consuming a permanent multi-column grid;
- URL state remains identical to desktop.

### 6.4 Method Rows

The old three-column card grid is replaced as the primary representation by editorial rows.

A row can expose:

- ordinal/index;
- category;
- display name;
- summary or primary benefit;
- difficulty;
- maturity;
- navigational affordance.

Interaction contract: `navigate + inspect`.

Hover/focus behavior should use restrained transitions such as:

- provenance/accent line trace;
- 4–8 px title displacement;
- metadata contrast change;
- arrow reaction;
- secondary benefit emergence where space permits.

Rows must not use generic card-lift/shadow patterns.

## 7. Skill Detail — Method Dossier

### 7.1 Role

`/skills/[slug]` helps users understand, evaluate, and use a method.

### 7.2 Editorial entrance

The opening can occupy roughly 70–85dvh on desktop depending on content. It contains:

- category/method index context;
- large skill title;
- summary;
- primary facts: difficulty, maturity, version, updated date;
- a provenance rail or equivalent editorial accent.

No fact is hidden for animation.

### 7.3 Benefit transition

The primary benefit is presented as a strong editorial statement between hero and reader. This is one of the few scroll-directed moments on the page and should act as a handoff from editorial entrance to technical reading.

### 7.4 Technical reader

Desktop uses a two-column reader:

- main technical content;
- sticky `On this method` navigation.

Expected sections:

1. Benefit
2. When to use
3. When not to use
4. Use cases
5. Example prompts
6. Installation
7. Compatibility/dependencies/relations as appropriate
8. Evidence and related methods where available

The reader nav links to real section IDs. Current section state may use `aria-current="location"`.

Tablet reduces sidebar prominence. Mobile removes the sticky side column and uses a compact in-flow navigation model.

### 7.5 Prompt specimens

Prompts are presented as readable specimens rather than generic code cards.

Each specimen includes:

- specimen number/label;
- full prompt text;
- contextual copy action;
- accessible copied state.

Interaction contract: `confirm`.

### 7.6 Installation

Installation is a technical panel with Bash/PowerShell selection or clearly separated commands. Copy actions remain contextual and accessible.

## 8. Packs — Curated Systems Archive

### 8.1 Role

`/packs` explains deliberate combinations of methods rather than presenting six interchangeable product cards.

### 8.2 Archive presentation

The page uses large editorial dossiers with stronger hierarchy than the Skill Archive.

Each dossier can show:

- ordinal;
- status;
- pack name;
- summary;
- skill count or pending composition;
- selected method names/outcomes;
- explicit explore action.

Active and planned packs should look intentionally different while remaining part of one system.

Interaction contract: `navigate + connect`.

Hover/focus may:

- shift the editorial number;
- introduce a subtle violet field;
- advance the composition list;
- reveal/strengthen the action;
- adjust border/provenance traces.

## 9. Pack Detail — System Blueprint

### 9.1 Role

`/packs/[slug]` answers: what does the user gain by using this system rather than isolated skills?

### 9.2 Editorial entrance

The hero prioritizes:

- pack/system identity;
- status;
- summary;
- version;
- skill count;
- high-level system outcome.

### 9.3 Outcomes

Outcomes become numbered editorial statements before installation/composition details.

### 9.4 Composition Map

The main visual moment is a semantic composition map built from the ordered skill list.

Desktop enhancement:

- methods appear as nodes/rows in a controlled editorial graph;
- hover/focus highlights the selected method and valid relationships;
- unrelated elements may reduce contrast slightly;
- contextual benefit text can appear;
- visual connectors never become the only source of meaning.

Mobile fallback:

```text
01 METHOD
↓
02 METHOD
↓
03 METHOD
```

The underlying structure remains semantic list content.

Interaction contract: `connect`.

### 9.5 Installation and planned state

Active packs expose real Bash/PowerShell commands. Planned packs expose roadmap/status context and outcomes but no misleading installation UI.

## 10. Built with Skills — Evidence Archive

### 10.1 Role

`/built-with-skills` is the most expressive index in the product. It answers: does this collection produce valuable real work?

### 10.2 Hero thesis

The opening can use a direct evidence-first statement such as the current product direction: do not trust the description; inspect the result.

### 10.3 Evidence features

Cases are not represented as generic cards.

The leading case can be a large editorial feature containing:

- case number;
- title;
- summary;
- artifact/evidence field when available;
- methods used;
- date;
- evidence availability/verification state.

Additional cases can use large index rows/features with inspectable metadata.

Interaction contract: `inspect + navigate`.

Green is only used when the underlying evidence contract justifies verification semantics.

## 11. Evidence Detail — Evidence Report

### 11.1 Role

`/built-with-skills/[slug]` reads like an editorial case study while remaining technically inspectable.

### 11.2 Narrative acts

The report follows:

1. Challenge
2. Methods
3. Decisions
4. Outcomes
5. Evidence

A single progress/provenance rail may follow these acts. Avoid pinning every section.

### 11.3 Methods

Applied skills link directly to Method Dossiers and explain the benefit they brought to the case.

### 11.4 Decisions

Decisions are presented as an editorial sequence/timeline. Motion may support progression but must not hide content or require scrub interaction.

### 11.5 Evidence closing

The final evidence area exposes available source, PR, commit, QA, or other registered evidence links directly.

The closing should read more like a technical evidence record than a marketing CTA.

## 12. Shared interaction language

Four interaction families are standardized.

### Navigate

Used by rows, links, dossiers, and archive entries.

Typical duration: 160–320 ms.

Behaviors:

- underline/trace;
- arrow reaction;
- micro-translate;
- contrast shift.

### Inspect

Used for secondary metadata and case/skill context.

Typical duration: 240–360 ms.

Behaviors:

- metadata emergence;
- secondary content contrast change;
- accent strengthening.

### Connect

Used for pack composition and cross-domain relationships.

Typical duration: 320–520 ms.

Behaviors:

- connector/trace progression;
- related element emphasis;
- non-related element de-emphasis.

### Confirm

Used for copy/install actions.

Typical duration: 120–220 ms.

Behaviors:

- label/icon change;
- clear success feedback;
- no ambiguous loading-like transition.

Components may expose intent markers such as:

```text
data-interaction="navigate"
data-interaction="inspect"
data-interaction="connect"
data-interaction="confirm"
```

These markers are useful for structural testing and debugging but are not a substitute for semantic HTML.

## 13. Motion ownership

One element must have one owner for animated properties.

- **CSS:** hover/focus, lines, color, border, simple micro-translate.
- **Motion:** overlay entrance/exit, contextual metadata, finite UI state transitions.
- **GSAP/ScrollTrigger:** only scroll-linked storytelling that cannot be expressed cleanly as normal CSS/state transitions.

Do not let CSS, Motion, and GSAP compete over the same `transform` or `opacity` property on one element.

Scroll choreography is deliberately limited after the workflow issue discovered on the Home.

## 14. Reduced motion

`prefers-reduced-motion: reduce` is a first-class product state.

With reduced motion:

- no ScrollTrigger-controlled transforms are required;
- no content begins hidden behind opacity-zero states;
- reader navigation still works;
- hover/focus may change color/border without animation;
- copy feedback remains functional;
- composition maps remain legible in static form;
- all information remains present.

Optional data contracts may expose `data-motion="editorial"` / `data-motion="static"` when helpful for tests.

## 15. Accessibility

Required behaviors:

- every hover treatment has an equivalent `focus-visible` treatment;
- all archive rows and dossiers are keyboard navigable;
- reader navigation points to real headings/section IDs;
- heading hierarchy remains semantic regardless of visual scale;
- sticky controls use `scroll-margin-top` that accounts for the publication bar;
- status is always communicated with text, never color alone;
- composition maps have semantic list equivalents;
- prompt text remains visible when copy feedback occurs;
- copied/success feedback is accessible;
- mobile layouts do not hide essential technical content behind accordions solely to save space.

## 16. Responsive behavior

### Skills

Desktop: editorial hero, sticky control surface, dense Method Rows.  
Mobile: immediate search, compact secondary filter surface, rows remain rows with lower-priority metadata moved into a second line.

### Skill Detail

Desktop: two-column technical reader with sticky section nav.  
Tablet: reduced sidebar prominence.  
Mobile: in-flow compact reader navigation, no sticky side rail.

### Packs

Desktop: large alternating dossiers and composition views.  
Mobile: complete vertical dossiers; composition maps become linear connected sequences.

### Evidence

Desktop: leading feature can use asymmetry/overlap.  
Mobile: artifact, title, metadata, and action become a clean linear reading order.

The same global `SiteHeader` and `SiteFooter` are used at every breakpoint.

## 17. Styling boundaries

Do not continue growing `globals.css` with domain-specific redesign rules.

Create scoped style layers:

```text
editorial-pages.css
editorial-methods.css
editorial-packs.css
editorial-evidence.css
```

`globals.css` retains foundational tokens and legacy/shared base styles until safely retired. Existing Home CSS remains Home-owned.

## 18. Testing and validation strategy

The project will intentionally use **minimal automated tests** for this redesign because perceptual validation is being performed on the production deployment.

### 18.1 Required automated gates

For each implementation slice, run the smallest meaningful set of checks:

- targeted Vitest/RTL contracts for changed behavior;
- TypeScript typecheck;
- lint for touched code;
- production build before merge/deploy.

Do not build a large snapshot or browser test suite for cosmetic details.

### 18.2 Structural contracts

Maintain focused tests for high-risk invariants:

- `/skills` exposes the Method Archive rather than using the legacy grid as its primary representation;
- filters remain URL-backed and clearable;
- Skill Detail exposes hero, reader, prompts, and installation;
- active/planned Packs preserve truthful installation behavior;
- Evidence renders only registered evidence states;
- domain routes do not import `SiteHeader` or `SiteFooter`;
- reduced-motion/static fallbacks do not depend on hidden content.

### 18.3 Interaction contracts

Test only behavior with meaningful failure cost:

- filter update/clear;
- keyboard/focus accessibility for new interactive surfaces;
- reader navigation state where introduced;
- copy feedback;
- pack composition selection/focus if it uses client state;
- evidence links and verification labels.

Do not test exact animation durations or pixel values.

### 18.4 Rendered QA

Rendered browser QA is optional per slice and should be used when a change has genuine structural risk, such as sticky readers, composition maps, responsive filter surfaces, or scroll choreography.

When used, representative viewports are:

- 1366×768;
- 1440×900;
- 1920×800;
- 1920×1080;
- 768×1024;
- 390×844.

Key gates:

- no horizontal overflow;
- sticky elements do not cover target content;
- no content remains hidden due to animation state;
- controls remain keyboard and touch usable;
- no new runtime errors.

### 18.5 Production visual validation

The primary perceptual review happens on the deployed production site.

Visual validation should focus on:

- PT-BR long titles/copy;
- 1920×800 wide/short screens;
- planned pack states;
- skills with many prompts/dependencies;
- long evidence cases;
- dark/light mode consistency;
- hover, focus, transition quality;
- mobile density and reading order.

Because the site is still being actively refined, visual feedback from production may generate bounded follow-up PRs without reopening the full architecture.

## 19. Implementation slices

Implementation is intentionally split into small reviewable slices:

1. **Shared Editorial Foundation** — primitives, scoped CSS layers, interaction vocabulary, global chrome invariants.
2. **Skills Archive** — Method Archive, URL-backed control surface, Method Rows.
3. **Skill Dossier** — editorial hero, benefit handoff, technical reader, prompt specimens, installation/evidence relations.
4. **Packs Archive** — curated dossiers and active/planned archive states.
5. **Pack Blueprint** — outcomes, semantic composition map, installation/planned behavior.
6. **Evidence Archive** — evidence contract evolution, leading feature, evidence index.
7. **Evidence Report** — challenge/methods/decisions/outcomes/evidence narrative.
8. **Cross-domain Relations + Final Polish** — selectors, related evidence/pack/method surfaces, responsive and interaction consistency.

Each slice should reach production-validatable quality before the next slice is considered complete.

## 20. Non-goals

This redesign does not:

- create route-specific headers or footers;
- replace the catalog as the source of truth;
- introduce a CMS;
- redesign the Home again;
- introduce a generic dashboard/component-card aesthetic;
- create fake evidence or verification states;
- require JavaScript for reading primary content;
- add heavy scroll choreography to every page;
- optimize for exhaustive automated visual regression testing at this stage.

## 21. Acceptance criteria

The architecture is complete when:

1. all six target routes use the new editorial domain system;
2. one global `SiteHeader` and one global `SiteFooter` remain owned by the locale layout;
3. Skills reads as a technical Method Archive rather than a card catalog;
4. Skill Detail combines a strong editorial entrance with a stable technical reader;
5. Packs communicates deliberate systems and truthful active/planned status;
6. Pack Detail explains outcomes and composition without false dependency semantics;
7. Built with Skills prioritizes inspectable evidence over claims;
8. Case Detail presents challenge → methods → decisions → outcomes → evidence coherently;
9. hover, focus, and transitions are present as a consistent interaction language;
10. reduced-motion and mobile preserve the same information without relying on animation;
11. catalog and case data are not duplicated into presentation-only canonical models;
12. production visual validation shows no material regression in responsive layout, readability, or global chrome.
