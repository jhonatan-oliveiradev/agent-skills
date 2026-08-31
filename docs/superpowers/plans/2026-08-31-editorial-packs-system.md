# Editorial Packs System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the legacy Packs card grid and documentation-style pack detail with a Curated Systems Archive and System Blueprint that reuse the approved editorial foundation and global site chrome.

**Architecture:** Keep route components server-first and keep `LocalizedPack` as the canonical data contract. `/packs` becomes a server-rendered archive of domain-specific dossiers; `/packs/[slug]` becomes a hybrid editorial blueprint with numbered outcomes, a semantic composition map, and installation only for active packs. Client state is limited to contextual composition inspection; global `SiteHeader` and `SiteFooter` remain owned only by the locale layout.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, CSS, Vitest/RTL, existing catalog and `CopyCommand`.

**Spec:** `docs/superpowers/specs/2026-08-31-editorial-catalog-system-design.md`

## Global Constraints

- `SiteHeader` and `SiteFooter` remain rendered exactly once by `apps/web/src/app/[locale]/layout.tsx`.
- `LocalizedPack` remains the canonical pack model; do not create a duplicated editorial pack model.
- Active packs may expose real installation commands; planned packs must not render fake or disabled installation controls.
- Pack composition communicates ordered membership, not dependency or causality unless explicitly known.
- Hover behavior must have `focus-visible` equivalents.
- CSS owns hover/focus micro-interactions; do not introduce GSAP for the Packs tranche.
- `prefers-reduced-motion: reduce` must keep all content visible and usable.
- Tests remain minimal: structural/behavioral contracts plus repository CI; perceptual review happens primarily in production.

---

### Task 1: Curated Systems Archive

**Files:**
- Create: `apps/web/src/components/packs/pack-archive.tsx`
- Create: `apps/web/src/components/packs/pack-dossier.tsx`
- Create: `apps/web/src/lib/editorial-packs-copy.ts`
- Create: `apps/web/src/app/editorial-packs.css`
- Create: `apps/web/src/lib/editorial-packs-structure.test.ts`
- Modify: `apps/web/src/app/[locale]/packs/page.tsx`
- Modify: `apps/web/src/app/[locale]/layout.tsx`
- Delete after GREEN: `apps/web/src/components/pack-card.tsx`

**Interfaces:**
- Consumes: `getCatalog()`, `getLocalizedPacks(locale)`, `LocalizedPack`, `EditorialPageHero`.
- Produces: `PackArchive({ packs, locale, labels })` and `PackDossier({ pack, index, href, labels })`.

- [ ] **Step 1: Write the failing structural test**

```ts
it("turns Packs into a curated systems archive without forking global chrome", async () => {
  const page = await read("app/[locale]/packs/page.tsx");
  const layout = await read("app/[locale]/layout.tsx");

  expect(page).toContain("PackArchive");
  expect(page).toContain("EditorialPageHero");
  expect(page).not.toContain("PackCard");
  expect(page).not.toContain("SiteHeader");
  expect(page).not.toContain("SiteFooter");
  expect(layout).toContain('import "../editorial-packs.css"');
});
```

- [ ] **Step 2: Run the test and confirm RED**

Run through the PR CI or locally:

```bash
npm run web:test -- editorial-packs-structure.test.ts
```

Expected: FAIL because `PackArchive` and `editorial-packs.css` do not exist yet.

- [ ] **Step 3: Add localized editorial copy**

Create `editorial-packs-copy.ts` with EN/PT-BR labels for archive eyebrow/title/summary, system/version/status metrics, composition labels, and explore action. Keep existing `messages.packCatalog` labels for canonical active/planned/status wording where useful.

- [ ] **Step 4: Implement `PackDossier`**

The dossier must render:

```tsx
<article data-pack-dossier data-status={pack.status}>
  <Link data-interaction="navigate" href={href as Route}>
    <span>{String(index + 1).padStart(2, "0")}</span>
    <p>{statusLabel}</p>
    <h2>{pack.name}</h2>
    <p>{pack.summary}</p>
    <ol aria-label={compositionLabel}>...</ol>
    <span>{exploreLabel} ↗</span>
  </Link>
</article>
```

For active packs, list up to four real method names and the total count. For planned packs with no resolved composition, render the localized pending-composition label instead of invented methods.

- [ ] **Step 5: Implement `PackArchive` and migrate `/packs`**

Use `EditorialPageHero` with catalog-derived pack count, active count, planned count, and catalog version. Render dossiers in catalog order. Remove the `pack-grid` primary representation.

- [ ] **Step 6: Add archive styles and interactions**

`editorial-packs.css` must provide large alternating editorial dossiers, distinct active/planned states, violet trace/field hover, number/title/action reactions, responsive stacking, `focus-visible`, and reduced-motion fallbacks. Do not use generic card lift/shadow.

- [ ] **Step 7: Run GREEN verification and remove legacy `PackCard`**

Run:

```bash
npm run web:test
npm run web:typecheck
npm run web:lint
npm run web:build
```

