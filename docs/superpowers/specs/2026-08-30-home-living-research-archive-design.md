# Agent Skills Studio Home — Living Research Archive

**Date:** 2026-08-30  
**Status:** Proposed for implementation  
**Scope:** Home experience only  
**Base:** Current evidence-first Home merged via PR #24

## 1. Product intent

The Home should make visitors feel that Agent Skills Studio is not a prompt directory. It is a curated, inspectable archive of methods that produce demonstrably better work.

The current Home already establishes the correct product thesis and evidence-first content hierarchy. The next iteration must increase perceived craft and authorship without reducing clarity, accessibility, or technical credibility.

The target experience is a **Living Research Archive**: editorial, technical, restrained, and memorable. It should feel like a premium research publication and a design laboratory built by an experienced product, motion, and frontend team rather than a conventional AI/SaaS landing page.

## 2. Design principles

1. **Evidence remains the product.** Visual experimentation must always point back to a method, transformation, result, or inspectable proof.
2. **Three acts, not a stack of sections.** The page should read as one continuous document with chapters, not repeated landing-page modules.
3. **Two or three high-impact moments only.** Spectacle is concentrated; long periods of visual restraint create contrast.
4. **Violet is material, not decoration.** The Dark Veil violet behaves as light, thread, signal, field, and active state rather than a generic accent color.
5. **Typography carries composition.** Large changes in scale and placement create hierarchy; cards are not the default container.
6. **Motion explains relationships.** Animation should reveal process, causality, or progress. No ornamental motion without semantic value.
7. **Technical confidence over novelty.** Interactions must remain performant, accessible, responsive, and inspectable.

## 3. Page architecture

The Home is reorganized into three editorial acts.

### Act I — Manifesto / Case 001

Purpose: establish the thesis and immediately prove it with the Home itself.

Sequence:

1. Existing manifesto hero remains visually recognizable.
2. Dark Veil produces the visual origin of the violet system.
3. A thin `Evidence Thread` exits the hero and introduces Case 001.
4. Case 001 becomes a single long-form sticky transformation sequence:
   - Problem
   - Method
   - Transformation
   - Result
   - Evidence
5. The sequence ends with inspectable links to relevant skills, case records, and PR evidence.

The existing separate `This Home was built with Skills` and `From problem to outcome` sections should be absorbed into this single narrative chapter.

### Act II — Methods / Systems

Purpose: let visitors discover the collection while seeing how methods behave together.

Sequence:

1. Method Index — large typographic entries with minimal metadata.
2. Packs — outcome-led dossiers, not equal card columns.
3. Method Workflow — one method moving through four states:
   - Ask
   - Invoke
   - Guide
   - Result

This act should vary layout rhythm deliberately. No repeated `heading + paragraph + 3-column grid` pattern.

### Act III — Proof / Open System

Purpose: end with verifiability and openness.

Sequence:

1. Evidence Ledger — intentionally austere, technical table/database language.
2. Roadmap — secondary information after trust has been established.
3. Contribution / closing statement — reinforce that the collection is open, inspectable, and evolving.

## 4. Signature system — Evidence Thread

`Evidence Thread` is the page's proprietary visual interaction.

### Behavior

- Begins as a subtle continuation of the violet energy in the hero.
- Travels through the document as a thin SVG/CSS line.
- Changes geometry according to context:
  - vertical guide through Case 001;
  - horizontal connector between Method stages;
  - underline or side rule for active method records;
  - frame fragment around selected evidence;
  - terminates or dissolves before the footer.
- The line must never obscure reading or become a decorative cursor trail.

### Technical direction

- Prefer SVG paths and CSS variables for geometry.
- GSAP + ScrollTrigger is acceptable for scroll-linked state changes.
- Avoid canvas/WebGL for the thread.
- Use section-level progress rather than continuous per-pixel JavaScript work where possible.
- Motion must be deterministic and reversible when scrolling upward.

### Reduced motion

With `prefers-reduced-motion: reduce`:

- the thread renders as static editorial rules;
- sticky transforms become normal document flow;
- no scrubbed path drawing;
- all content and relationships remain understandable.

## 5. Act I — Case 001 sticky story

This is the strongest new moment on the page.

### Desktop

Use a long section approximately `220vh–280vh`, tuned after rendered QA.

A sticky stage occupies most of the viewport while narrative state changes as the user scrolls.

Suggested composition:

- left or center: visual artifact / interface transformation;
- opposite rail: active stage metadata and evidence;
- Evidence Thread indicates current state;
- progress labels `01 / 04`, `02 / 04`, etc.;
- before and after are built from controlled UI abstractions or real repository-safe screenshots/assets if later available.

