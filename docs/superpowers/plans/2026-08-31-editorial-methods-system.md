# Editorial Methods System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the legacy Skills card catalog and documentation-style skill detail with the approved Method Archive + hybrid Method Dossier, while establishing the shared editorial primitives needed by later Packs and Evidence work.

**Architecture:** Keep route components server-first for locale, catalog lookup, metadata, and structured data. Preserve the existing `nuqs` URL filter contract in one narrow client island, and move visual composition into focused shared editorial primitives plus Skills-specific components. `SiteHeader` and `SiteFooter` remain owned only by `app/[locale]/layout.tsx`.

**Tech Stack:** Next.js 16.3.1, React 19.2.8, TypeScript 5.9, Tailwind CSS v4, `nuqs` 2.10.1, existing Motion/Lucide/Morphicons dependencies, Vitest 4, Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-31-editorial-catalog-system-design.md`

## Global Constraints

- One global `SiteHeader` and one global `SiteFooter`; domain routes must not import either component.
- Skills index consumes `SkillCatalogItem`; skill detail consumes `LocalizedSkillDetail`; do not create a duplicate canonical UI data model.
- Preserve the current URL-backed query keys exactly: `q`, `category`, `pack`, `difficulty`, `maturity`.
- All primary content is server-readable; motion and client state are enhancements only.
- Every hover treatment has a `focus-visible` equivalent.
- CSS owns hover/focus/color/border/simple micro-translate. Do not add GSAP for the Methods pages in this tranche.
- Reduced motion must never leave content hidden or transformed away from its readable state.
- Keep new domain styles out of `globals.css`; add scoped `editorial-pages.css` and `editorial-methods.css`.
- Use violet for method/provenance/navigation semantics; do not use green except for true success/verification states.
- Automated validation is intentionally minimal: targeted tests for behavior/invariants, then typecheck, lint, and production build. Perceptual validation happens primarily in production.

---

### Task 1: Shared editorial page primitives and global chrome invariant

**Files:**
- Create: `apps/web/src/components/editorial/editorial-page-hero.tsx`
- Create: `apps/web/src/components/editorial/editorial-metadata.tsx`
- Create: `apps/web/src/components/editorial/editorial-section-heading.tsx`
- Create: `apps/web/src/components/editorial/editorial-reader-nav.tsx`
- Create: `apps/web/src/app/editorial-pages.css`
- Modify: `apps/web/src/app/[locale]/layout.tsx`
- Modify: `apps/web/src/lib/editorial-foundation.test.ts`

**Interfaces:**
- Produces `EditorialPageHero({ eyebrow, title, summary, metadata?, className? })`.
- Produces `EditorialMetadata({ items, className? })` where `items` is `readonly { label: string; value: ReactNode }[]`.
- Produces `EditorialSectionHeading({ eyebrow?, title, summary?, id? })`.
- Produces `EditorialReaderNav({ label, items })` where `items` is `readonly { id: string; label: string }[]` and links resolve to real in-page IDs.
- Produces shared page-level layout/interaction classes only; Skills-specific selectors belong in `editorial-methods.css`.

- [ ] **Step 1: Extend the foundation test with a failing chrome/style contract**

Add assertions that the locale layout imports the new shared stylesheet and that Skills route source files do not import `SiteHeader`/`SiteFooter`.

```ts
const [layout, skillsIndex, skillDetail] = await Promise.all([
  read("app/[locale]/layout.tsx"),
  read("app/[locale]/skills/page.tsx"),
  read("app/[locale]/skills/[slug]/page.tsx"),
])

expect(layout).toContain('import "../editorial-pages.css"')
for (const route of [skillsIndex, skillDetail]) {
  expect(route).not.toContain("SiteHeader")
  expect(route).not.toContain("SiteFooter")
}
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm --prefix apps/web test -- src/lib/editorial-foundation.test.ts`

Expected: FAIL because `editorial-pages.css` and the shared primitives do not exist yet.

- [ ] **Step 3: Implement the four server-safe primitives**

Keep them presentation-only and free of catalog/domain knowledge. `EditorialReaderNav` should render a semantic `<nav aria-label={label}>` with ordinary anchor links such as `<a href="#when-to-use">` and no IntersectionObserver in this tranche.

- [ ] **Step 4: Add `editorial-pages.css` and import it from the locale layout**

The shared layer owns:

```css
.editorial-page { position: relative; }
.editorial-page__hero { min-height: clamp(34rem, 72dvh, 52rem); }
.editorial-page__metadata { display: grid; }
.editorial-reader-nav { position: sticky; top: calc(var(--site-publication-bar-height, 4.5rem) + 2rem); }
[data-editorial-section] { scroll-margin-top: calc(var(--site-publication-bar-height, 4.5rem) + 2rem); }
```

Add responsive fallback below the desktop reader breakpoint so the reader nav becomes in-flow rather than sticky. Add `@media (prefers-reduced-motion: reduce)` rules that remove shared transitions.

- [ ] **Step 5: Run GREEN**

Run: `npm --prefix apps/web test -- src/lib/editorial-foundation.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

