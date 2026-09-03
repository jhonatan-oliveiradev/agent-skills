# Sitewide Copy System Audit & Rewrite Design

## Goal

Audit and rewrite the public-facing copy of Agent Skills Studio so the product explains itself clearly to people who want to use agents better, while preserving enough technical depth for builders and teams who need reusable working methods.

The final copy system must make the product easier to understand, easier to trust, and easier to act on without changing product behavior, release semantics, catalog facts, or evidence claims.

## Product context

Agent Skills Studio is already a Stable `1.0.0` product with 54 canonical skills and 11 active packs. Its strongest existing positioning line is the distinction between prompts and methods:

> Skills are not prompts. They are working methods.

That thesis remains the editorial anchor. The problem is not that the current site lacks personality; it is that the rest of the copy sometimes falls back to abstract, repetitive, AI-shaped, or overly institutional language that makes the product harder to understand than necessary.

The site also serves two different levels of reader:

1. people who want their agents to work better and may not think in terms of reusable agent infrastructure yet;
2. builders and technical teams who care about composable skills, packs, evidence, installation, catalog structure, and repeatable workflows.

The approved product strategy is to serve both audiences, with the first audience as the entry point and the second as the progressively revealed depth.

## Audience strategy

### Primary entry audience

Developers, designers, technical creators, and advanced AI users who already use ChatGPT, Codex, Claude, or another agentic runtime and want more reliable work than isolated prompts provide.

Their first questions are:

- What is this?
- Why is it better than saving a prompt?
- What can it help my agent do?
- How do I use it?
- Why should I trust these methods?

The Home and first-level discovery surfaces must answer those questions without requiring prior knowledge of Agent Skills architecture.

### Secondary depth audience

Builders and technical teams who want reusable methods for standardizing how agents investigate, decide, implement, review, verify, document, and communicate.

Their questions include:

- How are skills scoped?
- How do packs compose related methods?
- What evidence exists that the methods were used in real projects?
- How are methods installed and selected?
- What is Stable versus Beta skill maturity?
- How can this collection become part of an engineering or product workflow?

Catalog detail, pack detail, Getting Started, Built with Skills, Roadmap, and project documentation may use progressively more technical language to answer these questions.

## Communication objective

The public site should move a reader through five editorial stages:

1. **Problem** — isolated prompts describe a request but do not reliably define how complex work should be performed.
2. **Method** — Agent Skills Studio gives agents explicit, reusable working methods for specific kinds of work.
3. **Use** — readers can choose a skill or pack and install it in a compatible Agent Skills runtime.
4. **Evidence** — real-use cases show the method, implementation constraints, RED → GREEN verification, and inspected outcomes.
5. **Depth** — builders can combine methods and use the collection as repeatable operating infrastructure for agents.

Not every page needs all five stages. Each public surface gets one primary editorial responsibility so the site does not repeat the same manifesto everywhere.

## Verbal identity

The approved voice is a hybrid of editorial authorship and technical precision.

### Headlines

Headlines may be opinionated, compact, memorable, and asymmetric. They should create contrast or clarify a product truth rather than stack adjectives.

Good direction:

- `Skills are not prompts. They are working methods.`
- `A prompt says what you want. A skill defines how the work gets done.`
- `Inspect the method. Inspect the evidence.`

Headlines do not need to explain every technical nuance; nearby supporting copy must do that work accurately.

### Body copy

Body copy must be concrete, factual, and easy to scan.

Prefer actors, actions, objects, and consequences over stacked abstractions. Explain what the product is before describing what it enables. Describe features as benefits only where the causal connection is defensible.

### UX and operational copy

Navigation, filters, installation controls, error states, empty states, not-found pages, buttons, and helper text are product behavior, not campaign copy.

A label must predict the next state or action. Operational UI must not inherit unnecessary sales pressure from the marketing surfaces.

### Proof language

Proof must stay adjacent to the claim it supports. Real-use counts, pack representation, release status, CI evidence, project identifiers, version numbers, and maturity states must be derived or preserved from their real sources of truth.

The rewrite must not manufacture testimonials, adoption claims, performance metrics, customer logos, urgency, scarcity, guarantees, or unsupported comparisons.

