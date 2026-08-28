# Agent Skills Studio Microsite Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a deployable, statically generated bilingual Next.js foundation in `apps/web` that consumes the committed catalog, supports dark-first theming, and gives Vercel real `/en` and `/pt-BR` pages to serve.

**Architecture:** `apps/web` is an autonomous Next.js package, while the repository root remains the source of truth for collection data and validation. A deterministic prebuild sync copies `catalog/generated/catalog.json` into an ignored application-generated directory, a typed server-only adapter exposes read-only catalog projections, and localized App Router pages render statically. Client code is limited to first-visit locale selection, theme persistence, and global controls.

**Tech Stack:** Node.js 20+, Next.js 16.3.1, React 19.2.8, TypeScript 5.9, Tailwind CSS 4.1, next-themes 0.4, Vitest 4, Testing Library, jsdom, ESLint 9, Vercel.

**Spec:** `docs/superpowers/specs/2026-08-27-agent-skills-studio-microsite-design.md`

## Global Constraints

- Keep `catalog/generated/catalog.json` as the only skill and pack data source; do not duplicate catalog facts in application code.
- Generate canonical routes with exact locale identifiers `en` and `pt-BR`.
- Redirect legacy root-English and `/pt-br` routes permanently to their canonical localized equivalents.
- Statically generate all public localized pages; only `/` may use a client-side first-visit redirect with an `/en` no-JavaScript fallback.
- Use Server Components by default and add Client Components only for locale preference, theme, and clipboard-class interactions.
- Treat dark mode as the brand default while respecting the system preference on first access and persisting an explicit choice.
- Meet WCAG 2.2 AA interaction and contrast behavior; support keyboard, touch, assistive technology, and `prefers-reduced-motion`.
- Do not add a database, CMS, authentication, runtime GitHub request, GSAP, smooth-scroll library, or full installation wizard.
- Keep the root collection package independent; invoke web scripts with `npm --prefix apps/web` instead of turning the repository into a workspace in this slice.
- Keep `dev` as pre-production and `main` as production; this plan produces one focused PR to `dev`.

## File Structure

```text
apps/web/
├── package.json                     # isolated web dependencies and commands
├── package-lock.json                # reproducible dependency graph
├── next.config.ts                   # static redirects and build policy
├── tsconfig.json                    # strict TypeScript and @/* alias
├── eslint.config.mjs                # Next.js flat ESLint config
├── postcss.config.mjs               # Tailwind CSS v4 PostCSS plugin
├── vitest.config.ts                 # jsdom and @/* test resolution
├── vitest.setup.ts                  # Testing Library matchers and cleanup
├── vercel.json                      # framework declaration
├── scripts/
│   └── sync-catalog.mjs             # validated byte-for-byte catalog sync
└── src/
    ├── app/
    │   ├── globals.css              # tokens, themes, reset, shared utilities
    │   ├── (redirect)/
    │   │   ├── layout.tsx           # minimal root document for `/`
    │   │   └── page.tsx             # static first-visit locale redirect
    │   └── [locale]/
    │       ├── layout.tsx           # localized root document and static params
    │       └── page.tsx             # localized foundation home
    ├── components/
    │   ├── locale-redirect.tsx      # root locale preference redirect
    │   ├── locale-switcher.tsx      # route-preserving locale control
    │   ├── site-footer.tsx          # localized global footer
    │   ├── site-header.tsx          # localized global navigation
    │   ├── theme-provider.tsx       # next-themes boundary
    │   └── theme-switcher.tsx       # accessible system/light/dark control
    ├── generated/
    │   └── catalog.json             # ignored output of sync-catalog.mjs
    └── lib/
        ├── catalog.test.ts          # catalog contract tests
        ├── catalog.ts               # server-only typed catalog adapter
        ├── i18n.test.ts             # locale and route conversion tests
        ├── i18n.ts                  # locale constants and path helpers
        ├── locales.ts               # isomorphic canonical locale contract
        ├── messages.ts              # typed foundation UI dictionaries
        └── test-utils.tsx           # shared render helper
.github/workflows/validate.yml        # add web install, test, lint, and build
.gitignore                            # ignore web build and synced artifacts
README.md                             # local web and Vercel setup
package.json                          # root web:* orchestration commands
```

