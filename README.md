# Agent Skills Studio

A curated Agent Skills library for production frontend, product design, motion, visual QA, delivery workflows, backend and data engineering, software architecture and engineering, quality and testing, application security, engineering workflow, developer career, brand design, writing and communication, and game-development tasks. The current development catalog publishes 60 reusable skills across 12 active packs. It is inspired by useful patterns from the broader agent-skills ecosystem, but the skills in this repository are intentionally rewritten, consolidated, and kept project-agnostic.

## Principles

- Prefer narrow, explicit skill triggers over a huge library of overlapping presets.
- Preserve existing repository conventions before applying personal defaults.
- Treat design fidelity, accessibility, performance, and verification as part of implementation quality.
- Keep reusable skills free of private client data, credentials, internal URLs, proprietary copy, and project-specific secrets.
- Add optional libraries only when a concrete requirement justifies them.

## Skills

`skills/` is the canonical source tree. Each skill lives at
`skills/<skill-name>/SKILL.md` — for example,
`skills/craft-premium-motion/SKILL.md`. Installers, validation, and the
plugin all consume that same tree; repository-root compatibility copies are not
kept.

### Project foundation
- `bootstrapping-modern-web-apps`

### Frontend & product
- `building-premium-nextjs-interfaces`
- `implementing-reference-faithful-ui`
- `designing-ui-systems`
- `building-conversion-product-pages`
- `translating-figma-to-nextjs`
- `auditing-pixel-perfect-frontend`

### Motion & performance
- `craft-premium-motion`
- `engineering-gsap-animations`
- `orchestrating-cinematic-web-motion`
- `optimizing-frontend-motion-performance`

### Backend & data
- `designing-relational-data-models`
- `building-reliable-node-api-boundaries`
- `evolving-postgres-schemas-safely`
- `profiling-postgres-query-performance`

### Architecture & engineering
- `choosing-application-architecture`
- `designing-software-boundaries`
- `documenting-architecture-decisions`
- `planning-safe-refactors`

### Codebase intelligence
- `mapping-existing-codebase-structure`
- `tracing-code-execution-paths`
- `analyzing-change-blast-radius`
- `investigating-codebase-semantically`
- `planning-codebase-changes-with-evidence`

### Developer career
- `assessing-developer-proficiency`
- `building-developer-career-roadmaps`
- `teaching-developer-concepts`
- `evaluating-developer-proficiency`
- `designing-developer-portfolio-evidence`
- `analyzing-developer-career-opportunities`

### Quality & testing
- `designing-test-strategies`
- `testing-integration-boundaries`
- `testing-web-applications-end-to-end`
- `building-regression-tests`

### Application security
- `threat-modeling-applications`
- `reviewing-web-security`
- `reviewing-api-security`
- `auditing-dependency-risk`

### Engineering workflow
- `planning-engineering-work`
- `managing-implementation-slices`
- `reviewing-pull-requests`
- `writing-effective-technical-handoffs`

### Brand design
- `defining-brand-strategy`
- `naming-brands-and-products`
- `designing-visual-identities`
- `building-brand-guidelines`
- `writing-brand-voice-and-messaging`

### Writing & communication
- `planning-written-communication`
- `writing-conversion-copy`
- `writing-product-and-ux-copy`
- `editing-for-clarity-and-tone`
- `humanizing-generated-prose`

### Agent practice
- `selecting-working-methods`
- `turning-techniques-into-skills`

### Delivery
- `shipping-github-vercel-changes`

### Game development
- `building-hybrid-game-assets`
- `reconstructing-images-as-threejs`
- `creating-character-sprite-pipelines`
- `designing-action-combat`
- `testing-playable-games`

## Layered motion and procedural 3D

The motion stack is intentionally layered: `craft-premium-motion` owns direction and technology selection; `engineering-gsap-animations` owns GSAP implementation in React/Next.js; and `optimizing-frontend-motion-performance` owns runtime profiling. This avoids making GSAP the default for effects that CSS or Motion can handle.

`reconstructing-images-as-threejs` is an optional, evidence-limited workflow for code-only procedural reconstruction. It does not replace authored GLB/Blender pipelines and must not claim exact hidden geometry or animation readiness without the required gates.

## Backend & Data v1

The Backend & Data pack is deliberately provider- and ORM-independent. It separates four concerns that should remain independently invokable: relational modeling, Node.js API trust boundaries, safe PostgreSQL schema evolution, and evidence-led PostgreSQL query profiling.