### Human rhythm

Avoid generic generated-prose patterns:

- throat-clearing before the point;
- repeated three-part constructions without semantic need;
- identical paragraph shapes across every section;
- generic significance claims;
- inflated adjectives;
- excessive transitions;
- repeated restatement of the same thesis;
- mechanical conclusion copy;
- abstract nouns where a concrete action is available.

The goal is not stylistic randomness. It is deliberate editorial rhythm.

## Language strategy

English and PT-BR are equivalent editorial products, not source and translation.

Both locales must communicate the same product facts, actions, hierarchy, and confidence level, but each may use the most natural syntax and cadence for the language.

Do not preserve an English sentence structure in PT-BR when it sounds translated. Do not insert Brazilian idioms that create a different product personality. Technical terms such as `skill`, `pack`, runtime names, command names, version strings, and canonical slugs remain consistent where the product already treats them as terms of art.

## Messaging hierarchy

### Core thesis

The durable positioning distinction is method versus prompt.

The site should consistently make this distinction without repeating the exact headline on every page.

### Product definition

At first mention, the product should be understandable as a curated, installable collection of working methods for agents.

The definition should make three things clear:

- the unit is a reusable method, not a prompt template;
- methods are scoped to real kinds of work;
- the collection is inspectable and evidence-oriented.

### Trust model

Trust comes from inspectability rather than authority language.

The site should prefer:

- source links;
- visible skill instructions;
- catalog metadata;
- real-use case studies;
- test and CI evidence;
- Stable/maturity distinctions;
- explicit limitations and non-goals.

Avoid substituting claims such as `production-ready`, `best-in-class`, `powerful`, or `premium` for concrete proof.

### Primary action model

Public discovery pages should have one primary next step and at most one materially different secondary path.

Examples of valid action categories:

- explore skills;
- inspect a method;
- browse packs;
- install a skill or pack;
- inspect real-use evidence;
- read the contribution contract.

CTA labels should describe the actual next state rather than use generic `Learn more`, `Get started`, or `Continue` when a more specific verb is available.

## Page responsibilities

### Home

Primary responsibility: make an unfamiliar reader understand the product and want to inspect the collection.

The Home should:

- lead with the method-versus-prompt distinction;
- define the product in plain language;
- demonstrate how a natural request becomes a method-driven workflow;
- show concrete collection scale using derived catalog facts;
- introduce evidence as the trust mechanism;
- expose a small number of representative methods/packs rather than restating the whole catalog;
- guide the reader toward Skills as the primary action and Getting Started or Built with Skills as a distinct secondary path.

The Home should not read like internal project documentation or expect readers to understand pack architecture before understanding the value proposition.

### Skills index

Primary responsibility: help a reader find the right method.

Copy should prioritize task recognition, scope, and selection. Search/filter labels must use consistent terminology and avoid editorial language that obscures utility.

### Skill detail

Primary responsibility: let a reader judge and use one method.

The hierarchy should make trigger, purpose, boundaries, maturity, pack membership, dependencies/relations, and installation/action paths easy to understand. Reader-facing catalog copy may be edited for clarity, but canonical `SKILL.md` instructions are not rewritten by this tranche.

### Packs index

Primary responsibility: explain when a bundle of related methods is more useful than choosing one skill at a time.

Avoid presenting packs as generic categories. The copy should explain that a pack groups independently invokable methods around a broader discipline or workflow.

### Pack detail

Primary responsibility: communicate the pack's problem space, internal responsibility split, expected outcomes, and member methods.

Cross-pack membership must be described carefully so representation is not confused with complete pack validation.

### Getting Started

Primary responsibility: get from understanding to a successful installation with minimal uncertainty.

This page should become increasingly operational. Installation commands, platform distinctions, destination behavior, verification, and single-skill/pack selection should be concrete. Decorative marketing language should not interrupt task completion.

### Built with Skills index

Primary responsibility: prove that the methods have been applied to real work.

The archive should foreground project, problem, methods used, evidence class, and inspectable source. It should not read as a portfolio gallery whose only proof is a screenshot or result claim.

### Built with Skills detail

