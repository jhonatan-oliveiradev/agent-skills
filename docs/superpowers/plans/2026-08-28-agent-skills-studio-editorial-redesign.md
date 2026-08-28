# Agent Skills Studio Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic microsite shell and Home with a premium editorial, motion-led experience that demonstrates the skills collection through real data and supported installation flows.

**Architecture:** Keep localized content and catalog assembly server-rendered. Use Tailwind v4 for the visual system and small client islands for theme transitions, navigation motion, procedural rendering, terminal sequencing, and copy feedback. Preserve compatibility tokens for internal routes until later migration plans.

**Tech Stack:** Next.js 16.3.1, React 19.2.8, TypeScript 5.9, Tailwind CSS v4, Motion for React, Lucide React, next-themes, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-28-agent-skills-studio-editorial-redesign.md`

## Global Constraints

- Use Tailwind CSS v4 utilities whenever possible; do not add `tailwind.config.js`.
- Import Motion from `motion/react`, never `framer-motion`.
- Runtime additions are limited to `motion`, `lucide-react`, and the shadcn-compatible `cn` helper dependencies.
- Self-host Instrument Sans and IBM Plex Mono with OFL licenses.
- Keep the Home as a Server Component and isolate client interaction.
- Preserve complete navigation and content without animation or client JavaScript.
- Respect reduced motion everywhere.
- Do not copy paid Skiper UI source; effects must be original.
- Keep commands, metrics, packs, skills, versions, and cases repository-backed.
- Each task starts from the latest `origin/main`, ends with full gates and a PR to `main`, and is never auto-merged.
- Never stage `apps/next-locale-redirect-*`, `apps/web/AGENTS.md`, or `apps/web/CLAUDE.md`.

---

### Task 1: Tailwind v4 foundation and typography

**Files:**
- Modify: `apps/web/package.json`
- Modify: `apps/web/package-lock.json`
- Modify: `apps/web/src/app/globals.css`
- Modify: `apps/web/src/app/[locale]/layout.tsx`
- Create: `apps/web/src/lib/utils.ts`
- Create: `apps/web/src/app/fonts/instrument-sans-latin.woff2`
- Create: `apps/web/src/app/fonts/ibm-plex-mono-latin.woff2`
- Create: `apps/web/src/app/fonts/OFL-Instrument-Sans.txt`
- Create: `apps/web/src/app/fonts/OFL-IBM-Plex-Mono.txt`
- Test: `apps/web/src/lib/editorial-foundation.test.ts`

**Interfaces:**
- Produces `cn(...inputs: ClassValue[]): string`.
- Produces Tailwind utilities `font-display`, `font-mono`, `bg-canvas`, `bg-surface`, `text-foreground`, `text-muted`, `text-accent`, `border-line`, and `ease-editorial`.
- Produces temporary aliases for every current semantic CSS variable.

- [ ] **Step 1: Write the failing foundation test**

Read `globals.css` and the localized layout from the test. Assert `@theme`, both font families, light/dark tokens, legacy aliases, Firefox/WebKit scrollbar rules, and body font/background utilities.

```ts
expect(css).toContain("@theme")
expect(css).toContain("--font-display")
expect(css).toContain("scrollbar-color")
expect(css).toContain("::-webkit-scrollbar-thumb")
expect(layout).toContain("font-display")
```

- [ ] **Step 2: Run RED**

Run: `./node_modules/.bin/vitest run src/lib/editorial-foundation.test.ts`  
Expected: FAIL because the editorial tokens, fonts, and scrollbar do not exist.

- [ ] **Step 3: Install dependencies and implement `cn`**

Run: `npm install motion lucide-react clsx tailwind-merge`

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
```

- [ ] **Step 4: Add licensed fonts and tokens**

Acquire WOFF2 and OFL text only from official upstream releases. Register them with `font-display: swap`. Declare tokens through `@theme inline`, alias old variables, and add themed scrollbar rules. Do not apply blanket transitions.

- [ ] **Step 5: Apply stable body utilities**

```tsx
<body className="bg-canvas font-display text-foreground antialiased">
```

