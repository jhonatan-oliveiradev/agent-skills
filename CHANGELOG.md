# Changelog

All notable changes to this skill library are documented here.

## [Unreleased]

### Distribution

- Added deterministic ChatGPT-ready skill ZIP downloads for every canonical skill, keeping `SKILL.md` at the archive root and preserving supporting files with stable relative paths.
- Added localized Skill download actions plus EN/PT-BR Getting Started guidance for ChatGPT's `Upload from computer` flow while keeping `skills/<slug>/` as the single source of truth.

### Studio and roadmap

- Promoted the release-qualified plugin, catalog, installers, and microsite surfaces to Stable in the public roadmap while keeping individual skill maturity distinct from Stable release status.
- Kept current README/catalog documentation aligned with 54 canonical skills and 11 active packs, and removed only confirmed orphaned localized Home/Getting Started copy.

### Reliability and maintenance

- Removed superseded post-Stable workflow helpers so `validate.yml` remains the canonical workflow.
- Hardened Windows CI around the live Next integration fixture and teardown contention without raising test timeouts or serializing the entire suite.
- Restored native Method Archive select/option contrast with existing surface/text theme tokens while preserving native select semantics and keyboard behavior.

## [1.0.0] - 2026-09-02

### Stable release

- Promoted the evidence-qualified Agent Skills Studio from `1.0.0-rc.2` to Stable `1.0.0` with 54 canonical skills and 11 active packs.
- Qualified Stable after four real-use cases across three distinct projects represented five active packs, including complete real-use validation of Codebase Intelligence.
- Preserved canonical skill behavior and pack composition: this promotion changes release state and synchronized metadata, not method contracts.

### Distribution and verification

- Synchronized the plugin, catalog, installers, microsite package metadata, and web lockfile at `1.0.0`.
- Preserved real-use evidence across ChatGPT direct Skill distribution, catalog discovery, installers, and microsite consumption.
- Kept Linux and Windows tests, validation, typecheck, lint, production build, and platform installer smoke tests as the canonical Stable release gate.

## [1.0.0-rc.2] - 2026-09-02

### Codebase Intelligence

- Expanded the collection to 54 canonical skills and 11 active packs with Codebase Intelligence v1.
- Added five evidence-led methods for mapping existing structure, tracing execution paths, analyzing blast radius, semantic investigation, and evidence-backed change planning.
- Documented CodeGraph as an official optional integration while preserving a verified repository-inspection fallback when no code-intelligence runtime is callable.
- Standardized progressive, evidence-led context expansion to avoid unnecessary broad repository reads.

### Release readiness

- Synchronized Studio release surfaces and catalog metadata at `1.0.0-rc.2` while preserving the 54-skill / 11-pack collection.
- Kept generated catalogs, installers, plugin validation, and Linux/Windows CI under the existing repository gates.
- Reopened the Stable gate until real-use and CI evidence validates the Codebase Intelligence pack.

`1.0.0-rc.2` remains a release candidate. Stable `1.0.0` is still frozen pending the new real-use evidence gate.

## [1.0.0-rc.1] - 2026-09-02

### Release readiness

- Froze the release candidate at 49 canonical skills and 10 active packs.
- Added a versioned routing benchmark covering every canonical method as a primary owner, important overlap boundaries, and deliberate no-skill outcomes.
- Refined `selecting-working-methods` around artifact, stage, and verification ownership without turning routing into a static decision table.
- Added machine-readable readiness gates for the plugin, catalog and packs, cross-platform installers, and bilingual microsite.
- Aligned current public release copy and kept ChatGPT, Codex, and Claude-compatible distribution under the existing repository validation gates.

`1.0.0-rc.1` is a release candidate. Stable `1.0.0` remains a later promotion after real-use evidence.

## [1.0.0-beta.1] - Unreleased

### Microsite foundation

- Added the isolated bilingual Next.js foundation, its catalog synchronization,
  root web gates, and Linux/Windows CI validation.
- Documented the Vercel Root Directory, Preview/production branch policy, and
  deployment URLs.
- Added the searchable 18-skill catalog, localized skill detail pages, six pack
  experiences, and pack installation guidance.
- Added Getting Started, Built with Skills case studies, the evidence-backed
  public roadmap, and bilingual About, Contribute, and Changelog pages.

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
