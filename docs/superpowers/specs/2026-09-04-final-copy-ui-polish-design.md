# Sprint Final — Copy + UI Polish

Date: 2026-09-04
Status: Approved design
Repository: `jhonatan-oliveiradev/agent-skills`
Base: `main` after PR #77 (`38d5a0c49cba3ddcb5f7dfbc9879daaef40d8209`)

## Goal

Close the public product experience before launch by treating copy and interface as one coordinated sprint. The sprint must make Agent Skills Studio read and feel like a serious, authored technical product rather than a prompt collection or generic AI microsite.

The central positioning remains:

> Skills are not prompts. They are working methods.

The sprint ends only when no remaining copy or UI issue is a launch blocker.

## Delivery model

Use one closing pull request with small, reviewable commits. Work surface by surface, always stabilizing copy before final visual composition on that same surface.

The implementation order is:

1. Foundation pass
2. Home
3. Skills catalog + skill dossier
4. Packs catalog + pack dossier
5. Built with Skills + evidence detail
6. Getting Started
7. Institutional pages
8. Global states and chrome
9. Launch convergence

Each slice follows:

`audit -> RED when testable -> copy pass -> UI pass -> GREEN -> review`

Do not merge the final PR without explicit user authorization.

## Protected product contracts

The sprint may redesign internal page composition when refinement is insufficient, but it must preserve:

- existing public URLs;
- existing page set;
- primary navigation architecture;
- Agent Skills Studio core identity;
- Stable `1.0.0` semantics;
- 54 canonical skills;
- 11 active packs;
- historical Stable snapshots;
- pack membership/status semantics;
- installation/distribution behavior;
- canonical technical skill content, except public presentation copy where appropriate.

Do not revive the previously removed orphaned Home copy paths (`messages.home.paths`, `home.packs`, `home.proof`).

## Visual freedom

Default to deep editorial refinement. Preserve identity and information architecture, but allow meaningful changes to internal composition, typography, rhythm, content distribution, cards, tables, metadata treatment, and microinteractions.

A full internal redesign is allowed only when incremental refinement cannot reach the desired quality. Redesign must serve hierarchy, comprehension, trust, or editorial character; redesign for novelty alone is out of scope.

## Foundation pass

Consolidate the shared presentation rules before surface work:

- type scale and heading hierarchy;
- editorial widths and reading measure;
- spacing rhythm;
- buttons and links;
- cards and dividers;
- hover, focus, active and disabled states;
- responsive primitives;
- motion and reduced-motion behavior;
- shared copy principles across EN and PT-BR.

This is not a new design system. It is a consolidation pass over the current one to remove inconsistency before page-level refinement.

## Copy contract

Every public page should make four things clear quickly:

1. what the page/product is;
2. who it is for;
3. what changes in practice;
4. what the next action is.

Remove or rewrite:

- vague abstractions;
- unsupported slogans;
- repeated ideas across adjacent sections;
- generic AI landing-page language;
- formulaic verbs such as “unlock”, “supercharge”, “seamless” and equivalents when they do not add meaning;
- literal PT-BR translations that sound unnatural.

Preserve:

- technical terminology;
- runtime/install/pack/maturity/evidence precision;
- an editorial and professional tone;
- natural differences between EN and PT-BR when fluency benefits.

No public copy may promise behavior the product does not provide.

## UI contract

The target is a technical editorial product, not a SaaS dashboard.

Use:

- stronger typographic hierarchy;
- deliberate contrast between dense information and breathing room;
- fewer competing boxes;
- cards only when they represent meaningful units;
- editorial structures such as indexes, labels, rules, metadata bands and columns where appropriate;
- obvious CTA priority;
- functional, restrained motion;
- perceptible interaction states;
- intentional desktop and mobile compositions.

A surface is visually complete only when:

1. hierarchy is readable within seconds;
2. no major area feels cramped, generic or template-like;
3. the primary interaction is obvious;
4. desktop and mobile feel intentionally designed as the same product.

## Surface scope

### Home