Commit: `feat(web): add shared editorial page primitives`

---

### Task 2: Method Archive contract, copy, and Method Row

**Files:**
- Create: `apps/web/src/components/skills/method-row.tsx`
- Create: `apps/web/src/components/skills/method-archive.test.tsx`
- Modify: `apps/web/src/lib/messages.ts`
- Modify: `apps/web/src/components/skills-catalog.tsx` only as source reference; final implementation moves to `components/skills/method-archive.tsx` in Task 3.

**Interfaces:**
- Produces `MethodRow({ skill, index, href, labels })`.
- `labels` contains localized category, difficulty, maturity, and benefit labels; it does not duplicate skill content.
- Row root uses `data-method-row` and the link uses `data-interaction="navigate"`; metadata region uses `data-interaction="inspect"`.

- [ ] **Step 1: Add failing Method Row tests**

Create a representative `SkillCatalogItem` fixture and assert semantic output.

```tsx
render(
  <MethodRow
    index={0}
    href="/pt-BR/skills/designing-ui-systems"
    skill={skill}
    labels={{
      category: "Produto e design",
      difficulty: "Intermediário",
      maturity: "Estável",
      benefit: "Benefício principal",
    }}
  />,
)

expect(screen.getByRole("link", { name: /Design de Sistemas de UI/i })).toHaveAttribute(
  "href",
  "/pt-BR/skills/designing-ui-systems",
)
expect(screen.getByText("01")).toBeInTheDocument()
expect(screen.getByText("Intermediário")).toBeInTheDocument()
expect(screen.getByText("Estável")).toBeInTheDocument()
```

Also assert `data-interaction="navigate"` and that the primary benefit remains in the DOM rather than being hover-only content.

- [ ] **Step 2: Run RED**

Run: `npm --prefix apps/web test -- src/components/skills/method-archive.test.tsx`

Expected: FAIL because `MethodRow` does not exist.

- [ ] **Step 3: Extend bilingual Skills copy without creating a new data model**

Add fields to `skillsCatalog` for the editorial frame:

```ts
archiveLabel: string
archiveTitle: string
archiveSummary: string
methodsMetric: string
packsMetric: string
categoriesMetric: string
versionMetric: string
filterLabel: string
```

Use these approved directions:

EN title: `Methods for agents that need to work better.`

PT-BR title: `Métodos para agentes que precisam trabalhar melhor.`

Keep existing search/filter/result strings intact so URL/filter behavior does not need a second copy contract.

- [ ] **Step 4: Implement `MethodRow`**

Use a semantic `<article>` containing one full-row `Link`. Keep summary/benefit text visible in markup. Do not use card lift/shadow. Add a single arrow affordance and class hooks for line trace, title micro-translate, and metadata contrast changes.

- [ ] **Step 5: Run GREEN and commit**

Run the focused test. Commit: `feat(web): add editorial method rows`

---

### Task 3: Replace the Skills card catalog with the Method Archive

**Files:**
- Create: `apps/web/src/components/skills/method-archive.tsx`
- Modify: `apps/web/src/components/skills/method-archive.test.tsx`
- Modify: `apps/web/src/app/[locale]/skills/page.tsx`
- Create: `apps/web/src/app/editorial-methods.css`
- Modify: `apps/web/src/app/[locale]/layout.tsx`
- Delete after migration: `apps/web/src/components/skills-catalog.tsx`
- Keep: `apps/web/src/components/skill-card.tsx` because Pack Detail still consumes it until the Packs redesign.

**Interfaces:**
- Produces `MethodArchive({ skills, options, copy, locale })`.
- Preserves `useQueryStates` with the exact existing query schema and options `{ history: "replace", shallow: true, clearOnDefault: true }`.
- Renders filtered results as `MethodRow[]`, never `.skill-grid` as the primary `/skills` representation.

- [ ] **Step 1: Add failing archive behavior tests**

Use `NuqsTestingAdapter` and a small fixture list. Cover the two behaviors with real failure cost: filtering and clearing.

```tsx
render(
  <NuqsTestingAdapter>
    <MethodArchive {...fixtureProps} />
  </NuqsTestingAdapter>,
)

fireEvent.change(screen.getByRole("searchbox"), { target: { value: "motion" } })
expect(screen.getAllByTestId("method-row")).toHaveLength(1)
fireEvent.click(screen.getByRole("button", { name: /clear/i }))
expect(screen.getAllByTestId("method-row")).toHaveLength(2)
```

