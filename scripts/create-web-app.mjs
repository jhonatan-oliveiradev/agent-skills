#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

import { bootstrapProject } from './bootstrap-project.mjs';

const managers = new Set(['npm', 'pnpm', 'yarn', 'bun']);

export function buildScaffoldCommand(target, options = {}) {
  const packageManager = options.packageManager ?? 'npm';
  if (!managers.has(packageManager)) throw new Error(`Unsupported package manager: ${packageManager}`);

  const common = [
    'create-next-app@latest',
    target,
    '--typescript',
    '--tailwind',
    '--eslint',
    '--app',
    `--use-${packageManager}`,
    '--import-alias',
    '@/*',
  ];
  if (options.srcDir) common.push('--src-dir');

  if (packageManager === 'npm') return { command: 'npx', args: common };
  if (packageManager === 'pnpm') return { command: 'pnpm', args: ['dlx', ...common] };
  if (packageManager === 'yarn') return { command: 'yarn', args: ['dlx', ...common] };
  return { command: 'bunx', args: common };
}

export function resolveFeaturePackages(options = {}) {
  const packages = [];
  if (options.motion) packages.push('motion');
  if (options.forms) packages.push('react-hook-form', 'zod', '@hookform/resolvers');
  if (options.query) packages.push('@tanstack/react-query');
  if (options.gsap) packages.push('gsap');
  return packages;
}

function installPackages(projectRoot, packageManager, packages) {
  if (!packages.length) return;
  const commands = {
    npm: ['npm', ['install', ...packages]],
    pnpm: ['pnpm', ['add', ...packages]],
    yarn: ['yarn', ['add', ...packages]],
    bun: ['bun', ['add', ...packages]],
  };
  const [command, args] = commands[packageManager];
  const run = spawnSync(command, args, { cwd: projectRoot, stdio: 'inherit', shell: process.platform === 'win32' });
  if (run.status !== 0) throw new Error(`Failed to install optional packages with ${packageManager}.`);
}

function initShadcn(projectRoot, packageManager) {
  const commands = {
    npm: ['npx', ['shadcn@latest', 'init', '-d']],
    pnpm: ['pnpm', ['dlx', 'shadcn@latest', 'init', '-d']],
    yarn: ['yarn', ['dlx', 'shadcn@latest', 'init', '-d']],
    bun: ['bunx', ['shadcn@latest', 'init', '-d']],
  };
  const [command, args] = commands[packageManager];
  const run = spawnSync(command, args, { cwd: projectRoot, stdio: 'inherit', shell: process.platform === 'win32' });
  if (run.status !== 0) throw new Error('Failed to initialize shadcn/ui.');
}

function runScaffold(command, cwd) {
  const run = spawnSync(command.command, command.args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
  if (run.status !== 0) throw new Error('create-next-app failed.');
}

function parseArgs(argv) {
  const options = {
    target: null,
    packageManager: 'npm',
    srcDir: false,
    shadcn: false,
    motion: false,
    forms: false,
    query: false,
    gsap: false,
    installSkills: true,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--package-manager' && argv[i + 1]) options.packageManager = argv[++i];
    else if (arg === '--src-dir') options.srcDir = true;
    else if (arg === '--shadcn') options.shadcn = true;
    else if (arg === '--motion') options.motion = true;
    else if (arg === '--forms') options.forms = true;
    else if (arg === '--query') options.query = true;
    else if (arg === '--gsap') options.gsap = true;
    else if (arg === '--skip-skills') options.installSkills = false;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (!arg.startsWith('-') && !options.target) options.target = arg;
    else throw new Error(`Unknown option: ${arg}`);
  }

  if (!options.target) throw new Error('Usage: create-web-app <project-name-or-path> [options]');
  if (!managers.has(options.packageManager)) throw new Error(`Unsupported package manager: ${options.packageManager}`);
  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const target = options.target;
  const parentDir = path.resolve(path.dirname(target));
  const projectName = path.basename(target);
  const projectRoot = path.resolve(target);
  const scaffold = buildScaffoldCommand(projectName, options);

  if (options.dryRun) {
    console.log([scaffold.command, ...scaffold.args].join(' '));
    const packages = resolveFeaturePackages(options);
    if (packages.length) console.log(`Optional packages: ${packages.join(', ')}`);
    if (options.shadcn) console.log('Optional setup: shadcn/ui');
    return;
  }

  runScaffold(scaffold, parentDir);
  await bootstrapProject(projectRoot, {
    installDependencies: true,
    installSkills: options.installSkills,
    packageManager: options.packageManager,
  });

  installPackages(projectRoot, options.packageManager, resolveFeaturePackages(options));
  if (options.shadcn) initShadcn(projectRoot, options.packageManager);

  console.log(`Created optional opinionated web starter at: ${projectRoot}`);
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
