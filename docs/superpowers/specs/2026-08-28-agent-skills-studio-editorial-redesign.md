# Agent Skills Studio — Editorial Redesign Specification

**Status:** Approved direction<br>
**Date:** 2026-08-28<br>
**Scope:** Visual foundation, shared shell, and public Home

## 1. Purpose

Redesign Agent Skills Studio so the public experience demonstrates the quality of the collection instead of presenting it as a generic component catalog. The result must feel like an editorial technology studio: expressive, technically credible, bilingual, motion-led, and grounded in verifiable project data.

The redesign must communicate one central idea:

> Skills are not prompts. They are working methods.

The first delivery establishes the new system through the Home, header, theme transition, navigation, terminal demonstration, footer, and global visual foundations. Internal routes remain functional through compatibility tokens and are migrated in later deliveries.

## 2. Experience principles

1. **Editorial before dashboard.** Use hierarchy, rhythm, whitespace, rules, indices, and chapters instead of repeated card grids.
2. **Evidence before claims.** Every metric, pack, command, result, and case study comes from an existing validated source.
3. **Motion explains.** Animation reveals hierarchy, execution, state, or progress. Decorative motion alone is insufficient.
4. **Technical without becoming cold.** Commands and metadata provide credibility while typography and composition provide personality.
5. **Progressive enhancement.** Content and navigation remain complete without motion or client JavaScript.
6. **Bilingual equivalence.** English and Brazilian Portuguese communicate the same intent, not literal but uneven translations.
7. **Accessible by construction.** Semantic HTML, focus parity, reduced motion, contrast, keyboard navigation, and useful accessible names are part of the visual system.

## 3. Art direction

### 3.1 Visual character

The base direction combines an independent editorial studio with a technical laboratory. It must avoid the visual signatures of generic AI-generated SaaS pages: bento grids, decorative gradients, excessive rounded cards, glass panels, fake metrics, interchangeable copy, and identical section cadence.

The composition uses:

- an asymmetric 12-column grid;
- oversized display typography;
- short measures and strong line breaks;
- generous negative space;
- thin structural rules and numbered chapters;
- restrained surfaces with mostly square geometry;
- monospaced labels, commands, versions, and indices;
- pack colors only when a pack owns the current context.

### 3.2 Color

The default dark expression uses mineral black, soft white, muted graphite, and an electric institutional blue. The light expression uses warm ivory, near-black ink, restrained gray, and the same electric blue.

Semantic tokens must cover canvas, foreground, muted text, surface, border, accent, focus, success, warning, and danger. Existing token names remain temporarily aliased so unmigrated routes continue working.

### 3.3 Typography

The system uses self-hosted open-source fonts:

- **Instrument Sans** for display and reading text;
- **IBM Plex Mono** for commands, metadata, labels, versions, and indices.

Font files and licenses are versioned with the app so builds do not depend on a remote font service. Fluid type scales use `clamp()` only when a named Tailwind token would not express the editorial range clearly.

## 4. Tailwind CSS v4 contract

Tailwind CSS v4 is the primary styling language.

- Define fonts, colors, easing, shadows, and named spacing through `@theme`.
- Use Tailwind utilities directly for layout, responsive behavior, type, color, and state.
- Use `dark:`, `motion-safe:`, `motion-reduce:`, `focus-visible:`, and group/data variants where appropriate.
- Extract repeated visual patterns as React components rather than global CSS classes.
- Keep global CSS limited to Tailwind import, theme tokens, font faces, reset/base rules, scrollbar rules, View Transition pseudo-elements, and effects Tailwind cannot express clearly.
- Do not add a legacy `tailwind.config.js`.
- Avoid `transition-all`; interactive components use explicit transition properties.
- Arbitrary values are allowed for intentional editorial scales, grid math, and shader/canvas positioning, not as a substitute for tokens.

## 5. Runtime and component architecture

### 5.1 Rendering boundary

The localized Home remains a Server Component. Catalog, pack, case-study, and localized copy data are prepared on the server. Small client components own only interaction and motion.

Client islands:

- `EditorialHeroMotion`
- `EditorialReveal`
- `ScrollProgress`
- `ThemeTransitionToggle`
- `TextRoll`
- `MobileEditorialMenu`
- `Terminal`
- `CopyIconButton`

