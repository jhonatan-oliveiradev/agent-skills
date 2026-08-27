# Agent Skills Studio — Catalog and Packs Design

**Status:** Approved design, pending implementation plan

**Date:** 2026-08-26

**Repository:** `jhonatan-oliveiradev/agent-skills`

**Parent design:** `docs/superpowers/specs/2026-08-25-agent-skills-studio-design.md`

## 1. Purpose

Create the bilingual, versioned catalog that connects the canonical `skills/` tree to distribution, search, installation, and the future microsite.

This phase must make one repository change sufficient to update every downstream surface: add or edit a valid skill, update its catalog metadata and pack relationships, regenerate the deterministic index, and let validation reject any stale or incomplete state.

## 2. Source-of-truth boundaries

- `skills/<slug>/SKILL.md` remains the canonical agent instruction.
- `catalog/skills/<slug>.json` is the canonical reader-facing and discovery metadata for that skill.
- `catalog/packs/<slug>.json` is the canonical pack definition and ordered membership list.
- `catalog/catalog.json` carries the synchronized collection version and schema version.
- `catalog/generated/catalog.json` is a committed deterministic projection for the microsite and other read-only consumers.
- Generated data is never edited manually.
- The website will consume the generated catalog directly from the repository and will not call GitHub at runtime.

## 3. Directory structure

```text
catalog/
├── catalog.json
├── schemas/
│   ├── catalog.schema.json
│   ├── pack.schema.json
│   └── skill.schema.json
├── skills/
│   └── <skill-slug>.json
├── packs/
│   └── <pack-slug>.json
└── generated/
    └── catalog.json
```

Supporting code lives in focused Node modules:

```text
scripts/
├── generate-catalog.mjs
├── generate-catalog.test.mjs
├── validate-catalog.mjs
├── validate-catalog.test.mjs
└── lib/
    ├── catalog.mjs
    ├── catalog.test.mjs
    └── privacy.mjs
```

Only Node.js built-ins are used in this phase.

## 4. Collection manifest

`catalog/catalog.json` has this contract:

```json
{
  "$schema": "./schemas/catalog.schema.json",
  "schemaVersion": 1,
  "version": "1.0.0-beta.1",
  "defaultLocale": "en",
  "locales": ["en", "pt-BR"]
}
```

The catalog version must equal `package.json.version`, `VERSION`, and `.codex-plugin/plugin.json.version`.

## 5. Skill metadata contract

Every canonical skill must have exactly one `catalog/skills/<slug>.json`, and every catalog skill must resolve to exactly one canonical skill directory.

Required technical fields:

```json
{
  "$schema": "../schemas/skill.schema.json",
  "slug": "craft-premium-motion",
  "category": "motion",
  "packs": ["motion"],
  "maturity": "stable",
  "difficulty": "advanced",
  "featured": true,
  "compatibility": {
    "surfaces": ["chatgpt", "codex"],
    "operatingSystems": ["linux", "macos", "windows"],
    "installModes": ["plugin", "filesystem"]
  },
  "tags": ["motion", "direction", "accessibility"],
  "dependencies": [],
  "relatedSkills": ["engineering-gsap-animations"],
  "version": "1.0.0-beta.1",
  "updatedAt": "2026-08-26",
  "locales": {
    "en": {
      "displayName": "Craft Premium Motion",
      "summary": "Plan coherent motion systems before implementation.",
      "primaryBenefit": "Turns product intent into purposeful and accessible motion direction.",
      "whenToUse": "Use when an interface needs a coordinated motion language or signature interaction.",
      "whenNotToUse": "Do not use for a single isolated transition with no wider motion decisions.",
      "useCases": ["Define a product motion language", "Direct a cinematic web sequence"],
      "examplePrompts": ["Use craft-premium-motion to define the motion direction for this landing page."]
    },
    "pt-BR": {
      "displayName": "Criação de Motion Premium",
      "summary": "Planeje sistemas de movimento coerentes antes da implementação.",
      "primaryBenefit": "Transforma a intenção do produto em uma direção de movimento útil e acessível.",
      "whenToUse": "Use quando uma interface precisar de uma linguagem de movimento coordenada ou interação marcante.",
      "whenNotToUse": "Não use para uma única transição isolada sem decisões mais amplas de movimento.",
      "useCases": ["Definir a linguagem de movimento de um produto", "Dirigir uma sequência web cinematográfica"],
      "examplePrompts": ["Use craft-premium-motion para definir a direção de movimento desta landing page."]
    }
  }
}
```

