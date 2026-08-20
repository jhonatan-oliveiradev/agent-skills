#!/usr/bin/env node

import { access, cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const defaultAgentsTemplatePath = path.join(repoRoot, 'templates', 'AGENTS.project.md');

async function exists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function detectTailwindStylesheet(projectRoot) {
  const candidates = ['./src/app/globals.css', './app/globals.css', './src/styles/globals.css', './styles/globals.css'];
  for (const candidate of candidates) {
    if (await exists(path.join(projectRoot, candidate.slice(2)))) return candidate;
  }
  return null;
}

function prettierConfig(stylesheet) {
  const stylesheetLine = stylesheet ? `\n  tailwindStylesheet: ${JSON.stringify(stylesheet)},` : '';
  return `/** @type {import("prettier").Config & import("prettier-plugin-tailwindcss").PluginOptions} */\nconst config = {\n  plugins: ["prettier-plugin-tailwindcss"],${stylesheetLine}\n  tailwindFunctions: ["cn", "clsx", "cva"],\n  printWidth: 100,\n  semi: true,\n  singleQuote: false,\n  tabWidth: 2,\n  trailingComma: "all",\n};\n\nexport default config;\n`;
}

async function writeUnlessExists(filePath, content, force, result) {
  const rel = path.basename(filePath);
  if ((await exists(filePath)) && !force) {
    result.skipped.push(rel);
    return;
  }
  await writeFile(filePath, content);
  result.created.push(rel);
}

async function updatePackageJson(projectRoot) {
  const packagePath = path.join(projectRoot, 'package.json');
  if (!(await exists(packagePath))) return false;
  const pkg = JSON.parse(await readFile(packagePath, 'utf8'));
  pkg.scripts ??= {};
  pkg.scripts.format ??= 'prettier --write .';
  pkg.scripts['format:check'] ??= 'prettier --check .';
  await writeFile(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
  return true;
}

async function detectPackageManager(projectRoot) {
  const locks = [
    ['pnpm-lock.yaml', 'pnpm'],
    ['yarn.lock', 'yarn'],
    ['bun.lockb', 'bun'],
    ['bun.lock', 'bun'],
    ['package-lock.json', 'npm'],
  ];
  for (const [lock, manager] of locks) {
    if (await exists(path.join(projectRoot, lock))) return manager;
  }
  return 'npm';
}

function installPrettier(projectRoot, manager) {
  const commands = {
    npm: ['npm', ['install', '-D', 'prettier', 'prettier-plugin-tailwindcss']],
    pnpm: ['pnpm', ['add', '-D', 'prettier', 'prettier-plugin-tailwindcss']],
    yarn: ['yarn', ['add', '-D', 'prettier', 'prettier-plugin-tailwindcss']],
    bun: ['bun', ['add', '-d', 'prettier', 'prettier-plugin-tailwindcss']],
  };
  const [command, args] = commands[manager] ?? commands.npm;
  const run = spawnSync(command, args, { cwd: projectRoot, stdio: 'inherit', shell: process.platform === 'win32' });
  if (run.status !== 0) throw new Error(`Failed to install Prettier dependencies with ${manager}.`);
}

async function installPersonalSkills(destination = path.join(homedir(), '.agents', 'skills')) {
  await mkdir(destination, { recursive: true });
  const entries = await readdir(repoRoot, { withFileTypes: true });
  const installed = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const sourceSkill = path.join(repoRoot, entry.name, 'SKILL.md');
    if (!(await exists(sourceSkill))) continue;
    const targetDir = path.join(destination, entry.name);
    await cp(path.join(repoRoot, entry.name), targetDir, { recursive: true, force: true });
    installed.push(entry.name);
  }
  return installed;
}

export async function bootstrapProject(projectRoot, options = {}) {
  const root = path.resolve(projectRoot);
  const rootStat = await stat(root).catch(() => null);
  if (!rootStat?.isDirectory()) throw new Error(`Project directory does not exist: ${root}`);

  const result = { created: [], skipped: [], packageManager: null, skillsInstalled: 0 };
  const force = Boolean(options.force);
  const agentsTemplate =
    options.agentsTemplate ?? (await readFile(options.agentsTemplatePath ?? defaultAgentsTemplatePath, 'utf8'));

  await writeUnlessExists(path.join(root, 'AGENTS.md'), agentsTemplate, force, result);

  const stylesheet = await detectTailwindStylesheet(root);
  await writeUnlessExists(path.join(root, 'prettier.config.mjs'), prettierConfig(stylesheet), force, result);

  await updatePackageJson(root);

  if (options.installDependencies !== false && (await exists(path.join(root, 'package.json')))) {
    const manager = options.packageManager ?? (await detectPackageManager(root));
    result.packageManager = manager;
    installPrettier(root, manager);
  }

  if (options.installSkills !== false) {
    const installed = await installPersonalSkills(options.skillsDestination);
    result.skillsInstalled = installed.length;
  }

  return result;
}

function parseArgs(argv) {
  const args = { projectRoot: process.cwd(), force: false, installDependencies: true, installSkills: true };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--force') args.force = true;
    else if (arg === '--skip-deps') args.installDependencies = false;
    else if (arg === '--skip-skills') args.installSkills = false;
    else if (arg === '--project' && argv[i + 1]) args.projectRoot = argv[++i];
    else if (!arg.startsWith('-')) args.projectRoot = arg;
    else throw new Error(`Unknown option: ${arg}`);
  }
  return args;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const result = await bootstrapProject(options.projectRoot, options);
  console.log(`Project bootstrap complete: ${path.resolve(options.projectRoot)}`);
  if (result.created.length) console.log(`Created/updated: ${result.created.join(', ')}`);
  if (result.skipped.length) console.log(`Preserved existing: ${result.skipped.join(', ')}`);
  if (result.packageManager) console.log(`Dependencies installed with: ${result.packageManager}`);
  if (result.skillsInstalled) console.log(`Personal skills installed: ${result.skillsInstalled}`);
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
