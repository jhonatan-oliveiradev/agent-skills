# Task 6 report — root integration, CI, Vercel, and documentation

## TDD — repository integration contract

- **RED:** created `scripts/web-foundation.test.mjs` before changing the root
  manifest, workflow, or documentation. `node --test
  scripts/web-foundation.test.mjs` failed as expected with `missing web:test`.
- **GREEN:** added the four root web commands, the web CI sequence, and the
  Vercel handoff documentation. The focused test then passed 1/1.
- **Refinement:** kept the root project as a normal Node project (no npm
  workspace), used `npm --prefix apps/web` commands only, and put the build
  environment variable in the workflow step rather than using shell-specific
  syntax.

## Delivered files

- `package.json` — root `web:test`, `web:typecheck`, `web:lint`, and
  `web:build` orchestration commands.
- `.github/workflows/validate.yml` — preserved root tests, validation, and
  platform-specific installer smoke tests; added reproducible `apps/web`
  installation plus all four web gates for the Ubuntu/Windows matrix.
- `apps/web/vercel.json` — Next.js framework declaration.
- `README.md` — local web commands, root gates, Vercel Root Directory,
  above-root catalog access, branch policy, Preview/production URL variables,
  canonical domain, and fallback deployment URL.
- `CHANGELOG.md` — microsite-foundation entry that explicitly defers the
  complete catalog browsing experience.
- `scripts/web-foundation.test.mjs` — root integration contract.

## Fresh verification evidence

- `npm ci --prefix apps/web` — installed from the committed lockfile (472
  packages).
- `node --test scripts/*.test.mjs scripts/lib/*.test.mjs` — **69/69** passed.
- `node scripts/validate-skills.mjs` — **18** skills validated.
- `node scripts/validate-catalog.mjs` — **18** catalog skills and **6** packs
  validated.
- `node scripts/generate-catalog.mjs --check` — generated catalog current.
- `node scripts/validate-plugin.mjs` — plugin validation passed.
- `npm run web:test` — **5** test files, **24/24** tests passed.
- `npm run web:typecheck` — passed with zero output/errors.
- `npm run web:lint` — passed with zero lint warnings/errors.
- `NEXT_PUBLIC_SITE_URL=https://skills.jhonatanoliveira.com npm run web:build`
  — production build passed and generated **13** static pages.
- `npm audit --prefix apps/web --omit=dev` — **0** production vulnerabilities.
- `git diff --check HEAD^..HEAD` and `git show --check HEAD` — no whitespace
  errors introduced by this task commit.

## Production-build route evidence

The fresh build reported static `/` and `/_not-found`, plus SSG pages for:

- `/en`, `/pt-BR`;
- `/en|pt-BR/about`;
- `/en|pt-BR/packs`;
- `/en|pt-BR/roadmap`;
- `/en|pt-BR/skills`.

## Self-review

- Root validation remains ordered before web installation and web catalog sync.
- CI commands are npm and path-prefix based, so neither matrix job depends on
  Bash-only assertions.
- The Root Directory remains a Vercel project setting (`apps/web`); the README
  documents the required above-root file access needed by the existing
  `prebuild` catalog synchronization.
- `dev` is documented as pre-production and `main` as production. Preview
  deployments use their own deployment URL for `NEXT_PUBLIC_SITE_URL`, while
  production uses the canonical domain.
- No npm workspaces were introduced and no catalog dependencies were moved into
  `apps/web`.

## Concerns and out-of-scope items

- The first attempted `npm run web:test` was stopped by an environment approval
  cancellation before it began. The direct Node equivalent then passed; after
  the clean `npm ci`, all four actual npm wrapper gates passed as recorded
  above.
- npm emits an environment-level `Unknown env config "http-proxy"` warning and
  an ESLint deprecation warning during installation. Neither was introduced by
  this task; typecheck, lint, test, and build passed.
- `git diff --check origin/main...HEAD` still reports trailing whitespace in
  the pre-existing committed microsite specification from earlier branch
  history. It is outside this task's permitted files; the task commit itself
  passes `git diff --check HEAD^..HEAD`.
- No Vercel Preview, push, merge, or production promotion was performed. The
  configured cross-platform CI has not run remotely from this local task.
