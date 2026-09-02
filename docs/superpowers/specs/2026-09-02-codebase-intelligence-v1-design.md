# Agent Skills Studio — Codebase Intelligence v1 Design

**Status:** Conversational design approved; written spec pending user review

**Date:** 2026-09-02

**Repository:** `jhonatan-oliveiradev/agent-skills`

**Release baseline:** `1.0.0-rc.1`

## 1. Purpose

Add Codebase Intelligence as an original, bilingual Agent Skills Studio pack for understanding existing codebases through traceable structural evidence while minimizing unnecessary context consumption.

The pack must help an agent answer five distinct questions:

1. What structure exists?
2. How does execution move through it?
3. What could a change affect?
4. Where is behavior implemented?
5. What evidence should inform a future change?

The pack is engine-agnostic. A code-intelligence runtime may improve depth and efficiency, but no skill depends on one. CodeGraph is the official recommended integration when available, with a documented, non-invasive fallback through repository search, symbol inspection, imports, references, tests, and targeted file reads.

This tranche adds one active pack and five canonical skills, moving the collection from 49 skills / 10 packs to 54 skills / 11 packs. It does not promote the release beyond `1.0.0-rc.1`.

## 2. Architectural decision

The selected model is **agnostic with an official integration**.

The conceptual architecture is:

```text
engine-agnostic skills
        ↓
optional code-intelligence capability
        ↓
CodeGraph as the official recommended integration
        ↓
verified repository-analysis fallback
```

The Studio owns the reasoning methods, evidence contract, routing boundaries, and fallback behavior. CodeGraph owns its graph, indexing, MCP integration, CLI, and visualization experience.

The v1 integration includes a shared runtime contract and documentation. It does not include an adapter, wrapper, fork, embedded runtime, automatic installation, or automatic indexing.

## 3. Pack definition

Pack slug:

```text
codebase-intelligence
```

Public positioning:

- vendor-neutral name, summary, description, and outcomes;
- concise attribution such as “Enhanced with CodeGraph when available” where the catalog or documentation has room for integration guidance;
- complete EN and PT-BR content;
- active and installable through existing pack mechanisms;
- version remains `1.0.0-rc.1` during this tranche.

Proposed outcomes:

- reconstruct codebase structure and behavior from evidence instead of assumptions;
- reduce unnecessary context expansion while preserving traceability;
- identify change impact before structural implementation;
- hand verified findings to architecture, workflow, debugging, and testing methods.

The final pack manifest must follow the existing `catalog/packs/*.json` schema and current editorial conventions.

## 4. Canonical skills and ownership

### 4.1 `mapping-existing-codebase-structure`

Maps the structure that already exists:

- modules and packages;
- current boundaries;
- ownership signals;
- entrypoints;
- dependency direction;
- externally visible interfaces;
- structural hotspots and unresolved areas.

It may produce an architecture map as an artifact, but it does not design a future architecture, select patterns, or prescribe new boundaries.

### 4.2 `tracing-code-execution-paths`

Reconstructs execution paths across:

- symbols;
- files;
- application layers;
- services;
- synchronous and asynchronous boundaries;
- adapters and external calls when supported by evidence.

It records confirmed steps, inferred transitions, and unresolved jumps. It does not claim root cause merely because a path was traced and does not replace systematic debugging.

### 4.3 `analyzing-change-blast-radius`

Identifies the surfaces a proposed change could affect:

- callers and callees;
- imports and dependents;
- public contracts;
- persistence or integration boundaries;
- user-facing paths;
- tests and fixtures;
- deployment or runtime surfaces when visible in the repository.

It distinguishes direct, transitive, inferred, and unresolved impact. It does not decide the implementation or declare an unobserved dependency safe.

### 4.4 `investigating-codebase-semantically`

Locates implementation by behavior or intent rather than relying only on filenames and literal text.

The skill:

- translates the behavioral question into narrow search concepts;
- uses graph or symbol evidence when available;
- forms candidates through search when necessary;
- validates candidates by reading implementation and related contracts;
- rejects false positives;
- records ambiguity when multiple implementations remain plausible.

It is not a generic file-finding skill and does not treat a textual match as proof of behavioral ownership.

### 4.5 `planning-codebase-changes-with-evidence`

Consolidates structural findings into a **change evidence brief**.

The brief includes:

- objective and scope boundary;
- observed implementation locations;
- affected symbols, files, contracts, and tests;
- relevant execution paths;
- known risks;
- unresolved questions;
- suggested implementation slices;
- explicit handoffs.

It does not create the executable implementation plan, run TDD, modify code, manage slices, or replace `writing-plans` or Engineering Workflow.

