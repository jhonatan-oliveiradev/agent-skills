# Developer Career Pack + Career Lab

Date: 2026-09-04
Status: Design approved in conversation; written spec awaiting final review
Repository: `jhonatan-oliveiradev/agent-skills`
Base: `main` at `686c10a9cc774835b6ac55c96ecdff5b52c5e576`

## Goal

Add a developer-career domain to Agent Skills Studio that helps early-career developers answer, with evidence rather than generic advice:

> I want to become employable as X. Where am I now, what am I missing, and what should I do next?

The product combines an installable **Developer Career Pack** with an optional **Career Lab** workspace. The Pack remains the portable methodology layer; the Career Lab adds persistent local state, visual progress, assessments, roadmap orchestration, evidence tracking, and market analysis.

The core loop is:

`Assess -> Plan -> Learn -> Demonstrate -> Evidence -> Compare with Market -> Recalibrate`

The product must preserve Agent Skills Studio's core contract:

> Skills are not prompts. They are working methods.

## Product architecture

The system has three layers with explicit responsibilities.

### 1. Developer Career Pack

The Pack contains independently invokable Skills. No Skill requires the Career Lab to be useful, and the Pack must not become a monolithic workflow.

### 2. Career Lab

The Career Lab is an optional interactive workspace inside the existing Studio. It owns presentation, local persistence, deterministic state transitions, roadmap visualization, assessment execution where the browser can verify results safely, evidence history, market samples, and import/export.

The Career Lab does **not** introduce a first-party LLM API in V1. Complex inference remains available through the installable Skills and portable artifacts. This avoids adding authentication, model billing, server-side personal-data storage, rate limiting, and abuse controls before the workflow is validated.

### 3. Career Profile

The Career Profile is the portable user-state model. It stores goals, competencies, assessments, roadmap state, evidence, and market signals. It is private user data, not a social profile.

The Career Lab persists it locally and supports explicit import/export so users are not locked to the browser or to one agent runtime.

## V1 Pack composition

The V1 Pack contains six Skills with non-overlapping ownership.

### `assessing-developer-proficiency`

Purpose: establish the current state of a developer's capabilities from available evidence.

Owns:
- diagnostic interpretation;
- evidence-aware proficiency mapping;
- confidence assessment;
- identification of unknown or weakly evidenced areas.

Does not own:
- roadmap sequencing;
- teaching;
- formal post-learning evaluation;
- job-market prioritization.

### `building-developer-career-roadmaps`

Purpose: transform current capability state, career goal, constraints, and market signals into an adaptive capability roadmap.

Owns:
- milestone selection;
- dependency ordering;
- current-focus selection;
- effort ranges;
- roadmap recalibration;
- roadmap decision records.

Does not define proficiency criteria.

### `teaching-developer-concepts`

Purpose: teach only the knowledge needed to close a current capability gap and move the learner toward practice or evaluation.

Owns:
- microlearning units;
- concise explanations;
- targeted examples;
- practice exercises;
- resource recommendations when current web research is available.

It is not a course marketplace or a long-form curriculum engine.

### `evaluating-developer-proficiency`

Purpose: determine whether a learner has demonstrated a target capability level under a versioned assessment blueprint.

Owns:
- assessment assembly;
- rubric-based evidence observation;
- structured result artifacts;
- feedback and next gaps.

It does not redefine level criteria ad hoc.

### `designing-developer-portfolio-evidence`

Purpose: convert roadmap gaps into professional artifacts that can demonstrate several relevant capabilities at once.

Owns:
- project/evidence briefs;
- evidence contracts;
- portfolio proof requirements;
- mapping between projects and competencies.

### `analyzing-developer-career-opportunities`

Purpose: compare the Career Profile with individual jobs or a market sample and convert real demand into explainable career signals.

Owns:
- job normalization;
- capability extraction with provenance;
- job fit;
- gap classification;
- aggregate market signals;
- roadmap-priority recommendations.

It does not search/apply/send applications in V1.

## Career Lab V1 surfaces

Localized routes:

