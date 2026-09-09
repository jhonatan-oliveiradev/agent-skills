# Career Lab Shell Separation Design

## Context

Career Lab has evolved into a local-first product workspace with its own navigation, content hierarchy, and visual language. It currently renders inside the localized Agent Skills Studio layout, which unconditionally adds the Studio `SiteHeader` and `SiteFooter`. The result is a mixed interface: product chrome nested inside institutional chrome.

## Goal

Make Career Lab a first-class product surface inside the Agent Skills Studio ecosystem without inheriting the Studio institutional header/footer, while preserving every public URL and all Career Profile behavior.

## Approved architecture

Use Next.js App Router route groups under `app/[locale]`:

- `(studio)` owns the institutional `SiteHeader`, page `<main>`, `SiteFooter`, and Studio-only editorial CSS.
- `(career)` owns Career Lab routes structurally and does not inherit Studio chrome.
- `[locale]/layout.tsx` becomes shared infrastructure only: locale validation, HTML/body, ThemeProvider, NuqsAdapter, global CSS, and the shared skip-link.
- Existing `career-lab/layout.tsx` remains the Career Profile/provider boundary and `CareerLabShell` remains the product chrome.

Route groups must not change URLs. `/pt-BR/career-lab`, `/pt-BR/skills`, and all existing localized paths remain canonical.

## Product shell

Career Lab keeps its current product rail, internal navigation, masthead, and data controls. `CareerLabShell` becomes the semantic main content target (`id="main-content"`) and gains a restrained product footer/utility closing line that links back to the Developer Career Pack and Agent Skills Studio. It must not render the institutional SiteFooter.

## Constraints

- No public URL changes.
- No Career Profile schema or storage changes.
- No competency, readiness, roadmap, assessment, evidence, learning, or market engine changes.
- No dependency/version changes.
- Preserve EN/PT-BR behavior.
- Preserve global theme support and NuqsAdapter.
- Preserve the Studio header/footer for all non-Career-Lab localized routes.
- Preserve accessibility: one primary `main` landmark per rendered surface and a working skip-link target.

## Verification

Regression coverage must prove:

1. the localized root and institutional routes still render through Studio chrome;
2. Career Lab routes are structurally outside the Studio route group and do not inherit `SiteHeader`/`SiteFooter`;
3. Career Lab still exposes `main#main-content` through its own shell;
4. canonical Career Lab and Studio URLs remain unchanged;
5. existing Career Lab functional tests stay green;
6. full root tests, catalog validation, web tests, typecheck, lint, build, and platform installer smokes pass.