## 5. Cross-pack boundaries

Routing is determined by task intent, never by the availability of CodeGraph.

### Codebase Intelligence

Owns understanding an existing codebase and producing structural evidence.

Primary question:

> What exists, how is it connected, and what evidence supports that conclusion?

### Architecture & Engineering

Owns decisions about how the system should be structured, including architecture selection, future boundaries, decision records, and safe refactor design.

Primary question:

> Given the constraints and evidence, how should the system evolve?

A structural map may be an input; it is not the architecture decision itself.

### Engineering Workflow

Owns executable planning, implementation sequencing, reviewable slices, pull-request workflow, and technical handoff.

Primary question:

> How will the approved change be organized and executed safely?

A change evidence brief is an input; it is not the executable plan.

### Quality & Testing

Owns test strategy and test implementation.

Primary question:

> How will the intended behavior be proved?

Codebase Intelligence may identify affected tests, fixtures, contracts, and probable coverage gaps. It does not select or implement the full testing strategy.

### Systematic Debugging

Owns causal investigation of a concrete failure.

Primary question:

> Why does this behavior fail?

An execution trace may be evidence used by debugging. Tracing a path alone does not establish root cause.

## 6. Optional runtime contract

A code-intelligence runtime is treated as a capability, not as a vendor identity embedded in the core workflow.

Before using it, a skill must determine non-invasively whether appropriate tools are already available. Availability means the agent can actually invoke the runtime in the current environment; documentation, a dependency declaration, or a repository folder alone is not proof of availability.

When available, the runtime should be used first for structural questions it can answer more directly, including:

- symbols;
- callers and callees;
- references;
- dependencies;
- call paths;
- change or blast radius;
- semantically related implementation.

Runtime results are evidence inputs, not infallible conclusions. Important claims still require a reproducible source or location.

When unavailable, stale, incomplete, or inconclusive, the skill states the fallback and continues with targeted repository evidence.

No skill may:

- install CodeGraph automatically;
- run `codegraph init` automatically;
- create or alter `.codegraph/` without explicit user authorization;
- claim that CodeGraph was used when no callable runtime was available;
- stop merely because CodeGraph is absent;
- disguise fallback search as graph evidence.

## 7. Official CodeGraph integration

CodeGraph is the official recommended runtime integration for v1.

The dedicated integration guidance may document, with attribution to the upstream project:

- project reference: `https://github.com/colbymchenry/codegraph`;
- agent connection through `codegraph install`;
- per-project initialization through `codegraph init`;
- graph visualization through `codegraph ui`;
- MCP use when exposed by the current agent environment;
- local-processing characteristics only to the extent verified against current upstream documentation.

The guide must:

- use original Studio prose;
- separate generic runtime behavior from CodeGraph-specific setup;
- explain that setup and indexing are explicit user actions;
- explain fallback behavior;
- avoid implying sponsorship, ownership, bundled distribution, or a required dependency;
- avoid pinning unsupported claims to a release number unless the release is deliberately verified during implementation.

Pack and skill copy remains useful without reading the CodeGraph guide.

## 8. Context-efficiency contract

Reducing unnecessary token and context consumption is a first-class, verifiable pack requirement.

The pack must prefer progressive disclosure:

1. define the narrow structural question;
2. choose the smallest query capable of answering it;
3. inspect symbols or focused relations before whole files;
4. record useful evidence for reuse;
5. expand to adjacent relations only when the current evidence is insufficient;
6. stop when additional reading is unlikely to change the immediate decision;
7. return a synthesis and references instead of large source dumps.

Every material context expansion should have a reason, such as:

- resolving a conflicting claim;
- confirming an inferred transition;
- checking a public contract;
- finding a caller or dependent;
- verifying a test surface;
- closing an explicit evidence gap.

The contract is qualitative rather than a fixed token quota. The Studio must not promise a universal percentage reduction because project structure, tools, and task complexity vary.

Routing scenarios and skill tests must reject or discourage:

- repository-wide reading before a narrow question exists;
- repeated searches for the same fact;
- large code dumps when locations are sufficient;
- following low-relevance branches without justification;
- continuing after the defined sufficiency condition is met.

## 9. Evidence ledger

All five skills share a logical evidence-ledger contract. The v1 may express it as instructions and output templates rather than a new runtime data model.

Each material claim records:

- `claim`: the structural statement;
- `status`: `observed`, `inferred`, or `unresolved`;
- `source`: graph query, symbol inspection, repository search, import, reference, test, configuration, or direct file read;
- `location`: a reproducible file, symbol, relation, or tool result;
- `confidence`: the strength of the conclusion;
- `relevance`: why the claim matters to the question.