The methods prefer database constraints and measured access patterns over speculative abstraction, use compatibility-first production migration strategies, and require execution evidence before query/index recommendations.

## Architecture & Engineering v1

The Architecture & Engineering pack is deliberately topology- and runtime-agnostic. It separates four concerns that should remain independently invokable: choosing application architecture from real quality attributes and constraints, designing cohesive software boundaries, documenting significant decisions with ADRs, and planning structural refactors as releasable migration slices.

The methods prefer the least distributed architecture that satisfies demonstrated forces, explicit ownership and dependency direction, durable decision rationale, and incremental evolution with verification and rollback. They do not require CodeGraph or another code-intelligence runtime.

## Codebase Intelligence v1

The Codebase Intelligence pack separates understanding the code that exists from designing a future architecture. Its five methods map current structure, trace execution paths, estimate change blast radius, investigate semantic questions, and prepare evidence-backed change briefs without taking ownership of architecture or implementation.

Each method keeps an evidence ledger that distinguishes observed, inferred, and unresolved claims with source locations, confidence, and relevance. Work begins with a narrow question, expands context only to close a named evidence gap, and stops when the available evidence is sufficient for the immediate decision.

CodeGraph can optionally accelerate structural retrieval when its MCP tool and a project index are already available. The verified fallback uses targeted repository search, direct source reads, imports, references, tests, and configuration under the same evidence contract. The methods never automatically install CodeGraph, initialize or index a project, or depend on CodeGraph or another vendor runtime.

See the canonical [CodeGraph integration guide](skills/mapping-existing-codebase-structure/references/codegraph.md) for the optional setup and fallback contract.

## Developer Career v1

The Developer Career pack separates six responsibilities that should remain independently invokable: evidence-aware current-state diagnosis, adaptive roadmap construction, gap-targeted teaching, criterion-based proficiency evaluation, portfolio-evidence design, and market/opportunity analysis.

The methods keep proficiency separate from confidence, treat learning completion and project existence as insufficient proof on their own, preserve provenance for external evidence, and allow market signals to prioritize development without rewriting demonstrated competency. `dev` is the pre-production integration branch for this `1.1.0` development line; production `main` and historical Stable `1.0.0` evidence remain unchanged until a later explicit promotion.

## Quality & Testing v1

The Quality & Testing pack separates four concerns that should remain independently invokable: designing a risk-based verification strategy, testing real integration boundaries, exercising a small set of critical web journeys end to end, and turning reproduced defects into durable regression guards.

The methods prefer the smallest test scope that can provide trustworthy evidence, real controllable dependencies over mocks that merely repeat assumptions, user-facing browser contracts over implementation selectors, and observed RED → GREEN evidence for regression fixes. Playwright is an optional implementation tool, not a dependency of the pack.

## Application Security v1

The Application Security pack separates four concerns that should remain independently invokable: threat modeling from real architecture and trust boundaries, structured web-application security review, API-specific authorization and business-invariant review, and dependency/supply-chain risk triage.

The methods require authorized scope, reproducible evidence, realistic preconditions, controls at the enforcing boundary, and explicit post-remediation verification. Scanners and security tools can provide evidence, but no scanner, framework, or vendor is a dependency of the pack.

## Engineering Workflow v1

The Engineering Workflow pack separates four concerns that should remain independently invokable: turning broad objectives into verifiable engineering plans, managing implementation as small safe slices, reviewing pull requests against intent and current evidence, and writing technical handoffs that let a cold reader resume without rediscovery.

The methods prefer behavior-oriented plans over file checklists, conceptually focused batches over oversized branches, current CI and repository evidence over review assumptions, and explicit confirmed/hypothesis/planned/blocked state over chronological chat transcripts. They do not require a particular VCS host, project-management system, or agent runtime.

## Design & Brand v1

The Design & Brand pack separates five responsibilities that should remain independently invokable: defining the strategic decision system for the brand, developing and screening names, translating strategy into a visual identity system, documenting reproducible brand guidelines, and defining durable voice and messaging.

The methods treat identity as a system rather than a logo deliverable, keep preliminary trademark searching distinct from legal clearance, make accessibility a design constraint, and separate durable brand voice from conversion copy. Conversion-copy and text-humanization methods are intentionally deferred to the separate Writing & Communication tranche.

