# Changelog

All notable changes to this skill library are documented here.

## [0.4.0] - 2026-08-20

### Added
- Optional `create-web-app` starter for explicitly opting into the repository owner's preferred Next.js baseline.
- Cross-platform `create-web-app.sh` and `create-web-app.ps1` wrappers.
- Package-manager aware Next.js scaffolding and optional feature packs for shadcn/ui, Motion, GSAP, forms, and TanStack Query.
- Dry-run support for inspecting the starter plan without creating a project.
- Test coverage for scaffold command construction and optional dependency packs.

### Changed
- `bootstrapping-modern-web-apps` now has an explicit opt-in trigger so installing the reusable skills does not impose the personal stack on other users.

## [0.3.0] - 2026-08-20

### Added
- Cross-platform project bootstrap through `setup-project.sh`, `setup-project.ps1`, and `scripts/bootstrap-project.mjs`.
- Project-local `AGENTS.md` template for Codex repository instructions.
- Automatic installation of reusable skills into `~/.agents/skills/`.
- Package-manager detection for npm, pnpm, Yarn, and Bun when installing Prettier tooling.
- Non-destructive bootstrap behavior with explicit `--force`, `--skip-deps`, and `--skip-skills` controls.
- Node test coverage for Tailwind stylesheet detection and safe file generation.

### Changed
- Package version bumped to `0.3.0`.
- README now documents the VS Code + Codex project setup workflow.

## [0.2.0] - 2026-08-20

### Added
- `bootstrapping-modern-web-apps` as the single source of truth for new web-application stack decisions.
- Required Prettier 3.7+ and `prettier-plugin-tailwindcss` setup for Tailwind CSS projects.
- Tailwind CSS v4 `tailwindStylesheet` configuration and `tailwindFunctions` coverage for common class helpers.
- Automated skill validation and privacy guardrails.
- GitHub Actions validation workflow.

### Changed
- `building-premium-nextjs-interfaces` now delegates project scaffolding to `bootstrapping-modern-web-apps`.
- `AGENTS.example.md` now separates new-project defaults from existing-project conventions.
- Documentation explicitly prohibits reusable skills from containing confidential project or client information.

## [0.1.0] - 2026-08-20

### Added
- Initial curated library covering frontend/product design, motion, visual QA, delivery, reusable-skill authoring, and game-development workflows.