---

### Task 1: Create the isolated Next.js package and test harness

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/next-env.d.ts`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/eslint.config.mjs`
- Create: `apps/web/postcss.config.mjs`
- Create: `apps/web/vitest.config.ts`
- Create: `apps/web/vitest.setup.ts`
- Create: `apps/web/src/lib/foundation.test.ts`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: Node.js `>=20` from the root package contract.
- Produces: an independently installable `apps/web` package with `dev`, `build`, `start`, `lint`, `typecheck`, and `test` commands; `@/*` resolves to `apps/web/src/*`.

- [ ] **Step 1: Write the failing package-contract test**

Create `apps/web/src/lib/foundation.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const webRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));

describe("web package contract", () => {
  it("pins the application runtime and exposes every required gate", () => {
    const pkg = JSON.parse(readFileSync(resolve(webRoot, "package.json"), "utf8"));

    expect(pkg.private).toBe(true);
    expect(pkg.engines.node).toBe(">=20");
    expect(Object.keys(pkg.scripts)).toEqual(
      expect.arrayContaining(["dev", "build", "start", "lint", "typecheck", "test"]),
    );
    expect(pkg.dependencies.next).toBe("16.3.1");
    expect(pkg.dependencies.react).toBe("19.2.8");
    expect(pkg.dependencies["react-dom"]).toBe("19.2.8");
  });
});
```

- [ ] **Step 2: Run the test to verify RED**

Run: `node --test apps/web/src/lib/foundation.test.ts`

Expected: FAIL because Node cannot load the Vitest TypeScript test and the web package does not exist. This establishes that the package and its runner are absent; do not treat this command as the eventual test runner.

- [ ] **Step 3: Create the package manifest and tool configuration**

Create `apps/web/package.json` with exact direct dependencies:

```json
{
  "name": "@agent-skills-studio/web",
  "version": "1.0.0-beta.1",
  "private": true,
  "scripts": {
    "predev": "node scripts/sync-catalog.mjs",
    "dev": "next dev",
    "prebuild": "node scripts/sync-catalog.mjs",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --max-warnings=0",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "next": "16.3.1",
    "next-themes": "0.4.6",
    "react": "19.2.8",
    "react-dom": "19.2.8",
    "server-only": "0.0.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.0",
    "@testing-library/jest-dom": "^6.9.0",
    "@testing-library/react": "^16.3.0",
    "@types/node": "^20.19.0",
    "@types/react": "^19.2.0",
    "@types/react-dom": "^19.2.0",
    "eslint": "^9.39.0",
    "eslint-config-next": "16.3.1",
    "jsdom": "^27.2.0",
    "tailwindcss": "^4.1.0",
    "typescript": "^5.9.0",
    "vitest": "^4.0.0"
  },
  "engines": {
    "node": ">=20"
  }
}
```

Create `tsconfig.json` with `strict: true`, `noEmit: true`, `resolveJsonModule: true`, `moduleResolution: "bundler"`, Next.js plugins, and the `@/*` alias. Create the standard generated `next-env.d.ts` references. Configure `postcss.config.mjs` with `@tailwindcss/postcss`.