1. `/{locale}/career-lab` — Overview
2. `/{locale}/career-lab/onboarding`
3. `/{locale}/career-lab/roadmap`
4. `/{locale}/career-lab/assessments`
5. `/{locale}/career-lab/assessments/[id]`
6. `/{locale}/career-lab/evidence`
7. `/{locale}/career-lab/market`
8. import/export actions for the Career Profile and supported artifacts

The main Career Lab navigation is intentionally small:

`Overview · Roadmap · Assessments · Evidence · Market`

The experience should remain a technical editorial product rather than a generic SaaS dashboard.

## Onboarding

Onboarding is guest-first and should not require an account.

It has four short stages:

1. **Current context** — starting from zero, studying, building projects, working professionally, or changing specialization.
2. **Target** — Frontend, Backend, Full-stack, or unsure in V1. Broader career families are deferred until their capability maps are authored and validated.
3. **Constraints** — career objective, target market, and weekly learning capacity.
4. **Baseline diagnostic** — a short adaptive triage intended to identify areas that need deeper assessment, not certify mastery.

The baseline diagnostic may return uncertain states such as `Proficient? / Low confidence`. Uncertainty is a first-class state, not something to hide with a synthetic score.

## Local-first persistence

V1 uses browser-local persistence, preferably IndexedDB, for state larger or more structured than simple preferences.

No Career Profile data is sent to Agent Skills Studio servers in V1.

The product must state this clearly in the UI and provide:

- `Export career profile`;
- `Import career profile`;
- destructive reset with explicit confirmation;
- schema-version validation;
- migration handling for future local schema revisions.

Cloud accounts, sync, billing, and recruiter-facing public profiles are out of scope.

## Portable data contracts

The Career Profile and agent-produced artifacts use explicit versioned schemas.

Baseline artifacts:

- `career-profile.json`
- `assessment-result.json`
- `roadmap-update.json`
- `learning-unit.json`
- `portfolio-evidence.json`
- `market-analysis.json`

All imports must be validated before mutating local state. Unknown fields may be preserved only where the schema contract explicitly permits forward-compatible extension; invalid required fields must fail closed with an actionable error.

The intended portability model is:

`Career Lab <-> artifact <-> ChatGPT / Codex / Claude Code / compatible agent runtime`

## Career Profile model

The Profile must separate user claims from observed evidence.

Conceptual shape:

```ts
interface CareerProfile {
  schemaVersion: string;
  targetRoles: TargetRole[];
  targetMarkets: TargetMarket[];
  weeklyStudyHours?: number;
  competencies: CompetencyState[];
  assessments: AssessmentRecord[];
  roadmap: RoadmapState;
  portfolioEvidence: EvidenceRecord[];
  marketSamples: MarketSample[];
  decisionRecords: DecisionRecord[];
}
```

The model must retain history required to explain why a level, confidence, fit result, or roadmap change exists.

## Competency model

The atomic unit is an observable **capability**, grouped into a competency and domain.

Initial proficiency levels:

1. `foundation`
2. `developing`
3. `proficient`
4. `advanced`

These are criterion-based states, not percent bands.

Example competency:

`React State Modeling`

Capabilities may include:
- distinguishing local, server, and derived state;
- modeling state transitions;
- detecting stale state/closure problems;
- avoiding unnecessary effects;
- choosing ownership boundaries.

Each competency defines observable criteria for each level. A model may interpret evidence against those criteria, but it may not invent or silently redefine the criteria.

Seniority labels such as Junior, Mid, or Senior are **not** competency levels. Seniority/readiness is an inference against a target-role capability map.

## Evidence model

Evidence strength is explicitly distinguished from self-report.

Recommended evidence classes:

- `E0 self-report` — user claim only;
- `E1 knowledge` — conceptual correctness;
- `E2 reasoning` — code reading or technical reasoning;
- `E3 performance` — debugging or implementation performance;
- `E4 authentic` — real project or equivalent external artifact.

Rules:

- self-report alone cannot grant `proficient` or `advanced`;
- conceptual knowledge alone cannot substitute for performance where the competency requires implementation/debugging;
- required dimensions act as gates, not values averaged away;
- old evidence may reduce confidence but must not silently erase demonstrated proficiency;
- contradictory evidence must lower confidence and recommend reassessment rather than being hidden.

