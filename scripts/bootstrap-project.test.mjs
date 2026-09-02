import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { bootstrapProject, detectTailwindStylesheet } from './bootstrap-project.mjs';

async function tempProject() {
  return mkdtemp(path.join(os.tmpdir(), 'agent-skills-bootstrap-'));
}

test('detects src/app Tailwind stylesheet before root app', async () => {
  const root = await tempProject();
  await writeFile(path.join(root, 'package.json'), '{}\n');
  await writeFile(path.join(root, 'app.css'), '@import "tailwindcss";\n');
  const srcApp = path.join(root, 'src', 'app');
  const { mkdir } = await import('node:fs/promises');
  await mkdir(srcApp, { recursive: true });
  await writeFile(path.join(srcApp, 'globals.css'), '@import "tailwindcss";\n');

  assert.equal(await detectTailwindStylesheet(root), './src/app/globals.css');
});

test('bootstraps AGENTS, Prettier config, and package scripts without overwriting existing files', async () => {
  const root = await tempProject();
  await writeFile(path.join(root, 'package.json'), JSON.stringify({ scripts: {} }, null, 2));
  const template = '# Project Agent Instructions\n';

  const first = await bootstrapProject(root, {
    agentsTemplate: template,
    installDependencies: false,
    installSkills: false,
  });

  assert.equal(first.created.includes('AGENTS.md'), true);
  assert.equal(first.created.includes('prettier.config.mjs'), true);
  assert.equal(await readFile(path.join(root, 'AGENTS.md'), 'utf8'), template);
  const prettier = await readFile(path.join(root, 'prettier.config.mjs'), 'utf8');
  assert.match(prettier, /prettier-plugin-tailwindcss/);
  const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  assert.equal(pkg.scripts.format, 'prettier --write .');
  assert.equal(pkg.scripts['format:check'], 'prettier --check .');

  await writeFile(path.join(root, 'AGENTS.md'), 'keep me\n');
  await writeFile(path.join(root, 'prettier.config.mjs'), 'keep prettier\n');
  const second = await bootstrapProject(root, {
    agentsTemplate: template,
    installDependencies: false,
    installSkills: false,
  });

  assert.equal(second.skipped.includes('AGENTS.md'), true);
  assert.equal(second.skipped.includes('prettier.config.mjs'), true);
  assert.equal(await readFile(path.join(root, 'AGENTS.md'), 'utf8'), 'keep me\n');
  assert.equal(await readFile(path.join(root, 'prettier.config.mjs'), 'utf8'), 'keep prettier\n');
});

test('installs all personal skills into the supplied destination', async () => {
  const root = await tempProject();
  const skillsDestination = await mkdtemp(path.join(os.tmpdir(), 'agent-skills-bootstrap-skills-'));

  const result = await bootstrapProject(root, {
    agentsTemplate: '# Project Agent Instructions\n',
    installDependencies: false,
    skillsDestination,
  });

  assert.equal(result.skillsInstalled, 39);
  assert.match(
    await readFile(path.join(skillsDestination, 'craft-premium-motion', 'SKILL.md'), 'utf8'),
    /name: craft-premium-motion/,
  );
});