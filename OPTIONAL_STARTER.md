# Optional Web Starter

This repository's reusable skills are stack-agnostic by default and do not require contributors to create applications with the repository owner's preferred setup.

The opinionated web starter is a separate opt-in tool. It runs only when someone explicitly invokes `create-web-app.sh`, `create-web-app.ps1`, or `npm run create:web-app --`.

Default starter baseline:

- current Next.js App Router;
- TypeScript;
- Tailwind CSS;
- ESLint;
- project-local `AGENTS.md`;
- Prettier with `prettier-plugin-tailwindcss`.

Optional feature packs are installed only when requested:

- `--shadcn`
- `--motion`
- `--gsap`
- `--forms`
- `--query`

Use `--dry-run` to inspect the scaffold command without creating a project.