Create `vitest.config.ts`:

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);
```

Use `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` in the flat ESLint config. In `next.config.ts`, enable `typedRoutes: true` and define the legacy redirects in Task 3 rather than adding empty redirect behavior here.

Append these paths to `.gitignore`:

```gitignore
apps/web/.next/
apps/web/node_modules/
apps/web/coverage/
apps/web/src/generated/
```

- [ ] **Step 4: Install and lock dependencies**

Run: `npm install --prefix apps/web`

Expected: `apps/web/package-lock.json` is created, the direct versions above remain unchanged, and npm reports no unresolved peer dependency.

- [ ] **Step 5: Run the package-contract test through the real runner**

Run: `npm --prefix apps/web test -- src/lib/foundation.test.ts`

Expected: PASS, 1 test.

- [ ] **Step 6: Run static tool smoke checks**

Run: `npm --prefix apps/web run typecheck && npm --prefix apps/web run lint`

Expected: PASS with zero TypeScript errors and zero ESLint warnings.

- [ ] **Step 7: Commit the package foundation**

```bash
git add .gitignore apps/web
git commit -m "feat(web): create isolated Next.js package"
```

---

### Task 2: Synchronize and expose the canonical catalog

**Files:**
- Create: `apps/web/scripts/sync-catalog.mjs`
- Create: `apps/web/src/lib/catalog.ts`
- Create: `apps/web/src/lib/catalog.test.ts`
- Create: `apps/web/src/lib/locales.ts`
- Modify: `apps/web/src/lib/foundation.test.ts`

**Interfaces:**
- Consumes: root `catalog/generated/catalog.json`, root `VERSION`, and `node ../../scripts/validate-catalog.mjs`.
- Produces: `syncCatalog({ repoRoot, webRoot }): { source: string; destination: string; bytes: number }`, `getCatalog(): Catalog`, `getCatalogCounts(): Catalog["counts"]`, and `getSupportedLocales(): readonly Locale[]`.

- [ ] **Step 1: Write failing catalog synchronization tests**

Create `apps/web/src/lib/catalog.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { getCatalog, getCatalogCounts, getSupportedLocales } from "./catalog";

describe("catalog adapter", () => {
  it("exposes the complete committed catalog without redefining facts", () => {
    const catalog = getCatalog();
    const source = JSON.parse(
      readFileSync(resolve(process.cwd(), "../../catalog/generated/catalog.json"), "utf8"),
    );

    expect(catalog.sourceDigest).toBe(source.sourceDigest);
    expect(catalog.skills).toHaveLength(18);
    expect(catalog.packs).toHaveLength(6);
    expect(getCatalogCounts()).toEqual(source.counts);
    expect(getSupportedLocales()).toEqual(["en", "pt-BR"]);
  });

  it("returns one frozen catalog instance", () => {
    expect(getCatalog()).toBe(getCatalog());
    expect(Object.isFrozen(getCatalog())).toBe(true);
  });
});
```

- [ ] **Step 2: Run the focused test to verify RED**

Run: `npm --prefix apps/web test -- src/lib/catalog.test.ts`

Expected: FAIL because `./catalog` and the generated application copy do not exist.

- [ ] **Step 3: Implement deterministic sync with root validation**

Create `apps/web/scripts/sync-catalog.mjs` with an exported function and a direct CLI entry. It must:

1. resolve the repository root as exactly `../..` from `apps/web`;
2. spawn Node with `scripts/validate-catalog.mjs` and `scripts/generate-catalog.mjs --check` from the root;
3. fail before writing when either command is nonzero;
4. parse the source JSON and assert `version === readFileSync(VERSION).trim()`;
5. assert locales equal `['en', 'pt-BR']`, 18 skills exist, and six packs exist;
6. create `apps/web/src/generated`;
7. write the source bytes unchanged to a temporary sibling file;
8. atomically rename the temporary file to `catalog.json`;
9. export and print the source, destination, and byte count.

Use this function signature:

```js
export function syncCatalog({ repoRoot, webRoot, runValidation = true } = {}) {
  // Return { source, destination, bytes } after atomic replacement.
}
```

Do not serialize the parsed object again; byte-for-byte copying preserves the deterministic source artifact.

- [ ] **Step 4: Implement the server-only typed adapter**

Create `apps/web/src/lib/catalog.ts`. Start with `import "server-only"`, import the generated JSON, define exact readonly types for fields consumed by the foundation, and freeze the top-level projection.

```ts
import "server-only";
import generatedCatalog from "@/generated/catalog.json";
import type { Locale } from "./locales";

export interface Catalog {
  readonly schemaVersion: string;
  readonly version: string;
  readonly defaultLocale: Locale;
  readonly locales: readonly Locale[];
  readonly sourceDigest: string;
  readonly counts: Readonly<Record<string, unknown>>;
  readonly skills: readonly Readonly<Record<string, unknown>>[];
  readonly packs: readonly Readonly<Record<string, unknown>>[];
}

const catalog = Object.freeze(generatedCatalog) as Catalog;

export function getCatalog(): Catalog {
  return catalog;
}

export function getCatalogCounts(): Catalog["counts"] {
  return catalog.counts;
}