- [ ] **Step 6: Run GREEN and full gates**

Run focused/full tests, typecheck, lint, and production build. All current routes must remain valid.

- [ ] **Step 7: Commit and open PR**

Commit: `feat(web): establish editorial design foundation`. Open a PR to `main`, then wait for merge and visual validation.

---

### Task 2: Theme transition and semantic icon controls

**Files:**
- Replace: `apps/web/src/components/theme-switcher.tsx`
- Modify: `apps/web/src/components/theme-switcher.test.tsx`
- Modify: `apps/web/src/components/copy-command.tsx`
- Create: `apps/web/src/components/copy-command.test.tsx`
- Modify: `apps/web/src/lib/messages.ts`
- Modify: `apps/web/src/app/globals.css`

**Interfaces:**
- Produces `ThemeTransitionToggle({ locale, variant = "rectangle", start = "bottom-up", blur = false })`.
- Produces icon-only `CopyCommand` feedback using `Copy` and `Check`.
- Consumes Task 1 tokens and `cn`.

- [ ] **Step 1: Write failing tests**

```ts
expect(screen.getByRole("button", { name: "Switch to dark theme" })).toBeVisible()
fireEvent.click(button)
expect(setTheme).toHaveBeenCalledWith("dark")
```

Cover dark-to-light, initial `system` via `resolvedTheme`, missing View Transition support, reduced motion, PT-BR accessible names, clipboard success, clipboard failure, and the copied state.

- [ ] **Step 2: Run RED**

Run both focused test files. Expected: FAIL because the select and text copy action remain.

- [ ] **Step 3: Adapt the attached Skiper26 toggle**

Remove demo options, GIF branches, and legacy imports. Use `motion/react`, the selected yin-yang SVG, and:

```ts
const nextTheme = resolvedTheme === "dark" ? "light" : "dark"
if (!reducedMotion && document.startViewTransition) {
  document.startViewTransition(() => setTheme(nextTheme))
} else setTheme(nextTheme)
```

Add localized label/title, focus visibility, and explicit transform transition.

- [ ] **Step 4: Implement Lucide copy feedback**

Keep `<code>` visible. The icon button has a localized accessible name, tooltip, minimum touch target, and `Check` only after actual clipboard success.

- [ ] **Step 5: Run GREEN and full gates**

Confirm no select theme control and no `framer-motion` import remain.

- [ ] **Step 6: Commit and open PR**

Commit: `feat(web): add editorial theme and icon controls`. Open PR and wait for merge/validation.

---

### Task 3: Editorial header, TextRoll menu, and signature footer

**Files:**
- Create: `apps/web/src/components/text-roll.tsx`
- Create: `apps/web/src/components/editorial-navigation.tsx`
- Create: `apps/web/src/components/mobile-editorial-menu.tsx`
- Modify: `apps/web/src/components/site-header.tsx`
- Modify: `apps/web/src/components/site-footer.tsx`
- Modify: `apps/web/src/components/site-shell.test.tsx`
- Modify: `apps/web/src/lib/messages.ts`

**Interfaces:**
- Produces `TextRoll({ children, className, center, active })` with `motion/react`.
- Produces localized desktop/mobile navigation with `aria-current`.
- Produces footer signature link to `https://jhonatanoliveira.com`.

- [ ] **Step 1: Write failing shell tests**

Assert signature copy/link, localized internal links, current route, mobile trigger, Escape close with focus return, reachable theme/locale controls, and no nested interactive elements.

- [ ] **Step 2: Run RED**

Run `site-shell.test.tsx`. Expected: FAIL for missing editorial shell behavior.

- [ ] **Step 3: Implement TextRoll**

Adapt the supplied stagger concept with `motion/react`, stable whitespace, hover/focus parity, current-route state, and reduced-motion fallback. The `Link` remains the only interactive element.

- [ ] **Step 4: Implement desktop and mobile navigation**

Desktop starts transparent and gains restrained border/backdrop after scroll. Mobile uses an accessible fullscreen menu, locks body scroll only while open, traps focus, closes on Escape, and restores trigger focus.

