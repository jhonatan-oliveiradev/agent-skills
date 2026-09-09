# Career Lab Guidance System — Design

Date: 2026-09-09
Status: Approved direction, pending written-spec review
Base: `main` @ `a9d7f1e5471086a03fe908e377c46e2bfa5bf684`

## Problem

The Career Lab now has a coherent editorial identity, but the filled-profile experience is still harder to understand than it should be. The visual language is strongest on Roadmap and acceptable on Evidence and Market, but the product does not consistently answer four questions for the user:

1. What should I do now?
2. Why should I do it?
3. What changes after I complete it?
4. Where do I go if I do not understand a concept or workflow?

The existing `CareerOnboarding` is a profile-setup flow, not a product onboarding flow. It collects context, target role, target market and weekly capacity, then creates the local Career Profile. After that, users are dropped into the workspace with no explicit product-level orientation.

The screenshots from the filled-profile audit also exposed visual inconsistencies:

- Assessments currently renders close to unstyled document content and is visually far below the quality of the other Career Lab surfaces.
- Overview is informative but mostly descriptive; it exposes readiness, roadmap, evidence and market state without making the next action dominant.
- Internal competency and milestone identifiers are too prominent for end users.
- Evidence and Market have large empty areas and weak empty-state guidance.
- Export / import / reset have too much visual parity with primary navigation despite being secondary utilities.
- The product lacks a persistent, discoverable help surface.

## Design goal

Turn Career Lab into a self-explanatory editorial workbench without turning it into a generic SaaS dashboard or adding an AI chat layer.

The interface should make the career loop legible as:

`Set profile → establish baseline → follow current roadmap focus → produce evidence → compare against market → return to overview`

At every meaningful state, the user should be able to understand the current recommendation and the reason for it.

## Non-goals

This project does not:

- change Career Profile schema semantics;
- change readiness, roadmap, assessment, evidence or market engines;
- introduce cloud persistence or accounts;
- introduce an AI assistant or free-form chatbot;
- alter public URL semantics outside the addition of a help/guide route;
- redesign the full Agent Skills Studio shell;
- change catalog, versioning, packs or distribution behavior.

## Product model

### 1. Profile setup remains separate

The current four-step Career Profile setup remains responsible only for profile creation:

- context;
- target role;
- target market and weekly capacity;
- review / create profile.

It must not become overloaded with product education.

### 2. Product onboarding is a separate first-run orientation

After a profile is created for the first time, Career Lab opens a short product orientation that explains the operating model:

1. **Assess** — establish a baseline.
2. **Roadmap** — follow the current highest-priority milestone.
3. **Evidence** — prove capability with inspectable artifacts.
4. **Market** — compare against real job demand.
5. **Overview** — use readiness and gaps to decide what changes next.

Behavior:

- opens automatically once after profile creation;
- can be skipped;
- can be reopened from the Guide at any time;
- completion state is stored separately from the Career Profile;
- does not block navigation after dismissal.

### 3. Persistent Guide / Q&A

Add a new localized route:

- `/{locale}/career-lab/guide`

The Guide is not part of the numbered five-step career workflow. It is a secondary support surface available from the Career Lab shell.

The page has four sections:

#### Start here

Explains the five-stage operating loop and where a new user should begin.

#### How each area works

Short operational explanations for:

- Overview;
- Roadmap;
- Assessments;
- Evidence;
- Market.

Each explanation answers:

- purpose;
- when to use it;
- what counts as completion;
- what changes afterward.

#### Q&A

Initial deterministic questions:

- Where do I start?
- Why is my readiness 0%?
- What is a baseline assessment?
- Do I need to complete every assessment before using the roadmap?
- What counts as professional evidence?
- Why does Career Lab ask for a real job description?
- Do I need to register multiple jobs?
- What changes the roadmap?
- What changes readiness?
- Where is my data stored?
- What do export, import and reset do?
- Can I restart the product onboarding?