Status semantics:

- **observed:** directly supported by current repository or runtime evidence;
- **inferred:** a reasoned conclusion with its supporting evidence and uncertainty shown;
- **unresolved:** evidence is missing, contradictory, inaccessible, or insufficient.

The output may summarize multiple low-level observations, but it must preserve enough references for another person or agent to reproduce important conclusions.

Graph evidence may support an observed relation when the relation and location are returned by the runtime. A textual match alone cannot establish a caller, callee, ownership boundary, or complete blast radius.

## 10. Operational flow

Each skill follows this baseline flow:

1. state the question and scope;
2. identify the relevant skill ownership;
3. detect optional runtime capability non-invasively;
4. execute the narrowest useful query;
5. record evidence and provenance;
6. validate high-impact claims through focused inspection;
7. expand only to close a named evidence gap;
8. classify remaining uncertainty;
9. stop at sufficiency;
10. deliver findings and the correct handoff.

Sufficiency is reached when:

- the original question is answered with traceable evidence;
- critical dependencies relevant to the question were checked;
- contradictions and gaps are explicitly classified;
- more reading is unlikely to change the immediate decision;
- the next action belongs to another pack or requires a human choice.

## 11. Output contracts

### Structure map

Expected from `mapping-existing-codebase-structure`:

- scope;
- entrypoints;
- modules and responsibilities;
- observed boundaries;
- dependency direction;
- ownership signals;
- hotspots;
- evidence gaps;
- source references.

### Execution trace

Expected from `tracing-code-execution-paths`:

- trigger or entrypoint;
- ordered path steps;
- boundary crossings;
- observed and inferred transitions;
- terminal behavior;
- unresolved jumps;
- source references.

### Blast-radius report

Expected from `analyzing-change-blast-radius`:

- proposed change surface;
- direct dependents;
- transitive or inferred dependents;
- affected contracts;
- affected user or runtime paths;
- affected tests and fixtures;
- risk classification;
- unresolved impact;
- source references.

### Semantic investigation result

Expected from `investigating-codebase-semantically`:

- behavioral question;
- search concepts;
- candidate implementations;
- validation evidence;
- rejected false positives;
- selected owner or unresolved ambiguity;
- source references.

### Change evidence brief

Expected from `planning-codebase-changes-with-evidence`:

- objective;
- explicit in/out scope;
- current-state evidence;
- affected surfaces;
- relevant paths and contracts;
- risks;
- unresolved questions;
- suggested slices;
- testing surfaces;
- handoff to Architecture, Engineering Workflow, Quality & Testing, or Systematic Debugging.

## 12. Routing scenarios

The versioned routing benchmark must add positive scenarios for all five new skills and ambiguity scenarios against neighboring methods.

Minimum positive cases:

| Request intent | Primary owner |
|---|---|
| Map current boundaries and entrypoints | `mapping-existing-codebase-structure` |
| Follow a request through layers and services | `tracing-code-execution-paths` |
| Determine what may break after a contract change | `analyzing-change-blast-radius` |
| Find where a behavior is implemented | `investigating-codebase-semantically` |
| Prepare evidence before planning a real change | `planning-codebase-changes-with-evidence` |

Minimum boundary cases:

- current structure vs future architecture;
- evidence brief vs executable engineering plan;
- affected tests vs test strategy;
- execution trace vs root-cause debugging;
- semantic implementation search vs generic file lookup;
- CodeGraph available vs unavailable;
- runtime present but result inconclusive;
- explicit request to install or initialize CodeGraph;
- no authorization to create `.codegraph/`;
- structural claim supported only by text search;
- context expansion after sufficiency has already been reached.

Composite scenarios may sequence multiple skills but must maintain one primary owner per responsibility. They must not create a super-skill that silently executes architecture, planning, testing, debugging, and implementation.

## 13. Testing strategy

Implementation follows TDD RED → GREEN.

Repository tests must cover:

- five new canonical skill records;
- one new active pack;
- count changes from 49/10 to 54/11;
- complete EN and PT-BR metadata;
- schema and relation integrity;
- deterministic catalog generation;
- installers resolving the new pack;
- microsite/catalog consumption through existing generic mechanisms;
- positive, negative, ambiguous, and composite routing scenarios;
- excluded-skill assertions at overlap boundaries;
- runtime-present behavior;
- runtime-absent fallback;
- inconclusive-runtime fallback;
- evidence status and provenance requirements;
- non-invasive setup behavior;
- context-efficiency and stop-condition instructions;
- absence of unverified structural claims;
- existing 49-skill / 10-pack behavior remaining valid alongside the additions.

