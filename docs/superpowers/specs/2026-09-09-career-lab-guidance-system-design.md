# Career Lab Guidance System — Design

Date: 2026-09-09
Status: Approved direction, pending written-spec review
Base: `main` @ `a9d7f1e5471086a03fe908e377c46e2bfa5bf684`

## Problem

Career Lab now has a coherent editorial identity, but the filled-profile experience is still harder to understand than it should be. The product does not consistently answer four questions:

1. What should I do now?
2. Why should I do it?
3. What changes after I complete it?
4. Where do I go if I do not understand a concept or workflow?

The existing `CareerOnboarding` is a profile-setup flow, not product onboarding. It collects context, target role, target market and weekly capacity, creates the local Career Profile, then sends the user into the workspace without teaching the operating model.

The filled-profile visual audit exposed the following gaps:

- Assessments renders close to unstyled document content and is visually far below the other Career Lab surfaces.
- Overview is informative but mostly descriptive; readiness, roadmap, evidence and market state are visible without a dominant next action.
- Internal competency and milestone identifiers are too prominent for end users.
- Evidence and Market have weak empty-state guidance and large low-value empty areas.
- Export / import / reset have too much visual parity with primary navigation despite being secondary utilities.
- The product lacks a persistent, discoverable help surface.

## Design goal

Turn Career Lab into a self-explanatory editorial workbench without turning it into a generic SaaS dashboard or adding an AI chat layer.

The career loop must be legible as:

`Set profile → establish baseline → follow current roadmap focus → produce evidence → compare against market → return to overview`

At every meaningful state, the interface should expose a recommended action and the reason for it.

## Non-goals

This project does not:

- change Career Profile schema semantics;
- change readiness, roadmap, assessment, evidence or market engines;
- introduce cloud persistence or accounts;
- introduce an AI assistant or free-form chatbot;
- change existing public Career Lab URL semantics outside the addition of a Guide route;
- redesign the full Agent Skills Studio shell;
- change catalog, versioning, packs or distribution behavior.

## Product model

### Profile setup remains separate

The current four-step profile setup remains responsible only for:

- context;
- target role;
- target market and weekly capacity;
- review / create profile.

It must not become overloaded with product education.

### Product onboarding becomes a separate first-run orientation

After a profile is created for the first time, Career Lab opens a short orientation explaining the operating model:

1. **Assess** — establish a baseline.
2. **Roadmap** — follow the current highest-priority milestone.
3. **Evidence** — prove capability with inspectable artifacts.
4. **Market** — compare against real job demand.
5. **Overview** — use readiness and gaps to decide what changes next.

Behavior:

- opens automatically only when guidance state is `unseen` and a Career Profile exists;
- can be skipped;
- can be completed;
- never blocks navigation after skip or completion;
- can be reopened from the Guide at any time;
- remains separate from Career Profile import/export.

### Persistent Guide / Q&A

Add a localized route:

- `/{locale}/career-lab/guide`

Guide is not a sixth numbered career step. It is a secondary support surface exposed by the Career Lab shell.

The page contains four sections.

#### Start here

Explains the five-stage operating loop and where a new user should begin.

#### How each area works

For Overview, Roadmap, Assessments, Evidence and Market, explain:

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

Q&A is static localized content rendered with native accessible disclosure semantics. It performs no network requests and does not generate answers dynamically.

#### Restart orientation

A clear action opens the product orientation again. Reopening does not require clearing Career Profile data.

## Guidance architecture

### Deterministic next action

Introduce a pure selector, conceptually:

`getCareerNextAction(profile)`

It must not mutate profile state and must reuse existing engine outputs instead of recreating readiness or roadmap rules.

Initial precedence:

1. any required baseline blueprint is incomplete → complete the next incomplete baseline;
2. no current roadmap focus exists → review roadmap;
3. current roadmap focus exists but the profile has no evidence attached to the competency or competencies targeted by that focus → produce evidence;
4. no market sample exists → add a real market sample;
5. otherwise → continue the current roadmap focus and revisit Overview after new evidence/assessment/market input.

The selector returns only presentation-safe data:

- `kind`;
- destination route;
- reason token;
- optional blueprint, milestone or competency identifiers required to resolve localized copy.

Technical identifiers may be carried internally but must not be the primary user-facing label.

### Guidance state

Do not add product-onboarding state to `CareerProfile`.

Use a separate local-first versioned storage key:

`career-lab:guidance:v1`

Stored shape:

```ts
{
  orientationStatus: "unseen" | "completed" | "skipped"
}
```

Rules:

- missing/invalid storage defaults to `unseen`;
- profile creation + `unseen` triggers automatic orientation;
- Skip writes `skipped`;
- Complete writes `completed`;
- neither `skipped` nor `completed` auto-opens again;
- Guide can force-open orientation transiently without first rewriting storage;
- completing a reopened orientation writes `completed`;
- skipping a reopened orientation preserves the existing terminal state when one already exists.

Versioning permits a future onboarding revision to use a new key without corrupting Career Profile imports/exports.

### Component boundaries

Target boundaries:

- `CareerNextAction` — renders the deterministic recommendation.
- `CareerProductOrientation` — first-run/reopenable product orientation.
- `CareerGuide` — Guide page and Q&A content.
- `CareerGuidanceProvider` or a small storage hook — owns guidance UI state only.
- `CareerSectionGuidance` — optional compact explanation block shared by working surfaces where useful.

Avoid one all-purpose guidance component and keep Career Profile state ownership unchanged.

## Shell changes