- [ ] **Step 5: Implement signature footer**

Use the dominant closing statement “Built in public. Designed and developed by Jhonatan Oliveira.” Keep version, repository, contribution, and changelog secondary. Use `ArrowUpRight` for external destinations.

- [ ] **Step 6: Run GREEN, commit, and open PR**

Commit: `feat(web): redesign the editorial site shell`. Open PR and wait for production validation.

---

### Task 4: Motion primitives and original procedural hero

**Files:**
- Create: `apps/web/src/components/motion/editorial-reveal.tsx`
- Create: `apps/web/src/components/motion/scroll-progress.tsx`
- Create: `apps/web/src/components/motion/procedural-light-canvas.tsx`
- Create: `apps/web/src/components/motion/editorial-hero-motion.tsx`
- Create: `apps/web/src/components/motion/editorial-motion.test.tsx`
- Create: `apps/web/src/lib/home-content.ts`
- Modify: `apps/web/src/app/[locale]/page.tsx`
- Modify: `apps/web/src/components/site-shell.test.tsx`

**Interfaces:**
- Produces `EditorialReveal`, `ScrollProgress`, `ProceduralLightCanvas`, and approved bilingual hero content.
- Canvas contract: DPR cap `1.5`, resize handling, visibility pause, static fallback, and complete cleanup.

- [ ] **Step 1: Write failing tests**

Assert manifesto heading/actions, server-visible content, reduced-motion static state, cancellation on unmount, and pause on visibility/intersection changes.

- [ ] **Step 2: Run RED**

Run motion and shell tests. Expected: FAIL because the primitives and manifesto hero do not exist.

- [ ] **Step 3: Implement reveal and progress**

Use only transform/opacity with editorial easing. Keep configurable semantic elements and no wrapper that breaks heading hierarchy.

- [ ] **Step 4: Implement original procedural canvas**

Use an original low-resolution flow/noise or shader composition, `ResizeObserver`, `IntersectionObserver`, `visibilitychange`, DPR cap, static CSS fallback, and animation-frame cleanup. Never block heading/CTA rendering.

- [ ] **Step 5: Replace only the Home hero**

Keep the page server-rendered; pass localized strings to the motion island. Full content must exist in server HTML.

- [ ] **Step 6: Run GREEN, inspect bundle, commit, and open PR**

Commit: `feat(web): add the motion-led editorial hero`. Reject horizontal overflow, hidden content, or background animation outside visibility. Open PR and wait for visual validation.

---

### Task 5: Magic UI Terminal and installation demonstration

**Files:**
- Create: `apps/web/src/components/magicui/terminal.tsx`
- Create: `apps/web/src/components/magicui/terminal.test.tsx`
- Create: `apps/web/src/components/home/method-demonstration.tsx`
- Modify: `apps/web/src/lib/home-content.ts`
- Modify: `apps/web/src/app/[locale]/page.tsx`
- Read: `scripts/install-skills.mjs`
- Read: `apps/web/src/lib/installation.ts`

**Interfaces:**
- Produces current Magic UI-compatible `Terminal`, `TypingAnimation`, and `AnimatedSpan`.
- Produces `MethodDemonstration({ locale })` with real supported commands and truthful output.

- [ ] **Step 1: Capture source-truth installer output**

Run one named-skill install into a temporary destination. Record stable user-facing output only; do not invent validation stages.

- [ ] **Step 2: Write failing tests**

Assert sequence order, complete static reduced-motion output, `figure`/`figcaption`, `pre > code`, mobile overflow handling, and supported bilingual commands.

- [ ] **Step 3: Run RED**

Run `terminal.test.tsx`. Expected: FAIL because the component and section do not exist.

- [ ] **Step 4: Add the current Magic UI component locally**

Start from the official current registry source, retain an attribution comment, adapt to local `cn`, keep `motion/react`, and add reduced-motion behavior. Restyle the chrome with Tailwind tokens.

- [ ] **Step 5: Build “Method in execution”**

