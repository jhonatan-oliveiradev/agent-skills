# Agent Skills Studio — Repository and Microsite Design

**Status:** Approved design, pending implementation plan  
**Date:** 2026-08-25  
**Repository:** `jhonatan-oliveiradev/agent-skills`  
**Canonical domain:** `skills.jhonatanoliveira.com`

## 1. Purpose

Evolve the existing Agent Skills repository into a friendly, bilingual, installable, and community-ready product.

The repository will remain the single source of truth for the skills, while also powering:

- standalone skill installation;
- thematic packs;
- a skills-only plugin;
- a repository marketplace;
- a bilingual documentation microsite;
- automated validation and releases;
- public contribution and roadmap workflows.

The product working name is **Agent Skills Studio**, with the positioning:

> Production-ready workflows for ChatGPT and Codex.

The product has its own visual identity and is signed **Created by Jhonatan Oliveira**.

## 2. Audiences

The experience must support two audiences without forcing either through the other's path.

### New skill users

They need plain-language benefits, guided installation, examples, compatibility explanations, and clear recommendations.

Primary path: **Quick Start**.

### Experienced developers

They need manifests, source files, architecture decisions, individual installation, contribution instructions, version history, and verification details.

Primary path: **Understand the System**.

## 3. Product principles

1. The repository is the only source of truth.
2. The microsite is built, audited, and evolved with the skills it distributes.
3. Every valid new skill automatically updates the catalog and related distribution surfaces.
4. Skills stay focused and project-agnostic.
5. The collection avoids overlapping triggers and fashionable dependencies without a demonstrated requirement.
6. Accessibility, performance, privacy, and verification are release requirements.
7. No client data, private URLs, credentials, proprietary copy, or confidential project context may enter the reusable library.

## 4. Distribution model

Users can install at three levels:

1. the complete collection;
2. a thematic pack;
3. one individual skill.

Initial packs:

- Frontend & Product;
- Motion;
- Game Development.

Planned packs:

- Architecture & Engineering;
- Backend & Data;
- Quality & Testing.

Quality & Testing remains separate from Backend because automated quality workflows apply across frontend, backend, full-stack applications, and games.

Standalone filesystem skills remain available for compatible local Codex environments. The skills-only plugin is the installable distribution path for supported ChatGPT and Codex plugin surfaces.

## 5. Repository architecture

Target structure:

```text
agent-skills/
├── .codex-plugin/
│   └── plugin.json
├── .agents/
│   └── plugins/
│       └── marketplace.json
├── apps/
│   └── web/
├── skills/
│   └── <skill-name>/
│       ├── SKILL.md
│       ├── agents/
│       ├── references/
│       ├── scripts/
│       └── assets/
├── catalog/
│   ├── skills/
│   │   └── <skill-name>.json
│   └── packs/
│       └── <pack-name>.json
├── content/
│   ├── en/
│   └── pt-BR/
├── scripts/
├── docs/
└── package.json
```

### Canonical skill source

`skills/` is canonical. Installers, the plugin, validation, releases, and the website all consume the same directories.

The repository root acts as the skills-only plugin package. Its `.codex-plugin/plugin.json` points to `./skills/`. This avoids a second generated or copied skill tree.

### Catalog metadata

The open Agent Skills files stay focused. User-facing catalog metadata lives separately in `catalog/skills/<slug>.json`.

Catalog metadata includes:

- category and packs;
- maturity;
- difficulty;
- compatibility;
- tags;
- example prompts;
- dependencies;
- related skills;
- user-facing use cases;
- version and update date;
- localized display content.

Pack manifests contain an ordered list of skill slugs and bilingual pack metadata.

A schema validator rejects missing metadata, invalid slugs, nonexistent skills, invalid relations, and incomplete translations.

## 6. Microsite information architecture

Canonical English routes live at the root. Portuguese routes use the `/pt-br` prefix.

```text
/
├── /skills
│   └── /skills/[slug]
├── /packs
│   └── /packs/[slug]
├── /getting-started
├── /built-with-skills
├── /roadmap
├── /contribute
└── /changelog

/pt-br
└── localized equivalents
```