## Level and confidence

`level` and `confidence` are separate dimensions.

Examples:

- `proficient / high confidence`
- `proficient / low confidence`

Confidence is derived from evidence diversity, strength, consistency, quantity, and recency. Exact numeric coefficients are intentionally not frozen in this design; they must be calibrated through tests and real use before becoming public semantics.

A user-facing percentage may be shown as a secondary summary for role readiness, but the system must always expose the blocking gaps and evidence behind it.

## Assessment architecture

Every formal assessment is governed by a versioned `AssessmentBlueprint`.

A blueprint defines:

- competency/version;
- target level;
- assessment dimensions;
- challenge types;
- observable rubric criteria;
- required gates;
- minimum evidence requirements;
- retest policy where relevant.

Supported evidence dimensions may include:

- concept knowledge;
- code reading;
- debugging;
- implementation;
- technical reasoning.

No assessment should default to multiple-choice-only scoring.

The evaluation pipeline is conceptually:

`Blueprint -> Challenge -> Candidate response -> Evidence observation -> Deterministic gates -> Level/confidence result`

The evaluator observes evidence in structured form. Final proficiency state is derived from blueprint rules, not from an unconstrained "LLM score".

### Lab-native assessment boundary

Because V1 has no first-party model API, the Career Lab may only award proficiency from evidence it can verify deterministically or from a valid imported assessment artifact produced under the same blueprint contract.

For V1, browser-native assessment execution should prioritize challenge types that can be safely checked locally. Complex open-ended reasoning or environment-specific coding that cannot be verified locally should be completed through the corresponding Skill and imported as a signed/validated structured artifact once an artifact trust model exists. Until then, imported artifacts are user-owned evidence with explicit provenance, not cryptographic certification.

The product must not claim official certification in V1. Use language such as **Skill Assessment**, **Proficiency Report**, or **Readiness Report**.

## Adaptive roadmap engine

The roadmap is a directed capability graph rendered as an understandable editorial sequence.

Each milestone contains:

- capabilities;
- prerequisites;
- target levels;
- estimated effort range;
- learning/practice requirements;
- assessment/evidence gates;
- status;
- explanation for its current priority.

Statuses:

- `locked`
- `available`
- `in-progress`
- `ready-for-assessment`
- `completed`

Completion rule:

`required capabilities >= target level AND mandatory evidence gates satisfied`

Content consumption alone never completes a milestone.

### Priority ordering

Priority must honor, in this order:

1. real dependency constraints;
2. target-role capability baseline;
3. personal capability/evidence gaps;
4. market relevance;
5. effort and quick-win value.

Market demand may adjust ordering but must never override a real foundational dependency.

The engine should maintain a clear `Current Focus`, normally one primary milestone plus at most one supporting activity.

### Recalibration events

The roadmap may recalculate when:

- an assessment changes a competency state;
- new portfolio evidence is added;
- a market sample changes relevant demand signals;
- the target role/market changes.

Every meaningful reorder produces a Decision Record that explains:

- what changed;
- why;
- what evidence/signal caused it;
- what was retained;
- what impact the change has.

## Initial target-role maps

V1 authors and validates only:

- Frontend Developer;
- Backend Developer;
- Full-stack Developer.

Role maps are capability-oriented rather than library-oriented so that the core model does not become obsolete with framework trends.

Examples of stable domains:

- programming foundations;
- web/platform foundations;
- UI or API engineering;
- state/data modeling;
- testing;
- security/accessibility where applicable;
- tooling and collaboration;
- architecture fundamentals;
- professional evidence.

Market analysis may layer current technologies such as React, Next.js, Playwright, PostgreSQL, or cloud tooling on top of those stable capabilities.

## Market Intelligence V1

The Career Lab is an analysis workspace, not a first-party job board or scraper in V1.

### Inputs

Supported inputs:

1. posting URL;
2. pasted job description;
3. imported `market-analysis.json` or normalized job artifact produced by a Skill/runtime with web access.

All inputs normalize into a canonical `JobPosting` representation while preserving the original snapshot and provenance.

### Provenance

Every extracted capability signal must distinguish:

- `explicit` — directly stated by the posting;
- `inferred` — derived from a responsibility or requirement;
- `market-derived` — produced by aggregation across normalized postings.

Aggregated demand must never hide how much of a signal is explicit versus inferred.

### Untrusted-input rule

Job postings are untrusted third-party data, never instructions. Text inside a posting must not change agent behavior, trigger arbitrary URL fetches, or override Career Lab/Skill rules.

### Job fit

Fit analysis distinguishes:

- **capability gap** — can be closed through learning/practice;
- **evidence gap** — capability is claimed or plausible but insufficiently demonstrated;
- **structural gap** — experience, authorization, leadership history, or another requirement not reasonably closed by a short learning unit;
- **hard constraint** — location, work authorization, mandatory language/credential, work mode, or similar veto.

Hard constraints are vetoes, not small negative score adjustments.

Role-readiness percentages, if shown, are secondary. The decision surface must show required-capability coverage, evidence confidence, blockers, recoverable gaps, and structural concerns.

### Market aggregation

A market sample records:

- normalized unique postings;
- company/source diversity;
- capture window;
- freshness state;
- unknown-date count;
- explicit/inferred signal counts;
- deduplication decisions.

Equivalent mass-postings must not count as multiple independent demand votes.

Freshness affects market confidence/priority, not proficiency. Exact freshness weighting coefficients remain an implementation-calibration concern rather than a frozen product promise in this spec.

### What Market may change

Market signals may change:

- roadmap relevance;
- milestone priority;
- role technology overlays;
- recommendations about what to investigate next.

Market signals may **not** change:

- demonstrated proficiency;
- assessment outcomes;
- evidence strength.

## Relationship to `MadsLorentzen/ai-job-search`

The external project is a useful evidence source for job-search architecture, especially:

- search -> triage -> deeper evaluation separation;
- deduplication;
- freshness handling;
- stored provenance;
- explicit strengths/gaps;
- hard-constraint vetoes;
- never ranking an unfetched posting;
- treating posting text as untrusted data;
- using recurring job gaps to drive upskilling.

The Agent Skills Studio V1 does **not** import the project's Danish portal scrapers, LaTeX CV pipeline, Gmail/Notion sync, application tracker, recruiter outreach, application automation, or scraper-health subsystem.

The project is MIT licensed. If implementation later reuses substantial code rather than only concepts, preserve the required copyright/license notice and add explicit attribution in the repository and relevant source headers/documentation.

## Microlearning contract

Learning units are deliberately small and gap-specific.

A unit should normally contain:

1. mental model;
2. minimal example;
3. bug/problem/exercise;
4. practice task;
5. checkpoint;
6. handoff to further practice or assessment.

The Career Lab does not attempt to replace comprehensive external courses. When a Skill has current web access, it may recommend high-quality external resources with source verification.

## Portfolio Evidence contract

Portfolio work must be designed around observable evidence rather than generic project ideas.

A portfolio brief maps project requirements to competencies and defines an evidence contract, for example:

- authentication;
- API boundaries;
- asynchronous/error states;
- accessibility;
- integration tests;
- CI;
- architecture decision documentation.

A project can support several competencies, but each claim remains traceable to a concrete artifact or assessment.

## Interaction between Pack and Career Lab

The Pack dossier should link to Career Lab as an optional workspace.

The Career Lab should identify the Developer Career Pack as its methodology layer and link back to the Pack/Skills.

Neither surface should imply that Career Lab is required to use the Skills or that the Pack requires an account.

## Privacy and safety

V1 must:

- remain accountless/local-first;
- avoid server-side personal-profile persistence;
- make local-storage behavior explicit;
- validate imports before mutation;
- sanitize untrusted job text for rendering;
- avoid executing arbitrary imported code;
- isolate any browser-based code execution from application state and origin capabilities;
- avoid claims of accredited/official certification;
- avoid auto-sending job applications or messages.

## Accessibility and responsive behavior

Career Lab must follow existing Studio contracts for:

- keyboard navigation;
- focus visibility;
- reduced motion;
- screen-reader semantics;
- light/dark modes;
- localized EN/PT-BR copy;
- responsive layouts.

Progress/status must never rely on color alone.