Keep numbered primary navigation:

1. Overview / Visão geral
2. Roadmap
3. Assessments / Avaliações
4. Evidence / Evidências
5. Market / Mercado

Add **Guide / Guia** as a visually separate secondary utility. Guide must expose active-route semantics when visited but must not receive a workflow number.

Data controls become secondary utilities:

- Export profile;
- Import profile;
- Reset profile.

Reset remains explicit and visually destructive/rare rather than looking like a normal navigation action.

Reduce the repeated long local-first sentence to a compact persistent local-first indicator with accessible explanatory copy.

## Surface-specific improvements

### Overview

Preserve the strong editorial hero and readiness score.

Changes:

- place `CareerNextAction` directly below the hero/state summary;
- make it the strongest operational element below identity/readiness;
- humanize current milestone and competency labels;
- demote technical IDs to secondary metadata;
- reduce duplication between competency-state and blocking-gap ledgers;
- turn empty metrics into actionable states where appropriate.

### Assessments

Highest-priority visual repair.

Replace the plain list with an editorial assessment index:

- concise hero/introduction;
- plain-language explanation of baseline;
- overall required-baseline progress;
- ordered assessment rows;
- human-readable title/dimension;
- state: not started / completed;
- concise purpose;
- action: start / review result.

Use ledger/index rows, not a card grid.

### Roadmap

Preserve the current visual direction.

Add only compact contextual guidance explaining:

- why the current milestone is current;
- what counts as done;
- where resulting evidence should be registered.

Do not add heavy chrome to the roadmap map.

### Evidence

Keep the existing provenance/verification emphasis.

Changes:

- explain “evidence contract” in plain language before the detailed contract;
- make an empty ledger teach what acceptable evidence looks like;
- relate evidence explicitly to the current roadmap focus;
- avoid presenting an empty second column as finished content.

### Market

Separate the three ingestion methods visually and semantically:

1. Fetch by URL;
2. Paste job description;
3. Import compatible analysis JSON.

One path may be primary; the others remain clearly available but secondary.

Explain why a small real sample is useful and how market input affects interpretation. Do not imply that collecting maximum volume is the goal.

## Copy principles

Guidance copy is:

- operational rather than motivational;
- short;
- evidence-oriented;
- explicit about cause and effect;
- free of gamification language;
- localized in EN and PT-BR from the first implementation slice.

Prefer:

> Complete the JavaScript baseline so Career Lab can replace unknown competency states with evidence-backed levels.

Avoid:

> Keep going! Complete your assessment to unlock your potential.

## Accessibility

- Orientation is keyboard navigable and dismissible.
- Orientation cannot depend on spotlight overlays to communicate structure.
- Q&A uses native/accessible disclosure semantics.
- Current route and current step expose semantic state.
- Next-action reason and destination remain understandable without color.
- Focus is managed when orientation opens/closes.
- Reduced-motion preferences are respected for any introduced transition.

## Testing strategy

Every implementation slice follows RED → GREEN.

### Unit / pure logic

- next-action precedence;
- next-action selector does not mutate profile;
- guidance-state default/version behavior;
- guidance-state skip/complete/reopen rules.

### Component

- orientation auto-opens only for `unseen` + existing profile;
- orientation can skip, complete and reopen;
- Guide renders EN/PT-BR content and core Q&A;
- shell exposes Guide separately from numbered workflow;
- Overview next action changes with profile state;
- Assessments renders structured localized status rows;
- Evidence and Market guidance appears without changing engine behavior.

### Regression

- Career Profile import/export remains compatible;
- roadmap/readiness/assessment/evidence/market engine tests stay green;
- all existing Career Lab routes continue to build;
- local-first storage errors remain accessible.

### Visual QA

Manual screenshots after each visual slice at minimum:

- desktop wide;
- tablet/narrow desktop;
- mobile.

Priority screens:

- Overview with incomplete baseline;
- Assessments index;
- Roadmap current milestone;
- Evidence empty state;
- Market empty state;
- Guide;
- first-run orientation.

## Implementation slices

### Slice 1 — Assessment visual foundation

- structured assessment index;
- baseline explanation;
- assessment progress/status presentation;
- EN/PT-BR;
- dedicated styles consistent with Career Lab ledger language.

No guidance persistence in this slice.

### Slice 2 — Guide + Q&A + shell entry

- `/{locale}/career-lab/guide`;
- static localized Q&A;
- Guide entry outside numbered workflow;
- secondary treatment of data controls/local-first utility copy.

### Slice 3 — Product onboarding first run

- guidance storage v1;
- product orientation;
- auto-open once after profile creation;
- skip/complete/reopen behavior;
- restart from Guide.

### Slice 4 — Deterministic next action

- pure next-action selector;
- Overview recommendation;
- route CTA and reason;
- humanized current milestone label where touched.

### Slice 5 — Contextual guidance on working surfaces

- Roadmap guidance;
- Evidence guidance + stronger empty state;
- Market ingestion hierarchy + guidance.

### Slice 6 — Overview humanization and visual polish

- human-readable competency names;
- technical IDs demoted to metadata;
- competency/gap information architecture cleanup;
- final spacing, density and responsive QA across Career Lab.

## Acceptance criteria

A new user with a freshly created profile can determine, without outside documentation:

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

A returning user can land on Overview and identify the recommended next action within the first viewport.

The final Career Lab preserves its editorial workbench identity: structured type, restrained color, ledger-like information architecture and explicit state, without becoming a generic card-heavy SaaS dashboard.