Close positioning, hero, narrative sequence, proof, methods/packs presentation and CTA hierarchy.

### Skills

Refine catalog scanning, filtering, listing/card hierarchy, dossier reading experience, compatibility and installation presentation.

### Packs

Refine catalog presentation, pack system explanation, dossier hierarchy and the relationship between packs and skills.

### Built with Skills

Strengthen evidence browsing and case structure so problem -> method -> result is easy to understand. Preserve the distinction between real-use and internal cases.

### Getting Started

Reduce onboarding friction around choosing a runtime, installation and first use.

### Institutional

Polish Roadmap, About, Contribute and Changelog without inventing new product scope.

### Global states

Align header, footer, loading, error, not-found and empty states with the final editorial system.

## Slice gates

Each slice must pass the following before moving on:

### 1. Audit

Read the real implementation and current copy. Identify concrete issues and the files/components that own them.

### 2. RED

When a behavior or contract is testable, write the failing regression first. For purely visual concerns, prefer structural/semantic test contracts where useful, but do not pretend textual tests replace visual validation.

### 3. Copy pass

Close message and hierarchy before final composition.

### 4. UI pass

Refine layout, responsiveness, interaction states and motion with stabilized copy.

### 5. GREEN

Run relevant tests plus typecheck/lint/build where appropriate.

### 6. Review

Check spec fidelity, code quality, regressions, scope creep and consistency with previous slices.

## Commit strategy

Keep commits semantically coherent. Expected shapes include:

- `refactor: consolidate editorial interface foundations`
- `feat: sharpen home positioning and composition`
- `refactor: improve skills catalog editorial hierarchy`
- `refactor: refine skill dossier reading experience`
- `refactor: strengthen packs presentation`
- `refactor: improve evidence archive and case hierarchy`
- `refactor: simplify getting started flow`
- `refactor: polish institutional pages`
- `fix: align global states and responsive behavior`
- `test: close launch readiness regressions`

Exact count may vary, but unrelated surfaces must not be mixed arbitrarily.

## Out of scope

Do not turn this sprint into another product cycle. Unless directly required to unblock the public experience, defer:

- new features;
- product architecture changes;
- new integrations;
- new packs;
- new skills;
- distribution-system expansion;
- evidence expansion;
- unrelated refactors.

Backend & Data and Design & Brand evidence gaps remain post-launch backlog, as does a dedicated full Game Development case.

## Launch convergence

After all surface slices are complete, perform one convergence pass with no new feature ideation.

Verify:

- EN/PT-BR consistency;
- desktop/tablet/mobile;
- light/dark;
- keyboard/focus;
- reduced motion;
- important links and CTAs;
- metadata/SEO/OG affected by public-copy changes;
- visual regressions;
- canonical CI/build gates.

The release candidate must pass:

- root tests;
- catalog validation;
- web tests;
- typecheck;
- lint;
- production build;
- applicable installer smokes;
- final diff review against the sprint base.

Explicitly verify that the sprint did not accidentally alter:

- public URLs;
- release version;
- historical snapshots;
- pack membership/status;
- canonical skill technical content;
- installation/distribution semantics.

## Definition of launch-ready

The product is ready to publicize only when all four gates are true at once.

### Message

The public experience clearly explains what Agent Skills Studio is, why skills differ from prompts, how to choose a method, how to install/use it, where real evidence exists and what the user should do next.

### Interface

Primary surfaces share one editorial system, major areas are polished, responsive variants are intentional, interaction/loading/error/not-found states are coherent and motion respects reduced motion.

### Trust

Stable `1.0.0`, 54 skills, 11 packs and current compatibility presentation remain correct; evidence types remain explicit; important links work; no copy overpromises product behavior.

### Engineering

The final candidate passes the canonical repository gates with evidence and contains no unintended contract drift.

## Success statement

A principal surface should be able to stand on its own and communicate:

> This is a serious, authored, well-documented technical product ready to use — not a collection of prompts.

Once no remaining copy/UI issue qualifies as a launch blocker, the sprint is complete and residual improvements move to post-launch backlog.