The site provides persistent language switching, equivalent navigation, localized metadata, canonical URLs, and `hreflang` annotations.

### Home narrative

1. Explain the value proposition.
2. Offer **Explore skills** and **Install the collection**.
3. Let visitors choose a goal rather than requiring skill-name knowledge.
4. Present featured packs.
5. Show proof from the site's own construction.
6. Explain choose → install → invoke.
7. Demonstrate a representative workflow.
8. Invite GitHub participation.

### Catalog

Search and filters cover:

- area;
- pack;
- task;
- experience level;
- compatible environment;
- dependencies;
- maturity.

Filter state is shareable through the URL.

Each card communicates purpose, trigger, complexity, pack, compatibility, and one short invocation example.

### Skill detail

Each skill page includes:

- primary benefit;
- use and non-use boundaries;
- problems solved;
- workflow summary;
- copyable prompts;
- tools and dependencies;
- related skills;
- included packs;
- version and last update;
- source link;
- individual installation.

The canonical full `SKILL.md` remains available in GitHub. The microsite presents a reader-oriented explanation rather than duplicating the raw instructions.

### Guided installation

The installation assistant asks for:

1. environment;
2. complete collection, pack, or individual skill;
3. operating system;
4. installation or update intent.

It generates the correct command and verification steps. Unsupported surface combinations are explained rather than hidden.

## 7. Microsite implementation

Initial stack:

- Next.js App Router;
- React and TypeScript;
- Tailwind CSS v4;
- accessible Radix or shadcn primitives where useful;
- `nuqs` for shareable catalog filters;
- statically generated content;
- MDX for editorial content;
- CSS or Motion for local interactions;
- GSAP only for a justified signature timeline;
- Vercel previews and production;
- no database, authentication, or CMS in v1.

The build consumes repository files directly. It does not depend on the GitHub API at runtime.

### Build pipeline

A skill change triggers:

1. skill validation;
2. catalog metadata validation;
3. pack reference validation;
4. generated catalog verification;
5. plugin and installer tests;
6. bilingual site build;
7. navigation and accessibility tests;
8. Vercel Preview;
9. production deployment after merge.

The build fails on:

- missing catalog metadata;
- missing translation;
- duplicate slug;
- broken skill or reference relation;
- pack references to missing skills;
- invalid installation command;
- stale generated artifacts;
- application build or test failure.

## 8. The site as proof of value

The microsite is created and audited through the collection itself.

| Responsibility | Skills |
| --- | --- |
| Project foundation | `bootstrapping-modern-web-apps` |
| Interface direction | `building-premium-nextjs-interfaces`, `designing-ui-systems` |
| Product communication | `building-conversion-product-pages` |
| Motion direction | `craft-premium-motion` |
| GSAP implementation when justified | `engineering-gsap-animations` |
| Motion performance | `optimizing-frontend-motion-performance` |
| Visual QA | `auditing-pixel-perfect-frontend` |
| Delivery | `shipping-github-vercel-changes` |

The **Built with Skills** area records concrete decisions and outcomes. Initial proof experiences should include at least three of:

- interface before and after an audit;
- motion plus reduced-motion comparison;
- procedural Three.js reconstruction example;
- visual-fidelity checklist;
- modern project bootstrap example;
- decision log showing how a skill affected implementation.

These are product demonstrations, not decorative claims.

## 9. Visual direction

Working concept: **Precision in Motion**.

The site combines editorial clarity, engineering rigor, and limited expressive motion. It avoids generic AI-product aesthetics such as pervasive neon gradients, excessive glass surfaces, and purposeless particles.

### Identity

- ink-black and warm-white neutral base;
- one electric blue-violet primary accent;
- secondary pack colors;
- subtle technical grid;
- modular lines, nodes, and layers;
- typography-led layouts;
- commands treated as first-class product elements;
- a modular mark inspired by connected skill blocks.

Initial type direction:

- Instrument Sans for display and interface;
- Geist Mono for commands and technical metadata.

Pack colors:

- Frontend & Product: electric blue;
- Motion: violet;
- Game Development: amber;
- Architecture & Engineering: cyan;
- Backend & Data: green;
- Quality & Testing: coral.

Color is never the only category indicator.

### Signature interaction

The hero demonstrates:

1. a real request entering;
2. intent recognition;
3. matching skill activation;
4. workflow expansion;
5. validation;
6. catalog reveal.

`craft-premium-motion` owns direction. GSAP is used only if the sequence benefits from an authored timeline. Reduced motion receives a complete static sequence.

### Interaction principles

- prompt feedback;
- spatial transitions that clarify hierarchy;
- restrained stagger;
- one primary cinematic moment;
- no mandatory smooth scrolling;
- no navigation-blocking animation;
- complete keyboard, touch, and reduced-motion behavior;
- continuous effects pause outside the viewport.

Mobile reorganizes search, filters, and installation for one-handed use instead of merely shrinking desktop layouts.

## 10. Testing and quality gates

Required verification:

- unit tests for schemas, catalog generation, and commands;
- integration tests for packs, plugin composition, and installers;
- Playwright coverage for search, filters, locale switching, installation, and copy actions;
- automated accessibility checks;
- internal link validation;
- performance budgets;
- production build;
- Vercel deployment smoke test.

The site must remain usable without nonessential animation or client-side JavaScript.

## 11. Governance and community

After the migration, `main` is protected and changes merge through pull requests with required checks and Vercel Preview.

Community files:

- `CONTRIBUTING.md`;
- `CODE_OF_CONDUCT.md`;
- `SECURITY.md`;
- skill proposal template;
- bug report template;
- pull request template;
- attribution policy;
- skill testing guide.

Skill maturity states:

- proposed;
- research;
- experimental;
- beta;
- stable;
- deprecated.

Future Architecture, Backend, and Quality skills begin as public proposals. Each is created and tested independently before entering a stable pack.

## 12. Versioning and releases

The repository uses one synchronized version for:

- collection;
- plugin;
- catalog;
- microsite;
- installers.

Development continues under `0.x`. The complete public launch becomes `v1.0.0`.

A release tag must:

1. validate every skill;
2. generate and verify catalog data;
3. validate the plugin;
4. test Bash and PowerShell installers;
5. build both locales;
6. execute E2E and accessibility checks;
7. publish GitHub release notes;
8. promote the Vercel deployment;
9. verify the production domain.

Moving skills from the root to `skills/` is a breaking structural migration. Installers and project bootstrap scripts are updated in the same release. Duplicate compatibility copies are prohibited.

## 13. Deployment

Vercel provides:

- a Preview Deployment for every pull request;
- production from `main` only;
- `skills.jhonatanoliveira.com` as canonical domain;
- the Vercel URL as fallback;
- localized sitemap and metadata;
- per-skill and per-pack Open Graph content;
- localized 404 pages;
- basic error and Web Vitals monitoring;
- no invasive analytics in v1.

Exact DNS records are resolved from current Vercel and DNS-provider guidance during implementation.

## 14. v1 launch criteria

The release is ready only when:

- a new user can understand and install a skill without prior context;
- the complete collection installs on every declared environment;
- plugin and catalog resolve to the same canonical skill tree;
- English and Portuguese experiences are equivalent;
- required checks pass;
- the site demonstrates at least three real skill outcomes;
- install, update, and uninstall are documented;
- Preview and production deployments are manually verified.

## 15. Out of scope for v1

- accounts or authentication;
- database or CMS;
- ratings;
- comments;
- community uploads without pull-request review;
- arbitrary remote skill execution;
- paid plans;
- MCP server or custom plugin UI;
- automatic translation;
- public API.

## 16. Official references

- [Build skills](https://learn.chatgpt.com/docs/build-skills)
- [Build plugins](https://learn.chatgpt.com/docs/build-plugins)
- [Package your plugin](https://developers.openai.com/plugins/build/plugins)