No client component may refetch data already available to the server page.

### 5.2 Dependencies

Add only:

- `motion` for React animation and viewport/scroll primitives;
- `lucide-react` for semantic interface icons;
- `clsx` and `tailwind-merge` only as the standard shadcn-compatible class-composition helper.

Use `motion/react`, never the legacy `framer-motion` import. GSAP is not part of this delivery because there is no approved pinned timeline or orchestration requirement that justifies it.

### 5.3 Current semantics

- Follow Next.js 16 App Router APIs, including asynchronous route params.
- Prefer Server Components and semantic HTML.
- Use `next/link` for internal navigation.
- Use current React ref semantics and avoid unnecessary legacy wrappers.
- Use `header`, `nav`, `main`, `section`, `article`, `figure`, `figcaption`, `pre`, and `code` according to content meaning.
- Provide hover and keyboard-focus parity.

## 6. Home information architecture

### 6.1 Hero — manifesto

Primary Portuguese copy:

> **Skills não são prompts.<br>
> São métodos de trabalho.**

Supporting copy:

> Fluxos abertos para agentes que precisam interpretar contexto, tomar decisões e entregar resultados verificáveis.

Primary actions:

- Explorar a coleção
- Ver o método

The English version communicates the equivalent proposition naturally.

The hero occupies most of the initial viewport and includes an original procedural blue-light composition rising from the lower edge. A brief typographic assembly introduces the title. The implementation may reference the observable rhythm of the supplied Skiper UI recording but must not copy paid component code or protected source.

The procedural visual must:

- render in a contained canvas;
- use a conservative resolution and device-pixel-ratio cap;
- pause when hidden;
- respond subtly to pointer and scroll;
- expose an immediate static fallback;
- disappear or remain static under reduced motion;
- never delay heading or CTA rendering.

### 6.2 Method in execution

This section demonstrates rather than describes the product.

Use the current Magic UI Terminal registry component as the baseline API, owned locally by the project and restyled through the editorial token system. The terminal uses `Terminal`, `TypingAnimation`, and `AnimatedSpan` from the current implementation pattern.

The sequence must reflect real installer behavior and supported commands. It demonstrates:

1. selecting a canonical skill;
2. running the supported install command;
3. validation and safe installation;
4. invoking a task naturally;
5. producing a verifiable outcome.

The terminal is wrapped in `figure` with a localized `figcaption`. Reduced-motion users receive the complete output immediately without typewriter timing.

### 6.3 Collection index

Present the 18 skills as an editorial index rather than a grid of cards. Rows expose name, category, and primary outcome. Hover/focus reveals direction and uses subtle horizontal movement. The section links to the full searchable catalog and remains catalog-derived.

### 6.4 Pack chapters

Present the three active packs as consecutive chapters. Each chapter temporarily owns the accent color and shows its outcome, composition count, and direct path. Planned packs do not compete with active packs on the Home.

### 6.5 Built with Skills

Treat the two existing case studies as editorial features with stronger type, evidence summaries, and links to the full records. Do not invent screenshots or results. New imagery is added only when backed by a real captured interface.

### 6.6 Open project

Close with roadmap, changelog, contribution, and repository paths. Distinguish shipped, beta, and proposed work through real project state.

## 7. Header and navigation

### 7.1 Desktop

Use a compact floating editorial header:

- brand at the start;
- primary navigation centered;
- locale and theme controls at the end;
- transparent initial state;
- restrained backdrop and border after scroll;
- semantic active-route indication.

Navigation labels use the supplied `TextRoll` concept, adapted to:

- `motion/react`;
- `next/link`;
- preserved whitespace and stable layout;
- hover and focus-visible activation;
- current-route state;
- reduced-motion fallback.

### 7.2 Mobile

Use an accessible fullscreen editorial menu with large numbered navigation. Focus remains inside while open, Escape closes it, and returning focus lands on the trigger. Body scrolling is locked only while the menu is open.

## 8. Theme transition

Replace the current select control with the supplied Skiper26-inspired toggle using the approved configuration:

```tsx
variant="rectangle"
start="bottom-up"
blur={false}
```

Adapt the attached code to:

- import from `motion/react`;
- toggle from `resolvedTheme` so an initial `system` value behaves correctly;
- use `document.startViewTransition` when available;
- switch immediately when unsupported;
- skip the visual transition under reduced motion;
- keep localized accessible naming;
- remove the demo options panel and unused GIF variants from production code;
- avoid injecting duplicate style elements.

The control retains the selected yin-yang-style visual and button feedback.

## 9. Icons and copy controls

Use Lucide icons when the operation remains unambiguous:

- copy: `Copy`
- copied: `Check`
- GitHub: `Github`
- external destination: `ArrowUpRight`
- menu: `Menu`
- close: `X`

Icon-only buttons require a localized accessible name, focus-visible state, tooltip, minimum touch target, and visible success feedback. Editorial links and CTAs retain meaningful text.

## 10. Motion system

Use one shared motion contract:

- controls: 180–240 ms;
- navigation: 300–450 ms;
- editorial reveals: 600–900 ms;
- primary easing: `cubic-bezier(0.22, 1, 0.36, 1)`;
- primary animated properties: transform, opacity, color, and clip-path only where measured;
- stagger only when it communicates reading order;
- no animation may block navigation, selection, copying, or reading.

Every motion component must use or respect `useReducedMotion`. The no-motion state is designed, not merely tolerated.

## 11. Scrollbar and transitions

Provide a themed custom scrollbar for Firefox and WebKit:

- track matches the current canvas;
- thumb uses the institutional accent with adequate contrast;
- hover increases contrast;
- width remains usable rather than ornamental.

Interactive elements use explicit transitions. Global theme changes use the View Transition implementation, not a blanket transition on every DOM node.

## 12. Footer

Replace the generic three-column footer with an editorial closing statement:

> **Built in public.<br>
> Designed and developed by Jhonatan Oliveira.**

The signature links to `https://jhonatanoliveira.com`. Repository, contribution, changelog, language, and version remain available without competing with the signature. External destinations are identified visually and accessibly.

## 13. Content architecture

Move Home-specific bilingual copy out of the monolithic message record into a focused typed source. Keep shared navigation, theme, and footer labels in the shared locale contract. Catalog, packs, versions, and case studies remain derived from their validated sources.

No claim may be introduced without a corresponding source in the repository.

## 14. Compatibility and migration

The first delivery introduces new tokens while aliasing the legacy semantic variables used by internal routes. It redesigns the Home and shared shell without forcing an unsafe all-pages rewrite.

Later deliveries migrate:

1. catalog and skill detail;
2. packs and case studies;
3. institutional pages;
4. final accessibility, performance, SEO, and visual audit.

The old Home-specific classes are removed when no longer referenced. Shared legacy CSS is reduced incrementally rather than deleted wholesale.

## 15. Verification

### Automated

- TDD for localized content, navigation, theme behavior, terminal reduced-motion output, icon copy feedback, and catalog-derived sections;
- complete applicable Vitest suite;
- TypeScript typecheck;
- ESLint with zero warnings;
- production build;
- catalog validation and synchronization;
- `git diff --check`.

### Runtime and visual

Verify at minimum:

- desktop and mobile dark theme;
- desktop and mobile light theme;
- keyboard-only navigation;
- reduced motion;
- theme fallback without View Transition support;
- terminal sequence and static output;
- canvas pause/fallback behavior;
- no horizontal overflow;
- contrast and visible focus;
- production route after merge to `main`.

### Performance targets

- no hero canvas dependency blocks the server-rendered content;
- cap procedural rendering DPR and pause outside visibility;
- avoid layout shifts from fonts and motion;
- keep client islands isolated;
- measure production bundle impact before accepting the delivery.

## 16. Delivery boundary

This specification authorizes the first redesign delivery only:

- visual tokens and self-hosted typography;
- Tailwind-first component styling;
- `motion`, `lucide-react`, and the two class-composition helper dependencies;
- shared editorial header and footer;
- theme View Transition toggle;
- TextRoll navigation;
- custom scrollbar;
- redesigned Home;
- Magic UI Terminal demonstration;
- original procedural hero effect;
- accessibility, reduced motion, tests, and production build.

It does not authorize copying paid Skiper UI source, fabricating case-study evidence, rewriting every internal route in one pull request, or adding GSAP without a newly demonstrated requirement.
