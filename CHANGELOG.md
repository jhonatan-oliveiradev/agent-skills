# Changelog

All notable changes to this skill library are documented here.

## [1.0.0-beta.1] - Unreleased

### Microsite foundation

- Added the isolated bilingual Next.js foundation, its catalog synchronization,
  root web gates, and Linux/Windows CI validation.
- Documented the Vercel Root Directory, Preview/production branch policy, and
  deployment URLs. The complete catalog browsing experience remains a future
  microsite slice.

### Catalog & Packs

- Added one bilingual metadata record for each of the 18 canonical skills, with complete English and Brazilian Portuguese reader guidance.
- Added active Frontend & Product, Motion, and Game Development packs plus planned Architecture & Engineering, Backend & Data, and Quality & Testing packs.
- Added deterministic catalog generation and validation, pack-aware Bash and PowerShell installation, and shared local/CI package gates.

### Added
- Canonical skill migration to `skills/`, with no root-level compatibility copies.
- Shared Node installer used by the Bash and PowerShell entry points, including complete-collection and named-skill installation.
- The `agent-skills-studio` skills-only plugin and local marketplace manifest.
- Linux and Windows GitHub Actions validation, including installer smoke tests on both platforms.

## [0.5.0] - 2026-08-25

### Added
- `craft-premium-motion` as the motion-direction and technology-routing layer.
- `engineering-gsap-animations` with GSAP core, timeline, ScrollTrigger, plugin, React/Next.js, performance, cleanup, and accessibility references.
- `reconstructing-images-as-threejs` as an optional evidence-limited procedural Three.js reconstruction workflow.

### Changed
- Motion responsibilities are now layered to prevent generic motion, GSAP implementation, and performance auditing from competing for the same task.
- Upstream mapping now records GreenSock, LottieFiles, and img2threejs research and licensing.

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
