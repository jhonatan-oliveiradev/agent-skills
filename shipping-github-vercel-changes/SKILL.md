---
name: shipping-github-vercel-changes
description: Use when completing repository work that should be committed, pushed, reviewed through a pull request, or promoted through development and production branches with Vercel deployment in mind.
---

# Shipping GitHub and Vercel Changes

## Default branch model
Respect the repository's actual policy. When it uses `dev` and `main`, feature/fix branches target `dev`; release promotion goes from `dev` to `main`.

## Workflow
1. Inspect current branch, remote, `git status`, and existing PRs before writing.
2. Never mix unrelated dirty work into the task.
3. Create a descriptive branch for feature/fix work when currently on the default branch.
4. Commit narrowly with messages that describe the delivered behavior.
5. Run relevant gates before claiming readiness: diff check, lint, typecheck, tests, production build.
6. Inspect runtime/UI when the change is visual or interactive.
7. Reuse an existing matching PR rather than opening duplicates.
8. Include summary, verification performed, screenshots when useful, known limitations, and migration/env implications in the PR.
9. Do not merge unless the user or repository workflow authorizes it.
10. After merge, verify deployment status and runtime configuration when the task includes release delivery.

## Vercel specifics
- Distinguish Preview from Production configuration.
- Ensure required environment variables exist in the correct environments.
- Never paste secrets into source or PR body.
- Treat successful deployment as necessary but not sufficient; verify the deployed route when release correctness matters.