Expected: PASS. Search the repository for `PackCard`; if no production consumer remains, delete `components/pack-card.tsx` and rerun the structural test.

- [ ] **Step 8: Commit the archive slice**

Commit message:

```text
refactor(web): turn packs into curated systems archive
```

---

### Task 2: System Blueprint Detail

**Files:**
- Create: `apps/web/src/components/packs/pack-blueprint.tsx`
- Create: `apps/web/src/components/packs/pack-composition-map.tsx`
- Create: `apps/web/src/components/packs/pack-blueprint.test.tsx`
- Create: `apps/web/src/app/editorial-pack-blueprint.css`
- Modify: `apps/web/src/app/[locale]/packs/[slug]/page.tsx`
- Modify: `apps/web/src/app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: `LocalizedPack`, `getPackInstallCommands`, `CopyCommand`, `EditorialMetadata`, `EditorialReaderNav`, `EditorialSectionHeading`.
- Produces: `PackBlueprint({ pack, locale, copy, commands })` and `PackCompositionMap({ skills, locale, labels })`.

- [ ] **Step 1: Write the failing blueprint test**

Render one real active pack and one real planned pack through `PackBlueprint` and assert:

```ts
expect(active.getByTestId("pack-blueprint-hero")).toBeTruthy();
expect(active.container.querySelectorAll("[data-pack-outcome]").length).toBeGreaterThan(0);
expect(active.container.querySelector("[data-pack-composition-map]")).toBeTruthy();
expect(active.getByText(copy.installation)).toBeTruthy();

expect(planned.container.querySelector('[data-pack-state="planned"]')).toBeTruthy();
expect(planned.queryByText(copy.installation)).toBeNull();
```

Prefer semantic selectors/data contracts over CSS class assertions.

- [ ] **Step 2: Run the test and confirm RED**

Expected: FAIL because `PackBlueprint` does not exist.

- [ ] **Step 3: Implement the blueprint hero and outcomes**

Hero includes status, system identity, name, summary, version, skill count, and description/high-level outcome. Outcomes render as numbered editorial statements using real `pack.outcomes` only.

- [ ] **Step 4: Implement semantic `PackCompositionMap`**

Use a client component only if contextual inspection state is needed. Base markup is an ordered list of the real `pack.skills` in source order. Every method is a real link to `/${locale}/skills/${slug}` and exposes `data-interaction="connect"`.

On hover/focus, selected method gains emphasis, siblings de-emphasize slightly, connector/provenance trace reacts, and its `primaryBenefit` becomes the contextual description. Do not label connectors as dependencies.

Mobile must remain a vertical `01 → 02 → 03` semantic sequence.

- [ ] **Step 5: Implement active/planned installation states**

When `commands` exists, reuse `CopyCommand` for Bash and PowerShell. When it is undefined, render the planned roadmap/status note and no installation heading/button/disabled shell.

- [ ] **Step 6: Migrate the route to orchestration only**

Keep metadata, static params, structured data, locale validation, pack lookup, and command resolution in the route. Replace the old `SkillCard` composition grid and detail markup with one `PackBlueprint` call. The route must not import `SiteHeader` or `SiteFooter`.

- [ ] **Step 7: Add blueprint CSS**

Add strong editorial entrance, numbered outcomes, responsive blueprint reader, composition connectors, hover/focus connect states, active/planned differences, copy panel styling, and reduced-motion fallbacks. Avoid hidden initial opacity states.

- [ ] **Step 8: Run GREEN verification**

Run:

```bash
npm run web:test
npm run web:typecheck
npm run web:lint
npm run web:build
```

Expected: PASS on Ubuntu and Windows CI.

- [ ] **Step 9: Commit the blueprint slice**

Commit message:

```text
refactor(web): build editorial pack blueprints
```

---

### Task 3: Final Packs Gate

**Files:**
- Review all Packs tranche changes.
- No persistent QA workflow should be added.

**Interfaces:**
- Produces a mergeable Packs PR with no duplicate chrome and no legacy primary card/grid presentation.

- [ ] **Step 1: Review the final diff**

Confirm:

- only the locale layout owns `SiteHeader` and `SiteFooter`;
- `/packs` no longer imports `PackCard`;
- `/packs/[slug]` no longer imports `SkillCard`;
- planned packs do not render installation controls;
- composition uses real ordered skills only;
- hover/focus/reduced-motion contracts exist in CSS.

- [ ] **Step 2: Run final CI**

Require repository tests/validation, web tests, typecheck, lint, production build, Bash smoke on Ubuntu, and PowerShell smoke on Windows.

- [ ] **Step 3: Production-oriented perceptual check**

Because visual validation is primarily performed in production, inspect at minimum one active pack, one planned pack, `/packs`, and mobile after deploy. Only add temporary rendered QA if CI or production reveals structural risk such as overflow or hidden content.

- [ ] **Step 4: Update PR evidence**

Document RED→GREEN runs, final CI run, active/planned behavior, and diff discipline.