States:

#### 01 — Problem

Show the previous generic/compressed interface as a de-emphasized technical artifact. Annotate only the real issues already identified: weak hierarchy, generic rhythm, insufficient authorship.

#### 02 — Method

Introduce the relevant skills and the process they enforce. The artifact begins to change structurally. Skills are represented as method references, not glowing badges.

#### 03 — Transformation

Typography, spacing, grid, and Dark Veil material reorganize. This is the most expressive transition but must remain smooth and legible.

#### 04 — Evidence

Reveal the final current Home treatment. Surface proof links and QA facts. The thread resolves into an evidence marker and hands the visitor to Act II.

### Mobile

Do not reproduce the desktop sticky choreography at reduced scale.

- Use a linear 4-stage editorial sequence.
- Each stage has one visual and one concise explanation.
- Preserve thread continuity as a static/partially animated vertical rule.
- Avoid long viewport locking.

## 6. Method Index

The method catalogue on the Home should feel like an editorial index, not a list of cards.

### Layout

- 3 featured methods remain sufficient on the Home.
- Each row has a strong typographic title, index number, discipline, and restrained metadata.
- Rows may expand visually on hover/focus using whitespace, not floating elevation.
- Active row may expose one-line outcome/evidence context.
- Use large type at wide breakpoints and more compact type on tablet/mobile.

### Interaction

- Hover/focus can shift alignment, reveal metadata, and pull the Evidence Thread into the row.
- Keyboard focus must produce the same informational state as hover.
- No hover-only essential information.

## 7. Packs as dossiers

Packs should show what combinations of methods produce.

Replace equivalent three-column presentation with asymmetric editorial dossiers.

Each dossier contains:

- pack name;
- method count;
- version/status;
- 1–2 concrete outcomes;
- short list of representative skills;
- link to inspect the pack.

At desktop widths, dossiers may alternate width/alignment rather than form equal columns. At mobile widths they become a clean stacked sequence.

The pack color metadata from the catalog must not reintroduce unrelated bright accents into the Home. Violet remains the Home's primary identity; category colors may appear only as very subtle metadata if needed.

## 8. Four-movement workflow

The current `One method. Four movements.` concept remains, but becomes one connected system.

The stages are:

1. Ask
2. Invoke
3. Guide
4. Result

### Desktop

- One horizontal/diagonal process field.
- Evidence Thread travels through all four states.
- Active state receives typographic emphasis and a small technical readout.
- The user should visually understand that a skill changes the **process**, not merely the final answer.

### Mobile

- Vertical timeline.
- No horizontal overflow required for comprehension.

## 9. Evidence Ledger

The Ledger intentionally contrasts with the expressive parts of the page.

It should feel like an audit surface:

- crisp rules;
- compact monospace metadata;
- no large glow;
- clear links to method, usage context, and evidence;
- row hover/focus is subtle;
- external evidence is clearly identified.

This is where visual restraint communicates confidence.

## 10. Typography and composition

Keep the current primary type family. The improvement comes from composition, not adding many fonts.

Recommended scale range:

- mono metadata: ~10–12px
- body: ~16–19px
- section heading: ~48–72px
- display statements: ~88–150px depending on viewport
- occasional oversized editorial word/number: up to ~160–200px on very wide screens if it remains readable

Rules:

- Avoid centering entire sections by default.
- Use intentional asymmetry.
- Let some headings cross multiple grid columns.
- Vary section density.
- Prefer whitespace and rules over bordered cards.
- Avoid excessively tight tracking on long PT-BR strings.

## 11. Color and material system

The violet system introduced in PR #24 remains canonical.

Use it in four material roles:

1. **Signal** — links, focus, active state.
2. **Light** — Dark Veil and selective atmospheric fields.
3. **Thread** — Evidence Thread geometry.
4. **Surface tint** — low-opacity violet in selected editorial backgrounds.

Do not turn every section purple.

Green remains reserved for success/verification semantics.

## 12. Motion language

Motion hierarchy:

### Tier 1 — Signature

- Dark Veil
- Case 001 transformation
- Evidence Thread

### Tier 2 — Structural

- section/act transitions
- Method Index state changes
- workflow progression

### Tier 3 — Micro

- links
- focus states
- metadata reveals

Rules:

- no looping motion outside the hero unless semantically justified;
- no gratuitous parallax on body text;
- no custom cursor required;
- no scroll hijacking;
- keep native scrolling;
- transitions should typically complete within ~250–700ms unless scroll-scrubbed;
- spring motion should be restrained and product-like.