Primary responsibility: show how methods affected a real implementation and how the outcome was verified.

Preserve immutable identifiers, CI run numbers, commit SHAs, links, counts, constraints, and evidence classifications. Editorial improvements may restructure or humanize the surrounding explanation but must not silently strengthen claims.

### Roadmap

Primary responsibility: explain current product state, maturity, evidence coverage, and future work without making Stable status synonymous with universal skill maturity or full pack validation.

The existing distinction between Stable release status, skill maturity, and current real-use pack representation is protected.

### About

Primary responsibility: explain why the collection exists, the design principles behind it, and what distinguishes it from a prompt repository.

Avoid repeating the Home pitch. This is the place for product philosophy and operating principles.

### Contribute

Primary responsibility: make contribution expectations and the quality bar actionable.

The page should tell contributors what belongs in the collection, what evidence is expected, how scope is judged, and where to begin.

### Changelog

Primary responsibility: communicate product changes with factual, scannable release context.

Do not convert release notes into promotional prose.

### Header, navigation, and footer

Primary responsibility: orientation and movement.

Labels should be short, stable, and predictable. Editorial navigation descriptors may carry personality only when they do not compete with the actual destination label.

### Metadata and SEO copy

Primary responsibility: describe the page accurately outside the product UI.

Titles and descriptions should communicate topic and value without keyword stuffing or claims that exceed the page.

### Error, empty, and not-found states

Primary responsibility: explain state and recovery.

Copy must distinguish no-results, invalid slug, missing content, and actual failure where the UI already distinguishes those states. Recovery labels should name the useful next destination or action.

## Copy ownership and source boundaries

The audit covers public-facing copy in the microsite, including current localized or editorial copy domains such as:

- `apps/web/src/lib/messages.ts`;
- `apps/web/src/lib/home-content.ts`;
- `apps/web/src/lib/home-evidence-content.ts`;
- `apps/web/src/lib/editorial-*-copy.ts`;
- site chrome/navigation copy domains;
- `apps/web/src/lib/project-pages.ts` or equivalent project-page copy;
- `apps/web/src/lib/built-with-skills.ts` reader-facing case copy;
- roadmap reader-facing copy;
- page-local strings where they are genuinely public copy;
- metadata and not-found/error copy.

Implementation planning must first inventory the exact current files from `main`; this design names domains rather than freezing a stale file list.

### Protected sources

This tranche must not rewrite merely for tone:

- canonical `skills/*/SKILL.md` method instructions;
- catalog facts that define technical behavior or taxonomy;
- canonical slugs;
- installer commands;
- URLs;
- project names;
- version strings;
- dates;
- commit SHAs;
- CI run identifiers;
- evidence classifications;
- test counts and other verified numbers;
- Stable release qualification history;
- `release/stable-readiness.json` historical evidence.

If a protected source is surfaced in UI, surrounding presentation copy may change but the factual payload remains intact.

## Method assignment

The Writing & Communication pack is used as a pipeline rather than applying every skill indiscriminately to every string.

### `planning-written-communication`

Owns the surface brief: audience, objective, evidence, protected facts, channel constraints, information order, and success check.

### `writing-conversion-copy`

Owns decision-oriented surfaces where the reader is deciding whether to explore or adopt the collection. Primary scope: Home positioning, high-level discovery CTAs, and any explicit adoption-oriented section.

It must not take ownership of operational UI or manufacture proof.

### `writing-product-and-ux-copy`

Owns navigation labels, filters, buttons, installation instructions, empty states, not-found/error recovery, and other text that predicts product state or action.

### `editing-for-clarity-and-tone`

Owns factual/editorial prose that already has the correct purpose but is too dense, repetitive, abstract, inconsistent, or awkward.

### `humanizing-generated-prose`

Owns pattern-level revision where text is recognizably generic or AI-shaped. It must preserve the factual payload and does not invent anecdotes, personality, user research, or informal filler.

## Audit rubric

Every in-scope surface should be assessed against the same criteria.

### Clarity

- Can an unfamiliar reader identify the page's purpose quickly?
- Are concrete nouns and verbs used where possible?
- Are prerequisites explained before dependent actions?