Also assert category filtering updates the visible rows and that the empty state remains recoverable with the clear action.

- [ ] **Step 2: Run RED**

Run: `npm --prefix apps/web test -- src/components/skills/method-archive.test.tsx`

Expected: FAIL because `MethodArchive` does not exist and the index still renders cards.

- [ ] **Step 3: Implement `MethodArchive` by moving, not rewriting, filter logic**

Port the existing `useQueryStates`, `filterSkills`, `updateFilter`, and `clearFilters` logic from `SkillsCatalog`. Present category as a horizontal archive index of buttons; keep pack/difficulty/maturity as compact native selects. Search remains the dominant control.

Do not introduce a second filter state object or a second client boundary.

- [ ] **Step 4: Rebuild `/skills` as the Method Archive page**

The route remains a Server Component. Derive real metrics from `getCatalog()`:

```ts
const metrics = [
  { label: skillCopy.methodsMetric, value: localizedSkills.length },
  { label: skillCopy.packsMetric, value: activePacks.size },
  { label: skillCopy.categoriesMetric, value: catalog.filters.categories.length },
  { label: skillCopy.versionMetric, value: catalog.version },
]
```

Render `EditorialPageHero`, then the Suspense-wrapped `MethodArchive`. Do not render `SiteHeader`/`SiteFooter` locally.

- [ ] **Step 5: Implement `editorial-methods.css` for archive behavior**

Desktop: large publication-index hero, sticky control surface, dense rows.

Required hover/focus language:

```css
.method-row__link::after { transform: scaleX(0); transition: transform 420ms var(--ease-editorial); }
.method-row__link:hover::after,
.method-row__link:focus-visible::after { transform: scaleX(1); }
.method-row__title { transition: transform 280ms var(--ease-editorial); }
.method-row__link:hover .method-row__title,
.method-row__link:focus-visible .method-row__title { transform: translateX(0.35rem); }
```

Mobile: rows remain rows, metadata wraps below the title, and the filter surface may horizontally scroll rather than becoming a multi-column card grid.

Reduced motion: remove transforms/transitions while preserving the focused color/border state.

- [ ] **Step 6: Delete `skills-catalog.tsx` only after `rg SkillsCatalog apps/web/src` returns no consumers**

Keep `skill-card.tsx` for Packs until its later plan.

- [ ] **Step 7: Run GREEN, typecheck, and commit**

Run:

```bash
npm --prefix apps/web test -- src/components/skills/method-archive.test.tsx src/lib/skill-filters.test.ts
npm --prefix apps/web run typecheck
```

Commit: `feat(web): turn skills into a method archive`

---

### Task 4: Method Dossier and technical reader structure

**Files:**
- Create: `apps/web/src/components/skills/method-dossier.tsx`
- Create: `apps/web/src/components/skills/method-reader.tsx`
- Create: `apps/web/src/components/skills/prompt-specimen.tsx`
- Create: `apps/web/src/components/skills/method-dossier.test.tsx`
- Modify: `apps/web/src/lib/messages.ts`
- Modify: `apps/web/src/app/[locale]/skills/[slug]/page.tsx`
- Modify: `apps/web/src/app/editorial-methods.css`

**Interfaces:**
- Produces `MethodDossier({ skill, index, locale, category, difficulty, maturity, packNames, commands, sourceUrl, copy })` as a Server Component.
- Produces `MethodReader({ label, sections, children })`; `sections` are anchor descriptors only, not duplicated content.
- Produces `PromptSpecimen({ index, prompt, copyLabel, copiedLabel })`, composing the existing `CopyCommand` rather than reimplementing clipboard state.

- [ ] **Step 1: Write the failing Dossier contract test**

Render the real detail route for one known skill, for example `designing-ui-systems`, and assert the hybrid structure:

```tsx
const { container } = render(
  await SkillDetailPage({
    params: Promise.resolve({ locale: "en", slug: "designing-ui-systems" }),
  }),
)

expect(container.querySelector('[data-method-dossier="hero"]')).toBeInTheDocument()
expect(container.querySelector('[data-method-dossier="benefit"]')).toBeInTheDocument()
expect(screen.getByRole("navigation", { name: "On this method" })).toBeInTheDocument()
expect(document.querySelector("#when-to-use")).toBeInTheDocument()
expect(document.querySelector("#example-prompts")).toBeInTheDocument()
expect(document.querySelector("#installation")).toBeInTheDocument()
```

Assert every reader-nav href points to an existing ID. Assert prompt specimens retain their full prompt text and a Copy button.

- [ ] **Step 2: Run RED**

Run: `npm --prefix apps/web test -- src/components/skills/method-dossier.test.tsx`