## Writing & Communication v1

The Writing & Communication pack separates five responsibilities that should remain independently invokable: planning complex written communication, writing credible conversion copy, writing product and UX copy from real interface state, editing existing prose for clarity and tone, and humanizing generated prose without changing its factual payload.

The methods preserve supplied facts, evidence, citations, protected spans, and uncertainty; reject fabricated proof, urgency, scarcity, personal experience, and deceptive interaction patterns; and keep durable brand voice in Design & Brand. Humanization is a source-faithful editorial method, not AI-detector evasion.

## Selecting Working Methods

`selecting-working-methods` is the catalog-wide router for tasks that could legitimately invoke more than one method. It chooses one primary owner for the core decision, adds supporting methods only for distinct responsibilities, orders them by dependency, and prefers the smallest sufficient sequence over loading an entire pack.

The router treats **no skill** as a valid outcome when the collection does not materially improve the task. Once a method or sequence is selected, the router delegates and stops; it does not duplicate the specialized workflow. It is pack-agnostic, runtime-agnostic, and intentionally separate from `turning-techniques-into-skills`, which owns skill authoring rather than skill selection.

## New web-app default

`bootstrapping-modern-web-apps` owns the baseline technology decisions for new web applications. The default is Next.js App Router, React, TypeScript, Tailwind CSS v4, ESLint, and Prettier with `prettier-plugin-tailwindcss`. shadcn/ui is used as a primitive layer when useful, not as a visual identity.

The skill also requires Tailwind-aware Prettier configuration, including the Tailwind v4 stylesheet entry and class sorting inside helpers such as `cn`, `clsx`, and `cva`.

## Microsite foundation

The public microsite foundation is an isolated Next.js application in
`apps/web`; the repository root remains a normal Node project, not an npm
workspace. Install and run the application locally with:

```bash
npm install --prefix apps/web
npm --prefix apps/web run dev
```

Repository validation remains available through `npm test` and `npm run
validate`. The web gates can be run from the repository root:

```bash
npm run web:test
npm run web:typecheck
npm run web:lint
NEXT_PUBLIC_SITE_URL=https://skills.jhonatanoliveira.com npm run web:build
```

### Vercel handoff

Configure Vercel with **Root Directory** `apps/web` and grant the build access
to repository files above that directory. The application's `prebuild` step
validates and synchronizes `../../catalog/generated/catalog.json`, so a
root-directory-only checkout cannot build it correctly.

`dev` is the pre-production integration branch; `main` is the production
branch. Pull requests receive Vercel Preview Deployments. For each Preview,
set `NEXT_PUBLIC_SITE_URL` to that Preview's `https://<deployment>.vercel.app`
URL. For production, set it to the canonical
`https://skills.jhonatanoliveira.com` URL. The canonical domain is
`skills.jhonatanoliveira.com`; `https://agent-skills-vert.vercel.app` remains
the fallback deployment URL.

## Install

Codex and other Agent Skills-compatible runtimes can discover personal skills under `~/.agents/skills/`.

### Install the complete collection

### WSL / Linux / macOS

```bash
bash install.sh
```

### Windows PowerShell

```powershell
./install.ps1
```

Both scripts copy only the skill directories into the personal skills directory.

### Install one skill

Pass `--skill <name>` to install only a named canonical skill. The option can be
repeated when you need more than one skill.

```bash
./install.sh --skill craft-premium-motion
```

```powershell
./install.ps1 --skill craft-premium-motion
```

## Catalog and thematic packs

`skills/<slug>/SKILL.md` remains the canonical agent instruction. Reader-facing
and discovery metadata lives in `catalog/skills/`, while `catalog/packs/`
defines ordered pack membership. `catalog/catalog.json` owns the collection
version and locale contract, and `catalog/generated/catalog.json` is the
committed deterministic projection for read-only consumers; never edit the
generated file by hand.

The active, installable packs are:

- `frontend-product` — Frontend & Product (8 skills);
- `motion` — Motion (5 skills);
- `game-development` — Game Development (5 skills);
- `backend-data` — Backend & Data (4 skills);
- `architecture-engineering` — Architecture & Engineering (4 skills);
- `codebase-intelligence` — Codebase Intelligence (5 skills);
- `quality-testing` — Quality & Testing (4 skills);
- `application-security` — Application Security (4 skills);
- `engineering-workflow` — Engineering Workflow (4 skills);
- `design-brand` — Design & Brand (5 skills);
- `writing-communication` — Writing & Communication (5 skills);
- `developer-career` — Developer Career (6 skills).

