# Agent Skills Studio — Microsite Design

**Status:** Approved  
**Date:** 2026-08-27  
**Target:** Agent Skills Studio v1 microsite  
**Repository:** `jhonatan-oliveiradev/agent-skills`

## 1. Purpose

Build the public, bilingual Agent Skills Studio microsite on top of the
versioned catalog already shipped in the repository. The first release is
optimized for discovery and installation: a visitor without prior context
must be able to find, understand, and copy the installation command for a
skill in less than two minutes.

The microsite turns the repository into a useful product surface without
creating a second source of truth. It also gives Vercel a real application to
build and serve, replacing the repository-only deployment that previously
returned a 404.

## 2. Product priorities

The v1 priorities, in order, are:

1. discover skills and packs;
2. understand when and how to use them;
3. copy a correct installation command;
4. navigate equivalent English and Brazilian Portuguese experiences;
5. understand maturity, relationships, contribution, and roadmap;
6. demonstrate that the collection is used to build and audit its own site.

Community participation remains visible, but discovery and installation are
the primary journey. Authentication, a CMS, a database, user accounts, and
runtime personalization are outside v1.

## 3. Architectural decisions

### 3.1 Application boundary

The application lives in `apps/web` and uses:

- Next.js App Router;
- React and TypeScript;
- Tailwind CSS v4;
- accessible Radix or shadcn primitives only where they add value;
- `nuqs` for shareable search and filter state;
- CSS or Motion for local interactions;
- static generation for public content;
- Vercel for Preview and production deployments.

The application is isolated from repository scripts and distribution tooling.
The repository root continues to own skills, catalog generation, installers,
plugin manifests, and collection validation.

### 3.2 Single source of truth

`catalog/generated/catalog.json` is the microsite's only skill and pack data
source. The site must not maintain parallel skill metadata, read raw
`SKILL.md` files at runtime, or call GitHub for catalog content.

Editorial page copy and localized interface labels may live in `apps/web`,
but they cannot redefine catalog facts such as slugs, versions, memberships,
maturity, compatibility, relations, dependencies, or installation status.

Before the Next.js build starts, the repository must run catalog validation
and deterministic drift checks. Invalid, private, or stale generated data
stops the build.

### 3.3 Rendering model

All index, detail, and editorial routes are statically generated. The build
expands every supported locale, skill, and pack into HTML. Search and filters
run in the browser over a compact projection of the committed catalog.

There is no database, server-side catalog fetch, GitHub API dependency, or
required application runtime in v1. This keeps the site fast, inexpensive,
cacheable, and resilient.

## 4. Localization and URL policy

Supported locale identifiers are `en` and `pt-BR`.

All public pages use an explicit locale prefix:

```text
/en/...
/pt-BR/...
```

The root route detects the visitor's preferred locale on first access and
redirects to `/en` or `/pt-BR`. Detection is advisory: a persistent and
keyboard-accessible language switcher is always available, and an explicit
choice is stored in the browser.

Every localized page provides:

- equivalent navigation and reader-facing content;
- localized title, description, Open Graph content, and structured data;
- a self-referencing canonical URL;
- `hreflang` links for both locales and `x-default`;
- a language switch that preserves the current content route when an
  equivalent route exists.

This policy supersedes the root-English and `/pt-br` convention in the
2026-08-25 repository design. Permanent redirects preserve old English root
routes and `/pt-br` links. Route matching may accept lowercase legacy input,
but generated canonical URLs use the exact `pt-BR` identifier.

## 5. Information architecture

The localized route tree is:

```text
/{locale}
├── /skills
│   └── /skills/[slug]
├── /packs
│   └── /packs/[slug]
├── /getting-started
├── /built-with-skills
├── /roadmap
├── /about
├── /contribute
└── /changelog
```

Unknown locales, skills, or packs render a localized not-found experience.
Planned packs have public detail pages but no install action.

### 5.1 Home

The home page leads directly from value proposition to an installable result:

1. premium hero with the primary search and **Explore skills** action;
2. goal-oriented entry points for visitors who do not know skill names;
3. featured active packs;
4. categories and concrete outcomes;
5. choose → install → invoke explanation;
6. representative installation workflow;
7. proof from **Built with Skills**;
8. contribution and roadmap invitation.

### 5.2 Catalog

The skills catalog supports instant search across localized names,
descriptions, use cases, and triggers. Filters cover:

- category;
- pack;
- difficulty;
- maturity;
- compatibility;
- dependency presence.