Expected: FAIL because the Dossier components/markers do not exist.

- [ ] **Step 3: Extend Skill Detail copy minimally**

Add only the labels the new composition needs:

```ts
methodLabel: string
onThisMethod: string
promptLabel: string
technicalNotes: string
```

Use existing strings for benefit, use cases, prompts, installation, compatibility, dependencies, packs, related skills, version, updated, source, copy, and copied.

- [ ] **Step 4: Implement `PromptSpecimen`**

Render a specimen header (`PROMPT / 01` or localized equivalent), the complete prompt in readable prose/code-safe whitespace, and the existing `CopyCommand`. Set `data-interaction="confirm"` on the action container. Do not hide or replace the prompt after copy.

- [ ] **Step 5: Implement `MethodReader`**

Use a two-column wrapper with `EditorialReaderNav` and a main content column. Reader navigation stays anchor-based and server-safe; do not add scroll observers yet. On mobile the nav becomes in-flow via CSS.

- [ ] **Step 6: Implement `MethodDossier` and migrate the detail route**

The hero uses real ordinal, category, title, summary, difficulty, maturity, version, and updated date. Derive ordinal in the route without changing the canonical catalog model:

```ts
const index = getCatalog().skills.findIndex((candidate) => candidate.slug === slug)
```

The benefit statement forms the editorial handoff. Technical reader section IDs are exactly:

```text
benefit
when-to-use
when-not-to-use
use-cases
example-prompts
installation
technical-notes
related-methods
```

Omit `related-methods` if there are no related skills/packs. Do not create an empty Evidence section in this tranche; cross-domain evidence arrives in the final relations slice.

- [ ] **Step 7: Style the Dossier**

Desktop hero target: approximately 70–85dvh, but use `min-height`/`clamp` so long PT-BR copy can expand without clipping. Add a violet provenance rail using CSS pseudo-elements, not canvas/GSAP.

Reader sections use generous rules, mono labels, and hover/focus transitions for source/related links. `scroll-margin-top` must account for the global publication bar.

- [ ] **Step 8: Run GREEN and commit**

Run:

```bash
npm --prefix apps/web test -- src/components/skills/method-dossier.test.tsx src/components/copy-command.test.tsx
npm --prefix apps/web run typecheck
```

Commit: `feat(web): redesign skill details as method dossiers`

---

### Task 5: Methods tranche final polish and minimal production gate

**Files:**
- Modify only files implicated by validation findings from Tasks 1–4.
- Test: `apps/web/src/lib/editorial-foundation.test.ts`
- Test: `apps/web/src/components/skills/method-archive.test.tsx`
- Test: `apps/web/src/components/skills/method-dossier.test.tsx`

**Interfaces:**
- Produces a production-ready Skills index/detail pair that establishes the editorial vocabulary later plans reuse.
- Does not begin Packs or Evidence implementation.

- [ ] **Step 1: Run the targeted automated suite**

```bash
npm --prefix apps/web test -- \
  src/lib/editorial-foundation.test.ts \
  src/lib/skill-filters.test.ts \
  src/components/skills/method-archive.test.tsx \
  src/components/skills/method-dossier.test.tsx \
  src/components/copy-command.test.tsx
```

Expected: PASS.

- [ ] **Step 2: Run essential static gates**

```bash
npm --prefix apps/web run typecheck
npm --prefix apps/web run lint
NEXT_PUBLIC_SITE_URL=https://skills.jhonatanoliveira.com npm --prefix apps/web run build
```

Expected: PASS. If the known Windows-only legacy redirect timeout appears later in CI, document it rather than changing unrelated redirect code in this tranche.

- [ ] **Step 3: Perform only a lightweight responsive sanity pass before production**

Inspect `/pt-BR/skills`, one long PT-BR skill detail, `/en/skills`, and the corresponding English detail at desktop and mobile widths. Required pre-production blockers only:

- no horizontal overflow;
- no sticky UI covering headings;
- no content hidden by animation state;
- filters remain touch/keyboard usable;
- global header/footer remain exactly the shared layout instances.

Do not add a permanent browser regression suite for cosmetic differences.

- [ ] **Step 4: Apply only bounded fixes found by the sanity pass**

Keep visual tuning inside `editorial-pages.css` / `editorial-methods.css`; do not reopen the Home or site chrome unless a genuine regression originates there.

- [ ] **Step 5: Commit and open the implementation PR**

Commit: `refactor(web): finish editorial methods system`

Open a PR to `main` summarizing Method Archive, Method Dossier, preserved URL filter contract, global chrome invariant, targeted tests, and production-first visual validation.

- [ ] **Step 6: After production visual approval, write the next plan**

Next plan scope: Packs Archive + Pack Blueprint. Evidence remains a separate plan after Packs.
