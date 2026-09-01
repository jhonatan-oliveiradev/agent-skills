#!/usr/bin/env node

import { cp, lstat, mkdir, realpath, rename, rm } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getSkillsRoot, listSkills } from "./lib/skills.mjs";
import { loadValidatedCatalog } from "./validate-catalog.mjs";

const installTargets = new Map([
  ["agents", new Map([
    ["personal", ({ homeDir }) => path.join(homeDir, ".agents", "skills")],
  ])],
  ["claude-code", new Map([
    ["personal", ({ homeDir }) => path.join(homeDir, ".claude", "skills")],
    ["project", ({ cwd }) => path.join(cwd, ".claude", "skills")],
  ])],
]);

export function resolveInstallDestination({
  target = "agents",
  scope = "personal",
  destination,
  homeDir = homedir(),
  cwd = process.cwd(),
} = {}) {
  const scopes = installTargets.get(target);
  if (!scopes) throw new Error(`Unknown install target: ${target}`);

  const resolveScope = scopes.get(scope);
  if (!resolveScope) throw new Error(`Install target ${target} does not support scope ${scope}`);

  if (destination) return path.resolve(destination);
  return path.resolve(resolveScope({ homeDir, cwd }));
}

function isWithin(parent, candidate) {
  const relative = path.relative(parent, candidate);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}

async function resolveCanonicalPath(filePath) {
  const absolute = path.resolve(filePath);
  try {
    return await realpath(absolute);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
    const parent = path.dirname(absolute);
    if (parent === absolute) throw error;
    return path.join(await resolveCanonicalPath(parent), path.basename(absolute));
  }
}

async function pathExists(filePath) {
  try {
    await lstat(filePath);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function validateStagedSkill(staging) {
  const skillFile = path.join(staging, "SKILL.md");
  let stats;
  try {
    stats = await lstat(skillFile);
  } catch (error) {
    if (error?.code === "ENOENT") throw new Error("Staged skill SKILL.md must be a regular file.");
    throw error;
  }
  if (!stats.isFile()) throw new Error("Staged skill SKILL.md must be a regular file.");
}

async function replaceSkill(source, target) {
  const suffix = randomUUID();
  const staging = path.join(path.dirname(target), `.${path.basename(target)}.stage-${suffix}`);
  const backup = path.join(path.dirname(target), `.${path.basename(target)}.backup-${suffix}`);
  let backupCreated = false;

  try {
    await cp(source, staging, { recursive: true, errorOnExist: true, force: false });
    await validateStagedSkill(staging);

    if (await pathExists(target)) {
      await rename(target, backup);
      backupCreated = true;
    }

    try {
      await rename(staging, target);
    } catch (swapError) {
      if (backupCreated) {
        try {
          await rename(backup, target);
          backupCreated = false;
        } catch (restoreError) {
          throw new AggregateError(
            [swapError, restoreError],
            `Failed to install ${path.basename(target)} and restore its previous installation; backup preserved at ${backup}`,
          );
        }
      }
      throw swapError;
    }

    if (backupCreated) {
      await rm(backup, { recursive: true, force: true });
      backupCreated = false;
    }
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}

export function resolveInstallSelection({ availableSkills, packs, names, packNames }) {
  const availableNames = availableSkills.map((skill) => typeof skill === "string" ? skill : skill.name);
  const availableNameSet = new Set(availableNames);
  const explicitNames = [...new Set(names ?? [])].sort();
  const selectedPackNames = [...new Set(packNames ?? [])];

  if (explicitNames.length === 0 && selectedPackNames.length === 0) return availableNames;

  for (const name of explicitNames) {
    if (!availableNameSet.has(name)) throw new Error(`Unknown skill: ${name}`);
  }

  const packsBySlug = new Map(packs.map((pack) => [pack.slug, pack]));
  const selectedPacks = selectedPackNames.map((slug) => {
    const pack = packsBySlug.get(slug);
    if (!pack) throw new Error(`Unknown pack: ${slug}`);
    if (pack.status !== "active") throw new Error(`Pack is not installable: ${slug}`);
    return pack;
  });

  for (const pack of selectedPacks) {
    for (const name of pack.skills) {
      if (!availableNameSet.has(name)) throw new Error(`Unknown skill: ${name}`);
    }
  }

  return [...new Set([
    ...selectedPacks.flatMap((pack) => pack.skills),
    ...explicitNames,
  ])];
}

export async function installSkills({ repoRoot, destination, names, packs }) {
  const available = await listSkills(repoRoot);
  const byName = new Map(available.map((skill) => [skill.name, skill]));
  const catalogPacks = packs?.length ? (await loadValidatedCatalog(repoRoot)).packs : [];
  const selected = resolveInstallSelection({ availableSkills: available, packs: catalogPacks, names, packNames: packs });
  if (available.length === 0) throw new Error("No skill directories found");

  const targetRoot = path.resolve(destination);
  if (targetRoot === path.parse(targetRoot).root) {
    throw new Error("Refusing to install into a filesystem root.");
  }

  const sourceRoot = await realpath(getSkillsRoot(repoRoot));
  const canonicalTargetRoot = await resolveCanonicalPath(targetRoot);
  if (canonicalTargetRoot === path.parse(canonicalTargetRoot).root) {
    throw new Error("Refusing to install into a filesystem root.");
  }
  if (isWithin(sourceRoot, canonicalTargetRoot)) {
    throw new Error("Destination overlaps the source skills directory.");
  }

  const plannedTargets = [];
  for (const name of selected) {
    const target = path.join(targetRoot, name);
    const canonicalTarget = await resolveCanonicalPath(target);
    if (isWithin(sourceRoot, canonicalTarget) || isWithin(canonicalTarget, sourceRoot)) {
      throw new Error(`Target overlaps the source skills directory: ${name}`);
    }
    plannedTargets.push({ source: byName.get(name).directory, target });
  }

  await mkdir(targetRoot, { recursive: true });
  for (const { source, target } of plannedTargets) {
    await replaceSkill(source, target);
  }

  return selected;
}

function parseArgs(argv) {
  const args = {
    target: "agents",
    scope: "personal",
    destination: undefined,
    names: [],
    packs: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--destination" && argv[index + 1]) args.destination = argv[++index];
    else if (argument === "--target" && argv[index + 1]) args.target = argv[++index];
    else if (argument === "--scope" && argv[index + 1]) args.scope = argv[++index];
    else if (argument === "--skill" && argv[index + 1]) args.names.push(argv[++index]);
    else if (argument === "--pack" && argv[index + 1]) args.packs.push(argv[++index]);
    else throw new Error(`Unknown option: ${argument}`);
  }

  args.destination = resolveInstallDestination(args);
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const installed = await installSkills({ repoRoot, ...args });
  for (const name of installed) console.log(`Installed ${name}`);
  console.log(`Skills installed in ${path.resolve(args.destination)}`);
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