Q&A is static/localized content, rendered as accessible disclosure sections. No network request or generative answer is required.

#### Restart orientation

A clear action reopens the product onboarding.

## Guidance architecture

### Derived next action

Introduce a pure deterministic selector, conceptually:

`getCareerNextAction(profile)`

It returns a presentation-safe recommendation based only on existing profile state.

Initial precedence:

1. required baseline assessment incomplete → complete baseline;
2. no active/current roadmap focus → review roadmap;
3. current focus has no supporting evidence → produce evidence;
4. no market sample exists → add a real market sample;
5. otherwise → continue current roadmap milestone / revisit overview.

The selector must not mutate profile state and must not duplicate engine logic. It can use existing readiness, roadmap and assessment-derived state as inputs.

Returned shape should stay small, for example:

- `kind`;
- localized-title key or presentation token;
- destination route;
- optional contextual identifiers needed for copy;
- reason token.

### Guidance state

Do not add onboarding completion to the Career Profile schema.

Use a small local-first guidance state with a versioned storage key, conceptually:

`career-lab:guidance:v1`

Minimum state:

- `orientationCompleted: boolean`;
- `orientationDismissed: boolean` if needed to distinguish skip from completion.

A versioned key allows future onboarding revisions without corrupting Career Profile imports/exports.

### Shared components

Target component boundaries:

- `CareerNextAction` — renders the current deterministic recommendation.
- `CareerProductOrientation` — first-run/reopenable onboarding experience.
- `CareerGuide` — Guide page content and Q&A.
- `CareerGuidanceProvider` or a small storage hook — owns only guidance UI state, not Career Profile data.
- `CareerSectionGuidance` — optional compact reusable explanation block for Roadmap, Assessments, Evidence and Market.

Avoid one large all-purpose guidance component.

## Shell changes

The primary numbered navigation remains:

1. Visão geral / Overview
2. Roadmap
3. Avaliações / Assessments
4. Evidências / Evidence
5. Mercado / Market

Add **Guia / Guide** as a secondary utility, visually separated from the numbered workflow.

Data controls should become secondary utilities rather than equal-weight primary actions:

- Export profile;
- Import profile;
- Reset profile.

Reset remains explicit and visually treated as a destructive/rare action.

The current local-first explanation should be reduced from a dominant repeated sentence to a compact persistent indicator with accessible explanatory copy.

## Surface-specific visual improvements

### Overview

Current strengths:

- strong editorial hero;
- clear readiness score;
- consistent ledger language.

Changes:

- add `CareerNextAction` directly below the hero/state summary;
- humanize roadmap milestone and competency labels;
- preserve technical IDs as secondary metadata only;
- reduce duplication between competency-state and blocking-gap ledgers;
- convert empty metrics into actionable states where appropriate.

The next action must become the strongest operational element below the identity/readiness hero.

### Assessments

This is the highest-priority visual repair.

Transform the current plain list into a deliberate editorial assessment index with:

- concise hero/introduction;
- explanation of what baseline means;
- ordered assessment rows;
- human-readable competency/dimension title;
- state: not started / completed;
- concise purpose;
- primary action to start or review;
- progress summary across required baselines.

Do not use a card grid. Prefer ledger / index rows consistent with Career Lab.

### Roadmap

Preserve the existing design direction.

Add only a compact section-level guide that explains:

- why this milestone is current;
- what counts as done;
- where evidence should be registered.

Avoid adding extra visual chrome to the roadmap map itself.

### Evidence

Current form is visually strong but conceptually demanding.

Changes:

- explain “evidence contract” in plain language before the detailed contract;
- make the empty ledger useful with an explanation and example of accepted evidence;
- clarify that evidence should support the current roadmap focus;
- keep provenance/verification emphasis.

### Market

The existing screen visually merges three ingestion paths.

Reframe them explicitly as separate methods:

1. Fetch by URL;
2. Paste job description;
3. Import compatible analysis JSON.

Only one path needs to be visually primary at a time; the others remain clearly available but secondary.