export function getSupportedLocales(): readonly Locale[] {
  return catalog.locales;
}
```

Create the isomorphic `locales.ts` contract used by both server and client
code:

```ts
export const locales = ["en", "pt-BR"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
```

Do not import `catalog.ts` from client-reachable locale or component modules.

Keep this task's public adapter intentionally narrow. The Catalog Experience PR expands skill and pack record types when it starts consuming those fields.

- [ ] **Step 5: Generate the application copy and run the focused tests**

Run:

```bash
node apps/web/scripts/sync-catalog.mjs
npm --prefix apps/web test -- src/lib/catalog.test.ts
```

Expected: validation passes, 18 skills and six packs are synchronized, then both adapter tests pass.

- [ ] **Step 6: Prove stale or invalid root data fails before replacement**

Extend `foundation.test.ts` to create a temporary repository fixture with an invalid locale list, call `syncCatalog({ repoRoot, webRoot, runValidation: false })`, and assert that it throws before changing an existing destination file. Export the function without running CLI behavior when imported.

Run: `npm --prefix apps/web test -- src/lib/foundation.test.ts src/lib/catalog.test.ts`

Expected: PASS, including preservation of the prior generated copy.

- [ ] **Step 7: Commit the catalog boundary**

```bash
git add apps/web/scripts apps/web/src/lib
git commit -m "feat(web): consume the validated catalog"
```

---

### Task 3: Add canonical locale routing and redirects

**Files:**
- Create: `apps/web/src/lib/i18n.ts`
- Create: `apps/web/src/lib/i18n.test.ts`
- Create: `apps/web/src/lib/messages.ts`
- Create: `apps/web/src/components/locale-redirect.tsx`
- Create: `apps/web/src/components/locale-switcher.tsx`
- Create: `apps/web/src/app/(redirect)/layout.tsx`
- Create: `apps/web/src/app/(redirect)/page.tsx`
- Create: `apps/web/src/app/[locale]/layout.tsx`
- Modify: `apps/web/next.config.ts`

**Interfaces:**
- Consumes: `Locale` and `locales` from the isomorphic `@/lib/locales` contract.
- Produces: `isLocale(value): value is Locale`, `localizePath(pathname, locale): string`, `getAlternateLocale(locale): Locale`, `messages: Record<Locale, Messages>`, and static params for both locales.

- [ ] **Step 1: Write failing locale helper tests**

Create `apps/web/src/lib/i18n.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getAlternateLocale, isLocale, localizePath } from "./i18n";

describe("locale routing", () => {
  it("accepts only canonical locale identifiers", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("pt-BR")).toBe(true);
    expect(isLocale("pt-br")).toBe(false);
    expect(isLocale("fr")).toBe(false);
  });

  it("preserves the content path while switching locales", () => {
    expect(localizePath("/en/skills/designing-ui-systems", "pt-BR")).toBe(
      "/pt-BR/skills/designing-ui-systems",
    );
    expect(localizePath("/pt-BR", "en")).toBe("/en");
    expect(getAlternateLocale("en")).toBe("pt-BR");
  });
});
```

- [ ] **Step 2: Run the helper test to verify RED**

Run: `npm --prefix apps/web test -- src/lib/i18n.test.ts`

Expected: FAIL because `./i18n` does not exist.

- [ ] **Step 3: Implement locale helpers and typed foundation messages**

Implement `i18n.ts` using segment parsing, not string replacement, so a slug containing `en` is never changed accidentally.

```ts
import { locales, type Locale } from "./locales";

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === "en" ? "pt-BR" : "en";
}