Search, filters, and ordering are represented in the URL so a view can be
shared, bookmarked, and restored. Ordering supports relevance, name, and
maturity. Empty states explain why no results matched and provide a direct way
to clear filters.

Cards communicate purpose, trigger, maturity, difficulty, compatibility, and
pack membership without requiring the detail page. The entire card is usable
with keyboard and touch input without invalid nested interactive elements.

### 5.3 Skill detail

Each skill page includes:

- primary purpose and localized summary;
- triggers and user-facing use cases;
- compatibility, difficulty, maturity, and version;
- dependencies and related skills;
- pack membership;
- selective Bash and PowerShell installation commands;
- copy feedback and a manual-selection fallback;
- source link to the canonical skill on GitHub.

The site explains the skill for readers instead of duplicating the complete
canonical `SKILL.md`.

### 5.4 Pack detail

Each pack page describes its goal, status, ordered composition, and member
skills. Active packs provide the verified one-command installation path.
Planned packs appear as roadmap content with a clear non-installable state and
no misleading disabled command.

### 5.5 Editorial and community pages

- **Getting started** explains supported environments, installation,
  verification, updates, and removal.
- **Built with Skills** records concrete site decisions and outcomes produced
  with the collection.
- **Roadmap** presents proposed, research, experimental, beta, stable, and
  deprecated work.
- **About** explains the project, principles, authorship, and source model.
- **Contribute** links the proposal, testing, security, and pull request paths.
- **Changelog** presents readable release notes rather than raw commit lists.

## 6. Installation experience

Installation commands are derived from validated catalog slugs and the
existing installer contract. They are never manually duplicated across page
components.

The first release provides direct skill and pack commands in Bash and
PowerShell. The getting-started flow also explains full-collection
installation and supported project bootstrap behavior. A later guided wizard
may combine environment, scope, operating system, and update intent, but it is
not required to ship the first microsite slice.

Copy controls:

- have visible labels and accessible status announcements;
- confirm success without changing layout;
- report failure without claiming the clipboard was updated;
- expose the command as selectable text when Clipboard API access is missing;
- never require JavaScript to read the command.

## 7. Design system and visual direction

The visual concept is a **premium technical studio**: polished, precise, and
recognizably built for developers without imitating GitHub, Vercel, or a
generic hacker terminal.

### 7.1 Themes

The brand is dark-first, with a complete light theme.

- Dark mode uses deep graphite foundations, layered surfaces, fine borders,
  and restrained luminosity.
- Light mode preserves the same hierarchy with clean surfaces and strong
  contrast.
- First access respects the system preference.
- Manual choice is persistent and overrides system preference.
- Theme controls work with keyboard, touch, and assistive technology.

### 7.2 Visual language

- a modern sans-serif family for interface and editorial content;
- a monospaced family only for commands, versions, and technical labels;
- one primary brand accent;
- controlled category colors that remain legible in both themes;
- modular grids, restrained connection motifs, tags, and maturity indicators;
- consistent linear iconography;
- layered cards with subtle depth rather than heavy glass effects;
- responsive layouts designed for each breakpoint rather than scaled desktop
  compositions.

Tokens own color, typography, spacing, radius, border, shadow, motion, and
focus treatment. Components consume semantic tokens instead of hard-coded
theme values.

### 7.3 Motion

Motion clarifies state and hierarchy:

- short entrance transitions for important page regions;
- immediate hover, filtering, theme, and copy feedback;
- restrained stagger where it improves scanning;
- no mandatory smooth scrolling;
- no scroll locking or navigation-blocking sequence;
- no continuous decorative effect that runs outside the viewport;
- complete `prefers-reduced-motion` behavior.

GSAP is excluded unless a later approved signature sequence genuinely needs a
timeline. The initial microsite can meet its goals with CSS and local Motion
interactions.

## 8. Component boundaries

The initial component model keeps data, state, and presentation separate:

- `catalog` adapter: validates and exposes typed read-only projections;
- locale layer: route parsing, dictionaries, links, and localized metadata;
- theme layer: system preference, explicit choice, persistence, and tokens;
- `Search`: query input and accessible result feedback;
- `FilterBar`: URL-backed filter controls;
- `SkillCard` and `PackCard`: content summaries and navigation;
- `InstallCommand`: command rendering, selection, and copy feedback;
- `StatusBadge`: consistent maturity and planned-state vocabulary;
- `LocaleSwitcher` and `ThemeSwitcher`: persistent global controls.

Server Components render content by default. Client Components are limited to
interactive boundaries such as search, filters, theme persistence, locale
preference, and clipboard behavior.