Explain why a small real sample is useful and how it affects interpretation rather than implying that more data is always better.

## Copy principles

Career Lab guidance copy should be:

- operational rather than motivational;
- short;
- evidence-oriented;
- specific about cause and effect;
- free of gamification language;
- localized in EN and PT-BR from the first implementation slice.

Prefer:

> Complete the JavaScript baseline so Career Lab can replace unknown competency states with evidence-backed levels.

Avoid:

> Keep going! Complete your assessment to unlock your potential.

## Accessibility

- Product orientation must be keyboard navigable and dismissible.
- It must not depend on visual spotlight overlays to communicate structure.
- Guide Q&A must use native/accessible disclosure semantics.
- Current navigation and current step must expose semantic state.
- Next-action reason and destination must be understandable without color.
- Focus must be managed when orientation opens/closes.
- Reduced-motion preferences must be respected if any transition is introduced.

## Testing strategy

Every implementation slice follows RED → GREEN.

Required coverage:

### Unit / pure logic

- deterministic next-action precedence;
- no mutation of profile;
- guidance-state storage versioning and default behavior.

### Component

- orientation opens only when expected;
- orientation can skip, complete and reopen;
- Guide renders EN/PT-BR content and all core Q&A items;
- shell exposes Guide separately from numbered workflow;
- Overview next action changes as profile state changes;
- Assessments renders structured states and localized labels;
- Evidence and Market contextual guidance appears without changing engine behavior.

### Regression

- existing Career Profile import/export remains compatible;
- existing roadmap/readiness/assessment/evidence/market engine tests remain unchanged and green;
- all current public Career Lab routes continue to build;
- local-first storage errors remain accessible.

### Visual QA

Required manual screenshots after each visual slice at minimum:

- desktop wide;
- tablet or narrow desktop;
- mobile.

Priority screens:

- Overview with incomplete baseline;
- Assessments index;
- Roadmap current milestone;
- Evidence empty state;
- Market empty state;
- Guide;
- first-run product orientation.

## Implementation slices

### Slice 1 — Assessment visual foundation

Purpose: repair the weakest current screen before layering more guidance.

Scope:

- structured assessment index;
- baseline explanation;
- assessment progress/status presentation;
- EN/PT-BR;
- dedicated styles consistent with Career Lab ledger language.

No guidance persistence yet.

### Slice 2 — Guide + Q&A + shell entry

Scope:

- `/career-lab/guide` route;
- static localized Q&A;
- Guide entry in shell, outside numbered workflow;
- secondary treatment of data controls/local-first utility copy.

### Slice 3 — Product onboarding first run

Scope:

- guidance storage v1;
- product orientation;
- auto-open once after profile creation;
- skip/complete/reopen behavior;
- restart from Guide.

### Slice 4 — Deterministic next action

Scope:

- pure next-action selector;
- Overview current recommendation;
- destination CTA and reason;
- humanized current milestone label where touched.

### Slice 5 — Contextual guidance on working surfaces

Scope:

- Roadmap guidance;
- Evidence guidance + stronger empty state;
- Market ingestion-path hierarchy + guidance.

### Slice 6 — Overview humanization and visual polish

Scope:

- human-readable competency names;
- technical IDs demoted to metadata;
- competency/gap information architecture cleanup;
- final spacing, density and responsive QA across the Career Lab.

## Acceptance criteria

The design is complete when a new user with a freshly created profile can answer, without outside documentation:

- what to do first;
- why readiness may be low or zero;
- what baseline assessments are for;
- what the roadmap expects now;
- what counts as evidence;
- how market samples are used;
- where to get help;
- how to restart orientation;
- where their data lives;
- how to export/import/reset safely.

A returning user should be able to land on Overview and identify the recommended next action within the first viewport.

The final Career Lab must preserve its editorial workbench identity: structured type, restrained color, ledger-like information architecture and explicit state, without adopting a generic card-heavy SaaS dashboard.