export function localizePath(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] && isLocale(segments[0])) segments.shift();
  return `/${[locale, ...segments].join("/")}`;
}
```

Create `messages.ts` with a `Messages` interface and complete `en` and `pt-BR` values for skip link, brand label, navigation, hero eyebrow/title/summary/actions, catalog counts, locale control, theme control, and footer. Type it with `satisfies Record<Locale, Messages>` so missing translations fail TypeScript.

- [ ] **Step 4: Implement the static root redirect experience**

`app/(redirect)/page.tsx` renders a minimal document-region message, an `/en` link, and `LocaleRedirect`. `LocaleRedirect` is a small Client Component that:

1. reads `agent-skills-locale` from local storage;
2. otherwise checks whether `navigator.languages` contains a Portuguese locale;
3. calls `location.replace('/pt-BR')` for Portuguese and `/en` otherwise;
4. renders no interactive UI.

The server-rendered `/en` link is the no-JavaScript and client-error fallback.
`app/(redirect)/layout.tsx` is a minimal independent root layout with
`<html lang="en">` and `<body>` solely for `/`; it does not own the localized
site shell.

- [ ] **Step 5: Add static locale validation and parameters**

In `[locale]/layout.tsx`, export:

```ts
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "pt-BR" }];
}
```

Await `params`, call `notFound()` when `isLocale(locale)` is false, and pass the canonical `Locale` to the localized shell added in Task 5.

- [ ] **Step 6: Add permanent legacy redirects**

In `next.config.ts`, implement `redirects()` with permanent redirects for:

- `/skills/:path*` → `/en/skills/:path*`;
- `/packs/:path*` → `/en/packs/:path*`;
- `/getting-started`, `/built-with-skills`, `/roadmap`, `/about`, `/contribute`, and `/changelog` → their `/en` equivalents;
- `/pt-br/:path*` → `/pt-BR/:path*`.

Keep `/` out of `redirects()` so first-visit client locale selection remains available.

- [ ] **Step 7: Test helpers and configuration**

Add a test that imports `next.config.ts`, resolves `redirects()`, and asserts the `/pt-br/:path*` and `/skills/:path*` rules are permanent and exact.

Run: `npm --prefix apps/web test -- src/lib/i18n.test.ts`

Expected: PASS for locale validation, route preservation, alternate locale, and redirects.

- [ ] **Step 8: Commit localization infrastructure**

```bash
git add apps/web/next.config.ts apps/web/src/app apps/web/src/components/locale-redirect.tsx apps/web/src/components/locale-switcher.tsx apps/web/src/lib/i18n.ts apps/web/src/lib/i18n.test.ts apps/web/src/lib/messages.ts
git commit -m "feat(web): add canonical bilingual routing"
```

---

### Task 4: Establish dark-first themes and semantic design tokens

**Files:**
- Create: `apps/web/src/app/globals.css`
- Create: `apps/web/src/components/theme-provider.tsx`
- Create: `apps/web/src/components/theme-switcher.tsx`
- Create: `apps/web/src/components/theme-switcher.test.tsx`
- Create: `apps/web/src/lib/test-utils.tsx`
- Modify: `apps/web/src/app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: `next-themes`, localized theme labels from `messages`, and the `Locale` type.
- Produces: `ThemeProvider`, `ThemeSwitcher({ locale })`, semantic CSS tokens, and root metadata defaults.

- [ ] **Step 1: Write failing theme control tests**

Create `theme-switcher.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import { describe, expect, it } from "vitest";
import { ThemeSwitcher } from "./theme-switcher";

describe("ThemeSwitcher", () => {
  it("offers system, light, and dark choices with an accessible name", () => {
    render(
      <ThemeProvider attribute="class">
        <ThemeSwitcher locale="en" />
      </ThemeProvider>,
    );

    const control = screen.getByRole("combobox", { name: "Theme" });
    expect(control).toHaveValue("system");
    expect(screen.getByRole("option", { name: "Light" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Dark" })).toBeInTheDocument();
    fireEvent.change(control, { target: { value: "dark" } });
    expect(control).toHaveValue("dark");
  });
});
```

- [ ] **Step 2: Run the component test to verify RED**

Run: `npm --prefix apps/web test -- src/components/theme-switcher.test.tsx`

Expected: FAIL because `ThemeSwitcher` does not exist.

- [ ] **Step 3: Implement theme provider and control**

