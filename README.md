# Jhonatan Agent Skills

A curated Agent Skills library for production frontend, product design, motion, visual QA, delivery workflows, and game-development tasks. It is inspired by useful patterns from the broader agent-skills ecosystem, but the skills in this repository are intentionally rewritten, consolidated, and kept project-agnostic.

## Principles

- Prefer narrow, explicit skill triggers over a huge library of overlapping presets.
- Preserve existing repository conventions before applying personal defaults.
- Treat design fidelity, accessibility, performance, and verification as part of implementation quality.
- Keep reusable skills free of private client data, credentials, internal URLs, proprietary copy, and project-specific secrets.
- Add optional libraries only when a concrete requirement justifies them.

## Skills

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
- `orchestrating-cinematic-web-motion`
- `optimizing-frontend-motion-performance`

### Delivery & knowledge capture
- `shipping-github-vercel-changes`
- `turning-techniques-into-skills`

### Game development
- `building-hybrid-game-assets`
- `creating-character-sprite-pipelines`
- `designing-action-combat`
- `testing-playable-games`

## New web-app default

`bootstrapping-modern-web-apps` owns the baseline technology decisions for new web applications. The default is Next.js App Router, React, TypeScript, Tailwind CSS v4, ESLint, and Prettier with `prettier-plugin-tailwindcss`. shadcn/ui is used as a primitive layer when useful, not as a visual identity.

The skill also requires Tailwind-aware Prettier configuration, including the Tailwind v4 stylesheet entry and class sorting inside helpers such as `cn`, `clsx`, and `cva`.

## Install

Codex and other Agent Skills-compatible runtimes can discover personal skills under `~/.agents/skills/`.

### WSL / Linux / macOS

```bash
bash install.sh
```

### Windows PowerShell

```powershell
./install.ps1
```

Both scripts copy only the skill directories into the personal skills directory.

## Validate

```bash
node scripts/validate-skills.mjs
```

The validator checks folder/name consistency, required frontmatter, trigger descriptions, duplicate names, and basic privacy guardrails.

## Recommended repository instructions

Use `AGENTS.example.md` as a starting point for project-level agent instructions. Keep project-specific architecture or business rules in each project's own `AGENTS.md`; do not push confidential project context back into this reusable library.

## Versioning

This repository follows semantic versioning:

- patch: clarification or correction without changing skill scope;
- minor: new skill or meaningful new workflow capability;
- major: breaking trigger, structure, or behavior changes that could alter how agents select or execute existing skills.

See `CHANGELOG.md` for release notes.

## Attribution

Initial research included the MIT-licensed `MengTo/Skills` repository. `MAPPING.md` documents which upstream concepts informed this curated library. The local skill text is maintained independently rather than mirrored wholesale.
