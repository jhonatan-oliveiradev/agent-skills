import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { bootstrapProject, detectTailwindStylesheet } from './bootstrap-project.mjs';

async function tempProject() {
  const root = await mkdtemp(path.join(tmpdir(), 'agent-skills-bootstrap-'));
  await writeFile(
    path.join(root, 'package.json'),
    JSON.stringify({ name: 'demo', scripts: { dev: 'next dev' } }, null, 2) + '\n',
  );
  return root;
}

test('detects src/app Tailwind stylesheet before root app', async () => {
  const root = await tempProject();
  await mkdir(path.join(root, 'src/app'), { recursive: true });
  await mkdir(path.join(root, 'app'), { recursive: true });
  await writeFile(path.join(root, 'src/app/globals.css'), '@import "tailwindcss";\n');
  await writeFile(path.join(root, 'app/globals.css'), '@import "tailwindcss";\n');

  assert.equal(await detectTailwindStylesheet(root), './src/app/globals.css');
});

test('bootstraps AGENTS, Prettier config, and package scripts without overwriting existing files', async () => {
  const root = await tempProject();
  await mkdir(path.join(root, 'app'), { recursive: true });
  await writeFile(path.join(root, 'app/globals.css'), '@import "tailwindcss";\n');

  const template = '# Project Agent Instructions\n\nUse the reusable skills library.\n';
  const first = await bootstrapProject(root, {
    agentsTemplate: template,
    installDependencies: false,
    installSkills: false,
  });

  assert.equal(first.created.includes('AGENTS.md'), true);
  assert.equal(first.created.includes('prettier.config.mjs'), true);

  const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  assert.equal(packageJson.scripts.format, 'prettier --write .');
  assert.equal(packageJson.scripts['format:check'], 'prettier --check .');

  const prettier = await readFile(path.join(root, 'prettier.config.mjs'), 'utf8');
  assert.match(prettier, /tailwindStylesheet: "\.\/app\/globals\.css"/);
  assert.match(prettier, /tailwindFunctions: \["cn", "clsx", "cva"\]/);

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
  const skillsDestination = await mkdtemp(path.join(tmpdir(), 'agent-skills-bootstrap-skills-'));

  const result = await bootstrapProject(root, {
    agentsTemplate: '# Project Agent Instructions\n',
    installDependencies: false,
    skillsDestination,
  });

  assert.equal(result.skillsInstalled, 34);
  assert.match(
    await readFile(path.join(skillsDestination, 'craft-premium-motion', 'SKILL.md'), 'utf8'),
    /name: craft-premium-motion/,
  );
});