## 13. Component architecture

Implementation should split the current Home into focused components instead of further growing `page.tsx`.

Suggested boundaries:

- `HomeManifestoHero`
- `HomeEvidenceThread`
- `HomeCaseStudyStory`
- `HomeMethodIndex`
- `HomePackDossiers`
- `HomeMethodWorkflow`
- `HomeEvidenceLedger`
- `HomeClosing`

Supporting hooks/utilities:

- `useEvidenceThreadProgress` or equivalent isolated motion controller;
- static content remains in localized content modules;
- catalog/evidence data resolution stays server-side where possible;
- client components should receive serializable presentation data.

Do not create one giant client Home component.

## 14. Accessibility

Required:

- semantic heading order remains valid;
- sticky/pinned storytelling must not reorder accessibility reading order;
- all interactive rows are keyboard reachable;
- hover reveals are duplicated on focus;
- visible focus uses the violet focus token;
- reduced-motion path is first-class, not a fallback afterthought;
- decorative SVG/thread elements use `aria-hidden`;
- color is never the only carrier of state;
- contrast meets WCAG AA for text and actionable controls.

## 15. Performance constraints

The premium feel must not come from excessive runtime cost.

Targets/direction:

- keep Dark Veil as the only WebGL surface on the Home;
- Evidence Thread uses SVG/CSS/GSAP, not another canvas;
- lazy-init ScrollTrigger behavior below the fold where practical;
- avoid layout-thrashing measurement loops;
- use transforms/opacity for animated properties;
- no large video background in this iteration;
- no new heavy 3D dependency;
- preserve static rendering/server components for content-heavy sections.

## 16. Responsive strategy

Breakpoints should change composition, not merely shrink desktop layouts.

### Desktop / wide

- full three-act narrative;
- sticky Case 001;
- horizontal Method Workflow;
- expressive type scale and asymmetric grid.

### Tablet

- reduce sticky duration;
- keep two-column moments only when readable;
- simplify thread geometry.

### Mobile

- linear narrative;
- no viewport-locking Case 001;
- vertical workflow;
- compact Evidence Ledger with horizontal table handling only if necessary, otherwise use labelled rows;
- maintain large but controlled headings.

## 17. Content constraints

Do not invent social proof, adoption numbers, testimonials, logos, or usage statistics.

Evidence must come from:

- repository PRs/commits;
- existing Built with Skills cases;
- real QA/test facts;
- actual published methods and packs.

No additional marketing copy is required unless needed to connect the three acts.

## 18. Testing and QA

### Automated contract tests

Add/adjust tests for:

- three-act Home section order;
- Case 001 stage content in EN and PT-BR;
- featured Method Index links;
- Evidence Ledger links;
- semantic violet token contract;
- reduced-motion static structure;
- no loss of hero/engine accessibility contract.

### Technical gates

Before merge:

- root tests
- catalog/plugin validation
- web tests
- TypeScript
- ESLint
- Next.js production build
- platform smoke tests already present in repository CI

### Rendered visual QA

Validate the deployed/preview page at minimum:

- 390px mobile
- 768px tablet
- 1440px desktop
- 1920px wide desktop
- dark mode
- light mode
- reduced motion

Check:

- sticky release points;
- no clipped headings;
- no overlapping thread/content;
- no horizontal scroll leaks;
- readable PT-BR line breaks;
- keyboard focus through interactive method/dossier/ledger elements;
- no console errors;
- acceptable animation smoothness.

Because the site is pre-launch, the production deployment may be used for final visual QA after CI and merge when explicitly approved.

## 19. Out of scope

This iteration does **not** include:

- redesigning all interior skill/detail pages;
- custom cursor;
- Three.js scenes;
- additional WebGL surfaces;
- audio;
- video backgrounds;
- CMS changes;
- catalog schema changes;
- analytics changes;
- new testimonials or external social proof;
- full navigation/header redesign unless a small compatibility adjustment is required.

## 20. Success criteria

The iteration is successful when:

1. The page no longer reads as a sequence of competent landing-page sections.
2. Hero and Case 001 feel like one continuous authored experience.
3. A visitor can understand that skills change process and outcome without reading every paragraph.
4. Evidence remains directly inspectable.
5. The site has at least one memorable proprietary interaction beyond Dark Veil: Evidence Thread.
6. The visual system feels premium and experimental without compromising trust or usability.
7. Mobile and reduced-motion versions feel intentionally designed rather than degraded desktop versions.
8. Existing technical quality gates remain green.
