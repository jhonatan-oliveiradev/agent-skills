# Career Lab Learning System

Date: 2026-09-11
Status: Design approved in conversation; written spec awaiting final review
Repository: `jhonatan-oliveiradev/agent-skills`
Base: `main` at `899dd7641b6a56b1839e675599b9207c459e7867`

## Goal

Evolve Career Lab from a primarily diagnostic and planning workspace into an evidence-led developer career development system that helps users answer five connected questions:

1. Where am I now?
2. What do I need to strengthen?
3. What should I study and practice next?
4. How do I prove that capability?
5. How does that progress relate to my target role and market?

The product loop becomes:

`Assess -> Understand -> Learn -> Practice -> Prove -> Calibrate`

Career Lab must remain local-first, deterministic where it interprets user state, explainable in its recommendations, and explicit about the distinction between studying something and demonstrating proficiency.

The intended product promise is:

> Assess. Learn. Practice. Prove. Grow.

PT-BR:

> Avalie. Aprenda. Pratique. Comprove. Evolua.

## Product principles

### Learning is not evidence

Studying a topic, reading a Learning Note, completing a practice prompt, or marking a module complete records **learning progress only**.

Learning progress must never:

- create an `EvidenceRecord`;
- raise competency level;
- increase evidence confidence;
- increase readiness directly;
- complete a roadmap milestone by itself.

A capability is proved only through an assessment or an accepted evidence path.

The UI must make this separation visible. A user may legitimately be in a state such as:

`Studied · Not yet proved`

### Career Lab teaches, but does not claim to be the primary authority

Career Lab may provide concise explanations, examples, mistakes to avoid, exercises, and consolidation criteria. Technical claims must be anchored to curated sources.

The system distinguishes four responsibilities:

- **Source says** — externally supported technical knowledge;
- **Career Lab explains** — curated pedagogical synthesis;
- **Career Lab proposes** — an example, exercise, or practice activity;
- **Career Lab evaluates** — a deterministic interpretation against Career Lab competency criteria.

### Context before catalog

Learning should appear first where it is useful: after an assessment gap, in the current roadmap focus, or in the Overview next action.

A permanent Learning area also exists for deliberate exploration. The product is not an LMS and should not make the user browse a course catalog before understanding why something matters.

### Explainable recommendations

Every contextual recommendation must be traceable to a deterministic reason such as:

- a failed or weak assessment criterion;
- a blocking capability gap;
- a current roadmap milestone;
- an unmet prerequisite;
- the next required competency for the target role.

No runtime LLM decides what to recommend in V1 of this system.

## Information architecture

The primary Career Lab navigation becomes:

1. **Overview** / **Visão geral**
2. **Assessments** / **Avaliações**
3. **Learning** / **Aprendizado**
4. **Roadmap**
5. **Evidence** / **Evidências**
6. **Market** / **Mercado**

The Guide remains an unnumbered utility outside the primary workflow.

Localized routes:

- `/{locale}/career-lab`
- `/{locale}/career-lab/assessments`
- `/{locale}/career-lab/assessments/[id]`
- `/{locale}/career-lab/learning`
- `/{locale}/career-lab/learning/[noteId]`
- `/{locale}/career-lab/roadmap`
- `/{locale}/career-lab/evidence`
- `/{locale}/career-lab/market`
- `/{locale}/career-lab/guide`

Public Career Lab URLs that already exist remain valid. This design adds Learning and reorders navigation; it does not rename existing routes.

## Product language and identity

Career Lab should continue using its editorial, technical visual language. The change is not toward a colorful SaaS dashboard or gamified course product.

The shell should communicate the product as a developer career development workspace rather than only a reporting workspace.

Recommended product statement:

> A local-first workspace to understand your capabilities, learn what is missing, and turn growth into professional evidence.

PT-BR:

> Um workspace local-first para entender suas capacidades, aprender o que falta e transformar evolução em evidência profissional.

Language throughout the product should favor progression verbs such as:

`Understand -> Study -> Practice -> Prove -> Reassess`

rather than only report labels such as `Strong signals` and `Weak signals`.

## Learning content model

Career Lab has 14 canonical competencies. The learning system uses a hybrid content model:

- one **Core Note** per canonical competency;
- modules inside each Core Note map to competency criteria and proficiency levels;
- a gap can deep-link directly to the relevant module;
- a module may later become an independent note when its scope genuinely requires it.

This avoids both extremes:

- one broad note that is too vague for a specific gap;
- dozens of independent mini-courses that are expensive to curate and review.

### Learning Note

Conceptual contract:

```ts
interface LearningNote {
  id: string;
  competencyId: CompetencyId;
  title: LocalizedText;
  summary: LocalizedText;
  objective: LocalizedText;
  estimatedMinutes: number;
  contentVersion: string;
  reviewStatus: "draft" | "reviewed";
  reviewedAt: string;
  modules: LearningModule[];
}
```

Only `reviewed` content is visible in the production learning experience.

### Learning Module

Each module maps to one canonical criterion.

```ts
interface LearningModule {
  id: string;
  criterionId: string;
  level: ProficiencyLevel;
  title: LocalizedText;
  estimatedMinutes: number;
  understand: LocalizedRichContent;
  example?: LocalizedCodeExample;
  commonMistake: LocalizedRichContent;
  practice: LocalizedPractice;
  consolidationCriteria: LocalizedText[];
  sourceIds: string[];
}
```

The required pedagogical sequence is:

1. **Understand / Entenda** — concise explanation;
2. **See / Veja** — practical example or code when relevant;
3. **Avoid / Evite este erro** — common failure mode or misconception;
4. **Practice / Pratique** — a concrete exercise;
5. **Consolidated when / Você consolidou quando...** — observable understanding criteria;
6. **Sources / Fontes** — the references supporting the technical claims.

The content should be small enough to use inside a career workflow, not a long-form curriculum.

## Source model and content governance

### Learning Source

Sources are cataloged separately from prose so provenance is reusable and auditable.

Conceptual contract:

```ts
interface LearningSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  authority: "primary" | "recognized-institutional" | "recognized-pedagogical";
  volatility: "high" | "medium" | "low";
  reviewedAt: string;
  supportsCriterionIds: string[];
}
```

### Authority rules

When a suitable primary source exists, every reviewed module must cite at least one.

Examples of preferred primary sources include:

- official language and framework documentation;
- standards and specifications;
- MDN/W3C/WHATWG where appropriate;
- TypeScript Handbook;
- React documentation;
- Node.js documentation;
- PostgreSQL documentation;
- Git documentation.

Recognized institutional and pedagogical sources may supplement primary material, especially when they improve explanation, but should not replace a suitable primary source for a central technical claim.

### Editorial rules

A module is publishable only when:

- it maps to a canonical `criterionId`;
- EN and PT-BR content are present;
- technical claims have source coverage;
- at least one primary source is present when one reasonably exists;
- `contentVersion` is defined;
- `reviewStatus` is `reviewed`;
- `reviewedAt` is present;
- all referenced sources exist;
- all source-to-criterion mappings are valid.

Catalog validation should enforce these structural contracts.

### Review freshness

Review cadence depends on source volatility rather than one global expiration window:

- `high` — frameworks, fast-moving APIs, active tooling;
- `medium` — ecosystem practices and libraries with gradual evolution;
- `low` — stable language concepts, standards, and fundamentals.

Stale content should be flagged for maintenance. It must not silently disappear or make the whole product unavailable merely because a review date passed.

### Runtime AI policy

Career Lab does not dynamically generate technical lessons at runtime.

AI may assist maintainers with research, drafting, comparison, or editorial review outside the product runtime. What users see must be versioned, reviewable repository content.

## Learning progress model

Learning progress is first-class user state and travels with Career Profile export/import.

Conceptual contract:

```ts
interface LearningProgressRecord {
  noteId: string;
  startedAt: string;
  updatedAt: string;
  currentModuleId: string | null;
  completedModuleIds: string[];
  completedPracticeIds: string[];
  completedAt: string | null;
}
```

The profile stores progress references and timestamps, not copies of lesson content or source text.

A user can therefore retain progress after catalog content is edited without freezing obsolete content into their profile.

## Career Profile schema v2

Career Profile evolves from schema `"1"` to schema `"2"` and adds learning progress.

Conceptual shape:

```ts
interface CareerProfile {
  schemaVersion: "2";
  targetRoles: TargetRoleId[];
  targetMarkets: string[];
  weeklyStudyHours: number | null;
  competencies: CompetencyState[];
  assessments: AssessmentRecord[];
  roadmap: RoadmapState;
  learningProgress: LearningProgressRecord[];
  evidence: EvidenceRecord[];
  marketSamples: MarketSample[];
  decisionRecords: DecisionRecord[];
  createdAt: string;
  updatedAt: string;
}
```

There is no production user base requiring preservation of historical V1 profiles. Even so, the existing migration boundary should be kept and a minimal deterministic V1 -> V2 migration should populate `learningProgress: []` rather than introducing an unnecessary hard reset.

The migration is a compatibility convenience, not a release gate for historical user data.

The Agent Skills Studio public product version is independent of the Career Profile schema version.

## Learning progress semantics

The supported user-facing states are:

- `not-started`;
- `in-progress`;
- `studied`.

These states describe consumption/practice progress only.

They must not be represented using proficiency terminology such as `proficient`, `mastered`, or readiness percentages.

A completed module can display:

> Studied. Prove this capability through an assessment or evidence.

PT-BR:

> Conteúdo estudado. Comprove esta capacidade por uma avaliação ou evidência.

## Learning recommendation engine

The recommendation engine is deterministic and consumes existing Career Profile state plus the curated learning catalog.

A recommendation should expose both the destination and the reason.

Conceptual output:

```ts
interface LearningRecommendation {
  noteId: string;
  moduleId: string;
  criterionId: string;
  reason:
    | "blocking-gap"
    | "studied-not-proved"
    | "current-milestone"
    | "prerequisite"
    | "next-role-competency";
  priority: number;
}
```

Recommended priority order:

1. blocking gap not yet studied;
2. blocking gap already studied but not yet proved;
3. current roadmap milestone;
4. unmet prerequisite;
5. next relevant competency for the target role.

The engine must not recommend unrelated material solely to increase catalog engagement.

If no mapped module exists for a relevant criterion, the product should say that no curated study module is available rather than inventing one.

## Learning page

Route:

`/{locale}/career-lab/learning`

The page is not a generic course grid. Its hierarchy is:

### Recommended now

A single dominant recommendation derived from current profile state.

Example:

> **TypeScript application modeling**
> Recommended because your assessment found a gap in application-state modeling.
> 8 min in this module · 20 min Core Note
> Continue study ->

### Current learning path

Shows learning associated with blocking gaps, current roadmap focus, and unfinished recommended modules.

### Explore competencies

Lists the 14 Core Notes grouped by competency domain.

Each note uses learning-state language only:

- Not started;
- In progress · `2/4`;
- Studied.

No learning card displays a proficiency percentage.

## Core Note page

Route:

`/{locale}/career-lab/learning/[noteId]`

The Core Note uses an editorial reading layout with an internal module index.

When the user arrives from a contextual recommendation, the URL or route state deep-links to the relevant module. The rest of the note remains available.

The page should show:

- competency and note identity;
- estimated time;
- review/source status;
- module navigation;
- the pedagogical sequence for each module;
- visible source provenance;
- learning progress controls;
- a clear handoff to assessment or evidence.

Completing the final module marks the note `studied`, not proved.

## Assessment Result v2

The assessment completion screen should stop behaving like a passive terminal report.

Its hierarchy becomes:

### Diagnosis

Show observed level and confidence, followed by a short deterministic interpretation of the result.