## 9. SEO and discoverability

The application generates:

- localized metadata for every public route;
- canonical and `hreflang` links;
- localized `sitemap.xml` entries;
- `robots.txt`;
- per-skill and per-pack Open Graph images or templates;
- structured data suitable for the collection and technical content;
- localized not-found metadata.

Filter combinations are shareable but must not create an uncontrolled set of
indexable duplicate pages. Canonical catalog URLs omit transient filter
parameters unless a later SEO strategy explicitly promotes a curated view.

## 10. Accessibility and resilience

The interface targets WCAG 2.2 AA behavior and includes:

- visible, consistent focus states;
- full keyboard navigation;
- semantic headings and landmarks;
- labeled controls and announced dynamic results;
- sufficient contrast in both themes and every category color;
- touch targets appropriate for mobile use;
- reduced-motion equivalence;
- reading and navigation without nonessential client-side JavaScript.

Failure behavior is explicit:

- invalid or stale catalog data fails the build;
- unknown content renders localized 404 pages;
- clipboard failure preserves selectable commands and reports the error;
- empty search retains the user's state and offers recovery;
- missing translations fail validation instead of falling back silently.

## 11. Testing and quality gates

Every microsite pull request runs the relevant subset of:

- catalog validation and deterministic generation check;
- TypeScript validation;
- linting and production build;
- unit tests for adapters, locale routing, search, filters, and commands;
- component tests for theme, locale, clipboard, and empty states;
- Playwright flows for discovery, filtering, locale switching, and
  installation in both languages;
- automated accessibility checks;
- internal-link validation;
- responsive verification on representative mobile, tablet, and desktop
  viewports;
- performance budgets for shipped JavaScript, loading, and motion;
- route-generation assertions for all 18 skills and all six packs;
- Vercel Preview smoke tests before promotion.

The complete v1 acceptance criterion is that a person without repository
context can find, understand, and copy the correct installation command for a
skill in under two minutes in either language and on every supported viewport.

## 12. Delivery strategy

Microsite work is delivered in small feature branches and pull requests to
`dev`:

1. **Microsite Foundation** — `apps/web`, Next.js, catalog adapter,
   localization, themes, tokens, and Vercel project configuration.
2. **Catalog Experience** — home, search, URL-backed filters, skill listing,
   and pack listing.
3. **Detail Pages** — skill and pack pages, installation controls, editorial
   routes, SEO, and localized 404 pages.
4. **Polish & Quality** — responsive refinement, motion, accessibility, E2E,
   link checking, and performance.
5. **Production Release** — Preview verification, `dev` consolidation, PR to
   `main`, production smoke test, canonical domain, and release checklist.

Each pull request must leave the application usable, pass its own gates, and
receive review before the next slice depends on it. `dev` is pre-production;
only the consolidated and verified result advances to `main`.

## 13. Vercel and production

Vercel is configured with:

- Root Directory: `apps/web`;
- automatic Preview Deployments for pull requests;
- `dev` as the pre-production integration branch;
- `main` as the production branch;
- `skills.jhonatanoliveira.com` as the canonical production domain;
- `agent-skills-vert.vercel.app` as a fallback deployment URL;
- redirects from legacy locale routes;
- basic error and Web Vitals monitoring;
- analytics without invasive cookies or cross-site tracking in v1.

Production is not considered complete until both locale trees, representative
skill and pack pages, redirects, sitemap, metadata, 404 handling, and the
canonical domain have been manually verified against the deployed build.

## 14. Out of scope for the initial microsite

- authentication and user profiles;
- database, CMS, or runtime catalog API;
- ratings, comments, favorites, or community voting UI;
- remote catalog updates without a repository build;
- personalized recommendations;
- a full installation wizard in the first foundation PR;
- heavy cinematic motion, mandatory smooth scrolling, or WebGL decoration;
- automated production promotion before Preview review.

## 15. Completion criteria

The dedicated microsite phase is complete when:

- the Vercel deployment serves a real application instead of a repository
  404;
- both locale trees are complete and equivalent;
- every catalog skill and pack has a generated public page;
- discovery and installation work with keyboard, touch, and assistive
  technology;
- dark and light themes meet contrast and persistence requirements;
- catalog, build, unit, E2E, accessibility, link, and performance gates pass;
- Preview and production deployments are manually verified;
- the canonical domain, fallback URL, redirects, sitemap, metadata, and 404
  behavior are correct;
- at least three concrete **Built with Skills** outcomes are published.