Enums:

- `category`: `frontend`, `product-design`, `motion`, `game-development`, `delivery`, or `meta`;
- `maturity`: `proposed`, `research`, `experimental`, `beta`, `stable`, or `deprecated`;
- `difficulty`: `beginner`, `intermediate`, or `advanced`;
- `surfaces`: `chatgpt` and/or `codex`;
- `operatingSystems`: `linux`, `macos`, and/or `windows`;
- `installModes`: `plugin` and/or `filesystem`.

Dependencies are explicit objects rather than ambiguous strings:

```json
{
  "name": "gsap",
  "type": "library",
  "required": false,
  "url": "https://gsap.com"
}
```

Allowed dependency types are `library`, `tool`, `service`, and `skill`. URLs are optional and, when present, must be public HTTPS URLs.

Each locale must contain equivalent reader-facing fields:

- `displayName`;
- `summary`;
- `primaryBenefit`;
- `whenToUse`;
- `whenNotToUse`;
- `useCases` with at least two items;
- `examplePrompts` with at least one item.

English is canonical editorially, but Portuguese must be complete and equivalent. Translation is written deliberately; automatic translation is out of scope.

Tags remain stable technical identifiers in English so URLs and filters do not fork by locale. The microsite localizes their labels at presentation time.

## 6. Pack contract

Pack manifests use this shape:

```json
{
  "$schema": "../schemas/pack.schema.json",
  "slug": "motion",
  "status": "active",
  "featured": true,
  "color": "violet",
  "version": "1.0.0-beta.1",
  "skills": [
    "craft-premium-motion",
    "engineering-gsap-animations"
  ],
  "locales": {
    "en": {
      "name": "Motion",
      "summary": "Direction, engineering, and performance for purposeful interface motion.",
      "description": "A coordinated workflow for planning, building, and auditing expressive web motion.",
      "outcomes": ["Define a coherent motion language", "Ship accessible and performant animation"]
    },
    "pt-BR": {
      "name": "Motion",
      "summary": "Direção, engenharia e performance para movimentos de interface com propósito.",
      "description": "Um fluxo coordenado para planejar, construir e auditar motion expressivo para web.",
      "outcomes": ["Definir uma linguagem de movimento coerente", "Entregar animações acessíveis e performáticas"]
    }
  }
}
```

Pack status is `active` or `planned`.

- Active packs must contain at least one skill, may be installed, and must be internally consistent with each skill's `packs` field.
- Planned packs must have an empty `skills` array, appear in roadmap/catalog data, and cannot be installed.
- Pack order is meaningful and preserved in generated data and installation guidance.
- Skills may belong to more than one active pack when the workflow genuinely crosses boundaries.
- Skills may remain outside a pack while still appearing in the complete collection.

## 7. Initial pack definitions

### Frontend & Product

Slug: `frontend-product`

Color: electric blue

Ordered members:

1. `bootstrapping-modern-web-apps`
2. `designing-ui-systems`
3. `building-premium-nextjs-interfaces`
4. `building-conversion-product-pages`
5. `translating-figma-to-nextjs`
6. `implementing-reference-faithful-ui`
7. `auditing-pixel-perfect-frontend`
8. `shipping-github-vercel-changes`

### Motion

Slug: `motion`

Color: violet

Ordered members:

1. `craft-premium-motion`
2. `engineering-gsap-animations`
3. `orchestrating-cinematic-web-motion`
4. `optimizing-frontend-motion-performance`
5. `reconstructing-images-as-threejs`

### Game Development

Slug: `game-development`

Color: amber

Ordered members:

1. `designing-action-combat`
2. `building-hybrid-game-assets`
3. `creating-character-sprite-pipelines`
4. `reconstructing-images-as-threejs`
5. `testing-playable-games`

`reconstructing-images-as-threejs` intentionally belongs to Motion and Game Development because it supports both cinematic web experiences and code-based game/3D prototyping.

`turning-techniques-into-skills` remains a catalog-wide meta workflow instead of being forced into an unrelated initial pack.

### Planned packs

- `architecture-engineering` — Architecture & Engineering, cyan;
- `backend-data` — Backend & Data, green;
- `quality-testing` — Quality & Testing, coral.

All three begin with `status: "planned"` and no members.

## 8. Deterministic generation

`generateCatalog(repoRoot)` reads the collection manifest, skill metadata, pack manifests, and canonical skill records, then returns a stable object with:

- `schemaVersion` and synchronized `version`;
- supported locales;
- skills sorted by slug;
- packs sorted by active/planned state and source filename;
- pack membership expanded with resolved skill summaries;
- aggregate filter values;
- counts by category, maturity, difficulty, and pack;
- a SHA-256 `sourceDigest` calculated from canonical serialized inputs.

Serialization uses two-space indentation and a final newline. It contains no generation timestamp, machine path, or nondeterministic filesystem ordering.

`node scripts/generate-catalog.mjs` writes `catalog/generated/catalog.json`.

`node scripts/generate-catalog.mjs --check` regenerates in memory and fails when the committed artifact differs byte-for-byte. CI always runs check mode.

## 9. Validation

`validateCatalog(repoRoot)` returns structured errors and counts without terminating the importing process. Its CLI wrapper prints actionable errors and exits with code `1` on failure.

Validation rejects:

- malformed JSON or unsupported schema version;
- missing required fields or unknown enum values;
- filename/slug mismatch;
- missing metadata for a canonical skill;
- catalog records without canonical skills;
- missing or incomplete `en` or `pt-BR` content;
- invalid versions or dates;
- catalog/plugin/package/VERSION mismatch;
- duplicate tags, relations, dependencies, pack members, or slugs;
- self-relations or relations to missing skills;
- pack relations that are not bidirectionally consistent;
- active empty packs or nonempty planned packs;
- planned-pack installation;
- non-public dependency URLs;
- forbidden private-data patterns in any catalog or generated file;
- symlinks inside the catalog tree;
- stale generated output.

Privacy patterns are moved into `scripts/lib/privacy.mjs` so skill validation and catalog validation share one policy.

## 10. Pack installation

The existing installer adds repeated `--pack <slug>` arguments while preserving repeated `--skill <slug>` and full-collection installation.

Selection rules:

- no `--skill` or `--pack`: install the complete collection;
- one or more packs: install the ordered union of active pack members;
- skills and packs together: install the deterministic union, without duplicates;
- unknown skill or pack: reject before filesystem mutation;
- planned pack: reject with `Pack is not installable: <slug>` before mutation.

The programmatic API becomes:

```js
installSkills({ repoRoot, destination, names?, packs? }): Promise<string[]>
```

Existing callers that pass only `names` remain compatible. The hardened staging, rollback, containment, and symlink protections remain unchanged.

## 11. Package scripts and CI

The root package adds:

```json
{
  "catalog:generate": "node scripts/generate-catalog.mjs",
  "catalog:check": "node scripts/generate-catalog.mjs --check",
  "validate:catalog": "node scripts/validate-catalog.mjs"
}
```

The aggregate `validate` command runs skill validation, catalog validation, generated-catalog verification, and plugin validation.

Linux and Windows CI run the same catalog tests and validation. Installer smoke coverage includes one active pack and confirms that a planned pack is rejected without mutation.

## 12. Testing strategy

Tests use temporary real filesystem fixtures and cover:

- catalog discovery and stable ordering;
- complete bilingual records;
- missing metadata and orphan metadata;
- relation and pack integrity;
- active and planned pack invariants;
- synchronized versions;
- deterministic generation and stale-output detection;
- recursive privacy and symlink rejection;
- pack-only and mixed installer selection;
- unknown/planned pack atomic rejection;
- Windows-safe path behavior;
- the real repository's 18-skill catalog.

The phase gate requires all tests, all validators, catalog check mode, full collection smoke, active-pack smoke, and `git diff --check` to pass.

## 13. Error handling

- Parsing errors include the repository-relative file path.
- Relation errors identify both source and missing target.
- Locale errors identify the exact locale and field.
- Generated drift explains that `npm run catalog:generate` must be run.
- Installer errors occur before destination mutation for all selection failures.
- Unexpected filesystem failures are rethrown rather than mislabeled as schema errors.

## 14. Out of scope

- Next.js or microsite implementation;
- MDX editorial pages;
- search UI and URL filters;
- automatic translation;
- adding the future Architecture, Backend, or Quality skills;
- public API, database, CMS, ratings, or remote execution;
- release promotion or merge to `dev`/`main`.

## 15. Success criteria

This phase is complete when:

- all 18 canonical skills have valid bilingual metadata;
- three active and three planned packs validate;
- active packs install safely on Linux and Windows;
- the generated catalog is deterministic and current;
- package, plugin, collection, and catalog versions match;
- no private or symlinked catalog content passes validation;
- a future microsite can render skills, packs, filters, localized summaries, relations, and installation choices without reading raw `SKILL.md` files at runtime.