Create a Client Component wrapper around `next-themes`:

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props} />;
}
```

Implement `ThemeSwitcher` as a native labeled `select` with exact values `system`, `light`, and `dark`. Use `useTheme()`, wait until mounted before binding the stored theme, and localize the accessible name and option labels through `messages[locale]`. Do not use icon-only state in the foundation.

- [ ] **Step 4: Define semantic theme tokens**

In `globals.css`, import Tailwind and define semantic custom properties for canvas, surface, elevated surface, text, muted text, border, brand, brand contrast, focus, success, warning, and danger. Provide complete `:root` light values and `.dark` values. Add:

- `color-scheme` matching the active theme;
- a visible `:focus-visible` outline using `--focus`;
- base body typography and background;
- a `.skip-link` that appears on focus;
- transitions only inside `@media (prefers-reduced-motion: no-preference)`;
- no continuous animation.

Use semantic tokens from components; do not introduce hard-coded light-only or dark-only colors in TSX.

- [ ] **Step 5: Implement the root layout**

The localized `app/[locale]/layout.tsx` must:

- import `globals.css`;
- render `<html lang={locale} suppressHydrationWarning>` and `<body>` as the localized root document;
- wrap children with `<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>`;
- export baseline metadata with title template `%s | Agent Skills Studio`;
- set `metadataBase` from `NEXT_PUBLIC_SITE_URL`, falling back to `https://skills.jhonatanoliveira.com`.

Do not create `app/layout.tsx`: the `(redirect)` and `[locale]` branches use
independent root layouts so their server-rendered `lang` values are correct.
Do not mutate `document.documentElement.lang` in an effect.

- [ ] **Step 6: Run theme, type, and lint gates**

Run:

```bash
npm --prefix apps/web test -- src/components/theme-switcher.test.tsx
npm --prefix apps/web run typecheck
npm --prefix apps/web run lint
```

Expected: all commands pass with no accessibility query failures, type errors, or warnings.

- [ ] **Step 7: Commit the design foundation**

```bash
git add apps/web/src/app/globals.css apps/web/src/app/[locale]/layout.tsx apps/web/src/components/theme-provider.tsx apps/web/src/components/theme-switcher.tsx apps/web/src/components/theme-switcher.test.tsx apps/web/src/lib/test-utils.tsx
git commit -m "feat(web): establish accessible theme tokens"
```

---

### Task 5: Build the localized public shell and foundation home

**Files:**
- Create: `apps/web/src/components/site-header.tsx`
- Create: `apps/web/src/components/site-footer.tsx`
- Create: `apps/web/src/components/site-shell.test.tsx`
- Create: `apps/web/src/app/[locale]/page.tsx`
- Modify: `apps/web/src/app/[locale]/layout.tsx`
- Modify: `apps/web/src/components/locale-switcher.tsx`
- Modify: `apps/web/src/lib/messages.ts`

**Interfaces:**
- Consumes: `getCatalog()`, `messages`, `Locale`, `localizePath()`, `ThemeSwitcher`, and App Router pathname/navigation.
- Produces: a navigable bilingual shell, localized home metadata, a catalog-backed hero summary, and global header/footer contracts for subsequent PRs.

- [ ] **Step 1: Write failing shell tests in both locales**

Create `site-shell.test.tsx` and mock `next/navigation` pathname as needed:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "./site-header";

