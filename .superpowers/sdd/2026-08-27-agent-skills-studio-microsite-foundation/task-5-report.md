# Task 5 report — bilingual public shell and foundation home

## TDD

- **RED:** added site-shell.test.tsx before production components. The focused
  command failed while resolving the intentionally absent ./site-footer
  module, which was the expected missing-feature failure.
- **GREEN:** implemented the bilingual header, footer, locale switcher, root
  layout shell, catalog-backed home, localized metadata, and four minimal
  localized foundation destinations. The focused suite then passed 15/15
  tests.
- **Refinement:** the first focused GREEN run exposed an ambiguous test query
  because both the eyebrow and status note contained “foundation route”; the
  assertion was narrowed to the visible eyebrow rather than weakening
  coverage. The catalog summary was then refactored from an incomplete
  description list to a semantic unordered list while the focused suite
  remained green.
- **Integration RED/GREEN:** ESLint began recognizing the existing root
  fallback anchor as an internal link once /en existed. Replacing that one
  anchor with next/link cleared the framework gate without changing redirect
  behavior.

## Delivered files

- apps/web/src/components/locale-switcher.tsx — normal locale-equivalent
  link, current-path preservation, visible EN/PT-BR, localized accessible
  name, and persisted agent-skills-locale selection.
- apps/web/src/components/site-header.tsx — localized brand, primary
  navigation, locale control, and theme control without nested interactive
  elements.
- apps/web/src/components/site-footer.tsx — localized summary and navigation,
  safe external GitHub/contribution links, and catalog-derived version.
- apps/web/src/components/foundation-route.tsx — shared localized temporary
  route content and canonical/hreflang metadata helpers.
- apps/web/src/components/site-shell.test.tsx — 15 behavior tests covering
  both locales, path-preserving language selection, accessibility contracts,
  home content/metadata, and all four navigation destinations.
- apps/web/src/app/[locale]/page.tsx — localized Server Component home with
  skill, pack, and locale counts derived from catalog arrays; primary and
  secondary calls to action; and choose → install → invoke guidance.
- apps/web/src/app/[locale]/{skills,packs,roadmap,about}/page.tsx — minimal
  localized static foundations that explicitly avoid claiming full catalog
  functionality.
- apps/web/src/app/[locale]/layout.tsx — localized skip link plus shared
  header, main#main-content, and footer inside the theme provider.
- apps/web/src/lib/messages.ts — typed EN/PT-BR shell, home, metadata,
  process, footer, and temporary-route copy.
- apps/web/src/app/globals.css — responsive shell/home presentation using the
  existing semantic color tokens.
- apps/web/src/app/(redirect)/page.tsx — framework-compliant internal
  fallback link required by the lint gate once /en became a real page.

## Fresh gates

All passed on 2026-08-27:

- npm --prefix apps/web test — 5 files, 24 tests.
- npm --prefix apps/web run typecheck.
- npm --prefix apps/web run lint.
- npm --prefix apps/web run build — 13 static pages generated.
- git diff --check.

## Build route evidence

The production build reported SSG output for:

- /en and /pt-BR;
- /en|pt-BR/skills;
- /en|pt-BR/packs;
- /en|pt-BR/roadmap;
- /en|pt-BR/about.

find apps/web/.next/server/app -maxdepth 3 -type f -name '*.html' confirmed
all ten localized HTML artifacts. A separate case-sensitive search confirmed
there is no canonical /pt-br artifact. Inspection of en.html and
pt-BR.html confirmed absolute canonical links plus hreflang alternates for
en, pt-BR, and x-default.

## Self-review

- Production counts are catalog.skills.length, catalog.packs.length, and
  catalog.locales.length; no 18, 6, or 2 is hardcoded in TSX.
- EN and PT-BR share the same typed message and component paths, including
  equivalent header/footer routes and equivalent metadata alternates.
- The locale switch remains a standard link and persists the alternate locale
  only on activation; tests prove /skills/example is retained in both
  directions.
- The skip link precedes the header and targets the shared main landmark.
- Header links are unique, and tests reject nested link/button/select
  structures.
- All TSX presentation colors come from CSS classes; CSS consumes existing
  semantic tokens.
- Temporary route copy labels the pages as foundation content and explicitly
  defers full features instead of implying search or detail pages exist.
- External links name GitHub as their destination and use target="_blank"
  with rel="noreferrer noopener".

## Concerns

- The four foundation route bodies are intentionally temporary and should be
  replaced by their dedicated follow-up PRs.
- npm emits an environment-level deprecation warning for the http-proxy
  config on every command. It does not affect test, typecheck, lint, or build
  results and was not introduced by this task.
