# Agent Skills Studio

A curated Agent Skills library for production frontend, product design, motion, visual QA, delivery workflows, and game-development tasks. It is inspired by useful patterns from the broader agent-skills ecosystem, but the skills in this repository are intentionally rewritten, consolidated, and kept project-agnostic.

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

### Delivery & knowledge capture
- `shipping-github-vercel-changes`
- `turning-techniques-into-skills`

### Game development
- `building-hybrid-game-assets`
- `reconstructing-images-as-threejs`
- `creating-character-sprite-pipelines`
- `designing-action-combat`
- `testing-playable-games`

## Layered motion and procedural 3D

The motion stack is intentionally layered: `craft-premium-motion` owns direction and technology selection; `engineering-gsap-animations` owns GSAP implementation in React/Next.js; and `optimizing-frontend-motion-performance` owns runtime profiling. This avoids making GSAP the default for effects that CSS or Motion can handle.

`reconstructing-images-as-threejs` is an optional, evidence-limited workflow for code-only procedural reconstruction. It does not replace authored GLB/Blender pipelines and must not claim exact hidden geometry or animation readiness without the required gates.

## New web-app default

`bootstrapping-modern-web-apps` owns the baseline technology decisions for new web applications. The default is Next.js App Router, React, TypeScript, Tailwind CSS v4, ESLint, and Prettier with `prettier-plugin-tailwindcss`. shadcn/ui is used as a primitive layer when useful, not as a visual identity.

The skill also requires Tailwind-aware Prettier configuration, including the Tailwind v4 stylesheet entry and class sorting inside helpers such as `cn`, `clsx`, and `cva`.

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
- `game-development` — Game Development (5 skills).

The catalog also publishes three roadmap packs that are not yet installable:
`architecture-engineering` (Architecture & Engineering), `backend-data`
(Backend & Data), and `quality-testing` (Quality & Testing).

Install an active pack on Bash or PowerShell:

```bash
./install.sh --pack motion
```

```powershell
./install.ps1 --pack motion
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

Selecting an unknown pack or a planned pack such as `backend-data` is rejected
before the destination is changed.

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
- `game-development` — Desenvolvimento de Jogos (5 skills).

O catálogo também publica três pacotes planejados, ainda não instaláveis:
`architecture-engineering` (Arquitetura e Engenharia), `backend-data` (Backend
e Dados) e `quality-testing` (Qualidade e Testes).

Instale um pacote ativo com Bash ou PowerShell:

```bash
./install.sh --pack motion
```

```powershell
./install.ps1 --pack motion
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

Um pacote desconhecido ou planejado, como `backend-data`, é rejeitado antes de
qualquer alteração no destino.

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

Inside Codex, you can then work normally. The project-local `AGENTS.md` provides repository rules, while the reusable skills provide specialized workflows such as UI fidelity, motion, visual QA, and delivery. You can let Codex select a matching skill or explicitly name one in the prompt.

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

This foundation is the unreleased v1 beta on
[`feat/agent-skills-studio-v1`](https://github.com/jhonatan-oliveiradev/agent-skills/tree/feat/agent-skills-studio-v1),
versioned `1.0.0-beta.1`. Its implementation follows the
[approved design spec](docs/superpowers/specs/2026-08-25-agent-skills-studio-design.md)
and the [foundation plan](docs/superpowers/plans/2026-08-25-agent-skills-studio-foundation.md).

This repository follows semantic versioning:

- patch: clarification or correction without changing skill scope;
- minor: new skill or meaningful new workflow capability;
- major: breaking trigger, structure, or behavior changes that could alter how agents select or execute existing skills.

See `CHANGELOG.md` for release notes.

## Attribution

Research sources include the MIT-licensed `MengTo/Skills`, GreenSock's MIT-licensed official GSAP skills, LottieFiles' MIT-licensed motion-design skill, and Apache-2.0 `img2threejs`. `MAPPING.md` records whether each source was adapted, merged, referenced, or deliberately kept separate. Local skill text is maintained independently rather than mirrored wholesale.