Tests do not pretend to benchmark an LLM's exact token count or execute CodeGraph in CI unless a separately approved, deterministic integration fixture is justified. They verify the method contracts, routing records, metadata, output requirements, and explicit safety constraints.

CI remains the source of truth. Temporary workflow materializers, if absolutely required by connector limitations, must be restored byte-identically before final verification, and their runs do not count as final evidence.

## 14. Catalog, installers, and microsite integration

The new pack must use current generic product surfaces rather than introducing parallel distribution paths.

Required integration:

- canonical `skills/<slug>/SKILL.md` instructions;
- `catalog/skills/<slug>.json` for each skill;
- `catalog/packs/codebase-intelligence.json`;
- existing catalog schemas unless a demonstrated requirement forces a separately justified schema change;
- deterministic regeneration of `catalog/generated/catalog.json`;
- existing Bash and PowerShell pack installation;
- existing microsite pack and skill pages;
- existing localized metadata and routing mechanisms.

A CodeGraph graph viewer, embedded `codegraph ui`, live repository indexing, new database, API, or microsite runtime integration is outside v1.

## 15. Error and uncertainty handling

The skills must handle these conditions explicitly:

- **runtime unavailable:** declare fallback and continue;
- **runtime query unsupported:** narrow or switch evidence source;
- **runtime index stale or incomplete:** mark uncertainty and corroborate through repository evidence;
- **repository access incomplete:** label inaccessible surfaces as unresolved;
- **conflicting evidence:** preserve both claims and identify what would resolve them;
- **no implementation candidate found:** report the searches performed and remain unresolved;
- **blast radius cannot be bounded:** state which dependency surfaces remain unknown;
- **user requests setup:** explain the explicit operation and obtain authorization before installation, initialization, or repository mutation;
- **next responsibility belongs elsewhere:** produce a handoff instead of duplicating the neighboring method.

No skill may invent missing structure to make an output appear complete.

## 16. Release and version policy

Stable promotion is frozen.

During this tranche, do not alter:

- `VERSION`;
- root `package.json`;
- `.codex-plugin/plugin.json`;
- `catalog/catalog.json`;
- `apps/web/package.json`;
- skill versions;
- pack versions;
- Stable changelog or release metadata.

All new skill and pack records use the existing collection version `1.0.0-rc.1`.

After implementation, verification, and real-use evidence, a separate approved tranche may promote the complete collection to `1.0.0-rc.2`. Stable `1.0.0` remains a later decision.

The current `release/stable-readiness.json` evidence is historical evidence for RC1 surfaces. It must not be misrepresented as proof that the new Codebase Intelligence pack has completed real-use validation.

## 17. Out of scope

- CodeGraph installation or initialization during Studio implementation;
- automatic creation of `.codegraph/`;
- a Studio-owned code-intelligence adapter or abstraction library;
- vendoring or forking CodeGraph;
- graph storage or synchronization;
- graph visualization inside the microsite;
- guaranteed parity between graph depth and fallback depth;
- exact token-savings claims;
- automated architecture decisions;
- automated implementation from a change evidence brief;
- Stable or RC2 release promotion;
- real-use evidence manufactured inside the Studio repository;
- merge without explicit user authorization.

## 18. Implementation sequencing constraint

After this written spec is reviewed and approved:

1. invoke `writing-plans`;
2. write `docs/superpowers/plans/2026-09-02-codebase-intelligence-v1.md`;
3. request user review of the plan when required by the workflow;
4. execute on a branch created from `main`;
5. follow TDD RED → GREEN;
6. use systematic debugging for failures;
7. verify on one final HEAD;
8. request code review;
9. finish the development branch without merging;
10. wait for explicit merge authorization.

No implementation begins from this design document alone.

## 19. Success criteria

Codebase Intelligence v1 is ready for implementation completion when:

- all five skills have non-overlapping ownership;
- the pack is bilingual and follows existing schemas;
- CodeGraph is a first-class optional integration, not a dependency;
- runtime use and fallback follow one consistent evidence contract;
- every material claim distinguishes observation, inference, and unresolved uncertainty;
- context expands progressively and stops at sufficiency;
- the change evidence brief hands off instead of executing another pack's work;
- routing scenarios prove positive ownership and negative boundaries;
- installers, catalog, generated data, and microsite expose the pack through existing mechanisms;
- the collection contains 54 canonical skills and 11 active packs while remaining at `1.0.0-rc.1`;
- canonical CI is GREEN on the final branch HEAD;
- no temporary workflow remains;
- no PR is merged without explicit user approval.