## Testing strategy

Implementation must use TDD and preserve existing repository gates.

Required test layers:

### Domain tests

- competency level gates;
- evidence-strength rules;
- confidence state transitions;
- role-readiness blockers;
- milestone dependency ordering;
- milestone completion gates;
- roadmap recalibration and Decision Records;
- market/proficiency separation;
- deduplication/freshness/sample-health behavior;
- import validation and schema migrations.

### Assessment tests

- blueprint validation;
- required dimensions/gates;
- deterministic browser-checkable challenge scoring;
- no average-based promotion through failed blocking dimensions;
- evidence provenance.

### UI tests

- onboarding flow;
- local persistence hydration;
- export/import/reset;
- overview/roadmap/assessment/evidence/market states;
- localized copy;
- keyboard/focus/reduced-motion behavior;
- loading/error/empty/invalid-import states.

### Integration/build gates

Preserve the existing root tests, catalog validation, web tests, typecheck, lint, production build, and applicable distribution/installer gates.

Visual QA remains a separate requirement; DOM/unit tests are not a substitute for manual responsive review.

## Delivery decomposition

The implementation plan should decompose this architecture into independently reviewable slices rather than one monolithic PR. Expected sequence:

1. domain schemas + Career Profile local persistence/import/export;
2. competency/evidence model + initial role maps;
3. Developer Career Pack canonical Skills and catalog metadata;
4. Career Lab shell + onboarding + overview;
5. assessment blueprints + baseline diagnostic + assessment surfaces;
6. adaptive roadmap engine + roadmap UI;
7. microlearning + portfolio evidence flows;
8. market ingestion/normalization/fit + Market UI;
9. Pack/Lab cross-linking, bilingual polish, accessibility, full regression and evidence.

Exact PR boundaries belong to the implementation plan.

## Existing product invariants

This initiative must not accidentally alter:

- Stable `1.0.0` historical semantics;
- existing 54 canonical Skills except where the new release deliberately increases the catalog through approved new Skills;
- the existing 11 Pack definitions except where the approved Developer Career Pack deliberately increases the Pack catalog;
- historical readiness/evidence snapshots;
- existing public URLs;
- existing installation semantics;
- current Pack bundle semantics;
- canonical content of unrelated Skills.

The new Pack and Skills require an explicit post-Stable version/release decision during planning; do not silently rewrite `1.0.0` historical artifacts.

## Out of scope for V1

- first-party LLM/API inference inside Career Lab;
- required login;
- cloud sync;
- subscriptions/billing;
- public social profiles;
- recruiter view;
- community/leaderboards;
- accredited or official certification claims;
- automated application submission;
- automatic CV/cover-letter generation;
- recruiter outreach automation;
- Gmail/Notion sync;
- proprietary LinkedIn scraping;
- broad multi-portal scraper infrastructure;
- portal generator/health subsystem;
- Mobile, DevOps, Security, Data/AI, and Game Development role maps until authored and validated separately.

## V2 candidates

Once the V1 loop is validated, consider separate Skills/features for:

- `searching-developer-jobs`;
- `tailoring-developer-applications`;
- `preparing-developer-interviews`;
- `tracking-job-search-outcomes`;
- optional account/cloud sync;
- validated job-source adapters;
- public shareable proficiency reports or badges with carefully defined trust semantics.

## Definition of V1 success

V1 is successful when a new or early-career developer can:

1. enter without creating an account;
2. establish a transparent baseline with explicit uncertainty;
3. choose a Frontend, Backend, or Full-stack target;
4. receive a capability-based roadmap with one clear current focus;
5. consume targeted learning/practice material;
6. complete an assessment whose result is governed by explicit criteria and evidence gates;
7. record portfolio evidence;
8. analyze real job postings without treating them as trusted instructions;
9. see capability, evidence, structural, and hard-constraint gaps separately;
10. observe an explainable roadmap recalibration from new evidence or market signals;
11. export the Career Profile and continue with a compatible agent runtime;
12. understand why every important level, fit result, or roadmap change exists.

The defining product promise is:

> The Career Lab does not try to guess how much you know. It records what you can demonstrate, what the market asks for, and what evidence should come next.