All twelve published packs are active and installable.

Install an active pack on Bash or PowerShell:

```bash
./install.sh --pack backend-data
```

```powershell
./install.ps1 --pack backend-data
```

Pack and individual selections can be mixed. Pack members retain manifest
order, explicit skills follow in lexical order, and duplicates are installed
only once:

```bash
./install.sh --pack motion --skill turning-techniques-into-skills
```

```powershell
./install.ps1 --pack motion --skill turning-techniques-into-skills
```

Selecting an unknown pack is rejected before the destination is changed.

When adding a skill, add its `catalog/skills/<slug>.json` metadata in both `en`
and `pt-BR`, update every affected pack in both locales, then regenerate and
validate the catalog. Run both `npm test` and `npm run validate`; together they
form the complete project gate:

```bash
npm run catalog:generate
npm run catalog:check
npm run validate:catalog
npm test
npm run validate
```

Catalog and pack architecture is documented in the
[approved catalog and packs design](docs/superpowers/specs/2026-08-26-agent-skills-studio-catalog-packs-design.md)
and the
[catalog and packs implementation plan](docs/superpowers/plans/2026-08-26-agent-skills-studio-catalog-packs.md).

## Catálogo e pacotes temáticos (Português)

`skills/<slug>/SKILL.md` continua sendo a instrução canônica do agente. Os
metadados de leitura e descoberta ficam em `catalog/skills/`, enquanto
`catalog/packs/` define a ordem e os membros de cada pacote.
`catalog/catalog.json` mantém a versão e o contrato de idiomas da coleção, e
`catalog/generated/catalog.json` é a projeção determinística versionada para
consumidores somente leitura; não edite o arquivo gerado manualmente.

Os pacotes ativos e instaláveis são:

- `frontend-product` — Frontend e Produto (8 skills);
- `motion` — Motion (5 skills);
- `game-development` — Desenvolvimento de Jogos (5 skills);
- `backend-data` — Backend e Dados (4 skills);
- `architecture-engineering` — Arquitetura e Engenharia (4 skills);
- `codebase-intelligence` — Inteligência de Codebase (5 skills);
- `quality-testing` — Qualidade e Testes (4 skills);
- `application-security` — Segurança de Aplicações (4 skills);
- `engineering-workflow` — Fluxo de Engenharia (4 skills).
- `design-brand` — Design & Marca (5 skills);
- `writing-communication` — Escrita & Comunicação (5 skills);
- `developer-career` — Carreira de Desenvolvedor (6 skills).

Todos os doze pacotes publicados estão ativos e são instaláveis.

Instale um pacote ativo com Bash ou PowerShell:

```bash
./install.sh --pack backend-data
```

```powershell
./install.ps1 --pack backend-data
```

É possível combinar seleções de pacote e skill. Os membros dos pacotes mantêm
a ordem do manifesto, as skills explícitas vêm depois em ordem lexical e
duplicatas são instaladas apenas uma vez:

```bash
./install.sh --pack motion --skill turning-techniques-into-skills
```

```powershell
./install.ps1 --pack motion --skill turning-techniques-into-skills
```

Um pacote desconhecido é rejeitado antes de qualquer alteração no destino.

Ao adicionar uma skill, inclua os metadados em
`catalog/skills/<slug>.json` nos dois idiomas, `en` e `pt-BR`, atualize cada
pacote afetado nos dois idiomas e depois gere e valide o catálogo. Execute
`npm test` e `npm run validate`; juntos, eles formam o gate completo do projeto:

```bash
npm run catalog:generate
npm run catalog:check
npm run validate:catalog
npm test
npm run validate
```

Consulte o
[design aprovado do catálogo e dos pacotes](docs/superpowers/specs/2026-08-26-agent-skills-studio-catalog-packs-design.md)
e o
[plano de implementação do catálogo e dos pacotes](docs/superpowers/plans/2026-08-26-agent-skills-studio-catalog-packs.md).

## Plugin and local marketplace

The skills-only plugin identifier is `agent-skills-studio`. Its
`.codex-plugin/plugin.json` manifest points at `./skills/`, so plugin and
filesystem installations use the same canonical source.