### Demonstrated

Show the capabilities/signals the user demonstrated.

### Strengthen next

Show failed or weak criterion-level areas in user-facing language.

### Your next step

When a mapped learning module exists, the primary CTA should be contextual study rather than immediate retesting.

Example:

> **Study: Modeling impossible states with TypeScript**
> Recommended because this assessment found a gap in `programming-typescript.developing`.
> 8 min · primary source reviewed
> Study now ->

### Completion actions

The result screen also provides:

- **Review challenges** — revisit the completed attempt and its explanations;
- **Try again** — start a clean new attempt with a new stable shuffle;
- **Back to assessments** — return directly to the assessment index.

A retry must create a new attempt and must not overwrite the previous assessment record before the new attempt is completed.

When an actionable learning gap exists, `Study now` is the primary action; `Try again` is secondary to avoid encouraging answer memorization.

## Assessment review behavior

Review mode is read-only with respect to the completed attempt.

It should preserve the answer feedback and revealed explanations from the completed run where available. Reviewing does not create new evidence and does not mutate the prior result.

A new attempt starts only through `Try again`.

## Overview integration

Overview remains the recalibration surface for the entire system.

Its next-action logic may return a learning recommendation when study is the highest-priority action.

Capability rows should distinguish states such as:

- `Capability gap · Study`;
- `Studied · Needs proof`;
- `Evidence gap · Add evidence`;
- `Aligned`.

This distinction makes it clear whether the user lacks knowledge/practice or simply lacks proof.

Learning progress may be summarized in Overview, but should not be merged into the readiness percentage.

## Roadmap integration

Roadmap remains the sequencing layer rather than the content host.

A milestone may reference recommended learning modules and show whether they are:

- not started;
- in progress;
- studied.

Example:

> **Before proving this milestone**
> 2 recommended learning modules
> ✓ Async JavaScript control flow
> ○ TypeScript state modeling
> Continue learning ->

Learning completion does not complete the milestone. Roadmap completion still depends on its existing evidence/readiness rules.

The current `roadmap.supportingActivityId` mechanism should no longer be the canonical learning-progress store once Profile v2 exists. Roadmap should read `learningProgress` instead.

## Guide integration

Guide gains a section such as **How learning works / Como o aprendizado funciona** explaining:

- why study and proficiency are separate;
- how recommendations are produced;
- how sources are selected;
- what `reviewed` means;
- how to turn study into evidence;
- that Career Lab remains local-first.

This explanation should live primarily in Guide rather than repeating large disclaimers across every learning screen.

## Localization

All first-party learning content is bilingual in V1:

- `en`;
- `pt-BR`.

A reviewed module is structurally invalid if required user-facing content is missing in either locale.

Source titles and publisher names do not need translation when the canonical publication uses one language. Career Lab may localize explanatory source labels around them.

## Accessibility

The learning experience must preserve the accessibility baseline established elsewhere in Career Lab.

Requirements include:

- semantic heading hierarchy;
- keyboard-operable module navigation and progress controls;
- visible focus states;
- no status communicated through color alone;
- progress changes announced where appropriate;
- source links have meaningful accessible names;
- code examples remain readable without syntax color;
- reduced-motion preferences are respected;
- deep-linked modules receive a useful focus/scroll target without stealing focus unexpectedly.

## Visual direction

The learning system extends the current Career Lab editorial language:

- paper/beige surfaces;
- serif/sans hierarchy;
- thin rules;
- restrained copper accent;
- generous whitespace;
- code as editorial technical material;
- muted semantic success/error states when status requires them.

Avoid:

- course-marketplace cards;
- streaks, XP, badges, confetti, or mastery gamification;
- giant completion rings;
- colorful dashboard widgets;
- visual patterns that imply study completion is certification.

## Data and storage boundaries

Career Lab remains browser-local in this scope.

Learning progress is saved through the existing Career Profile persistence path and included in explicit export/import.

No new requirements are introduced for:

- authentication;
- server-side user profiles;
- cloud synchronization;
- billing;
- model APIs;
- background personal-data processing.

The curated learning catalog and source catalog are public repository/product content, not user data.

## Validation and testing contracts

Implementation must preserve TDD and add deterministic contracts for at least the following behaviors:

### Catalog and governance

- exactly one canonical Core Note exists for every canonical competency targeted by the first complete release of the learning system;
- module `criterionId`s are canonical and belong to the note competency;
- required EN/PT-BR content exists;
- reviewed modules reference valid sources;
- primary source requirements are enforced where declared applicable;
- source mappings reference valid criteria;
- duplicate note, module, and source IDs fail validation.

### Profile v2

- v2 profiles require `learningProgress`;
- learning progress references known note/module IDs where validation scope permits;
- progress timestamps are valid;
- duplicate progress records fail closed;
- V1 migration produces a valid V2 profile with empty learning progress;
- export/import preserves learning progress.

### Learning semantics

- completing study does not create evidence;
- completing study does not alter competency level/confidence;
- completing study does not change readiness directly;
- completing study does not complete a roadmap milestone by itself.

### Recommendations

- recommendation priority is deterministic;
- a blocking unstudi​ed gap outranks lower-priority material;
- studied-but-unproved state produces a proof-oriented next action rather than another generic study recommendation;
- missing curated mapping fails transparently instead of inventing content.

### Assessment Result v2

- result surfaces a mapped study recommendation when appropriate;
- Review challenges opens the completed attempt without creating a new result;
- Try again starts a clean attempt and new shuffle;
- Back to assessments returns directly to the index;
- previous completed records remain intact during retry.

### Navigation and accessibility

- Learning is the third numbered Career Lab navigation step;
- route active states remain correct;
- Guide remains outside numbered navigation;
- critical learning flows are keyboard operable;
- semantic status is not color-only;
- reduced motion is respected.

## Initial content coverage

The target architecture covers all 14 canonical competencies through one Core Note each.

Content rollout may be implemented in slices, but the catalog must never pretend to have complete coverage when modules are absent. Missing content should remain visibly unavailable until reviewed.

Existing learning units are inputs to the new catalog, not a second permanent content system. Their useful objectives, explanations, and practice prompts should be migrated into the new Core Note/module structure where they remain valid.

## Rollout strategy

Implementation should be split into independently verifiable slices rather than one large feature branch.

Recommended order:

1. content/source contracts and Profile v2 learning progress;
2. recommendation engine and migration of existing learning units;
3. Learning index and Core Note reading/progress surfaces;
4. Assessment Result v2 actions and contextual learning handoff;
5. Overview and Roadmap integration;
6. remaining Core Note content coverage plus Guide methodology;
7. final visual/accessibility QA and cross-flow verification.

Each slice should preserve the normal project workflow:

`audit -> RED -> implementation -> GREEN -> spec review -> quality review -> semantic commit -> CI evidence`

No PR should be merged without explicit user authorization.

## Out of scope

This design does not add:

- a course marketplace;
- video hosting;
- certificates;
- public learner profiles;
- social learning or cohorts;
- instructor tooling;
- runtime AI-generated lessons;
- cloud progress sync;
- auth or billing;
- automatic proficiency from study completion;
- automatic evidence from practice checkboxes;
- a generalized CMS for learning content.

## Success criteria

The system is successful when a user can move through this loop without ambiguity:

1. complete an assessment;
2. understand what was demonstrated and what was weak;
3. receive an explainable, criterion-level learning recommendation;
4. study a concise, sourced Career Lab module;
5. record that study as learning progress without inflating proficiency;
6. return to assessment or evidence to prove the capability;
7. see Overview and Roadmap distinguish `studied` from `proved`;
8. export/import the Career Profile with learning progress intact.

The interface should make Career Lab understandable as a developer career development product even before the user opens Guide:

> it evaluates, teaches, organizes practice, asks for proof, and uses that evidence to guide the next professional step.