### Differentiation

- Does the copy explain why a skill is different from a prompt or generic instruction when that distinction matters?
- Does it avoid claims that could apply to any AI tooling product?

### Decision support

- Is the primary next action clear?
- Are meaningful objections or uncertainties resolved near the decision?
- Does the CTA label match the actual next state?

### Evidence integrity

- Is every material factual claim supported by repository/product evidence?
- Are Stable status, skill maturity, pack representation, and dedicated real-use validation kept distinct?
- Are numbers derived where production already derives them?

### UX consistency

- Is the same concept named the same way across pages?
- Are states and consequences clear without relying on color, position, or iconography?
- Does localized copy remain semantically equivalent?

### Human editorial quality

- Does the text avoid generic generated rhythm?
- Is repetition serving emphasis rather than filling space?
- Do sections have enough asymmetry to feel authored while remaining coherent?

### Density

- Is the page saying something new in each section?
- Can redundant copy be removed without losing evidence, action, or nuance?

## Testing strategy

Copy changes must not rely on broad snapshots as the primary contract.

Tests should protect semantic behavior and high-value wording boundaries:

- localized page identity and primary actions;
- critical headlines or product-definition statements where they are intentional durable positioning;
- derived numeric facts rather than hard-coded stale counts;
- EN/PT-BR semantic parity for key actions and states;
- exact protected identifiers/URLs/commands where mutation would change behavior or evidence;
- no regression in page routes, links, catalog resolution, metadata structure, accessibility labels, or state behavior.

Use RED → GREEN for changed contracts: update/add focused assertions first, capture the intended failure against current production copy, then implement the rewrite.

Tests must not freeze every paragraph verbatim. The copy system should remain editable without requiring a test rewrite for harmless punctuation or sentence-level refinements.

## Implementation slices

The implementation plan should divide the sitewide rewrite into reviewable editorial slices rather than one massive text replacement.

Recommended dependency order:

1. establish shared terminology and product-definition contracts;
2. rewrite Home and shared site chrome;
3. rewrite Skills and Packs discovery/detail surfaces;
4. rewrite Getting Started and operational UX copy;
5. rewrite Built with Skills evidence surfaces;
6. rewrite Roadmap and project/institutional pages;
7. audit metadata, not-found/error/empty states, and remaining page-local strings;
8. run a final cross-locale terminology, repetition, protected-fact, and dead-copy audit.

Each slice must be independently testable and reviewable before proceeding.

## Verification contract

The final candidate must prove:

- all intended public surfaces were inventoried;
- the method-versus-prompt positioning remains the durable product thesis;
- Home is understandable without prior Agent Skills architecture knowledge;
- progressive technical depth remains available for builders;
- primary CTAs describe actual next actions;
- EN and PT-BR preserve factual and action parity while sounding native;
- verified counts and evidence identifiers remain correct;
- Stable `1.0.0` semantics and historical release evidence remain unchanged;
- canonical skills, slugs, commands, URLs, and evidence records are not silently rewritten;
- root tests and repository/catalog validation pass;
- web tests, typecheck, lint, and production build pass on the repository's canonical CI runners.

A final manual editorial review should read the site in page-flow order rather than file order to catch repetition and hierarchy problems that unit tests cannot detect.

## Non-goals

- No visual redesign in this tranche. UI refinement is a separate approved follow-up project after copy stabilizes.
- No new pages or product features unless a copy issue reveals a genuinely missing product state; such a discovery must be scoped separately.
- No skill maturity promotions.
- No pack membership/status changes.
- No changes to `VERSION`, tags, GitHub Releases, Stable status, or historical Stable evidence.
- No rewrite of canonical `SKILL.md` instructions merely to match marketing voice.
- No fabricated proof, customer evidence, adoption metrics, urgency, guarantees, or comparative superiority claims.
- No SEO keyword-stuffing project.
- No broad refactor of localization architecture unless current structure makes the approved rewrite materially unsafe; that would require a scope upgrade.

## Merge policy

Implementation must occur on a dedicated branch and PR with TDD evidence and canonical CI verification. Do not merge any implementation PR without explicit user authorization.