For local marketplace testing, clone this repository and use
`@plugin-creator` to wire the checked-out repository into a local marketplace
from `.agents/plugins/marketplace.json`; then install `agent-skills-studio` in
the supported ChatGPT or Codex surface. Confirm the local package before
testing it with:

```bash
node scripts/validate-plugin.mjs
```

Local and repository marketplace availability varies by surface. The filesystem
installers above remain the portable option for compatible local environments.

## Bootstrap a project for Codex

After cloning this repository, you can prepare an existing or newly scaffolded web project with one command. The bootstrap installs this repository's skills into `~/.agents/skills/`, creates a project-local `AGENTS.md`, configures Prettier + Tailwind class sorting, and adds `format` / `format:check` scripts when a `package.json` exists.

### WSL / Linux / macOS

```bash
./setup-project.sh /path/to/project
```

### Windows PowerShell

```powershell
./setup-project.ps1 C:\Dev\my-project
```

Run the command from this repository and point it at the project you want Codex to work on. Existing `AGENTS.md` and `prettier.config.mjs` files are preserved by default. Use `--force` only when you intentionally want the generated defaults to replace them.

Useful options:

```text
--force        replace generated files if they already exist
--skip-deps    do not install prettier/prettier-plugin-tailwindcss
--skip-skills  do not copy global skills to ~/.agents/skills
```

The dependency installer respects the project's lockfile (`pnpm`, Yarn, Bun, or npm) and falls back to npm when no package-manager convention exists.

### Typical VS Code + Codex workflow

```bash
git clone https://github.com/jhonatan-oliveiradev/agent-skills.git
cd agent-skills
./setup-project.sh ../my-next-app
code ../my-next-app
```

Inside Codex, you can then work normally. The project-local `AGENTS.md` provides repository rules, while the reusable skills provide specialized workflows such as UI fidelity, motion, visual QA, backend/data engineering, architecture, quality/testing, application security, engineering workflow, and delivery. When ownership is ambiguous or several methods could apply, `selecting-working-methods` can route the task to the smallest useful sequence before execution; you can also explicitly name a specialized skill in the prompt.

## Validate

```bash
npm test
npm run validate
```

Together, these commands form the complete gate: `npm test` runs every test,
while `npm run validate` validates skills and bilingual catalog metadata,
confirms the generated catalog is byte-current, and validates the plugin. Skill
validation checks folder/name consistency, required frontmatter, trigger
descriptions, duplicate names, and privacy guardrails.

## Recommended repository instructions

Use `AGENTS.example.md` as a starting point for project-level agent instructions. Keep project-specific architecture or business rules in each project's own `AGENTS.md`; do not push confidential project context back into this reusable library.

## Versioning

The current Studio release version is owned by `VERSION` and synchronized across the root package, plugin manifest, catalog manifest, and web package. `main` is the production branch; release candidates are prepared in focused release branches and promoted only after the complete repository gate passes.

The implementation foundation follows the [approved design spec](docs/superpowers/specs/2026-08-25-agent-skills-studio-design.md) and the [foundation plan](docs/superpowers/plans/2026-08-25-agent-skills-studio-foundation.md).

This repository follows semantic versioning:

- patch: clarification or correction without changing skill scope;
- minor: new skill or meaningful new workflow capability;
- major: breaking trigger, structure, or behavior changes that could alter how agents select or execute existing skills.

See `CHANGELOG.md` for release notes.

## Attribution

Research sources include the MIT-licensed `MengTo/Skills`, GreenSock's MIT-licensed official GSAP skills, LottieFiles' MIT-licensed motion-design skill, and Apache-2.0 `img2threejs`, plus official PostgreSQL and Node.js documentation, the OWASP Top 10:2025, OWASP ASVS 5.0.0, OWASP API Security Top 10:2023, OWASP Web Security Testing Guide and Software Supply Chain Security guidance, SEI and Microsoft architecture guidance, AWS architectural decision records, Martin Fowler engineering and testing guidance, Playwright best practices, Google Testing Blog guidance, Microsoft testing strategy references, DORA small-batch guidance, Google Engineering Practices, and GitHub pull-request documentation used for the engineering, quality, application-security, and engineering-workflow methods. `MAPPING.md` records whether each source was adapted, merged, referenced, or deliberately kept separate. Local skill text is maintained independently rather than mirrored wholesale.
