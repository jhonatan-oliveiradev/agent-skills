# Evidence-first Purple Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Agent Skills Studio Home into an evidence-first editorial product page and replace the generic blue accent with the approved Dark Veil violet system.

**Architecture:** Keep the existing server-rendered Home route and catalog/case data sources. Add a focused localized Home evidence content model, compose the new sections directly in `page.tsx`, and style them with shared semantic tokens plus Home-specific editorial classes in `globals.css`; no new runtime dependency or client boundary is required.

**Tech Stack:** Next.js 16.3.1, React 19.2.8, TypeScript 5.9, Tailwind CSS v4 plus existing global CSS, Vitest/Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-30-home-evidence-first-purple-design.md`

## Global Constraints

- Preserve the approved Dark Veil hero and Method Engine.
- Replace global brand/focus blue with the approved violet token family.
- Use only repository-verifiable evidence; invent no testimonials, logos, adoption metrics, or customer claims.
- Keep locale routing, active pack data, catalog data and `Built With Skills` data server-rendered.
- Avoid repeated generic three-card section formulas.
- Preserve keyboard/focus accessibility and reduced-motion behavior.
- No new npm dependency.

---

### Task 1: Define the Home evidence contract with a failing test

**Files:**
- Create: `apps/web/src/lib/home-evidence-content.test.ts`
- Create: `apps/web/src/lib/home-evidence-content.ts`

**Interfaces:**
- Produces: `homeEvidenceContent: Record<Locale, HomeEvidenceCopy>` with `proof`, `transformation`, `methods`, `workflow`, and `ledger` localized copy.

- [ ] **Step 1: Write the failing test**

Create `home-evidence-content.test.ts` that imports `homeEvidenceContent` and asserts for both locales that the content exposes exactly 3 transformation stages, 3 featured method slugs, 4 workflow movements, a proof label, and a non-empty evidence-led ledger heading. The production module does not exist yet, so the test must fail because the import cannot resolve.

- [ ] **Step 2: Run test to verify RED**

Run through CI: `npm run web:test -- --run apps/web/src/lib/home-evidence-content.test.ts` or the repository's equivalent `npm run web:test`.
Expected: FAIL because `./home-evidence-content` is missing.

- [ ] **Step 3: Implement localized content**

Create typed localized content with:

```ts
export type HomeEvidenceCopy = Readonly<{
  proof: { eyebrow: string; title: string; summary: string; challengeLabel: string; challenge: string; skillsLabel: string; outcomeLabel: string; outcome: string; evidenceLabel: string; evidence: readonly string[]; beforeLabel: string; afterLabel: string; viewCases: string };
  transformation: { eyebrow: string; title: string; summary: string; stages: readonly [{ title: string; summary: string }, { title: string; summary: string }, { title: string; summary: string }] };
  methods: { eyebrow: string; title: string; summary: string; viewAll: string; featured: readonly [{ slug: "designing-ui-systems"; discipline: string }, { slug: "building-premium-nextjs-interfaces"; discipline: string }, { slug: "craft-premium-motion"; discipline: string }] };
  workflow: { eyebrow: string; title: string; summary: string; movements: readonly [{ title: string; summary: string }, { title: string; summary: string }, { title: string; summary: string }, { title: string; summary: string }] };
  ledger: { eyebrow: string; title: string; summary: string; methodLabel: string; usedInLabel: string; evidenceLabel: string; viewAll: string };
}>;
```

- [ ] **Step 4: Run tests GREEN**

Run `npm run web:test`.
Expected: PASS.

- [ ] **Step 5: Commit**

`git commit -m "feat(web): add evidence-first Home content"`

---

### Task 2: Recompose the Home around evidence

**Files:**
- Modify: `apps/web/src/app/[locale]/page.tsx`
- Test: `apps/web/src/app/[locale]/page.test.tsx` if present; otherwise add a focused render/structure test under `apps/web/src/app/[locale]/home-structure.test.tsx` using the project's existing test conventions.

**Interfaces:**
- Consumes: `homeEvidenceContent`, `getCatalog`, `getLocalizedPacks`, `getBuiltWithSkillsCases`, `localizePath`.
- Produces: section markers `data-home-section="proof|transformation|methods|packs|workflow|ledger|roadmap"` for structural regression coverage.

- [ ] **Step 1: Write failing structural test**

Assert that the Home composition places `proof` immediately after the hero, includes `methods`, `workflow`, and `ledger`, and no longer renders the legacy `home-path-grid` / generic three-card process composition.

- [ ] **Step 2: Verify RED in CI**

Run `npm run web:test` and confirm the new structural assertions fail against the current Home.

- [ ] **Step 3: Implement server-rendered section order**

Refactor `page.tsx` to:

```text
hero
proof
transformation
methods
packs
workflow
ledger
roadmap
```

Use the first existing Built With Skills case data to seed ledger rows, active packs for the pack section, and catalog skills filtered to the three featured slugs. Keep links localized.

- [ ] **Step 4: Add code-native Before/After evidence previews**

Build maintainable HTML mini-compositions inside the proof module rather than raster screenshots. They should visually suggest the prior cramped hero vs current manifesto/engine split while remaining decorative (`aria-hidden="true"`).

- [ ] **Step 5: Run tests GREEN**

Run `npm run web:test`.
Expected: PASS.

- [ ] **Step 6: Commit**

`git commit -m "refactor(web): make Home evidence first"`

---

### Task 3: Replace blue with the Dark Veil violet product system

**Files:**
- Modify: `apps/web/src/app/globals.css`
- Test: add token assertions to an existing style/source test if available; otherwise add `apps/web/src/lib/editorial-tokens.test.ts` reading `globals.css` through Node filesystem in Vitest.

**Interfaces:**
- Produces semantic tokens:
  - light `--editorial-accent: #6d28d9`
  - light `--editorial-focus: #7c3aed`
  - dark `--editorial-accent: #a78bfa`
  - dark `--editorial-focus: #c4b5fd`