describe("SiteHeader", () => {
  it.each([
    ["en", "Explore skills", "/en/skills"],
    ["pt-BR", "Explorar skills", "/pt-BR/skills"],
  ] as const)("renders localized primary navigation for %s", (locale, label, href) => {
    render(<SiteHeader locale={locale} />);
    expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", href);
    expect(screen.getByRole("link", { name: /Agent Skills Studio/i })).toHaveAttribute(
      "href",
      `/${locale}`,
    );
  });
});
```

Add assertions that the language switch keeps `/skills/example`, the theme control has a localized accessible name, and header links are unique.

- [ ] **Step 2: Run the shell test to verify RED**

Run: `npm --prefix apps/web test -- src/components/site-shell.test.tsx`

Expected: FAIL because `SiteHeader` and `SiteFooter` do not exist.

- [ ] **Step 3: Implement the locale-preserving switcher**

`LocaleSwitcher` is a Client Component. Read `usePathname()`, derive the alternate locale with `getAlternateLocale()`, derive the target with `localizePath()`, and render a normal link. On activation, persist `agent-skills-locale` before navigation. Use visible `EN`/`PT-BR` text plus the localized accessible label; do not use flags as language identifiers.

- [ ] **Step 4: Implement the global header and footer**

`SiteHeader({ locale })` renders:

- skip-link target support;
- brand link;
- localized links to skills, packs, roadmap, and about;
- locale and theme controls;
- a semantic `nav` label.

`SiteFooter({ locale })` renders project summary, GitHub source link, contribute link, current catalog version, and locale-equivalent navigation. External links identify their destination in accessible text and use safe `rel` values when opening a new tab.

- [ ] **Step 5: Implement the localized foundation home**

`[locale]/page.tsx` is a Server Component. It reads the catalog adapter and renders:

- localized eyebrow, title, and summary;
- primary `/skills` and secondary `/packs` links;
- exact counts for 18 skills, six packs, and two locales from the catalog;
- a concise choose → install → invoke explanation;
- a foundation status note that does not claim search or detail pages already exist.

Export `generateMetadata({ params })` with localized title, description, canonical URL, and alternates for `en`, `pt-BR`, and `x-default`.

- [ ] **Step 6: Complete the localized layout**

`[locale]/layout.tsx` validates the locale and owns the localized root
document. Inside its themed `<body>`, it renders:

```tsx
<>
  <SiteHeader locale={locale} />
  <main id="main-content">{children}</main>
  <SiteFooter locale={locale} />
</>
```

Include a localized skip link before the header. Ensure static params contain exactly two routes.

- [ ] **Step 7: Run component and production build gates**

Run:

```bash
npm --prefix apps/web test -- src/components/site-shell.test.tsx
npm --prefix apps/web run typecheck
npm --prefix apps/web run lint
npm --prefix apps/web run build
```

Expected: all commands pass; the build reports generated `/`, `/en`, and `/pt-BR` pages and no unexpected dynamic route.

- [ ] **Step 8: Inspect generated route evidence**

Run: `find apps/web/.next/server/app -maxdepth 3 -type f | sort | rg '/(en|pt-BR)(/|\.)'`

Expected: output contains artifacts for both canonical locale home pages. Confirm no canonical `/pt-br` artifact is generated.

- [ ] **Step 9: Commit the public shell**

```bash
git add apps/web/src/app apps/web/src/components apps/web/src/lib/messages.ts
git commit -m "feat(web): render the bilingual foundation shell"
```

---

### Task 6: Integrate repository gates, CI, and Vercel handoff

**Files:**
- Create: `apps/web/vercel.json`
- Modify: `package.json`
- Modify: `.github/workflows/validate.yml`
- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Test: `scripts/web-foundation.test.mjs`

**Interfaces:**
- Consumes: every `apps/web` gate and the existing Linux/Windows validation matrix.
- Produces: root `web:test`, `web:typecheck`, `web:lint`, and `web:build` commands; reproducible CI installation; documented Vercel Root Directory and branch policy.

- [ ] **Step 1: Write the failing repository integration test**

Create `scripts/web-foundation.test.mjs`:

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('repository exposes complete web gates and Vercel policy', () => {
  const root = JSON.parse(readFileSync('package.json', 'utf8'));
  const workflow = readFileSync('.github/workflows/validate.yml', 'utf8');
  const readme = readFileSync('README.md', 'utf8');

  for (const script of ['web:test', 'web:typecheck', 'web:lint', 'web:build']) {
    assert.ok(root.scripts[script], `missing ${script}`);
  }
  assert.match(workflow, /npm ci --prefix apps\/web/);
  assert.match(workflow, /npm run web:build/);
  assert.match(readme, /Root Directory.*apps\/web/i);
  assert.match(readme, /dev.*pre-production/i);
  assert.match(readme, /main.*production/i);
});
```

- [ ] **Step 2: Run the integration test to verify RED**

Run: `node --test scripts/web-foundation.test.mjs`

Expected: FAIL because root web commands and CI installation are absent.

- [ ] **Step 3: Add root orchestration commands**

Add these scripts to the root `package.json`:

```json
"web:test": "npm --prefix apps/web test",
"web:typecheck": "npm --prefix apps/web run typecheck",
"web:lint": "npm --prefix apps/web run lint",
"web:build": "npm --prefix apps/web run build"
```

