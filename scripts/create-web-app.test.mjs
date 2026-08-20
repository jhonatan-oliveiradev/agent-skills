import assert from 'node:assert/strict';
import test from 'node:test';

import { buildScaffoldCommand, resolveFeaturePackages } from './create-web-app.mjs';

test('builds an npm create-next-app command with the opinionated baseline only when invoked', () => {
  const command = buildScaffoldCommand('demo-app', { packageManager: 'npm', srcDir: false });

  assert.equal(command.command, 'npx');
  assert.deepEqual(command.args, [
    'create-next-app@latest',
    'demo-app',
    '--typescript',
    '--tailwind',
    '--eslint',
    '--app',
    '--use-npm',
    '--import-alias',
    '@/*',
  ]);
});

test('supports pnpm and src/app without changing the reusable skills contract', () => {
  const command = buildScaffoldCommand('demo-app', { packageManager: 'pnpm', srcDir: true });

  assert.equal(command.command, 'pnpm');
  assert.deepEqual(command.args.slice(0, 3), ['dlx', 'create-next-app@latest', 'demo-app']);
  assert.equal(command.args.includes('--src-dir'), true);
  assert.equal(command.args.includes('--use-pnpm'), true);
});

test('feature packs install only explicitly requested optional libraries', () => {
  assert.deepEqual(resolveFeaturePackages({}), []);
  assert.deepEqual(resolveFeaturePackages({ shadcn: true, motion: true }), ['motion']);
  assert.deepEqual(resolveFeaturePackages({ forms: true, query: true, gsap: true }), [
    'react-hook-form',
    'zod',
    '@hookform/resolvers',
    '@tanstack/react-query',
    'gsap',
  ]);
});