- [ ] **Step 1: Write failing token test**

Assert the four exact approved accent/focus values exist in `globals.css` and the old `#1745e8`, `#6f91ff`, and `#8ea8ff` brand/focus values do not remain as semantic accent/focus declarations.

- [ ] **Step 2: Verify RED**

Run `npm run web:test` and confirm the token assertions fail.

- [ ] **Step 3: Update semantic tokens**

Change only the global brand/focus tokens; preserve success/warning/danger semantics.

- [ ] **Step 4: Implement Home editorial section styles**

Add section families for proof, transformation rail, method index, restrained pack modules, workflow rail, evidence ledger and responsive behavior. Remove or stop relying on legacy Home path/process card styles where they are no longer rendered. Use borders, lists, rows and open whitespace rather than repeated rounded cards.

- [ ] **Step 5: Run tests GREEN**

Run `npm run web:test`.
Expected: PASS.

- [ ] **Step 6: Commit**

`git commit -m "refactor(web): unify Home around violet editorial system"`

---

### Task 4: Production verification and published QA

**Files:**
- No production file required unless QA finds a defect.

- [ ] **Step 1: Run full validation**

Run the repository CI matrix via Pull Request:

```text
npm test
npm run validate
npm ci --prefix apps/web
npm run web:test
npm run web:typecheck
npm run web:lint
npm run web:build
Bash/PowerShell installer smoke tests
```

Expected: all green on Ubuntu and Windows.

- [ ] **Step 2: Review PR diff for scope**

Confirm no temporary QA workflow, generated screenshot, or unrelated refactor is included.

- [ ] **Step 3: Merge to `main` after green checks**

Use the repository's normal merge method. The user explicitly authorized merge.

- [ ] **Step 4: Validate the published site**

Use the production deployment after merge. Check dark theme at desktop and mobile widths, scan the full Home, verify no horizontal overflow, verify localized links, and compare the rendered page against the approved evidence-first concept/direction.

- [ ] **Step 5: Fix only material QA issues**

If a production visual issue is found, create a small follow-up branch/PR, verify, and merge; do not leave known material defects because the site is pre-launch.