Do not add npm workspaces or move collection dependencies into the web package.

- [ ] **Step 4: Extend the existing CI matrix**

In `.github/workflows/validate.yml`, after the existing Node setup:

1. keep the current root validation and tests unchanged;
2. run `npm ci --prefix apps/web`;
3. run `npm run web:test`;
4. run `npm run web:typecheck`;
5. run `npm run web:lint`;
6. run `npm run web:build`;
7. set `NEXT_PUBLIC_SITE_URL=https://skills.jhonatanoliveira.com` for the build step.

Run the web gates on both Ubuntu and Windows. Use shell-neutral npm commands and do not add Bash-only path assertions to the Windows job.

- [ ] **Step 5: Add Vercel configuration and documentation**

Create `apps/web/vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs"
}
```

Document in `README.md`:

- `npm install --prefix apps/web`;
- `npm --prefix apps/web run dev`;
- root validation and web gate commands;
- required Vercel Root Directory `apps/web`;
- `dev` as pre-production and `main` as production;
- `NEXT_PUBLIC_SITE_URL` values for Preview and production;
- the canonical domain and fallback URL;
- the requirement to enable Vercel access to repository files above the Root Directory so `prebuild` can validate and sync `../../catalog/generated/catalog.json`.

Add a readable `CHANGELOG.md` entry for the microsite foundation without claiming the full catalog experience is shipped.

- [ ] **Step 6: Run focused and complete repository tests**

Run:

```bash
node --test scripts/web-foundation.test.mjs
node --test scripts/*.test.mjs scripts/lib/*.test.mjs
node scripts/validate-skills.mjs
node scripts/validate-catalog.mjs
node scripts/generate-catalog.mjs --check
node scripts/validate-plugin.mjs
```

Expected: the integration test passes, the complete root suite passes with one additional test, 18 skills and six packs validate, the generated catalog is current, and plugin validation passes.

- [ ] **Step 7: Run the complete web gate**

Run:

```bash
npm run web:test
npm run web:typecheck
npm run web:lint
NEXT_PUBLIC_SITE_URL=https://skills.jhonatanoliveira.com npm run web:build
```

Expected: all web tests pass, lint and typecheck report zero errors, and the production build emits `/`, `/en`, and `/pt-BR` as static pages.

- [ ] **Step 8: Verify the dependency and change surface**

Run:

```bash
npm audit --prefix apps/web --omit=dev
git diff --check origin/main...HEAD
git status --short
```

Expected: no known production vulnerability, no whitespace errors, and only intentional foundation files are modified.

- [ ] **Step 9: Commit CI and deployment integration**

```bash
git add package.json .github/workflows/validate.yml README.md CHANGELOG.md scripts/web-foundation.test.mjs apps/web/vercel.json
git commit -m "ci(web): validate the microsite foundation"
```

- [ ] **Step 10: Perform final branch verification before publication**

Run the root suite, all four web gates, catalog/plugin validators, and `git diff --check` again from a clean process. Record exact test counts and the production-build route table in the persistent execution ledger. Then request independent code review against this plan and the microsite specification before pushing or opening a draft PR to `dev`.

Expected: a clean worktree, complete fresh evidence, no unreviewed blocker, and a locally deployable foundation. Do not merge or promote to `main` as part of this task.

## PR Acceptance Checklist

- `apps/web` installs reproducibly from its committed lockfile.
- The application builds without a database, CMS, authentication, or runtime GitHub call.
- Root validation runs before the catalog is synchronized into the application.
- `/`, `/en`, and `/pt-BR` are served; canonical localized homes are static.
- `/pt-br/*` and former root-English content routes redirect permanently.
- Locale switching preserves the content path and persists the explicit choice.
- Dark, light, and system themes are keyboard accessible and persistent.
- Foundation copy is equivalent in English and PT-BR.
- The page displays catalog-derived counts rather than hard-coded collection facts.
- Root and web tests, typecheck, lint, production build, catalog checks, and plugin validation pass on Ubuntu and Windows.
- README documents Vercel Root Directory, external-root catalog access, branch policy, local commands, canonical domain, and fallback URL.
- A Vercel Preview is manually checked before the PR is considered ready for merge into `dev`.