Compose real installation, natural invocation, and verifiable outcome. Use the icon-based `CopyCommand`; animation is enhancement and screen readers receive complete output.

- [ ] **Step 6: Run GREEN, commit, and open PR**

Commit: `feat(web): demonstrate skill installation in terminal`. Open PR and wait for merge/validation.

---

### Task 6: Complete editorial Home narrative

**Files:**
- Create: `apps/web/src/components/home/collection-index.tsx`
- Create: `apps/web/src/components/home/pack-chapters.tsx`
- Create: `apps/web/src/components/home/case-study-feature.tsx`
- Create: `apps/web/src/components/home/open-project.tsx`
- Create: `apps/web/src/components/home/home-sections.test.tsx`
- Modify: `apps/web/src/lib/home-content.ts`
- Modify: `apps/web/src/app/[locale]/page.tsx`
- Modify: `apps/web/src/lib/messages.ts`
- Modify: `apps/web/src/app/globals.css`

**Interfaces:**
- Consumes catalog skills, active packs, real case studies, motion primitives, and localized routing.
- Produces a complete editorial Home with no legacy Home card grid or placeholder copy.

- [ ] **Step 1: Write failing section tests**

Assert 18 skill index rows, three active pack chapters, zero planned packs on Home, two case studies, localized open-project links, and absence of `.home-pack-card`, `.home-case-card`, and foundation notices.

- [ ] **Step 2: Run RED**

Run Home section and shell tests. Expected: FAIL because the legacy card Home remains.

- [ ] **Step 3: Implement collection index**

Render semantic rows with name, localized category, and primary benefit. Add restrained link motion and preserve the path to the `nuqs` catalog.

- [ ] **Step 4: Implement active pack chapters**

Use catalog order and catalog accent colors through scoped CSS properties/Tailwind arbitrary-property utilities. Never use color as the only status signal.

- [ ] **Step 5: Implement cases and open-project close**

Use only existing case records. Link roadmap, changelog, contribution, repository, and version truthfully.

- [ ] **Step 6: Remove legacy Home code**

Use `rg` to prove each old Home class/copy field is unreferenced before deletion. Keep styles required by internal routes.

- [ ] **Step 7: Run GREEN, commit, and open PR**

Commit: `feat(web): complete the editorial home narrative`. Run full gates and validate both locales/themes before PR.

---

### Task 7: Accessibility, performance, SEO, and production audit

**Files:**
- Create: `apps/web/src/lib/editorial-audit.test.ts`
- Modify only files implicated by reproduced audit findings.
- Modify: `CHANGELOG.md`
- Modify: `README.md`

**Interfaces:**
- Consumes the merged Tasks 1–6 state.
- Produces verified audit evidence and release documentation without new visual scope.

- [ ] **Step 1: Build the audit matrix**

Cover desktop/mobile, light/dark, EN/PT-BR, full/reduced motion, keyboard order, menu focus, theme fallback, terminal overflow, canvas pause, no-JS content, metadata, and canonical alternates.

- [ ] **Step 2: Write a failing regression test for every defect**

Do not patch without reproduction. Classify P0–P3 and resolve all P0/P1 plus readability, interaction, responsive, and trust-related P2 issues.

- [ ] **Step 3: Apply only evidence-backed fixes**

Do not introduce new art direction during audit. File any deferred subjective polish explicitly.

- [ ] **Step 4: Run final gates**

```bash
./node_modules/.bin/vitest run --exclude src/lib/legacy-locale-redirect.test.ts
npm run typecheck
npm run lint
NEXT_PUBLIC_SITE_URL=https://skills.jhonatanoliveira.com npm run build
git diff --check
```

Record test count, route count, dependency delta, and bundle observations.

- [ ] **Step 5: Update documentation**

Document Tailwind v4, Motion/Magic UI ownership, font licenses, reduced motion, deployment verification, and readable beta outcomes.

- [ ] **Step 6: Commit and open final sprint PR**

Commit: `chore(web): audit editorial redesign readiness`. Open PR to `main`, do not merge, and verify production after the user merges.
